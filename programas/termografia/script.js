document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('termografia-form');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const resultsCard = document.getElementById('results-card');
    const resultSeverityText = document.getElementById('result-severity-text');
    const resultDetailText = document.getElementById('result-detail-text');
    const resultActionText = document.getElementById('result-action-text');
    const resultDisplay = document.getElementById('result-display');
    const historyBody = document.getElementById('history-body');
    const themeToggle = document.getElementById('theme-toggle');

    const thresholds = {
        motor_peq: { normal: 10, alerta: 25 },
        motor_grd: { normal: 15, alerta: 30 },
        painel: { normal: 5, alerta: 15 },
        transformador: { normal: 15, alerta: 35 },
        tubulacao: { normal: 10, alerta: 30 }
    };

    const actions = {
        ok: 'Operação normal. Continuar monitoramento de rotina conforme plano de inspeção termográfica.',
        alerta: 'Planejar intervenção. Aumentar frequência de monitoramento. Investigar causa raiz do aquecimento.',
        critico: 'PARADA IMEDIATA. Risco de falha catastrófica. Realizar intervenção corretiva urgente.'
    };

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
        calculateAndDisplay();
    });

    clearFormBtn.addEventListener('click', function() {
        form.reset();
        document.getElementById('delta-t').value = '0';
        document.getElementById('amb-temp').value = '25';
        resultsCard.style.display = 'none';
    });

    clearHistoryBtn.addEventListener('click', function() {
        if (confirm(i18n.t('oee.confirm_clear'))) {
            localStorage.removeItem('termografiaHistory');
            loadHistory();
        }
    });

    function classifySeverity(deltaT, equipType) {
        const t = thresholds[equipType];
        if (!t) return null;
        if (deltaT <= t.normal) return 'ok';
        if (deltaT <= t.alerta) return 'alerta';
        return 'critico';
    }

    function getEquipName(equipType) {
        const names = {
            motor_peq: 'Motor < 1HP',
            motor_grd: 'Motor > 1HP',
            painel: 'Painel Elétrico',
            transformador: 'Transformador',
            tubulacao: 'Tubulação/Isolamento'
        };
        return names[equipType] || equipType;
    }

    function getMedName(medType) {
        const names = {
            ponto: 'Ponto',
            area: 'Área',
            padrao: 'Padrão'
        };
        return names[medType] || medType;
    }

    function calculateAndDisplay() {
        const deltaT = parseFloat(document.getElementById('delta-t').value);
        const ambTemp = parseFloat(document.getElementById('amb-temp').value);
        const medTipo = document.getElementById('med-tipo').value;
        const equipTipo = document.getElementById('equip-tipo').value;

        if (isNaN(deltaT) || isNaN(ambTemp)) {
            alert(i18n.t('oee.error_invalid_numbers'));
            return;
        }

        const severity = classifySeverity(deltaT, equipTipo);
        if (!severity) {
            alert(i18n.t('oee.error_invalid_numbers'));
            return;
        }

        let severityText, detailText, actionText, cssClass, badgeHtml;
        if (severity === 'ok') {
            severityText = i18n.t('termografia.class_ok');
            detailText = 'ΔT = ' + deltaT.toFixed(1) + ' °C - ' + getEquipName(equipTipo);
            actionText = actions.ok;
            cssClass = 'success';
            badgeHtml = '<span class="badge badge-ok"><i class="fas fa-check-circle"></i> ' + severityText + '</span>';
        } else if (severity === 'alerta') {
            severityText = i18n.t('termografia.class_alert');
            detailText = 'ΔT = ' + deltaT.toFixed(1) + ' °C - ' + getEquipName(equipTipo);
            actionText = actions.alerta;
            cssClass = 'warning';
            badgeHtml = '<span class="badge badge-alert"><i class="fas fa-exclamation-triangle"></i> ' + severityText + '</span>';
        } else {
            severityText = i18n.t('termografia.class_critical');
            detailText = 'ΔT = ' + deltaT.toFixed(1) + ' °C - ' + getEquipName(equipTipo);
            actionText = actions.critico;
            cssClass = 'error';
            badgeHtml = '<span class="badge badge-critical"><i class="fas fa-times-circle"></i> ' + severityText + '</span>';
        }

        resultSeverityText.innerHTML = badgeHtml;
        resultDetailText.textContent = detailText;
        resultActionText.textContent = actionText;
        resultDisplay.className = 'resultado-display ' + cssClass;

        resultsCard.style.display = 'block';

        const calc = {
            date: new Date().toLocaleString(i18n.current === 'pt' ? 'pt-BR' : i18n.current === 'es' ? 'es' : 'en'),
            severity: severityText,
            deltaT: deltaT.toFixed(1),
            equip: getEquipName(equipTipo),
            equipType: equipTipo
        };

        saveToHistory(calc);
    }

    function saveToHistory(calculation) {
        const history = JSON.parse(localStorage.getItem('termografiaHistory')) || [];
        history.unshift(calculation);
        localStorage.setItem('termografiaHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('termografiaHistory')) || [];
        historyBody.innerHTML = '';
        if (history.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">' + i18n.t('oee.no_history') + '</td></tr>';
        } else {
            history.slice(0, 50).forEach(calc => {
                let severityBadge, badgeClass;
                if (calc.severity === i18n.t('termografia.class_ok') || calc.severity === 'Normal') {
                    severityBadge = '<span class="badge badge-ok" style="font-size:0.75rem;">' + calc.severity + '</span>';
                } else if (calc.severity === i18n.t('termografia.class_alert') || calc.severity === 'Alerta') {
                    severityBadge = '<span class="badge badge-alert" style="font-size:0.75rem;">' + calc.severity + '</span>';
                } else {
                    severityBadge = '<span class="badge badge-critical" style="font-size:0.75rem;">' + calc.severity + '</span>';
                }
                const row = '<tr>' +
                    '<td data-label="' + i18n.t('oee.date') + '">' + calc.date + '</td>' +
                    '<td data-label="' + i18n.t('termografia.table_header_class') + '">' + severityBadge + '</td>' +
                    '<td data-label="' + i18n.t('termografia.table_header_dt') + '">' + calc.deltaT + ' °C</td>' +
                    '<td data-label="' + i18n.t('termografia.table_header_equip') + '">' + calc.equip + '</td>' +
                '</tr>';
                historyBody.innerHTML += row;
            });
        }
    }
});
