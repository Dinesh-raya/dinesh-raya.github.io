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

  S.setupSolvedBtn = function (storageKey, problemId) {
    var btn = document.getElementById('markSolvedBtn');
    if (!btn) return;
    var solved = {};
    try { var st = localStorage.getItem(storageKey); if (st) solved = JSON.parse(st); } catch (e) {}
    if (solved[problemId]) { btn.textContent = '\u2713 Solved'; btn.classList.add('completed'); }
    btn.addEventListener('click', function () {
      try {
        var s = {};
        var st = localStorage.getItem(storageKey); if (st) s = JSON.parse(st);
        if (s[problemId]) {
          delete s[problemId];
          btn.textContent = 'Mark Solved';
          btn.classList.remove('completed');
        } else {
          s[problemId] = true;
          btn.textContent = '\u2713 Solved';
          btn.classList.add('completed');
        }
        localStorage.setItem(storageKey, JSON.stringify(s));
      } catch (e) {}
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
