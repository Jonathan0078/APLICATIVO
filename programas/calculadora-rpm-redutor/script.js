// Dados dos motores
const dadosMotores = {
    "2 Polos": 3500,
    "4 Polos": 1750,
    "6 Polos": 1150,
    "8 Polos": 875,
    "10 Polos": 700,
    "Personalizado": null
};

// Elementos DOM
const motorSelect = document.getElementById('motor-select');
const customRpmDiv = document.getElementById('custom-rpm');
const customRpmInput = document.getElementById('custom-rpm-input');
const reductionInput = document.getElementById('reduction-input');
const powerInput = document.getElementById('power-input');
const efficiencyInput = document.getElementById('efficiency-input');
const resultDiv = document.getElementById('result');
const rpmFinalSpan = document.getElementById('rpm-final');
const torqueResultDiv = document.getElementById('torque-result');
const torqueInputSpan = document.getElementById('torque-input');
const torqueOutputSpan = document.getElementById('torque-output');
const motorRpmText = document.getElementById('motor-rpm');
const reductionRatioText = document.getElementById('reduction-ratio');
const outputRpmText = document.getElementById('output-rpm');
const historyList = document.getElementById('history-list');

// Tema
const themeToggle = document.getElementById('theme-toggle-checkbox');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
});

// Tooltips
document.querySelectorAll('.help-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tooltipId = btn.getAttribute('data-tooltip');
        const tooltip = document.getElementById(tooltipId);
        tooltip.classList.toggle('show');
        // Ocultar outros tooltips
        document.querySelectorAll('.tooltip').forEach(t => {
            if (t !== tooltip) t.classList.remove('show');
        });
    });
});

// Ocultar tooltips ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('help-btn')) {
        document.querySelectorAll('.tooltip').forEach(t => t.classList.remove('show'));
    }
});

// Mostrar/ocultar campo personalizado
motorSelect.addEventListener('change', () => {
    customRpmDiv.style.display = motorSelect.value === 'Personalizado' ? 'block' : 'none';
    calculate();
});

// Eventos para cálculo em tempo real
[motorSelect, customRpmInput, reductionInput, powerInput, efficiencyInput].forEach(el => {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
});

// Função de cálculo principal
function calculate() {
    clearErrors();
    let rpmMotor = getRpmMotor();
    const i = parseFloat(reductionInput.value);
    const power = parseFloat(powerInput.value) || 0;
    const efficiency = parseFloat(efficiencyInput.value) / 100 || 0.95;

    if (!validateInputs(rpmMotor, i)) return;

    const rpmFinal = rpmMotor / i;
    rpmFinalSpan.textContent = rpmFinal.toFixed(2);

    // Torque
    if (power > 0) {
        const torqueInput = (power * 9550) / rpmMotor;
        const torqueOutput = torqueInput * i * efficiency;
        torqueInputSpan.textContent = torqueInput.toFixed(2);
        torqueOutputSpan.textContent = torqueOutput.toFixed(2);
        torqueResultDiv.style.display = 'block';
    } else {
        torqueResultDiv.style.display = 'none';
    }

    // Diagrama
    motorRpmText.textContent = `RPM: ${rpmMotor}`;
    reductionRatioText.textContent = `i: ${i}`;
    outputRpmText.textContent = `RPM: ${rpmFinal.toFixed(2)}`;

    resultDiv.style.display = 'block';
    addToHistory(rpmMotor, i, rpmFinal, power, efficiency);
}

// Obter RPM do motor
function getRpmMotor() {
    if (motorSelect.value === 'Personalizado') {
        return parseFloat(customRpmInput.value);
    }
    return dadosMotores[motorSelect.value];
}

// Validação
function validateInputs(rpmMotor, i) {
    let valid = true;
    if (motorSelect.value === 'Personalizado' && (isNaN(rpmMotor) || rpmMotor <= 0 || rpmMotor > 10000)) {
        showError('custom-error', 'RPM deve ser um número positivo entre 1 e 10000.');
        valid = false;
    }
    if (isNaN(i) || i <= 0 || i > 200) {
        showError('reduction-error', 'Taxa de redução deve ser um número positivo entre 0.1 e 200.');
        valid = false;
    }
    return valid;
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

// Histórico
function addToHistory(rpmMotor, i, rpmFinal, power, efficiency) {
    const entry = {
        motor: motorSelect.value,
        rpmMotor,
        i,
        rpmFinal: rpmFinal.toFixed(2),
        power,
        efficiency: (efficiency * 100).toFixed(1),
        date: new Date().toLocaleString()
    };
    let history = JSON.parse(localStorage.getItem('rpmHistory')) || [];
    history.unshift(entry);
    history = history.slice(0, 10); // Máximo 10
    localStorage.setItem('rpmHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('rpmHistory')) || [];
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.date}: Motor ${item.motor} (${item.rpmMotor} RPM), i=${item.i}, RPM Final=${item.rpmFinal}`;
        if (item.power > 0) {
            li.textContent += `, Torque Entrada=${((item.power * 9550) / item.rpmMotor).toFixed(2)} Nm`;
        }
        historyList.appendChild(li);
    });
}

// Reset
document.getElementById('reset-btn').addEventListener('click', () => {
    motorSelect.value = '2 Polos';
    customRpmInput.value = '';
    reductionInput.value = '';
    powerInput.value = '';
    efficiencyInput.value = '95';
    customRpmDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    torqueResultDiv.style.display = 'none';
    clearErrors();
    motorRpmText.textContent = 'RPM: -';
    reductionRatioText.textContent = 'i: -';
    outputRpmText.textContent = 'RPM: -';
});

// Exportar
document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = `RPM Final: ${rpmFinalSpan.textContent} RPM\n${torqueResultDiv.style.display === 'block' ? `Torque Entrada: ${torqueInputSpan.textContent} Nm\nTorque Saída: ${torqueOutputSpan.textContent} Nm` : ''}`;
    navigator.clipboard.writeText(text).then(() => alert('Resultado copiado!'));
});

// Inicializar
renderHistory();