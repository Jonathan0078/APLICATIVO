var database = {
    'E6010': { tracao: '430 MPa (62 ksi)', posicao: 'Todas as posições', corrente: 'CC+ (Corrente Contínua Polaridade Inversa)', aplicacoes: 'Tubulações, passes de raiz, soldas em campo. Penetração profunda.', revestimento: 'Celulósico sódico' },
    'E6011': { tracao: '430 MPa (62 ksi)', posicao: 'Todas as posições', corrente: 'CA e CC+', aplicacoes: 'Similar ao E6010, porém opera em CA. Ideal para geradores.', revestimento: 'Celulósico potássico' },
    'E6013': { tracao: '430 MPa (62 ksi)', posicao: 'Todas as posições', corrente: 'CA e CC±', aplicacoes: 'Soldas leves, acabamento, chapas finas. Penetração média.', revestimento: 'Rutilico' },
    'E7014': { tracao: '490 MPa (70 ksi)', posicao: 'Todas as posições', corrente: 'CA e CC±', aplicacoes: 'Alta taxa de deposição, boa aparência do cordão.', revestimento: 'Rutilico em pó de ferro' },
    'E7018': { tracao: '490 MPa (70 ksi)', posicao: 'Todas as posições', corrente: 'CC+ (CA com limitação)', aplicacoes: 'Estrutural, pontes, vasos de pressão. Baixo hidrogênio.', revestimento: 'Baixo hidrogênio' },
    'E7024': { tracao: '490 MPa (70 ksi)', posicao: 'Horizontal e plana', corrente: 'CA e CC±', aplicacoes: 'Alta deposição, solda de filete em posição horizontal.', revestimento: 'Rutilico em pó de ferro' },
    'E8018-B2': { tracao: '550 MPa (80 ksi)', posicao: 'Todas as posições', corrente: 'CC+', aplicacoes: 'Aços ligados 1,25%Cr-0,5%Mo. Vasos de pressão e tubulações.', revestimento: 'Baixo hidrogênio' },
    'E9018-B3': { tracao: '620 MPa (90 ksi)', posicao: 'Todas as posições', corrente: 'CC+', aplicacoes: 'Aços ligados 2,25%Cr-1%Mo. Alta temperatura.', revestimento: 'Baixo hidrogênio' },
    'E308L': { tracao: '550 MPa (80 ksi)', posicao: 'Todas as posições', corrente: 'CC+, CA', aplicacoes: 'Aço inoxidável 304/304L. Baixo carbono.', revestimento: 'Rutilico' },
    'E308L-16': { tracao: '550 MPa (80 ksi)', posicao: 'Todas as posições', corrente: 'CC+, CA', aplicacoes: 'Aço inoxidável 304/304L. Versão com CC+ e CA.', revestimento: 'Rutilico' },
    'E309L': { tracao: '550 MPa (80 ksi)', posicao: 'Todas as posições', corrente: 'CC+, CA', aplicacoes: 'Soldagem de aços dissimilares (carbono + inox). Revestimento.', revestimento: 'Rutilico' },
    'E309L-16': { tracao: '550 MPa (80 ksi)', posicao: 'Todas as posições', corrente: 'CC+, CA', aplicacoes: 'Metais dissimilares, revestimento anticorrosivo.', revestimento: 'Rutilico' },
    'E316L': { tracao: '520 MPa (75 ksi)', posicao: 'Todas as posições', corrente: 'CC+, CA', aplicacoes: 'Aço inoxidável 316/316L. Resistente a corrosão por pites.', revestimento: 'Rutilico' },
    'E316L-16': { tracao: '520 MPa (75 ksi)', posicao: 'Todas as posições', corrente: 'CC+, CA', aplicacoes: 'Aço inoxidável 316L com boa resistência a corrosão.', revestimento: 'Rutilico' },
    'E7018-G': { tracao: '490 MPa (70 ksi)', posicao: 'Todas as posições', corrente: 'CC+', aplicacoes: 'Uso geral para aços carbono. Classificação genérica.', revestimento: 'Baixo hidrogênio' },
    'E11018-G': { tracao: '760 MPa (110 ksi)', posicao: 'Todas as posições', corrente: 'CC+', aplicacoes: 'Aços de alta resistência. Equipamentos críticos.', revestimento: 'Baixo hidrogênio' },
    'ENiCrFe-3': { tracao: '660 MPa (95 ksi)', posicao: 'Todas as posições', corrente: 'CC+', aplicacoes: 'Soldagem de Inconel 600/601 e revestimento de aços.', revestimento: 'Básico' }
};

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

function t(key, fallback) {
    return (window.i18n && typeof window.i18n.t === 'function') ? (window.i18n.t(key) || fallback) : fallback;
}

// Busca um campo do eletrodo já traduzido, com fallback para o valor original em pt-BR.
// Chave gerada: soldagem.eletrodos.data.<ELETRODO>.<campo>
function dado(key, campo) {
    var i18nKey = 'soldagem.eletrodos.data.' + key + '.' + campo;
    return t(i18nKey, database[key][campo]);
}

function filtrarSelect() {
    var search = document.getElementById('eletrodoSearch').value.toUpperCase();
    var select = document.getElementById('eletrodoSelect');
    if (!search) { select.value = 'E7018'; consultar(); return; }
    var match = Object.keys(database).find(function(k) { return k.startsWith(search) || k.includes(search); });
    if (match) { select.value = match; consultar(); }
}

function consultar() {
    var key = document.getElementById('eletrodoSelect').value;
    var data = database[key];
    if (!data) {
        document.getElementById('result-container').innerHTML = '<div class="resultado-container error"><i class="fa-solid fa-exclamation-circle"></i> ' +
            t('soldagem.eletrodos.erro_nao_encontrado', 'Eletrodo não encontrado.') + '</div>';
        return;
    }
    document.getElementById('result-container').innerHTML = '<div class="resultado-container success"><h3><i class="fa-solid fa-check-circle"></i> AWS ' + key + '</h3><div class="detail-grid">' +
        '<div class="detail-item"><div class="label">' + t('soldagem.eletrodos.label_tracao', 'Resistência à Tração') + '</div><div class="value">' + data.tracao + '</div></div>' +
        '<div class="detail-item"><div class="label">' + t('soldagem.eletrodos.label_posicao', 'Posição de Soldagem') + '</div><div class="value">' + dado(key, 'posicao') + '</div></div>' +
        '<div class="detail-item full"><div class="label">' + t('soldagem.eletrodos.label_corrente', 'Corrente / Polaridade') + '</div><div class="value">' + dado(key, 'corrente') + '</div></div>' +
        '<div class="detail-item full"><div class="label">' + t('soldagem.eletrodos.label_revestimento', 'Revestimento') + '</div><div class="value"><span class="badge badge-primary">' + dado(key, 'revestimento') + '</span></div></div>' +
        '<div class="detail-item full"><div class="label">' + t('soldagem.eletrodos.label_aplicacoes', 'Principais Aplicações') + '</div><div class="value" style="font-size:.95rem;color:var(--text-secondary)">' + dado(key, 'aplicacoes') + '</div></div>' +
        '</div></div>';
}
