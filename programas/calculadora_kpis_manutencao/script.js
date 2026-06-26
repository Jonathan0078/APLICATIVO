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
    let isCalculating = false; // Previne loops

    // --- 3. INICIALIZAÇÃO ---
    function init() {
        loadTheme();
        renderHistory();
        setupEventListeners();
        showPlaceholder(i18n.t('kpis.waiting'));
    }

    // --- 4. FUNÇÕES DE LÓGICA PRINCIPAL ---
    function calculateKPIs() {
        // Previne execução simultânea
        if (isCalculating) return;
        isCalculating = true;

        try {
            // --- MTBF --- 
            const tempoOperacao = parseFloat(mtbfTempoOperacaoInput.value);
            const numFalhasMtbf = parseFloat(mtbfNumFalhasInput.value);
            let mtbf = null;
            if (!isNaN(tempoOperacao) && !isNaN(numFalhasMtbf) && numFalhasMtbf > 0 && tempoOperacao > 0) {
                mtbf = tempoOperacao / numFalhasMtbf;
                disponibilidadeMtbfInput.value = mtbf.toFixed(2);
            }

            // --- MTTR ---
            const tempoManutencao = parseFloat(mttrTempoManutencaoInput.value);
            const numFalhasMttr = parseFloat(mttrNumFalhasInput.value);
            let mttr = null;
            if (!isNaN(tempoManutencao) && !isNaN(numFalhasMttr) && numFalhasMttr > 0 && tempoManutencao > 0) {
                mttr = tempoManutencao / numFalhasMttr;
                disponibilidadeMttrInput.value = mttr.toFixed(2);
            }

            // --- Disponibilidade ---
            const mtbfDisp = parseFloat(disponibilidadeMtbfInput.value);
            const mttrDisp = parseFloat(disponibilidadeMttrInput.value);
            let disponibilidade = null;
            if (!isNaN(mtbfDisp) && !isNaN(mttrDisp) && mtbfDisp > 0 && mttrDisp >= 0 && (mtbfDisp + mttrDisp) > 0) {
                disponibilidade = (mtbfDisp / (mtbfDisp + mttrDisp)) * 100;
            }

            displayResults(mtbf, mttr, disponibilidade);
            
            // Adiciona ao histórico apenas se pelo menos um valor foi calculado
            if (mtbf !== null || mttr !== null || disponibilidade !== null) {
                addToHistory({ mtbf, mttr, disponibilidade });
            }
        } finally {
            isCalculating = false;
        }
    }

    // --- 5. FUNÇÕES DE UI / EXIBIÇÃO ---
    function displayResults(mtbf, mttr, disponibilidade) {
        if (mtbf === null && mttr === null && disponibilidade === null) {
            showPlaceholder(i18n.t('kpis.fill_data'));
            return;
        }

        const results = [
            { label: i18n.t('kpis.mtbf'), value: mtbf, unit: i18n.t('kpis.hours'), icon: 'fa-clock' },
            { label: i18n.t('kpis.mttr'), value: mttr, unit: i18n.t('kpis.hours'), icon: 'fa-wrench' },
            { label: i18n.t('kpis.availability'), value: disponibilidade, unit: '%', icon: 'fa-thumbs-up' },
        ];

        const gridItemsHTML = results.map(item => {
            if (item.value !== null && !isNaN(item.value) && item.value > 0) {
                const formattedValue = item.value.toFixed(2);
                const borderColor = item.label === i18n.t('kpis.mtbf') ? 'var(--primary)' : 
                                   item.label === i18n.t('kpis.mttr') ? 'var(--cor-destaque)' : 
                                   'var(--cor-sucesso)';
                return `
                    <div class="result-item" style="border-left-color: ${borderColor}">
                        <span class="label"><i class="fa-regular ${item.icon}"></i> ${item.label}</span>
                        <span class="value">${formattedValue} ${item.unit}</span>
                    </div>
                `;
            }
            return '';
        }).filter(Boolean).join('');

        if (gridItemsHTML) {
            resultDisplay.innerHTML = `<div class="results-grid">${gridItemsHTML}</div>`;
        } else {
            showPlaceholder(i18n.t('kpis.no_valid'));
        }
    }

    function showPlaceholder(message) {
        resultDisplay.innerHTML = `
            <div class="result-placeholder">
                <i class="fa-solid fa-chart-pie"></i>
                <p>${message}</p>
            </div>
        `;
    }

    // --- 6. FUNÇÕES AUXILIARES ---
    function clearAll() {
        mtbfTempoOperacaoInput.value = '';
        mtbfNumFalhasInput.value = '';
        mttrTempoManutencaoInput.value = '';
        mttrNumFalhasInput.value = '';
        disponibilidadeMtbfInput.value = '';
        disponibilidadeMttrInput.value = '';
        showPlaceholder(i18n.t('kpis.waiting'));
    }

    function loadTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.checked = true;
        }
    }

    function addToHistory(calculation) {
        // Remove entradas duplicadas (mesmo MTBF, MTTR e Disponibilidade)
        const isDuplicate = calculationHistory.some(item => 
            item.mtbf === calculation.mtbf && 
            item.mttr === calculation.mttr && 
            item.disponibilidade === calculation.disponibilidade
        );
        
        if (!isDuplicate) {
            calculationHistory.unshift(calculation);
            if (calculationHistory.length > 10) {
                calculationHistory.pop();
            }
            localStorage.setItem('kpiCalculationHistory', JSON.stringify(calculationHistory));
            renderHistory();
        }
    }

    function renderHistory() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<li class="history-placeholder">' + i18n.t('kpis.no_history') + '</li>';
            return;
        }
        
        historyList.innerHTML = calculationHistory.map((item, index) => {
            const parts = [];
            if (item.mtbf !== null && !isNaN(item.mtbf)) {
                parts.push(i18n.t('kpis.mtbf') + ': ' + item.mtbf.toFixed(2) + 'h');
            }
            if (item.mttr !== null && !isNaN(item.mttr)) {
                parts.push(i18n.t('kpis.mttr') + ': ' + item.mttr.toFixed(2) + 'h');
            }
            if (item.disponibilidade !== null && !isNaN(item.disponibilidade)) {
                parts.push(i18n.t('kpis.availability_short') + ': ' + item.disponibilidade.toFixed(2) + '%');
            }
            const displayText = parts.length > 0 ? parts.join(', ') : 'Cálculo inválido';
            return `<li data-index="${index}" class="history-item">${displayText}</li>`;
        }).join('');

        // Adiciona evento de clique nos itens do histórico - USANDO DELEGAÇÃO DE EVENTOS
        // Remove listeners antigos e adiciona via delegação
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.removeEventListener('click', handleHistoryClick);
            item.addEventListener('click', handleHistoryClick);
        });
    }

    function handleHistoryClick(e) {
        const index = parseInt(this.dataset.index);
        if (isNaN(index)) return;
        
        const calc = calculationHistory[index];
        if (!calc) return;

        // Recarrega os valores nos campos sem disparar eventos em loop
        if (calc.mtbf !== null && !isNaN(calc.mtbf)) {
            disponibilidadeMtbfInput.value = calc.mtbf.toFixed(2);
        }
        if (calc.mttr !== null && !isNaN(calc.mttr)) {
            disponibilidadeMttrInput.value = calc.mttr.toFixed(2);
        }
        
        // Recalcula usando setTimeout para evitar conflitos de eventos
        setTimeout(() => calculateKPIs(), 10);
    }

    // --- 7. EVENT LISTENERS ---
    function setupEventListeners() {
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateKPIs);
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAll);
        }
        if (themeToggle) {
            themeToggle.addEventListener('change', function() {
                document.body.classList.toggle('dark-theme', this.checked);
                localStorage.setItem('theme', this.checked ? 'dark' : 'light');
            });
        }

        // Enter key para calcular
        document.querySelectorAll('#inputs-column input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateKPIs();
                }
            });
        });
    }

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    init();
});