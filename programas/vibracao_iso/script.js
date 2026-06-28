var zoneLimits = {
    I: {
        rigid: { a: 0.7, b: 1.8, c: 4.5 },
        flexible: { a: 1.1, b: 2.8, c: 7.1 }
    },
    II: {
        rigid: { a: 1.1, b: 2.8, c: 7.1 },
        flexible: { a: 1.8, b: 4.5, c: 11.2 }
    },
    III: {
        rigid: { a: 1.8, b: 4.5, c: 11.2 },
        flexible: { a: 2.8, b: 7.1, c: 18.0 }
    },
    IV: {
        rigid: { a: 2.8, b: 7.1, c: 18.0 },
        flexible: { a: 4.5, b: 11.2, c: 28.0 }
    }
};

var zoneKeys = ['A', 'B', 'C', 'D'];

document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('theme-toggle-checkbox');
    var calcBtn = document.getElementById('calc-btn');
    var clearBtn = document.getElementById('clear-btn');
    var velocityInput = document.getElementById('input-velocity');
    var classSelect = document.getElementById('input-class');
    var mountSelect = document.getElementById('input-mounting');
    var resultDisplay = document.getElementById('result-display');
    var zoneBadge = document.getElementById('zone-badge');
    var interpretationText = document.getElementById('interpretation-text');
    var interpretationContainer = document.getElementById('interpretation-container');
    var historyList = document.getElementById('history-list');

    var history = JSON.parse(localStorage.getItem('vibracaoHistory')) || [];

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

    function getZone(velocity, machineClass, mounting) {
        var limits = zoneLimits[machineClass][mounting];
        if (velocity <= limits.a) return 'A';
        if (velocity <= limits.b) return 'B';
        if (velocity <= limits.c) return 'C';
        return 'D';
    }

    function getZoneLabel(zone) {
        var labels = {
            A: i18n.t('vibracao.zone_a'),
            B: i18n.t('vibracao.zone_b'),
            C: i18n.t('vibracao.zone_c'),
            D: i18n.t('vibracao.zone_d')
        };
        return labels[zone] || '';
    }

    function getZoneDesc(zone) {
        var descs = {
            A: i18n.t('vibracao.zone_a_desc'),
            B: i18n.t('vibracao.zone_b_desc'),
            C: i18n.t('vibracao.zone_c_desc'),
            D: i18n.t('vibracao.zone_d_desc')
        };
        return descs[zone] || '';
    }

    function getShortLabel(zone) {
        var labels = {
            A: i18n.t('vibracao.good'),
            B: i18n.t('vibracao.satisfactory'),
            C: i18n.t('vibracao.unsatisfactory'),
            D: i18n.t('vibracao.unacceptable')
        };
        return labels[zone] || '';
    }

    function classify() {
        var velocity = parseFloat(velocityInput.value);
        if (isNaN(velocity) || velocity < 0) {
            interpretationContainer.style.display = 'none';
            resultDisplay.style.display = 'flex';
            resultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('vibracao.error_invalid') + '</p>';
            return;
        }

        var machineClass = classSelect.value;
        var mounting = mountSelect.value;
        var zone = getZone(velocity, machineClass, mounting);

        resultDisplay.style.display = 'none';
        interpretationContainer.style.display = 'block';

        zoneBadge.className = 'zone-badge zone-' + zone.toLowerCase();
        zoneBadge.innerHTML = '<i class="fa-solid fa-circle"></i> ' + getZoneLabel(zone);

        interpretationText.textContent = getZoneDesc(zone);

        addToHistory({
            velocity: velocity,
            machineClass: machineClass,
            mounting: mounting,
            zone: zone
        });
    }

    function addToHistory(entry) {
        var now = new Date();
        var dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        history.unshift({
            date: dateStr,
            velocity: entry.velocity,
            machineClass: entry.machineClass,
            mounting: entry.mounting,
            zone: entry.zone
        });

        if (history.length > 20) history.pop();
        localStorage.setItem('vibracaoHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML =
                '<li class="history-placeholder">' + i18n.t('vibracao.no_history') + '</li>';
            return;
        }

        historyList.innerHTML = history.map(function (item) {
            var zoneClass = 'zone-' + item.zone.toLowerCase();
            var zoneLabel = getShortLabel(item.zone);
            var classLabel = item.machineClass;
            var mountLabel = item.mounting === 'rigid'
                ? i18n.t('vibracao.mounting_rigid')
                : i18n.t('vibracao.mounting_flexible');

            return '<li>' +
                '<span class="history-label">' + item.date + '</span>' +
                '<span class="history-value">' + item.velocity.toFixed(2) + ' mm/s · Cl. ' + classLabel + '</span>' +
                '<span class="history-zone ' + zoneClass + '">' + zoneLabel + '</span>' +
                '</li>';
        }).join('');
    }

    function clearHistory() {
        if (confirm(i18n.t('vibracao.confirm_clear'))) {
            history = [];
            localStorage.removeItem('vibracaoHistory');
            renderHistory();
        }
    }

    loadTheme();

    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', classify);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearHistory);
    }

    [velocityInput, classSelect, mountSelect].forEach(function (el) {
        if (el) {
            el.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') classify();
            });
        }
    });

    renderHistory();
});
