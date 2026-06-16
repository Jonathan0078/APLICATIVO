document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const mtbfTempoOperacaoInput = document.getElementById('mtbf-tempo-operacao');
    const mtbfNumFalhasInput = document.getElementById('mtbf-num-falhas');
    const mttrTempoManutencaoInput = document.getElementById('mttr-tempo-manutencao');
    const mttrNumFalhasInput = document.getElementById('mttr-num-falhas');
    const disponibilidadeMtbfInput = document.getElementById('disponibilidade-mtbf');
    const disponibilidadeMttrInput = document.getElementById('disponibilidade-mttr');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDisplay = document.getElementById('result-display');
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const historyList = document.getElementById('history-list');

    // --- 2. ESTADO DA APLICAÇÃO ---
    let calculationHistory = JSON.parse(localStorage.getItem('kpiCalculationHistory')) || [];

    // --- 3. INICIALIZAÇÃO ---
    function init() {
        loadTheme();
        renderHistory();
        setupEventListeners();
    }

    // --- 4. FUNÇÕES DE LÓGICA PRINCIPAL ---
    function calculateKPIs() {
        // --- MTBF --- 
        const tempoOperacao = parseFloat(mtbfTempoOperacaoInput.value);
        const numFalhasMtbf = parseFloat(mtbfNumFalhasInput.value);
        let mtbf = null;
        if (!isNaN(tempoOperacao) && !isNaN(numFalhasMtbf) && numFalhasMtbf > 0) {
            mtbf = tempoOperacao / numFalhasMtbf;
            disponibilidadeMtbfInput.value = mtbf.toFixed(2);
        }

        // --- MTTR ---
        const tempoManutencao = parseFloat(mttrTempoManutencaoInput.value);
        const numFalhasMttr = parseFloat(mttrNumFalhasInput.value);
        let mttr = null;
        if (!isNaN(tempoManutencao) && !isNaN(numFalhasMttr) && numFalhasMttr > 0) {
            mttr = tempoManutencao / numFalhasMttr;
            disponibilidadeMttrInput.value = mttr.toFixed(2);
        }

        // --- Disponibilidade ---
        const mtbfDisp = parseFloat(disponibilidadeMtbfInput.value);
        const mttrDisp = parseFloat(disponibilidadeMttrInput.value);
        let disponibilidade = null;
        if (!isNaN(mtbfDisp) && !isNaN(mttrDisp) && (mtbfDisp + mttrDisp) > 0) {
            disponibilidade = (mtbfDisp / (mtbfDisp + mttrDisp)) * 100;
        }

        displayResults(mtbf, mttr, disponibilidade);
        addToHistory({ mtbf, mttr, disponibilidade });
    }

    // --- 5. FUNÇÕES DE UI / EXIBIÇÃO ---
    function displayResults(mtbf, mttr, disponibilidade) {
        resultDisplay.innerHTML = ''; // Limpa a área de resultados

        const results = [
            { label: 'MTBF', value: mtbf, unit: 'horas' },
            { label: 'MTTR', value: mttr, unit: 'horas' },
            { label: 'Disponibilidade', value: disponibilidade, unit: '%' },
        ];

        const gridItemsHTML = results.map(item => {
            if (item.value !== null && !isNaN(item.value)) {
                return `<div class="result-item"><span class="label">${item.label}</span><span class="value">${item.value.toFixed(2)} ${item.unit}</span></div>`;
            } else {
                return `<div class="result-item"><span class="label">${item.label}</span><span class="value">-</span></div>`;
            }
        }).join('');

        if (gridItemsHTML.trim() === '') {
            showPlaceholder('Nenhum cálculo realizado.');
        } else {
            resultDisplay.innerHTML = `<div class="results-grid">${gridItemsHTML}</div>`;
        }
    }

    function showPlaceholder(message) {
        resultDisplay.innerHTML = `<div class="result-placeholder"><i class="fa-solid fa-chart-pie"></i><p>${message}</p></div>`;
    }

    // --- 6. FUNÇÕES AUXILIARES ---
    function clearAll() {
        mtbfTempoOperacaoInput.value = '';
        mtbfNumFalhasInput.value = '';
        mttrTempoManutencaoInput.value = '';
        mttrNumFalhasInput.value = '';
        disponibilidadeMtbfInput.value = '';
        disponibilidadeMttrInput.value = '';
        showPlaceholder('Aguardando o cálculo...');
    }

    function loadTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    function addToHistory(calculation) {
        calculationHistory.unshift(calculation);
        if (calculationHistory.length > 10) {
            calculationHistory.pop();
        }
        localStorage.setItem('kpiCalculationHistory', JSON.stringify(calculationHistory));
        renderHistory();
    }

    function renderHistory() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<li class="history-placeholder">Nenhum cálculo recente.</li>';
            return;
        }
        historyList.innerHTML = calculationHistory.map(item => {
            const mtbf = item.mtbf ? `MTBF: ${item.mtbf.toFixed(2)}h` : '';
            const mttr = item.mttr ? `MTTR: ${item.mttr.toFixed(2)}h` : '';
            const disp = item.disponibilidade ? `Disp: ${item.disponibilidade.toFixed(2)}%` : '';
            return `<li title="Recalcular com estes valores">${[mtbf, mttr, disp].filter(Boolean).join(', ')}</li>`;
        }).join('');
    }

    // --- 7. EVENT LISTENERS ---
    function setupEventListeners() {
        calculateBtn.addEventListener('click', calculateKPIs);
        clearBtn.addEventListener('click', clearAll);
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    init();
});