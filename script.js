document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initPrograms();
    initSearch();
    updateStats();
    renderFeatured();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-screen]');
    const screens = document.querySelectorAll('.screen');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const target = this.dataset.screen;
            if (!target) return;

            navItems.forEach(n => n.classList.remove('active'));
            screens.forEach(s => s.classList.remove('active'));

            this.classList.add('active');
            const el = document.getElementById(target);
            if (el) el.classList.add('active');
        });
    });
}

function initPrograms() {
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', function () {
            const section = this.parentElement;
            const isExpanded = section.classList.contains('expanded');

            document.querySelectorAll('.category-section').forEach(s => {
                s.classList.remove('expanded');
            });

            if (!isExpanded) section.classList.add('expanded');
        });
    });

    document.querySelectorAll('.tool-item[data-tool-id] .favorite-icon').forEach(icon => {
        const parent = icon.closest('.tool-item');
        if (parent) {
            const id = parent.getAttribute('data-tool-id');
            icon.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                toggleFav(id);
            };
        }
    });

    updateFavIcons();
    updateFavSection();
}

function getFavs() {
    return JSON.parse(localStorage.getItem('site-main-tool-favorites') || '[]');
}

function setFavs(v) {
    localStorage.setItem('site-main-tool-favorites', JSON.stringify(v));
}

function toggleFav(id) {
    const f = getFavs();
    const i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    setFavs(f);
    updateFavIcons();
    updateFavSection();
    updateStats();
}

function isFav(id) {
    return getFavs().includes(id);
}

function updateFavIcons() {
    document.querySelectorAll('.tool-item[data-tool-id]').forEach(item => {
        const id = item.getAttribute('data-tool-id');
        const ic = item.querySelector('.favorite-icon i');
        if (!ic) return;
        if (isFav(id)) {
            ic.classList.remove('far');
            ic.classList.add('fas');
        } else {
            ic.classList.remove('fas');
            ic.classList.add('far');
        }
    });
}

function updateFavSection() {
    const favs = getFavs();
    const sec = document.getElementById('favorites-section');
    if (!sec) return;
    const c = sec.querySelector('.category-tools');
    if (!c) return;
    c.innerHTML = '';
    let n = 0;
    document.querySelectorAll('.tool-item[data-tool-id]').forEach(item => {
        const id = item.getAttribute('data-tool-id');
        if (favs.includes(id)) {
            c.appendChild(item.cloneNode(true));
            n++;
        }
    });
    const tc = sec.querySelector('.tool-count');
    if (tc) {
        tc.textContent = n === 0
            ? (typeof i18n !== 'undefined' ? i18n.t('favorites.empty') : 'Nenhum favorito ainda')
            : `${n} ${n === 1 ? (typeof i18n !== 'undefined' ? i18n.t('common.ferramenta') : 'ferramenta') : (typeof i18n !== 'undefined' ? i18n.t('common.ferramentas') : 'ferramentas')}`;
    }
    c.querySelectorAll('.favorite-icon').forEach(ic => {
        const p = ic.closest('.tool-item');
        if (p) {
            const id = p.getAttribute('data-tool-id');
            ic.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                toggleFav(id);
            };
        }
    });
}

function initSearch() {
    const inp = document.getElementById('tool-search');
    if (!inp) return;
    inp.addEventListener('input', function () {
        const t = this.value.toLowerCase().trim();
        document.querySelectorAll('.category-section').forEach(sec => {
            if (sec.id === 'favorites-section') return;
            let has = false;
            sec.querySelectorAll('.tool-item').forEach(item => {
                const title = (item.querySelector('h4')?.textContent || '').toLowerCase();
                const desc = (item.querySelector('p')?.textContent || '').toLowerCase();
                const m = t === '' || title.includes(t) || desc.includes(t);
                item.classList.toggle('hidden', !m);
                if (m) has = true;
            });
            sec.classList.toggle('no-results', !has && t !== '');
            if (t !== '' && has) sec.classList.add('expanded');
            else if (t === '') sec.classList.remove('expanded');
        });
        updateFavSection();
        if (typeof i18n !== 'undefined') i18n.updateToolCounts();
    });
}

function updateStats() {
    const total = document.querySelectorAll('.tool-item[data-tool-id]').length;
    const favs = getFavs().length;
    const s1 = document.getElementById('stat-tools');
    const s2 = document.getElementById('stat-favs');
    if (s1) s1.textContent = total;
    if (s2) s2.textContent = favs;
}

function renderFeatured() {
    const ids = ['calculadora_graxa', 'fmea', 'vazao_perda_carga', 'montagem_rolamentos', 'relacao_engrenagens', 'conversor_universal'];
    const list = document.getElementById('featured-list');
    if (!list) return;

    const gradientMap = {
        hidraulica: ['#0284c7', '#38bdf8'],
        mineracao: ['#d97706', '#fbbf24'],
        lubrificacao: ['#059669', '#34d399'],
        engenharia_civil: ['#475569', '#94a3b8'],
        rolamentos: ['#7c3aed', '#a78bfa'],
        transmissao: ['#ea580c', '#fb923c'],
        usinagem: ['#dc2626', '#f87171'],
        analise: ['#0d9488', '#5eead4'],
        utilitarios: ['#6b7280', '#9ca3af'],
    };

    const catIcons = {
        hidraulica: ['fas', 'fa-water'],
        mineracao: ['fas', 'fa-gem'],
        lubrificacao: ['fas', 'fa-fill-drip'],
        engenharia_civil: ['fas', 'fa-crosshairs'],
        rolamentos: ['fas', 'fa-compact-disc'],
        transmissao: ['fas', 'fa-cogs'],
        usinagem: ['fas', 'fa-crosshairs'],
        analise: ['fas', 'fa-chart-line'],
        utilitarios: ['fas', 'fa-tools'],
    };

    ids.forEach(id => {
        const original = document.querySelector(`.tool-item[data-tool-id="${id}"]`);
        if (!original) return;
        const h4text = typeof i18n !== 'undefined' ? i18n.t('tool.' + id) : (original.querySelector('h4')?.textContent || 'Ferramenta');
        const ptext = typeof i18n !== 'undefined' ? i18n.t('tool.' + id + '.desc') : (original.querySelector('p')?.textContent || '');

        const catSection = original.closest('.category-section');
        let cat = 'utilitarios';
        if (catSection) {
            const h = catSection.querySelector('.category-header');
            if (h) cat = h.getAttribute('data-category') || 'utilitarios';
        }
        const [fa, icon] = catIcons[cat] || ['fas', 'fa-tools'];
        const [c1, c2] = gradientMap[cat] || ['#6b7280', '#9ca3af'];

        const div = document.createElement('a');
        div.href = original.href;
        div.className = 'featured-item';
        div.innerHTML = `
            <div class="fi-icon" style="background:linear-gradient(135deg,${c1},${c2})"><i class="${fa} ${icon}"></i></div>
            <div class="fi-info">
                <h4>${h4text}</h4>
                <p>${ptext}</p>
            </div>
            <i class="material-icons fi-arrow">chevron_right</i>
        `;
        list.appendChild(div);
    });
}

function navigateTo(screen) {
    const nav = document.querySelector(`.nav-item[data-screen="${screen}"]`);
    if (nav) nav.click();
}
