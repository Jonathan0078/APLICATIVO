var metais = {
    'A36': { grupo: 'aco_carbono', nome: 'ASTM A36' },
    'A572-50': { grupo: 'aco_carbono', nome: 'ASTM A572 Gr.50' },
    'SA516-70': { grupo: 'aco_carbono', nome: 'SA516 Gr.70' },
    '1020': { grupo: 'aco_carbono', nome: 'ABNT 1020' },
    '304': { grupo: 'inox', nome: 'AISI 304' },
    '304L': { grupo: 'inox', nome: 'AISI 304L' },
    '316': { grupo: 'inox', nome: 'AISI 316' },
    '316L': { grupo: 'inox', nome: 'AISI 316L' },
    '410': { grupo: 'inox', nome: 'AISI 410' },
    'CrMo-1.25': { grupo: 'aco_liga', nome: '1,25%Cr-0,5%Mo' },
    'CrMo-2.25': { grupo: 'aco_liga', nome: '2,25%Cr-1%Mo' },
    '9Ni': { grupo: 'aco_liga', nome: '9% Ni (A333)' },
    'Cobre': { grupo: 'outros', nome: 'Cobre' },
    'Aluminio': { grupo: 'outros', nome: 'Alumínio' },
    'Inconel': { grupo: 'outros', nome: 'Inconel 600' }
};

// Tabela de compatibilidade: [metal1][metal2] = { recomendacao, observacao }
var compatibilidade = {
    'A36_304': { recomendacao: 'E309L / ER309L', observacao: 'Usar E309L-16 para evitar trincas por diluição. Pré-aquecimento não necessário.', compativel: true },
    'A36_304L': { recomendacao: 'E309L / ER309L', observacao: 'Mesma recomendação do 304. E309L absorve a diluição do aço carbono.', compativel: true },
    'A36_316': { recomendacao: 'E309L / ER309L', observacao: 'E309L é o padrão para união de aço carbono com inox.', compativel: true },
    'A36_316L': { recomendacao: 'E309L / ER309L', observacao: 'Garantir baixo aporte térmico para evitar sensitização.', compativel: true },
    'A36_410': { recomendacao: 'E309L / ER309L', observacao: 'Pré-aquecer a 150-200°C. Resfriamento lento pós-solda.', compativel: true },
    'A36_Inconel': { recomendacao: 'ENiCrFe-3 / ERNiCr-3', observacao: 'Soldagem de revestimento com Inconel sobre aço carbono.', compativel: true },
    'A36_Aluminio': { recomendacao: 'Não recomendado', observacao: 'Soldagem direta entre aço e alumínio é inviável por fusão. Usar conexões mecânicas ou bimetálicas.', compativel: false },
    'A36_Cobre': { recomendacao: 'ERCu / ECu', observacao: 'Soldagem aço-carbono com cobre requer cuidados com diluição. Usar ERCu.', compativel: true },
    '304_316': { recomendacao: 'E308L / ER308L ou E316L', observacao: 'Ambos compatíveis. E316L preferível para maior resistência à corrosão.', compativel: true },
    '304_316L': { recomendacao: 'E308L / ER308L', observacao: 'Compatível. Usar metal de adição baixo carbono.', compativel: true },
    '304_410': { recomendacao: 'E309L / ER309L', observacao: 'Pré-aquecer o lado do 410 a 150-200°C. Evitar resfriamento rápido.', compativel: true },
    '304_Aluminio': { recomendacao: 'Não recomendado', observacao: 'União por fusão inviável. Usar juntas mecânicas.', compativel: false },
    '304_Cobre': { recomendacao: 'ERCuNi / ERCuAl', observacao: 'Usar metal de adição a base de cobre-níquel ou cobre-alumínio.', compativel: true },
    'CrMo-1.25_CrMo-2.25': { recomendacao: 'E8018-B2 / E9018-B3', observacao: 'Usar metal de adição compatível com o menor teor de liga. Pré-aquecer a 200°C.', compativel: true },
    'CrMo-1.25_A36': { recomendacao: 'E7018 / E8018-B2', observacao: 'Usar E7018 para juntas não críticas. E8018-B2 para serviço em alta temperatura.', compativel: true },
    'CrMo-2.25_A36': { recomendacao: 'E8018-B2 / E9018-B3', observacao: 'Pré-aquecer a 200°C mínimo. Resfriamento controlado.', compativel: true },
    '9Ni_A36': { recomendacao: 'ENiCrFe-3 / ERNiCr-3', observacao: 'Usar metal de adição a base de níquel. Pré-aquecer a 100°C.', compativel: true },
    'Inconel_304': { recomendacao: 'ENiCrFe-3 / ERNiCr-3', observacao: 'Compatível. Usar ERNiCr-3 para alta resistência à corrosão.', compativel: true },
    'Inconel_316': { recomendacao: 'ENiCrFe-3 / ERNiCr-3', observacao: 'União de Inconel com aço inoxidável. Metal de adição Ni-base.', compativel: true },
    'Inconel_Aluminio': { recomendacao: 'Não recomendado', observacao: 'Propriedades termofísicas muito diferentes. Inviável por soldagem a fusão.', compativel: false },
    'Cobre_Aluminio': { recomendacao: 'Não recomendado', observacao: 'Formação de intermetálicos frágeis. Usar conexões mecânicas.', compativel: false },
    'Cobre_Inconel': { recomendacao: 'ERCuNi / ERNiCr-3', observacao: 'Compatível. ERCuNi recomendado para serviços marinhos.', compativel: true }
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
    consultar();
});

function consultar() {
    var m1 = document.getElementById('metal1').value;
    var m2 = document.getElementById('metal2').value;

    if (m1 === m2) {
        document.getElementById('result-container').innerHTML = '<div class="resultado-container success"><h3><i class="fa-solid fa-check-circle"></i> ' + t('soldagem.metais.iguais_title', 'Metais Iguais') + '</h3><div class="detail-grid"><div class="detail-item full"><div class="label">' + t('soldagem.metais.label_recomendacao', 'Recomendação') + '</div><div class="value">' + metais[m1].nome + ' com ' + metais[m2].nome + '</div></div><div class="detail-item full"><div class="label">' + t('soldagem.metais.label_metal_adicao', 'Metal de Adição') + '</div><div class="value">' + t('soldagem.metais.iguais_adicao_text', 'Usar eletrodo ou arame compatível com o metal base (consulte a guia AWS).') + '</div></div></div></div>';
        return;
    }

    var key1 = m1 + '_' + m2;
    var key2 = m2 + '_' + m1;
    var data = compatibilidade[key1] || compatibilidade[key2];

    if (!data) {
        document.getElementById('result-container').innerHTML = '<div class="resultado-container warning"><h3><i class="fa-solid fa-exclamation-triangle"></i> ' + t('soldagem.metais.sem_info_title', 'Sem informação específica') + '</h3><p style="margin-top:.5rem;color:var(--text-secondary)">' + t('soldagem.metais.sem_info_text', 'Consulte um engenheiro de soldagem para esta combinação.') + '</p></div>';
        return;
    }

    var badge = data.compativel ? '<span class="badge badge-success">' + t('soldagem.metais.badge_compativel', 'Compatível') + '</span>' : '<span class="badge badge-error">' + t('soldagem.metais.badge_nao_recomendado', 'Não recomendado') + '</span>';

    document.getElementById('result-container').innerHTML = '<div class="resultado-container ' + (data.compativel ? 'success' : 'warning') + '"><h3>' + badge + ' ' + metais[m1].nome + ' + ' + metais[m2].nome + '</h3><div class="detail-grid">' +
        (data.compativel ? '<div class="detail-item full"><div class="label">' + t('soldagem.metais.label_adicacao_recomendada', 'Metal de Adição Recomendado') + '</div><div class="value">' + data.recomendacao + '</div></div>' : '') +
        '<div class="detail-item full"><div class="label">' + t('soldagem.metais.label_observacao', 'Observação Técnica') + '</div><div class="value" style="font-size:.9rem;color:var(--text-secondary);line-height:1.5">' + data.observacao + '</div></div>' +
        '</div></div>';
}