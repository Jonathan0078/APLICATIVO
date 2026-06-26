let comparisonData = [];
let charts = {};
let currentTab = 'torque';
let ultimoCalculo = null;

// Tabela de propriedades mecânicas ISO 898-1 (Limite de Escoamento - Sy)
const propriedadesISO = {
    '5.6': { sy: 300, su: 500 },
    '8.8': { sy: 640, su: 800 },
    '10.9': { sy: 940, su: 1040 },
    '12.9': { sy: 1100, su: 1220 }
};

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa gráficos em branco
    initializeCharts();

    // Configuração do Theme Switcher (Dark Mode)
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
            updateAllChartOptions();
        }
    }

    // Listener para calcular ao apertar 'Enter'
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateScrew();
            }
        });
    });
});

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    updateAllChartOptions();
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

    if (tabName === 'tension' && ultimoCalculo) {
        updateTensionChart();
    }
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

function calculateScrew() {
    hideError();
    
    const d = parseFloat(document.getElementById('diametro').value);
    const p = parseFloat(document.getElementById('passo').value);
    const k = parseFloat(document.getElementById('fatorK').value);
    const classe = document.getElementById('classe').value;
    const nome = document.getElementById('boltName').value || `M${d}x${p} - ${i18n.t('parafuso.cl_prefix')} ${classe}`;

    // Validações
    const validationErrors = [];
    if (isNaN(d) || d <= 0) validationErrors.push(i18n.t('parafuso.err_diam'));
    if (isNaN(p) || p <= 0) validationErrors.push(i18n.t('parafuso.err_passo'));
    if (isNaN(k) || k <= 0) validationErrors.push(i18n.t('parafuso.err_k'));

    if (validationErrors.length > 0) {
        showError(validationErrors.join('<br>'));
        return;
    }

    try {
        const sy = propriedadesISO[classe].sy; // Limite de escoamento em MPa (N/mm²)
        
        // Área de Tensão (At) para roscas métricas ISO
        const at = (Math.PI / 4) * Math.pow(d - 0.9382 * p, 2);
        
        // Força de Pré-carga (F) assumindo 75% do limite de escoamento
        const forca = 0.75 * sy * at; // Resultado em Newtons (N)
        
        // Torque (T) em N.m
        const torque = k * forca * (d / 1000); 

        ultimoCalculo = { nome, d, p, classe, k, at, forca, torque, sy };
        
        showResult();
        updateTensionChart();
        
    } catch (error) {
        showError(i18n.t('parafuso.error_calc'));
    }
}

function showResult() {
    const resultDiv = document.getElementById('result');
    const { torque, forca, at } = ultimoCalculo;

    resultDiv.innerHTML = `
        <h3>${i18n.t('parafuso.res_especificacoes')}</h3>
        <div class="resultado-display" style="margin-bottom: 1rem;">
            <span class="result-main-text" style="color: var(--primary); font-size: 1.5rem;">
                ${i18n.t('parafuso.res_torque')}: ${torque.toFixed(2)} N.m
            </span>
            <span class="result-sub-text">${i18n.t('parafuso.res_forca')}: ${(forca / 1000).toFixed(2)} kN</span>
            <span class="result-sub-text">${i18n.t('parafuso.res_area')}: ${at.toFixed(2)} mm²</span>
        </div>
    `;
    
    resultDiv.className = 'resultado-container success';
    resultDiv.classList.remove('hidden');
}

function addToComparison() {
    if (!ultimoCalculo) {
        showError(i18n.t('parafuso.error_calc_first'));
        return;
    }

    comparisonData.push({...ultimoCalculo});
    updateComparisonTable();
    showError(`✅ ${ultimoCalculo.nome} ${i18n.t('parafuso.added_to_compare')}`);
    
    // Altera a cor do alerta para simular sucesso
    const errorContainer = document.getElementById('error-container');
    errorContainer.classList.remove('error');
    errorContainer.classList.add('success');
    
    setTimeout(() => {
        errorContainer.classList.remove('success');
        errorContainer.classList.add('error');
    }, 5000);
}

function updateComparisonTable() {
    const container = document.getElementById('comparisonTableContainer');
    if (!container || comparisonData.length === 0) {
        container.innerHTML = '<p>' + i18n.t('parafuso.comparacao_empty') + '</p>';
        return;
    }

    let tableHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>${i18n.t('parafuso.th_elemento')}</th>
                    <th>${i18n.t('parafuso.th_dimensao')}</th>
                    <th>${i18n.t('parafuso.th_classe')}</th>
                    <th>${i18n.t('parafuso.th_torque')}</th>
                    <th>${i18n.t('parafuso.th_precarga')}</th>
                    <th>${i18n.t('parafuso.th_acao')}</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    comparisonData.forEach((item, index) => {
        tableHTML += `
            <tr>
                <td><strong>${item.nome}</strong></td>
                <td>M${item.d}x${item.p}</td>
                <td>${item.classe}</td>
                <td><strong>${item.torque.toFixed(2)}</strong></td>
                <td>${(item.forca / 1000).toFixed(2)}</td>
                <td><button onclick="removeFromComparison(${index})" class="remove-btn"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

function removeFromComparison(index) {
    comparisonData.splice(index, 1);
    updateComparisonTable();
}

function getChartOptions() {
    const isDark = document.body.classList.contains('dark-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? '#e9ecef' : '#6c757d';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y} MPa`;
                    }
                }
            }
        },
        scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { 
                beginAtZero: true, 
                title: { display: true, text: i18n.t('parafuso.chart_tensao'), color: textColor },
                ticks: { color: textColor }, 
                grid: { color: gridColor } 
            }
        }
    };
}

function initializeCharts() {
    const ctx = document.getElementById('viscosityChart');
    if (ctx) {
        charts.tension = new Chart(ctx, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: getChartOptions()
        });
    }
}

function updateTensionChart() {
    if (!charts.tension || !ultimoCalculo) return;
    
    const { sy, classe } = ultimoCalculo;
    const su = propriedadesISO[classe].su;
    const tensaoTrabalho = sy * 0.75; // Tensão correspondente à pré-carga
    
    const isDark = document.body.classList.contains('dark-theme');
    const labelColor = isDark ? '#e9ecef' : '#212529';

    charts.tension.data = {
        labels: [i18n.t('parafuso.label_tensao_aplicada'), i18n.t('parafuso.label_limite_escoamento'), i18n.t('parafuso.label_ruptura')],
        datasets: [{
            label: 'Nível de Tensão',
            data: [tensaoTrabalho, sy, su],
            backgroundColor: [
                'rgba(40, 167, 69, 0.8)',   // Verde (Seguro)
                'rgba(255, 193, 7, 0.8)',   // Amarelo (Escoamento)
                'rgba(220, 53, 69, 0.8)'    // Vermelho (Ruptura)
            ],
            borderColor: [
                '#28a745',
                '#ffc107',
                '#dc3545'
            ],
            borderWidth: 1,
            borderRadius: 4
        }]
    };
    
    charts.tension.update();
}

function updateAllChartOptions() {
    if (charts.tension) { 
        charts.tension.options = getChartOptions(); 
        charts.tension.update(); 
    }
}
