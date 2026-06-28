var bearingThresholds = {
    ball: {
        low: { good: 25, fair: 35, alert: 50 },
        med: { good: 30, fair: 42, alert: 58 },
        high: { good: 35, fair: 50, alert: 65 }
    },
    roller: {
        low: { good: 30, fair: 40, alert: 55 },
        med: { good: 35, fair: 47, alert: 63 },
        high: { good: 40, fair: 55, alert: 70 }
    }
};

var trapThresholds = {
    thermodynamic: { good: 20, minor: 35, moderate: 50 },
    thermostatic: { good: 25, minor: 40, moderate: 55 },
    mechanical: { good: 30, minor: 45, moderate: 60 },
    float: { good: 30, minor: 45, moderate: 60 }
};

var valveThresholds = {
    gate: { good: 20, minor: 35, moderate: 50 },
    globe: { good: 25, minor: 40, moderate: 55 },
    ball: { good: 15, minor: 30, moderate: 45 },
    butterfly: { good: 20, minor: 35, moderate: 50 }
};

document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('theme-toggle-checkbox');
    var calcBtn = document.getElementById('calc-btn');
    var clearBtn = document.getElementById('clear-btn');
    var clearHistoryBtn = document.getElementById('clear-history-btn');
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    var tabTitle = document.getElementById('tab-title');
    var resultTitle = document.getElementById('result-title');
    var resultDisplay = document.getElementById('result-display');
    var resultContainer = document.getElementById('result-container');
    var resultBadge = document.getElementById('result-badge');
    var resultLabel = document.getElementById('result-label');
    var resultText = document.getElementById('result-text');
    var lubCard = document.getElementById('lubrication-rec');
    var lubText = document.getElementById('lub-text');
    var historyList = document.getElementById('history-list');

    var currentTab = 'bearing';
    var history = JSON.parse(localStorage.getItem('ultrassomHistory')) || [];

    function loadTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.checked = true;
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    function switchTab(tab) {
        currentTab = tab;
        tabBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        tabContents.forEach(function (content) {
            content.classList.toggle('active', content.id === 'tab-' + tab);
        });
        var titleMap = {
            bearing: i18n.t('ultrassom.tab_bearing'),
            trap: i18n.t('ultrassom.tab_trap'),
            valve: i18n.t('ultrassom.tab_valve')
        };
        tabTitle.textContent = titleMap[tab] || '';
        resultTitle.textContent = titleMap[tab] || '';
        resultDisplay.style.display = 'flex';
        resultContainer.style.display = 'none';
    }

    function getBearingClass(db, type, rpm) {
        var t = bearingThresholds[type][rpm];
        if (db < 0 || isNaN(db)) return null;
        if (db <= t.good) return 'good';
        if (db <= t.fair) return 'fair';
        if (db <= t.alert) return 'alert';
        return 'critical';
    }

    function getTrapClass(db, type) {
        var t = trapThresholds[type];
        if (db < 0 || isNaN(db)) return null;
        if (db <= t.good) return 'good';
        if (db <= t.minor) return 'fair';
        if (db <= t.moderate) return 'alert';
        return 'critical';
    }

    function getValveClass(db, type) {
        var t = valveThresholds[type];
        if (db < 0 || isNaN(db)) return null;
        if (db <= t.good) return 'good';
        if (db <= t.minor) return 'fair';
        if (db <= t.moderate) return 'alert';
        return 'critical';
    }

    function getBearingLabel(level) {
        var labels = {
            good: i18n.t('ultrassom.bearing_good'),
            fair: i18n.t('ultrassom.bearing_fair'),
            alert: i18n.t('ultrassom.bearing_alert'),
            critical: i18n.t('ultrassom.bearing_critical')
        };
        return labels[level] || '';
    }

    function getTrapLabel(level) {
        var labels = {
            good: i18n.t('ultrassom.trap_good'),
            fair: i18n.t('ultrassom.trap_minor'),
            alert: i18n.t('ultrassom.trap_moderate'),
            critical: i18n.t('ultrassom.trap_severe')
        };
        return labels[level] || '';
    }

    function getValveLabel(level) {
        var labels = {
            good: i18n.t('ultrassom.valve_good'),
            fair: i18n.t('ultrassom.valve_minor'),
            alert: i18n.t('ultrassom.valve_moderate'),
            critical: i18n.t('ultrassom.valve_severe')
        };
        return labels[level] || '';
    }

    function getBearingDesc(level) {
        var descs = {
            good: i18n.t('ultrassom.lub_good'),
            fair: i18n.t('ultrassom.lub_fair'),
            alert: i18n.t('ultrassom.lub_alert'),
            critical: i18n.t('ultrassom.lub_critical')
        };
        return descs[level] || '';
    }

    function getTrapDesc(level) {
        var descs = {
            good: i18n.t('ultrassom.trap_rec_good'),
            fair: i18n.t('ultrassom.trap_rec_minor'),
            alert: i18n.t('ultrassom.trap_rec_moderate'),
            critical: i18n.t('ultrassom.trap_rec_severe')
        };
        return descs[level] || '';
    }

    function getValveDesc(level) {
        var descs = {
            good: i18n.t('ultrassom.valve_rec_good'),
            fair: i18n.t('ultrassom.valve_rec_minor'),
            alert: i18n.t('ultrassom.valve_rec_moderate'),
            critical: i18n.t('ultrassom.valve_rec_severe')
        };
        return descs[level] || '';
    }

    function getResultLabel(level) {
        var labels = {
            good: i18n.t('ultrassom.bearing_good'),
            fair: i18n.t('ultrassom.bearing_fair'),
            alert: i18n.t('ultrassom.bearing_alert'),
            critical: i18n.t('ultrassom.bearing_critical')
        };
        return labels[level] || '';
    }

    function classifyBearing() {
        var db = parseFloat(document.getElementById('bearing-db').value);
        var type = document.getElementById('bearing-type').value;
        var rpm = document.getElementById('bearing-rpm').value;

        if (isNaN(db) || db < 0) {
            resultContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            return;
        }

        var level = getBearingClass(db, type, rpm);
        if (!level) {
            resultContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            return;
        }

        resultDisplay.style.display = 'none';
        resultContainer.style.display = 'block';

        resultBadge.className = 'result-badge ' + level;
        resultBadge.innerHTML = '<i class="fas fa-circle"></i> ' + getBearingLabel(level);
        resultLabel.textContent = i18n.t('ultrassom.bearing_result_label');
        resultText.textContent = db.toFixed(1) + ' dB \u00b5V - ' + getBearingDesc(level);
        lubCard.style.display = 'block';
        lubText.textContent = getBearingDesc(level);

        addToHistory({
            tab: 'bearing',
            db: db,
            detail: type + '/' + rpm,
            level: level
        });
    }

    function classifyTrap() {
        var db = parseFloat(document.getElementById('trap-db').value);
        var type = document.getElementById('trap-type').value;

        if (isNaN(db) || db < 0) {
            resultContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            return;
        }

        var level = getTrapClass(db, type);
        if (!level) {
            resultContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            return;
        }

        resultDisplay.style.display = 'none';
        resultContainer.style.display = 'block';

        resultBadge.className = 'result-badge ' + level;
        resultBadge.innerHTML = '<i class="fas fa-circle"></i> ' + getTrapLabel(level);
        resultLabel.textContent = i18n.t('ultrassom.trap_result_label');
        resultText.textContent = db.toFixed(1) + ' dB \u00b5V - ' + getTrapDesc(level);
        lubCard.style.display = 'none';

        addToHistory({
            tab: 'trap',
            db: db,
            detail: type,
            level: level
        });
    }

    function classifyValve() {
        var db = parseFloat(document.getElementById('valve-db').value);
        var type = document.getElementById('valve-type').value;
        var pressure = parseFloat(document.getElementById('valve-pressure').value);

        if (isNaN(db) || db < 0) {
            resultContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            return;
        }

        var level = getValveClass(db, type);
        if (!level) {
            resultContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            return;
        }

        resultDisplay.style.display = 'none';
        resultContainer.style.display = 'block';

        resultBadge.className = 'result-badge ' + level;
        resultBadge.innerHTML = '<i class="fas fa-circle"></i> ' + getValveLabel(level);
        resultLabel.textContent = i18n.t('ultrassom.valve_result_label');
        resultText.textContent = db.toFixed(1) + ' dB \u00b5V @ ' + (isNaN(pressure) ? '?' : pressure.toFixed(1)) + ' bar - ' + getValveDesc(level);
        lubCard.style.display = 'none';

        addToHistory({
            tab: 'valve',
            db: db,
            detail: type + '/' + (isNaN(pressure) ? '?' : pressure.toFixed(1)) + 'bar',
            level: level
        });
    }

    function classify() {
        if (currentTab === 'bearing') classifyBearing();
        else if (currentTab === 'trap') classifyTrap();
        else if (currentTab === 'valve') classifyValve();
    }

    function clearForm() {
        var inputs = document.querySelectorAll('.tab-content.active input, .tab-content.active select');
        inputs.forEach(function (el) {
            if (el.tagName === 'SELECT') {
                el.selectedIndex = 0;
            } else {
                el.value = '';
            }
        });
        resultDisplay.style.display = 'flex';
        resultContainer.style.display = 'none';
        resultDisplay.innerHTML = '<i class="fas fa-wave-square"></i><p>' + i18n.t('ultrassom.result_placeholder') + '</p>';
    }

    function addToHistory(entry) {
        var now = new Date();
        var dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        var tabMap = {
            bearing: i18n.t('ultrassom.bearing'),
            trap: i18n.t('ultrassom.trap'),
            valve: i18n.t('ultrassom.valve')
        };

        history.unshift({
            date: dateStr,
            tab: entry.tab,
            tabLabel: tabMap[entry.tab] || entry.tab,
            db: entry.db,
            detail: entry.detail,
            level: entry.level
        });

        if (history.length > 20) history.pop();
        localStorage.setItem('ultrassomHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<li class="history-placeholder">' + i18n.t('ultrassom.no_history') + '</li>';
            return;
        }

        historyList.innerHTML = history.map(function (item) {
            return '<li>' +
                '<span class="history-label">' + item.tabLabel + '</span>' +
                '<span class="history-value">' + item.db.toFixed(1) + ' dB</span>' +
                '<span class="history-tag">' + item.detail + '</span>' +
                '<span class="history-badge ' + item.level + '">' + getResultLabel(item.level) + '</span>' +
                '</li>';
        }).join('');
    }

    function clearHistory() {
        if (confirm(i18n.t('ultrassom.confirm_clear'))) {
            history = [];
            localStorage.removeItem('ultrassomHistory');
            renderHistory();
        }
    }

    loadTheme();

    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(btn.dataset.tab);
        });
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', classify);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

    renderHistory();
});
