document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    const form = document.getElementById('form-mancal');
    const calcularBtn = document.getElementById('calcular-btn');
    const btnText = document.querySelector('#calcular-btn .btn-text');
    const btnSpinner = document.querySelector('#calcular-btn .spinner');

    const views = {
        calculadora: document.getElementById('view-calculadora'),
        historico: document.getElementById('view-historico'),
        multiplos: document.getElementById('view-multiplos')
    };

    const resultadoContainer = document.getElementById('resultado-container');
    const resultadoDisplay = document.getElementById('resultado-display');
    const erroContainer = document.getElementById('erro-container');
    const graficoWhatIfContainer = document.getElementById('grafico-whatif-container');

    const historicoList = document.getElementById('historico-list');
    const adicionarMancalBtn = document.getElementById('adicionar-mancal-btn');
    const mancaisListContainer = document.getElementById('mancais-list');
    const resultadoMultiplosDisplay = document.getElementById('resultado-multiplos');

    const HISTORICO_KEY = 'historico_dissipacao_v2';
    let whatIfChart = null;
    let multiplosChart = null;

    const floatingMenu = document.getElementById('floatingMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuBtn = document.getElementById('menuBtn');

    function toggleMenu() {
        floatingMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }
    function closeMenu() {
        if (floatingMenu.classList.contains('active')) {
            floatingMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    const showView = (viewName) => {
        Object.values(views).forEach(view => view.classList.add('hidden'));
        if (views[viewName]) {
            views[viewName].classList.remove('hidden');
        }
        closeMenu();
        document.querySelectorAll('.calc-item[data-view]').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === viewName);
        });
    };

    document.querySelectorAll('.calc-item[data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showView(item.getAttribute('data-view'));
        });
    });

    const toggleLoading = (isLoading) => {
        if (isLoading) {
            calcularBtn.disabled = true;
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
            calcularBtn.classList.add('loading');
        } else {
            calcularBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
            calcularBtn.classList.remove('loading');
        }
    };

    const showError = (message) => {
        erroContainer.textContent = message;
        erroContainer.classList.remove('hidden');
        resultadoContainer.classList.add('hidden');
        graficoWhatIfContainer.classList.add('hidden');
    };

    const hideError = () => {
        erroContainer.classList.add('hidden');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        toggleLoading(true);
        hideError();

        const inputs = {
            tipoMancal: document.getElementById('tipo-mancal').value,
            carga: parseFloat(document.getElementById('carga').value),
            velocidade: parseFloat(document.getElementById('velocidade').value),
            tempOper: parseFloat(document.getElementById('temp-oper').value),
            tempAmb: parseFloat(document.getElementById('temp-amb').value),
            tipoLub: document.getElementById('tipo-lubrificacao').value,
            diametroEixo: parseFloat(document.getElementById('diametro-eixo').value),
            tempoOperacao: parseFloat(document.getElementById('tempo-operacao').value)
        };

        const validationError = validateInputs(inputs);
        if (validationError) {
            showError(validationError);
            toggleLoading(false);
            return;
        }

        const resultData = calculateDissipation(inputs);
        displayResults(resultData);
        generateWhatIfChart(inputs);
        saveToHistory(resultData);

        setTimeout(() => toggleLoading(false), 300);
    };

    const validateInputs = (inputs) => {
        for (const key in inputs) {
            if (typeof inputs[key] === 'number' && (isNaN(inputs[key]) || inputs[key] < 0)) {
                return i18n.t('dissipacao.error_positive_numbers') + ' ' + i18n.t('dissipacao.error_invalid_field') + ': ' + key + '.';
            }
        }
        if (inputs.diametroEixo <= 0) return i18n.t('dissipacao.error_shaft_diameter');
        if (inputs.tempoOperacao <= 0) return i18n.t('dissipacao.error_op_time');
        if (inputs.tempOper <= inputs.tempAmb) return i18n.t('dissipacao.error_temp_diff');
        return null;
    };

    const calculateDissipation = (inputs) => {
        const { tipoMancal, tipoLub, carga, diametroEixo, velocidade, tempOper, tempAmb, tempoOperacao } = inputs;
        let coefAtrito = 0.01;
        if (tipoMancal === 'Bucha') coefAtrito = tipoLub === 'Óleo' ? 0.08 : 0.12;
        if (tipoMancal === 'Rolamento') coefAtrito = tipoLub === 'Óleo' ? 0.005 : 0.008;

        const forcaAtrito = carga * coefAtrito;
        const velocidadeLinear = (Math.PI * diametroEixo * velocidade) / (60 * 1000);
        const dissipacao = forcaAtrito * velocidadeLinear;

        const energiaDissipada = (dissipacao * tempoOperacao) / 1000;
        const deltaT = tempOper - tempAmb;

        let statusMsg, statusClass;
        if (dissipacao > 100) {
            statusMsg = i18n.t('dissipacao.high_dissipation');
            statusClass = 'elevada';
        } else if (dissipacao < 10) {
            statusMsg = i18n.t('dissipacao.low_dissipation');
            statusClass = 'baixa';
        } else {
            statusMsg = i18n.t('dissipacao.moderate_dissipation');
            statusClass = 'moderada';
        }

        return { ...inputs, dissipacao, energiaDissipada, coefAtrito, velocidadeLinear, deltaT, statusMsg, statusClass, timestamp: new Date().toISOString() };
    };

    const displayResults = (data) => {
        resultadoContainer.classList.remove('dissipacao-elevada', 'dissipacao-moderada', 'dissipacao-baixa', 'hidden');
        resultadoContainer.classList.add(`dissipacao-${data.statusClass}`);

        resultadoDisplay.innerHTML = `
            <div class="dissipacao-valor">${data.dissipacao.toFixed(2)} W</div>
            <div><strong>${i18n.t('dissipacao.energy_dissipated')}:</strong> ${data.energiaDissipada.toFixed(3)} kWh (${i18n.t('dissipacao.in_hours', { h: data.tempoOperacao })}${data.tempoOperacao}h)</div>
            <div><strong>${i18n.t('dissipacao.friction_coeff')}:</strong> ${data.coefAtrito}</div>
            <div><strong>${i18n.t('dissipacao.linear_speed')}:</strong> ${data.velocidadeLinear.toFixed(3)} m/s</div>
            <div><strong>${i18n.t('dissipacao.delta_t')}:</strong> ${data.deltaT.toFixed(1)} °C</div>
            <div class="dissipacao-status ${data.statusClass}">${data.statusMsg}</div>
        `;
        resultadoContainer.classList.remove('hidden');
    };

    const getHistory = () => JSON.parse(localStorage.getItem(HISTORICO_KEY) || '[]');
    const saveToHistory = (item) => {
        let history = getHistory();
        history.unshift(item);
        if (history.length > 20) history.pop();
        localStorage.setItem(HISTORICO_KEY, JSON.stringify(history));
        renderHistory();
    };

    const renderHistory = () => {
        historicoList.innerHTML = '';
        const history = getHistory();
        if (history.length === 0) {
            historicoList.innerHTML = '<li style="text-align:center;color:var(--text-light);list-style:none;padding:1rem;">' + i18n.t('dissipacao.no_history') + '</li>';
            return;
        }
        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'historico-list-item';
            const histLocale = i18n.current === 'en' ? 'en-US' : i18n.current === 'es' ? 'es' : 'pt-BR';
            li.innerHTML = `
                <strong>${new Date(item.timestamp).toLocaleString(histLocale)}</strong><br>
                ${i18n.t('dissipacao.dissipation')}: <strong>${item.dissipacao.toFixed(2)} W</strong> | ${i18n.t('dissipacao.bearing')}: ${item.tipoMancal}
            `;
            li.addEventListener('click', () => loadFromHistory(item));
            historicoList.appendChild(li);
        });
    };

    const loadFromHistory = (itemData) => {
        Object.keys(itemData).forEach(key => {
            const el = document.getElementById(key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`));
            if (el) {
                el.value = itemData[key];
            }
        });
        showView('calculadora');
        form.scrollIntoView({ behavior: 'smooth' });
        resultadoContainer.classList.add('hidden');
        graficoWhatIfContainer.classList.add('hidden');
    };

    const clearHistory = () => {
        localStorage.removeItem(HISTORICO_KEY);
        renderHistory();
    };

    const addMancalRow = () => {
        const index = mancaisListContainer.children.length;
        const div = document.createElement('div');
        div.className = 'mancal-item';
        div.innerHTML = `
            <span>#${index + 1}</span>
            <input type="number" placeholder="${i18n.t('dissipacao.load_ph')}" class="m-carga" required>
            <input type="number" placeholder="${i18n.t('dissipacao.speed_ph')}" class="m-velocidade" required>
            <input type="number" placeholder="${i18n.t('dissipacao.diameter_ph')}" class="m-diametro" required>
            <button type="button" class="remover-mancal">${i18n.t('dissipacao.remove')}</button>
        `;
        mancaisListContainer.appendChild(div);
        div.querySelector('.remover-mancal').addEventListener('click', () => {
            div.remove();
            calculateAndDisplayMultiplos();
        });
        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', calculateAndDisplayMultiplos);
        });
        calculateAndDisplayMultiplos();
    };

    const calculateAndDisplayMultiplos = () => {
        let totalDissipacao = 0;
        const labels = [];
        const data = [];

        mancaisListContainer.querySelectorAll('.mancal-item').forEach((item, index) => {
            const carga = parseFloat(item.querySelector('.m-carga').value);
            const velocidade = parseFloat(item.querySelector('.m-velocidade').value);
            const diametro = parseFloat(item.querySelector('.m-diametro').value);
            if (!isNaN(carga) && !isNaN(velocidade) && !isNaN(diametro) && carga > 0 && velocidade > 0 && diametro > 0) {
                const forcaAtrito = carga * 0.008;
                const velocidadeLinear = (Math.PI * diametro * velocidade) / (60 * 1000);
                const dissipacao = forcaAtrito * velocidadeLinear;
                totalDissipacao += dissipacao;
                labels.push(`Mancal #${index + 1}`);
                data.push(dissipacao);
            }
        });

        resultadoMultiplosDisplay.innerHTML = `<strong>${i18n.t('dissipacao.total_estimated')}:</strong> ${totalDissipacao.toFixed(2)} W`;
        updateMultiplosChart(labels, data);
    };

    const getCSSVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

    const generateWhatIfChart = (baseInputs) => {
        const labels = [];
        const data = [];
        const step = baseInputs.velocidade > 500 ? 250 : 50;

        for (let v = 0; v <= baseInputs.velocidade * 2; v += step) {
            if(v === 0 && baseInputs.velocidade > 0) continue;
            const tempInputs = { ...baseInputs, velocidade: v };
            const result = calculateDissipation(tempInputs);
            labels.push(`${v} rpm`);
            data.push(result.dissipacao.toFixed(2));
        }

        const ctx = document.getElementById('grafico-whatif').getContext('2d');
        if (whatIfChart) whatIfChart.destroy();

        const primaryColor = getCSSVar('--primary-color');
        whatIfChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: i18n.t('dissipacao.dissipation') + ' (W)',
                    data: data,
                    borderColor: primaryColor,
                    backgroundColor: primaryColor + '1a',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        graficoWhatIfContainer.classList.remove('hidden');
    };

    const updateMultiplosChart = (labels, data) => {
        const ctx = document.getElementById('grafico-multiplos').getContext('2d');
        if (multiplosChart) multiplosChart.destroy();

        const accentColor = getCSSVar('--accent-color');
        multiplosChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: i18n.t('dissipacao.individual_dissipation') + ' (W)',
                    data: data,
                    backgroundColor: accentColor + 'cc',
                    borderColor: accentColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    };

    const exportToCSV = () => {
        const data = getHistory()[0];
        if (!data) {
            alert(i18n.t('dissipacao.export_first'));
            return;
        }
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += i18n.t('dissipacao.csv_headers') + "\r\n";
        Object.entries({
            'csv_bearing_type': [data.tipoMancal, ''],
            'csv_load': [data.carga, 'N'],
            'csv_speed': [data.velocidade, 'rpm'],
            'csv_op_temp': [data.tempOper, '°C'],
            'csv_amb_temp': [data.tempAmb, '°C'],
            'csv_shaft_dia': [data.diametroEixo, 'mm'],
            'csv_sep': ['---','---'],
            'csv_dissipation': [data.dissipacao.toFixed(2), 'W'],
            'csv_energy': [data.energiaDissipada.toFixed(3), `kWh (${data.tempoOperacao}h)`],
        }).forEach(([key, value]) => {
            csvContent += `${i18n.t('dissipacao.' + key)},${value[0]},${value[1]}\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `calculo_dissipacao_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        if (resultadoContainer.classList.contains('hidden')) {
             alert(i18n.t('dissipacao.export_first'));
             return;
        }
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const elementToCapture = document.getElementById('resultado-container');
        pdf.text(i18n.t('dissipacao.pdf_title'), 105, 15, { align: 'center' });

        html2canvas(elementToCapture, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 10, 25, pdfWidth, pdfHeight);

             if (!graficoWhatIfContainer.classList.contains('hidden')) {
                 html2canvas(document.getElementById('grafico-whatif'), {scale: 2}).then(chartCanvas => {
                    pdf.addPage();
                    pdf.text(i18n.t('dissipacao.sensitivity'), 105, 15, { align: 'center' });
                    const chartImgData = chartCanvas.toDataURL('image/png');
                    pdf.addImage(chartImgData, 'PNG', 10, 25, pdfWidth, 100);
                    pdf.save(`relatorio_dissipacao_${new Date().toISOString().slice(0,10)}.pdf`);
                 });
             } else {
                 pdf.save(`relatorio_dissipacao_${new Date().toISOString().slice(0,10)}.pdf`);
             }
        });
    };

    const init = () => {
        form.addEventListener('submit', handleFormSubmit);
        document.getElementById('limpar-historico-btn').addEventListener('click', clearHistory);
        adicionarMancalBtn.addEventListener('click', addMancalRow);
        document.getElementById('export-csv-btn').addEventListener('click', exportToCSV);
        document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
        renderHistory();
        showView('calculadora');
        addMancalRow();
    };

    init();
});
