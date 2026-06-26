const dbSizes = [
    { d: 6, D: 16, b: 5, label: "Série normal" },
    { d: 7, D: 17, b: 5, label: "Série normal" },
    { d: 8, D: 22, b: 7, label: "Série normal" },
    { d: 9, D: 22, b: 7, label: "Série normal" },
    { d: 10, D: 22, b: 7, label: "Série normal" },
    { d: 10, D: 26, b: 8, label: "Série reforçada" },
    { d: 12, D: 24, b: 7, label: "Série normal" },
    { d: 12, D: 30, b: 8, label: "Série reforçada" },
    { d: 14, D: 26, b: 7, label: "Série normal" },
    { d: 15, D: 26, b: 7, label: "Série normal" },
    { d: 15, D: 30, b: 7, label: "Série reforçada" },
    { d: 16, D: 28, b: 7, label: "Série normal" },
    { d: 17, D: 30, b: 7, label: "Série normal" },
    { d: 17, D: 35, b: 8, label: "Série reforçada" },
    { d: 18, D: 30, b: 7, label: "Série normal" },
    { d: 20, D: 35, b: 7, label: "Série normal" },
    { d: 20, D: 40, b: 8, label: "Série reforçada" },
    { d: 22, D: 35, b: 7, label: "Série normal" },
    { d: 22, D: 40, b: 8, label: "Série reforçada" },
    { d: 24, D: 38, b: 7, label: "Série normal" },
    { d: 25, D: 40, b: 7, label: "Série normal" },
    { d: 25, D: 47, b: 8, label: "Série reforçada" },
    { d: 28, D: 40, b: 7, label: "Série normal" },
    { d: 28, D: 47, b: 8, label: "Série reforçada" },
    { d: 30, D: 47, b: 7, label: "Série normal" },
    { d: 30, D: 52, b: 8, label: "Série reforçada" },
    { d: 32, D: 47, b: 7, label: "Série normal" },
    { d: 32, D: 52, b: 8, label: "Série reforçada" },
    { d: 35, D: 52, b: 7, label: "Série normal" },
    { d: 35, D: 58, b: 10, label: "Série pesada" },
    { d: 38, D: 55, b: 8, label: "Série normal" },
    { d: 40, D: 55, b: 8, label: "Série normal" },
    { d: 40, D: 62, b: 7, label: "Série larga (D sobrem." },
    { d: 40, D: 62, b: 10, label: "Série pesada" },
    { d: 40, D: 50, b: 6, label: "Série estreita" },
    { d: 42, D: 55, b: 8, label: "Série normal" },
    { d: 45, D: 62, b: 8, label: "Série normal" },
    { d: 45, D: 68, b: 10, label: "Série pesada" },
    { d: 48, D: 62, b: 8, label: "Série normal" },
    { d: 50, D: 68, b: 8, label: "Série normal" },
    { d: 50, D: 72, b: 10, label: "Série pesada" },
    { d: 55, D: 72, b: 8, label: "Série normal" },
    { d: 55, D: 80, b: 10, label: "Série pesada" },
    { d: 56, D: 72, b: 8, label: "Série normal" },
    { d: 60, D: 80, b: 8, label: "Série normal" },
    { d: 60, D: 85, b: 10, label: "Série pesada" },
    { d: 63, D: 85, b: 10, label: "Série normal" },
    { d: 65, D: 85, b: 10, label: "Série normal" },
    { d: 65, D: 90, b: 10, label: "Série pesada" },
    { d: 70, D: 90, b: 10, label: "Série normal" },
    { d: 70, D: 95, b: 12, label: "Série pesada" },
    { d: 75, D: 95, b: 10, label: "Série normal" },
    { d: 75, D: 100, b: 12, label: "Série pesada" },
    { d: 80, D: 100, b: 10, label: "Série normal" },
    { d: 80, D: 110, b: 12, label: "Série pesada" },
    { d: 85, D: 110, b: 10, label: "Série normal" },
    { d: 85, D: 120, b: 12, label: "Série pesada" },
    { d: 90, D: 110, b: 10, label: "Série normal" },
    { d: 90, D: 120, b: 12, label: "Série pesada" },
    { d: 95, D: 120, b: 12, label: "Série normal" },
    { d: 95, D: 130, b: 15, label: "Série pesada" },
    { d: 100, D: 120, b: 12, label: "Série normal" },
    { d: 100, D: 130, b: 15, label: "Série pesada" },
    { d: 105, D: 130, b: 12, label: "Série normal" },
    { d: 105, D: 140, b: 15, label: "Série pesada" },
    { d: 110, D: 130, b: 12, label: "Série normal" },
    { d: 110, D: 140, b: 15, label: "Série pesada" },
    { d: 115, D: 140, b: 12, label: "Série normal" },
    { d: 115, D: 150, b: 15, label: "Série pesada" },
    { d: 120, D: 140, b: 12, label: "Série normal" },
    { d: 120, D: 150, b: 15, label: "Série pesada" },
    { d: 125, D: 150, b: 12, label: "Série normal" },
    { d: 125, D: 160, b: 15, label: "Série pesada" },
    { d: 130, D: 150, b: 12, label: "Série normal" },
    { d: 130, D: 160, b: 15, label: "Série pesada" },
    { d: 140, D: 170, b: 15, label: "Série normal" },
    { d: 140, D: 180, b: 18, label: "Série pesada" },
    { d: 150, D: 180, b: 15, label: "Série normal" },
    { d: 150, D: 190, b: 18, label: "Série pesada" },
    { d: 160, D: 190, b: 15, label: "Série normal" },
    { d: 160, D: 200, b: 18, label: "Série pesada" },
    { d: 170, D: 200, b: 15, label: "Série normal" },
    { d: 170, D: 210, b: 18, label: "Série pesada" },
    { d: 180, D: 210, b: 15, label: "Série normal" },
    { d: 180, D: 220, b: 18, label: "Série pesada" },
    { d: 190, D: 220, b: 15, label: "Série normal" },
    { d: 190, D: 230, b: 18, label: "Série pesada" },
    { d: 200, D: 230, b: 15, label: "Série normal" },
    { d: 200, D: 240, b: 18, label: "Série pesada" },
];

const materialsDb = {
    mineral:   { base: "NBR",  desc: "retentor.mat_general", maxV: 12 },
    sintetico: { base: "FKM",  desc: "retentor.mat_high_temp_synth", maxV: 14 },
    graxa:     { base: "NBR",  desc: "retentor.mat_grease", maxV: 12 },
    agua:      { base: "EPDM", desc: "retentor.mat_water", maxV: 15 },
    quimicos:  { base: "PTFE", desc: "retentor.mat_chemical", maxV: 20 }
};

const sealTypeSpecs = {
    standard:       { desc: "Padrão com mola de tração", uso: "Uso geral, boa vedação dinâmica", maxEcc: 0.25 },
    dust_lip:       { desc: "Com lábio de poeira", uso: "Proteção contra contaminantes externos", maxEcc: 0.20 },
    springless:     { desc: "Sem mola", uso: "Baixa pressão, vedação estática/leve", maxEcc: 0.15 },
    rubber_covered: { desc: "Revestido em borracha (Rubber Covered)", uso: "Melhor vedação no alojamento, absorve vibrações", maxEcc: 0.30 },
    high_pressure:  { desc: "Perfil especial para alta pressão", uso: "Lábio reforçado, suporta >0.5 bar", maxEcc: 0.20 },
    ptfe:           { desc: "PTFE (politetrafluoretileno)", uso: "Alta temperatura e resistência química", maxEcc: 0.15 }
};

const standardSelect = document.getElementById('standard');
const mediumSelect = document.getElementById('medium');
const diameterInput = document.getElementById('diameter');
const variantSelect = document.getElementById('variant');
const variantGroup = document.getElementById('variant-group');
const sealTypeSelect = document.getElementById('seal-type');
const speedInput = document.getElementById('speed');
const tempInput = document.getElementById('temp');
const pressureInput = document.getElementById('pressure');
const eccentricityInput = document.getElementById('eccentricity');
const calculateBtn = document.getElementById('calcular-btn');
const errorMessage = document.getElementById('error-message');

const themeToggle = document.getElementById('theme-toggle');

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

const accordionBtn = document.getElementById('accordion-btn');
const accordionContent = document.getElementById('accordion-content');

function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    themeToggle.checked = theme === 'dark';
    localStorage.setItem('calc-vedacao-theme', theme);
}

themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked ? 'dark' : 'light');
});

function switchTab(targetId) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === targetId);
    });
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === targetId);
    });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

accordionBtn.addEventListener('click', () => {
    const isOpen = accordionContent.classList.toggle('open');
    const i18n = window.i18n;
    accordionBtn.textContent = isOpen
        ? (i18n && i18n.t ? i18n.t('retentor.theory') : 'Ver Análise Teórica') + ' ▲'
        : (i18n && i18n.t ? i18n.t('retentor.theory') : 'Ver Análise Teórica') + ' ▼';
});

function getVariants(d) {
    return dbSizes.filter(item => item.d === d);
}

function updateVariants(d) {
    const variants = getVariants(d);
    variantSelect.innerHTML = '';
    if (variants.length > 1) {
        variants.forEach((v, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = v.label + '  —  ' + v.D + '×' + v.b + ' mm';
            variantSelect.appendChild(opt);
        });
        variantGroup.style.display = 'block';
    } else if (variants.length === 1) {
        const opt = document.createElement('option');
        opt.value = 0;
        opt.textContent = variants[0].D + '×' + variants[0].b + ' mm  (' + variants[0].label + ')';
        variantSelect.appendChild(opt);
        variantGroup.style.display = 'block';
    } else {
        variantGroup.style.display = 'none';
    }
}

function getSelectedSize(d) {
    const variants = getVariants(d);
    if (variants.length === 0) return null;
    const idx = parseInt(variantSelect.value) || 0;
    return variants[Math.min(idx, variants.length - 1)];
}

function recommendHardness(v, p, temp, matBase) {
    if (matBase === 'PTFE') return 'D60-D65 (PTFE)';
    if (matBase === 'EPDM') return 'A70-A75 (EPDM)';
    if (p > 0.5) return 'A75-A80 (' + i18n.t('retentor.reinforced') + ')';
    if (temp > 100) return 'A75-A80 (' + i18n.t('retentor.high_temp_short') + ')';
    if (v > 10) return 'A75-A80 (' + i18n.t('retentor.high_speed') + ')';
    if (v > 5) return 'A70-A75';
    return 'A65-A70';
}

function getFinishRecommendation(v) {
    if (v > 10) return { eixo: 'Ra 0.1–0.4 µm / Rz 0.8–2.5 µm', aloj: 'Ra ≤ 1.6 µm / Rz ≤ 6.3 µm', obs: i18n.t('retentor.finish_high') };
    if (v > 4) return { eixo: 'Ra 0.2–0.6 µm / Rz 1.0–4.0 µm', aloj: 'Ra ≤ 1.6 µm / Rz ≤ 6.3 µm', obs: i18n.t('retentor.finish_medium') };
    return { eixo: 'Ra 0.4–0.8 µm / Rz 2.0–6.0 µm', aloj: 'Ra ≤ 1.6 µm / Rz ≤ 6.3 µm', obs: i18n.t('retentor.finish_normal') };
}

function calculate() {
    const d = parseFloat(diameterInput.value);
    const n = parseFloat(speedInput.value);
    const p = parseFloat(pressureInput.value);
    const temp = parseFloat(tempInput.value);
    const eccentricity = parseFloat(eccentricityInput.value);
    const mediumKey = mediumSelect.value;
    const standard = standardSelect.value;
    const sealKey = sealTypeSelect.value;

    if (isNaN(d) || d < 5 || d > 500 || isNaN(n) || n < 0 || isNaN(p) || p < 0) {
        errorMessage.textContent = i18n.t('retentor.error_fill_fields');
        errorMessage.classList.remove('hidden');
        return false;
    }
    errorMessage.classList.add('hidden');

    const size = getSelectedSize(d);
    let D_val, b_val, isEstimated, variantLabel;

    if (size) {
        D_val = size.D;
        b_val = size.b;
        isEstimated = false;
        variantLabel = size.label;
    } else {
        D_val = Math.round(d * 1.25 + 15);
        b_val = d >= 200 ? 18 : d >= 100 ? 15 : d >= 60 ? 12 : d >= 30 ? 10 : 8;
        isEstimated = true;
        variantLabel = i18n.t('retentor.estimated_dim');
    }

    const v = (Math.PI * d * n) / 60000;
    const velocityFormula = `\\( v = \\frac{\\pi \\times ${d} \\times ${n}}{60000} = ${v.toFixed(2)} \\text{ m/s} \\)`;

    let selectedMat = { ...materialsDb[mediumKey] };
    if (temp > 200 || (v > selectedMat.maxV && mediumKey !== "agua")) {
        selectedMat.base = "PTFE";
        selectedMat.desc = "retentor.extreme_conditions";
        selectedMat.maxV = 20;
    } else if (temp > 100 && mediumKey === "mineral") {
        selectedMat.base = "FKM";
        selectedMat.desc = "retentor.high_temp";
        selectedMat.maxV = 14;
    }

    let sealSpec = sealTypeSpecs[sealKey];
    let sealTypeName = i18n.t('retentor.desc_' + sealKey);
    let sealUso = i18n.t('retentor.uso_' + sealKey);

    let pStatus = i18n.t('retentor.status_ok');
    if (p > 0.5) {
        pStatus = i18n.t('retentor.require_special');
        if (p > 5 && selectedMat.base !== "PTFE") {
            selectedMat.base = "PTFE";
            selectedMat.desc = i18n.t('retentor.required_high_pressure');
        }
    } else if (mediumKey === "graxa" && v < 4 && sealKey === "standard") {
        sealTypeName += " " + i18n.t('retentor.no_spring_recommended');
    }

    let to = ' ' + i18n.t('retentor.to') + ' ';
    let tolEixo = standard === "iso" ? "h11 | Ra 0.2" + to + "0.8 µm" : "h11 | Ra 0.2" + to + "0.8 µm | Rz 1" + to + "5 µm";
    let tolAloj = standard === "iso" ? "H8 | Ra ≤ 1.6 µm" : "H8 | Ra ≤ 1.6 µm | Rz ≤ 6.3 µm";

    const maxEcc = sealSpec.maxEcc;
    let eccStatus = i18n.t('retentor.status_ok');
    let eccColor = "var(--success-color)";
    if (eccentricity > maxEcc) {
        eccStatus = i18n.t('retentor.exceeds_recommended') + " (" + maxEcc.toFixed(2) + " mm)";
        eccColor = "var(--error-color)";
    }

    const hardness = recommendHardness(v, p, temp, selectedMat.base);
    const finish = getFinishRecommendation(v);

    updateUI({
        d, D_val, b_val, isEstimated, variantLabel,
        v, maxV: selectedMat.maxV, velocityFormula,
        matBase: selectedMat.base, matDesc: i18n.t(selectedMat.desc),
        p, pStatus, sealTypeName, sealUso,
        tolEixo, tolAloj,
        eccentricity, maxEcc, eccStatus, eccColor,
        hardness,
        finish
    });

    return true;
}

async function updateUI(data) {
    document.getElementById('svg-d').textContent = 'd = ' + data.d + ' mm';
    document.getElementById('svg-D').textContent = 'D = ' + data.D_val + ' mm';
    document.getElementById('svg-b').textContent = 'b = ' + data.b_val + ' mm';
    var seriesEl = document.getElementById('svg-series');
    if (seriesEl) seriesEl.textContent = data.variantLabel;

    var dimsTitle = data.isEstimated ? i18n.t('retentor.estimated_seal') : i18n.t('retentor.recommended_seal');
    document.getElementById('dims-card').innerHTML =
        '<h3>' + dimsTitle + '</h3>' +
        '<div class="resultado-grid"><p>' + i18n.t('retentor.dimensions') + '</p><span class="valor">' + data.d + ' × ' + data.D_val + ' × ' + data.b_val + ' mm</span></div>';

    document.getElementById('seal-type-result-card').innerHTML =
        '<h3>' + i18n.t('retentor.seal_type') + '</h3>' +
        '<div class="resultado-grid">' +
        '<div><p>' + i18n.t('retentor.model') + '</p><span class="valor" style="font-size:1.1rem;color:var(--text-color)">' + data.sealTypeName + '</span></div>' +
        '<div><p>' + i18n.t('retentor.application') + '</p><span class="valor" style="font-size:0.85rem;color:var(--text-light)">' + data.sealUso + '</span></div>' +
        '</div>';

    document.getElementById('material-card').innerHTML =
        '<h3>' + i18n.t('retentor.material_rec') + '</h3>' +
        '<div class="resultado-grid">' +
        '<div><p>' + i18n.t('retentor.polymer_base') + '</p><span class="valor">' + data.matBase + '</span></div>' +
        '<div><p>' + i18n.t('retentor.application') + '</p><span class="valor" style="color:var(--text-color);font-size:0.85rem">' + data.matDesc + '</span></div>' +
        '</div>';

    document.getElementById('hardness-card').innerHTML =
        '<h3>' + i18n.t('retentor.hardness_title') + '</h3>' +
        '<div class="resultado-grid"><div><p>' + i18n.t('retentor.hardness') + '</p><span class="valor" style="font-size:1.2rem">' + data.hardness + '</span></div></div>';

    var vColor = data.v <= data.maxV ? "var(--success-color)" : "var(--error-color)";
    document.getElementById('velocity-card').innerHTML =
        '<h3>' + i18n.t('retentor.peripheral_velocity') + '</h3>' +
        '<div class="resultado-grid">' +
        '<div><p>' + i18n.t('retentor.velocity') + '</p><span class="valor" style="color:' + vColor + '">' + data.v.toFixed(1) + ' m/s</span></div>' +
        '<div><p>' + i18n.t('retentor.recommended_limit') + '</p><span class="valor" style="color:var(--text-color);font-size:1rem">' + i18n.t('retentor.max') + ' ' + data.maxV + ' m/s</span></div>' +
        '</div>';

    document.getElementById('eccentricity-card').innerHTML =
        '<h3>' + i18n.t('retentor.eccentricity_title') + '</h3>' +
        '<div class="resultado-grid">' +
        '<div><p>' + i18n.t('retentor.ecc_measured') + '</p><span class="valor" style="font-size:1.1rem">' + data.eccentricity.toFixed(2) + ' mm</span></div>' +
        '<div><p>' + i18n.t('retentor.ecc_limit') + ' (' + data.sealTypeName.split(' ')[0] + ')</p><span class="valor" style="font-size:1rem;color:var(--text-color)">≤ ' + data.maxEcc.toFixed(2) + ' mm</span></div>' +
        '<div><p>' + i18n.t('retentor.status') + '</p><span class="valor" style="font-size:1.1rem;color:' + data.eccColor + '">' + data.eccStatus + '</span></div>' +
        '</div>';

    var pColor = data.pStatus === i18n.t('retentor.status_ok') ? "var(--success-color)" : "var(--error-color)";
    document.getElementById('pressure-card').innerHTML =
        '<h3>' + i18n.t('retentor.pressure_condition') + '</h3>' +
        '<div class="resultado-grid">' +
        '<div><p>' + i18n.t('retentor.internal_pressure') + '</p><span class="valor">' + data.p.toFixed(1) + ' bar</span></div>' +
        '<div><p>' + i18n.t('retentor.status') + '</p><span class="valor" style="color:' + pColor + '">' + data.pStatus + '</span></div>' +
        '</div>';

    document.getElementById('finish-card').innerHTML =
        '<h3>' + i18n.t('retentor.finish_title') + '</h3>' +
        '<div class="resultado-grid" style="grid-template-columns:1fr 1fr">' +
        '<div><p>' + i18n.t('retentor.finish_shaft') + '</p><span class="valor" style="font-size:0.85rem;color:var(--text-color)">' + data.finish.eixo + '</span></div>' +
        '<div><p>' + i18n.t('retentor.finish_housing') + '</p><span class="valor" style="font-size:0.85rem;color:var(--text-color)">' + data.finish.aloj + '</span></div>' +
        '</div>' +
        '<p style="margin-top:8px;font-size:0.8rem;color:var(--text-light)">' + data.finish.obs + '</p>';

    document.getElementById('tolerances-card').innerHTML =
        '<h3>' + i18n.t('retentor.machining_tolerances') + '</h3>' +
        '<div class="resultado-grid">' +
        '<div><p>' + i18n.t('retentor.shaft') + ' (d)</p><span class="valor" style="font-size:14px">' + data.tolEixo + '</span></div>' +
        '<div><p>' + i18n.t('retentor.housing') + ' (D)</p><span class="valor" style="font-size:14px">' + data.tolAloj + '</span></div>' +
        '</div>';

    document.getElementById('theory-card').innerHTML =
        '<h3>' + i18n.t('retentor.theory_formulas') + '</h3>' +
        '<p>' + i18n.t('retentor.theory_desc') + '</p>' +
        '<div class="calculation-details visible"><p>' + data.velocityFormula + '</p></div>' +
        '<p style="margin-top:15px"><strong>' + i18n.t('retentor.thermal_capacity') + '</strong></p>' +
        '<ul style="margin-left:20px; font-size:14px; color:var(--text-color);">' +
        '<li><b>NBR:</b> ' + i18n.t('retentor.nbr_spec') + '</li>' +
        '<li><b>FKM (Viton):</b> ' + i18n.t('retentor.fkm_spec') + '</li>' +
        '<li><b>PTFE:</b> ' + i18n.t('retentor.ptfe_spec') + '</li>' +
        '</ul>';

    if (window.MathJax) {
        await MathJax.typesetPromise([document.getElementById('tab-results')]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTheme(localStorage.getItem('calc-vedacao-theme') || 'light');

    function onInputChange() {
        var d = parseFloat(diameterInput.value);
        if (!isNaN(d) && d >= 5) {
            updateVariants(d);
        }
        calculate();
    }

    diameterInput.addEventListener('input', onInputChange);
    variantSelect.addEventListener('change', calculate);
    standardSelect.addEventListener('change', calculate);
    mediumSelect.addEventListener('change', calculate);
    sealTypeSelect.addEventListener('change', calculate);
    speedInput.addEventListener('input', calculate);
    tempInput.addEventListener('input', calculate);
    pressureInput.addEventListener('input', calculate);
    eccentricityInput.addEventListener('input', calculate);

    calculateBtn.addEventListener('click', () => {
        if (calculate()) {
            switchTab('tab-results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    updateVariants(parseFloat(diameterInput.value) || 40);
    calculate();
});
