(function () {
  'use strict';

  var S = window.__shared = {};

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
})();
