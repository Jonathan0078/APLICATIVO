document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('oee-form');
    const saveBtn = document.getElementById('save-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const resultsDiv = document.getElementById('results');
    const historyBody = document.getElementById('history-body');

    let oeeChart, componentsChart;
    let currentCalculation = null;

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
        if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
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
            alert("Por favor, preencha todos os campos com números válidos.");
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
            date: new Date().toLocaleString('pt-BR'),
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
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--cor-texto').trim();
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--cor-borda').trim();

        const oeeCtx = document.getElementById('oeeChart').getContext('2d');
        if (oeeChart) oeeChart.destroy();
        oeeChart = new Chart(oeeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{ data: [oee, 100 - oee], backgroundColor: ['#005a9c', '#e9ecef'], borderWidth: 0 }]
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
                labels: ['Disponibilidade', 'Performance', 'Qualidade'],
                datasets: [{ data: [disponibilidade, performance, qualidade], backgroundColor: ['#28a745', '#ffc107', '#dc3545'] }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { beginAtZero: true, max: 100, grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Componentes do OEE', color: textColor, font: { family: "'Oswald', sans-serif", size: 16 } }
                }
            }
        });
    }

    function interpretOEE(oee) {
        const interpretationEl = document.getElementById('oee-interpretation');
        let text, color;
        if (oee >= 85) { text = "Classe Mundial"; color = "var(--cor-sucesso)"; }
        else if (oee >= 60) { text = "Bom"; color = "var(--cor-aviso)"; }
        else { text = "Precisa de Melhoria"; color = "var(--cor-erro)"; }
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
            historyBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum cálculo salvo ainda.</td></tr>';
        } else {
            history.forEach(calc => {
                const row = `<tr>
                    <td>${calc.date}</td>
                    <td style="font-weight: bold;">${calc.oee}%</td>
                    <td>${calc.disponibilidade}%</td>
                    <td>${calc.performance}%</td>
                    <td>${calc.qualidade}%</td>
                </tr>`;
                historyBody.innerHTML += row;
            });
        }
    }
});