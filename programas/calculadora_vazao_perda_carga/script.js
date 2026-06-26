// ─── Theme ───────────────────────────────────────────────────
(function() {
    var dark = localStorage.getItem('theme');
    var isDark = dark === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    var t = document.getElementById('themeToggle');
    if (t) t.checked = isDark;
})();
document.getElementById('themeToggle')?.addEventListener('change', function() {
    var dark = this.checked;
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
});

document.getElementById('calculateBtn').addEventListener('click', function() {
    // Get input values
    const flowRateQ_m3h = parseFloat(document.getElementById('flowRate').value);
    const diameterD_mm = parseFloat(document.getElementById('diameter').value);
    const lengthL_m = parseFloat(document.getElementById('length').value);
    const roughnessE_mm = parseFloat(document.getElementById('roughness').value);
    const viscosityV_cSt = parseFloat(document.getElementById('viscosity').value);

    if (isNaN(flowRateQ_m3h) || isNaN(diameterD_mm) || isNaN(lengthL_m) || isNaN(roughnessE_mm) || isNaN(viscosityV_cSt) ||
        flowRateQ_m3h <= 0 || diameterD_mm <= 0 || lengthL_m <= 0 || roughnessE_mm < 0 || viscosityV_cSt <= 0) {
        alert(i18n.t('vazao.error_invalid_inputs'));
        return;
    }

    // Constants
    const g = 9.81; // m/s^2

    // Unit Conversions
    const flowRateQ_m3s = flowRateQ_m3h / 3600;
    const diameterD_m = diameterD_mm / 1000;
    const roughnessE_m = roughnessE_mm / 1000;
    const viscosityV_m2s = viscosityV_cSt * 1e-6;

    // Calculations
    const areaA_m2 = Math.PI * Math.pow(diameterD_m / 2, 2);
    const velocityV_ms = flowRateQ_m3s / areaA_m2;
    const reynoldsRe = (velocityV_ms * diameterD_m) / viscosityV_m2s;

    let frictionFactorF;
    if (reynoldsRe < 2300) {
        // Laminar flow
        frictionFactorF = 64 / reynoldsRe;
    } else {
        // Turbulent flow - using Swamee-Jain equation
        const term1 = roughnessE_m / (3.7 * diameterD_m);
        const term2 = 5.74 / Math.pow(reynoldsRe, 0.9);
        frictionFactorF = 0.25 / Math.pow(Math.log10(term1 + term2), 2);
    }

    // Perda de carga unitária (J) em m.c.a/m
    const headLoss_J = (frictionFactorF / diameterD_m) * (Math.pow(velocityV_ms, 2) / (2 * g));

    // Display results
    document.getElementById('velocity').textContent = velocityV_ms.toFixed(3);
    document.getElementById('reynolds').textContent = reynoldsRe.toExponential(2);
    document.getElementById('frictionFactor').textContent = frictionFactorF.toFixed(4);
    document.getElementById('headLoss').textContent = headLoss_J.toFixed(3);
    
    // Show results container and hide placeholder
    document.getElementById('results').style.display = 'grid';
    document.getElementById('resultPlaceholder').style.display = 'none';
});

document.getElementById('clearBtn').addEventListener('click', function() {
    // Clear all input fields
    document.getElementById('flowRate').value = '';
    document.getElementById('diameter').value = '';
    document.getElementById('length').value = '';
    document.getElementById('roughness').value = '0.046'; // Reset to default
    document.getElementById('viscosity').value = '1.004'; // Reset to default

    // Hide results and show placeholder
    document.getElementById('results').style.display = 'none';
    document.getElementById('resultPlaceholder').style.display = 'block';
});