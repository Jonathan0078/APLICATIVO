document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('theme-toggle-checkbox');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });
});

function t(key, fallback) {
    return (window.i18n && typeof window.i18n.t === 'function') ? (window.i18n.t(key) || fallback) : fallback;
}

function calcularConsumo() {
    var junta = parseFloat(document.getElementById('tipoJunta').value);
    var esp = parseFloat(document.getElementById('espessura').value);
    var comp = parseFloat(document.getElementById('comprimentoSolda').value);
    var efic = parseFloat(document.getElementById('eficiencia').value);

    if (!esp || !comp || !efic) { mostrarErro(t('soldagem.consumo.erro_campos_eletrodo', 'Preencha todos os campos obrigatórios.')); return; }

    var areaSecao = (junta * esp * esp) / 100; // cm²
    var volumeDepositado = areaSecao * (comp / 10); // cm³
    var massaDepositada = volumeDepositado * 7.85; // g (aço: 7.85 g/cm³)
    var massaEletrodo = massaDepositada / (efic / 100);
    var qtdEletrodos = Math.ceil(massaEletrodo / 100); // considerando eletrodos de ~100g

    document.getElementById('result-container').innerHTML = '<div class="resultado-container success"><h3><i class="fa-solid fa-check-circle"></i> ' +
        t('soldagem.consumo.result_smaw_title', 'SMAW — Consumo de Eletrodos') + '</h3><div class="result-grid">' +
        '<div class="result-item"><div class="label">' + t('soldagem.consumo.label_massa_depositada', 'Massa Depositada') + '</div><div class="value">' + massaDepositada.toFixed(1) + ' g</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.consumo.label_massa_eletrodos', 'Massa de Eletrodos') + '</div><div class="value">' + massaEletrodo.toFixed(1) + ' g</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.consumo.label_eletrodos_necessarios', 'Eletrodos Necessários (~100g)') + '</div><div class="value">' + qtdEletrodos + ' ' + t('soldagem.consumo.unidade_un', 'un') + '</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.consumo.label_volume_depositado', 'Volume Depositado') + '</div><div class="value">' + volumeDepositado.toFixed(1) + ' cm³</div></div>' +
        '</div></div>';
}

function calcularGas() {
    var vazao = parseFloat(document.getElementById('vazaoGas').value);
    var tempo = parseFloat(document.getElementById('tempoArco').value);

    if (!vazao || !tempo) { mostrarErro(t('soldagem.consumo.erro_campos_gas', 'Preencha a vazão e o tempo.')); return; }

    var volumeLitros = vazao * tempo;
    var volumeM3 = volumeLitros / 1000;

    document.getElementById('result-container').innerHTML = '<div class="resultado-container success"><h3><i class="fa-solid fa-wind"></i> ' +
        t('soldagem.consumo.result_gas_title', 'Gás de Proteção — Consumo') + '</h3><div class="result-grid">' +
        '<div class="result-item"><div class="label">' + t('soldagem.consumo.label_volume_total', 'Volume Total') + '</div><div class="value">' + volumeLitros.toFixed(0) + ' L</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.consumo.label_volume_total', 'Volume Total') + '</div><div class="value">' + volumeM3.toFixed(2) + ' m³</div></div>' +
        '</div></div>';
}

function mostrarErro(msg) {
    document.getElementById('result-container').innerHTML = '<div class="resultado-container error"><i class="fa-solid fa-exclamation-circle"></i> ' + msg + '</div>';
}
