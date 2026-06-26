document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO TEMA (CLARO/ESCURO) ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    // --- LÓGICA DE CÁLCULO ---
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calcularSelo);
    }
    
    // Listener para calcular ao apertar 'Enter' nos inputs
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calcularSelo();
            }
        });
    });
});

// Função para alternar o tema
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Função para exibir alertas de validação
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
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

// Função para resetar os campos e voltar ao estado inicial
function limparDados() {
    document.querySelectorAll('input').forEach(input => {
        if(input.type !== 'checkbox') input.value = '';
    });
    document.getElementById('solidos').value = 'nao';
    
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = `
        <div class="info-box" style="text-align: center; padding: 3rem 1rem;">
            <i class="fa-solid fa-clipboard-list" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
            <p data-i18n="selo.results_placeholder" style="color: var(--text-secondary); font-weight: 600;">Os resultados da sua análise aparecerão aqui.</p>
        </div>
    `;
    hideError();
}

// Função principal de cálculo da engenharia
function calcularSelo() {
    hideError();

    // Obtenção dos valores
    const inputs = {
        pressaoBar: parseFloat(document.getElementById('pressao').value),
        rpm: parseFloat(document.getElementById('rpm').value),
        de: parseFloat(document.getElementById('de').value),
        di: parseFloat(document.getElementById('di').value),
        fmola: parseFloat(document.getElementById('fmola').value)
    };
    
    const resultsContent = document.getElementById('results-content');

    // Validação
    const invalidInputs = Object.values(inputs).some(v => isNaN(v) || v <= 0);
    if (invalidInputs) {
        showError(i18n.t('selo.fill_positive'));
        return;
    }
    if (inputs.de <= inputs.di) {
        showError(i18n.t('selo.de_gt_di'));
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
    
    // Geração da análise de compatibilidade
    let pvAnalysisHTML = '<div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">';
    let maxPV = 0;
    let anyApproved = false;
    
    for (const material in pvLimits) {
        const limit = pvLimits[material];
        if (limit > maxPV) maxPV = limit;
        
        if (pv <= limit) {
            pvAnalysisHTML += `
                <div style="color: var(--cor-sucesso); display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                    <i class="fa-solid fa-circle-check"></i>                     <span><strong>${material}:</strong> ${i18n.t('selo.approved_pv', { limit })}</span>
                </div>`;
            anyApproved = true;
        } else {
            pvAnalysisHTML += `
                <div style="color: var(--cor-erro); display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                    <i class="fa-solid fa-circle-xmark"></i>                     <span><strong>${material}:</strong> ${i18n.t('selo.reproved_pv', { limit })}</span>
                </div>`;
        }
    }
    pvAnalysisHTML += '</div>';
    
    // Define a cor da borda principal do card (verde, amarelo ou vermelho)
    let overallStatusClass = anyApproved ? (pv > (maxPV * 0.8) ? 'warning' : 'success') : 'error';

    // Injeção do HTML final formatado
    resultsContent.innerHTML = `
        <div class="resultado-container ${overallStatusClass}">
            <h3 style="margin-bottom: 1.2rem; font-size: 1.1rem;"><i class="fa-solid fa-chart-pie"></i> ${i18n.t('selo.pv_results_title')}</h3>
            
            <div class="resultado-display" style="margin-bottom: 1.5rem; background: var(--bg); padding: 1rem; border-radius: var(--radius-sm);">
                <span class="result-main-text" style="color: var(--primary); font-size: 1.6rem;">
                    ${i18n.t('selo.pv_max')}: ${pv.toFixed(2)} <span style="font-size: 1rem; color: var(--text-secondary);">MPa·m/s</span>
                </span>
                <span class="result-sub-text" style="margin-top: 0.5rem;"><i class="fa-solid fa-compress"></i> ${i18n.t('selo.contact_pressure')}: <strong>${pc.toFixed(2)} MPa</strong></span>
                <span class="result-sub-text"><i class="fa-solid fa-gauge-high"></i> ${i18n.t('selo.velocity')}: <strong>${v.toFixed(2)} m/s</strong></span>
            </div>
            
            <h4 style="margin-bottom: 0.8rem; color: var(--primary); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; font-size: 1rem;">${i18n.t('selo.dynamic_params')}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: var(--bg); padding: 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                    <strong style="color: var(--text-secondary); font-size: 0.8rem; display: block; margin-bottom: 0.3rem;">${i18n.t('selo.contact_area')}</strong>
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text);">${area.toFixed(2)} mm²</span>
                </div>
                <div style="background: var(--bg); padding: 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                    <strong style="color: var(--text-secondary); font-size: 0.8rem; display: block; margin-bottom: 0.3rem;">${i18n.t('selo.total_force')}</strong>
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text);">${fc.toFixed(2)} N</span>
                </div>
                <div style="background: var(--bg); padding: 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                    <strong style="color: var(--text-secondary); font-size: 0.8rem; display: block; margin-bottom: 0.3rem;">${i18n.t('selo.hydraulic_force')}</strong>
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text);">${fh.toFixed(2)} N</span>
                </div>
            </div>

            <h4 style="margin-bottom: 0.8rem; color: var(--primary); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; font-size: 1rem;">${i18n.t('selo.face_recommendation')}</h4>
            ${pvAnalysisHTML}
        </div>
    `;
}
