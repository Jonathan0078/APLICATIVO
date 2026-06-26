const dbSizes = [
    { d: 10, D: 22, b: 7 }, { d: 12, D: 24, b: 7 }, { d: 15, D: 30, b: 7 },
    { d: 17, D: 30, b: 7 }, { d: 20, D: 35, b: 7 }, { d: 22, D: 35, b: 7 },
    { d: 25, D: 40, b: 7 }, { d: 28, D: 40, b: 7 }, { d: 30, D: 47, b: 7 },
    { d: 32, D: 47, b: 7 }, { d: 35, D: 52, b: 7 }, { d: 40, D: 55, b: 8 },
    { d: 45, D: 62, b: 8 }, { d: 50, D: 68, b: 8 }, { d: 55, D: 72, b: 8 },
    { d: 60, D: 80, b: 8 }, { d: 65, D: 85, b: 10 }, { d: 70, D: 90, b: 10 },
    { d: 75, D: 95, b: 10 }, { d: 80, D: 100, b: 10 }, { d: 85, D: 110, b: 10 },
    { d: 90, D: 110, b: 10 }, { d: 95, D: 120, b: 12 }, { d: 100, D: 120, b: 12 }
];

const materialsDb = {
    mineral:   { base: "NBR",  desc: "Uso geral", maxV: 12 },
    sintetico: { base: "FKM",  desc: "Alta temp / Óleo sintético", maxV: 14 },
    graxa:     { base: "NBR",  desc: "Vedação de graxa", maxV: 12 },
    agua:      { base: "EPDM", desc: "Compatibilidade c/ água/glicol", maxV: 15 },
    quimicos:  { base: "PTFE", desc: "Resistência química", maxV: 20 }
};

const standardSelect = document.getElementById('standard');
const mediumSelect = document.getElementById('medium');
const diameterInput = document.getElementById('diameter');
const speedInput = document.getElementById('speed');
const tempInput = document.getElementById('temp');
const pressureInput = document.getElementById('pressure');
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
    accordionBtn.textContent = isOpen ? i18n.t('retentor.theory').replace('▼', '▲') : i18n.t('retentor.theory');
});

function calculate() {
    const d = parseFloat(diameterInput.value);
    const n = parseFloat(speedInput.value);
    const p = parseFloat(pressureInput.value);
    const temp = parseFloat(tempInput.value);
    const mediumKey = mediumSelect.value;
    const standard = standardSelect.value;

    if (isNaN(d) || d < 5 || d > 500 || isNaN(n) || n < 0 || isNaN(p) || p < 0) {
        errorMessage.textContent = i18n.t('retentor.error_fill_fields');
        errorMessage.classList.remove('hidden');
        return false;
    }
    errorMessage.classList.add('hidden');

    let match = dbSizes.find(item => item.d === d);
    let isEstimated = !match;
    let D_val = match ? match.D : Math.round(d + (d * 0.3) + 10);
    let b_val = match ? match.b : (d >= 60 ? 10 : 8);

    const v = (Math.PI * d * n) / 60000;
    const velocityFormula = `\\( v = \\frac{\\pi \\times d \\times n}{60000} = \\frac{\\pi \\times ${d} \\times ${n}}{60000} = ${v.toFixed(2)} \\text{ m/s} \\)`;

    let selectedMat = { ...materialsDb[mediumKey] };
    if (temp > 200 || (v > selectedMat.maxV && mediumKey !== "agua")) {
        selectedMat.base = "PTFE";
        selectedMat.desc = i18n.t('retentor.extreme_conditions');
        selectedMat.maxV = 20;
    } else if (temp > 100 && mediumKey === "mineral") {
        selectedMat.base = "FKM";
        selectedMat.desc = i18n.t('retentor.high_temp');
        selectedMat.maxV = 14;
    }

    let sealType = i18n.t('retentor.seal_standard');
    let sealSub = i18n.t('retentor.seal_spring');
    let pStatus = i18n.t('retentor.status_ok');
    if (p > 0.5) {
        pStatus = i18n.t('retentor.require_special');
        sealType = i18n.t('retentor.high_pressure');
        sealSub = i18n.t('retentor.reinforced_lip');
        if (p > 5 && selectedMat.base !== "PTFE") {
            selectedMat.base = "PTFE";
            selectedMat.desc = i18n.t('retentor.required_high_pressure');
        }
    } else if (mediumKey === "graxa" && v < 4) {
        sealSub = i18n.t('retentor.seal_no_spring');
    }

    let tolEixo = standard === "iso" ? "h11 | Ra 0.2 a 0.8 µm" : "h11 | Ra 0.2 a 0.8 µm | Rz 1 a 5 µm";
    let tolAloj = standard === "iso" ? "H8 | Ra &le; 1.6 µm" : "H8 | Ra &le; 1.6 µm | Rz &le; 6.3 µm";

    updateUI({
        d, D_val, b_val, isEstimated,
        v, maxV: selectedMat.maxV, velocityFormula,
        matBase: selectedMat.base, matDesc: selectedMat.desc,
        p, pStatus, sealType, sealSub,
        tolEixo, tolAloj
    });

    return true;
}

async function updateUI(data) {
    document.getElementById('svg-d').textContent = `${i18n.t('retentor.shaft_dia').split(' ')[0]} = ${data.d} mm`;
    document.getElementById('svg-D').textContent = `D = ${data.D_val} mm`;
    document.getElementById('svg-b').textContent = `b = ${data.b_val} mm`;

    let dimsTitle = data.isEstimated ? i18n.t('retentor.estimated_seal') : i18n.t('retentor.recommended_seal');
    document.getElementById('dims-card').innerHTML = `
        <h3>${dimsTitle}</h3>
        <div class="resultado-grid"><p>${i18n.t('retentor.dimensions')}</p><span class="valor">${data.d} &times; ${data.D_val} &times; ${data.b_val} mm</span></div>
    `;

    document.getElementById('material-card').innerHTML = `
        <h3>${i18n.t('retentor.material_rec')}</h3>
        <div class="resultado-grid">
            <div><p>${i18n.t('retentor.polymer_base')}</p><span class="valor">${data.matBase}</span></div>
            <div><p>${i18n.t('retentor.application')}</p><span class="valor" style="color:var(--text-color)">${data.matDesc}</span></div>
        </div>
    `;

    let vColor = data.v <= data.maxV ? "var(--success-color)" : "var(--error-color)";
    document.getElementById('velocity-card').innerHTML = `
        <h3>${i18n.t('retentor.peripheral_velocity')}</h3>
        <div class="resultado-grid">
            <div><p>${i18n.t('retentor.velocity')}</p><span class="valor" style="color:${vColor}">${data.v.toFixed(1)} m/s</span></div>
            <div><p>${i18n.t('retentor.recommended_limit')}</p><span class="valor" style="color:var(--text-color)">${i18n.t('retentor.max')} ${data.maxV} m/s</span></div>
        </div>
    `;

    let pColor = data.pStatus === "OK" ? "var(--success-color)" : "var(--error-color)";
    document.getElementById('pressure-card').innerHTML = `
        <h3>${i18n.t('retentor.pressure_condition')}</h3>
        <div class="resultado-grid">
            <div><p>${i18n.t('retentor.internal_pressure')}</p><span class="valor">${data.p.toFixed(1)} bar</span></div>
            <div><p>${i18n.t('retentor.status')}</p><span class="valor" style="color:${pColor}">${data.pStatus}</span></div>
        </div>
        <p style="margin-top:10px;font-size:0.9rem;"><strong>${i18n.t('retentor.design')}:</strong> ${data.sealType} (${data.sealSub})</p>
    `;

    document.getElementById('tolerances-card').innerHTML = `
        <h3>${i18n.t('retentor.machining_tolerances')}</h3>
        <div class="resultado-grid">
            <div><p>${i18n.t('retentor.shaft')}</p><span class="valor" style="font-size:14px">${data.tolEixo}</span></div>
            <div><p>${i18n.t('retentor.housing')}</p><span class="valor" style="font-size:14px">${data.tolAloj}</span></div>
        </div>
    `;

    document.getElementById('theory-card').innerHTML = `
        <h3>${i18n.t('retentor.theory_formulas')}</h3>
        <p>${i18n.t('retentor.theory_desc')}</p>
        <div class="calculation-details visible"><p>${data.velocityFormula}</p></div>
        <p style="margin-top:15px"><strong>${i18n.t('retentor.thermal_capacity')}</strong></p>
        <ul style="margin-left:20px; font-size:14px; color:var(--text-color);">
            <li><b>NBR:</b> ${i18n.t('retentor.nbr_spec')}</li>
            <li><b>FKM (Viton):</b> ${i18n.t('retentor.fkm_spec')}</li>
            <li><b>PTFE:</b> ${i18n.t('retentor.ptfe_spec')}</li>
        </ul>
    `;

    if (window.MathJax) {
        await MathJax.typesetPromise([document.getElementById('tab-results')]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTheme(localStorage.getItem('calc-vedacao-theme') || 'light');

    standardSelect.addEventListener('change', calculate);
    mediumSelect.addEventListener('change', calculate);
    diameterInput.addEventListener('input', calculate);
    speedInput.addEventListener('input', calculate);
    tempInput.addEventListener('input', calculate);
    pressureInput.addEventListener('input', calculate);

    calculateBtn.addEventListener('click', () => {
        if (calculate()) {
            switchTab('tab-results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    calculate();
});
