let comparisonData = [];
let charts = {};
let currentTab = 'viscosity';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts(true);
    updateViscosityChart();
    updateDistributionChart();

    // Setup theme switcher
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

    // Initialize compatibility elements
    const grease1Select = document.getElementById('grease1');
    const grease2Select = document.getElementById('grease2');
    const checkButton = document.querySelector('button[onclick*="checkCompatibility"]');
    if (grease1Select && grease2Select && checkButton) {
        const resultContainer = document.getElementById('compatibility-result-container');
        if (resultContainer) {
            resultContainer.classList.add('hidden');
        }
    }

    // Initialize mobile handlers
    initializeMobileHandlers();

    // Add keypress listener for number inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateVI();
            }
        });
    });

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
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

    // Update charts if needed
    if (tabName === 'distribution') {
        updateDistributionChart();
    } else if (tabName === 'viscosity') {
        updateViscosityChart();
    } else if (tabName === 'comparison') {
        updateComparisonChart();
    }
}

const compatibilityMatrix = {
    'Lítio': {'Lítio':'✅ Compatível','Lítio Complexo':'✅ Compatível','Cálcio':'⚠️ Parcialmente Compatível','Cálcio Complexo':'⚠️ Parcialmente Compatível','Alumínio Complexo':'⚠️ Parcialmente Compatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'⚠️ Parcialmente Compatível'},
    'Lítio Complexo': {'Lítio':'✅ Compatível','Lítio Complexo':'✅ Compatível','Cálcio':'⚠️ Parcialmente Compatível','Cálcio Complexo':'⚠️ Parcialmente Compatível','Alumínio Complexo':'⚠️ Parcialmente Compatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'⚠️ Parcialmente Compatível'},
    'Cálcio': {'Lítio':'⚠️ Parcialmente Compatível','Lítio Complexo':'⚠️ Parcialmente Compatível','Cálcio':'✅ Compatível','Cálcio Complexo':'✅ Compatível','Alumínio Complexo':'⚠️ Parcialmente Compatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'⚠️ Parcialmente Compatível'},
    'Cálcio Complexo': {'Lítio':'⚠️ Parcialmente Compatível','Lítio Complexo':'⚠️ Parcialmente Compatível','Cálcio':'✅ Compatível','Cálcio Complexo':'✅ Compatível','Alumínio Complexo':'⚠️ Parcialmente Compatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'⚠️ Parcialmente Compatível'},
    'Alumínio Complexo': {'Lítio':'⚠️ Parcialmente Compatível','Lítio Complexo':'⚠️ Parcialmente Compatível','Cálcio':'⚠️ Parcialmente Compatível','Cálcio Complexo':'⚠️ Parcialmente Compatível','Alumínio Complexo':'✅ Compatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'⚠️ Parcialmente Compatível'},
    'Poliureia': {'Lítio':'❌ Incompatível','Lítio Complexo':'❌ Incompatível','Cálcio':'❌ Incompatível','Cálcio Complexo':'❌ Incompatível','Alumínio Complexo':'❌ Incompatível','Poliureia':'✅ Compatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'❌ Incompatível'},
    'Bentonita / Sílica': {'Lítio':'❌ Incompatível','Lítio Complexo':'❌ Incompatível','Cálcio':'❌ Incompatível','Cálcio Complexo':'❌ Incompatível','Alumínio Complexo':'❌ Incompatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'✅ Compatível','Sulfonato de Cálcio':'❌ Incompatível'},
    'Sulfonato de Cálcio': {'Lítio':'⚠️ Parcialmente Compatível','Lítio Complexo':'⚠️ Parcialmente Compatível','Cálcio':'⚠️ Parcialmente Compatível','Cálcio Complexo':'⚠️ Parcialmente Compatível','Alumínio Complexo':'⚠️ Parcialmente Compatível','Poliureia':'❌ Incompatível','Bentonita / Sílica':'❌ Incompatível','Sulfonato de Cálcio':'✅ Compatível'}
};

function initializeMobileHandlers() {
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        let startX;
        let scrollLeft;

        tabsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - tabsContainer.offsetLeft;
            scrollLeft = tabsContainer.scrollLeft;
        });

        tabsContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const x = e.touches[0].pageX - tabsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            tabsContainer.scrollLeft = scrollLeft - walk;
        });
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

function checkCompatibility() {
    hideError();
    const grease1 = document.getElementById('grease1').value;
    const grease2 = document.getElementById('grease2').value;
    const resultContainer = document.getElementById('compatibility-result-container');
    
    const resultText = compatibilityMatrix[grease1][grease2];
    
    let mainText = '';
    let subText = '';
    
    resultContainer.className = 'resultado-container';

    if (resultText.includes('Incompatível')) {
        mainText = '❌ ' + i18n.t('guia_lub.incompatible');
        subText = i18n.t('guia_lub.incompatible_desc');
        resultContainer.classList.add('error');
    } else if (resultText.includes('Parcialmente')) {
        mainText = '⚠️ ' + i18n.t('guia_lub.partially_compatible');
        subText = i18n.t('guia_lub.partially_compatible_desc');
        resultContainer.classList.add('warning');
    } else {
        mainText = '✅ ' + i18n.t('guia_lub.compatible');
        subText = i18n.t('guia_lub.compatible_desc');
        resultContainer.classList.add('success');
    }
    
    resultContainer.innerHTML = `
        <h3 data-i18n="guia_lub.compatibility_result">${i18n.t('guia_lub.compatibility_result')}</h3>
        <div class="resultado-display">
            <span class="result-main-text">${mainText}</span>
            <span class="result-sub-text">${subText}</span>
        </div>
    `;
    resultContainer.classList.remove('hidden');
}

function calculateLH(Y) {
    if (Y < 2 || Y > 70) {
        throw new Error(i18n.t('guia_lub.visc_range_error'));
    }

    const logY = Math.log10(Y);
    
    const L = Math.pow(10, (-1.14673 + (2.65681 * logY) + (-0.131 * Math.pow(logY, 2)) + 
        (-0.24638 * Math.pow(logY, 3)) + (0.20811 * Math.pow(logY, 4))));
    
    const H = Math.pow(10, (-0.56684 + (1.01398 * logY) + (0.15690 * Math.pow(logY, 2)) + 
        (-0.06967 * Math.pow(logY, 3)) + (0.00493 * Math.pow(logY, 4))));
    
    return { L, H };
}

function getChartOptions(chartType) {
    const isDark = document.body.classList.contains('dark-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? '#e9ecef' : '#6c757d';
    const titleColor = isDark ? '#e9ecef' : '#212529';

    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: titleColor,
                    font: {
                        family: "'Segoe UI', system-ui, sans-serif"
                    }
                }
            }
        }
    };

    if (chartType === 'viscosity') {
        return {
            ...baseOptions,
            scales: {
                x: { title: { display: true, text: 'Temperatura (°C)', color: titleColor }, ticks: { color: textColor }, grid: { color: gridColor } },
                y: { type: 'logarithmic', title: { display: true, text: 'Viscosidade (cSt)', color: titleColor }, ticks: { color: textColor }, grid: { color: gridColor } }
            }
        };
    }

    if (chartType === 'comparison') {
        return {
            ...baseOptions,
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
            }
        };
    }
    
    if (chartType === 'distribution') {
        return baseOptions; // Doughnut chart has no scales
    }

    return baseOptions;
}

function initializeCharts(isInitial = false) {
    const viscCtx = document.getElementById('viscosityChart');
    if (viscCtx) {
        charts.viscosity = new Chart(viscCtx, {
            type: 'line',
            data: { datasets: [] },
            options: getChartOptions('viscosity')
        });
    }

    const compCtx = document.getElementById('comparisonChart');
    if (compCtx) {
        charts.comparison = new Chart(compCtx, {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Índice de Viscosidade', data: [] }] },
            options: getChartOptions('comparison')
        });
    }
    
    const distCtx = document.getElementById('distributionChart');
    if (distCtx) {
        charts.distribution = new Chart(distCtx, {
            type: 'doughnut',
            data: { datasets: [] },
            options: getChartOptions('distribution')
        });
    }
}

function calculateVI() {
    const U = parseFloat(document.getElementById('visc40').value);
    const Y = parseFloat(document.getElementById('visc100').value);
    const oilName = document.getElementById('oilName').value || 'Óleo';
    const resultDiv = document.getElementById('result');
    const visc40Input = document.getElementById('visc40');
    const visc100Input = document.getElementById('visc100');

    [visc40Input, visc100Input].forEach(input => input.classList.remove('error'));
    resultDiv.className = 'hidden';

    const validationErrors = [];
    if (isNaN(U) || U <= 0) validationErrors.push(i18n.t('guia_lub.err_visc40_positive'));
    if (isNaN(Y) || Y <= 0) validationErrors.push(i18n.t('guia_lub.err_visc100_positive'));
    if (!isNaN(U) && !isNaN(Y) && U <= Y) validationErrors.push(i18n.t('guia_lub.err_visc40_greater'));
    if (!isNaN(Y) && (Y < 2 || Y > 70)) validationErrors.push(i18n.t('guia_lub.err_visc100_range'));

    if (validationErrors.length > 0) {
        showError(validationErrors.join('<br>'));
        validationErrors.forEach(err => {
            if (err.includes('40°C')) visc40Input.classList.add('error');
            if (err.includes('100°C')) visc100Input.classList.add('error');
        });
        return;
    }

    try {
        const { L, H } = calculateLH(Y);
        let vi = (U > L) ? ((L - U) / (L - H)) * 100 : (Math.pow(10, (Math.log10(H) - Math.log10(U)) / Math.log10(Y)) - 1) / 0.00715 + 100;
        vi = Math.round(vi * 10) / 10;
        showResult(vi, U, Y);
        updateViscosityChart();
    } catch (error) {
        showError(error.message);
    }
}

function showResult(vi, U, Y) {
    const resultDiv = document.getElementById('result');
    let category = '', categoryClass = '', recommendations = '';
    
    if (vi >= 120) { category = i18n.t('guia_lub.excellent'); categoryClass = 'iv-excellent'; recommendations = i18n.t('guia_lub.rec_excellent'); }
    else if (vi >= 90) { category = i18n.t('guia_lub.good'); categoryClass = 'iv-good'; recommendations = i18n.t('guia_lub.rec_good'); }
    else if (vi >= 40) { category = i18n.t('guia_lub.medium'); categoryClass = 'iv-average'; recommendations = i18n.t('guia_lub.rec_medium'); }
    else { category = i18n.t('guia_lub.low'); categoryClass = 'iv-poor'; recommendations = i18n.t('guia_lub.rec_low'); }

    resultDiv.innerHTML = `
        <div style="font-size: 1.3em; margin-bottom: 15px;"><strong>${i18n.t('guia_lub.vi_label')}: ${vi}</strong></div>
        <div class="iv-category ${categoryClass}">${i18n.t('guia_lub.classification')}: ${category}</div>
        <div style="margin-top: 15px; font-size: 0.95em; color: #2c3e50;">${recommendations}</div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #7f8c8d;">${i18n.t('guia_lub.visc_ratio')}: ${(U/Y).toFixed(2)}</div>
    `;
    resultDiv.className = 'success animate-in';
}

function addToComparison() {
    const U = parseFloat(document.getElementById('visc40').value);
    const Y = parseFloat(document.getElementById('visc100').value);
    const name = document.getElementById('oilName').value || `Óleo ${comparisonData.length + 1}`;

    if (isNaN(U) || isNaN(Y)) {
        showError(i18n.t('lubguide.calc_vi_first'));
        return;
    }

    try {
        const { L, H } = calculateLH(Y);
        let vi = U > L ? ((L - U) / (L - H)) * 100 : (Math.pow(10, (Math.log10(H) - Math.log10(U)) / Math.log10(Y)) - 1) / 0.00715 + 100;
        vi = Math.round(vi * 10) / 10;

        comparisonData.push({ name, U, Y, vi });
        updateComparisonTable();
        updateComparisonChart();
        showError(i18n.t('lubguide.added_compare').replace('{name}', name));
    } catch (error) {
        showError(i18n.t('lubguide.error_add') + error.message);
    }
}

function updateComparisonTable() {
    const container = document.getElementById('comparisonTableContainer');
    if (!container || comparisonData.length === 0) {
        container.innerHTML = '<p>' + i18n.t('guia_lub.add_oils_hint') + '</p>';
        return;
    }

    let tableHTML = `
        <table class="comparison-table">
            <thead><tr><th>${i18n.t('guia_lub.table_name')}</th><th>${i18n.t('guia_lub.table_visc40')}</th><th>${i18n.t('guia_lub.table_visc100')}</th><th>${i18n.t('guia_lub.table_vi')}</th><th>${i18n.t('guia_lub.table_class')}</th><th>${i18n.t('guia_lub.table_actions')}</th></tr></thead>
            <tbody>
    `;
    comparisonData.forEach((oil, index) => {
        let classification = oil.vi >= 120 ? i18n.t('guia_lub.excellent') : oil.vi >= 90 ? i18n.t('guia_lub.good') : oil.vi >= 40 ? i18n.t('guia_lub.medium') : i18n.t('guia_lub.low');
        tableHTML += `
            <tr>
                <td><strong>${oil.name}</strong></td><td>${oil.U.toFixed(2)}</td><td>${oil.Y.toFixed(2)}</td>
                <td><strong>${oil.vi}</strong></td><td>${classification}</td>
                <td><button onclick="removeFromComparison(${index})" class="remove-btn">${i18n.t('guia_lub.remove')}</button></td>
            </tr>
        `;
    });
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

function removeFromComparison(index) {
    comparisonData.splice(index, 1);
    updateComparisonTable();
    updateComparisonChart();
}

function clearComparison() {
    comparisonData = [];
    updateComparisonTable();
    updateComparisonChart();
}

function updateViscosityChart() {
    if (!charts.viscosity) return;
    const temperatures = [0, 20, 40, 60, 80, 100, 120, 140];
    charts.viscosity.data = {
        labels: temperatures,
        datasets: [
            { label: 'Óleo Sintético (IV ≈ 150)', data: [800, 180, 68, 32, 17, 10, 6.5, 4.5], borderColor: '#27ae60', backgroundColor: 'rgba(39, 174, 96, 0.1)', tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 6 },
            { label: 'Óleo Mineral Premium (IV ≈ 110)', data: [1200, 250, 85, 38, 19, 11, 7, 5], borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)', tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 6 },
            { label: 'Óleo Convencional (IV ≈ 90)', data: [2000, 320, 100, 42, 20, 11, 7, 5], borderColor: '#f39c12', backgroundColor: 'rgba(243, 156, 18, 0.1)', tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 6 },
            { label: 'Óleo Básico (IV ≈ 50)', data: [4000, 500, 120, 45, 20, 10, 6, 4], borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.1)', tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 6 }
        ]
    };
    charts.viscosity.update();
}

function updateComparisonChart() {
    if (!charts.comparison) return;
    const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c'];
    charts.comparison.data = {
        labels: comparisonData.map(oil => oil.name.length > 15 ? oil.name.substring(0, 15) + '...' : oil.name),
        datasets: [{
            label: 'Índice de Viscosidade',
            data: comparisonData.map(oil => oil.vi),
            backgroundColor: comparisonData.map((_, index) => colors[index % colors.length]),
            borderColor: comparisonData.map((_, index) => colors[index % colors.length]),
            borderWidth: 2,
            borderRadius: 5
        }]
    };
    charts.comparison.update();
}

function updateDistributionChart() {
    if (!charts.distribution) return;
    const distributionData = [
        { range: '< 40', label: i18n.t('guia_lub.low'), count: 15, color: '#e74c3c' },
        { range: '40-89', label: i18n.t('guia_lub.medium'), count: 35, color: '#f39c12' },
        { range: '90-119', label: i18n.t('guia_lub.good'), count: 40, color: '#3498db' },
        { range: '120+', label: i18n.t('guia_lub.excellent'), count: 10, color: '#27ae60' }
    ];
    charts.distribution.data = {
        labels: distributionData.map(d => `${d.label} (${d.range})`),
        datasets: [{
            data: distributionData.map(d => d.count),
            backgroundColor: distributionData.map(d => d.color),
            borderWidth: 3,
            borderColor: '#fff'
        }]
    };
    charts.distribution.update();
}

function updateAllChartOptions() {
    if (charts.viscosity) { charts.viscosity.options = getChartOptions('viscosity'); charts.viscosity.update(); }
    if (charts.comparison) { charts.comparison.options = getChartOptions('comparison'); charts.comparison.update(); }
    if (charts.distribution) { charts.distribution.options = getChartOptions('distribution'); charts.distribution.update(); }
}