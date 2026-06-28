document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('theme-toggle-checkbox');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    var calcBtn = document.getElementById('calc-btn');
    var resultContent = document.getElementById('result-content');
    var historyList = document.getElementById('history-list');

    function getStatusClass(status) {
        var map = { good: 'good', fair: 'fair', poor: 'poor', critical: 'critical' };
        return map[status] || '';
    }

    function getStatusLabel(status) {
        var map = {
            good: i18n.t('analise_oleo.status_good'),
            fair: i18n.t('analise_oleo.status_fair'),
            poor: i18n.t('analise_oleo.status_poor'),
            critical: i18n.t('analise_oleo.status_critical')
        };
        return map[status] || status;
    }

    function assessViscosity(measured, target) {
        if (!measured || !target) return null;
        var diff = Math.abs(measured - target) / target * 100;
        if (diff <= 10) return { status: 'good', score: 4, detail: diff.toFixed(1) + '% do alvo' };
        if (diff <= 20) return { status: 'fair', score: 3, detail: diff.toFixed(1) + '% do alvo' };
        return { status: 'poor', score: 2, detail: diff.toFixed(1) + '% do alvo' };
    }

    function assessWater(value) {
        if (value === '' || value === null) return null;
        var v = parseFloat(value);
        if (isNaN(v)) return null;
        if (v < 200) return { status: 'good', score: 4, detail: v + ' ppm' };
        if (v <= 500) return { status: 'fair', score: 3, detail: v + ' ppm' };
        if (v <= 1000) return { status: 'poor', score: 2, detail: v + ' ppm' };
        return { status: 'critical', score: 1, detail: v + ' ppm' };
    }

    function assessParticles(value) {
        if (!value) return null;
        var match = value.toString().match(/(\d+)/);
        if (!match) return null;
        var code = parseInt(match[1], 10);
        if (code < 16) return { status: 'good', score: 4, detail: value };
        if (code <= 18) return { status: 'fair', score: 3, detail: value };
        if (code <= 20) return { status: 'poor', score: 2, detail: value };
        return { status: 'critical', score: 1, detail: value };
    }

    function assessTAN(value, oilType) {
        if (value === '' || value === null) return null;
        var v = parseFloat(value);
        if (isNaN(v)) return null;
        if (oilType === 'motor') {
            if (v < 4) return { status: 'good', score: 4, detail: v + ' mg KOH/g' };
            if (v <= 8) return { status: 'fair', score: 3, detail: v + ' mg KOH/g' };
            return { status: 'poor', score: 2, detail: v + ' mg KOH/g' };
        }
        if (v < 2) return { status: 'good', score: 4, detail: v + ' mg KOH/g' };
        if (v <= 4) return { status: 'fair', score: 3, detail: v + ' mg KOH/g' };
        return { status: 'poor', score: 2, detail: v + ' mg KOH/g' };
    }

    function assessTBN(value) {
        if (value === '' || value === null) return null;
        var v = parseFloat(value);
        if (isNaN(v)) return null;
        if (v > 10) return { status: 'good', score: 4, detail: v + ' mg KOH/g' };
        if (v >= 5) return { status: 'fair', score: 3, detail: v + ' mg KOH/g' };
        return { status: 'poor', score: 2, detail: v + ' mg KOH/g' };
    }

    function assessMetal(value, limits) {
        if (value === '' || value === null) return null;
        var v = parseFloat(value);
        if (isNaN(v)) return null;
        if (v < limits.good) return { status: 'good', score: 4, detail: v + ' ppm' };
        if (v < limits.fair) return { status: 'fair', score: 3, detail: v + ' ppm' };
        if (v < limits.poor) return { status: 'poor', score: 2, detail: v + ' ppm' };
        return { status: 'critical', score: 1, detail: v + ' ppm' };
    }

    function getOverallScore(results) {
        var total = 0;
        var count = 0;
        for (var key in results) {
            if (results[key] && results[key].score != null) {
                total += results[key].score;
                count++;
            }
        }
        if (count === 0) return null;
        var avg = total / count;
        if (avg >= 3.5) return { status: 'good', label: i18n.t('analise_oleo.status_good') };
        if (avg >= 2.5) return { status: 'fair', label: i18n.t('analise_oleo.status_fair') };
        if (avg >= 1.5) return { status: 'poor', label: i18n.t('analise_oleo.status_poor') };
        return { status: 'critical', label: i18n.t('analise_oleo.status_critical') };
    }

    function renderResults(results, overall) {
        var html = '';

        html += '<div class="overall-status ' + overall.status + '">';
        html += '<div class="status-label">' + i18n.t('analise_oleo.overall_label') + '</div>';
        html += '<div class="status-value">' + overall.label + '</div>';
        html += '</div>';

        var lubParams = [
            { key: 'viscosidade', label: i18n.t('analise_oleo.visc40_label') },
            { key: 'water', label: i18n.t('analise_oleo.water_label') },
            { key: 'particles', label: i18n.t('analise_oleo.particle_label') },
            { key: 'tan', label: i18n.t('analise_oleo.tan_label') },
            { key: 'tbn', label: i18n.t('analise_oleo.tbn_label') }
        ];

        var wearParams = [
            { key: 'fe', label: i18n.t('analise_oleo.fe_label') },
            { key: 'cu', label: i18n.t('analise_oleo.cu_label') },
            { key: 'pb', label: i18n.t('analise_oleo.pb_label') }
        ];

        html += '<div class="param-breakdown">';

        html += '<div class="param-section-label">' + i18n.t('analise_oleo.lub_status_label') + '</div>';
        for (var i = 0; i < lubParams.length; i++) {
            var p = lubParams[i];
            var r = results[p.key];
            if (r) {
                html += '<div class="param-row">';
                html += '<span class="param-name">' + p.label + '</span>';
                html += '<span class="param-value"><span class="status-badge ' + getStatusClass(r.status) + '">' + getStatusLabel(r.status) + '</span></span>';
                html += '</div>';
            }
        }

        html += '<div class="param-section-label">' + i18n.t('analise_oleo.wear_status_label') + '</div>';
        for (var j = 0; j < wearParams.length; j++) {
            var p2 = wearParams[j];
            var r2 = results[p2.key];
            if (r2) {
                html += '<div class="param-row">';
                html += '<span class="param-name">' + p2.label + '</span>';
                html += '<span class="param-value"><span class="status-badge ' + getStatusClass(r2.status) + '">' + getStatusLabel(r2.status) + '</span></span>';
                html += '</div>';
            }
        }

        html += '</div>';

        resultContent.innerHTML = html;
    }

    function getInputValue(id) {
        var el = document.getElementById(id);
        if (!el) return '';
        return el.value.trim();
    }

    function calculate() {
        var oilType = document.getElementById('oil-type').value;
        var isoVg = document.getElementById('iso-vg').value;

        var visc40 = getInputValue('visc40');
        var visc100 = getInputValue('visc100');
        var water = getInputValue('water');
        var particles = getInputValue('particles');
        var tan = getInputValue('tan');
        var tbn = getInputValue('tbn');
        var fe = getInputValue('fe');
        var cu = getInputValue('cu');
        var pb = getInputValue('pb');

        var results = {};

        if (visc40 && isoVg) {
            results.viscosidade = assessViscosity(parseFloat(visc40), parseFloat(isoVg));
        }

        results.water = assessWater(water);
        results.particles = assessParticles(particles);
        results.tan = assessTAN(tan, oilType);
        results.tbn = assessTBN(tbn);
        results.fe = assessMetal(fe, { good: 30, fair: 60, poor: 100 });
        results.cu = assessMetal(cu, { good: 15, fair: 30, poor: 50 });
        results.pb = assessMetal(pb, { good: 20, fair: 40, poor: 60 });

        var overall = getOverallScore(results);

        if (!overall) {
            resultContent.innerHTML = '<div class="result-placeholder"><i class="fa-solid fa-triangle-exclamation"></i><span>' + i18n.t('analise_oleo.note_text') + '</span></div>';
            return;
        }

        renderResults(results, overall);
        saveHistory(results, overall, oilType, isoVg);
        renderHistory();
    }

    function saveHistory(results, overall, oilType, isoVg) {
        var history = [];
        try {
            var stored = localStorage.getItem('analise_oleo_history');
            if (stored) history = JSON.parse(stored);
        } catch (e) {}

        var summary = {};
        for (var key in results) {
            if (results[key]) {
                summary[key] = results[key].status;
            }
        }

        var entry = {
            date: new Date().toISOString(),
            oilType: oilType,
            isoVg: isoVg,
            overallStatus: overall.status,
            overallLabel: overall.label,
            summary: summary
        };

        history.unshift(entry);
        if (history.length > 20) history = history.slice(0, 20);

        try {
            localStorage.setItem('analise_oleo_history', JSON.stringify(history));
        } catch (e) {}
    }

    function renderHistory() {
        var history = [];
        try {
            var stored = localStorage.getItem('analise_oleo_history');
            if (stored) history = JSON.parse(stored);
        } catch (e) {}

        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">' + i18n.t('analise_oleo.history_empty') + '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < history.length; i++) {
            var h = history[i];
            var d = new Date(h.date);
            var dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            html += '<div class="history-item" data-index="' + i + '">';
            html += '<span class="history-date">' + dateStr + '</span>';
            html += '<span class="history-status ' + getStatusClass(h.overallStatus) + '">' + h.overallLabel + '</span>';
            html += '</div>';
        }
        historyList.innerHTML = html;

        var items = historyList.querySelectorAll('.history-item');
        for (var j = 0; j < items.length; j++) {
            items[j].addEventListener('click', function () {
                var idx = parseInt(this.dataset.index, 10);
                var hist = [];
                try { hist = JSON.parse(localStorage.getItem('analise_oleo_history')); } catch (e) {}
                if (hist && hist[idx]) {
                    restoreFromHistory(hist[idx]);
                }
            });
        }
    }

    function restoreFromHistory(entry) {
        document.getElementById('oil-type').value = entry.oilType || 'hidraulico';
        if (entry.isoVg) {
            document.getElementById('iso-vg').value = entry.isoVg;
        }
    }

    calcBtn.addEventListener('click', calculate);
    renderHistory();
});
