var MATERIAIS = [
    { name: 'Aço Carbono',      rho: 7850 }, { name: 'Aço Inox 304',  rho: 7930 },
    { name: 'Aço Inox 316',     rho: 7980 }, { name: 'Alumínio 6061', rho: 2700 },
    { name: 'Alumínio 7075',    rho: 2810 }, { name: 'Bronze',        rho: 8800 },
    { name: 'Cobre',            rho: 8960 }, { name: 'Ferro Fundido', rho: 7200 },
    { name: 'Latão',            rho: 8500 }, { name: 'Titânio',       rho: 4500 },
    { name: 'Zinco',            rho: 7140 }, { name: 'Plástico (PE)', rho: 950 },
    { name: 'Nylon',            rho: 1150 },
];

var currentMode = 'hidraulica';
var currentTab = 'cilindro';
var mecanicaShape = 'redonda';

function $(id) { return document.getElementById(id); }
function val(id) { return parseFloat($(id).value) || 0; }
function qs(s, p) { return (p || document).querySelector(s); }
function qsa(s, p) { return Array.from((p || document).querySelectorAll(s)); }

function openMenu() { $('fullscreenMenu').classList.add('active'); }
function closeMenu() { $('fullscreenMenu').classList.remove('active'); }
qs('#menuToggle').addEventListener('click', openMenu);
qs('#closeMenuBtn').addEventListener('click', closeMenu);
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });

(function() {
    var dark = localStorage.getItem('hidcalc-theme');
    if (dark === null) dark = localStorage.getItem('theme');
    var isDark = dark === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    var t = $('themeToggle');
    if (t) t.checked = isDark;
})();
$('themeToggle').addEventListener('change', function() {
    var dark = this.checked;
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem('hidcalc-theme', dark ? 'dark' : 'light');
});

var CALCULATORS = {
    hidraulica: [
        { id: 'cilindro',    icon: 'compress-arrows-alt', key: 'tab_cilindro' },
        { id: 'bomba',       icon: 'water',               key: 'tab_bomba' },
        { id: 'motor',       icon: 'cog',                 key: 'tab_motor' },
        { id: 'perda',       icon: 'chart-line',          key: 'tab_perda' },
        { id: 'tubulacao',   icon: 'wrench',              key: 'tab_tubulacao' },
    ],
    mecanica: [
        { id: 'redonda',     icon: 'circle',              key: 'tab_redonda' },
        { id: 'quadrada',    icon: 'square',              key: 'tab_quadrada' },
        { id: 'sextavada',   icon: 'hexagon',             key: 'tab_sextavada' },
        { id: 'chata',       icon: 'vector-square',       key: 'tab_chata' },
        { id: 'tredondo',    icon: 'circle-notch',        key: 'tab_tredondo' },
        { id: 'tquadrado',   icon: 'stop',                key: 'tab_tquadrado' },
        { id: 'tretangular', icon: 'crop-alt',            key: 'tab_tretangular' },
    ],
};

(function buildMenu() {
    var nav = $('overlayNav');
    ['hidraulica', 'mecanica'].forEach(function(mode) {
        var label = document.createElement('div');
        label.className = 'nav-group-label';
        label.setAttribute('data-i18n', 'hidcalc.mode_' + mode);
        label.textContent = mode === 'hidraulica' ? 'Hidráulica' : 'Mecânica';
        nav.appendChild(label);
        CALCULATORS[mode].forEach(function(calc) {
            var a = document.createElement('a');
            a.className = 'nav-link';
            a.href = '#';
            a.innerHTML = '<i class="fas fa-' + calc.icon + '"></i> ' + i18n.t('hidcalc.' + calc.key);
            a.addEventListener('click', function(e) {
                e.preventDefault();
                currentMode = mode;
                currentTab = calc.id;
                closeMenu();
                renderAll();
            });
            nav.appendChild(a);
        });
    });
})();

qsa('.mode-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        var m = this.dataset.mode;
        qsa('.mode-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        currentMode = m;
        currentTab = CALCULATORS[m][0].id;
        renderAll();
    });
});

function renderAll() {
    renderTabBar();
    $('contentArea').innerHTML = currentMode === 'hidraulica' ? renderHidraulica() : renderMecanica();
    if (currentMode === 'mecanica') bindMecanica();
    if (typeof i18n !== 'undefined') i18n.translatePage();
}

function renderTabBar() {
    var bar = $('calcTabBar');
    var calcs = CALCULATORS[currentMode];
    bar.innerHTML = '<div class="calc-tabs">' + calcs.map(function(c) {
        var active = c.id === currentTab ? ' active' : '';
        return '<button class="calc-tab' + active + '" data-calc="' + c.id + '"><i class="fas fa-' + c.icon + '"></i> <span data-i18n="hidcalc.' + c.key + '">' + i18n.t('hidcalc.' + c.key) + '</span></button>';
    }).join('') + '</div>';
    qsa('.calc-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            currentTab = this.dataset.calc;
            renderAll();
        });
    });
}

function renderHidraulica() {
    switch (currentTab) {
        case 'cilindro':  return cardHid(i18n.t('hidcalc.title_cilindro'), 'compress-arrows-alt', inputsCilindro(), calcCilindro, 'resCilindro', formulasCilindro(), exemplosCilindro());
        case 'bomba':     return cardHid(i18n.t('hidcalc.title_bomba'), 'water', inputsBomba(), calcBomba, 'resBomba', formulasBomba(), exemplosBomba());
        case 'motor':     return cardHid(i18n.t('hidcalc.title_motor'), 'cog', inputsMotor(), calcMotor, 'resMotor', formulasMotor(), exemplosMotor());
        case 'perda':     return cardHid(i18n.t('hidcalc.title_perda'), 'chart-line', inputsPerda(), calcPerda, 'resPerda', formulasPerda(), exemplosPerda());
        case 'tubulacao': return cardHid(i18n.t('hidcalc.title_tubulacao'), 'wrench', inputsTubulacao(), calcTubulacao, 'resTubulacao', formulasTubulacao(), exemplosTubulacao());
    }
}

function cardHid(title, icon, inputs, calcFn, resId, formulas, exemplos) {
    return '<div class="card">' +
        '<h3 class="card-title"><i class="fas fa-' + icon + '"></i> ' + title + '</h3>' +
        inputs +
        '<button class="btn" onclick="' + calcFn.name + '()"><i class="fas fa-calculator"></i> <span data-i18n="hidcalc.calc_btn">Calcular</span></button>' +
        '<div id="' + resId + '" class="result-box" style="margin-top:0.75rem"></div></div>' +
        '<h3 class="section-title"><i class="fas fa-square-root-variable"></i> <span data-i18n="hidcalc.formulas_title">Fórmulas</span></h3>' + formulas +
        '<h3 class="section-title"><i class="fas fa-book-open"></i> <span data-i18n="hidcalc.exemplo_title">Exemplo</span></h3>' + exemplos;
}

function i(label, id, unit, val) {
    var v = val ? ' value="' + val + '"' : '';
    return '<div class="form-group"><label>' + label + '</label><div class="input-unit"><input id="' + id + '" type="number" step="any"' + v + '><span>' + unit + '</span></div></div>';
}

function inputsCilindro() {
    return i('Diâmetro interno da camisa', 'hid_dc', 'mm') +
           i('Diâmetro da haste', 'hid_dh', 'mm') +
           i('Curso', 'hid_curso', 'mm') +
           i('Pressão', 'hid_pc', 'bar') +
           i('Vazão', 'hid_qc', 'L/min') +
           i('Tempo de avanço', 'hid_tc', 's');
}
function inputsBomba() {
    return i('Vazão', 'hid_qb', 'L/min') +
           i('Pressão', 'hid_pb', 'bar') +
           i('Rendimento', 'hid_etab', '0–1', '0.85');
}
function inputsMotor() {
    return i('Cilindrada', 'hid_vd', 'cm³/rot') +
           i('Pressão', 'hid_pm', 'bar') +
           i('Vazão', 'hid_qm', 'L/min') +
           i('Rendimento mecânico', 'hid_etam', '', '0.92');
}
function inputsPerda() {
    return i('Vazão', 'hid_qp', 'L/min') +
           i('Diâmetro interno', 'hid_dp', 'mm') +
           i('Comprimento', 'hid_lp', 'm', '10') +
           i('Rugosidade', 'hid_rp', 'mm', '0.046') +
           i('Viscosidade cinemática', 'hid_nup', 'cSt', '46');
}
function inputsTubulacao() {
    return i('Vazão', 'hid_qt', 'L/min') +
           i('Velocidade desejada', 'hid_vt', 'm/s', '4') +
           i('Diâmetro interno (opcional)', 'hid_dt', 'mm');
}

function calcCilindro() {
    var dc = val('hid_dc'), dh = val('hid_dh'), curso = val('hid_curso'), p = val('hid_pc'), q = val('hid_qc'), t = val('hid_tc');
    var o = [];
    if (dc) {
        var Ac = Math.PI * (dc/10)*(dc/10)/4;
        o.push('<p>Área camisa: <strong>' + Ac.toFixed(2) + ' cm²</strong></p>');
        if (dh) { var Ad = Ac - Math.PI*(dh/10)*(dh/10)/4; o.push('<p>Área anelar: <strong>' + Ad.toFixed(2) + ' cm²</strong></p>'); }
        if (p) o.push('<p>Força avanço: <strong>' + (p*Ac/10).toFixed(1) + ' kN</strong></p>');
        if (dh && p) o.push('<p>Força retorno: <strong>' + (p*(Ac-Math.PI*(dh/10)*(dh/10)/4)/10).toFixed(1) + ' kN</strong></p>');
    }
    if (dc && curso && t) { var Q = Math.PI*(dc/1000)*(dc/1000)/4 * (curso/1000)/t * 60000; o.push('<p>Vazão necessária: <strong>' + Q.toFixed(2) + ' L/min</strong></p>'); }
    if (dc && q) { var v = q/60000/(Math.PI*(dc/1000)*(dc/1000)/4); o.push('<p>Velocidade avanço: <strong>' + v.toFixed(2) + ' m/s</strong></p>'); }
    $('resCilindro').innerHTML = o.length ? o.join('') : '<p>Preencha ao menos dois campos.</p>';
}
function calcBomba() {
    var q = val('hid_qb')/60000, p = val('hid_pb')*1e5, eta = val('hid_etab')||0.85;
    var pot = q*p/eta/1000;
    $('resBomba').innerHTML = '<p>Potência: <strong>' + pot.toFixed(2) + ' kW</strong> (' + (pot/0.7457).toFixed(2) + ' cv)</p>';
}
function calcMotor() {
    var vd = val('hid_vd')*1e-6, p = val('hid_pm')*1e5, q = val('hid_qm')/60000, eta = val('hid_etam')||0.92;
    var tq = vd*p/(2*Math.PI)*eta, rpm = q/vd*60, pot = tq*2*Math.PI*rpm/60/1000;
    $('resMotor').innerHTML = '<p>Torque: <strong>' + tq.toFixed(1) + ' N·m</strong></p><p>Rotação: <strong>' + rpm.toFixed(0) + ' rpm</strong></p><p>Potência: <strong>' + pot.toFixed(2) + ' kW</strong> (' + (pot/0.7457).toFixed(2) + ' cv)</p>';
}
function calcPerda() {
    var q = val('hid_qp')/60000, d = val('hid_dp')/1000, L = val('hid_lp'), rug = val('hid_rp')/1000, nu = val('hid_nup')*1e-6;
    if (!q||!d) { $('resPerda').innerHTML = '<p>Preencha Vazão e Diâmetro.</p>'; return; }
    var v = q/(Math.PI*d*d/4), Re = v*d/nu;
    var f = Re < 2000 ? 64/Re : 0.25/Math.pow(Math.log10(rug/(3.7*d)+5.74/Math.pow(Re,0.9)),2);
    var hf = f*L/d*v*v/(2*9.80665);
    $('resPerda').innerHTML = '<p>Velocidade: <strong>' + v.toFixed(2) + ' m/s</strong></p><p>Reynolds: <strong>' + Re.toFixed(0) + '</strong></p><p>f (Darcy): <strong>' + f.toFixed(4) + '</strong></p><p>Perda: <strong>' + hf.toFixed(2) + ' m.c.a.</strong></p><p>ΔP: <strong>' + (hf*0.088).toFixed(2) + ' bar</strong> (óleo 880 kg/m³)</p>';
}
function calcTubulacao() {
    var q = val('hid_qt')/60000, v = val('hid_vt'), d = val('hid_dt');
    var o = [];
    if (d&&q) { o.push('<p>Velocidade real: <strong>' + (q/(Math.PI*(d/1000)*(d/1000)/4)).toFixed(2) + ' m/s</strong></p>'); }
    if (q&&v) { o.push('<p>Diâmetro necessário: <strong>' + (Math.sqrt(4*q/(Math.PI*v))*1000).toFixed(1) + ' mm</strong></p>'); }
    $('resTubulacao').innerHTML = o.length ? o.join('') : '<p>Preencha Vazão e Velocidade ou Diâmetro.</p>';
}

function fml(camisa, haste) {
    return '<div class="formula-grid"><div class="formula-card"><h4>Lado camisa</h4><div class="formula">' + camisa + '</div></div><div class="formula-card"><h4>Lado haste</h4><div class="formula">' + haste + '</div></div></div>';
}
function formulasCilindro() {
    return fml('A = π · R²', 'A = π · (R² − r²)') + '<div class="formula-card" style="margin-top:0.5rem"><h4>Força</h4><div class="formula">F = P · A</div></div>';
}
function formulasBomba() {
    return '<div class="formula-card"><h4>Potência</h4><div class="formula">Pot (kW) = (Q · P) / (600 · η)</div><div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px">Q = vazão (L/min), P = pressão (bar), η = rendimento</div></div>';
}
function formulasMotor() {
    return '<div class="formula-card"><h4>Torque</h4><div class="formula">T (N·m) = (Vd · ΔP) / (2π) · η<sub>m</sub></div><div style="margin-top:0.75rem"><h4>Rotação</h4><div class="formula">n (rpm) = (Q · 1000) / Vd</div></div></div>';
}
function formulasPerda() {
    return '<div class="formula-card"><h4>Darcy–Weisbach</h4><div class="formula">ΔP = f · (L/D) · ρ · v²/2</div><div style="margin-top:0.75rem"><h4>Reynolds</h4><div class="formula">Re = v · D / ν</div></div></div>';
}
function formulasTubulacao() {
    return '<div class="formula-card"><h4>Velocidade</h4><div class="formula">v = Q / A</div><div style="margin-top:0.75rem"><h4>Diâmetro</h4><div class="formula">D = √(4Q / πv)</div></div></div>';
}

function exemplo(dados, passos) {
    var d = dados.map(function(x) { return '<span>' + x + '</span>'; }).join('');
    return '<div class="example-box"><div class="example-label"><i class="fas fa-table"></i> Dados</div><div class="example-data">' + d + '</div>' + passos + '</div>';
}

function exemplosCilindro() {
    return exemplo(
        ['Diâmetro camisa = 160 mm', 'Diâmetro haste = 70 mm', 'Curso = 320 mm', 'Pressão = 160 bar', 'Vazão = 120 L/min'],
        '<div class="example-step"><strong>1. Área camisa:</strong> A₁ = π × 80² = <strong>20106 mm² ≈ 201 cm²</strong></div>' +
        '<div class="example-step"><strong>2. Área anelar:</strong> A₂ = π × (80² − 35²) = <strong>176 cm²</strong></div>' +
        '<div class="example-step"><strong>3. Força avanço:</strong> F₁ = 160 × 201 / 10 = <strong>3216 kN</strong></div>' +
        '<div class="example-step"><strong>4. Força retorno:</strong> F₂ = 160 × 176 / 10 = <strong>2816 kN</strong></div>'
    );
}
function exemplosBomba() {
    return exemplo(
        ['Vazão = 80 L/min', 'Pressão = 200 bar', 'Rendimento = 0,85'],
        '<div class="example-step"><strong>1. Potência:</strong> Pot = (80 × 200) / (600 × 0,85) = <strong>31,4 kW</strong></div>' +
        '<div class="example-step">Equivalente: <strong>42,1 cv</strong></div>'
    );
}
function exemplosMotor() {
    return exemplo(
        ['Cilindrada = 50 cm³/rot', 'Pressão = 200 bar', 'Vazão = 80 L/min', 'Rend. mec. = 0,92'],
        '<div class="example-step"><strong>1. Torque:</strong> T = (50 × 200) / (2π) × 0,92 = <strong>146,4 N·m</strong></div>' +
        '<div class="example-step"><strong>2. Rotação:</strong> n = (80 × 1000) / 50 = <strong>1600 rpm</strong></div>' +
        '<div class="example-step"><strong>3. Potência:</strong> Pot = 146,4 × 2π × 1600 / 60 / 1000 = <strong>24,5 kW</strong></div>'
    );
}
function exemplosPerda() {
    return exemplo(
        ['Vazão = 100 L/min', 'Diâmetro = 50 mm', 'Comprimento = 50 m', 'Rugosidade = 0,046 mm', 'Viscosidade = 46 cSt'],
        '<div class="example-step"><strong>1. Velocidade:</strong> v = 0,00167 / 0,00196 = <strong>0,85 m/s</strong></div>' +
        '<div class="example-step"><strong>2. Reynolds:</strong> Re = 0,85 × 0,05 / 46×10⁻⁶ = <strong>924</strong> (laminar)</div>' +
        '<div class="example-step"><strong>3. Perda:</strong> hf = f × L/D × v²/2g </div>'
    );
}
function exemplosTubulacao() {
    return exemplo(
        ['Vazão = 200 L/min', 'Velocidade máx. = 4 m/s'],
        '<div class="example-step"><strong>1. Diâmetro necessário:</strong> D = √(4 × 0,00333 / π × 4) × 1000 = <strong>32,6 mm</strong></div>' +
        '<div class="example-step">Recomenda-se tubo com DN 32 ou 1 ¼".</div>'
    );
}

function renderMecanica() {
    return '<div class="card"><h3 class="card-title"><i class="fas fa-weight-hanging"></i> <span data-i18n="hidcalc.title_redonda">Peso Teórico</span></h3>' +
        '<div class="form-group"><label data-i18n="hidcalc.mec_material">Material</label><div class="material-picker">' +
        '<select id="matSel">' + MATERIAIS.map(function(m) { return '<option value="' + m.name + '">' + m.name + '</option>'; }).join('') + '</select>' +
        '<div class="dens-field"><label style="font-size:0.72rem;color:var(--text-secondary);font-weight:600;text-transform:uppercase" data-i18n="hidcalc.mec_dens">Dens. (kg/m³)</label>' +
        '<input id="matDens" type="number" step="any" value="7850"></div></div></div>' +
        '<div class="form-group"><label data-i18n="hidcalc.mec_perfil">Perfil</label><div class="shape-row">' +
        '<button class="shape-btn active" data-shape="redonda" data-i18n="hidcalc.shape_redonda">● Redonda</button>' +
        '<button class="shape-btn" data-shape="quadrada" data-i18n="hidcalc.shape_quadrada">■ Quadrada</button>' +
        '<button class="shape-btn" data-shape="sextavada" data-i18n="hidcalc.shape_sextavada">⬡ Sextavada</button>' +
        '<button class="shape-btn" data-shape="chata" data-i18n="hidcalc.shape_chata">▬ Chata</button>' +
        '<button class="shape-btn" data-shape="tredondo" data-i18n="hidcalc.shape_tredondo">◎ T. Redondo</button>' +
        '<button class="shape-btn" data-shape="tquadrado" data-i18n="hidcalc.shape_tquadrado">◻ T. Quadrado</button>' +
        '<button class="shape-btn" data-shape="tretangular" data-i18n="hidcalc.shape_tretangular">▭ T. Retangular</button></div></div>' +
        '<div id="mecInputs"></div>' +
        '<button class="btn" onclick="calcMecanica()"><i class="fas fa-calculator"></i> <span data-i18n="hidcalc.calc_btn">Calcular</span></button>' +
        '<div id="resMecanica" class="result-box" style="margin-top:0.75rem"></div></div>' +
        '<h3 class="section-title"><i class="fas fa-square-root-variable"></i> <span data-i18n="hidcalc.formulas_title">Fórmulas</span></h3>' + formulasMecanica() +
        '<h3 class="section-title"><i class="fas fa-book-open"></i> <span data-i18n="hidcalc.exemplo_title">Exemplo</span></h3>' + exemploMecanica();
}

function formulasMecanica() {
    var items = [
        { n: 'Redonda', f: 'V = π × D²/4 × L' },
        { n: 'Quadrada', f: 'V = a² × L' },
        { n: 'Sextavada', f: 'V = (3√3/2) × a² × L' },
        { n: 'Chata', f: 'V = w × t × L' },
        { n: 'T. Redondo', f: 'V = π × (D² − d²)/4 × L' },
        { n: 'T. Quadrado', f: 'V = (a² − b²) × L' },
        { n: 'T. Retangular', f: 'V = (A×B − a×b) × L' },
    ];
    return '<div class="formula-grid">' + items.map(function(i) {
        return '<div class="formula-card"><h4>' + i.n + '</h4><div class="formula">' + i.f + '</div><div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px">Peso = V × ρ</div></div>';
    }).join('') + '</div>';
}

function exemploMecanica() {
    return exemplo(
        ['Material: Aço Carbono (ρ = 7850 kg/m³)', 'Perfil: Barra Redonda', 'Diâmetro = 50 mm', 'Comprimento = 1000 mm'],
        '<div class="example-step"><strong>1. Volume:</strong> V = π × 25² × 1000 = <strong>1.963.495 mm³ ≈ 1963 cm³</strong></div>' +
        '<div class="example-step"><strong>2. Peso:</strong> m = 0,001963 × 7850 = <strong>15,4 kg</strong></div>'
    );
}

function bindMecanica() {
    qsa('.shape-btn').forEach(function(b) {
        b.addEventListener('click', function() {
            qsa('.shape-btn').forEach(function(x) { x.classList.remove('active'); });
            this.classList.add('active');
            mecanicaShape = this.dataset.shape;
            updateMecInputs();
        });
    });
    var sel = $('matSel');
    if (sel) sel.addEventListener('change', function() {
        var found = null;
        for (var i = 0; i < MATERIAIS.length; i++) { if (MATERIAIS[i].name === sel.value) { found = MATERIAIS[i]; break; } }
        if (found) $('matDens').value = found.rho;
    });
    updateMecInputs();
}

function updateMecInputs() {
    var div = $('mecInputs');
    if (!div) return;
    var s = mecanicaShape;
    var fn = function(label, id, unit) { return i(label, id, unit); };
    var cq = i(i18n.t('hidcalc.mec_comprimento'), 'mec_comp', 'mm') + '<div class="form-group"><label for="mec_qtd" data-i18n="hidcalc.mec_quantidade">Quantidade</label><div class="input-unit"><input id="mec_qtd" type="number" step="1" value="1"><span data-i18n="hidcalc.mec_pecas">peças</span></div></div>';
    switch (s) {
        case 'redonda':   div.innerHTML = fn(i18n.t('hidcalc.mec_label_diametro'), 'mec_a', 'mm') + cq; break;
        case 'quadrada':  div.innerHTML = fn(i18n.t('hidcalc.mec_label_lado'), 'mec_a', 'mm') + cq; break;
        case 'sextavada': div.innerHTML = fn(i18n.t('hidcalc.mec_label_lado'), 'mec_a', 'mm') + cq; break;
        case 'chata':     div.innerHTML = fn(i18n.t('hidcalc.mec_label_largura'), 'mec_a', 'mm') + fn(i18n.t('hidcalc.mec_label_espessura'), 'mec_b', 'mm') + cq; break;
        case 'tredondo':  div.innerHTML = fn(i18n.t('hidcalc.mec_label_de'), 'mec_a', 'mm') + fn(i18n.t('hidcalc.mec_label_di'), 'mec_b', 'mm') + cq; break;
        case 'tquadrado': div.innerHTML = fn(i18n.t('hidcalc.mec_label_le'), 'mec_a', 'mm') + fn(i18n.t('hidcalc.mec_label_li'), 'mec_b', 'mm') + cq; break;
        case 'tretangular': div.innerHTML = fn(i18n.t('hidcalc.mec_label_le'), 'mec_a', 'mm') + fn(i18n.t('hidcalc.mec_label_he'), 'mec_b', 'mm') + fn(i18n.t('hidcalc.mec_label_li'), 'mec_c', 'mm') + fn(i18n.t('hidcalc.mec_label_hi'), 'mec_d', 'mm') + cq; break;
    }
}

function calcMecanica() {
    var rho = val('matDens'), comp = val('mec_comp')/1000, qtd = val('mec_qtd')||1;
    if (!comp||!rho) { $('resMecanica').innerHTML = '<p>Preencha densidade e comprimento.</p>'; return; }
    var vol = 0, label = '', s = mecanicaShape;
    var a = val('mec_a')/1000, b = val('mec_b')/1000, c = val('mec_c')/1000, d = val('mec_d')/1000;
    function no() { $('resMecanica').innerHTML = '<p>Preencha as dimensões.</p>'; }
    switch (s) {
        case 'redonda':   if (!a) { no(); return; } vol = Math.PI*a*a/4*comp; label = i18n.t('hidcalc.tab_redonda'); break;
        case 'quadrada':  if (!a) { no(); return; } vol = a*a*comp; label = i18n.t('hidcalc.tab_quadrada'); break;
        case 'sextavada': if (!a) { no(); return; } vol = (3*Math.sqrt(3)/2)*a*a*comp; label = i18n.t('hidcalc.tab_sextavada'); break;
        case 'chata':     if (!a||!b) { no(); return; } vol = a*b*comp; label = i18n.t('hidcalc.tab_chata'); break;
        case 'tredondo':  if (!a||!b) { no(); return; } vol = Math.PI*(a*a-b*b)/4*comp; label = i18n.t('hidcalc.tab_tredondo'); break;
        case 'tquadrado': if (!a||!b) { no(); return; } vol = (a*a-b*b)*comp; label = i18n.t('hidcalc.tab_tquadrado'); break;
        case 'tretangular': if (!a||!b||!c||!d) { no(); return; } vol = (a*b-c*d)*comp; label = i18n.t('hidcalc.tab_tretangular'); break;
    }
    var unit = vol*rho, total = unit*qtd;
    var pes = qtd > 1 ? 's' : '';
    $('resMecanica').innerHTML = '<p><strong>' + label + '</strong></p><p><span data-i18n="hidcalc.mec_volume">Volume</span>: <strong>' + (vol*1e9).toFixed(2) + ' cm³</strong></p><p><span data-i18n="hidcalc.mec_peso_unitario">Peso unitário</span>: <strong>' + unit.toFixed(3) + ' kg</strong></p><p><span data-i18n="hidcalc.mec_peso_total">Peso total</span> (' + qtd + ' <span data-i18n="hidcalc.mec_pecas">peça' + pes + '</span>): <strong>' + total.toFixed(3) + ' kg</strong></p>';
    if (typeof i18n !== 'undefined') i18n.translatePage();
}

renderAll();
