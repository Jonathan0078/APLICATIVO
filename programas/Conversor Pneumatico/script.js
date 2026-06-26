var currentMode = 'pressao';

document.addEventListener('DOMContentLoaded', function() {
    var t = document.getElementById('themeToggle');
    var saved = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-theme', saved);
    if (t) t.checked = saved;
    t.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });
    setMode('pressao');
});

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-tab').forEach(function(el) { el.classList.remove('active'); });
    document.querySelector('.mode-tab[data-mode="' + mode + '"]').classList.add('active');
    document.getElementById('resultCard').style.display = 'none';
    renderConverter(mode);
}

function renderConverter(mode) {
    var html = '';
    if (mode === 'pressao') {
        html = '<div class="conv-row">' +
            '<div class="input-unit"><input type="number" id="convFrom" value="6" step="0.01"><select id="unitFrom"><option value="bar">bar</option><option value="psi">psi</option><option value="kPa">kPa</option><option value="MPa">MPa</option><option value="kgfcm2">kgf/cm²</option></select></div>' +
            '<div class="sep">→</div>' +
            '<div class="input-unit"><input type="text" id="convTo" readonly data-i18n-placeholder="conversor_pneu.result_ph"><select id="unitTo"><option value="psi">psi</option><option value="bar" selected>bar</option><option value="kPa">kPa</option><option value="MPa">MPa</option><option value="kgfcm2">kgf/cm²</option></select></div>' +
            '</div>';
    } else if (mode === 'vazao') {
        html = '<div class="conv-row">' +
            '<div class="input-unit"><input type="number" id="convFrom" value="100" step="0.01"><select id="unitFrom"><option value="lmin">L/min</option><option value="scfm">SCFM</option><option value="m3h">m³/h</option><option value="m3min">m³/min</option><option value="cfm">CFM</option></select></div>' +
            '<div class="sep">→</div>' +
            '<div class="input-unit"><input type="text" id="convTo" readonly data-i18n-placeholder="conversor_pneu.result_ph"><select id="unitTo"><option value="scfm">SCFM</option><option value="lmin" selected>L/min</option><option value="m3h">m³/h</option><option value="m3min">m³/min</option><option value="cfm">CFM</option></select></div>' +
            '</div>';
    } else if (mode === 'temp') {
        html = '<div class="conv-row">' +
            '<div class="input-unit"><input type="number" id="convFrom" value="25" step="0.1"><select id="unitFrom"><option value="c">°C</option><option value="f">°F</option><option value="k">K</option></select></div>' +
            '<div class="sep">→</div>' +
            '<div class="input-unit"><input type="text" id="convTo" readonly data-i18n-placeholder="conversor_pneu.result_ph"><select id="unitTo"><option value="f">°F</option><option value="c" selected>°C</option><option value="k">K</option></select></div>' +
            '</div>';
    } else {
        html = '<div class="conv-row">' +
            '<div class="input-unit"><input type="number" id="convFrom" value="100" step="0.01"><select id="unitFrom"><option value="mm">mm</option><option value="pol">in (pol)</option><option value="cm">cm</option><option value="m">m</option></select></div>' +
            '<div class="sep">→</div>' +
            '<div class="input-unit"><input type="text" id="convTo" readonly data-i18n-placeholder="conversor_pneu.result_ph"><select id="unitTo"><option value="pol">in (pol)</option><option value="mm" selected>mm</option><option value="cm">cm</option><option value="m">m</option></select></div>' +
            '</div>';
    }
    html += '<button class="btn-primary" onclick="converter()"><i class="fa-solid fa-arrows-left-right"></i> ' + i18n.t('conversor_pneu.btn_convert') + '</button>';
    document.getElementById('converterContent').innerHTML = html;

    document.getElementById('convFrom').addEventListener('keypress', function(e) { if (e.key === 'Enter') converter(); });
    document.getElementById('unitFrom').addEventListener('change', converter);
    document.getElementById('unitTo').addEventListener('change', converter);
}

function converter() {
    var val = parseFloat(document.getElementById('convFrom').value);
    if (isNaN(val)) { showToast(i18n.t('conversor_pneu.err_invalid')); return; }
    var from = document.getElementById('unitFrom').value;
    var to = document.getElementById('unitTo').value;
    var result = convert(val, from, to);
    document.getElementById('convTo').value = result.toFixed(4);

    var units = getUnitList(currentMode);
    var html = '<div class="result-list">';
    units.forEach(function(u) {
        if (u.value === from) return;
        var v = convert(val, from, u.value);
        html += '<div class="result-item"><span class="ri-label">' + u.label + '</span><span class="ri-value">' + v.toFixed(4) + '</span></div>';
    });
    html += '</div>';
    document.getElementById('resultContent').innerHTML = html;
    document.getElementById('resultCard').style.display = '';
}

function convert(val, from, to) {
    var convs = {
        bar: 1, psi: 0.0689476, kPa: 0.01, MPa: 10, kgfcm2: 0.980665,
        lmin: 1, scfm: 28.3168, m3h: 16.6667, m3min: 1000, cfm: 28.3168,
        c: 1, f: 1, k: 1,
        mm: 1, pol: 25.4, cm: 10, m: 1000
    };
    if (currentMode === 'temp') {
        var c;
        if (from === 'c') c = val;
        else if (from === 'f') c = (val - 32) * 5 / 9;
        else c = val - 273.15;
        if (to === 'c') return c;
        if (to === 'f') return c * 9 / 5 + 32;
        return c + 273.15;
    }
    if (!convs[from] || !convs[to]) return val;
    return val * convs[from] / convs[to];
}

function getUnitList(mode) {
    if (mode === 'pressao') return [
        { value: 'bar', label: 'bar' }, { value: 'psi', label: 'psi' },
        { value: 'kPa', label: 'kPa' }, { value: 'MPa', label: 'MPa' },
        { value: 'kgfcm2', label: 'kgf/cm²' }
    ];
    if (mode === 'vazao') return [
        { value: 'lmin', label: 'L/min' }, { value: 'scfm', label: 'SCFM' },
        { value: 'm3h', label: 'm³/h' }, { value: 'm3min', label: 'm³/min' },
        { value: 'cfm', label: 'CFM' }
    ];
    if (mode === 'temp') return [
        { value: 'c', label: '°C' }, { value: 'f', label: '°F' }, { value: 'k', label: 'K' }
    ];
    return [
        { value: 'mm', label: 'mm' }, { value: 'pol', label: 'in (pol)' },
        { value: 'cm', label: 'cm' }, { value: 'm', label: 'm' }
    ];
}

function showToast(msg) {
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    c.appendChild(t); void t.offsetWidth; t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 250); }, 3000);
}
