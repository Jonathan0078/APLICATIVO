var simbolos = [
    { id: 'filete', nome: 'Filete', cat: 'basico', desc: 'Solda de filete em junta em T ou sobreposta. O símbolo é um triângulo retângulo apoiado na linha de referência.', aws: 'A2.4', iso: '2553' },
    { id: 'topo', nome: 'Topo (Chanfro V)', cat: 'basico', desc: 'Junta de topo com chanfro em V. Usado quando as chapas são preparadas com bisel.', aws: 'A2.4', iso: '2553' },
    { id: 'topo_duplo', nome: 'Topo (Chanfro X)', cat: 'basico', desc: 'Junta de topo com chanfro duplo V (X). Para chapas espessas, solda de ambos os lados.', aws: 'A2.4', iso: '2553' },
    { id: 'chanfro_u', nome: 'Chanfro em U', cat: 'basico', desc: 'Junta de topo com chanfro em U. Menor volume de solda que o V, usado em chapas muito espessas.', aws: 'A2.4', iso: '2553' },
    { id: 'chanfro_j', nome: 'Chanfro em J', cat: 'basico', desc: 'Junta de topo com chanfro em J. Similar ao U, mas assimétrico.', aws: 'A2.4', iso: '2553' },
    { id: 'filete_duplo', nome: 'Filete Duplo', cat: 'basico', desc: 'Solda de filete em ambos os lados da junta. Símbolo com triângulos para cima e para baixo da linha.', aws: 'A2.4', iso: '2553' },
    { id: 'topo_i', nome: 'Topo (I)', cat: 'basico', desc: 'Junta de topo sem preparação (chanfro reto). Para chapas finas sem bisel.', aws: 'A2.4', iso: '2553' },
    { id: 'topo_meio_v', nome: 'Meio V', cat: 'basico', desc: 'Junta de topo com chanfro em meio V. Usado quando apenas uma chapa é biselada.', aws: 'A2.4', iso: '2553' },
    { id: 'topo_meio_u', nome: 'Meio U', cat: 'basico', desc: 'Junta de topo com chanfro em meio U. Similar ao J, porém com raio definido.', aws: 'A2.4', iso: '2553' },
    { id: 'solda_ponto', nome: 'Solda a Ponto', cat: 'basico', desc: 'Solda por resistência elétrica (ponto). Símbolo: círculo na linha de referência.', aws: 'A2.4', iso: '2553' },
    { id: 'solda_costura', nome: 'Solda por Costura', cat: 'basico', desc: 'Solda contínua por resistência. Símbolo: círculo com traços paralelos.', aws: 'A2.4', iso: '2553' },
    { id: 'solda_topo', nome: 'Solda de Topo (Upset)', cat: 'basico', desc: 'Solda de topo por resistência ou flash. Símbolo: traço vertical duplo.', aws: 'A2.4', iso: '2553' },
    { id: 'campo', nome: 'Solda em Campo', cat: 'suplementar', desc: 'Indica que a solda deve ser executada no campo (não na oficina). Símbolo: bandeira preta.', aws: 'A2.4', iso: '2553' },
    { id: 'contorno', nome: 'Contorno Plano', cat: 'suplementar', desc: 'O cordão de solda deve ser usinado ou esmerilhado para ficar rente à superfície.', aws: 'A2.4', iso: '2553' },
    { id: 'contorno_convexo', nome: 'Contorno Convexo', cat: 'suplementar', desc: 'O cordão de solda deve ter uma superfície convexa (reforço).', aws: 'A2.4', iso: '2553' },
    { id: 'contorno_concavo', nome: 'Contorno Côncavo', cat: 'suplementar', desc: 'O cordão de solda deve ter uma superfície côncava.', aws: 'A2.4', iso: '2553' },
    { id: 'todo_contorno', nome: 'Solda em Todo Contorno', cat: 'suplementar', desc: 'Solda deve ser executada em toda a volta da peça. Símbolo: círculo na quebra da linha de referência.', aws: 'A2.4', iso: '2553' },
    { id: 'ref_linha', nome: 'Linha de Referência', cat: 'suplementar', desc: 'Linha horizontal que serve como base para todos os símbolos de soldagem. A flecha indica a junta.', aws: 'A2.4', iso: '2553' },
    { id: 'lado_arrow', nome: 'Lado da Flecha', cat: 'posicao', desc: 'Símbolo abaixo da linha = solda do lado da flecha. Símbolo acima = solda do lado oposto.', aws: 'A2.4', iso: '2553' },
    { id: 'ambos_lados', nome: 'Ambos os Lados', cat: 'posicao', desc: 'Símbolos acima e abaixo da linha de referência indicam solda em ambos os lados da junta.', aws: 'A2.4', iso: '2553' },
    { id: 'acabamento_esmeril', nome: 'Acabamento Esmerilhado', cat: 'acabamento', desc: 'O cordão deve receber acabamento com esmeril. Símbolo: letra "G" maiúscula.', aws: 'A2.4', iso: '2553' },
    { id: 'acabamento_usinado', nome: 'Acabamento Usinado', cat: 'acabamento', desc: 'O cordão deve receber acabamento por usinagem. Símbolo: letra "M" maiúscula.', aws: 'A2.4', iso: '2553' },
    { id: 'acabamento_martelo', nome: 'Acabamento Martelo', cat: 'acabamento', desc: 'Acabamento com martelo pneumático. Símbolo: letra "H" maiúscula.', aws: 'A2.4', iso: '2553' },
    { id: 'acabamento_rolo', nome: 'Acabamento Rolo', cat: 'acabamento', desc: 'Acabamento com rolo para alisar o cordão. Símbolo: letra "R" maiúscula.', aws: 'A2.4', iso: '2553' }
];

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
    renderizar();
});

function renderizar() {
    var cat = document.getElementById('categoria').value;
    var search = document.getElementById('simbSearch').value.toLowerCase();
    var grid = document.getElementById('symbolGrid');
    var detail = document.getElementById('symbolDetail');
    grid.innerHTML = '';
    detail.classList.add('hidden');

    simbolos.forEach(function(s) {
        if (cat !== 'todos' && s.cat !== cat) return;
        if (search && !s.nome.toLowerCase().includes(search) && !s.desc.toLowerCase().includes(search)) return;

        var card = document.createElement('div');
        card.className = 'symbol-card';
        card.onclick = function() { mostrarDetalhe(s.id); };
        var nomeKey = 'soldagem.simbologia.sym.' + s.id + '.nome';
        card.innerHTML = '<div class="sym-svg">' + desenharSimbolo(s.id) + '</div>' +
            '<div class="sym-name">' + t(nomeKey, s.nome) + '</div>' +
            '<div class="sym-cat">' + s.cat + '</div>';
        grid.appendChild(card);
    });

    if (grid.children.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem">' + t('soldagem.simbologia.erro_vazio', 'Nenhum símbolo encontrado.') + '</p>';
    }
}

function mostrarDetalhe(id) {
    document.querySelectorAll('.symbol-card').forEach(function(c) { c.classList.remove('active'); });
    var card = document.querySelector('.symbol-card:nth-child(' + (simbolos.findIndex(function(s) { return s.id === id; }) + 1) + ')');
    if (card) card.classList.add('active');

    var s = simbolos.find(function(x) { return x.id === id; });
    if (!s) return;

    var detail = document.getElementById('symbolDetail');
    detail.classList.remove('hidden');
    var nomeKey = 'soldagem.simbologia.sym.' + s.id + '.nome';
    var descKey = 'soldagem.simbologia.sym.' + s.id + '.desc';
    detail.innerHTML = '<div class="detail-card"><h4>' + t(nomeKey, s.nome) + '</h4><p>' + t(descKey, s.desc) + '</p><div class="tags"><span class="tag tag-aws">AWS ' + s.aws + '</span><span class="tag tag-iso">ISO ' + s.iso + '</span></div></div>';
}

function filtrar() { renderizar(); }

function desenharSimbolo(id) {
    var svgs = {
        'filete': '<svg viewBox="0 0 80 40" width="80" height="40"><polygon points="5,35 55,35 5,5" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="5" y1="35" x2="75" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'topo': '<svg viewBox="0 0 80 40" width="80" height="40"><polygon points="10,5 10,35 70,35" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'topo_duplo': '<svg viewBox="0 0 80 40" width="80" height="40"><polygon points="10,5 10,35 70,20" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'chanfro_u': '<svg viewBox="0 0 80 40" width="80" height="40"><path d="M 10,5 L 10,35 Q 10,35 30,35 L 70,5" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'chanfro_j': '<svg viewBox="0 0 80 40" width="80" height="40"><path d="M 10,5 L 10,35 Q 10,35 30,35 L 70,5" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'filete_duplo': '<svg viewBox="0 0 80 40" width="80" height="40"><polygon points="5,5 5,35 45,35" fill="none" stroke="var(--primary)" stroke-width="2"/><polygon points="5,5 45,5 5,35" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="5" y1="5" x2="75" y2="5" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'topo_i': '<svg viewBox="0 0 80 40" width="80" height="40"><line x1="15" y1="5" x2="15" y2="35" stroke="var(--primary)" stroke-width="2"/><line x1="15" y1="5" x2="70" y2="5" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'topo_meio_v': '<svg viewBox="0 0 80 40" width="80" height="40"><polygon points="10,5 10,35 50,35" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'topo_meio_u': '<svg viewBox="0 0 80 40" width="80" height="40"><path d="M 10,5 L 10,35 Q 10,35 25,35 L 50,5" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="5" x2="10" y2="35" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'solda_ponto': '<svg viewBox="0 0 80 40" width="80" height="40"><circle cx="30" cy="20" r="12" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="20" x2="70" y2="20" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'solda_costura': '<svg viewBox="0 0 80 40" width="80" height="40"><circle cx="30" cy="20" r="12" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="20" y1="10" x2="40" y2="30" stroke="var(--primary)" stroke-width="2"/><line x1="20" y1="20" x2="40" y2="20" stroke="var(--primary)" stroke-width="1"/><line x1="10" y1="20" x2="70" y2="20" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'solda_topo': '<svg viewBox="0 0 80 40" width="80" height="40"><line x1="25" y1="5" x2="25" y2="35" stroke="var(--primary)" stroke-width="3"/><line x1="35" y1="5" x2="35" y2="35" stroke="var(--primary)" stroke-width="3"/><line x1="10" y1="20" x2="70" y2="20" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'campo': '<svg viewBox="0 0 80 40" width="80" height="40"><polygon points="10,5 30,5 30,25 10,25" fill="var(--primary)" opacity="0.8"/><line x1="10" y1="15" x2="70" y2="15" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'contorno': '<svg viewBox="0 0 80 40" width="80" height="40"><line x1="15" y1="12" x2="65" y2="12" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="28" x2="70" y2="28" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/><line x1="15" y1="12" x2="65" y2="12" stroke="var(--primary)" stroke-width="2"/></svg>',
        'contorno_convexo': '<svg viewBox="0 0 80 40" width="80" height="40"><path d="M 15,15 Q 40,5 65,15" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="28" x2="70" y2="28" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'contorno_concavo': '<svg viewBox="0 0 80 40" width="80" height="40"><path d="M 15,20 Q 40,30 65,20" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="28" x2="70" y2="28" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'todo_contorno': '<svg viewBox="0 0 80 40" width="80" height="40"><circle cx="20" cy="15" r="8" fill="none" stroke="var(--primary)" stroke-width="2"/><line x1="10" y1="30" x2="70" y2="30" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'ref_linha': '<svg viewBox="0 0 80 40" width="80" height="40"><line x1="5" y1="20" x2="75" y2="20" stroke="var(--primary)" stroke-width="3"/><line x1="30" y1="20" x2="50" y2="5" stroke="var(--text-secondary)" stroke-width="2" marker-end="url(#arrow)"/></svg>',
        'lado_arrow': '<svg viewBox="0 0 80 40" width="80" height="40"><line x1="10" y1="25" x2="70" y2="25" stroke="var(--primary)" stroke-width="2"/><polygon points="10,15 10,25 40,25" fill="none" stroke="var(--primary)" stroke-width="2"/></svg>',
        'ambos_lados': '<svg viewBox="0 0 80 40" width="80" height="40"><line x1="10" y1="20" x2="70" y2="20" stroke="var(--primary)" stroke-width="2"/><polygon points="10,8 10,20 40,20" fill="none" stroke="var(--primary)" stroke-width="2"/><polygon points="10,32 10,20 40,20" fill="none" stroke="var(--primary)" stroke-width="2"/></svg>',
        'acabamento_esmeril': '<svg viewBox="0 0 80 40" width="80" height="40"><text x="30" y="28" font-size="22" font-weight="bold" fill="var(--primary)" text-anchor="middle">G</text><line x1="10" y1="30" x2="70" y2="30" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'acabamento_usinado': '<svg viewBox="0 0 80 40" width="80" height="40"><text x="30" y="28" font-size="22" font-weight="bold" fill="var(--primary)" text-anchor="middle">M</text><line x1="10" y1="30" x2="70" y2="30" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'acabamento_martelo': '<svg viewBox="0 0 80 40" width="80" height="40"><text x="30" y="28" font-size="22" font-weight="bold" fill="var(--primary)" text-anchor="middle">H</text><line x1="10" y1="30" x2="70" y2="30" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>',
        'acabamento_rolo': '<svg viewBox="0 0 80 40" width="80" height="40"><text x="30" y="28" font-size="22" font-weight="bold" fill="var(--primary)" text-anchor="middle">R</text><line x1="10" y1="30" x2="70" y2="30" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4,2"/></svg>'
    };
    return svgs[id] || '<svg viewBox="0 0 80 40" width="80" height="40"><text x="40" y="25" font-size="12" fill="var(--text-secondary)" text-anchor="middle">?</text></svg>';
}