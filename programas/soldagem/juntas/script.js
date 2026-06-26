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
    atualizarDiagrama();
});

function t(key, fallback) {
    return (window.i18n && typeof window.i18n.t === 'function') ? (window.i18n.t(key) || fallback) : fallback;
}

function atualizarDiagrama() {
    var tipo = document.getElementById('tipoJunta').value;
    desenharJunta(tipo);
}

function desenharJunta(tipo) {
    var svg = document.getElementById('juntaSvg');
    var w = 300, h = 200, cx = 150, cy = 100;
    var html = '';
    var lblAberturaRaiz = t('soldagem.juntas.diagram_abertura_raiz', 'abertura raiz');
    var lblFace = t('soldagem.juntas.diagram_face', 'face');
    var lblRaio = t('soldagem.juntas.diagram_raio', 'Raio');
    var lblAbertura = t('soldagem.juntas.diagram_abertura', 'abertura');

    switch (tipo) {
        case 'V':
            html = '<polygon class="chapa" points="60,40 240,40 240,160 60,160 140,100" />' +
                '<polygon class="chapa" points="60,40 140,100 240,40" fill="none" stroke="var(--cor-destaque)" stroke-width="1.5" stroke-dasharray="3,2" />' +
                '<line class="linha" x1="60" y1="40" x2="140" y2="100" /><line class="linha" x1="240" y1="40" x2="140" y2="100" />' +
                '<text class="cota" x="125" y="55">α</text><text class="cota" x="68" y="30">e</text><text class="cota" x="220" y="95">' + lblAberturaRaiz + '</text>';
            break;
        case 'X':
            html = '<polygon class="chapa" points="60,40 240,40 240,160 60,160 150,80 150,120" />' +
                '<polygon class="chapa" points="60,40 150,80 240,40" fill="none" stroke="var(--cor-destaque)" stroke-width="1.5" stroke-dasharray="3,2" />' +
                '<polygon class="chapa" points="60,160 150,120 240,160" fill="none" stroke="var(--cor-destaque)" stroke-width="1.5" stroke-dasharray="3,2" />' +
                '<line class="linha" x1="60" y1="40" x2="150" y2="80" /><line class="linha" x1="240" y1="40" x2="150" y2="80" />' +
                '<line class="linha" x1="60" y1="160" x2="150" y2="120" /><line class="linha" x1="240" y1="160" x2="150" y2="120" />' +
                '<text class="cota" x="68" y="30">e</text><text class="cota" x="155" y="105">' + lblFace + '</text>';
            break;
        case 'U':
            html = '<polygon class="chapa" points="60,40 240,40 240,160 60,160" />' +
                '<path d="M 60,40 Q 100,40 120,70 Q 130,85 130,100 Q 130,115 120,130 Q 100,160 60,160" fill="none" stroke="var(--primary)" stroke-width="2" />' +
                '<text class="cota" x="68" y="30">e</text><text class="cota" x="100" y="65">' + lblRaio + '</text><text class="cota" x="135" y="100">' + lblFace + '</text>';
            break;
        case 'K':
            html = '<polygon class="chapa" points="60,40 240,40 240,160 60,160" />' +
                '<line class="linha" x1="60" y1="40" x2="155" y2="100" /><line class="linha" x1="240" y1="40" x2="145" y2="100" />' +
                '<line class="linha" x1="60" y1="160" x2="155" y2="100" /><line class="linha" x1="240" y1="160" x2="145" y2="100" />' +
                '<text class="cota" x="160" y="95">' + lblFace + '</text><text class="cota" x="95" y="55">22,5°</text><text class="cota" x="68" y="30">e</text>';
            break;
        default: // I
            html = '<polygon class="chapa" points="60,60 140,60 140,140 60,140" />' +
                '<polygon class="chapa" points="160,60 240,60 240,140 160,140" />' +
                '<line class="linha" x1="145" y1="60" x2="155" y2="60" /><line class="linha" x1="145" y1="140" x2="155" y2="140" />' +
                '<text class="cota" x="145" y="155">' + lblAbertura + '</text><text class="cota" x="68" y="25">e</text>';
            break;
    }
    svg.innerHTML = html;
}

function calcular() {
    var tipo = document.getElementById('tipoJunta').value;
    var esp = parseFloat(document.getElementById('espessuraJunta').value);

    if (!esp || esp < 1) {
        document.getElementById('result-container').innerHTML = '<div class="resultado-container error"><i class="fa-solid fa-exclamation-circle"></i> ' +
            t('soldagem.juntas.erro_espessura', 'Informe a espessura da chapa.') + '</div>';
        return;
    }

    var dados = {};
    switch (tipo) {
        case 'V':
            dados = {
                aberturaRaiz: esp < 10 ? '1-2' : '2-3',
                faceRaiz: esp < 15 ? '1-2' : '2-3',
                anguloBisel: '30°',
                anguloTotal: '60°',
                observacao: esp < 6 ? t('soldagem.juntas.obs_v_fino', 'Recomenda-se junta tipo I para espessuras < 6 mm.') : t('soldagem.juntas.obs_v_normal', 'Chanfro em V simples. Adequado para espessuras de 6 a 20 mm.')
            };
            break;
        case 'X':
            dados = {
                aberturaRaiz: '2-3',
                faceRaiz: '1-2',
                anguloBisel: '30° (cada lado)',
                anguloTotal: '60° (2×30°)',
                observacao: esp < 20 ? t('soldagem.juntas.obs_x_fino', 'Recomendado para espessuras > 20 mm. Reduz volume de solda em 50% comparado ao V.') : t('soldagem.juntas.obs_x_normal', 'Ideal para chapas espessas. Preparação dos dois lados.')
            };
            break;
        case 'U':
            dados = {
                aberturaRaiz: '2-3',
                faceRaiz: '2-3',
                anguloBisel: '15-20°',
                anguloTotal: '15-20°',
                observacao: esp < 30 ? t('soldagem.juntas.obs_u_fino', 'Recomendado para espessuras > 30 mm. Menor volume de solda que o V.') : t('soldagem.juntas.obs_u_normal', 'Chanfro em U. Excelente para vasos de pressão espessos.')
            };
            break;
        case 'K':
            dados = {
                aberturaRaiz: '2-3',
                faceRaiz: '1-2',
                anguloBisel: '22,5° (cada lado)',
                anguloTotal: '45° (2×22,5°)',
                observacao: esp < 20 ? t('soldagem.juntas.obs_k_fino', 'Recomendado para espessuras > 20 mm. Similar ao X com ângulo reduzido.') : t('soldagem.juntas.obs_k_normal', 'Junta em K. Usado em soldas de ângulo com penetração total.')
            };
            break;
        case 'I':
            dados = {
                aberturaRaiz: '0-2',
                faceRaiz: 'N/A',
                anguloBisel: 'N/A',
                anguloTotal: 'N/A',
                observacao: esp > 6 ? t('soldagem.juntas.obs_i_limitada', 'Junta tipo I limitada a espessuras ≤ 6 mm sem preparação. Para > 6 mm, usar chanfro.') : t('soldagem.juntas.obs_i_normal', 'Junta de topo sem preparação. Solda pode ser de um ou ambos os lados.')
            };
            break;
    }

    document.getElementById('result-container').innerHTML = '<div class="resultado-container success"><h3><i class="fa-solid fa-check-circle"></i> ' +
        t('soldagem.juntas.result_title', 'Dimensionamento — Chanfro em') + ' ' + tipo.toUpperCase() + '</h3><div class="result-grid">' +
        '<div class="result-item"><div class="label">' + t('soldagem.juntas.label_abertura_raiz', 'Abertura de Raiz') + '</div><div class="value">' + dados.aberturaRaiz + ' mm</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.juntas.label_face_raiz', 'Face de Raiz (Nariz)') + '</div><div class="value">' + dados.faceRaiz + ' mm</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.juntas.label_angulo_bisel', 'Ângulo do Bisel') + '</div><div class="value">' + dados.anguloBisel + '</div></div>' +
        '<div class="result-item"><div class="label">' + t('soldagem.juntas.label_angulo_total', 'Ângulo Total da Junta') + '</div><div class="value">' + dados.anguloTotal + '</div></div>' +
        '<div class="result-item full"><div class="label">' + t('soldagem.juntas.label_observacao', 'Observação Técnica') + '</div><div class="value" style="font-size:.9rem;color:var(--text-secondary);line-height:1.5">' + dados.observacao + '</div></div>' +
        '</div></div>';
}
