var cylinders = [];
var cid = 0;

document.addEventListener('DOMContentLoaded', function() {
    var t = document.getElementById('themeToggle');
    var saved = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-theme', saved);
    if (t) t.checked = saved;
    t.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });
    addCylinder();
    addCylinder();
});

function addCylinder() {
    cylinders.push({ id: ++cid });
    renderCylinders();
}

function removeCylinder(id) {
    cylinders = cylinders.filter(function(c) { return c.id !== id; });
    renderCylinders();
}

function renderCylinders() {
    var html = '';
    cylinders.forEach(function(c) {
        html += '<div class="cylinder-row" data-id="' + c.id + '">' +
            '<div class="input-group"><label>' + i18n.t('consumo_ar.diam_mm') + '</label><input type="number" class="cyl-diam" value="63" step="0.1" min="1" data-i18n-placeholder="consumo_ar.diam_ph"></div>' +
            '<div class="input-group"><label>' + i18n.t('consumo_ar.curso_mm') + '</label><input type="number" class="cyl-curso" value="200" step="1" min="1" data-i18n-placeholder="consumo_ar.curso_ph"></div>' +
            '<div class="input-group"><label>' + i18n.t('consumo_ar.pressao_bar') + '</label><input type="number" class="cyl-pressao" value="6" step="0.1" min="0.1" data-i18n-placeholder="consumo_ar.pressao_bar_ph"></div>' +
            '<div class="input-group"><label>' + i18n.t('consumo_ar.ciclos_min') + '</label><input type="number" class="cyl-ciclos" value="10" step="0.5" min="0.1" data-i18n-placeholder="consumo_ar.ciclos_ph"></div>' +
            '<button class="btn-remove" onclick="removeCylinder(' + c.id + ')"><i class="fa-solid fa-trash"></i></button>' +
            '</div>';
    });
    document.getElementById('cylindersList').innerHTML = html;
}

function calcular() {
    var rows = document.querySelectorAll('.cylinder-row');
    if (!rows.length) { showToast(i18n.t('consumo_ar.err_no_cylinder')); return; }

    var fatorCarga = (parseFloat(document.getElementById('fatorCarga').value) || 50) / 100;
    var folga = (parseFloat(document.getElementById('folga').value) || 20) / 100;
    var total = 0;

    rows.forEach(function(row) {
        var D = parseFloat(row.querySelector('.cyl-diam').value) || 0;
        var L = parseFloat(row.querySelector('.cyl-curso').value) || 0;
        var P = parseFloat(row.querySelector('.cyl-pressao').value) || 0;
        var C = parseFloat(row.querySelector('.cyl-ciclos').value) || 0;
        if (D && L && P && C) {
            var A = Math.PI * D * D / 400;
            var Vciclo = A * L / 1000;
            var Vlivre = Vciclo * (P + 1) * C * 60;
            total += Vlivre;
        }
    });

    var totalCarga = total * fatorCarga;
    var totalFolga = totalCarga * (1 + folga);
    var totalSCFM = totalFolga / 1699;

    var html = '<div class="result-grid">' +
        '<div class="result-box highlight"><div class="label">' + i18n.t('consumo_ar.res_total') + '</div><div class="value">' + totalFolga.toFixed(1) + '</div><div class="unit">L/h (' + i18n.t('consumo_ar.ar_livre') + ')</div></div>' +
        box(i18n.t('consumo_ar.res_sem_folga'), total.toFixed(1), 'L/h') +
        box(i18n.t('consumo_ar.res_com_carga'), totalCarga.toFixed(1), 'L/h') +
        box(i18n.t('consumo_ar.res_scfm'), totalSCFM.toFixed(2), 'SCFM') +
        box(i18n.t('consumo_ar.res_lmin'), (totalFolga / 60).toFixed(1), 'L/min') +
        box(i18n.t('consumo_ar.res_m3h'), (totalFolga / 1000).toFixed(2), 'm³/h') +
        '</div>';

    document.getElementById('resultContent').innerHTML = html;
    document.getElementById('resultCard').style.display = '';
}

function box(label, value, unit) {
    return '<div class="result-box"><div class="label">' + label + '</div><div class="value">' + value + '</div><div class="unit">' + unit + '</div></div>';
}

function showToast(msg) {
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    c.appendChild(t); void t.offsetWidth; t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 250); }, 3000);
}
