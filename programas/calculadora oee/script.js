document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('oee-form');
    const saveBtn = document.getElementById('save-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const resultsDiv = document.getElementById('results');
    const historyBody = document.getElementById('history-body');
    const themeToggle = document.getElementById('theme-toggle');

    let oeeChart, componentsChart;
    let currentCalculation = null;

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    loadHistory();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        calculateAndDisplayOEE();
    });

    clearFormBtn.addEventListener('click', function() {
        form.reset();
        resultsDiv.style.display = 'none';
        saveBtn.disabled = true;
        if (oeeChart) oeeChart.destroy();
        if (componentsChart) componentsChart.destroy();
    });

    saveBtn.addEventListener('click', function() {
        if (currentCalculation) {
            saveToHistory(currentCalculation);
            saveBtn.disabled = true;
        }
    });

    clearHistoryBtn.addEventListener('click', function() {
        if (confirm(i18n.t('oee.confirm_clear'))) {
            localStorage.removeItem('oeeHistory');
            loadHistory();
        }
    });

    function calculateAndDisplayOEE() {
        const tempoPlanejado = parseFloat(document.getElementById('tempo-planejado').value);
        const tempoParada = parseFloat(document.getElementById('tempo-parada').value);
        const cicloIdeal = parseFloat(document.getElementById('ciclo-ideal').value);
        const pecasProduzidas = parseFloat(document.getElementById('pecas-produzidas').value);
        const pecasDefeituosas = parseFloat(document.getElementById('pecas-defeituosas').value);

        if ([tempoPlanejado, tempoParada, cicloIdeal, pecasProduzidas, pecasDefeituosas].some(isNaN)) {
            alert(i18n.t('oee.error_invalid_numbers'));
            return;
        }

        const tempoProducaoReal = tempoPlanejado - tempoParada;
        const disponibilidade = (tempoProducaoReal / tempoPlanejado) * 100;
        const totalProducaoIdeal = (tempoProducaoReal * 60) / cicloIdeal;
        const performance = (pecasProduzidas / totalProducaoIdeal) * 100;
        const pecasBoas = pecasProduzidas - pecasDefeituosas;
        const qualidade = (pecasBoas / pecasProduzidas) * 100;
        const oee = (disponibilidade / 100) * (performance / 100) * (qualidade / 100) * 100;

        currentCalculation = {
            date: new Date().toLocaleString(i18n.current === 'pt' ? 'pt-BR' : i18n.current === 'es' ? 'es' : 'en'),
            oee: oee.toFixed(2),
            disponibilidade: disponibilidade.toFixed(2),
            performance: performance.toFixed(2),
            qualidade: qualidade.toFixed(2)
        };

        resultsDiv.style.display = 'block';
        saveBtn.disabled = false;
        
        updateCharts(disponibilidade, performance, qualidade, oee);
        interpretOEE(oee);
    }

    function updateCharts(disponibilidade, performance, qualidade, oee) {
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
        const gridColor = getComputedStyle(document.body).getPropertyValue('--border-color').trim();

        const oeeCtx = document.getElementById('oeeChart').getContext('2d');
        if (oeeChart) oeeChart.destroy();
        oeeChart = new Chart(oeeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{ data: [oee, 100 - oee], backgroundColor: ['#2563eb', '#e2e8f0'], borderWidth: 0 }]
            },
            options: {
                responsive: true, cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                }
            }
        });

        const componentsCtx = document.getElementById('componentsChart').getContext('2d');
        if (componentsChart) componentsChart.destroy();
        componentsChart = new Chart(componentsCtx, {
            type: 'bar',
            data: {
                labels: [i18n.t('oee.availability'), i18n.t('oee.performance'), i18n.t('oee.quality')],
                datasets: [{ data: [disponibilidade, performance, qualidade], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { beginAtZero: true, max: 100, grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: i18n.t('oee.chart_components_title'), color: textColor, font: { family: "'Inter', sans-serif", size: 16 } }
                }
            }
        });
    }

    function interpretOEE(oee) {
        const interpretationEl = document.getElementById('oee-interpretation');
        let text, color;
        if (oee >= 85) { text = i18n.t('oee.interpret_world_class'); color = "var(--success-color)"; }
        else if (oee >= 60) { text = i18n.t('oee.interpret_good'); color = "var(--accent-color)"; }
        else { text = i18n.t('oee.interpret_needs_improvement'); color = "var(--error-color)"; }
        interpretationEl.textContent = text;
        interpretationEl.style.color = color;
    }

    function saveToHistory(calculation) {
        const history = JSON.parse(localStorage.getItem('oeeHistory')) || [];
        history.unshift(calculation);
        localStorage.setItem('oeeHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('oeeHistory')) || [];
        historyBody.innerHTML = '';
        if (history.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">' + i18n.t('oee.no_history') + '</td></tr>';
        } else {
            history.forEach(calc => {
                const row = `<tr>
                    <td data-label="${i18n.t('oee.date')}">${calc.date}</td>
                    <td data-label="OEE" style="font-weight: bold; color: var(--primary);">${calc.oee}%</td>
                    <td data-label="${i18n.t('oee.availability')}">${calc.disponibilidade}%</td>
                    <td data-label="${i18n.t('oee.performance')}">${calc.performance}%</td>
                    <td data-label="${i18n.t('oee.quality')}">${calc.qualidade}%</td>
                </tr>`;
                historyBody.innerHTML += row;
            });
        }
    }
});
