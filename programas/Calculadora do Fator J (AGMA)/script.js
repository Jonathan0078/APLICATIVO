// Variáveis globais para armazenar resultados
let calculationResults = {};

// --- THEME TOGGLE ---
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const htmlElement = document.documentElement;
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    
    // Listener para mudanças
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            htmlElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});

// Função para calcular o Fator J
function calculateJFactor() {
    // Obter valores do formulário
    const inputs = {
        numTeethGear: parseFloat(document.getElementById('numTeethGear').value),
        numTeethPinion: parseFloat(document.getElementById('numTeethPinion').value),
        module: parseFloat(document.getElementById('module').value),
        pressureAngle: parseFloat(document.getElementById('pressureAngle').value),
        addendumCoeff: parseFloat(document.getElementById('addendumCoeff').value),
        faceWidth: parseFloat(document.getElementById('faceWidth').value),
        tangentialLoad: parseFloat(document.getElementById('tangentialLoad').value),
        shaperTeeth: parseFloat(document.getElementById('shaperTeeth').value),
        filletRadius: parseFloat(document.getElementById('filletRadius').value)
    };

    // Validar inputs
    if (!validateInputs(inputs)) {
        alert('Por favor, verifique os valores de entrada!');
        return;
    }

    // Calcular parâmetros intermediários
    const params = calculateIntermediateParameters(inputs);

    // Calcular J-factor para cada abordagem selecionada
    const results = {};

    if (document.getElementById('approach1').checked) {
        results.approach1 = calculateApproach1(params, inputs);
    }

    if (document.getElementById('approach2').checked) {
        results.approach2 = calculateApproach2(params, inputs);
    }

    if (document.getElementById('approach3').checked) {
        results.approach3 = calculateApproach3(params, inputs);
    }

    // Armazenar resultados globalmente
    calculationResults = {
        inputs: inputs,
        params: params,
        results: results
    };

    // Exibir resultados
    displayResults(inputs, params, results);
}

// Função para validar inputs
function validateInputs(inputs) {
    if (inputs.numTeethGear < 20 || inputs.numTeethGear > 500) return false;
    if (inputs.numTeethPinion < 10 || inputs.numTeethPinion > 100) return false;
    if (inputs.module <= 0 || inputs.module > 10) return false;
    if (inputs.pressureAngle < 15 || inputs.pressureAngle > 30) return false;
    if (inputs.faceWidth <= 0) return false;
    if (inputs.tangentialLoad <= 0) return false;
    return true;
}

// Função para calcular parâmetros intermediários
function calculateIntermediateParameters(inputs) {
    const N = inputs.numTeethGear;
    const x = inputs.addendumCoeff;
    const φn = inputs.pressureAngle * Math.PI / 180; // Converter para radianos
    const mn = inputs.module;
    const Ns = inputs.shaperTeeth;
    const rf = inputs.filletRadius;

    // Raio primitivo
    const rp = (N * mn) / 2;

    // Raio de base
    const rb = rp * Math.cos(φn);

    // Raio de adendo
    const ra = rp + (1 + x) * mn;

    // Raio de dedendo
    const rd = rp - 1.25 * mn;

    // Ângulo de espessura angular no raio de base
    const gammaB = (Math.PI / (2 * N)) + (2 * x * Math.tan(φn)) / N;

    // Raio no qual o carregamento é aplicado (HPSTC - Highest Point of Single Tooth Contact)
    const rL = ra; // Aproximação: ponto de contato na ponta do dente

    // Ângulo de carga
    const φnL = Math.acos(rb / rL);

    // Espessura do dente em uma seção
    const sF = 2 * rb * Math.tan(gammaB / 2);

    // Raio de curvatura aproximado da trocoide
    const rF = rf + (N * mn) / (2 * Ns);

    return {
        N: N,
        x: x,
        φn: φn,
        φnDeg: inputs.pressureAngle,
        mn: mn,
        Ns: Ns,
        rf: rf,
        rp: rp,
        rb: rb,
        ra: ra,
        rd: rd,
        gammaB: gammaB,
        rL: rL,
        φnL: φnL,
        sF: sF,
        rF: rF
    };
}

// Abordagem #1 (AGMA 908-B89)
function calculateApproach1(params, inputs) {
    const φn = params.φnDeg * Math.PI / 180;
    
    // Coeficientes de Dolan e Broghamer (modificados para AGMA 908-B89)
    const H = 0.331 - 0.436 * params.φnDeg * Math.PI / 180;
    const L = 0.324 - 0.492 * params.φnDeg * Math.PI / 180;
    const M = 0.261 + 0.545 * params.φnDeg * Math.PI / 180;

    // Fator de correção de tensão Kf
    const Kf = 1 + Math.exp(H + L * Math.log(params.rF) + M / Math.log(params.rF));

    // Braço do momento (altura do ponto de carga até a seção crítica)
    const hF = params.rL * Math.sin(params.φnL) - params.rb;

    // Fator J (Abordagem #1)
    const J = (hF * Math.sin(params.φnL)) / (params.sF * params.sF * Kf);

    // Tensão no dente
    const sigma_b = (inputs.tangentialLoad * Kf) / (inputs.faceWidth * inputs.module * J);

    return {
        Kf: Kf.toFixed(4),
        hF: hF.toFixed(4),
        J: Math.max(J, 0.05).toFixed(6), // Mínimo J de 0.05
        sigma_b: sigma_b.toFixed(2),
        approach: 'AGMA 908-B89',
        description: 'Parábola de Lewis com raio mínimo da trocoide'
    };
}

// Abordagem #2 (AGMA 911-B21)
function calculateApproach2(params, inputs) {
    const φn = params.φnDeg * Math.PI / 180;
    
    // Coeficientes modificados para AGMA 911-B21
    const H = 0.3255 - 0.4167 * params.φnDeg * Math.PI / 180;
    const L = 0.3318 - 0.5209 * params.φnDeg * Math.PI / 180;
    const M = 0.2682 + 0.5259 * params.φnDeg * Math.PI / 180;

    // Fator de correção de tensão Kf (para filete circular)
    const Kf = 1 + Math.exp(H + L * Math.log(params.rF) + M / Math.log(params.rF));

    // Raio do filete circular aproximado
    const rFiletCircular = params.rd + 1.25 * inputs.module * 0.38;

    // Ajuste para filete circular
    const KfCircular = 1.3 + 0.5 / Math.sqrt(params.rF);

    // Braço do momento
    const hF = params.rL * Math.sin(params.φnL) - params.rb;

    // Fator J (Abordagem #2)
    const J = (hF * Math.sin(params.φnL)) / (params.sF * params.sF * KfCircular);

    // Tensão no dente
    const sigma_b = (inputs.tangentialLoad * KfCircular) / (inputs.faceWidth * inputs.module * J);

    return {
        Kf: KfCircular.toFixed(4),
        hF: hF.toFixed(4),
        J: Math.max(J, 0.05).toFixed(6),
        sigma_b: sigma_b.toFixed(2),
        approach: 'AGMA 911-B21',
        description: 'Filete circular aproximado'
    };
}

// Abordagem #3 (Híbrida)
function calculateApproach3(params, inputs) {
    const φn = params.φnDeg * Math.PI / 180;
    
    // Combina trocoide real com coeficientes AGMA 908-B89
    const H = 0.331 - 0.436 * params.φnDeg * Math.PI / 180;
    const L = 0.324 - 0.492 * params.φnDeg * Math.PI / 180;
    const M = 0.261 + 0.545 * params.φnDeg * Math.PI / 180;

    // Fator de correção para trocoide real (híbrido)
    const rFTrochoid = params.rF * (1 + 0.15 * Math.sin(params.φnL));
    const Kf = 1 + Math.exp(H + L * Math.log(rFTrochoid) + M / Math.log(rFTrochoid));

    // Braço do momento
    const hF = params.rL * Math.sin(params.φnL) - params.rb;

    // Fator J (Abordagem #3) - menos conservadora
    const J = (hF * Math.sin(params.φnL)) / (params.sF * params.sF * Kf * 0.95); // Fator de ajuste

    // Tensão no dente
    const sigma_b = (inputs.tangentialLoad * Kf) / (inputs.faceWidth * inputs.module * J);

    return {
        Kf: Kf.toFixed(4),
        hF: hF.toFixed(4),
        J: Math.max(J, 0.05).toFixed(6),
        sigma_b: sigma_b.toFixed(2),
        approach: 'Abordagem Híbrida',
        description: 'Trocoide real com coeficientes AGMA 908-B89'
    };
}

// Função para exibir resultados
function displayResults(inputs, params, results) {
    const resultDisplay = document.getElementById('result-display');
    const parametersCard = document.getElementById('parameters-card');
    const stressCard = document.getElementById('stress-card');

    // Limpar conteúdo anterior e mostrar resultados
    resultDisplay.innerHTML = '';

    // Exibir resultados principais em cards
    let resultsHTML = '<div class="result-content">';

    Object.keys(results).forEach((approach) => {
        const result = results[approach];
        resultsHTML += `
            <div class="result-header">
                <div class="label">${result.approach}</div>
                <div class="value">${(parseFloat(result.J)).toFixed(4)}</div>
                <div style="font-size: 0.9rem; color: var(--cor-texto-suave); margin-top: 0.5rem;">
                    <strong>σ<sub>b</sub>:</strong> ${(parseFloat(result.sigma_b)).toFixed(2)} MPa
                </div>
            </div>
        `;
    });

    resultsHTML += '</div>';
    resultDisplay.innerHTML = resultsHTML;

    // Exibir parâmetros intermediários
    const parametersTableBody = document.getElementById('parametersTableBody');
    parametersTableBody.innerHTML = `
        <tr>
            <td>Número de Dentes (N)</td>
            <td>${params.N}</td>
            <td>dentes</td>
        </tr>
        <tr>
            <td>Raio Primitivo</td>
            <td>${params.rp.toFixed(4)}</td>
            <td>mm</td>
        </tr>
        <tr>
            <td>Raio de Base</td>
            <td>${params.rb.toFixed(4)}</td>
            <td>mm</td>
        </tr>
        <tr>
            <td>Raio de Adendo</td>
            <td>${params.ra.toFixed(4)}</td>
            <td>mm</td>
        </tr>
        <tr>
            <td>Raio de Dedendo</td>
            <td>${params.rd.toFixed(4)}</td>
            <td>mm</td>
        </tr>
        <tr>
            <td>Raio de Curvatura do Filete</td>
            <td>${params.rF.toFixed(4)}</td>
            <td>mm</td>
        </tr>
        <tr>
            <td>Espessura do Dente na Seção Crítica</td>
            <td>${params.sF.toFixed(4)}</td>
            <td>mm</td>
        </tr>
        <tr>
            <td>Ângulo de Pressão Normal</td>
            <td>${params.φnDeg}</td>
            <td>°</td>
        </tr>
    `;
    parametersCard.style.display = 'block';

    // Exibir análise de tensão em cards
    let stressCardsHTML = '<div class="results-grid">';

    Object.keys(results).forEach((approach) => {
        const result = results[approach];
        stressCardsHTML += `
            <div class="result-item">
                <div class="label">${result.approach}</div>
                <div class="value">${(parseFloat(result.sigma_b)).toFixed(2)}</div>
                <div class="unit">MPa (Tensão de Flexão)</div>
            </div>
        `;
    });

    stressCardsHTML += '</div>';
    document.getElementById('stressResults').innerHTML = stressCardsHTML;
    stressCard.style.display = 'block';
}

// Função para limpar o formulário
function resetForm() {
    document.getElementById('numTeethGear').value = '100';
    document.getElementById('numTeethPinion').value = '25';
    document.getElementById('module').value = '1.0';
    document.getElementById('pressureAngle').value = '20';
    document.getElementById('addendumCoeff').value = '0.8';
    document.getElementById('faceWidth').value = '10';
    document.getElementById('tangentialLoad').value = '1000';
    document.getElementById('shaperTeeth').value = '50';
    document.getElementById('filletRadius').value = '0.25';
    document.getElementById('approach1').checked = true;
    document.getElementById('approach2').checked = true;
    document.getElementById('approach3').checked = true;

    // Limpar resultados
    document.getElementById('result-display').innerHTML = `
        <div class="result-placeholder">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>Execute o cálculo para ver os resultados...</p>
        </div>
    `;
    document.getElementById('parameters-card').style.display = 'none';
    document.getElementById('stress-card').style.display = 'none';
}

// Função para exportar resultados
function exportResults() {
    if (!calculationResults.results || Object.keys(calculationResults.results).length === 0) {
        alert('Nenhum resultado para exportar!');
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Cabeçalho
    csvContent += 'Relatório de Cálculo do Fator J (AGMA)\n';
    csvContent += new Date().toLocaleString('pt-BR') + '\n\n';

    // Parâmetros de entrada
    csvContent += 'PARÂMETROS DE ENTRADA\n';
    csvContent += 'Número de Dentes (Engrenagem Interna),' + calculationResults.inputs.numTeethGear + '\n';
    csvContent += 'Número de Dentes (Pinhão Externo),' + calculationResults.inputs.numTeethPinion + '\n';
    csvContent += 'Módulo Normal,' + calculationResults.inputs.module + '\n';
    csvContent += 'Ângulo de Pressão Normal,' + calculationResults.inputs.pressureAngle + '\n';
    csvContent += 'Coeficiente de Adendo,' + calculationResults.inputs.addendumCoeff + '\n';
    csvContent += 'Largura da Face,' + calculationResults.inputs.faceWidth + '\n';
    csvContent += 'Carga Tangencial,' + calculationResults.inputs.tangentialLoad + '\n';
    csvContent += 'Dentes da Ferramenta Geradora,' + calculationResults.inputs.shaperTeeth + '\n';
    csvContent += 'Raio do Filete,' + calculationResults.inputs.filletRadius + '\n\n';

    // Parâmetros calculados
    csvContent += 'PARÂMETROS INTERMEDIÁRIOS\n';
    csvContent += 'Raio Primitivo (mm),' + calculationResults.params.rp.toFixed(4) + '\n';
    csvContent += 'Raio de Base (mm),' + calculationResults.params.rb.toFixed(4) + '\n';
    csvContent += 'Raio de Curvatura do Filete (mm),' + calculationResults.params.rF.toFixed(4) + '\n';
    csvContent += 'Espessura do Dente (mm),' + calculationResults.params.sF.toFixed(4) + '\n\n';

    // Resultados
    csvContent += 'RESULTADOS\n';
    csvContent += 'Abordagem,Fator J,Tensão (MPa),Fator Kf\n';

    Object.keys(calculationResults.results).forEach((approach) => {
        const result = calculationResults.results[approach];
        csvContent += result.approach + ',' + result.J + ',' + result.sigma_b + ',' + result.Kf + '\n';
    });

    // Criar link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AGMA_JFactor_Report_' + new Date().getTime() + '.csv');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', function() {
    // Preenchimento padrão já está no HTML
    // Adicionar listeners para validação em tempo real
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach(field => {
        field.addEventListener('change', function() {
            if (this.value === '' || isNaN(this.value)) {
                this.value = this.getAttribute('value');
            }
        });
    });
});

// Permitir cálculo ao pressionar Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        calculateJFactor();
    }
});
