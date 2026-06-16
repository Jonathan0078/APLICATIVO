// Espera que o DOM esteja completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a biblioteca de ícones Lucide
    lucide.createIcons();

    // --- LÓGICA DO TEMA (CLARO/ESCURO) ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const body = document.body;

    /**
     * Aplica o tema (claro ou escuro) ao corpo do documento.
     * @param {string} theme - O tema a ser aplicado ('dark' ou 'light').
     */
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    };

    // Adiciona um evento para alternar o tema quando o botão é clicado
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    
    // Define 'light' como padrão se nenhum tema estiver guardado no localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


    // --- LÓGICA DE CÁLCULO DO SELO MECÂNICO ---
    const calculateBtn = document.getElementById('calculateBtn');

    calculateBtn.addEventListener('click', () => {
        // Obtenção dos valores dos campos de entrada
        const inputs = {
            pressaoBar: parseFloat(document.getElementById('pressao').value),
            rpm: parseFloat(document.getElementById('rpm').value),
            de: parseFloat(document.getElementById('de').value),
            di: parseFloat(document.getElementById('di').value),
            fmola: parseFloat(document.getElementById('fmola').value)
        };
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = ''; // Limpa resultados anteriores

        // Validação dos dados de entrada
        const invalidInputs = Object.values(inputs).some(v => isNaN(v) || v <= 0);
        if (invalidInputs || inputs.de <= inputs.di) {
            resultsContent.innerHTML = `
                <div class="result-placeholder">
                    <i data-lucide="alert-triangle" style="color: var(--cor-erro);"></i>
                    <p>Por favor, preencha todos os campos com valores válidos. 'De' deve ser maior que 'Di'.</p>
                </div>
            `;
            lucide.createIcons(); // Recria os ícones após a alteração do HTML
            return;
        }

        // Execução dos cálculos de engenharia
        const PI = Math.PI;
        const area = (PI / 4) * (Math.pow(inputs.de, 2) - Math.pow(inputs.di, 2));
        const pressaoMPa = inputs.pressaoBar * 0.1; // Conversão de bar para MPa
        const fh = pressaoMPa * area;
        const fc = inputs.fmola + fh;
        const pc = fc / area;
        const dm_m = ((inputs.de + inputs.di) / 2) / 1000; // Diâmetro médio em metros
        const v = (PI * dm_m * inputs.rpm) / 60;
        const pv = pc * v;

        // Limites do Fator PV para diferentes materiais
        const pvLimits = {
            'Carvão x Cerâmica': 5,
            'Carvão x SiC': 12,
            'TC x TC': 18,
            'SiC x SiC': 25
        };
        
        // Geração do HTML para a análise de compatibilidade
        let pvAnalysisHTML = '<ul>';
        for (const material in pvLimits) {
            const limit = pvLimits[material];
            if (pv <= limit) {
                pvAnalysisHTML += `<li class="success"><i data-lucide="check-circle"></i><strong>${material}:</strong> Aprovado</li>`;
            } else {
                pvAnalysisHTML += `<li class="error"><i data-lucide="x-circle"></i><strong>${material}:</strong> Reprovado</li>`;
            }
        }
        pvAnalysisHTML += '</ul>';

        // Geração do HTML final com todos os resultados
        resultsContent.innerHTML = `
            <div class="result-content">
                <div class="result-header">
                    <span class="label">Fator PV (Pressão x Velocidade)</span>
                    <span class="designation-value">${pv.toFixed(2)} <span style="font-size: 1.5rem; color: var(--cor-texto-suave);">MPa·m/s</span></span>
                </div>
                <div class="results-grid">
                    <div class="result-item">
                        <span class="label">Área (A)</span>
                        <span class="value">${area.toFixed(2)} mm²</span>
                        <span class="formula">π/4 * (De² - Di²)</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Força Hidráulica (Fh)</span>
                        <span class="value">${fh.toFixed(2)} N</span>
                        <span class="formula">P_mpa * A</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Força Total (Fc)</span>
                        <span class="value">${fc.toFixed(2)} N</span>
                        <span class="formula">F_mola + Fh</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Pressão Contato (Pc)</span>
                        <span class="value">${pc.toFixed(2)} MPa</span>
                        <span class="formula">Fc / A</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Velocidade (V)</span>
                        <span class="value">${v.toFixed(2)} m/s</span>
                        <span class="formula">(π * Dm * RPM) / 60</span>
                    </div>
                    <div class="result-item notes-item">
                        <span class="label">Análise de Compatibilidade (PV)</span>
                        <div class="value">${pvAnalysisHTML}</div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons(); // Recria os ícones após a alteração do HTML
    });
});

