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
    var h = '<div class="result-container"><table class="data-table"><thead><tr>';
    columns.forEach(function (c) { h += '<th>' + escapeHtml(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr>';
      r.forEach(function (v) { h += '<td>' + formatValue(v) + '</td>'; });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    h += '<div class="result-info">' + rows.length + ' row' + (rows.length !== 1 ? 's' : '') + ' returned</div>';
    el.innerHTML = h;
  }

  function renderSampleData(tables) {
    if (!db) return;
    var el = document.getElementById('sampleData');
    if (!el) return;
    var html = '';
    tables.forEach(function (tName) {
      try {
        var result = db.exec('SELECT * FROM ' + tName + ' LIMIT 5');
        if (result && result.length > 0) {
          var r = result[0];
          html += '<div style="margin-bottom:10px"><strong>' + escapeHtml(tName) + '</strong> <span style="font-size:0.8em;color:var(--text-muted)">(showing ' + Math.min(r.values.length, 5) + ' rows)</span></div>';
          html += '<table class="data-table"><thead><tr>';
          r.columns.forEach(function (c) { html += '<th>' + escapeHtml(c) + '</th>'; });
          html += '</tr></thead><tbody>';
          r.values.slice(0, 5).forEach(function (row) {
            html += '<tr>';
            row.forEach(function (v) { html += '<td>' + formatValue(v) + '</td>'; });
            html += '</tr>';
          });
          html += '</tbody></table>';
        }
      } catch(e) {}
    });
    el.innerHTML = html || '<div class="result-empty">No sample data available.</div>';
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
    renderSampleData(problem.tables);
  }

  function runQuery() {
    if (!db || !editor) return;
    var sql = editor.getValue().trim();
    if (!sql) { showError('Please enter a SQL query.'); return; }
    var runBtn = document.querySelector('.run-btn');
    var statusEl = document.querySelector('.editor-status');
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
    var statusEl = document.querySelector('.editor-status');
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

      var statusEl = document.querySelector('.editor-status');
      if (statusEl) statusEl.textContent = 'Loading...';

      fetch('/sql-project/problems.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var problem = data.problems.find(function (p) { return p.id === id; });
          if (!problem) { showError('Problem #' + id + ' not found.'); return; }
          window.__currentProblem = problem;
          renderProblem(problem, data.schema);
          initDB(problem);
          if (statusEl) statusEl.textContent = 'Ready';
        })
        .catch(function (err) {
          showError('Failed to load problem data: ' + err.message);
        });
    }).catch(function (err) {
      showError('Failed to initialize SQL engine: ' + err.message);
    });
  };

  function renderProblem(problem, masterSchema) {
    document.getElementById('problemNumber').textContent = '#' + problem.id;
    document.getElementById('problemTitle').textContent = problem.title;
    var diffEl = document.getElementById('problemDifficulty');
    diffEl.textContent = problem.difficulty;
    diffEl.className = 'difficulty ' + problem.difficulty.toLowerCase();
    document.getElementById('problemDescription').textContent = problem.description;

    document.getElementById('problemTopics').textContent = problem.topics.join(', ');

    var tablesList = document.getElementById('problemTables');
    tablesList.textContent = problem.tables.join(', ');

    var backLink = document.getElementById('backLink');
    if (backLink) backLink.href = '/sql-project/';

    // Render schema
    var schemaHtml = '';
    problem.tables.forEach(function (tName) {
      var tDef = masterSchema[tName];
      if (!tDef) return;
      schemaHtml += '<div style="margin-bottom:8px"><strong>' + escapeHtml(tName) + '</strong></div>';
      schemaHtml += '<table class="schema-table"><thead><tr><th>Column</th><th>Type</th></tr></thead><tbody>';
      tDef.columns.forEach(function (col) {
        schemaHtml += '<tr><td>' + escapeHtml(col.name) + '</td><td>' + escapeHtml(col.type) + '</td></tr>';
      });
      schemaHtml += '</tbody></table>';
    });
    document.getElementById('schemaDisplay').innerHTML = schemaHtml;

    // Render expected output
    var exp = problem.expected_output;
    if (exp && exp.columns && exp.rows) {
      var eHtml = '<table class="data-table"><thead><tr>';
      exp.columns.forEach(function (c) { eHtml += '<th>' + escapeHtml(c) + '</th>'; });
      eHtml += '</tr></thead><tbody>';
      exp.rows.forEach(function (r) {
        eHtml += '<tr>';
        r.forEach(function (v) { eHtml += '<td>' + formatValue(v) + '</td>'; });
        eHtml += '</tr>';
      });
      eHtml += '</tbody></table>';
      document.getElementById('expectedOutput').innerHTML = eHtml;
    }

    // Hint
    if (problem.hint) {
      document.getElementById('hintText').textContent = problem.hint;
    }

    // Solution
    if (problem.solution) {
      document.getElementById('solutionSQL').textContent = problem.solution;
    }
    if (problem.explanation) {
      document.getElementById('solutionExplanation').textContent = problem.explanation;
    }

    // Init CodeMirror
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
      ta.style.width = '100%';
      ta.style.height = '120px';
      ta.style.padding = '10px';
      ta.style.fontFamily = 'monospace';
      ta.style.fontSize = '14px';
      ta.style.border = 'none';
      ta.style.resize = 'vertical';
      ta.value = 'SELECT * FROM ' + (problem.tables[0] || '') + ';';
      document.getElementById('editorContainer').appendChild(ta);
      editor = ta;
    }

    // Event listeners
    var runBtn = document.querySelector('.run-btn');
    if (runBtn) runBtn.addEventListener('click', runQuery);

    var resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetDB);

    var toggleHintBtn = document.getElementById('toggleHint');
    var hintBox = document.getElementById('hintBox');
    if (toggleHintBtn && hintBox) {
      toggleHintBtn.addEventListener('click', function () {
        var hidden = hintBox.style.display === 'none';
        hintBox.style.display = hidden ? 'block' : 'none';
        toggleHintBtn.textContent = hidden ? 'Hide Hint' : 'Show Hint';
      });
    }

    var toggleSolutionBtn = document.getElementById('toggleSolution');
    var solutionBox = document.getElementById('solutionBox');
    if (toggleSolutionBtn && solutionBox) {
      toggleSolutionBtn.addEventListener('click', function () {
        var hidden = solutionBox.style.display === 'none';
        solutionBox.style.display = hidden ? 'block' : 'none';
        toggleSolutionBtn.textContent = hidden ? 'Hide Solution' : 'Show Solution';
      });
    }

    var markBtn = document.getElementById('markSolvedBtn');
    if (markBtn) {
      var solved = {};
      try { var st = localStorage.getItem('sqlSolved'); if (st) solved = JSON.parse(st); } catch(e) {}
      if (solved[problem.id]) { markBtn.textContent = '\u2713 Solved'; markBtn.style.borderColor = '#0d7c34'; markBtn.style.color = '#0d7c34'; }
      markBtn.addEventListener('click', function () {
        try {
          var s = {};
          var st = localStorage.getItem('sqlSolved'); if (st) s = JSON.parse(st);
          if (s[problem.id]) { delete s[problem.id]; markBtn.textContent = 'Mark Solved'; markBtn.style.borderColor = ''; markBtn.style.color = ''; }
          else { s[problem.id] = true; markBtn.textContent = '\u2713 Solved'; markBtn.style.borderColor = '#0d7c34'; markBtn.style.color = '#0d7c34'; }
          localStorage.setItem('sqlSolved', JSON.stringify(s));
        } catch(e) {}
      });
    }

    document.title = '#' + problem.id + ' ' + problem.title + ' | SQL Project';
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initSQLProject);
  } else {
    window.initSQLProject();
  }

})();
