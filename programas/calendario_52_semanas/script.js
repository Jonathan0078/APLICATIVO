(function() {
  var STORAGE_KEY = 'cal52_data';
  var YEAR = new Date().getFullYear();
  var CURRENT_WEEK = getISOWeek(new Date());

  // ===== I18N HELPERS =====
  function t(key, params) {
    if (typeof window.i18n !== 'undefined' && window.i18n.t) {
      var s = window.i18n.t(key);
      if (params) {
        for (var k in params) {
          s = s.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), params[k]);
        }
      }
      return s;
    }
    return key;
  }
  function getLocale() {
    return document.documentElement.lang || 'pt-BR';
  }
  function getSpecDisplay(spec) {
    var map = {
      'Mecânica': t('cal52.espec_mecanica'),
      'Elétrica': t('cal52.espec_eletrica'),
      'Lubrificação': t('cal52.espec_lubrificacao'),
      'Instrumentação': t('cal52.espec_instrumentacao'),
      'Civil': t('cal52.espec_civil')
    };
    return map[spec] || spec;
  }

  // ===== STATE =====
  var planItems = [];

  // ===== DOM REFS =====
  var form = document.getElementById('addForm');
  var gridHead = document.getElementById('gridHead');
  var gridBody = document.getElementById('gridBody');
  var emptyState = document.getElementById('emptyState');
  var yearLabel = document.getElementById('yearLabel');
  var exportBtn = document.getElementById('exportBtn');
  var importBtn = document.getElementById('importBtn');
  var importFile = document.getElementById('importFile');

  // ===== ISO WEEK NUMBER =====
  function getISOWeek(d) {
    var dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    dt.setUTCDate(dt.getUTCDate() + 3 - (dt.getUTCDay() + 6) % 7);
    var week = Math.floor((dt.getTime() - new Date(Date.UTC(dt.getUTCFullYear(), 0, 4)).getTime()) / 604800000) + 1;
    return week;
  }

  // ===== MONTH BOUNDARIES =====
  function getMonthWeeks(year) {
    var months = [];
    for (var m = 0; m < 12; m++) {
      var firstDay = new Date(year, m, 1);
      var lastDay = new Date(year, m + 1, 0);
      var wStart = getISOWeek(firstDay);
      var wEnd = getISOWeek(lastDay);
      // Handle year boundary
      if (m === 0 && wStart > 50) wStart = 1;
      if (m === 11 && wEnd < 10) wEnd = 52;
      months.push({ name: firstDay.toLocaleString(getLocale(), { month: 'short' }), wStart: wStart, wEnd: wEnd });
    }
    return months;
  }

  // ===== RENDER =====
  function render() {
    var months = getMonthWeeks(YEAR);
    yearLabel.textContent = YEAR;

    // --- HEADER ---
    var theadHTML = '<tr><th data-i18n="cal52.equip_col">Equipamento</th>';
    for (var w = 1; w <= 52; w++) {
      theadHTML += '<th class="' + (w === CURRENT_WEEK ? 'current-week' : '') + '">S' + pad(w) + '</th>';
    }
    theadHTML += '</tr>';

    // Month sub-header
    var monthHTML = '<tr><th data-i18n="cal52.specialty_col">Especialidade</th>';
    for (var w = 1; w <= 52; w++) {
      var monthName = '';
      for (var m = 0; m < months.length; m++) {
        if (w >= months[m].wStart && w <= months[m].wEnd) {
          monthName = months[m].name;
          break;
        }
      }
      monthHTML += '<th class="month-cell">' + monthName + '</th>';
    }
    monthHTML += '</tr>';

    gridHead.innerHTML = monthHTML + theadHTML;

    // --- BODY ---
    if (planItems.length === 0) {
      gridBody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    var bodyHTML = '';
    for (var i = 0; i < planItems.length; i++) {
      var item = planItems[i];
      bodyHTML += '<tr>';
      // Fixed column
      bodyHTML += '<td>' +
        '<button class="equip-delete" data-idx="' + i + '" title="' + esc(t('cal52.delete')) + '">&times;</button>' +
        '<span class="equip-tag">' + esc(item.tag) + '</span>' +
        '<span class="equip-meta">' + esc(item.equipamento) + ' · ' + esc(getSpecDisplay(item.especialidade)) + '</span>' +
        '</td>';

      for (var w = 1; w <= 52; w++) {
        var cell = item.semanas[w] || { status: 'empty' };
        var cls = 'week-cell status-' + cell.status;
        if (w === CURRENT_WEEK) cls += ' current-week';
        var title = '';
        if (cell.os) title += t('cal52.os') + ': ' + cell.os;
        if (cell.obs) title += (title ? ' | ' : '') + cell.obs;
        bodyHTML += '<td class="' + cls + '" data-idx="' + i + '" data-week="' + w + '" title="' + esc(title) + '">' +
          (cell.status === 'done' ? '\u2713' : cell.status === 'overdue' ? '\u26A0' : cell.status === 'planned' ? '\u25CF' : '') +
          '</td>';
      }
      bodyHTML += '</tr>';
    }
    gridBody.innerHTML = bodyHTML;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // ===== ADD / EDIT ITEMS =====
  function addItem(e) {
    e.preventDefault();
    var tag = document.getElementById('inputTag').value.trim();
    var equip = document.getElementById('inputEquip').value.trim();
    var espec = document.getElementById('inputEspec').value;
    var freq = parseInt(document.getElementById('inputFreq').value, 10);
    var startWeek = parseInt(document.getElementById('inputStartWeek').value, 10) || 1;

    if (!tag || !equip) { showToast(t('cal52.toast_fill_fields'), 'error'); return; }
    if (startWeek < 1 || startWeek > 52) { showToast(t('cal52.toast_week_range'), 'error'); return; }

    var item = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      tag: tag,
      equipamento: equip,
      especialidade: espec,
      semanas: {}
    };

    // Apply frequency
    if (freq > 0) {
      for (var w = startWeek; w <= 52; w += freq) {
        item.semanas[w] = { status: 'planned', os: '', obs: '' };
      }
    }

    planItems.push(item);
    save();
    render();
    form.reset();
    document.getElementById('inputStartWeek').value = '1';
    showToast(t('cal52.toast_added', { tag: tag }));
  }

  // ===== CLICK HANDLER (cycle status) =====
  function handleGridClick(e) {
    var td = e.target.closest('.week-cell');
    if (!td) return;
    var idx = parseInt(td.dataset.idx, 10);
    var week = parseInt(td.dataset.week, 10);
    if (isNaN(idx) || isNaN(week)) return;

    var item = planItems[idx];
    if (!item) return;
    var cell = item.semanas[week] || { status: 'empty' };

    // Cycle: empty → planned → done → overdue → empty
    var ORDER = ['empty', 'planned', 'done', 'overdue'];
    var curIdx = ORDER.indexOf(cell.status);
    var nextStatus = ORDER[(curIdx + 1) % ORDER.length];

    if (nextStatus === 'empty') {
      delete item.semanas[week];
    } else {
      item.semanas[week] = { status: nextStatus, os: cell.os || '', obs: cell.obs || '' };
    }
    save();
    render();
  }

  // ===== DELETE ITEM =====
  function handleDelete(e) {
    var btn = e.target.closest('.equip-delete');
    if (!btn) return;
    var idx = parseInt(btn.dataset.idx, 10);
    if (isNaN(idx)) return;
    if (!confirm(t('cal52.confirm_delete', { tag: planItems[idx].tag }))) return;
    planItems.splice(idx, 1);
    save();
    render();
    showToast(t('cal52.toast_removed'), 'error');
  }

  // ===== PERSISTENCE =====
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(planItems)); }
    catch (e) { showToast(t('cal52.toast_save_error'), 'error'); }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { planItems = JSON.parse(raw); render(); }
    } catch (e) { /* ignore */ }
  }

  // ===== EXPORT =====
  function exportPlan() {
    if (planItems.length === 0) { showToast(t('cal52.toast_export_empty'), 'error'); return; }
    var data = JSON.stringify({ year: YEAR, version: 1, items: planItems }, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'plano_52_semanas_' + YEAR + '.json';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('cal52.toast_exported'));
  }

  // ===== IMPORT =====
  function importPlan(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (!data.items || !Array.isArray(data.items)) {
          showToast(t('cal52.toast_invalid_file'), 'error'); return;
        }
        if (!confirm(t('cal52.toast_import_confirm'))) return;
        planItems = data.items;
        save();
        render();
        showToast(t('cal52.toast_imported', { count: planItems.length }));
      } catch (err) {
        showToast(t('cal52.toast_read_error'), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ===== TOAST =====
  function showToast(msg, type) {
    type = type || 'success';
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = msg;
    container.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', function() { if (toast.parentNode) toast.remove(); });
    }, 3000);
  }

  // ===== THEME =====
  function initTheme() {
    var cb = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme'); cb.checked = true;
    }
    cb.addEventListener('change', function() {
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
  }

  // ===== EVENTS =====
  form.addEventListener('submit', addItem);
  gridBody.addEventListener('click', handleGridClick);
  gridBody.addEventListener('click', handleDelete);
  exportBtn.addEventListener('click', exportPlan);
  importBtn.addEventListener('click', function() { importFile.click(); });
  importFile.addEventListener('change', importPlan);

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    load();
    if (typeof i18n !== 'undefined') i18n.translatePage();
  });
})();
