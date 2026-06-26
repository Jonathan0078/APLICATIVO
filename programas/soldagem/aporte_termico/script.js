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

function calcular() {
    var eficiencia = parseFloat(document.getElementById('processo').value);
    var corrente = parseFloat(document.getElementById('corrente').value);
    var tensao = parseFloat(document.getElementById('tensao').value);
    var velocidade = parseFloat(document.getElementById('velocidade').value);

    if (!corrente || !tensao || !velocidade) {
        document.getElementById('result-container').innerHTML = '<div class="resultado-container error"><i class="fa-solid fa-exclamation-circle"></i> ' +
            t('soldagem.aporte.erro_campos', 'Preencha todos os campos.') + '</div>';
        return;
    }

    var aporte = (corrente * tensao * eficiencia * 60) / (velocidade * 1000);
    var energiaArco = corrente * tensao * eficiencia / 1000;
    var velocidadeMs = velocidade / 1000 / 60;
    var taxaDeposicao = (corrente * tensao * eficiencia * 60 * 0.007) / (velocidade / 1000);

    document.getElementById('result-container').innerHTML = '<div class="resultado-container success"><h3><i class="fa-solid fa-check-circle"></i> ' +
        t('result.title', 'Resultados') + '</h3><div class="result-grid">' +
        '<div class="result-item full"><div class="label">' + t('soldagem.aporte.label_aporte', 'Aporte Térmico (Heat Input)') + '</div><div class="value">' + aporte.toFixed(2) + ' kJ/mm</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.aporte.label_energia', 'Energia do Arco') + '</div><div class="value">' + energiaArco.toFixed(2) + ' kW</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.aporte.label_velocidade_solda', 'Velocidade de Soldagem') + '</div><div class="value">' + velocidade + ' mm/min</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.aporte.label_velocidade', 'Velocidade') + '</div><div class="value">' + (velocidadeMs).toFixed(4) + ' m/s</div></div>' +
        interpretarAporte(aporte) +
        '</div></div>';
}

function interpretarAporte(aporte) {
    var label = t('soldagem.aporte.label_classificacao', 'Classificação');
    if (aporte < 0.5) return '<div class="result-item full"><div class="label">' + label + '</div><div class="value" style="color:var(--cor-info)">' + t('soldagem.aporte.classif_muito_baixo', 'Aporte muito baixo — risco de falta de fusão') + '</div></div>';
    if (aporte < 1.0) return '<div class="result-item full"><div class="label">' + label + '</div><div class="value" style="color:var(--cor-sucesso)">' + t('soldagem.aporte.classif_baixo', 'Aporte baixo — ideal para aços inoxidáveis') + '</div></div>';
    if (aporte < 2.0) return '<div class="result-item full"><div class="label">' + label + '</div><div class="value" style="color:var(--cor-sucesso)">' + t('soldagem.aporte.classif_medio', 'Aporte médio — adequado para aço carbono') + '</div></div>';
    if (aporte < 3.0) return '<div class="result-item full"><div class="label">' + label + '</div><div class="value" style="color:var(--cor-destaque)">' + t('soldagem.aporte.classif_alto', 'Aporte alto — verificar risco de ZTA') + '</div></div>';
    return '<div class="result-item full"><div class="label">' + label + '</div><div class="value" style="color:var(--cor-erro)">' + t('soldagem.aporte.classif_muito_alto', 'Aporte muito alto — risco de trincas e fragilização') + '</div></div>';
}
