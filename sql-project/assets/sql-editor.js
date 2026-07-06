(function () {
  'use strict';

  var SQL, db, editor;

  function escapeHtml(v) {
    if (v === null || v === undefined) return 'NULL';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatValue(v) {
    if (v === null || v === undefined) return '<span class="null-value">NULL</span>';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    return escapeHtml(v);
  }

  function showError(msg) {
    var el = document.getElementById('resultArea');
    if (!el) return;
    el.innerHTML = '<div class="result-error">' + escapeHtml(msg) + '</div>';
  }

  function showResult(columns, rows) {
    var el = document.getElementById('resultArea');
    if (!el) return;
    if (!rows || rows.length === 0) {
      el.innerHTML = '<div class="result-empty">Query executed successfully. No rows returned.</div>';
      return;
    }
    var h = '<table class="data-table"><thead><tr>';
    columns.forEach(function (c) { h += '<th>' + escapeHtml(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr>';
      r.forEach(function (v) { h += '<td>' + formatValue(v) + '</td>'; });
      h += '</tr>';
    });
    h += '</tbody></table>';
    h += '<div class="result-info">' + rows.length + ' row' + (rows.length !== 1 ? 's' : '') + ' returned</div>';
    el.innerHTML = h;
  }

  function padCol(v, len) {
    v = v === null ? 'NULL' : String(v);
    while (v.length < len) v += ' ';
    return v;
  }

  function renderAsciiTable(columns, rows) {
    var colW = columns.map(function(c, i) {
      var max = c.length;
      rows.forEach(function(r) {
        var v = r[i] === null || r[i] === undefined ? 'NULL' : String(r[i]);
        if (v.length > max) max = v.length;
      });
      return max;
    });
    var line = '+';
    colW.forEach(function(w) { line += '-'.repeat(w + 2) + '+'; });
    var h = line + '\n|';
    columns.forEach(function(c, i) { h += ' ' + padCol(c, colW[i]) + ' |'; });
    h += '\n' + line;
    rows.forEach(function(r) {
      h += '\n|';
      r.forEach(function(v, i) { h += ' ' + padCol(v, colW[i]) + ' |'; });
    });
    h += '\n' + line;
    return h;
  }

  function renderSchemaAscii(tables, masterSchema) {
    var lines = [];
    tables.forEach(function(tName) {
      var tDef = masterSchema[tName];
      if (!tDef) return;
      var cols = tDef.columns;
      var colW = 10;
      var typeW = 8;
      cols.forEach(function(c) {
        if (c.name.length > colW) colW = c.name.length;
        if (c.type.length > typeW) typeW = c.type.length;
      });
      var sep = '+' + '-'.repeat(colW + 2) + '+' + '-'.repeat(typeW + 2) + '+';
      lines.push(sep);
      lines.push('| ' + padCol('Column Name', colW) + ' | ' + padCol('Type', typeW) + ' |');
      lines.push(sep);
      cols.forEach(function(c) {
        lines.push('| ' + padCol(c.name, colW) + ' | ' + padCol(c.type, typeW) + ' |');
      });
      lines.push(sep);
      lines.push(tName + ' contains one row per ' + tName.slice(0, -1) + '.');
      lines.push(tName.slice(0, -1) + '_id is the primary key for this table.');
    });
    return lines.join('\n');
  }

  function getSampleData(problem) {
    if (!db) return {};
    var result = {};
    problem.tables.forEach(function(tName) {
      try {
        var r = db.exec('SELECT * FROM ' + tName + ' LIMIT 5');
        if (r && r.length > 0) result[tName] = { columns: r[0].columns, rows: r[0].values };
      } catch(e) {}
    });
    return result;
  }

  function initDB(problem) {
    if (!problem) return;
    db.run('PRAGMA foreign_keys = OFF');
    var schema = problem.schema || '';
    if (schema) {
      var stmts = schema.split(';').filter(Boolean);
      stmts.forEach(function (s) {
        try { db.run(s.trim() + ';'); } catch (e) {}
      });
    }
    var data = problem.sample_data || {};
    Object.keys(data).forEach(function (table) {
      var insertSQL = data[table];
      if (insertSQL) {
        try { db.run(insertSQL); } catch (e) {
          console.warn('Insert error for ' + table + ':', e.message);
        }
      }
    });
    db.run('PRAGMA foreign_keys = ON');
  }

  function runQuery() {
    if (!db || !editor) return;
    var sql = editor.getValue().trim();
    if (!sql) { showError('Please enter a SQL query.'); return; }
    var runBtn = document.getElementById('runBtn');
    var statusEl = document.getElementById('editorStatus');
    if (runBtn) runBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Running...';
    try {
      var results = db.exec(sql);
      if (results && results.length > 0) {
        var r = results[0];
        showResult(r.columns, r.values);
      } else {
        showResult([], []);
      }
    } catch (e) {
      showError(e.message);
    }
    if (runBtn) runBtn.disabled = false;
    if (statusEl) statusEl.textContent = 'Ready';
  }

  function resetDB() {
    if (!db) return;
    try { db.close(); } catch (e) {}
    db = new SQL.Database();
    var problem = window.__currentProblem;
    if (problem) initDB(problem);
    showResult([], []);
    var statusEl = document.getElementById('editorStatus');
    if (statusEl) statusEl.textContent = 'Reset';
    setTimeout(function () { if (statusEl) statusEl.textContent = 'Ready'; }, 800);
  }

  window.initSQLProject = function () {
    if (typeof initSqlJs === 'undefined') {
      showError('SQL.js library failed to load. Check your internet connection.');
      return;
    }
    initSqlJs({
      locateFile: function (file) { return 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/' + file; }
    }).then(function (SQLlib) {
      SQL = SQLlib;
      db = new SQL.Database();

      var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
      if (!id) { showError('No problem ID specified.'); return; }

      var statusEl = document.getElementById('editorStatus');
      if (statusEl) statusEl.textContent = 'Loading...';

      fetch('/sql-project/problems.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var problem = data.problems.find(function (p) { return p.id === id; });
          if (!problem) { showError('Problem #' + id + ' not found.'); return; }
          window.__currentProblem = problem;
          initDB(problem);
          renderProblem(problem, data.schema);
          if (statusEl) statusEl.textContent = 'Ready';
        })
        .catch(function (err) {
          showError('Failed to load problem data: ' + err.message);
        });
    }).catch(function (err) {
      showError('Failed to initialize SQL engine: ' + err.message);
    });
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

  function renderProblem(problem, masterSchema) {
    document.getElementById('problemTitle').textContent = problem.id + '. ' + problem.title;

    var diffEl = document.getElementById('problemDifficulty');
    diffEl.textContent = problem.difficulty;
    diffEl.className = 'badge ' + problem.difficulty.toLowerCase();

    document.getElementById('problemTables').textContent = problem.tables.join(', ');

    document.getElementById('problemDescription').textContent = problem.description;

    document.getElementById('schemaDisplay').innerHTML = '<pre>' + escapeHtml(renderSchemaAscii(problem.tables, masterSchema)) + '</pre>';

    var hintEl = document.getElementById('hintText');
    if (problem.hint) {
      hintEl.innerHTML = '<strong>Tip:</strong> ' + escapeHtml(problem.hint);
    } else {
      hintEl.style.display = 'none';
    }

    var sampleData = getSampleData(problem);
    var sampleLines = [];
    problem.tables.forEach(function(tName) {
      if (sampleData[tName]) {
        sampleLines.push(tName + ' table:');
        sampleLines.push(renderAsciiTable(sampleData[tName].columns, sampleData[tName].rows));
      }
    });
    document.getElementById('sampleDataDisplay').innerHTML = '<pre>' + escapeHtml(sampleLines.join('\n')) + '</pre>';

    var exp = problem.expected_output;
    if (exp && exp.columns && exp.rows) {
      document.getElementById('expectedOutputDisplay').innerHTML = '<pre>Output:\n' + escapeHtml(renderAsciiTable(exp.columns, exp.rows)) + '</pre>';
    }

    if (problem.explanation) {
      document.getElementById('explanationText').textContent = problem.explanation;
    }

    if (problem.solution) {
      document.getElementById('solutionSQL').textContent = problem.solution;
    }

    if (typeof CodeMirror !== 'undefined') {
      editor = CodeMirror(document.getElementById('editorContainer'), {
        value: 'SELECT * FROM ' + (problem.tables[0] || '') + ';',
        mode: 'text/x-sql',
        theme: 'default',
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
        lineWrapping: true,
        extraKeys: { 'Ctrl-Enter': runQuery, 'Cmd-Enter': runQuery }
      });
    } else {
      var ta = document.createElement('textarea');
      ta.style.cssText = 'width:100%;height:120px;padding:10px;font-family:monospace;font-size:14px;border:none;resize:vertical;';
      ta.value = 'SELECT * FROM ' + (problem.tables[0] || '') + ';';
      document.getElementById('editorContainer').appendChild(ta);
      editor = ta;
    }

    document.getElementById('runBtn').addEventListener('click', runQuery);
    document.getElementById('resetBtn').addEventListener('click', resetDB);

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
      try { var st = localStorage.getItem('sqlSolved'); if (st) solved = JSON.parse(st); } catch(e) {}
      if (solved[problem.id]) { markBtn.textContent = '\u2713 Solved'; markBtn.classList.add('completed'); }
      markBtn.addEventListener('click', function () {
        try {
          var s = {};
          var st = localStorage.getItem('sqlSolved'); if (st) s = JSON.parse(st);
          if (s[problem.id]) {
            delete s[problem.id];
            markBtn.textContent = 'Mark Solved';
            markBtn.classList.remove('completed');
          } else {
            s[problem.id] = true;
            markBtn.textContent = '\u2713 Solved';
            markBtn.classList.add('completed');
          }
          localStorage.setItem('sqlSolved', JSON.stringify(s));
        } catch(e) {}
      });
    }

    document.title = '#' + problem.id + ' ' + problem.title + ' | SQL Project';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initSQLProject);
  } else {
    window.initSQLProject();
  }

})();
