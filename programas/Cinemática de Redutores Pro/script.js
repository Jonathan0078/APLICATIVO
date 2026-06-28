const _t = (k, r) => (typeof i18n !== 'undefined' ? i18n.t(k, r) : k);

let currentTab = 'eixos';

// Estado em memória do último cálculo (usado pelo botão "Copiar Resumo")
let lastCalculo = null;
// Mapa para busca rápida de rolamentos a partir da base de dados completa
let rolamentosMap = {};

// Base de referência aproximada de rolamentos comuns (N de elementos, Bd e Pd em mm)
// Valores de catálogo padrão (tabelas usuais de análise de vibração). Para máxima
// precisão, prefira inserir N / Bd / Pd manualmente a partir da folha de dados do fabricante.
const BEARING_EXTRA_DATA = {
    // Série 60xx
    '6000': { N: 7, Bd: 4.76, Pd: 18.0 },
    '6001': { N: 8, Bd: 4.76, Pd: 20.0 },
    '6002': { N: 8, Bd: 5.56, Pd: 23.5 },
    '6003': { N: 8, Bd: 6.35, Pd: 26.0 },
    '6004': { N: 7, Bd: 7.94, Pd: 31.0 },
    '6005': { N: 8, Bd: 7.94, Pd: 36.0 },
    '6006': { N: 8, Bd: 9.52, Pd: 42.5 },
    '6007': { N: 8, Bd: 10.32, Pd: 48.5 },
    '6008': { N: 8, Bd: 11.11, Pd: 54.0 },
    '6009': { N: 8, Bd: 12.70, Pd: 60.0 },
    '6010': { N: 8, Bd: 12.70, Pd: 65.0 },

    // Série 62xx
    '6200': { N: 7, Bd: 5.95, Pd: 20.0 },
    '6201': { N: 8, Bd: 4.76, Pd: 22.0 },
    '6202': { N: 8, Bd: 5.95, Pd: 25.0 },
    '6203': { N: 8, Bd: 7.14, Pd: 28.5 },
    '6204': { N: 8, Bd: 7.94,  Pd: 33.5 },
    '6205': { N: 9, Bd: 7.94,  Pd: 38.5 },
    '6206': { N: 9, Bd: 9.53,  Pd: 46.5 },
    '6207': { N: 9, Bd: 11.51, Pd: 53.5 },
    '6208': { N: 9, Bd: 12.70, Pd: 60.0 },
    '6209': { N: 9, Bd: 13.49, Pd: 65.0 },
    '6210': { N: 9, Bd: 14.29, Pd: 70.0 },
    '6211': { N: 9, Bd: 15.88, Pd: 77.5 },
    '6212': { N: 9, Bd: 17.46, Pd: 85.0 },
    '6213': { N: 9, Bd: 19.05, Pd: 92.5 },
    '6214': { N: 8, Bd: 20.64, Pd: 97.5 },
    '6215': { N: 8, Bd: 22.22, Pd: 102.5 },

    // Série 63xx
    '6300': { N: 7, Bd: 7.14, Pd: 22.5 },
    '6301': { N: 7, Bd: 7.94, Pd: 24.5 },
    '6302': { N: 7, Bd: 9.52, Pd: 28.5 },
    '6303': { N: 7, Bd: 10.32, Pd: 32.0 },
    '6304': { N: 7, Bd: 11.11, Pd: 36.0 },
    '6305': { N: 7, Bd: 13.49, Pd: 43.5 },
    '6306': { N: 7, Bd: 15.88, Pd: 51.0 },
    '6307': { N: 8, Bd: 15.88, Pd: 57.5 },
    '6308': { N: 8, Bd: 17.46, Pd: 65.0 },
    '6309': { N: 8, Bd: 19.05, Pd: 72.5 },
    '6310': { N: 8, Bd: 20.64, Pd: 80.0 },
    '6311': { N: 8, Bd: 22.22, Pd: 87.5 },
    '6312': { N: 8, Bd: 23.81, Pd: 95.0 },
    '6313': { N: 8, Bd: 25.40, Pd: 102.5 },
    '6314': { N: 8, Bd: 26.99, Pd: 110.0 },
    '6315': { N: 8, Bd: 28.57, Pd: 117.5 }
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof i18n !== 'undefined') {
        i18n.translatePage();
        document.querySelectorAll('[data-i18n-label]').forEach(el => {
            el.setAttribute('data-label', i18n.t(el.getAttribute('data-i18n-label')));
        });
    }
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    // Constrói o mapa de rolamentos a partir da base de dados para busca rápida
    if (typeof rolamentosDB_data !== 'undefined') {
        rolamentosMap = rolamentosDB_data.reduce((map, bearing) => {
            if (bearing.designacao) {
                map[bearing.designacao.toUpperCase().trim()] = bearing;
            }
            return map;
        }, {});
    }

    // Montagem inicial de campos vazios/padrão
    addStage(25, 75);
    addStage(18, 72);

    const inputRpm = document.getElementById('rpmIn');
    if (inputRpm) {
        inputRpm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateGearbox();
        });
    }

    carregarOpcoesPresets();

    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
        presetSelect.addEventListener('change', onPresetSelecionado);
    }
});

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

function showTab(tabName, event) {
    currentTab = tabName;

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = message;
        errorContainer.classList.remove('hidden');
        setTimeout(() => {
            errorContainer.classList.add('hidden');
        }, 5000);
    }
}

function hideError() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer && !errorContainer.classList.contains('hidden')) {
        errorContainer.classList.add('hidden');
    }
}

function addStage(zMot = '', zMov = '') {
    const container = document.getElementById('stagesContainer');
    if (!container) return;

    const stageNum = container.children.length + 1;

    const div = document.createElement('div');
    div.className = 'stage-card';
    div.innerHTML = `
        <div class="stage-card-header">
            <strong><i class="fa-solid fa-gear"></i> ${_t('cin.stage_label')} <span class="stage-num">${stageNum}</span></strong>
            <button type="button" class="remove-btn" onclick="removeStage(this)" title="${_t('cin.remove_stage')}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="input-grid">
            <div class="input-group" style="margin-bottom: 0;">
                <label>${_t('cin.z_mot_label')}</label>
                <input type="number" class="z-mot" placeholder="${_t('cin.z_mot_ph')}" value="${zMot}" min="1" step="1">
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label>${_t('cin.z_mov_label')}</label>
                <input type="number" class="z-mov" placeholder="${_t('cin.z_mov_ph')}" value="${zMov}" min="1" step="1">
            </div>
        </div>
    `;

    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateGearbox();
        });
    });

    container.appendChild(div);
    updateStageLabels();
}

function removeStage(btn) {
    const container = document.getElementById('stagesContainer');
    if (container.children.length > 1) {
        btn.closest('.stage-card').remove();
        updateStageLabels();

        const main = document.querySelector('.app-main');
        if (main && !main.classList.contains('aguardando-calculo')) {
            calculateGearbox();
        }
    } else {
        showError(_t('cin.error_one_stage'));
    }
}

function updateStageLabels() {
    document.querySelectorAll('.stage-card').forEach((card, idx) => {
        const label = card.querySelector('.stage-num');
        if (label) label.innerText = idx + 1;
    });
}

// ---------------------------------------------------------------------------
// HELPERS MATEMÁTICOS
// ---------------------------------------------------------------------------
function mdc(a, b) {
    a = Math.round(Math.abs(a));
    b = Math.round(Math.abs(b));
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function mmcCalc(a, b) {
    const d = mdc(a, b);
    return d === 0 ? 0 : Math.abs(a * b) / d;
}

// ---------------------------------------------------------------------------
// CÁLCULO PRINCIPAL
// ---------------------------------------------------------------------------
function calculateGearbox() {
    hideError();
    const rpmInEl = document.getElementById('rpmIn');
    if (!rpmInEl) return;

    const rpmIn = parseFloat(rpmInEl.value);

    if (isNaN(rpmIn) || rpmIn <= 0) {
        showError(_t('cin.error_invalid_rpm'));
        return;
    }

    const mainContainer = document.querySelector('.app-main');
    if (mainContainer) mainContainer.classList.remove('aguardando-calculo');

    const stageCards = document.querySelectorAll('.stage-card');
    let currentRpm = rpmIn;
    let currentHz = currentRpm / 60;
    let validationError = false;

    const shaftHz = [currentHz];
    const shaftRpm = [currentRpm];
    const stages = []; // {zMot, zMov, hzIn, hzOut, gmfHz}

    stageCards.forEach((stage) => {
        const zMotEl = stage.querySelector('.z-mot');
        const zMovEl = stage.querySelector('.z-mov');

        const zMot = parseFloat(zMotEl.value);
        const zMov = parseFloat(zMovEl.value);

        if (isNaN(zMot) || isNaN(zMov) || zMot <= 0 || zMov <= 0) {
            validationError = true;
            return;
        }

        const hzIn = currentHz;
        const gmfHz = hzIn * zMot;

        currentRpm = currentRpm * (zMot / zMov);
        currentHz = currentRpm / 60;

        stages.push({ zMot, zMov, hzIn, hzOut: currentHz, gmfHz });
        shaftHz.push(currentHz);
        shaftRpm.push(currentRpm);
    });

    if (validationError) {
        showError(_t('cin.error_validation'));
        return;
    }

    lastCalculo = { rpmIn, stages, shaftHz, shaftRpm };

    renderEixos(shaftHz, shaftRpm);
    renderGmf(stages);
    renderBandasLaterais(stages);
    renderDiagnostico(stages);
    renderAlertaRessonancia(stages, shaftHz);
}

function renderEixos(shaftHz, shaftRpm) {
    const outEixosEl = document.getElementById('outEixos');
    if (!outEixosEl) return;

    let html = '';
    shaftHz.forEach((hz, idx) => {
        let nomeEixo;
        if (idx === 0) nomeEixo = _t('cin.shaft_input');
        else if (idx === shaftHz.length - 1) nomeEixo = _t('cin.shaft_output', { n: idx + 1 });
        else nomeEixo = _t('cin.shaft_intermediate', { n: idx + 1 });

        html += `
            <tr>
                <td data-label="${_t('cin.th_shaft')}"><strong>${nomeEixo}</strong></td>
                <td data-label="${_t('cin.th_calc_rpm')}">${shaftRpm[idx].toFixed(1)} ${_t('cin.rpm_unit')}</td>
                <td data-label="${_t('cin.th_fundamental')}"><strong style="color: var(--primary); font-family: monospace; font-size: 1.05rem;">${hz.toFixed(3)} ${_t('cin.hz_unit')}</strong></td>
                <td data-label="${_t('cin.th_bearing')}">
                    <button type="button" class="bearing-toggle-btn" onclick="toggleBearingForm(${idx})">
                        <i class="fa-solid fa-circle-notch"></i> <span>${_t('cin.bearing_btn')}</span>
                    </button>
                </td>
            </tr>
            <tr id="bearing-row-${idx}" class="bearing-row hidden">
                <td colspan="4">${bearingFormHtml(idx)}</td>
            </tr>
        `;
    });

    outEixosEl.innerHTML = html;
}

function renderGmf(stages) {
    const outGmfEl = document.getElementById('outGmf');
    if (!outGmfEl) return;

    let html = '';
    stages.forEach((s, idx) => {
        html += `
            <tr>
                <td data-label="${_t('cin.th_stage')}"><strong>${_t('cin.stage_label')} ${idx + 1}</strong><br><small style="color: var(--text-secondary);">${_t('cin.transmission', { i1: idx + 1, i2: idx + 2 })}</small></td>
                <td data-label="${_t('cin.th_teeth')}">${_t('cin.teeth_count', { zmot: s.zMot, zmov: s.zMov })}</td>
                <td data-label="${_t('cin.th_gmf_1x')}"><strong style="color: var(--primary); font-family: monospace; font-size: 1.05rem;">${s.gmfHz.toFixed(2)} ${_t('cin.hz_unit')}</strong></td>
                <td data-label="${_t('cin.th_2x_gmf')}" style="font-family: monospace;">${(s.gmfHz * 2).toFixed(2)} ${_t('cin.hz_unit')}</td>
                <td data-label="${_t('cin.th_3x_gmf')}" style="font-family: monospace;">${(s.gmfHz * 3).toFixed(2)} ${_t('cin.hz_unit')}</td>
            </tr>
        `;
    });

    outGmfEl.innerHTML = html;
}

// ---------------------------------------------------------------------------
// BANDAS LATERAIS (SIDEBANDS)
// ---------------------------------------------------------------------------
function renderBandasLaterais(stages) {
    const outBandasEl = document.getElementById('outBandas');
    if (!outBandasEl) return;

    let html = '';
    stages.forEach((s, idx) => {
        html += linhaBanda(idx, _t('cin.banda_input'), s.hzIn, s.gmfHz);
        html += linhaBanda(idx, _t('cin.banda_output'), s.hzOut, s.gmfHz);
    });

    outBandasEl.innerHTML = html;
}

function linhaBanda(idxStage, label, modHz, gmfHz) {
    return `
        <tr>
            <td data-label="${_t('cin.th_stage')}"><strong>${_t('cin.stage_label')} ${idxStage + 1}</strong></td>
            <td data-label="${_t('cin.th_mod_shaft')}">${label}<br><small style="color: var(--text-secondary);">(${modHz.toFixed(3)} ${_t('cin.hz_unit')})</small></td>
            <td data-label="${_t('cin.th_gmf_m2x')}" style="font-family: monospace;">${(gmfHz - 2 * modHz).toFixed(2)} ${_t('cin.hz_unit')}</td>
            <td data-label="${_t('cin.th_gmf_m1x')}" style="font-family: monospace;">${(gmfHz - modHz).toFixed(2)} ${_t('cin.hz_unit')}</td>
            <td data-label="${_t('cin.th_gmf_central')}"><strong style="color: var(--primary); font-family: monospace;">${gmfHz.toFixed(2)} ${_t('cin.hz_unit')}</strong></td>
            <td data-label="${_t('cin.th_gmf_p1x')}" style="font-family: monospace;">${(gmfHz + modHz).toFixed(2)} ${_t('cin.hz_unit')}</td>
            <td data-label="${_t('cin.th_gmf_p2x')}" style="font-family: monospace;">${(gmfHz + 2 * modHz).toFixed(2)} ${_t('cin.hz_unit')}</td>
        </tr>
    `;
}

// ---------------------------------------------------------------------------
// DENTE CAÇADOR + FATOR DE COBERTURA
// ---------------------------------------------------------------------------
function renderDiagnostico(stages) {
    const outDiagEl = document.getElementById('outDiagnostico');
    if (!outDiagEl) return;

    let html = '';
    stages.forEach((s, idx) => {
        const mmcVal = mmcCalc(s.zMot, s.zMov);
        const fHT = mmcVal > 0 ? s.gmfHz / mmcVal : 0;

        const g = mdc(s.zMot, s.zMov);
        const aSimpl = s.zMot / g;
        const bSimpl = s.zMov / g;

        let fatorHtml;
        if (g > 1) {
            fatorHtml = `
                <span class="badge badge-warning">${_t('cin.coverage_bad', { a: aSimpl, b: bSimpl, g })}</span>
                <div style="margin-top:.4rem; font-size:.82rem; color: var(--text-secondary);">
                    ${_t('cin.coverage_bad_desc')}
                </div>
            `;
        } else {
            fatorHtml = `
                <span class="badge badge-success">${_t('cin.coverage_good')}</span>
                <div style="margin-top:.4rem; font-size:.82rem; color: var(--text-secondary);">
                    ${_t('cin.coverage_good_desc')}
                </div>
            `;
        }

        html += `
            <tr>
                <td data-label="${_t('cin.th_stage')}"><strong>${_t('cin.stage_label')} ${idx + 1}</strong></td>
                <td data-label="${_t('cin.th_hunting')}"><strong style="font-family: monospace;">${fHT.toFixed(4)} ${_t('cin.hz_unit')}</strong><br><small style="color: var(--text-secondary);">${_t('cin.mmc', { a: s.zMot, b: s.zMov, v: mmcVal })}</small></td>
                <td data-label="${_t('cin.th_mdc')}" style="font-family: monospace;">${g}</td>
                <td data-label="${_t('cin.th_coverage')}">${fatorHtml}</td>
            </tr>
        `;
    });

    outDiagEl.innerHTML = html;
}

// ---------------------------------------------------------------------------
// ALERTA DE MASCARAMENTO ESPECTRAL (RESSONÂNCIA COM A REDE ELÉTRICA)
// ---------------------------------------------------------------------------
function renderAlertaRessonancia(stages, shaftHz) {
    const container = document.getElementById('resonance-alert-container');
    if (!container) return;

    const tolerancia = 1.5; // Hz
    const gridFreqs = [60, 120];
    const alertas = [];

    shaftHz.forEach((hz, idx) => {
        gridFreqs.forEach(g => {
            if (Math.abs(hz - g) <= tolerancia) {
                const nomeEixo = idx === 0 ? _t('cin.shaft_input') : (idx === shaftHz.length - 1 ? _t('cin.shaft_output', { n: idx + 1 }) : _t('cin.shaft_intermediate', { n: idx + 1 }));
                alertas.push(_t('cin.resonance_near', { shaft: nomeEixo, hz: hz.toFixed(2), grid: g }));
            }
        });
    });

    stages.forEach((s, idx) => {
        [s.gmfHz, s.gmfHz * 2, s.gmfHz * 3].forEach((freq, n) => {
            gridFreqs.forEach(g => {
                if (Math.abs(freq - g) <= tolerancia) {
                    const harm = n === 0 ? _t('cin.tab_gmf').replace(' (GMF)', '') : `${n + 1}X GMF`;
                    alertas.push(_t('cin.resonance_harm', { harm, stage: idx + 1, hz: freq.toFixed(2), grid: g }));
                }
            });
        });
    });

    if (alertas.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="resultado-container warning resonance-alert">
            <strong><i class="fa-solid fa-triangle-exclamation"></i> ${_t('cin.resonance_alert')}</strong>
            <ul style="margin: .6rem 0 0 1.1rem; padding: 0;">
                ${alertas.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </div>
    `;
}

// ---------------------------------------------------------------------------
// MÓDULO DE ROLAMENTOS (BPFI / BPFO / BSF / FTF)
// ---------------------------------------------------------------------------
function bearingFormHtml(shaftIdx) {
    return `
        <div class="bearing-form">
            <div class="input-grid">
                <div class="input-group" style="margin-bottom:0;">
                    <label>${_t('cin.bearing_form_ref')}</label>
                    <input type="text" id="bearingRef-${shaftIdx}" placeholder="${_t('cin.bearing_form_ref_ph')}" onchange="preencherDoDB(${shaftIdx})">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label>${_t('cin.bearing_form_n')}</label>
                    <input type="number" id="bearingN-${shaftIdx}" min="1" step="1" placeholder="${_t('cin.bearing_form_n_ph')}">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label>${_t('cin.bearing_form_bd')}</label>
                    <input type="number" id="bearingBd-${shaftIdx}" min="0" step="any" placeholder="${_t('cin.bearing_form_bd_ph')}">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label>${_t('cin.bearing_form_pd')}</label>
                    <input type="number" id="bearingPd-${shaftIdx}" min="0" step="any" placeholder="${_t('cin.bearing_form_pd_ph')}">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label>${_t('cin.bearing_form_angle')}</label>
                    <input type="number" id="bearingAngle-${shaftIdx}" min="0" max="89" step="any" value="0">
                </div>
            </div>
            <div class="button-group" style="margin-top:.85rem;">
                <button type="button" class="main-button" onclick="calcularRolamento(${shaftIdx})">
                    <i class="fa-solid fa-calculator"></i> <span>${_t('cin.bearing_calc_btn')}</span>
                </button>
            </div>
            <div id="bearingResult-${shaftIdx}" class="bearing-result"></div>
            <div class="info-box" style="margin-top:.85rem; font-size:.8rem;">
                ${_t('cin.bearing_info')}
            </div>
        </div>
    `;
}

function toggleBearingForm(shaftIdx) {
    const row = document.getElementById(`bearing-row-${shaftIdx}`);
    if (!row) return;
    row.classList.toggle('hidden');
}

function preencherDoDB(shaftIdx) {
    const refEl = document.getElementById(`bearingRef-${shaftIdx}`);
    if (!refEl) return;

    const ref = refEl.value.toUpperCase().trim();
    if (!ref) return;

    const nEl = document.getElementById(`bearingN-${shaftIdx}`);
    const bdEl = document.getElementById(`bearingBd-${shaftIdx}`);
    const pdEl = document.getElementById(`bearingPd-${shaftIdx}`);
    const resultEl = document.getElementById(`bearingResult-${shaftIdx}`);
    if (resultEl) resultEl.innerHTML = ''; // Limpa resultados/mensagens anteriores

    // Limpa os campos antes de preencher para evitar dados antigos
    if (nEl) nEl.value = '';
    if (bdEl) bdEl.value = '';
    if (pdEl) pdEl.value = '';

    let n, bd, pd;
    let foundInExtra = false;

    // 1. Tenta encontrar na base de dados completa (rolamentosMap)
    const dadosRolamento = rolamentosMap[ref];
    if (dadosRolamento && dadosRolamento.d && dadosRolamento.D) {
        // Calcula o diâmetro primitivo (Pd) aproximado
        pd = (parseFloat(dadosRolamento.d) + parseFloat(dadosRolamento.D)) / 2;
    }

    // 2. Tenta encontrar na base de dados extra para dados mais precisos (N, Bd, Pd)
    // A base extra usa chaves simplificadas (só números), então limpamos a referência
    const refSimplificada = ref.replace(/[^0-9]/g, '');
    const dadosExtra = BEARING_EXTRA_DATA[refSimplificada];
    if (dadosExtra) {
        n = dadosExtra.N;
        bd = dadosExtra.Bd;
        pd = dadosExtra.Pd; // Sobrescreve o Pd calculado se houver um mais preciso
        foundInExtra = true;
    }

    // 3. Preenche os campos com os dados encontrados
    if (n && nEl) nEl.value = n;
    if (bd && bdEl) bdEl.value = bd;
    if (pd && pdEl) pdEl.value = pd.toFixed(2); // Usar ponto decimal para consistência com parseFloat

    // 4. Exibe mensagem se apenas dados parciais foram encontrados
    if (pd && !foundInExtra && resultEl) {
        resultEl.innerHTML = `<div class="resultado-container info" style="font-size: 0.85rem; padding: 0.6rem;">
            ${_t('cin.bearing_db_found')}
        </div>`;
    }
}

function calcularRolamento(shaftIdx) {
    const resultEl = document.getElementById(`bearingResult-${shaftIdx}`);
    if (!resultEl) return;

    if (!lastCalculo || !lastCalculo.shaftRpm[shaftIdx]) {
        resultEl.innerHTML = '<div class="resultado-container error">' + _t('cin.bearing_calc_first') + '</div>';
        return;
    }

    const N = parseFloat(document.getElementById(`bearingN-${shaftIdx}`).value);
    const Bd = parseFloat(document.getElementById(`bearingBd-${shaftIdx}`).value);
    const Pd = parseFloat(document.getElementById(`bearingPd-${shaftIdx}`).value);
    const angleDeg = parseFloat(document.getElementById(`bearingAngle-${shaftIdx}`).value) || 0;

    if (isNaN(N) || isNaN(Bd) || isNaN(Pd) || N <= 0 || Bd <= 0 || Pd <= 0) {
        resultEl.innerHTML = '<div class="resultado-container error">' + _t('cin.bearing_invalid') + '</div>';
        return;
    }

    const rpm = lastCalculo.shaftRpm[shaftIdx];
    const hz = rpm / 60;
    const angleRad = angleDeg * Math.PI / 180;
    const k = (Bd / Pd) * Math.cos(angleRad);

    const bpfo = (N / 2) * hz * (1 - k);
    const bpfi = (N / 2) * hz * (1 + k);
    const bsf = (Pd / (2 * Bd)) * hz * (1 - k * k);
    const ftf = (hz / 2) * (1 - k);

    resultEl.innerHTML = `
        <div class="table-container" style="margin-top:.85rem;">
            <table class="comparison-table">
                <thead>
                    <tr><th>${_t('cin.bearing_result_bpfo')}</th><th>${_t('cin.bearing_result_bpfi')}</th><th>${_t('cin.bearing_result_bsf')}</th><th>${_t('cin.bearing_result_ftf')}</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="font-family: monospace; color: var(--primary);"><strong>${bpfo.toFixed(2)} ${_t('cin.hz_unit')}</strong></td>
                        <td style="font-family: monospace; color: var(--primary);"><strong>${bpfi.toFixed(2)} ${_t('cin.hz_unit')}</strong></td>
                        <td style="font-family: monospace;">${bsf.toFixed(2)} ${_t('cin.hz_unit')}</td>
                        <td style="font-family: monospace;">${ftf.toFixed(2)} ${_t('cin.hz_unit')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// ---------------------------------------------------------------------------
// PRESETS (BANCO DE DADOS LOCAL DE ATIVOS)
// ---------------------------------------------------------------------------
function getPresets() {
    try {
        return JSON.parse(localStorage.getItem('redutorPresets') || '[]');
    } catch (e) {
        return [];
    }
}

function setPresets(arr) {
    localStorage.setItem('redutorPresets', JSON.stringify(arr));
}

function carregarOpcoesPresets() {
    const select = document.getElementById('presetSelect');
    if (!select) return;

    const presets = getPresets();
    select.innerHTML = '<option value="">' + _t('cin.load_preset') + '</option>';
    presets.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.nome;
        opt.textContent = p.nome;
        select.appendChild(opt);
    });
}

function salvarAtivoAtual() {
    const nomeEl = document.getElementById('nomeAtivo');
    const rpmEl = document.getElementById('rpmIn');
    if (!nomeEl || !rpmEl) return;

    const nome = nomeEl.value.trim();
    if (!nome) {
        showError(_t('cin.error_save_name'));
        return;
    }

    const rpm = parseFloat(rpmEl.value);
    if (isNaN(rpm) || rpm <= 0) {
        showError(_t('cin.error_save_rpm'));
        return;
    }

    const stagesData = [];
    document.querySelectorAll('.stage-card').forEach(stage => {
        const zMot = parseFloat(stage.querySelector('.z-mot').value);
        const zMov = parseFloat(stage.querySelector('.z-mov').value);
        if (!isNaN(zMot) && !isNaN(zMov)) {
            stagesData.push({ zMot, zMov });
        }
    });

    if (stagesData.length === 0) {
        showError(_t('cin.error_save_stages'));
        return;
    }

    const presets = getPresets();
    const idxExistente = presets.findIndex(p => p.nome === nome);
    const novoPreset = { nome, rpm, stages: stagesData };

    if (idxExistente >= 0) {
        presets[idxExistente] = novoPreset;
    } else {
        presets.push(novoPreset);
    }

    setPresets(presets);
    carregarOpcoesPresets();

    const select = document.getElementById('presetSelect');
    if (select) select.value = nome;

    const btn = document.querySelector('.preset-btn:not(.preset-btn-danger)');
    if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => { btn.innerHTML = original; }, 1500);
    }
}

function onPresetSelecionado(e) {
    const nome = e.target.value;
    if (!nome) return;
    carregarAtivo(nome);
}

function carregarAtivo(nome) {
    const presets = getPresets();
    const preset = presets.find(p => p.nome === nome);
    if (!preset) return;

    const cardInputs = document.querySelector('#inputs-column .card');

    document.getElementById('nomeAtivo').value = preset.nome;
    document.getElementById('rpmIn').value = preset.rpm;

    const container = document.getElementById('stagesContainer');
    if (container) container.innerHTML = '';
    preset.stages.forEach(s => addStage(s.zMot, s.zMov));

    calculateGearbox();

    if (cardInputs) {
        cardInputs.classList.remove('preset-loaded-fx');
        void cardInputs.offsetWidth; 
        cardInputs.classList.add('preset-loaded-fx');
    }
}

function excluirAtivoSelecionado() {
    const select = document.getElementById('presetSelect');
    if (!select || !select.value) {
        showError(_t('cin.error_select_delete'));
        return;
    }

    const nome = select.value;
    
    const confirma = window.confirm(_t('cin.config_delete', { name: nome }));
    if (!confirma) return;

    let presets = getPresets();
    presets = presets.filter(p => p.nome !== nome);
    setPresets(presets);
    carregarOpcoesPresets();
}

// ---------------------------------------------------------------------------
// COPIAR RESUMO PARA LAUDO
// ---------------------------------------------------------------------------
function copiarResumo() {
    if (!lastCalculo) {
        showError(_t('cin.error_copy_calc'));
        return;
    }

    const nomeEl = document.getElementById('nomeAtivo');
    const nome = (nomeEl && nomeEl.value.trim()) ? nomeEl.value.trim() : _t('cin.empty_name');

    const eixoSaidaHz = lastCalculo.shaftHz[lastCalculo.shaftHz.length - 1];
    const gmfList = lastCalculo.stages.map((s, i) => `${_t('cin.tab_gmf').replace(' (GMF)', '')} ${_t('cin.stage_label')} ${i + 1}: ${s.gmfHz.toFixed(1)} ${_t('cin.hz_unit')}`).join(' | ');

    const texto = _t('cin.copy_summary', { name: nome, rpm: lastCalculo.rpmIn, hz: eixoSaidaHz.toFixed(2), gmf: gmfList });

    copiarTextoParaClipboard(texto);
}

function copiarTextoParaClipboard(texto) {
    const btn = document.getElementById('copyResumoBtn');
    const feedback = (ok) => {
        if (!btn) return;
        const original = btn.innerHTML;
        btn.innerHTML = ok
            ? '<i class="fa-solid fa-check"></i> <span>' + _t('cin.copied') + '</span>'
            : '<i class="fa-solid fa-xmark"></i> <span>' + _t('cin.failed') + '</span>';
        setTimeout(() => { btn.innerHTML = original; }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(() => feedback(true)).catch(() => copiarFallback(texto, feedback));
    } else {
        copiarFallback(texto, feedback);
    }
}

function copiarFallback(texto, feedback) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        feedback(ok);
    } catch (e) {
        feedback(false);
    }
}
