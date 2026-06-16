// --- DADOS TÉCNICOS ---
const metricBoltData = {
    'M6': { area: 20.1, dia: 6 }, 'M8': { area: 36.6, dia: 8 }, 'M10': { area: 58.0, dia: 10 }, 
    'M12': { area: 84.3, dia: 12 }, 'M14': { area: 115, dia: 14 }, 'M16': { area: 157, dia: 16 }, 
    'M18': { area: 192, dia: 18 }, 'M20': { area: 245, dia: 20 }, 'M22': { area: 303, dia: 22 }, 
    'M24': { area: 353, dia: 24 }, 'M27': { area: 459, dia: 27 }, 'M30': { area: 561, dia: 30 },
};

const inchBoltData = {
    '#10': { area: 14.7, dia: 4.8 },
    '1/4"': { area: 32.2, dia: 6.35 },
    '5/16"': { area: 52.3, dia: 7.94 },
    '3/8"': { area: 78.5, dia: 9.53 },
    '7/16"': { area: 107.7, dia: 11.11 },
    '1/2"': { area: 141.9, dia: 12.70 },
    '9/16"': { area: 182.4, dia: 14.29 },
    '5/8"': { area: 226.9, dia: 15.88 },
    '3/4"': { area: 334.7, dia: 19.05 },
    '7/8"': { area: 459.9, dia: 22.23 },
    '1"': { area: 603.2, dia: 25.40 },
};
const classData = {
    '4.6': { fyb: 240, fub: 400 }, '5.8': { fyb: 400, fub: 500 }, '8.8': { fyb: 640, fub: 800 },
    '10.9': { fyb: 900, fub: 1000 }, '12.9': { fyb: 1080, fub: 1200 },
    'A2-70': { fyb: 450, fub: 700 }, 'A4-80': { fyb: 600, fub: 800 },
};

// --- ELEMENTOS DO DOM ---
const boltSystemSelect = document.getElementById('bolt-system');
const boltSizeSelect = document.getElementById('bolt-size');
const boltClassSelect = document.getElementById('bolt-class');
const safetyFactorInput = document.getElementById('safety-factor');
const kFactorInput = document.getElementById('k-factor');
const calculateBtn = document.getElementById('calcular-btn');
const resultsWrapper = document.getElementById('results-section-wrapper');
const errorMessage = document.getElementById('error-message');

// --- FUNÇÕES ---

/**
 * Preenche os menus suspensos com os dados dos parafusos e classes.
 */
function updateBoltSizes() {
    const system = boltSystemSelect.value;
    // Limpa as opções existentes de forma segura
    while (boltSizeSelect.firstChild) boltSizeSelect.removeChild(boltSizeSelect.firstChild);

    const data = system === 'metric' ? metricBoltData : inchBoltData;
    Object.keys(data).forEach(size => {
        const opt = document.createElement('option');
        opt.value = size;
        opt.textContent = size;
        boltSizeSelect.appendChild(opt);
    });

    // Define valor padrão baseado no sistema apenas se existir
    const defaultValue = system === 'metric' ? 'M16' : '1/2"';
    if ([...boltSizeSelect.options].some(o => o.value === defaultValue)) {
        boltSizeSelect.value = defaultValue;
    } else if (boltSizeSelect.options.length > 0) {
        boltSizeSelect.selectedIndex = 0;
    }
}

function populateSelects() {
    // Popula classes de resistência
    Object.keys(classData).forEach(cls => {
        boltClassSelect.innerHTML += `<option value="${cls}">${cls}</option>`;
    });
    boltClassSelect.value = '8.8';
    
    // Inicializa tamanhos de parafuso com sistema métrico
    updateBoltSizes();
    
    // Adiciona listener para atualizar tamanhos quando o sistema mudar
    boltSystemSelect.addEventListener('change', updateBoltSizes);
}

/**
 * Função principal que lê as entradas, realiza todos os cálculos e chama a atualização da UI.
 */
function calculate() {
    const system = boltSystemSelect.value;
    const size = boltSizeSelect.value;
    const cls = boltClassSelect.value;
    const fs = parseFloat(safetyFactorInput.value);
    const kFactor = parseFloat(kFactorInput.value);

    // Validação dos dados de entrada
    if (!size || !cls || isNaN(fs) || fs <= 0 || isNaN(kFactor) || kFactor <= 0) {
        errorMessage.textContent = 'Por favor, preencha todos os campos com valores válidos.';
        errorMessage.classList.remove('hidden');
        resultsWrapper.classList.add('hidden');
        console.debug('Entrada inválida:', { system, size, cls, fs, kFactor });
        return;
    }
    errorMessage.classList.add('hidden');
    resultsWrapper.classList.remove('hidden');
    
    const data = system === 'metric' ? metricBoltData : inchBoltData;
    const selectedBolt = data[size];
    const selectedClass = classData[cls];

    // Validações adicionais para facilitar debug
    if (!selectedBolt) {
        errorMessage.textContent = `Tamanho de parafuso inválido: ${size}`;
        errorMessage.classList.remove('hidden');
        resultsWrapper.classList.add('hidden');
        console.error('selectedBolt é undefined para chave:', size, 'sistema:', system);
        return;
    }
    if (!selectedClass) {
        errorMessage.textContent = `Classe de parafuso inválida: ${cls}`;
        errorMessage.classList.remove('hidden');
        resultsWrapper.classList.add('hidden');
        console.error('selectedClass é undefined para chave:', cls);
        return;
    }

    // Log de depuração (útil para identificar por que valores não mudam)
    console.debug('calculate inputs:', { system, size, cls, fs, kFactor });
    console.debug('selectedBolt:', selectedBolt, 'selectedClass:', selectedClass);

    // Cálculos de Tração
    const allowableStress = selectedClass.fyb / fs;
    const maxForce = allowableStress * selectedBolt.area;
    const tractionStressCalc = `\\( \\sigma_{adm} = \\frac{f_{yb}}{FS} = \\frac{${selectedClass.fyb}}{${fs}} = ${allowableStress.toFixed(2)} \\text{ MPa} \\)`;
    const tractionForceCalc = `\\( F_{t,max} = \\sigma_{adm} \\times A_s = ${allowableStress.toFixed(2)} \\times ${selectedBolt.area} = ${maxForce.toFixed(2)} \\text{ N} \\)`;

    // Cálculos de Cisalhamento
    const shearArea = selectedBolt.area; 
    const allowableShearStress = (0.6 * selectedClass.fub) / fs;
    const maxShearForce = allowableShearStress * shearArea;
    const shearStressCalc = `\\( \\tau_{adm} = \\frac{0.6 \\times f_{ub}}{FS} = \\frac{0.6 \\times ${selectedClass.fub}}{${fs}} = ${allowableShearStress.toFixed(2)} \\text{ MPa} \\)`;
    const shearForceCalc = `\\( F_{v,max} = \\tau_{adm} \\times A = ${allowableShearStress.toFixed(2)} \\times ${shearArea} = ${maxShearForce.toFixed(2)} \\text{ N} \\)`;

    // Cálculo de Torque
    const boltDiameterMeters = selectedBolt.dia / 1000;
    const torque = kFactor * boltDiameterMeters * maxForce;
    const torqueCalc = `\\( T = K \\times D \\times F_{t,max} = ${kFactor} \\times ${boltDiameterMeters} \\times ${maxForce.toFixed(0)} = ${torque.toFixed(2)} \\text{ N.m} \\)`;

    // Logs de depuração detalhados
    console.debug('computed values:', {
        allowableStress,
        maxForce,
        shearArea,
        allowableShearStress,
        maxShearForce,
        boltDiameterMeters,
        torque
    });

    // Envia todos os dados calculados para a função de atualização da interface
    updateUI({
        area: selectedBolt.area, stress: allowableStress, force: maxForce,
        sArea: shearArea, sStress: allowableShearStress, sForce: maxShearForce,
        torque: torque,
        tractionStressCalc, tractionForceCalc, shearStressCalc, shearForceCalc, torqueCalc
    });
    // Para debug sem abrir console: descomente a linha abaixo para ver valores brutos na UI
    // showDebugValues({ system, size, cls, fs, kFactor, selectedBolt, selectedClass, allowableStress, maxForce, shearArea, allowableShearStress, maxShearForce, boltDiameterMeters, torque });

}

/**
 * Atualiza a interface do utilizador com os novos resultados.
 * @param {object} data - Um objeto contendo todos os resultados dos cálculos.
 */
async function updateUI(data) {
    // Atualiza o cartão de Torque
    document.getElementById('torque-card').innerHTML = `
        <h3>Torque de Aperto</h3>
        <div class="resultado-grid"><p>Torque Rec. (\\(T\\))</p><span class="valor">${data.torque.toFixed(2)} N.m</span></div>
        <button class="toggle-details-btn">Ver cálculo ▼</button>
        <div class="calculation-details"><p>${data.torqueCalc}</p></div>`;

    // Atualiza o cartão de Tração
    document.getElementById('traction-card').innerHTML = `
        <h3>Cálculo de Tração</h3>
        <div class="resultado-grid">
            <div><p>Área (\\(A_s\\))</p><span class="valor">${data.area.toFixed(2)} mm²</span></div>
            <div><p>Tensão Adm. (\\(\\sigma_{adm}\\))</p><span class="valor">${data.stress.toFixed(2)} MPa</span></div>
            <div><p>Força Máx. (\\(F_{t,max}\\))</p><span class="valor">${data.force.toFixed(0)} N <small>(${(data.force / 1000).toFixed(3)} kN)</small></span></div>
        </div>
        <button class="toggle-details-btn">Ver cálculo ▼</button>
        <div class="calculation-details"><p>${data.tractionStressCalc}</p><p>${data.tractionForceCalc}</p></div>`;
    
    // Atualiza o cartão de Cisalhamento
    document.getElementById('shear-card').innerHTML = `
        <h3>Cálculo de Cisalhamento</h3>
        <div class="resultado-grid">
            <div><p>Área (\\(A\\))</p><span class="valor">${data.sArea.toFixed(2)} mm²</span></div>
            <div><p>Tensão Adm. (\\(\\tau_{adm}\\))</p><span class="valor">${data.sStress.toFixed(2)} MPa</span></div>
            <div><p>Força Máx. (\\(F_{v,max}\\))</p><span class="valor">${data.sForce.toFixed(0)} N <small>(${(data.sForce / 1000).toFixed(3)} kN)</small></span></div>
        </div>
        <button class="toggle-details-btn">Ver cálculo ▼</button>
        <div class="calculation-details"><p>${data.shearStressCalc}</p><p>${data.shearForceCalc}</p></div>`;
    
    // Adiciona os event listeners aos novos botões "Ver cálculo"
    document.querySelectorAll('.toggle-details-btn').forEach(btn => { 
        btn.addEventListener('click', toggleDetails); 
    });
    
    // Pede ao MathJax para renderizar as novas fórmulas na página
    if (window.MathJax) { 
        await MathJax.typesetPromise([resultsWrapper]); 
    }
}

/**
 * Função auxiliar para mostrar valores brutos de debug na UI (opcional)
 */
function showDebugValues(obj) {
    const dbg = document.getElementById('debug-values');
    const pre = document.getElementById('debug-pre');
    if (!dbg || !pre) return;
    pre.textContent = JSON.stringify(obj, null, 2);
    dbg.style.display = 'block';
}

/**
 * Alterna a visibilidade dos detalhes do cálculo.
 * @param {Event} event - O evento de clique do botão.
 */
function toggleDetails(event) {
    const button = event.target;
    const detailsDiv = button.nextElementSibling; // O div de detalhes é o elemento irmão seguinte
    const isVisible = detailsDiv.classList.toggle('visible');
    button.textContent = isVisible ? 'Ocultar cálculo ▲' : 'Ver cálculo ▼';
}

// --- INICIALIZAÇÃO ---

// Quando o conteúdo da página estiver totalmente carregado, executa estas funções.
document.addEventListener('DOMContentLoaded', () => {
    // Preenche os selects
    populateSelects(); 
    
    // Adiciona os event listeners
    calculateBtn.addEventListener('click', calculate);
    boltSystemSelect.addEventListener('change', calculate);
    boltSizeSelect.addEventListener('change', calculate);
    boltClassSelect.addEventListener('change', calculate);
    safetyFactorInput.addEventListener('input', calculate);
    kFactorInput.addEventListener('input', calculate);
    
    // Realiza um cálculo inicial com os valores padrão
    calculate();
});
