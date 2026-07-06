(function () {
  'use strict';

  var pyodide = null, editor, pyodideReady = false;

  function escapeHtml(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function showError(msg) {
    var el = document.getElementById('resultArea');
    if (!el) return;
    el.innerHTML = '<div class="result-error">' + escapeHtml(msg) + '</div>';
  }

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
      return;
    }
    h += '<div class="result-console"><pre>' + escapeHtml(output) + '</pre></div>';
    el.innerHTML = h;
  }

  function initPyodide() {
    if (typeof loadPyodide === 'undefined') {
      showError('Pyodide library failed to load. Check your internet connection.');
      return;
    }
    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Loading Python...';
    loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
    }).then(function(py) {
      pyodide = py;
      if (statusEl) statusEl.textContent = 'Loading pandas &amp; numpy...';
      return pyodide.loadPackage(['pandas', 'numpy']);
    }).then(function() {
      pyodideReady = true;
      var statusEl = document.getElementById('editorStatus');
      if (statusEl) statusEl.textContent = 'Ready';
      loadProblem();
    }).catch(function(err) {
      showError('Failed to initialize Python: ' + err.message);
    });
  }

  function loadProblem() {
    var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    if (!id) { showError('No problem ID specified.'); return; }

    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Loading problem...';

    fetch('/python-project/problems.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var problem = data.problems.find(function(p) { return p.id === id; });
        if (!problem) { showError('Problem #' + id + ' not found.'); return; }
        window.__currentProblem = problem;
        renderProblem(problem);
      })
      .catch(function(err) {
        showError('Failed to load problem data: ' + err.message);
      });
  }

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
      // Redirect stdout
      pyodide.runPython(`
import io, sys
__stdout = io.StringIO()
sys.stdout = __stdout
      `);

      // Run user code
      pyodide.runPython(fullCode);

      // Capture and restore stdout
      var output = pyodide.runPython(`
sys.stdout = sys.__stdout__
__result = __stdout.getvalue()
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

  function toggle(trigger, target, expandedLabel, collapsedLabel) {
    var hidden = target.hasAttribute('hidden');
    if (hidden) {
      target.removeAttribute('hidden');
      trigger.setAttribute('aria-expanded', 'true');
      if (expandedLabel) trigger.textContent = expandedLabel;
    } else {
      target.setAttribute('hidden', '');
      trigger.setAttribute('aria-expanded', 'false');
      if (collapsedLabel) trigger.textContent = collapsedLabel;
    }
  }

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
      editor = CodeMirror(document.getElementById('editorContainer'), {
        value: '',
        mode: 'text/x-python',
        theme: 'default',
        lineNumbers: true,
        indentWithTabs: false,
        smartIndent: true,
        lineWrapping: true,
        extraKeys: { 'Ctrl-Enter': runPython, 'Cmd-Enter': runPython }
      });
    } else {
      var ta = document.createElement('textarea');
      ta.style.cssText = 'width:100%;height:120px;padding:10px;font-family:monospace;font-size:14px;border:none;resize:vertical;';
      document.getElementById('editorContainer').appendChild(ta);
      editor = ta;
    }

    document.getElementById('runBtn').addEventListener('click', runPython);
    document.getElementById('resetBtn').addEventListener('click', resetCode);

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

    var copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var code = document.getElementById('solutionSQL').textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = 'Copy Code'; }, 2000);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = code;
          ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy Code'; }, 2000);
        }
      });
    }

    var markBtn = document.getElementById('markSolvedBtn');
    if (markBtn) {
      var solved = {};
      try { var st = localStorage.getItem('pythonSolved'); if (st) solved = JSON.parse(st); } catch(e) {}
      if (solved[problem.id]) { markBtn.textContent = '\u2713 Solved'; markBtn.classList.add('completed'); }
      markBtn.addEventListener('click', function () {
        try {
          var s = {};
          var st = localStorage.getItem('pythonSolved'); if (st) s = JSON.parse(st);
          if (s[problem.id]) {
            delete s[problem.id];
            markBtn.textContent = 'Mark Solved';
            markBtn.classList.remove('completed');
          } else {
            s[problem.id] = true;
            markBtn.textContent = '\u2713 Solved';
            markBtn.classList.add('completed');
          }
          localStorage.setItem('pythonSolved', JSON.stringify(s));
        } catch(e) {}
      });
    }

    document.title = '#' + problem.id + ' ' + problem.title + ' | Python Project';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPythonProject);
  } else {
    window.initPythonProject();
  }

})();
