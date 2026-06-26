document.addEventListener('DOMContentLoaded', function() {
    var t = document.getElementById('themeToggle');
    var saved = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-theme', saved);
    if (t) t.checked = saved;
    t.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });
    document.querySelectorAll('input').forEach(function(el) {
        el.addEventListener('keypress', function(e) { if (e.key === 'Enter') calcular(); });
    });
});

function $(id) { return parseFloat(document.getElementById(id).value) || 0; }

function calcular() {
    var D = $('diametro'), d = $('haste'), P = $('pressao'), L = $('curso'), Q = $('vazao');
    if (!D || !P || !L) { showToast(i18n.t('cilindro_pneu.err_fill')); return; }

    var A1 = Math.PI * D * D / 400;
    var A2 = d ? Math.PI * d * d / 400 : 0;
    var Aef = A1 - A2;

    var F_av = P * 10 * A1;
    var F_ret = P * 10 * Aef;

    var v_av = Q ? (Q * 1000 / 60) / (A1 * 100) * 1000 : 0;
    var v_ret = Q ? (Q * 1000 / 60) / (Aef * 100) * 1000 : 0;

    var V_ciclo = (A1 + Aef) * L / 1000;
    var V_consumo = V_ciclo * (P + 1) / 1;

    var rend = F_av > 0 ? (F_ret / F_av * 100) : 0;

    var html = '<div class="result-grid">' +
        box(i18n.t('cilindro_pneu.res_forca_av'), F_av.toFixed(1), 'N') +
        box(i18n.t('cilindro_pneu.res_forca_ret'), F_ret.toFixed(1), 'N') +
        box(i18n.t('cilindro_pneu.res_rend'), rend.toFixed(1), '%', true) +
        (Q ? box(i18n.t('cilindro_pneu.res_vel_av'), v_av.toFixed(1), 'mm/s') : '') +
        (Q ? box(i18n.t('cilindro_pneu.res_vel_ret'), v_ret.toFixed(1), 'mm/s') : '') +
        box(i18n.t('cilindro_pneu.res_consumo'), V_consumo.toFixed(2), 'L (' + i18n.t('cilindro_pneu.ar_livre') + ')') +
        box(i18n.t('cilindro_pneu.res_area_pistao'), A1.toFixed(2), 'cm²') +
        box(i18n.t('cilindro_pneu.res_area_efetiva'), Aef.toFixed(2), 'cm²') +
        '</div>';

    document.getElementById('resultContent').innerHTML = html;
    document.getElementById('resultCard').style.display = '';
}

function box(label, value, unit, highlight) {
    var cls = 'result-box' + (highlight ? ' highlight' : '');
    return '<div class="' + cls + '"><div class="label">' + label + '</div><div class="value">' + value + '</div><div class="unit">' + unit + '</div></div>';
}

function showToast(msg) {
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    c.appendChild(t); void t.offsetWidth; t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 250); }, 3000);
}
