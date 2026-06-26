var RUGOSIDADE = { aco: 0.045, cobre: 0.0015, aluminio: 0.002, plastico: 0.0015 };

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
    var Q = $('vazao'), P = $('pressao'), L = $('comprimento'), dp = $('perda');
    var tipo = document.getElementById('tipo').value;
    if (!Q || !P || !L || !dp) { showToast(i18n.t('msg.fill_all_fields')); return; }

    var rug = RUGOSIDADE[tipo] || 0.0015;
    var Qs = Q / (P + 1) * 1; // L/min nas condições da linha
    var Qsl = Qs / 60000; // m³/s
    var rho = 1.2; // kg/m³ (ar à pressão atmosférica)
    var rhoLinha = rho * (P + 1);
    var mu = 1.85e-5; // viscosidade dinâmica do ar (Pa·s)
    var nu = mu / rhoLinha; // viscosidade cinemática

    var D = 0.005; // chute inicial (5 mm)
    var Dopt = 0;
    var iter = 0;
    while (iter < 200) {
        var A = Math.PI * D * D / 4;
        var v = Qsl / A;
        var Re = v * D / nu;
        var f = Re < 2000 ? 64 / Re : 0.25 / Math.pow(Math.log10(rug / (3.7 * D) + 5.74 / Math.pow(Re, 0.9)), 2);
        var dpCalc = f * (L / D) * (rhoLinha * v * v / 2) / 1e5; // bar
        if (dpCalc <= dp) { Dopt = D; break; }
        D += 0.0005;
        iter++;
        if (iter >= 199) Dopt = D;
    }

    var Dmm = Dopt * 1000;
    var Dfinal = Math.ceil(Dmm * 4) / 4; // arredonda para 0.25 mm
    var DN = nearestTube(Dfinal);
    var vFinal = Qsl / (Math.PI * Dopt * Dopt / 4);

    var Dpol = Dmm / 25.4;
    var frac = decimalToFraction(Dpol);

    var html = '<div class="result-grid">' +
        '<div class="result-box highlight"><div class="label">' + i18n.t('tubulacao_pneu.res_diam_min') + '</div><div class="value">' + DN.diam.toFixed(1) + '</div><div class="unit">mm (DN ' + DN.dn + ')</div></div>' +
        box(i18n.t('tubulacao_pneu.res_diam_calc'), Dmm.toFixed(2), 'mm') +
        box(i18n.t('tubulacao_pneu.res_bitola'), frac, i18n.t('tubulacao_pneu.polegadas')) +
        box(i18n.t('tubulacao_pneu.res_vel_ar'), vFinal.toFixed(1), 'm/s') +
        box(i18n.t('tubulacao_pneu.res_perda_carga'), dp.toFixed(3), 'bar') +
        box(i18n.t('tubulacao_pneu.res_vazao_linha'), Qs.toFixed(1), 'L/min') +
        '</div>';

    document.getElementById('resultContent').innerHTML = html;
    document.getElementById('resultCard').style.display = '';
}

function box(label, value, unit) {
    return '<div class="result-box"><div class="label">' + label + '</div><div class="value">' + value + '</div><div class="unit">' + unit + '</div></div>';
}

function nearestTube(mm) {
    var tubes = [
        { dn: '4', diam: 4 }, { dn: '6', diam: 6 }, { dn: '8', diam: 8 },
        { dn: '10', diam: 10 }, { dn: '12', diam: 12 }, { dn: '15', diam: 15 },
        { dn: '20', diam: 20 }, { dn: '25', diam: 25 }, { dn: '32', diam: 32 },
        { dn: '40', diam: 40 }, { dn: '50', diam: 50 }
    ];
    for (var i = 0; i < tubes.length; i++) {
        if (tubes[i].diam >= mm) return tubes[i];
    }
    return tubes[tubes.length - 1];
}

function decimalToFraction(d) {
    if (d <= 0) return '-';
    var fracs = [
        [1/8, '1/8"'], [1/4, '1/4"'], [3/8, '3/8"'], [1/2, '1/2"'],
        [5/8, '5/8"'], [3/4, '3/4"'], [7/8, '7/8"'], [1, '1"'],
        [1.25, '1 1/4"'], [1.5, '1 1/2"'], [2, '2"']
    ];
    for (var i = 0; i < fracs.length; i++) {
        if (d < fracs[i][0] + 0.06) return fracs[i][1];
    }
    return d.toFixed(2) + '"';
}

function showToast(msg) {
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    c.appendChild(t); void t.offsetWidth; t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 250); }, 3000);
}
