document.addEventListener('DOMContentLoaded', () => {
    // --- BASE DE DADOS DE ENGENHARIA ---
    const DB = {
        chains: {
            'ASA 25': { pitch: 6.35 }, 'ASA 35': { pitch: 9.525 }, 'ASA 40': { pitch: 12.70 },
            'ASA 50': { pitch: 15.875 }, 'ASA 60': { pitch: 19.05 }, 'ASA 80': { pitch: 25.40 },
            'ASA 100': { pitch: 31.75 }, 'ASA 120': { pitch: 38.10 }, 'ASA 140': { pitch: 44.45 },
            'ASA 160': { pitch: 50.80 }
        },
        serviceFactors: {
            '1.0': { text: 'Leve (Máquinas-ferramenta, ventiladores <10CV)', value: 1.0 },
            '1.1': { text: 'Leve (Agitadores, geradores, 8-10h/dia)', value: 1.1 },
            '1.2': { text: 'Normal (Bombas/Compressores centrífugos, 10-16h/dia)', value: 1.2 },
            '1.3': { text: 'Normal (Máquinas p/ madeira, prensas, transportadores)', value: 1.3 },
            '1.4': { text: 'Pesado (Elevadores de carga, moinhos, >16h/dia)', value: 1.4 },
            '1.5': { text: 'Pesado (Britadores, laminadores, cargas com choque)', value: 1.5 },
            '1.6': { text: 'Muito Pesado (Choque extremo, partidas frequentes)', value: 1.6 }
        },
        powerTables: {
            'Z': { baseHp: 0.8, addHpFactor: 0.4 }, 'A': { baseHp: 2.1, addHpFactor: 0.6 },
            'B': { baseHp: 4.2, addHpFactor: 1.0 }, 'C': { baseHp: 7.5, addHpFactor: 1.5 },
            'D': { baseHp: 13.5, addHpFactor: 2.5 }, '3V': { baseHp: 8.0, addHpFactor: 1.8 },
            '5V': { baseHp: 19.0, addHpFactor: 3.0 }, 'SPZ': { baseHp: 3.5, addHpFactor: 0.8 },
            'SPA': { baseHp: 5.8, addHpFactor: 1.2 }, 'SPB': { baseHp: 11.0, addHpFactor: 1.9 },
            'SPC': { baseHp: 22.0, addHpFactor: 2.8 },
        },
        pulleys: {
            'Z': [50, 56, 63, 67, 71, 75, 80, 85, 90, 95, 100, 106, 112, 118, 125, 132, 140, 150, 160, 180, 200],
            'A': [63, 67, 71, 75, 80, 85, 90, 95, 100, 106, 112, 118, 125, 132, 140, 150, 160, 170, 180, 190, 200, 224, 250, 280, 315, 355, 400, 450, 500, 560, 630],
            'B': [100, 106, 112, 118, 125, 132, 140, 150, 160, 170, 180, 190, 200, 212, 224, 236, 250, 265, 280, 300, 315, 335, 355, 400, 450, 500, 560, 630, 710, 800],
            'C': [180, 190, 200, 212, 224, 236, 250, 265, 280, 300, 315, 335, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250],
            'D': [300, 315, 335, 355, 400, 425, 450, 475, 500, 530, 560, 600, 630, 670, 710, 750, 800, 850, 900, 950, 1000, 1120, 1250, 1400, 1600],
            '3V': [60, 63, 67, 71, 75, 80, 85, 90, 95, 100, 106, 112, 118, 125, 132, 140, 150, 160, 170, 180, 190, 200, 212, 236, 265, 315, 355, 400, 450, 500],
            '5V': [125, 132, 140, 150, 160, 170, 180, 190, 200, 212, 224, 236, 250, 265, 280, 300, 315, 335, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000],
            'SPZ': [50, 56, 63, 67, 71, 75, 80, 85, 90, 95, 100, 106, 112, 118, 125, 132, 140, 150, 160, 180, 200, 224, 250, 280, 315],
            'SPA': [63, 71, 80, 90, 100, 112, 125, 140, 160, 180, 200, 224, 250, 280, 315, 355, 400, 450, 500],
            'SPB': [100, 112, 125, 140, 160, 180, 200, 224, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800],
            'SPC': [200, 224, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250]
        },
        costs: { pulley: 0.5, belt: 0.1, channel: 1.5 }
    };

    // --- ELEMENTOS DO DOM ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const calculateButton = document.getElementById('calculate-button');
    const clearResultsButton = document.getElementById('clear-results-button');
    const resultsContainer = document.getElementById('results-container');
    const chainTypeSelect = document.getElementById('chain-type');
    const serviceFactorSelect = document.getElementById('service-factor');
    const placeholderHTML = resultsContainer.innerHTML;

    // --- LÓGICA DE TEMA ---
    function applyTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        themeToggle.checked = theme === 'dark';
    }
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('appTheme', newTheme);
        applyTheme(newTheme);
    });

    // --- INICIALIZAÇÃO DA UI ---
    function initializeUI() {
        Object.keys(DB.chains).forEach(name => {
            chainTypeSelect.add(new Option(name, DB.chains[name].pitch));
        });
        Object.values(DB.serviceFactors).forEach(factor => {
            serviceFactorSelect.add(new Option(factor.text, factor.value));
        });
        const savedTheme = localStorage.getItem('appTheme') || 'light';
        applyTheme(savedTheme);
    }
    
    // --- FUNÇÕES DE CÁLCULO AUXILIARES ---
    const findClosest = (val, arr) => arr.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);

    // --- ALGORITMO PRINCIPAL DE SUBSTITUIÇÃO ---
    function findEquivalentSystem() {
        // Mostrar loading state
        showLoading();
        
        // Validar entradas primeiro
        if (!validateAllInputs()) {
            hideLoading();
            return showError('Por favor, corrija os campos destacados em vermelho.');
        }
        
        const pitch = parseFloat(chainTypeSelect.value);
        const Z1 = parseFloat(document.getElementById('gear-teeth-motor').value);
        const Z2 = parseFloat(document.getElementById('gear-teeth-driven').value);
        const motorRpm = parseFloat(document.getElementById('motor-rpm').value);
        const motorCv = parseFloat(document.getElementById('motor-cv').value);
        const centerDistance = parseFloat(document.getElementById('center-distance').value);
        const serviceFactor = parseFloat(serviceFactorSelect.value);

        const allInputs = [pitch, Z1, Z2, motorRpm, motorCv, centerDistance, serviceFactor];
        if (allInputs.some(isNaN)) {
            hideLoading();
            return showError('Todos os campos devem ser preenchidos com valores numéricos.');
        }
        
        // Simular processamento assíncrono para melhor UX
        setTimeout(() => {
            performCalculation(pitch, Z1, Z2, motorRpm, motorCv, centerDistance, serviceFactor);
        }, 300);
    }
    
    function showLoading() {
        calculateButton.disabled = true;
        calculateButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculando...';
        resultsContainer.innerHTML = `
            <div class="result-placeholder">
                <i class="fa-solid fa-cogs fa-spin" style="color: var(--cor-primaria);"></i>
                <p>Analisando configurações de polias...</p>
            </div>`;
    }
    
    function hideLoading() {
        calculateButton.disabled = false;
        calculateButton.innerHTML = '<i class="fa-solid fa-calculator"></i> Encontrar Sistema de Polias Equivalente';
    }
    
    function performCalculation(pitch, Z1, Z2, motorRpm, motorCv, centerDistance, serviceFactor) {

        const d_target = pitch / Math.sin(Math.PI / Z1);
        const D_target = pitch / Math.sin(Math.PI / Z2);
        const targetRatio = Z2 / Z1;
        const designPower = motorCv * serviceFactor;

        let solutions = [];
        for (const profile in DB.pulleys) {
            const availablePulleys = DB.pulleys[profile];
            const d_comm = findClosest(d_target, availablePulleys);
            const D_comm = findClosest(D_target, availablePulleys);
            
            if (d_comm >= D_comm) continue;

            const actualRatio = D_comm / d_comm;
            if (Math.abs(actualRatio - targetRatio) / targetRatio > 0.07) continue;

            const arcOfContact = 180 - 57.3 * (D_comm - d_comm) / centerDistance;
            if (arcOfContact < 90) continue;
            let Ka = 1.0;
            if (arcOfContact < 180) Ka = 0.95 + (arcOfContact - 160) / 400;

            const beltSpeed = (Math.PI * d_comm * motorRpm) / 60000;
            const powerTable = DB.powerTables[profile];
            if (!powerTable) continue;

            const hpPerBelt = (powerTable.baseHp + (beltSpeed / 10 * powerTable.addHpFactor)) * Ka;
            if (hpPerBelt <= 0) continue;

            const numBelts = Math.ceil(designPower / hpPerBelt);
            if (numBelts > 12) continue;

            const L = 2 * centerDistance + 1.57 * (D_comm + d_comm) + (D_comm - d_comm)**2 / (4 * centerDistance);
            const cost = (d_comm + D_comm) * DB.costs.pulley + L * DB.costs.belt + numBelts * DB.costs.channel;

            solutions.push({ profile, numBelts, d_comm, D_comm, actualRatio, L, cost });
        }

        hideLoading();
        
        if (solutions.length === 0) {
            return showError('Nenhuma solução de polias viável encontrada para substituir este sistema. Verifique os parâmetros de entrada.');
        }

        solutions.sort((a, b) => a.cost - b.cost);
        displayResults(solutions.slice(0, 10), {d_target, D_target, targetRatio, designPower});
    }

    // --- FUNÇÕES DE EXIBIÇÃO ---
    function displayResults(solutions, original) {
        // Armazenar resultados globalmente para exportação
        window.currentResults = { solutions, original };
        
        let tableRows = '';
        solutions.forEach((sol, index) => {
            const isRecommended = index === 0;
            tableRows += `
                <tr class="${isRecommended ? 'recommended-row' : ''}">
                    <td>
                        <strong>${sol.profile}</strong>
                        ${isRecommended ? '<span class="recommended-badge">RECOMENDADO</span>' : ''}
                    </td>
                    <td>${sol.numBelts}</td>
                    <td>${sol.d_comm} mm</td>
                    <td>${sol.D_comm} mm</td>
                    <td>${sol.actualRatio.toFixed(2)}</td>
                    <td>${sol.L.toFixed(0)} mm</td>
                </tr>
            `;
        });

        // ### INÍCIO DA ALTERAÇÃO ###
        // A estrutura HTML dos banners de resultado foi modificada para usar um grid.
        const resultHTML = `
            <div class="result-content">
                <div class="results-grid">
                    <div class="result-item">
                        <span class="label">Relação de Transmissão Original</span>
                        <span class="value">${original.targetRatio.toFixed(3)}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Potência de Projeto Necessária</span>
                        <span class="value">${original.designPower.toFixed(2)} CV</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Diâmetro-Alvo Motor (d)</span>
                        <span class="value">${original.d_target.toFixed(2)} mm</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Diâmetro-Alvo Movido (D)</span>
                        <span class="value">${original.D_target.toFixed(2)} mm</span>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Perfil</th>
                                <th>Nº de Correias</th>
                                <th>Polia Motora</th>
                                <th>Polia Movida</th>
                                <th>Relação Real</th>
                                <th>Comprimento Correia</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>`;
        // ### FIM DA ALTERAÇÃO ###
        showResult(resultHTML);
    }

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="result-placeholder error-state">
                <i class="fa-solid fa-triangle-exclamation" style="color: var(--cor-erro);"></i>
                <p>${message}</p>
                <small>Verifique se todos os valores estão corretos e tente novamente.</small>
            </div>`;
        
        // Adicionar feedback visual temporário
        calculateButton.style.background = 'var(--cor-erro)';
        setTimeout(() => {
            calculateButton.style.background = '';
        }, 2000);
    }
    
    function validateInputField(field, min = 0, max = Infinity) {
        const value = parseFloat(field.value);
        const isValid = !isNaN(value) && value > min && value <= max;
        
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
        
        return isValid;
    }
    
    function validateAllInputs() {
        const inputs = [
            { field: document.getElementById('gear-teeth-motor'), min: 8, max: 200 },
            { field: document.getElementById('gear-teeth-driven'), min: 8, max: 500 },
            { field: document.getElementById('motor-rpm'), min: 100, max: 10000 },
            { field: document.getElementById('motor-cv'), min: 0.5, max: 1000 },
            { field: document.getElementById('center-distance'), min: 50, max: 5000 }
        ];
        
        let allValid = true;
        inputs.forEach(({field, min, max}) => {
            if (field && !validateInputField(field, min, max)) {
                allValid = false;
            }
        });
        
        return allValid;
    }

    function showResult(html) { resultsContainer.innerHTML = html; }
    function clearResults() { resultsContainer.innerHTML = placeholderHTML; }
    
    function exportToPDF() {
        if (!window.currentResults) return;
        
        const { solutions, original } = window.currentResults;
        let content = `RELATÓRIO DE SUBSTITUIÇÃO DE ENGRENAGENS POR POLIAS\n\n`;
        content += `Relação Original: ${original.targetRatio.toFixed(3)}\n`;
        content += `Potência de Projeto: ${original.designPower.toFixed(2)} CV\n\n`;
        content += `SOLUÇÕES RECOMENDADAS:\n`;
        
        solutions.forEach((sol, i) => {
            content += `${i + 1}. Perfil ${sol.profile} - ${sol.numBelts} correias\n`;
            content += `   Polias: ${sol.d_comm}mm x ${sol.D_comm}mm\n`;
            content += `   Relação: ${sol.actualRatio.toFixed(2)}\n\n`;
        });
        
        // Simular download (em uma implementação real, usaria uma biblioteca de PDF)
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_polias.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    function resetForm() {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
            input.classList.remove('valid', 'invalid');
        });
        clearResults();
        document.getElementById('export-pdf-button').style.display = 'none';
        document.getElementById('export-excel-button').style.display = 'none';
    }

    // --- EVENT LISTENERS ---
    calculateButton.addEventListener('click', findEquivalentSystem);
    clearResultsButton.addEventListener('click', clearResults);
    
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }
    
    const exportPdfButton = document.getElementById('export-pdf-button');
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', exportToPDF);
    }
    
    // Validação em tempo real
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('blur', () => validateInputField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateInputField(input);
            }
        });
    });

    // --- INICIALIZAÇÃO ---
    initializeUI();
});
