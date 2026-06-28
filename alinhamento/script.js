var toleranceData = [
    { rpm: 'lt500', height: 'lt100', parallel: 0.10, angular: 0.10, axial: 0.20 },
    { rpm: 'lt500', height: '100-300', parallel: 0.12, angular: 0.12, axial: 0.25 },
    { rpm: 'lt500', height: '300-600', parallel: 0.15, angular: 0.15, axial: 0.30 },
    { rpm: 'lt500', height: 'gt600', parallel: 0.18, angular: 0.18, axial: 0.35 },
    { rpm: '500-1500', height: 'lt100', parallel: 0.08, angular: 0.08, axial: 0.15 },
    { rpm: '500-1500', height: '100-300', parallel: 0.10, angular: 0.10, axial: 0.20 },
    { rpm: '500-1500', height: '300-600', parallel: 0.12, angular: 0.12, axial: 0.25 },
    { rpm: '500-1500', height: 'gt600', parallel: 0.14, angular: 0.14, axial: 0.30 },
    { rpm: '1500-3000', height: 'lt100', parallel: 0.05, angular: 0.05, axial: 0.10 },
    { rpm: '1500-3000', height: '100-300', parallel: 0.06, angular: 0.06, axial: 0.12 },
    { rpm: '1500-3000', height: '300-600', parallel: 0.08, angular: 0.08, axial: 0.15 },
    { rpm: '1500-3000', height: 'gt600', parallel: 0.10, angular: 0.10, axial: 0.20 },
    { rpm: '3000-5000', height: 'lt100', parallel: 0.03, angular: 0.03, axial: 0.06 },
    { rpm: '3000-5000', height: '100-300', parallel: 0.04, angular: 0.04, axial: 0.08 },
    { rpm: '3000-5000', height: '300-600', parallel: 0.05, angular: 0.05, axial: 0.10 },
    { rpm: '3000-5000', height: 'gt600', parallel: 0.06, angular: 0.06, axial: 0.12 },
    { rpm: 'gt5000', height: 'any', parallel: 0.02, angular: 0.02, axial: 0.04 }
];

var rpmLabels = {
    lt500: '< 500',
    '500-1500': '500 - 1500',
    '1500-3000': '1500 - 3000',
    '3000-5000': '3000 - 5000',
    gt5000: '> 5000'
};

var heightLabels = {
    lt100: '< 100',
    '100-300': '100 - 300',
    '300-600': '300 - 600',
    gt600: '> 600',
    any: 'Qualquer'
};

document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('theme-toggle');
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    var rpmSelect = document.getElementById('input-rpm');
    var heightSelect = document.getElementById('input-height');
    var couplingSelect = document.getElementById('input-coupling');
    var tableBody = document.getElementById('table-body');
    var calcBtn = document.getElementById('calc-btn');
    var clearBtn = document.getElementById('clear-btn');
    var clearHistoryBtn = document.getElementById('clear-history-btn');
    var resultDisplay = document.getElementById('result-display');
    var shimResults = document.getElementById('shim-results');
    var shimFrontValue = document.getElementById('shim-front-value');
    var shimRearValue = document.getElementById('shim-rear-value');
    var shimFrontAction = document.getElementById('shim-front-action');
    var shimRearAction = document.getElementById('shim-rear-action');
    var historyList = document.getElementById('history-list');

    var history = JSON.parse(localStorage.getItem('alinhamentoHistory')) || [];

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

    function switchTab(tabId) {
        tabBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        tabContents.forEach(function (tc) {
            tc.classList.toggle('active', tc.id === tabId);
        });
    }

    function buildTable() {
        tableBody.innerHTML = '';
        toleranceData.forEach(function (row) {
            var tr = document.createElement('tr');
            if (row.rpm === 'gt5000' && row.height === 'any') {
                tr.innerHTML =
                    '<td>' + rpmLabels[row.rpm] + '</td>' +
                    '<td>' + heightLabels[row.height] + '</td>' +
                    '<td>' + row.parallel.toFixed(2) + '</td>' +
                    '<td>' + row.angular.toFixed(2) + '</td>' +
                    '<td>' + row.axial.toFixed(2) + '</td>';
            } else {
                tr.innerHTML =
                    '<td>' + rpmLabels[row.rpm] + '</td>' +
                    '<td>' + heightLabels[row.height] + ' mm</td>' +
                    '<td>' + row.parallel.toFixed(2) + '</td>' +
                    '<td>' + row.angular.toFixed(2) + '</td>' +
                    '<td>' + row.axial.toFixed(2) + '</td>';
            }
            tableBody.appendChild(tr);
        });
        highlightRow();
    }

    function highlightRow() {
        var rows = tableBody.querySelectorAll('tr');
        var selectedRpm = rpmSelect.value;
        var selectedHeight = heightSelect.value;

        rows.forEach(function (row, index) {
            var data = toleranceData[index];
            var match = false;
            if (data.rpm === 'gt5000' && data.height === 'any') {
                match = selectedRpm === data.rpm;
            } else {
                match = selectedRpm === data.rpm && selectedHeight === data.height;
            }
            row.classList.toggle('active-row', match);
        });
    }

    function calculateShims() {
        var readingFront = parseFloat(document.getElementById('input-reading-front').value);
        var readingRear = parseFloat(document.getElementById('input-reading-rear').value);
        var distFeet = parseFloat(document.getElementById('input-dist-feet').value);
        var distCoupling = parseFloat(document.getElementById('input-dist-coupling').value);
        var desiredParallel = parseFloat(document.getElementById('input-desired-parallel').value) || 0;
        var desiredAngular = parseFloat(document.getElementById('input-desired-angular').value) || 0;

        if (isNaN(readingFront) || isNaN(readingRear) || isNaN(distFeet) || isNaN(distCoupling) || distFeet <= 0) {
            resultDisplay.style.display = 'flex';
            shimResults.style.display = 'none';
            resultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('alinhamento.error_invalid') + '</p>';
            return;
        }

        var angularCorrectionFront = desiredAngular * distCoupling / 100;
        var angularCorrectionRear = desiredAngular * (distCoupling + distFeet) / 100;

        var shimFront = readingFront - desiredParallel - angularCorrectionFront;
        var shimRear = readingRear - desiredParallel - angularCorrectionRear;

        resultDisplay.style.display = 'none';
        shimResults.style.display = 'grid';

        shimFrontValue.textContent = Math.abs(shimFront).toFixed(3) + ' mm';
        shimRearValue.textContent = Math.abs(shimRear).toFixed(3) + ' mm';

        if (Math.abs(shimFront) < 0.001) {
            shimFrontAction.textContent = i18n.t('alinhamento.shim_none');
            shimFrontAction.className = 'shim-action none';
        } else if (shimFront > 0) {
            shimFrontAction.textContent = i18n.t('alinhamento.shim_add');
            shimFrontAction.className = 'shim-action add';
        } else {
            shimFrontAction.textContent = i18n.t('alinhamento.shim_remove');
            shimFrontAction.className = 'shim-action remove';
        }

        if (Math.abs(shimRear) < 0.001) {
            shimRearAction.textContent = i18n.t('alinhamento.shim_none');
            shimRearAction.className = 'shim-action none';
        } else if (shimRear > 0) {
            shimRearAction.textContent = i18n.t('alinhamento.shim_add');
            shimRearAction.className = 'shim-action add';
        } else {
            shimRearAction.textContent = i18n.t('alinhamento.shim_remove');
            shimRearAction.className = 'shim-action remove';
        }

        addToHistory({
            readingFront: readingFront,
            readingRear: readingRear,
            distFeet: distFeet,
            distCoupling: distCoupling,
            shimFront: shimFront,
            shimRear: shimRear
        });
    }

    function clearInputs() {
        document.getElementById('input-reading-front').value = '';
        document.getElementById('input-reading-rear').value = '';
        document.getElementById('input-dist-feet').value = '';
        document.getElementById('input-dist-coupling').value = '';
        document.getElementById('input-desired-parallel').value = '0';
        document.getElementById('input-desired-angular').value = '0';
        resultDisplay.style.display = 'flex';
        shimResults.style.display = 'none';
        resultDisplay.innerHTML =
            '<i class="fa-solid fa-ruler"></i>' +
            '<p>' + i18n.t('alinhamento.measurement_note') + '</p>';
    }

    function addToHistory(entry) {
        var now = new Date();
        var dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        history.unshift({
            date: dateStr,
            readingFront: entry.readingFront,
            readingRear: entry.readingRear,
            distFeet: entry.distFeet,
            distCoupling: entry.distCoupling,
            shimFront: entry.shimFront,
            shimRear: entry.shimRear
        });

        if (history.length > 20) history.pop();
        localStorage.setItem('alinhamentoHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML =
                '<li class="history-placeholder">' + i18n.t('alinhamento.no_history') + '</li>';
            return;
        }

        historyList.innerHTML = history.map(function (item) {
            var frontAction = Math.abs(item.shimFront) < 0.001
                ? '-'
                : (item.shimFront > 0 ? '+' : '-') + Math.abs(item.shimFront).toFixed(2);
            var rearAction = Math.abs(item.shimRear) < 0.001
                ? '-'
                : (item.shimRear > 0 ? '+' : '-') + Math.abs(item.shimRear).toFixed(2);
            return '<li>' +
                '<span class="history-label">' + item.date + '</span>' +
                '<span class="history-value">F:' + frontAction + ' R:' + rearAction + ' mm</span>' +
                '</li>';
        }).join('');
    }

    function clearHistory() {
        if (confirm(i18n.t('alinhamento.confirm_clear'))) {
            history = [];
            localStorage.removeItem('alinhamentoHistory');
            renderHistory();
        }
    }

    loadTheme();
    buildTable();

    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    if (rpmSelect) {
        rpmSelect.addEventListener('change', highlightRow);
    }

    if (heightSelect) {
        heightSelect.addEventListener('change', highlightRow);
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateShims);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearInputs);
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

    var shimInputs = [
        document.getElementById('input-reading-front'),
        document.getElementById('input-reading-rear'),
        document.getElementById('input-dist-feet'),
        document.getElementById('input-dist-coupling'),
        document.getElementById('input-desired-parallel'),
        document.getElementById('input-desired-angular')
    ];

    shimInputs.forEach(function (el) {
        if (el) {
            el.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') calculateShims();
            });
        }
    });

    renderHistory();
});
