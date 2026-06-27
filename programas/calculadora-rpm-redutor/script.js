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
const calculateBtn = document.getElementById('calculate-btn');

// Tema
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    themeToggle.checked = theme === 'dark';
    localStorage.setItem('rpm-redutor-theme', theme);
}

themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked ? 'dark' : 'light');
});

// Abas (Parâmetros / Resultados)
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(targetId) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === targetId);
    });
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === targetId);
    });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

// Tooltips (toque/clique no ícone "?")
document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const container = icon.closest('.tooltip-container');
        const isOpen = container.classList.contains('show');
        document.querySelectorAll('.tooltip-container').forEach(c => c.classList.remove('show'));
        if (!isOpen) container.classList.add('show');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('info-icon')) {
        document.querySelectorAll('.tooltip-container').forEach(c => c.classList.remove('show'));
    }
});

// Mostrar/ocultar campo personalizado
motorSelect.addEventListener('change', () => {
    customRpmDiv.style.display = motorSelect.value === 'Personalizado' ? 'block' : 'none';
});

// Função de cálculo principal
function calculate() {
    clearErrors();
    let rpmMotor = getRpmMotor();
    const i = parseFloat(reductionInput.value);
    const power = parseFloat(powerInput.value) || 0;
    const efficiency = parseFloat(efficiencyInput.value) / 100 || 0.95;

    if (!validateInputs(rpmMotor, i)) return false;

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

    return true;
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
        showError('custom-error', i18n.t('rpm.error_rpm_range'));
        valid = false;
    }
    if (isNaN(i) || i <= 0 || i > 200) {
        showError('reduction-error', i18n.t('rpm.error_reduction_range'));
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
        li.textContent = `${item.date}: ${i18n.t('rpm.motor')} ${item.motor} (${item.rpmMotor} RPM), i=${item.i}, ${i18n.t('rpm.final_rpm')} ${item.rpmFinal}`;
        if (item.power > 0) {
            li.textContent += `, ${i18n.t('rpm.input_torque')} ${((item.power * 9550) / item.rpmMotor).toFixed(2)} Nm`;
        }
        historyList.appendChild(li);
    });
}

// Calcular -> mostra resultados na aba "Resultados"
calculateBtn.addEventListener('click', () => {
    if (calculate()) {
        switchTab('tab-results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

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
    switchTab('tab-params');
});

// Exportar
document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = `RPM Final: ${rpmFinalSpan.textContent} RPM\n${torqueResultDiv.style.display === 'block' ? `Torque Entrada: ${torqueInputSpan.textContent} Nm\nTorque Saída: ${torqueOutputSpan.textContent} Nm` : ''}`;
    navigator.clipboard.writeText(text).then(() => alert(i18n.t('rpm.copied')));
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    setTheme(localStorage.getItem('rpm-redutor-theme') || 'light');
    renderHistory();
});
