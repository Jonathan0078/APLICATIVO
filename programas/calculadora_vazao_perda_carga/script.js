document.getElementById('calculateBtn').addEventListener('click', function() {
    // Get input values
    const flowRateQ_m3h = parseFloat(document.getElementById('flowRate').value);
    const diameterD_mm = parseFloat(document.getElementById('diameter').value);
    const lengthL_m = parseFloat(document.getElementById('length').value);
    const roughnessE_mm = parseFloat(document.getElementById('roughness').value);
    const viscosityV_cSt = parseFloat(document.getElementById('viscosity').value);

    if (isNaN(flowRateQ_m3h) || isNaN(diameterD_mm) || isNaN(lengthL_m) || isNaN(roughnessE_mm) || isNaN(viscosityV_cSt) ||
        flowRateQ_m3h <= 0 || diameterD_mm <= 0 || lengthL_m <= 0 || roughnessE_mm < 0 || viscosityV_cSt <= 0) {
        alert("Por favor, preencha todos os campos com valores numéricos válidos e maiores que zero (exceto rugosidade que pode ser zero).");
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

    const headLossHf_m = frictionFactorF * (lengthL_m / diameterD_m) * (Math.pow(velocityV_ms, 2) / (2 * g));

    // Display results
    document.getElementById('velocity').textContent = velocityV_ms.toFixed(3);
    document.getElementById('reynolds').textContent = reynoldsRe.toExponential(2);
    document.getElementById('frictionFactor').textContent = frictionFactorF.toFixed(4);
    document.getElementById('headLoss').textContent = headLossHf_m.toFixed(3);
    
    // Show results container and hide placeholder
    document.getElementById('results').style.display = 'grid';
    document.getElementById('resultPlaceholder').style.display = 'none';
});