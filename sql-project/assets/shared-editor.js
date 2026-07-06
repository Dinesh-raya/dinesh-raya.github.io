(function () {
  'use strict';

  var S = window.__shared = {};
  var editors = [];

  S.escapeHtml = function (v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  };

  S.showError = function (msg) {
    var el = document.getElementById('resultArea');
    if (!el) return;
    el.innerHTML = '<div class="result-error">' + S.escapeHtml(msg) + '</div>';
  };

  S.toggle = function (trigger, target, expandedLabel, collapsedLabel) {
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
  };

  S.setupCopyBtn = function () {
    var btn = document.getElementById('copyBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var code = document.getElementById('solutionSQL').textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy Code'; }, 2000);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = code;
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy Code'; }, 2000);
      }
    });
  };

  S.fetchJson = function (url) {
    var cacheKey = 'json_' + url;
    try {
      var cached = localStorage.getItem(cacheKey);
      if (cached) return Promise.resolve(JSON.parse(cached));
    } catch (e) {}
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
      return data;
    });
  };

  var RAYA_KEY = 'raya_analytics_progress';

  S.migrateProgress = function () {
    try {
      var cur = JSON.parse(localStorage.getItem(RAYA_KEY));
      if (cur && cur.sql) return;
    } catch (e) {}
    var p = { sql: [], excel: [], python: [] };
    ['sql', 'excel', 'python'].forEach(function (t) {
      try {
        var old = JSON.parse(localStorage.getItem(t + 'Solved'));
        if (old) { p[t] = Object.keys(old); localStorage.removeItem(t + 'Solved'); }
      } catch (e) {}
    });
    try { localStorage.setItem(RAYA_KEY, JSON.stringify(p)); } catch (e) {}
  };

  S.getProgress = function (track) {
    try {
      var d = JSON.parse(localStorage.getItem(RAYA_KEY));
      if (d && d[track]) return d[track];
    } catch (e) {}
    return [];
  };

  S.saveSolved = function (track, id) {
    try {
      var d = JSON.parse(localStorage.getItem(RAYA_KEY)) || { sql: [], excel: [], python: [] };
      if (!d[track]) d[track] = [];
      var sid = String(id);
      if (d[track].indexOf(sid) === -1) { d[track].push(sid); localStorage.setItem(RAYA_KEY, JSON.stringify(d)); }
    } catch (e) {}
  };

  S.removeSolved = function (track, id) {
    try {
      var d = JSON.parse(localStorage.getItem(RAYA_KEY)) || { sql: [], excel: [], python: [] };
      if (!d[track]) d[track] = [];
      var sid = String(id);
      var idx = d[track].indexOf(sid);
      if (idx !== -1) { d[track].splice(idx, 1); localStorage.setItem(RAYA_KEY, JSON.stringify(d)); }
    } catch (e) {}
  };

  S.isSolved = function (track, id) {
    return S.getProgress(track).indexOf(String(id)) !== -1;
  };

  S.setupSolvedBtn = function (track, problemId) {
    var btn = document.getElementById('markSolvedBtn');
    if (!btn) return;
    S.migrateProgress();
    if (S.isSolved(track, problemId)) { btn.textContent = '\u2713 Solved'; btn.classList.add('completed'); }
    btn.addEventListener('click', function () {
      if (S.isSolved(track, problemId)) {
        S.removeSolved(track, problemId);
        btn.textContent = 'Mark Solved';
        btn.classList.remove('completed');
      } else {
        S.saveSolved(track, problemId);
        btn.textContent = '\u2713 Solved';
        btn.classList.add('completed');
      }
    });
  };

  var editors = [];

  S.getCodeTheme = function () {
    return document.documentElement.classList.contains('dark') ? 'material' : 'default';
  };

  var themeCSSLoaded = false;
  S.loadCodeThemeCSS = function () {
    if (themeCSSLoaded) return;
    themeCSSLoaded = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/material.css';
    link.integrity = 'sha384-q5e2HcX1EH6E6/9k5fclbTm3sz/b8LqFHY6z4MWuOshQRLefvLEJGfKC0hxn5ayb';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  S.registerEditor = function (cm) {
    editors.push(cm);
  };

  S.syncCodeTheme = function () {
    var theme = S.getCodeTheme();
    if (theme === 'material') {
      S.loadCodeThemeCSS();
    }
    editors.forEach(function (cm) {
      if (cm.setOption) cm.setOption('theme', theme);
    });
  };

  var observer = window.__themeObserver;
  if (!observer) {
    observer = new MutationObserver(function () {
      S.syncCodeTheme();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.__themeObserver = observer;
  }

  S.sortTable = function (table, colIndex) {
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
    var ascending = table.getAttribute('data-sort-col') === String(colIndex) && table.getAttribute('data-sort-order') !== 'asc';
    rows.sort(function (a, b) {
      var aVal = a.children[colIndex] ? a.children[colIndex].textContent.trim() : '';
      var bVal = b.children[colIndex] ? b.children[colIndex].textContent.trim() : '';
      var aNum = parseFloat(aVal), bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) return ascending ? aNum - bNum : bNum - aNum;
      return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
    table.setAttribute('data-sort-col', colIndex);
    table.setAttribute('data-sort-order', ascending ? 'asc' : 'desc');
    var headers = table.querySelectorAll('th');
    headers.forEach(function (h, i) {
      h.classList.toggle('sort-asc', i === colIndex && ascending);
      h.classList.toggle('sort-desc', i === colIndex && !ascending);
    });
  };

  S.saveCardTemplate = function() {
    var el = document.querySelector('.q-card-inner');
    if (el && !el.getAttribute('data-template')) {
      el.setAttribute('data-template', el.innerHTML);
    }
  };

  S.resetCard = function() {
    var el = document.querySelector('.q-card-inner');
    if (el) {
      var tpl = el.getAttribute('data-template');
      if (tpl) { el.innerHTML = tpl; }
    }
  };

  S.showPlaceholder = function () {
    var el = document.getElementById('resultArea');
    if (!el) return;
    var text = el.getAttribute('data-placeholder') || 'Ready.';
    el.innerHTML = '<div class="result-empty">' + S.escapeHtml(text) + '</div>';
  };

  S.buildTable = function (columns, rows) {
    var h = '<table class="data-table"><thead><tr>';
    columns.forEach(function (c, i) {
      h += '<th data-col="' + i + '">' + S.escapeHtml(c) + '</th>';
    });
    h += '</tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr>';
      r.forEach(function (v) { h += '<td>' + v + '</td>'; });
      h += '</tr>';
    });
    h += '</tbody></table>';
    return h;
  };
})();
