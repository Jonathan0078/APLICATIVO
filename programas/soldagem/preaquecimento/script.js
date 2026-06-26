var acos = {
    a36: { C: 0.26, Mn: 1.20, Cr: 0, Mo: 0, V: 0, Cu: 0, Ni: 0 },
    a572_50: { C: 0.23, Mn: 1.35, Cr: 0, Mo: 0, V: 0.06, Cu: 0, Ni: 0 },
    a516_70: { C: 0.27, Mn: 0.85, Cr: 0, Mo: 0, V: 0, Cu: 0, Ni: 0 },
    api_5l_x65: { C: 0.16, Mn: 1.65, Cr: 0, Mo: 0.05, V: 0.07, Cu: 0, Ni: 0 },
    abnt_300: { C: 0.20, Mn: 0.45, Cr: 0, Mo: 0, V: 0, Cu: 0, Ni: 0 }
};

function t(key, fallback) {
    return (window.i18n && typeof window.i18n.t === 'function') ? (window.i18n.t(key) || fallback) : fallback;
}

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

function presetAco() {
    var tipo = document.getElementById('tipoAco').value;
    if (tipo === 'custom') return;
    var aco = acos[tipo];
    if (!aco) return;
    document.getElementById('carbono').value = aco.C;
    document.getElementById('manganes').value = aco.Mn;
    document.getElementById('cromo').value = aco.Cr;
    document.getElementById('molibdenio').value = aco.Mo;
    document.getElementById('vanadio').value = aco.V;
    document.getElementById('cobre').value = aco.Cu;
    document.getElementById('niquel').value = aco.Ni;
}

function calcular() {
    var C = parseFloat(document.getElementById('carbono').value) || 0;
    var Mn = parseFloat(document.getElementById('manganes').value) || 0;
    var Cr = parseFloat(document.getElementById('cromo').value) || 0;
    var Mo = parseFloat(document.getElementById('molibdenio').value) || 0;
    var V = parseFloat(document.getElementById('vanadio').value) || 0;
    var Cu = parseFloat(document.getElementById('cobre').value) || 0;
    var Ni = parseFloat(document.getElementById('niquel').value) || 0;
    var esp = parseFloat(document.getElementById('espessuraChapa').value) || 0;
    var H = parseFloat(document.getElementById('hidrogenio').value) || 10;

    if (esp < 1) {
        document.getElementById('result-container').innerHTML = '<div class="resultado-container error"><i class="fa-solid fa-exclamation-circle"></i> ' + t('soldagem.preaquecimento.erro_espessura', 'Informe a espessura da chapa.') + '</div>';
        return;
    }

    // CE (IIW) = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
    var ceIIW = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15;

    // CE (CEN) = C + Mn/10 + (Cr+Mo)/15 + V/10 + Ni/18 + 5*B (sem B)
    var ceCEN = C + Mn/10 + (Cr + Mo)/15 + V/10 + Ni/18;

    // Temperatura de pré-aquecimento (método simplificado baseado no CE+espessura)
    var preheat = 0;
    var recomendacao = '';

    if (ceIIW < 0.35) {
        preheat = 0;
        recomendacao = t('soldagem.preaquecimento.rec_nenhum', 'Nenhum pré-aquecimento necessário.');
    } else if (ceIIW < 0.45) {
        if (esp > 25) { preheat = 50; recomendacao = t('soldagem.preaquecimento.rec_leve', 'Pré-aquecimento leve recomendado para chapas espessas (>25mm).'); }
        else { preheat = 0; recomendacao = t('soldagem.preaquecimento.rec_nao_necessario', 'Geralmente não necessário. Monitorar em dias frios.'); }
    } else if (ceIIW < 0.60) {
        preheat = Math.round(50 + (ceIIW - 0.45) * 200);
        preheat = Math.min(preheat, 150);
        recomendacao = t('soldagem.preaquecimento.rec_obrigatorio', 'Pré-aquecimento obrigatório. Controlar taxa de resfriamento.');
    } else {
        preheat = Math.round(100 + (ceIIW - 0.60) * 150 + (H / 10) * 20);
        preheat = Math.min(preheat, 300);
        recomendacao = t('soldagem.preaquecimento.rec_rigoroso', 'Pré-aquecimento obrigatório. Necessário controle rigoroso de hidrogênio.');
    }

    var hasHtml = '';
    if (preheat > 0) {
        hasHtml = '<div class="result-item full"><div class="label">' + t('soldagem.preaquecimento.label_preaquecimento', 'Recomendação de Pré-Aquecimento') + '</div><div class="value" style="color:' + (preheat < 100 ? 'var(--cor-sucesso)' : 'var(--cor-erro)') + '">' + preheat + ' °C</div></div>';
    }

    document.getElementById('result-container').innerHTML = '<div class="resultado-container ' + (preheat === 0 ? 'success' : preheat < 100 ? 'success' : 'warning') + '"><h3><i class="fa-solid fa-check-circle"></i> ' + t('soldagem.preaquecimento.result_title', 'Resultados da Análise') + '</h3><div class="result-grid">' +
        '<div class="result-item"><div class="label">' + t('soldagem.preaquecimento.label_ce_iiw', 'Carbono Equivalente (CE-IIW)') + '</div><div class="value">' + ceIIW.toFixed(3) + '</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.preaquecimento.label_ce_cen', 'Carbono Equivalente (CE-CEN)') + '</div><div class="value">' + ceCEN.toFixed(3) + '</div></div>' +
        (preheat > 0 ? '<div class="result-item full"><div class="label">' + t('soldagem.preaquecimento.label_temperatura', 'Temperatura de Pré-Aquecimento') + '</div><div class="value" style="color:' + (preheat < 100 ? 'var(--cor-sucesso)' : 'var(--cor-destaque)') + '">' + preheat + ' °C</div></div>' : '') +
        '<div class="result-item full"><div class="label">' + t('soldagem.preaquecimento.label_observacao', 'Observação') + '</div><div class="value" style="font-size:1rem;color:var(--text-secondary)">' + recomendacao + '</div></div>' +
        '</div></div>';
}