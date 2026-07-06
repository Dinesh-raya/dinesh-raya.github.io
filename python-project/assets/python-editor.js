(function () {
  'use strict';

  var pyodide = null, editor, pyodideReady = false;

  var _ = __shared;
  var escapeHtml = _.escapeHtml;
  var showError = _.showError;

  function showResult(output, valid) {
    var el = document.getElementById('resultArea');
    if (!el) return;
    var h = '';
    if (valid === true) {
      h += '<div class="validation-badge valid"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct!</div>';
    } else if (valid === false) {
      h += '<div class="validation-badge invalid"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Incorrect — output doesn\'t match expected</div>';
    }
    if (!output && output !== 0) {
      el.innerHTML = h + '<div class="result-empty">Code executed successfully. No output.</div>';
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    var outputStr = String(output);
    if (outputStr.indexOf('<img') !== -1) {
      h += '<div class="result-console">' + outputStr + '</div>';
    } else {
      h += '<div class="result-console"><pre>' + escapeHtml(outputStr) + '</pre></div>';
    }
    h += '<button class="copy-result-btn">Copy Result</button>';
    el.innerHTML = h;
    var copyBtn = el.querySelector('.copy-result-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        _.copyText(outputStr.replace(/<[^>]+>/g, ''), copyBtn);
      });
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function initPyodide() {
    if (typeof loadPyodide === 'undefined') {
      showError('Pyodide library failed to load. Check your internet connection.');
      return;
    }
    var el = document.getElementById('resultArea');
    if (el) el.innerHTML = '<div class="result-loading"><div class="spinner"></div><span>Starting Python environment...</span></div>';
    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Starting Python...';
    loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
      packages: ['pandas', 'numpy']
    }).then(function(py) {
      pyodide = py;
      pyodideReady = true;
      if (statusEl) statusEl.textContent = 'Ready';
      if (el) el.innerHTML = '<div class="result-empty">Click "Run" to execute the Python code and see output.</div>';
      loadProblem();
    }).catch(function(err) {
      console.error('Pyodide init failed:', err);
      showError('Failed to initialize Python. Try refreshing the page.');
    });
  }

  function loadProblem() {
    var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    if (!id) { showError('No problem ID specified.'); return; }

    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Loading problem...';

    _.fetchJson('/python-project/problems.json')
      .then(function(data) {
        var problem = data.problems.find(function(p) { return p.id === id; });
        if (!problem) { showError('Problem #' + id + ' not found.'); return; }
        window.__currentProblem = problem;
        _.saveCardTemplate();
        renderProblem(problem);
        document.getElementById('runBtn').addEventListener('click', runPython);
        document.getElementById('resetBtn').addEventListener('click', resetCode);
      })
      .catch(function(err) {
        showError('Failed to load problem data: ' + err.message);
      });
  }

  window.switchProblem = function(id, problem) {
    var qCard = document.querySelector('.q-card-inner');
    if (qCard) qCard.classList.add('loading');
    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Loading...';
    _.resetCard();
    if (editor) { editor.toTextArea(); editor = null; }
    window.__currentProblem = problem;
    renderProblem(problem);
    if (qCard) qCard.classList.remove('loading');
    if (statusEl) statusEl.textContent = 'Ready';
  };

  function runPython() {
    if (!pyodide || !editor) return;
    if (!pyodideReady) { showError('Python is still loading. Please wait.'); return; }
    var code = editor.getValue().trim();
    if (!code) { showError('Please enter Python code.'); return; }
    var problem = window.__currentProblem;
    var setupCode = (problem && problem.setup_code) || '';
    var fullCode = setupCode ? setupCode + '\n' + code : code;

    var runBtn = document.getElementById('runBtn');
    var statusEl = document.getElementById('editorStatus');
    if (runBtn) runBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Running...';

    try {
      // Setup stdout + matplotlib capture
      pyodide.runPython(`
import io, sys, base64, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
__stdout = io.StringIO()
sys.stdout = __stdout
__fig_n = 0
def __save_plot():
    global __fig_n
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100)
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode()
    plt.close()
    __fig_n += 1
    sys.__stdout__.write('<img style="max-width:100%;margin:8px 0" src="data:image/png;base64,' + b64 + '">\\n')
      `);

      // Patch plt.show to auto-capture
      pyodide.runPython("plt.show = __save_plot");

      // Run user code
      pyodide.runPython(fullCode);

      // Capture any remaining open figures
      pyodide.runPython("if plt.get_fignums(): __save_plot()");

      // Capture and restore stdout
      var output = pyodide.runPython(`
sys.stdout = sys.__stdout__
__stdout.getvalue()
      `);

      var captured = String(output || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      var expected = problem.expected_output || '';
      var valid = undefined;
      if (expected !== undefined && expected !== null) {
        var trimOut = captured.replace(/\s+$/, '');
        var trimExp = expected.replace(/\s+$/, '');
        valid = trimOut === trimExp;
      }
      showResult(captured, valid);
      if (valid === true) {
        var markBtn = document.getElementById('markSolvedBtn');
        if (markBtn && markBtn.textContent !== '\u2713 Solved') {
          markBtn.click();
        }
      }
    } catch (e) {
      showError('Python error:\n' + String(e.message || e));
    }
    if (runBtn) runBtn.disabled = false;
    if (statusEl) statusEl.textContent = 'Ready';
  }

  function resetCode() {
    var problem = window.__currentProblem;
    if (problem && editor) {
      editor.setValue('');
    }
    showResult('', undefined);
  }

  window.initPythonProject = function () {
    initPyodide();
  };

  var toggle = _.toggle;

  function renderProblem(problem) {
    document.getElementById('problemTitle').textContent = problem.id + '. ' + problem.title;

    var diffEl = document.getElementById('problemDifficulty');
    diffEl.textContent = problem.difficulty;
    diffEl.className = 'badge ' + problem.difficulty.toLowerCase();

    document.getElementById('problemDescription').textContent = problem.description;

    var setupBox = document.getElementById('setupBox');
    var setupCodeEl = document.getElementById('setupCodeDisplay');
    if (problem.setup_code) {
      setupBox.style.display = '';
      setupCodeEl.textContent = problem.setup_code;
    } else {
      setupBox.style.display = 'none';
    }

    var hintEl = document.getElementById('hintText');
    if (problem.hint) {
      hintEl.innerHTML = '<strong>Tip:</strong> ' + escapeHtml(problem.hint);
    } else {
      hintEl.style.display = 'none';
    }

    var exp = problem.expected_output;
    document.getElementById('expectedOutputDisplay').innerHTML = '<pre>' + escapeHtml(exp || '(empty)') + '</pre>';

    if (problem.explanation) {
      document.getElementById('explanationText').textContent = problem.explanation;
    }

    if (problem.solution) {
      document.getElementById('solutionSQL').textContent = problem.solution;
    }

    if (typeof CodeMirror !== 'undefined') {
      if (_.getCodeTheme() === 'material') _.loadCodeThemeCSS();
      editor = CodeMirror(document.getElementById('editorContainer'), {
        value: '',
        mode: 'text/x-python',
        theme: _.getCodeTheme(),
        lineNumbers: true,
        indentWithTabs: false,
        smartIndent: true,
        lineWrapping: true,
        extraKeys: { 'Ctrl-Enter': runPython, 'Cmd-Enter': runPython }
      });
      _.registerEditor(editor);
    } else {
      var ta = document.createElement('textarea');
      ta.style.cssText = 'width:100%;height:120px;padding:10px;font-family:monospace;font-size:14px;border:none;resize:vertical;';
      document.getElementById('editorContainer').appendChild(ta);
      editor = ta;
    }

    var hintToggle = document.getElementById('hintToggle');
    var hintContent = document.getElementById('hintContent');
    hintToggle.addEventListener('click', function () {
      toggle(hintToggle, hintContent, null, null);
      hintToggle.classList.toggle('open', !hintContent.hasAttribute('hidden'));
    });

    var solutionBtn = document.getElementById('toggleSolution');
    var solutionBox = document.getElementById('solutionBox');
    solutionBtn.addEventListener('click', function () {
      var hidden = !solutionBox.hasAttribute('hidden');
      toggle(solutionBtn, solutionBox, 'Hide Solution', 'Solution');
      solutionBtn.classList.toggle('hide', !hidden);
    });

    _.setupCopyBtn();

    _.setupSolvedBtn('python', problem.id);

    document.title = '#' + problem.id + ' ' + problem.title + ' | Python Project';
    var ld = document.getElementById('problemLd');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'problemLd';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      'name': '#' + problem.id + ' ' + problem.title,
      'description': (problem.description || '').substring(0, 300),
      'educationalLevel': problem.difficulty,
      'teaches': 'Python',
      'audience': { '@type': 'Audience', 'audienceType': 'Data Analyst' }
    });
    _.showPlaceholder();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPythonProject);
  } else {
    window.initPythonProject();
  }

})();
