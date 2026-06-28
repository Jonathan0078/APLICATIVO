document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('theme-toggle-checkbox');

    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    var sCalcBtn = document.getElementById('s-calc-btn');
    var sClearBtn = document.getElementById('s-clear-btn');
    var sResultDisplay = document.getElementById('s-result-display');
    var sResultContainer = document.getElementById('s-result-container');
    var sCorrMass = document.getElementById('s-corr-mass');
    var sCorrAngle = document.getElementById('s-corr-angle');
    var sResidual = document.getElementById('s-residual');
    var sQualityBadge = document.getElementById('s-quality-badge');

    var dCalcBtn = document.getElementById('d-calc-btn');
    var dClearBtn = document.getElementById('d-clear-btn');
    var dResultDisplay = document.getElementById('d-result-display');
    var dResultContainer = document.getElementById('d-result-container');
    var d1CorrMass = document.getElementById('d1-corr-mass');
    var d1CorrAngle = document.getElementById('d1-corr-angle');
    var d2CorrMass = document.getElementById('d2-corr-mass');
    var d2CorrAngle = document.getElementById('d2-corr-angle');

    var history = JSON.parse(localStorage.getItem('balanceamentoHistory')) || [];

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
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        tabContents.forEach(function (tc) {
            tc.classList.toggle('active', tc.id === tabId);
        });
    }

    function degToRad(deg) {
        return deg * Math.PI / 180;
    }

    function polarToRect(amp, phaseDeg) {
        var rad = degToRad(phaseDeg);
        return { x: amp * Math.cos(rad), y: amp * Math.sin(rad) };
    }

    function rectToPolar(x, y) {
        var mag = Math.sqrt(x * x + y * y);
        var ang = Math.atan2(y, x) * 180 / Math.PI;
        if (ang < 0) ang += 360;
        return { mag: mag, ang: ang };
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return parseFloat(el.value);
    }

    function getNumVal(id) {
        var v = getVal(id);
        return isNaN(v) ? 0 : v;
    }

    function showSingleResult(mass, angle, angleRelative, residual, quality) {
        sResultDisplay.style.display = 'none';
        sResultContainer.style.display = 'block';
        sCorrMass.textContent = mass.toFixed(1) + ' g';
        sCorrAngle.classList.add('angle-dual');
        sCorrAngle.innerHTML =
            '<span class="angle-main">' + angle.toFixed(1) + '° <small style="font-size:0.6em;font-weight:600;">abs.</small></span>' +
            '<span class="angle-secondary">' + angleRelative.toFixed(1) + '° rel. ao peso de teste</span>';
        sResidual.textContent = residual.toFixed(2) + ' mm/s (|E|)';
        sQualityBadge.textContent = quality;
        var qClass = quality === i18n.t('balanceamento.balancing_ok') ? 'quality-ok'
            : quality === i18n.t('balanceamento.balancing_fair') ? 'quality-fair'
            : 'quality-poor';
        sQualityBadge.className = 'result-value ' + qClass;
    }

    function showDualResult(p1mass, p1angle, p1angleRelative, p2mass, p2angle, p2angleRelative) {
        dResultDisplay.style.display = 'none';
        dResultContainer.style.display = 'block';
        d1CorrMass.textContent = p1mass.toFixed(1) + ' g';
        d1CorrAngle.classList.add('angle-dual');
        d1CorrAngle.innerHTML =
            '<span class="angle-main">' + p1angle.toFixed(1) + '° <small style="font-size:0.6em;font-weight:600;">abs.</small></span>' +
            '<span class="angle-secondary">' + p1angleRelative.toFixed(1) + '° rel. ao peso de teste</span>';
        d2CorrMass.textContent = p2mass.toFixed(1) + ' g';
        d2CorrAngle.classList.add('angle-dual');
        d2CorrAngle.innerHTML =
            '<span class="angle-main">' + p2angle.toFixed(1) + '° <small style="font-size:0.6em;font-weight:600;">abs.</small></span>' +
            '<span class="angle-secondary">' + p2angleRelative.toFixed(1) + '° rel. ao peso de teste</span>';
    }

    function calcSingle() {
        var v0a = getNumVal('s-v0-amp');
        var v0p = getNumVal('s-v0-phase');
        var twm = getNumVal('s-tw-mass');
        var twa = getNumVal('s-tw-angle');
        var v1a = getNumVal('s-v1-amp');
        var v1p = getNumVal('s-v1-phase');
        var rpm = getNumVal('s-rpm');

        if (v0a <= 0 || twm <= 0 || v1a <= 0) {
            sResultDisplay.style.display = 'flex';
            sResultContainer.style.display = 'none';
            sResultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('error.required') + '</p>';
            return;
        }

        if (v0p < 0 || v0p > 360 || twa < 0 || twa > 360 || v1p < 0 || v1p > 360) {
            sResultDisplay.style.display = 'flex';
            sResultContainer.style.display = 'none';
            sResultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('error.required') + '</p>';
            return;
        }

        var V0 = polarToRect(v0a, v0p);
        var TW = polarToRect(twm, twa);
        var V1 = polarToRect(v1a, v1p);

        var Ex = V1.x - V0.x;
        var Ey = V1.y - V0.y;
        var E = rectToPolar(Ex, Ey);

        var v0Mag = Math.sqrt(V0.x * V0.x + V0.y * V0.y);
        var eMag = E.mag;

        if (eMag < 0.0001) {
            sResultDisplay.style.display = 'flex';
            sResultContainer.style.display = 'none';
            sResultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('error.required') + '</p>';
            return;
        }

        var corrMag = twm * v0Mag / eMag;
        // Ângulo absoluto: C = -V0 × TW / E  →  ang(C) = v0p + 180 + twa - ang(E)
        var corrAngle = v0p + 180 + twa - (Math.atan2(Ey, Ex) * 180 / Math.PI);
        corrAngle = ((corrAngle % 360) + 360) % 360;

        // Ângulo relativo à posição do peso de teste (convenção usada pelo balanceador KNIKAO):
        // "gire X° a partir de onde o peso de teste foi instalado"
        var corrAngleRelative = ((corrAngle - twa) % 360 + 360) % 360;

        // effectRatio = |E| / |V0|: mede a sensibilidade do rotor ao peso de teste.
        // Valores ideais: 0.4 a 3.0. Abaixo de 0.2 indica peso insuficiente ou erro de medição.
        var effectRatio = eMag / v0Mag;

        var quality;
        if (effectRatio >= 0.4) {
            quality = i18n.t('balanceamento.balancing_ok');
        } else if (effectRatio >= 0.2) {
            quality = i18n.t('balanceamento.balancing_fair');
        } else {
            quality = i18n.t('balanceamento.balancing_poor');
        }

        showSingleResult(corrMag, corrAngle, corrAngleRelative, eMag, quality);

        addToHistory({
            type: 'single',
            corrMass: corrMag,
            corrAngle: corrAngle,
            corrAngleRelative: corrAngleRelative,
            residual: eMag,
            quality: quality
        });
    }

    function calcDual() {
        var d1v0a = getNumVal('d1-v0-amp');
        var d1v0p = getNumVal('d1-v0-phase');
        var d1twm = getNumVal('d1-tw-mass');
        var d1twa = getNumVal('d1-tw-angle');
        var d1v1a = getNumVal('d1-v1-amp');
        var d1v1p = getNumVal('d1-v1-phase');

        var d2v0a = getNumVal('d2-v0-amp');
        var d2v0p = getNumVal('d2-v0-phase');
        var d2twm = getNumVal('d2-tw-mass');
        var d2twa = getNumVal('d2-tw-angle');
        var d2v1a = getNumVal('d2-v1-amp');
        var d2v1p = getNumVal('d2-v1-phase');

        if (d1v0a <= 0 || d1twm <= 0 || d1v1a <= 0 || d2v0a <= 0 || d2twm <= 0 || d2v1a <= 0) {
            dResultDisplay.style.display = 'flex';
            dResultContainer.style.display = 'none';
            dResultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('error.required') + '</p>';
            return;
        }

        function checkPhase(p) { return p >= 0 && p <= 360; }
        if (!checkPhase(d1v0p) || !checkPhase(d1twa) || !checkPhase(d1v1p) ||
            !checkPhase(d2v0p) || !checkPhase(d2twa) || !checkPhase(d2v1p)) {
            dResultDisplay.style.display = 'flex';
            dResultContainer.style.display = 'none';
            dResultDisplay.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>' +
                '<p>' + i18n.t('error.required') + '</p>';
            return;
        }

        var P1_V0 = polarToRect(d1v0a, d1v0p);
        var P1_TW = polarToRect(d1twm, d1twa);
        var P1_V1 = polarToRect(d1v1a, d1v1p);

        var P2_V0 = polarToRect(d2v0a, d2v0p);
        var P2_TW = polarToRect(d2twm, d2twa);
        var P2_V1 = polarToRect(d2v1a, d2v1p);

        var P1_Ex = P1_V1.x - P1_V0.x;
        var P1_Ey = P1_V1.y - P1_V0.y;
        var P1_E = rectToPolar(P1_Ex, P1_Ey);

        var P2_Ex = P2_V1.x - P2_V0.x;
        var P2_Ey = P2_V1.y - P2_V0.y;
        var P2_E = rectToPolar(P2_Ex, P2_Ey);

        var p1V0mag = Math.sqrt(P1_V0.x * P1_V0.x + P1_V0.y * P1_V0.y);
        var p1Emag = P1_E.mag;
        var p1CorrMag = p1Emag > 0.0001 ? d1twm * p1V0mag / p1Emag : 0;
        var p1CorrAngle = 0;
        var p1CorrAngleRelative = 0;
        if (p1Emag > 0.0001) {
            p1CorrAngle = d1v0p + 180 + d1twa - (Math.atan2(P1_Ey, P1_Ex) * 180 / Math.PI);
            p1CorrAngle = ((p1CorrAngle % 360) + 360) % 360;
            p1CorrAngleRelative = ((p1CorrAngle - d1twa) % 360 + 360) % 360;
        }

        var p2V0mag = Math.sqrt(P2_V0.x * P2_V0.x + P2_V0.y * P2_V0.y);
        var p2Emag = P2_E.mag;
        var p2CorrMag = p2Emag > 0.0001 ? d2twm * p2V0mag / p2Emag : 0;
        var p2CorrAngle = 0;
        var p2CorrAngleRelative = 0;
        if (p2Emag > 0.0001) {
            p2CorrAngle = d2v0p + 180 + d2twa - (Math.atan2(P2_Ey, P2_Ex) * 180 / Math.PI);
            p2CorrAngle = ((p2CorrAngle % 360) + 360) % 360;
            p2CorrAngleRelative = ((p2CorrAngle - d2twa) % 360 + 360) % 360;
        }

        showDualResult(p1CorrMag, p1CorrAngle, p1CorrAngleRelative, p2CorrMag, p2CorrAngle, p2CorrAngleRelative);

        addToHistory({
            type: 'dual',
            p1mass: p1CorrMag,
            p1angle: p1CorrAngle,
            p1angleRelative: p1CorrAngleRelative,
            p2mass: p2CorrMag,
            p2angle: p2CorrAngle,
            p2angleRelative: p2CorrAngleRelative
        });
    }

    function addToHistory(entry) {
        var now = new Date();
        var dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        history.unshift({
            date: dateStr,
            entry: entry
        });
        if (history.length > 20) history.pop();
        localStorage.setItem('balanceamentoHistory', JSON.stringify(history));
    }

    function clearSingle() {
        document.getElementById('s-v0-amp').value = '';
        document.getElementById('s-v0-phase').value = '';
        document.getElementById('s-tw-mass').value = '';
        document.getElementById('s-tw-angle').value = '';
        document.getElementById('s-v1-amp').value = '';
        document.getElementById('s-v1-phase').value = '';
        document.getElementById('s-rpm').value = '';
        sResultDisplay.style.display = 'flex';
        sResultContainer.style.display = 'none';
    }

    function clearDual() {
        var ids = ['d1-v0-amp', 'd1-v0-phase', 'd1-tw-mass', 'd1-tw-angle', 'd1-v1-amp', 'd1-v1-phase',
                   'd2-v0-amp', 'd2-v0-phase', 'd2-tw-mass', 'd2-tw-angle', 'd2-v1-amp', 'd2-v1-phase'];
        ids.forEach(function (id) {
            document.getElementById(id).value = '';
        });
        dResultDisplay.style.display = 'flex';
        dResultContainer.style.display = 'none';
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

    if (sCalcBtn) {
        sCalcBtn.addEventListener('click', calcSingle);
    }

    if (sClearBtn) {
        sClearBtn.addEventListener('click', clearSingle);
    }

    if (dCalcBtn) {
        dCalcBtn.addEventListener('click', calcDual);
    }

    if (dClearBtn) {
        dClearBtn.addEventListener('click', clearDual);
    }

    var sInputs = ['s-v0-amp', 's-v0-phase', 's-tw-mass', 's-tw-angle', 's-v1-amp', 's-v1-phase', 's-rpm'];
    sInputs.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') calcSingle();
            });
        }
    });

    var dInputs = ['d1-v0-amp', 'd1-v0-phase', 'd1-tw-mass', 'd1-tw-angle', 'd1-v1-amp', 'd1-v1-phase',
                   'd2-v0-amp', 'd2-v0-phase', 'd2-tw-mass', 'd2-tw-angle', 'd2-v1-amp', 'd2-v1-phase'];
    dInputs.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') calcDual();
            });
        }
    });
});
