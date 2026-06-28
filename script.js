(function() {
    var path = window.location.pathname;
    window.APP_BASE_PATH = path.endsWith('/') ? path : path.substring(0, path.lastIndexOf('/') + 1);
})();

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initPrograms();
    initSearch();
    updateStats();
    initRecents(); // Inicializa o sistema de "Mais Usados" (Histórico local até 6 itens)
    if (typeof i18n !== 'undefined') i18n.translatePage();
    renderWidgets();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(window.APP_BASE_PATH + 'sw.js').catch(function() {});
    }

    // Controle de Tema Claro/Escuro
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        themeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-theme', this.checked);
            localStorage.setItem('theme', this.checked ? 'dark' : 'light');
        });
    }
});

// ============ NAVEGAÇÃO HÍBRIDA ============
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-screen]');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const target = this.dataset.screen;
            if (!target) return;
            navigateTo(target);
        });
    });
}

function navigateTo(screen) {
    const screens = document.querySelectorAll('.screen');
    const navItems = document.querySelectorAll('.nav-item[data-screen]');
    const targetScreen = document.getElementById(screen);
    const targetNav = document.querySelector(`.nav-item[data-screen="${screen}"]`);

    if (!targetScreen) return;

    // Oculta todas as telas
    screens.forEach(s => s.classList.remove('active'));
    targetScreen.classList.add('active');

    // Gerencia o estado da Bottom Nav
    navItems.forEach(n => n.classList.remove('active'));
    if (targetNav) {
        targetNav.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ ATALHOS DA HOME (UX) ============
function goToSearch() {
    navigateTo('programs');
    setTimeout(() => {
        const inp = document.getElementById('tool-search');
        if (inp) {
            inp.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 50);
}

// ============ PROGRAMAS ============
function initPrograms() {
    document.querySelectorAll('#programs .category-header').forEach(header => {
        header.addEventListener('click', function () {
            const section = this.parentElement;
            const isExpanded = section.classList.contains('expanded');

            document.querySelectorAll('#programs .category-section').forEach(s => {
                if (s !== section) {
                    s.classList.remove('expanded');
                }
            });

            section.classList.toggle('expanded', !isExpanded);
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

// ============ FAVORITOS (RENDERIZAÇÃO NA TELA CHEIA) ============
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
        ic.className = isFav(id) ? 'fas fa-star' : 'far fa-star';
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
    
    document.querySelectorAll('#programs .tool-item[data-tool-id]').forEach(item => {
        const id = item.getAttribute('data-tool-id');
        if (favs.includes(id)) {
            const clone = item.cloneNode(true);
            clone.classList.remove('hidden'); // Previne herdar 'hidden' de buscas na aba de programas
            c.appendChild(clone);
            n++;
        }
    });
    
    if (n === 0) {
        c.innerHTML = `
            <div style="text-align:center; padding: 4rem 1rem; color: var(--text-secondary);">
                <i class="fas fa-star" style="font-size: 3rem; opacity: 0.25; margin-bottom: 1rem; display: block;"></i>
                <p style="font-size: 0.95rem; font-weight: 500;">Nenhuma ferramenta classificada como favorita.</p>
                <p style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.4rem;">Toque no ícone de estrela em qualquer ferramenta para fixá-la aqui.</p>
            </div>`;
    }

    // Reatribui o evento de desfavoritar nos elementos clonados
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

// ============ MAIS USADOS (HISTÓRICO LOCAL ATÉ 6 CARDS) ============
const RECENTS_KEY = 'mi-tool-recents';

function initRecents() {
    renderRecents();

    // Escuta global de cliques para capturar uso de ferramentas (Lista, Widgets ou Cards)
    document.addEventListener('click', function(e) {
        const toolLink = e.target.closest('.tool-item[data-tool-id], .widget-item-link[data-tool-id], .recent-card[data-tool-id]');
        if (toolLink) {
            const id = toolLink.getAttribute('data-tool-id');
            if (id) recordToolAccess(id);
        }
    });
}

function recordToolAccess(id) {
    let recents = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
    recents = recents.filter(item => item !== id); // Remove se já existir para reposicionar no topo
    recents.unshift(id);
    
    if (recents.length > 6) recents.pop(); // Trava rigorosa em no máximo 6 cards
    
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
    renderRecents();
}

function renderRecents() {
    const sec = document.getElementById('recents-section');
    const grid = document.getElementById('recents-grid');
    if (!sec || !grid) return;

    const recents = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
    if (recents.length === 0) {
        sec.style.display = 'none';
        return;
    }

    sec.style.display = 'block';
    grid.innerHTML = '';

    recents.forEach(id => {
        const original = document.querySelector(`#programs .tool-item[data-tool-id="${id}"]`);
        if (!original) return;

        const name = original.querySelector('h4')?.textContent || id;
        const href = original.getAttribute('href');
        const originalIcon = original.querySelector('.tool-icon');

        let iconClone;
        if (originalIcon) {
            iconClone = originalIcon.cloneNode(true);
        } else {
            iconClone = document.createElement('div');
            iconClone.className = 'tool-icon';
            iconClone.style.background = '#64748b';
            iconClone.innerHTML = '<i class="fas fa-tools"></i>';
        }

        const card = document.createElement('a');
        card.className = 'recent-card';
        card.href = href;
        card.setAttribute('data-tool-id', id);
        card.innerHTML = `${iconClone.outerHTML}<span>${name}</span>`;
        grid.appendChild(card);
    });
}

window.clearRecents = function() {
    localStorage.removeItem(RECENTS_KEY);
    renderRecents();
};

// ============ BUSCA ============
function initSearch() {
    const inp = document.getElementById('tool-search');
    if (!inp) return;

    inp.addEventListener('input', function () {
        const t = this.value.toLowerCase().trim();
        
        document.querySelectorAll('#programs .category-section').forEach(sec => {
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
        if (typeof i18n !== 'undefined' && i18n.updateToolCounts) i18n.updateToolCounts();
    });
}

// ============ ESTATÍSTICAS ============
function updateStats() {
    const total = document.querySelectorAll('#programs .tool-item[data-tool-id]').length;
    const favs = getFavs().length;
    const catCount = document.querySelectorAll('#programs .category-section').length;

    const s1 = document.getElementById('stat-tools');
    const s2 = document.getElementById('stat-favs');
    const s3 = document.getElementById('stat-categories');

    if (s1) s1.textContent = total;
    if (s2) s2.textContent = favs;
    if (s3) s3.textContent = catCount;
}

// ============ WIDGET SYSTEM ============
const DEFAULT_WIDGETS = ['calculadora_graxa', 'fmea', 'vazao_perda_carga', 'montagem_rolamentos', 'relacao_engrenagens', 'kpis_manutencao'];
const WIDGET_STORAGE_KEY = 'site-home-widgets';

function getWidgets() {
    const stored = localStorage.getItem(WIDGET_STORAGE_KEY);
    if (stored === null) return [...DEFAULT_WIDGETS];
    return JSON.parse(stored);
}

function setWidgets(ids) {
    localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(ids));
}

function isWidget(id) {
    return getWidgets().includes(id);
}

function toggleWidget(id) {
    const widgets = getWidgets();
    const i = widgets.indexOf(id);
    if (i >= 0) {
        widgets.splice(i, 1);
    } else {
        widgets.push(id);
    }
    setWidgets(widgets);
    renderWidgets();
    updatePickerToggles();
}

function removeWidget(id) {
    const widgets = getWidgets().filter(w => w !== id);
    setWidgets(widgets);
    renderWidgets();
    updatePickerToggles();
}

function renderWidgets() {
    const list = document.getElementById('widget-list');
    if (!list) return;
    list.innerHTML = '';

    const widgetIds = getWidgets();

    if (widgetIds.length === 0) {
        list.innerHTML = `
            <div class="widget-empty">
                <i class="fas fa-th-large"></i>
                <p data-i18n="widget.empty">Nenhum widget adicionado</p>
                <button class="widget-add-btn" onclick="openWidgetPicker()">
                    <i class="fas fa-plus"></i> <span data-i18n="widget.add">Adicionar ferramentas</span>
                </button>
            </div>`;
        if (typeof i18n !== 'undefined' && i18n.applyTranslations) i18n.applyTranslations(list);
        return;
    }

    widgetIds.forEach(id => {
        const original = document.querySelector(`#programs .tool-item[data-tool-id="${id}"]`);
        if (!original) return;

        const name = original.querySelector('h4')?.textContent || id;
        const desc = original.querySelector('p')?.textContent || '';
        const href = original.getAttribute('href');
        const originalIconDiv = original.querySelector('.tool-icon');
        
        let iconClone;
        if (originalIconDiv) {
            iconClone = originalIconDiv.cloneNode(true);
            iconClone.className = 'fi-icon';
        } else {
            iconClone = document.createElement('div');
            iconClone.className = 'fi-icon';
            iconClone.style.background = 'linear-gradient(135deg,#6b7280,#9ca3af)';
            iconClone.innerHTML = '<i class="fas fa-tools"></i>';
        }

        const item = document.createElement('div');
        item.className = 'widget-item';
        item.innerHTML = `
            <a href="${href}" class="widget-item-link" data-tool-id="${id}">
                ${iconClone.outerHTML}
                <div class="fi-info">
                    <h4>${name}</h4>
                    <p>${desc}</p>
                </div>
                <i class="material-icons fi-arrow">chevron_right</i>
            </a>
            <button class="widget-remove-btn" onclick="removeWidget('${id}')" title="Remover widget">
                <i class="fas fa-times"></i>
            </button>
        `;
        list.appendChild(item);
    });
}

// ============ WIDGET PICKER MODAL ============
function openWidgetPicker() {
    const overlay = document.getElementById('widget-picker-overlay');
    const sheet = document.getElementById('widget-picker-sheet');
    if (!overlay || !sheet) return;

    buildPickerList();

    overlay.classList.add('active');
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWidgetPicker() {
    const overlay = document.getElementById('widget-picker-overlay');
    const sheet = document.getElementById('widget-picker-sheet');
    if (overlay) overlay.classList.remove('active');
    if (sheet) sheet.classList.remove('active');
    document.body.style.overflow = '';
}

function buildPickerList() {
    const container = document.getElementById('picker-tools-list');
    if (!container) return;
    container.innerHTML = '';

    const categories = document.querySelectorAll('#programs .category-section');
    categories.forEach(sec => {
        const catHeader = sec.querySelector('.category-header');
        const catName = catHeader?.querySelector('h3')?.textContent || '';
        const catIcon = catHeader?.querySelector('.category-icon')?.style.background || '';
        const tools = sec.querySelectorAll('.tool-item[data-tool-id]');
        if (tools.length === 0) return;

        const group = document.createElement('div');
        group.className = 'picker-group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'picker-group-header';
        groupHeader.innerHTML = `<div class="picker-cat-dot" style="background:${catIcon}"></div><span>${catName}</span>`;
        group.appendChild(groupHeader);

        tools.forEach(tool => {
            const id = tool.getAttribute('data-tool-id');
            const name = tool.querySelector('h4')?.textContent || id;
            const checked = isWidget(id) ? 'checked' : '';

            const row = document.createElement('div');
            row.className = 'picker-tool-row';
            row.onclick = () => toggleWidget(id);
            row.innerHTML = `
                <span class="picker-tool-name">${name}</span>
                <div class="picker-toggle ${checked ? 'on' : ''}" data-id="${id}">
                    <div class="picker-toggle-knob"></div>
                </div>
            `;
            group.appendChild(row);
        });

        container.appendChild(group);
    });
}

function updatePickerToggles() {
    document.querySelectorAll('.picker-toggle[data-id]').forEach(toggle => {
        const id = toggle.getAttribute('data-id');
        toggle.classList.toggle('on', isWidget(id));
    });
}

// ============ SISTEMA DE ATUALIZAÇÕES (APK / WEB / IOS PWA) ============
const APP_VERSION = '1.1.1';
const APP_VERSION_CODE = 16;
const PACKAGE_NAME = 'com.manutencaoarquivos.app';
const VERSION_CHECK_INTERVAL = 3600000;

class UpdateManager {
    constructor() {
        this.currentVersion = APP_VERSION;
        this.currentVersionCode = parseInt(localStorage.getItem('mi-current-version-code'), 10) || APP_VERSION_CODE;
        this.packageName = PACKAGE_NAME;
        this.updateAvailable = false;
        this.updateData = null;
        this.platform = this.detectPlatform();
        this.isApk = this.platform === 'apk';
        this.isIosPwa = this.platform === 'ios-pwa';
        this.isBrowser = this.platform === 'browser';
        this.syncHeaderBadge(); 
    } 

    syncHeaderBadge() { 
        const badgeSpan = document.querySelector('#header-version-badge span');
        if (badgeSpan) badgeSpan.textContent = 'v' + this.currentVersion;
    }

    detectPlatform() {
        const ua = navigator.userAgent.toLowerCase();
        const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
        const isAndroid = ua.includes('android');
        
        if (isAndroid && /\bwv\b|webview/i.test(ua)) return 'apk';
        if ((ua.includes('iphone') || ua.includes('ipad')) && isStandalone) return 'ios-pwa';
        if (ua.includes('iphone') || ua.includes('ipad')) return 'ios-safari';
        return 'browser';
    }

    async fetchVersionData() {
        try {
            var baseUrl = window.APP_BASE_PATH || '/APLICATIVO/';
            const response = await fetch(baseUrl + 'version.json?t=' + Date.now(), { cache: 'no-cache' });
            if (!response.ok) throw new Error('Falha de rede ao verificar versão');
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    async checkForUpdates(showNotification = true) {
        if (!showNotification) {
            var dismissed = localStorage.getItem('mi-update-dismissed');
            if (dismissed) {
                var elapsed = Date.now() - parseInt(dismissed, 10);
                if (elapsed < 86400000) return false; // Silencia por 24h se o utilizador ignorou
            }
        }

                try {
            var data = await this.fetchVersionData();
            if (!data) return false;
            
            this.updateData = data;

            // Lógica híbrida: APK olha 'apkVersionCode', Web (PWA) olha 'versionCode'
            var versaoAlvo = this.isApk ? (data.apkVersionCode || data.versionCode) : data.versionCode;
            var hasUpdate = versaoAlvo > this.currentVersionCode;

            var isBelowMinimum = this.currentVersionCode < (data.minimumVersionCode || 0);
            var isForceUpdate = data.forceUpdate === true || isBelowMinimum;
            
            if (hasUpdate || isBelowMinimum) {
                this.updateAvailable = true;
                localStorage.setItem('mi-last-version-check', Date.now().toString());
                
                const badge = document.getElementById('header-version-badge');
                if (badge) {
                    badge.classList.add('has-update');
                    badge.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Atualizar</span>`;
                }


                if (showNotification) {
                    if (this.isApk) this.showApkNotification(data, isForceUpdate);
                    else if (this.isIosPwa) this.showIosPwaUpdateNotification(data, isForceUpdate);
                    else this.showWebUpdateNotification(data, isForceUpdate);
                }
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    showApkNotification(data, forceUpdate) {
        var _t = typeof i18n !== 'undefined' && i18n.t ? i18n.t : function(k) { return k; };
        var existingNotification = document.querySelector('.update-notification-overlay');
        if (existingNotification) existingNotification.remove();

        var changelogHTML = '';
        if (data && data.changelog && data.changelog.length > 0) {
            var items = data.changelog.map(item => '<li>' + item.replace(/^[•\s]+/, '') + '</li>').join('');
            changelogHTML = '<div class="update-changelog"><p class="changelog-title">' + _t('update.changelog_title') + '</p><ul>' + items + '</ul></div>';
        }

        var forceClass = forceUpdate ? ' force-update' : '';
        var overlay = document.createElement('div');
        overlay.className = 'update-notification-overlay';
        overlay.innerHTML = `
            <div class="update-notification-card playstore-update${forceClass}">
                <div class="update-icon" style="background:linear-gradient(135deg,#34a853,#1a8c3a)"><i class="fab fa-google-play"></i></div>
                <h3>${forceUpdate ? _t('update.force') : _t('update.available')}</h3>
                <p class="update-version">${_t('update.version').replace('{v}', data ? data.version : '')}</p>
                <p class="update-message">${_t('update.store_message')}</p>
                ${changelogHTML}
                <div class="update-details">
                    <p>${_t('update.how_to')}</p>
                    <ol><li>${_t('update.step1')}</li><li>${_t('update.step2')}</li><li>${_t('update.step3')}</li></ol>
                </div>
                <div class="update-actions">
                    <button class="update-btn update-playstore" onclick="UpdateManagerInstance.openPlayStore()"><i class="fab fa-google-play"></i> ${_t('update.go_store')}</button>
                    ${forceUpdate ? '' : '<button class="update-btn update-later" onclick="UpdateManagerInstance.dismissUpdate()">' + _t('common.mais_tarde') + '</button>'}
                </div>
            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }

    showWebUpdateNotification(data, forceUpdate = false) {
        const existingNotification = document.querySelector('.update-notification-overlay');
        if (existingNotification) existingNotification.remove();

        var _t = typeof i18n !== 'undefined' && i18n.t ? i18n.t : function(k) { return k; };
        let changelogHTML = '';
        if (data && data.changelog && data.changelog.length > 0) {
            const items = data.changelog.map(item => `<li>${item.replace(/^[•\s]+/, '')}</li>`).join('');
            changelogHTML = `<div class="update-changelog"><p class="changelog-title">${_t('update.changelog_title')}</p><ul>${items}</ul></div>`;
        }

        const forceButtons = forceUpdate ? '' : `<button class="update-btn update-later" onclick="UpdateManagerInstance.dismissUpdate()">${_t('common.mais_tarde')}</button>`;
        const overlay = document.createElement('div');
        overlay.className = 'update-notification-overlay';
        overlay.innerHTML = `
            <div class="update-notification-card${forceUpdate ? ' force-update' : ''}">
                <div class="update-icon"><i class="fas fa-sync-alt"></i></div>
                <h3>${forceUpdate ? _t('update.force') : _t('update.title')}</h3>
                <p class="update-version">${_t('update.version').replace('{v}', data ? data.version : '')}</p>
                <p class="update-message">${_t('update.web_message')}</p>
                ${changelogHTML}
                ${forceUpdate ? '<p class="update-warning">' + _t('update.force_message') + '</p>' : ''}
                <div class="update-actions">
                    <button class="update-btn update-now" onclick="UpdateManagerInstance.installWebUpdate()"><i class="fas fa-download"></i> ${_t('update.title')}</button>
                    ${forceButtons}
                </div>
            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }

    showIosPwaUpdateNotification(data, forceUpdate) {
        var _t = typeof i18n !== 'undefined' && i18n.t ? i18n.t : function(k) { return k; };
        var existingNotification = document.querySelector('.update-notification-overlay');
        if (existingNotification) existingNotification.remove();

        var changelogHTML = '';
        if (data && data.changelog && data.changelog.length > 0) {
            var items = data.changelog.map(item => '<li>' + item.replace(/^[•\s]+/, '') + '</li>').join('');
            changelogHTML = '<div class="update-changelog"><p class="changelog-title">' + _t('update.changelog_title') + '</p><ul>' + items + '</ul></div>';
        }

        var forceClass = forceUpdate ? ' force-update' : '';
        var overlay = document.createElement('div');
        overlay.className = 'update-notification-overlay';
        overlay.innerHTML = `
            <div class="update-notification-card${forceClass}">
                <div class="update-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)"><i class="fab fa-apple"></i></div>
                <h3>${forceUpdate ? _t('update.force') : _t('update.title')}</h3>
                <p class="update-version">${_t('update.version').replace('{v}', data ? data.version : '')}</p>
                <p class="update-message">${_t('update.store_message')}</p>
                ${changelogHTML}
                <div class="update-details">
                    <p>${_t('update.how_to')}</p>
                    <ol><li>Abra o Safari</li><li>Acesse o aplicativo normalmente</li><li>Feche e reabra o app da tela de início</li></ol>
                </div>
                ${forceUpdate ? '<p class="update-warning">' + _t('update.force_message') + '</p>' : ''}
                <div class="update-actions">
                    <button class="update-btn update-now" onclick="UpdateManagerInstance.installWebUpdate()"><i class="fas fa-sync-alt"></i> ${_t('update.title')}</button>
                    ${forceUpdate ? '' : '<button class="update-btn update-later" onclick="UpdateManagerInstance.dismissUpdate()">' + _t('common.mais_tarde') + '</button>'}
                </div>
            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }

    async installWebUpdate() {
        const btn = document.querySelector('.update-now');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
            btn.disabled = true;
        }
        try {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            if (this.updateData && this.updateData.versionCode) {
                localStorage.setItem('mi-current-version-code', this.updateData.versionCode.toString());
            }
            if ('serviceWorker' in navigator) {
                var swUrl = (window.APP_BASE_PATH || '/') + 'sw.js';
                const registration = await navigator.serviceWorker.register(swUrl);
                if (registration.active) await registration.update();
            }
            window.location.reload();
        } catch (error) {
            window.location.reload();
        }
    }

    openPlayStore() {
        var pkg = this.packageName;
        window.location.href = 'market://details?id=' + pkg;
        setTimeout(() => window.location.href = 'https://play.google.com/store/apps/details?id=' + pkg, 2000);
    }

    dismissUpdate() {
        const overlay = document.querySelector('.update-notification-overlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
        localStorage.setItem('mi-update-dismissed', Date.now().toString());
    }

async manualCheck() {
        // 1. Limpeza Invisível (Stealth Reset)
        try {
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (let r of regs) await r.unregister(); // Mata processos zumbis
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k))); // Esvazia o cache
            }
            // Religa o motor limpo imediatamente
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register((window.APP_BASE_PATH || '/') + 'sw.js');
            }
        } catch (e) {
            console.warn("Falha no stealth reset:", e);
        }

        // 2. Continua o fluxo normal de verificação
        var result = await this.checkForUpdates(true);
        if (!result) this.showNoUpdateNotification();
        return result;
    }

    showApkStoreRedirect() {
        var existingNotification = document.querySelector('.update-notification-overlay');
        if (existingNotification) existingNotification.remove();

        var overlay = document.createElement('div');
        overlay.className = 'update-notification-overlay';
        overlay.innerHTML = `
            <div class="update-notification-card playstore-update">
                <div class="update-icon" style="background:linear-gradient(135deg,#34a853,#1a8c3a)">
                    <i class="fab fa-google-play"></i>
                </div>
                <h3>Verificar Atualização</h3>
                <p class="update-message" style="margin-top: 8px;">
                    Para verificar se há uma nova versão disponível, acesse a página oficial do aplicativo na Play Store.
                </p>
                <div class="update-actions" style="margin-top: 20px;">
                    <button class="update-btn update-playstore" onclick="UpdateManagerInstance.openPlayStore()">
                        <i class="fab fa-google-play"></i> Abrir Play Store
                    </button>
                    <button class="update-btn update-later" onclick="UpdateManagerInstance.dismissUpdate()">
                        Fechar
                    </button>
                </div>
            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }


    showNoUpdateNotification() {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<div class="toast-content"><i class="fas fa-check-circle"></i><span>Aplicativo atualizado</span></div>`;

        document.body.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.parentNode && toast.remove(), 500);
        }, 3000);
    }
}

const UpdateManagerInstance = new UpdateManager();
window.checkForUpdates = function() { UpdateManagerInstance.manualCheck(); };
window.openPlayStore = function() { UpdateManagerInstance.openPlayStore(); };
