let calculationResults = {};

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });
});

function calculateJFactor() {
    const inputs = {
        numTeethGear: parseFloat(document.getElementById('numTeethGear').value),
        numTeethPinion: parseFloat(document.getElementById('numTeethPinion').value),
        module: parseFloat(document.getElementById('module').value),
        pressureAngle: parseFloat(document.getElementById('pressureAngle').value),
        addendumCoeff: parseFloat(document.getElementById('addendumCoeff').value),
        faceWidth: parseFloat(document.getElementById('faceWidth').value),
        tangentialLoad: parseFloat(document.getElementById('tangentialLoad').value),
        shaperTeeth: parseFloat(document.getElementById('shaperTeeth').value),
        filletRadius: parseFloat(document.getElementById('filletRadius').value)
    };

    if (!validateInputs(inputs)) {
        alert(i18n.t('agma.error_check_inputs'));
        return;
    }

    const params = calculateIntermediateParameters(inputs);
    const results = {};

    if (document.getElementById('approach1').checked) {
        results.approach1 = calculateApproach1(params, inputs);
    }
    if (document.getElementById('approach2').checked) {
        results.approach2 = calculateApproach2(params, inputs);
    }
    if (document.getElementById('approach3').checked) {
        results.approach3 = calculateApproach3(params, inputs);
    }

    calculationResults = { inputs, params, results };
    displayResults(inputs, params, results);
}

function validateInputs(inputs) {
    if (inputs.numTeethGear < 20 || inputs.numTeethGear > 500) return false;
    if (inputs.numTeethPinion < 10 || inputs.numTeethPinion > 100) return false;
    if (inputs.module <= 0 || inputs.module > 10) return false;
    if (inputs.pressureAngle < 15 || inputs.pressureAngle > 30) return false;
    if (inputs.faceWidth <= 0) return false;
    if (inputs.tangentialLoad <= 0) return false;
    return true;
}

function calculateIntermediateParameters(inputs) {
    const N = inputs.numTeethGear;
    const x = inputs.addendumCoeff;
    const φn = inputs.pressureAngle * Math.PI / 180;
    const mn = inputs.module;
    const Ns = inputs.shaperTeeth;
    const rf = inputs.filletRadius;

    const rp = (N * mn) / 2;
    const rb = rp * Math.cos(φn);
    const ra = rp + (1 + x) * mn;
    const rd = rp - 1.25 * mn;
    const gammaB = (Math.PI / (2 * N)) + (2 * x * Math.tan(φn)) / N;
    const rL = ra;
    const φnL = Math.acos(rb / rL);
    const sF = 2 * rb * Math.tan(gammaB / 2);
    const rF = rf + (N * mn) / (2 * Ns);

    return { N, x, φn, φnDeg: inputs.pressureAngle, mn, Ns, rf, rp, rb, ra, rd, gammaB, rL, φnL, sF, rF };
}

function calculateApproach1(params, inputs) {
    const H = 0.331 - 0.436 * params.φnDeg * Math.PI / 180;
    const L = 0.324 - 0.492 * params.φnDeg * Math.PI / 180;
    const M = 0.261 + 0.545 * params.φnDeg * Math.PI / 180;
    const Kf = 1 + Math.exp(H + L * Math.log(params.rF) + M / Math.log(params.rF));
    const hF = params.rL * Math.sin(params.φnL) - params.rb;
    const J = (hF * Math.sin(params.φnL)) / (params.sF * params.sF * Kf);
    const sigma_b = (inputs.tangentialLoad * Kf) / (inputs.faceWidth * inputs.module * J);

    return {
        Kf: Kf.toFixed(4), hF: hF.toFixed(4),
        J: Math.max(J, 0.05).toFixed(6), sigma_b: sigma_b.toFixed(2),
        approach: 'AGMA 908-B89', description: i18n.t('agma.approach1_desc')
    };
}

function calculateApproach2(params, inputs) {
    const H = 0.3255 - 0.4167 * params.φnDeg * Math.PI / 180;
    const L = 0.3318 - 0.5209 * params.φnDeg * Math.PI / 180;
    const M = 0.2682 + 0.5259 * params.φnDeg * Math.PI / 180;
    const Kf = 1 + Math.exp(H + L * Math.log(params.rF) + M / Math.log(params.rF));
    const KfCircular = 1.3 + 0.5 / Math.sqrt(params.rF);
    const hF = params.rL * Math.sin(params.φnL) - params.rb;
    const J = (hF * Math.sin(params.φnL)) / (params.sF * params.sF * KfCircular);
    const sigma_b = (inputs.tangentialLoad * KfCircular) / (inputs.faceWidth * inputs.module * J);

    return {
        Kf: KfCircular.toFixed(4), hF: hF.toFixed(4),
        J: Math.max(J, 0.05).toFixed(6), sigma_b: sigma_b.toFixed(2),
        approach: 'AGMA 911-B21', description: i18n.t('agma.approach2_desc')
    };
}

function calculateApproach3(params, inputs) {
    const H = 0.331 - 0.436 * params.φnDeg * Math.PI / 180;
    const L = 0.324 - 0.492 * params.φnDeg * Math.PI / 180;
    const M = 0.261 + 0.545 * params.φnDeg * Math.PI / 180;
    const rFTrochoid = params.rF * (1 + 0.15 * Math.sin(params.φnL));
    const Kf = 1 + Math.exp(H + L * Math.log(rFTrochoid) + M / Math.log(rFTrochoid));
    const hF = params.rL * Math.sin(params.φnL) - params.rb;
    const J = (hF * Math.sin(params.φnL)) / (params.sF * params.sF * Kf * 0.95);
    const sigma_b = (inputs.tangentialLoad * Kf) / (inputs.faceWidth * inputs.module * J);

    return {
        Kf: Kf.toFixed(4), hF: hF.toFixed(4),
        J: Math.max(J, 0.05).toFixed(6), sigma_b: sigma_b.toFixed(2),
        approach: i18n.t('agma.approach3'), description: i18n.t('agma.approach3_desc')
    };
}

function displayResults(inputs, params, results) {
    const resultDisplay = document.getElementById('result-display');
    const parametersCard = document.getElementById('parameters-card');
    const stressCard = document.getElementById('stress-card');

    resultDisplay.innerHTML = '';
    let resultsHTML = '<div class="result-content">';

    Object.keys(results).forEach((approach) => {
        const result = results[approach];
        resultsHTML += `
            <div class="result-header">
                <div class="label">${result.approach}</div>
                <div class="value">${(parseFloat(result.J)).toFixed(4)}</div>
                <div style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.5rem;">
                    <strong>σ<sub>b</sub>:</strong> ${(parseFloat(result.sigma_b)).toFixed(2)} MPa
                </div>
            </div>
        `;
    });

    resultsHTML += '</div>';
    resultDisplay.innerHTML = resultsHTML;

    const parametersTableBody = document.getElementById('parametersTableBody');
    parametersTableBody.innerHTML = `
        <tr><td>${i18n.t('agma.param_num_teeth')}</td><td>${params.N}</td><td>${i18n.t('agma.units_teeth')}</td></tr>
        <tr><td>${i18n.t('agma.param_pitch_radius')}</td><td>${params.rp.toFixed(4)}</td><td>mm</td></tr>
        <tr><td>${i18n.t('agma.param_base_radius')}</td><td>${params.rb.toFixed(4)}</td><td>mm</td></tr>
        <tr><td>${i18n.t('agma.param_addendum_radius')}</td><td>${params.ra.toFixed(4)}</td><td>mm</td></tr>
        <tr><td>${i18n.t('agma.param_dedendum_radius')}</td><td>${params.rd.toFixed(4)}</td><td>mm</td></tr>
        <tr><td>${i18n.t('agma.param_fillet_radius')}</td><td>${params.rF.toFixed(4)}</td><td>mm</td></tr>
        <tr><td>${i18n.t('agma.param_tooth_thickness')}</td><td>${params.sF.toFixed(4)}</td><td>mm</td></tr>
        <tr><td>${i18n.t('agma.param_pressure_angle_n')}</td><td>${params.φnDeg}</td><td>°</td></tr>
    `;
    parametersCard.style.display = 'block';

    let stressCardsHTML = '<div class="results-grid">';
    Object.keys(results).forEach((approach) => {
        const result = results[approach];
        stressCardsHTML += `
            <div class="result-item">
                <div class="label">${result.approach}</div>
                <div class="value">${(parseFloat(result.sigma_b)).toFixed(2)}</div>
                <div class="unit" style="font-size:0.8rem;color:var(--text-light);">${i18n.t('agma.stress_unit')}</div>
            </div>
        `;
    });
    stressCardsHTML += '</div>';
    document.getElementById('stressResults').innerHTML = stressCardsHTML;
    stressCard.style.display = 'block';
}

function resetForm() {
    document.getElementById('numTeethGear').value = '100';
    document.getElementById('numTeethPinion').value = '25';
    document.getElementById('module').value = '1.0';
    document.getElementById('pressureAngle').value = '20';
    document.getElementById('addendumCoeff').value = '0.8';
    document.getElementById('faceWidth').value = '10';
    document.getElementById('tangentialLoad').value = '1000';
    document.getElementById('shaperTeeth').value = '50';
    document.getElementById('filletRadius').value = '0.25';
    document.getElementById('approach1').checked = true;
    document.getElementById('approach2').checked = true;
    document.getElementById('approach3').checked = true;

    document.getElementById('result-display').innerHTML = `
        <div class="result-placeholder">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>${i18n.t('agma.run_calc')}</p>
        </div>
    `;
    document.getElementById('parameters-card').style.display = 'none';
    document.getElementById('stress-card').style.display = 'none';
}

function exportResults() {
    if (!calculationResults.results || Object.keys(calculationResults.results).length === 0) {
        alert(i18n.t('agma.no_results_export'));
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += i18n.t('agma.csv_title') + '\n';
    csvContent += new Date().toLocaleString(i18n.current === 'pt' ? 'pt-BR' : i18n.current === 'es' ? 'es' : 'en') + '\n\n';

    csvContent += i18n.t('agma.csv_input_params') + '\n';
    csvContent += i18n.t('agma.csv_gear_teeth') + ',' + calculationResults.inputs.numTeethGear + '\n';
    csvContent += i18n.t('agma.csv_pinion_teeth') + ',' + calculationResults.inputs.numTeethPinion + '\n';
    csvContent += i18n.t('agma.csv_module') + ',' + calculationResults.inputs.module + '\n';
    csvContent += i18n.t('agma.csv_pressure_angle') + ',' + calculationResults.inputs.pressureAngle + '\n';
    csvContent += i18n.t('agma.csv_addendum') + ',' + calculationResults.inputs.addendumCoeff + '\n';
    csvContent += i18n.t('agma.csv_face_width') + ',' + calculationResults.inputs.faceWidth + '\n';
    csvContent += i18n.t('agma.csv_tangential_load') + ',' + calculationResults.inputs.tangentialLoad + '\n';
    csvContent += i18n.t('agma.csv_shaper_teeth') + ',' + calculationResults.inputs.shaperTeeth + '\n';
    csvContent += i18n.t('agma.csv_fillet_radius') + ',' + calculationResults.inputs.filletRadius + '\n\n';

    csvContent += i18n.t('agma.csv_intermediate_params') + '\n';
    csvContent += i18n.t('agma.csv_pitch_radius') + ',' + calculationResults.params.rp.toFixed(4) + '\n';
    csvContent += i18n.t('agma.csv_base_radius') + ',' + calculationResults.params.rb.toFixed(4) + '\n';
    csvContent += i18n.t('agma.csv_fillet_curvature') + ',' + calculationResults.params.rF.toFixed(4) + '\n';
    csvContent += i18n.t('agma.csv_tooth_thickness') + ',' + calculationResults.params.sF.toFixed(4) + '\n\n';

    csvContent += i18n.t('agma.csv_results') + '\n';
    csvContent += i18n.t('agma.csv_header') + '\n';
    Object.keys(calculationResults.results).forEach((approach) => {
        const result = calculationResults.results[approach];
        csvContent += result.approach + ',' + result.J + ',' + result.sigma_b + ',' + result.Kf + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AGMA_JFactor_Report_' + new Date().getTime() + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', function() {
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach(field => {
        field.addEventListener('change', function() {
            if (this.value === '' || isNaN(this.value)) {
                this.value = this.getAttribute('value');
            }
        });
    });
});

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        calculateJFactor();
    }
});
