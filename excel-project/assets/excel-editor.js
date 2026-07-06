(function () {
  'use strict';

  var hf, sheetId, editor;
  var HYPERFORMULA_LIB = typeof HyperFormula !== 'undefined' ? HyperFormula : null;

  var _ = __shared;
  var escapeHtml = _.escapeHtml;
  var showError = _.showError;

  function showResult(value, valid) {
    var el = document.getElementById('resultArea');
    if (!el) return;
    var h = '';
    if (valid === true) {
      h += '<div class="validation-badge valid"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct!</div>';
    } else if (valid === false) {
      h += '<div class="validation-badge invalid"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Incorrect — result doesn\'t match expected</div>';
    }
    if (value === null || value === undefined) {
      el.innerHTML = h + '<div class="result-empty">Formula evaluated to an empty result.</div>';
      return;
    }
    var display = typeof value === 'string' ? '"' + escapeHtml(value) + '"' : escapeHtml(String(value));
    h += '<div class="result-value">Result: <strong>' + display + '</strong></div>';
    el.innerHTML = h;
  }

  function formatCellRef(col, row) {
    var letter = String.fromCharCode(65 + col);
    return letter + (row + 1);
  }

  function colLetter(i) {
    var l = '';
    while (i >= 0) {
      l = String.fromCharCode(65 + (i % 26)) + l;
      i = Math.floor(i / 26) - 1;
    }
    return l;
  }

  function renderDataGrid(cellData) {
    if (!cellData || Object.keys(cellData).length === 0) return '<div class="result-empty">No data.</div>';
    var maxRow = 0, maxCol = 0;
    var grid = {};
    Object.keys(cellData).forEach(function(ref) {
      var m = ref.match(/^([A-Z]+)(\d+)$/);
      if (!m) return;
      var col = 0;
      for (var i = 0; i < m[1].length; i++) {
        col = col * 26 + (m[1].charCodeAt(i) - 64);
      }
      col--;
      var row = parseInt(m[2], 10) - 1;
      if (row > maxRow) maxRow = row;
      if (col > maxCol) maxCol = col;
      if (!grid[row]) grid[row] = {};
      grid[row][col] = cellData[ref];
    });
    var h = '<table class="data-table data-grid">';
    h += '<thead><tr><th class="grid-corner"></th>';
    for (var c = 0; c <= maxCol; c++) {
      h += '<th>' + colLetter(c) + '</th>';
    }
    h += '</tr></thead><tbody>';
    for (var r = 0; r <= maxRow; r++) {
      h += '<tr><th class="grid-row-header">' + (r + 1) + '</th>';
      for (var c2 = 0; c2 <= maxCol; c2++) {
        var val = grid[r] && grid[r][c2] !== undefined ? grid[r][c2] : '';
        h += '<td>' + escapeHtml(String(val)) + '</td>';
      }
      h += '</tr>';
    }
    h += '</tbody></table>';
    return h;
  }

  var hfRebuild = function () {
    if (!hf) return;
    if (typeof hf.rebuildAndRecalculate === 'function') hf.rebuildAndRecalculate();
    else if (typeof hf.rebuild === 'function') hf.rebuild();
  };

  function initHF(problem) {
    if (!HYPERFORMULA_LIB) { showError('HyperFormula library not loaded.'); return false; }
    hf = HYPERFORMULA_LIB.buildEmpty({ licenseKey: 'gpl-v3' });
    hf.addSheet('Sheet1');
    sheetId = 0;
    var cellData = problem.cell_data || {};
    Object.keys(cellData).forEach(function(ref) {
      var m = ref.match(/^([A-Z]+)(\d+)$/);
      if (!m) return;
      var col = 0;
      for (var i = 0; i < m[1].length; i++) {
        col = col * 26 + (m[1].charCodeAt(i) - 64);
      }
      col--;
      var row = parseInt(m[2], 10) - 1;
      try {
        hf.setCellContents({ sheet: sheetId, row: row, col: col }, cellData[ref]);
      } catch(e) {}
    });
    return true;
  }

  function evaluateFormula(formula, resultCell) {
    if (!hf) return null;
    var m = resultCell.match(/^([A-Z]+)(\d+)$/);
    if (!m) return null;
    var col = 0;
    for (var i = 0; i < m[1].length; i++) {
      col = col * 26 + (m[1].charCodeAt(i) - 64);
    }
    col--;
    var row = parseInt(m[2], 10) - 1;
    try {
      hf.setCellContents({ sheet: sheetId, row: row, col: col }, formula);
      hfRebuild();
      var val = hf.getCellValue({ sheet: sheetId, row: row, col: col });
      if (val === undefined || val === null) return null;
      if (typeof val === 'object' && val !== null) {
        if (val.value !== undefined) return val.value;
        return String(val);
      }
      return val;
    } catch(e) {
      return null;
    }
  }

  function runFormula() {
    if (!hf || !editor) return;
    var formula = editor.getValue().trim();
    if (!formula) { showError('Please enter a formula.'); return; }
    if (formula.charAt(0) !== '=') formula = '=' + formula;
    formula = formula.replace(/\bFALSE\b/g, '0').replace(/\bTRUE\b/g, '1');
    var runBtn = document.getElementById('runBtn');
    var statusEl = document.getElementById('editorStatus');
    if (runBtn) runBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Evaluating...';
    try {
      var problem = window.__currentProblem;
      var result = evaluateFormula(formula, problem.result_cell);
      var expected = problem.expected_value;
      var expectedType = problem.expected_type || 'number';
      var valid = undefined;
      if (result !== null && result !== undefined) {
        if (expectedType === 'number') {
          valid = Math.abs(Number(result) - Number(expected)) < 0.001;
        } else if (expectedType === 'string') {
          valid = String(result).toLowerCase() === String(expected).toLowerCase();
        } else if (expectedType === 'boolean') {
          valid = Boolean(result) === Boolean(expected);
        } else if (expectedType === 'date') {
          valid = String(result) === String(expected);
        } else {
          valid = String(result) === String(expected);
        }
      } else {
        valid = (expected === null || expected === undefined);
      }
      showResult(result, valid);
      if (valid === true) {
        var markBtn = document.getElementById('markSolvedBtn');
        if (markBtn && markBtn.textContent !== '\u2713 Solved') {
          markBtn.click();
        }
      }
    } catch (e) {
      showError('Formula error: ' + e.message);
    }
    if (runBtn) runBtn.disabled = false;
    if (statusEl) statusEl.textContent = 'Ready';
  }

  function resetFormula() {
    if (!hf) return;
    var problem = window.__currentProblem;
    if (problem) initHF(problem);
    showResult(null, undefined);
    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Reset';
    setTimeout(function () { if (statusEl) statusEl.textContent = 'Ready'; }, 800);
  }

  window.initExcelProject = function () {
    if (!HYPERFORMULA_LIB) {
      showError('HyperFormula library failed to load. Check your internet connection.');
      return;
    }

    var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    if (!id) { showError('No problem ID specified.'); return; }

    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Loading...';

    _.fetchJson('/excel-project/problems.json')
      .then(function (data) {
        var problem = data.problems.find(function (p) { return p.id === id; });
        if (!problem) { showError('Problem #' + id + ' not found.'); return; }
        window.__currentProblem = problem;
        initHF(problem);
        renderProblem(problem);
        if (statusEl) statusEl.textContent = 'Ready';
      })
      .catch(function (err) {
        showError('Failed to load problem data: ' + err.message);
      });
  };

  var toggle = _.toggle;

  function renderProblem(problem) {
    document.getElementById('problemTitle').textContent = problem.id + '. ' + problem.title;

    var diffEl = document.getElementById('problemDifficulty');
    diffEl.textContent = problem.difficulty;
    diffEl.className = 'badge ' + problem.difficulty.toLowerCase();

    document.getElementById('problemDescription').textContent = problem.description;

    document.getElementById('dataGridWrap').innerHTML = renderDataGrid(problem.cell_data);

    var hintEl = document.getElementById('hintText');
    if (problem.hint) {
      hintEl.innerHTML = '<strong>Tip:</strong> ' + escapeHtml(problem.hint);
    } else {
      hintEl.style.display = 'none';
    }

    var exp = problem.expected_value;
    var expDisplay = exp !== null && exp !== undefined ? String(exp) : 'Empty';
    var expType = problem.expected_type || 'number';
    if (expType === 'string') expDisplay = '"' + escapeHtml(String(exp)) + '"';
    else if (expType === 'date') expDisplay = String(exp);
    document.getElementById('expectedOutputDisplay').innerHTML = '<pre>Expected Result: ' + escapeHtml(expDisplay) + '</pre>';

    if (problem.explanation) {
      document.getElementById('explanationText').textContent = problem.explanation;
    }

    if (problem.solution) {
      document.getElementById('solutionSQL').textContent = problem.solution;
    }

    if (typeof CodeMirror !== 'undefined') {
      if (_.getCodeTheme() === 'material') _.loadCodeThemeCSS();
      editor = CodeMirror(document.getElementById('editorContainer'), {
        value: problem.default_formula || '',
        mode: null,
        theme: _.getCodeTheme(),
        lineNumbers: false,
        indentWithTabs: false,
        smartIndent: false,
        lineWrapping: true,
        extraKeys: { 'Ctrl-Enter': runFormula, 'Cmd-Enter': runFormula }
      });
      _.registerEditor(editor);
    } else {
      var ta = document.createElement('textarea');
      ta.style.cssText = 'width:100%;height:40px;padding:10px;font-family:monospace;font-size:14px;border:none;resize:vertical;';
      ta.value = problem.default_formula || '';
      document.getElementById('editorContainer').appendChild(ta);
      editor = ta;
    }

    document.getElementById('runBtn').addEventListener('click', runFormula);
    document.getElementById('resetBtn').addEventListener('click', resetFormula);

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

    _.setupSolvedBtn('excelSolved', problem.id);

    document.title = '#' + problem.id + ' ' + problem.title + ' | Excel Project';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initExcelProject);
  } else {
    window.initExcelProject();
  }

})();
