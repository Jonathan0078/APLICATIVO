document.addEventListener('DOMContentLoaded', () => {

    // ============ DOM REFS ============
    const searchInput = document.getElementById('search-input');
    const rolamentoInput = document.getElementById('rolamento-input');
    const shaftInput = document.getElementById('shaft-input');
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-container');
    const themeToggle = document.getElementById('theme-toggle');
    const loader = document.getElementById('loader');
    const typeFilter = document.getElementById('type-filter');
    const fixFilter = document.getElementById('fix-filter');
    const autocompleteList = document.getElementById('autocomplete-list');
    const resultCount = document.getElementById('result-count');
    const comparePanel = document.getElementById('compare-panel');
    const compareList = document.getElementById('compare-list');
    const compareTableWrap = document.getElementById('compare-table-wrap');
    const clearCompare = document.getElementById('clear-compare');
    const svgCard = document.getElementById('svg-card');
    const svgContainer = document.getElementById('svg-container');

    // ============ STATE ============
    let compareItems = [];
    let allKeys = [];

    // ============ DEBOUNCE ============
    function debounce(fn, delay) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
    }

    // ============ THEME ============
    function setupTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : '');
        });
    }

    // ============ SVG ILLUSTRATIONS ============
    function getSvgForType(tipo) {
        if (!tipo) return '';
        var t = tipo.toLowerCase();
        if (t.includes('pillow block')) {
            return '<svg viewBox="0 0 200 140" style="width:100%;max-width:280px;display:block;margin:0 auto"><rect x="20" y="40" width="160" height="80" rx="10" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><rect x="10" y="115" width="50" height="15" rx="3" style="fill:var(--primary);opacity:0.5"/><rect x="140" y="115" width="50" height="15" rx="3" style="fill:var(--primary);opacity:0.5"/><circle cx="100" cy="80" r="28" style="fill:none;stroke:var(--text-secondary);stroke-width:2"/><circle cx="100" cy="80" r="10" style="fill:var(--primary);opacity:0.3"/><circle cx="30" cy="122" r="4" style="fill:var(--primary)"/><circle cx="170" cy="122" r="4" style="fill:var(--primary)"/><text x="100" y="24" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Pillow Block</text><line x1="50" y1="115" x2="50" y2="130" style="stroke:var(--primary);stroke-width:1.5"/><line x1="150" y1="115" x2="150" y2="130" style="stroke:var(--primary);stroke-width:1.5"/></svg>';
        }
        if (t.includes('flange')) {
            var shape = t.includes('redondo') ? 'circle' : 'rect';
            if (shape === 'circle') {
                return '<svg viewBox="0 0 200 200" style="width:100%;max-width:220px;display:block;margin:0 auto"><circle cx="100" cy="100" r="80" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><circle cx="100" cy="100" r="30" style="fill:none;stroke:var(--text-secondary);stroke-width:2"/><circle cx="100" cy="100" r="10" style="fill:var(--primary);opacity:0.3"/><circle cx="100" cy="30" r="5" style="fill:var(--primary);opacity:0.6"/><circle cx="100" cy="170" r="5" style="fill:var(--primary);opacity:0.6"/><circle cx="30" cy="100" r="5" style="fill:var(--primary);opacity:0.6"/><circle cx="170" cy="100" r="5" style="fill:var(--primary);opacity:0.6"/><text x="100" y="12" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Flange Redondo</text></svg>';
            }
            return '<svg viewBox="0 0 200 200" style="width:100%;max-width:220px;display:block;margin:0 auto"><rect x="20" y="20" width="160" height="160" rx="12" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><circle cx="100" cy="100" r="30" style="fill:none;stroke:var(--text-secondary);stroke-width:2"/><circle cx="100" cy="100" r="10" style="fill:var(--primary);opacity:0.3"/><circle cx="40" cy="40" r="5" style="fill:var(--primary);opacity:0.6"/><circle cx="160" cy="40" r="5" style="fill:var(--primary);opacity:0.6"/><circle cx="40" cy="160" r="5" style="fill:var(--primary);opacity:0.6"/><circle cx="160" cy="160" r="5" style="fill:var(--primary);opacity:0.6"/><text x="100" y="12" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Flange Quadrado</text></svg>';
        }
        if (t.includes('snl') || t.includes('bipartido')) {
            return '<svg viewBox="0 0 200 160" style="width:100%;max-width:260px;display:block;margin:0 auto"><rect x="30" y="45" width="140" height="35" rx="4" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><rect x="30" y="80" width="140" height="35" rx="4" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><rect x="60" y="115" width="20" height="20" rx="3" style="fill:var(--primary);opacity:0.3"/><rect x="120" y="115" width="20" height="20" rx="3" style="fill:var(--primary);opacity:0.3"/><circle cx="100" cy="78" r="22" style="fill:none;stroke:var(--text-secondary);stroke-width:2"/><circle cx="100" cy="78" r="8" style="fill:var(--primary);opacity:0.3"/><line x1="40" y1="80" x2="160" y2="80" style="stroke:var(--primary);stroke-width:1;stroke-dasharray:4,2"/><text x="100" y="24" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Mancal Bipartido (SNL)</text></svg>';
        }
        if (t.includes('tensor')) {
            return '<svg viewBox="0 0 200 160" style="width:100%;max-width:260px;display:block;margin:0 auto"><rect x="20" y="30" width="50" height="100" rx="5" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><rect x="130" y="30" width="50" height="100" rx="5" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><rect x="60" y="65" width="80" height="30" rx="4" style="fill:var(--primary);opacity:0.15;stroke:var(--primary);stroke-width:1.5"/><circle cx="100" cy="80" r="12" style="fill:none;stroke:var(--text-secondary);stroke-width:2"/><circle cx="100" cy="80" r="5" style="fill:var(--primary);opacity:0.3"/><line x1="45" y1="130" x2="45" y2="150" style="stroke:var(--primary);stroke-width:2"/><line x1="155" y1="130" x2="155" y2="150" style="stroke:var(--primary);stroke-width:2"/><text x="100" y="20" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Tensor</text></svg>';
        }
        if (t.includes('cartucho')) {
            return '<svg viewBox="0 0 200 140" style="width:100%;max-width:260px;display:block;margin:0 auto"><rect x="40" y="35" width="120" height="70" rx="15" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><circle cx="100" cy="70" r="24" style="fill:none;stroke:var(--text-secondary);stroke-width:2"/><circle cx="100" cy="70" r="8" style="fill:var(--primary);opacity:0.3"/><rect x="35" y="55" width="8" height="30" rx="3" style="fill:var(--primary);opacity:0.4"/><rect x="157" y="55" width="8" height="30" rx="3" style="fill:var(--primary);opacity:0.4"/><text x="100" y="18" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Cartucho</text></svg>';
        }
        return '<svg viewBox="0 0 200 120" style="width:100%;max-width:200px;display:block;margin:0 auto"><circle cx="100" cy="60" r="35" style="fill:var(--bg);stroke:var(--primary);stroke-width:2"/><circle cx="100" cy="60" r="10" style="fill:var(--primary);opacity:0.3"/><text x="100" y="110" text-anchor="middle" font-size="11" fill="var(--text-secondary)">Mancal</text></svg>';
    }

    // ============ BUILD FILTERS ============
    function buildFilters(db) {
        var types = new Set();
        var fixMethods = new Set();
        Object.values(db).forEach(v => {
            types.add(v.tipo);
            if (v.unidade_rolamento) fixMethods.add(v.unidade_rolamento.metodo_fixacao);
        });
        var sortedTypes = [...types].sort();
        sortedTypes.forEach(t => {
            var opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            typeFilter.appendChild(opt);
        });
        var sortedFix = [...fixMethods].sort();
        sortedFix.forEach(m => {
            var opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            fixFilter.appendChild(opt);
        });
    }

    // ============ AUTOCOMPLETE ============
    function setupAutocomplete(db) {
        var keys = Object.keys(db);
        searchInput.addEventListener('input', debounce(function() {
            var val = this.value.trim().toUpperCase();
            autocompleteList.innerHTML = '';
            if (val.length < 1) return;
            var matches = keys.filter(k => k.toUpperCase().startsWith(val)).slice(0, 12);
            matches.forEach(m => {
                var div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.innerHTML = '<strong>' + m + '</strong>';
                div.addEventListener('click', function() {
                    searchInput.value = m;
                    autocompleteList.innerHTML = '';
                    performSearch(db);
                });
                autocompleteList.appendChild(div);
            });
        }, 200));
        document.addEventListener('click', function(e) {
            if (e.target !== searchInput) autocompleteList.innerHTML = '';
        });
    }

    // ============ CHIP CLICKS ============
    // ============ CLEAR BUTTONS ============
    function setupClearButtons(db) {
        document.getElementById('clear-search').addEventListener('click', function() { searchInput.value = ''; autocompleteList.innerHTML = ''; performSearch(db); });
    }

    // ============ PERFORM SEARCH ============
    function performSearch(db) {
        var searchTerm = searchInput.value.trim().toUpperCase();
        var rolamentoTerm = rolamentoInput.value.trim().toUpperCase();
        var shaftSize = shaftInput.value.trim();
        var typeVal = typeFilter.value;
        var fixVal = fixFilter.value;

        if (!searchTerm && !rolamentoTerm && !shaftSize && !typeVal && !fixVal) {
            showInitialMessage();
            return;
        }

        var keys = Object.keys(db);

        // text search
        if (searchTerm) {
            keys = keys.filter(k => k.toUpperCase().includes(searchTerm));
        }

        // rolamento search
        if (rolamentoTerm) {
            keys = keys.filter(k => {
                var d = db[k];
                if (d.unidade_rolamento && d.unidade_rolamento.rolamento_inserido.toUpperCase().includes(rolamentoTerm)) return true;
                if (d.rolamentos_compativeis) return d.rolamentos_compativeis.some(r => r.rolamento.toUpperCase().includes(rolamentoTerm));
                return false;
            });
        }

        // shaft filter
        if (shaftSize) {
            keys = keys.filter(k => {
                var d = db[k];
                if (d.eixo_mm && d.eixo_mm == shaftSize) return true;
                if (d.rolamentos_compativeis) return d.rolamentos_compativeis.some(r => r.eixo == shaftSize);
                return false;
            });
        }

        // type filter
        if (typeVal) {
            keys = keys.filter(k => db[k].tipo === typeVal);
        }

        // fix method filter
        if (fixVal) {
            keys = keys.filter(k => db[k].unidade_rolamento && db[k].unidade_rolamento.metodo_fixacao === fixVal);
        }

        allKeys = keys;
        displayFilteredResults(db, keys);
    }

    // ============ DISPLAY RESULTS ============
    function displayFilteredResults(db, keys) {
        resultsContainer.innerHTML = '';
        var searchTerm = searchInput.value.trim().toUpperCase();

        resultCount.textContent = keys.length + ' ' + (keys.length === 1 ? i18n.t('mancal.result') : i18n.t('mancal.results'));

        if (keys.length === 0) {
            resultsContainer.innerHTML = '<h2><i class="fas fa-search"></i> ' + i18n.t('mancal.results_title') + '</h2><p>' + i18n.t('mancal.no_results') + '</p>';
            return;
        }

        // group by type
        var groups = {};
        keys.forEach(k => {
            var tipo = db[k].tipo || 'Outros';
            if (!groups[tipo]) groups[tipo] = [];
            groups[tipo].push(k);
        });

        var sortedGroups = Object.keys(groups).sort();

        sortedGroups.forEach(tipo => {
            var section = document.createElement('div');
            section.className = 'result-group';
            var groupTitle = document.createElement('h3');
            groupTitle.className = 'group-title';
            groupTitle.innerHTML = '<i class="fas fa-chevron-down group-toggle"></i><i class="fas fa-folder"></i> ' + tipo + ' <span class="group-count">' + groups[tipo].length + '</span>';
            section.appendChild(groupTitle);

            var groupBody = document.createElement('div');
            groupBody.className = 'group-body';
            section.appendChild(groupBody);

            groupTitle.addEventListener('click', function() {
                groupBody.classList.toggle('collapsed');
                groupTitle.classList.toggle('collapsed');
            });

            groups[tipo].forEach(k => {
                var d = db[k];
                var eixoText = d.eixo_mm ? d.eixo_mm + ' mm' : (d.eixo_pol ? d.eixo_pol + ' (' + d.eixo_mm + ' mm)' : '—');
                var rolamentoText = d.unidade_rolamento ? d.unidade_rolamento.rolamento_inserido : (d.rolamentos_compativeis ? d.rolamentos_compativeis.map(r => r.rolamento).join(', ') : '—');

                var card = document.createElement('div');
                card.className = 'result-card';
                card.dataset.key = k;

                var dispName = d.designacao_completa || k;
                if (searchTerm && dispName.toUpperCase().includes(searchTerm)) {
                    var idx = dispName.toUpperCase().indexOf(searchTerm);
                    var len = searchTerm.length;
                    dispName = dispName.slice(0, idx) + '<mark>' + dispName.slice(idx, idx + len) + '</mark>' + dispName.slice(idx + len);
                }

                card.innerHTML =
                    '<div class="result-card-main">' +
                    '<div class="result-card-info">' +
                    '<strong class="result-card-title">' + k + '</strong>' +
                    '<span class="result-card-desc">' + dispName + '</span>' +
                    '<span class="result-card-meta">' + i18n.t('mancal.shaft') + ': <b>' + eixoText + '</b> &middot; ' + i18n.t('mancal.bearing') + ': <b>' + rolamentoText + '</b></span>' +
                    '</div>' +
                    '<label class="compare-cb-wrap" title="' + i18n.t('mancal.add_compare') + '"><input type="checkbox" class="compare-cb" data-key="' + k + '"></label>' +
                    '</div>';
                card.addEventListener('click', function(e) {
                    displayMancalData(db[k]);
                    document.getElementById('results-card').scrollIntoView({ behavior: 'smooth' });
                });
                groupBody.appendChild(card);
            });
            resultsContainer.appendChild(section);
        });
    }

    // ============ DISPLAY MANCAL DATA ============
    function displayMancalData(mancal) {
        var i18n = window.i18n;
        var t = i18n && i18n.t ? i18n.t : function(k, fb) { return fb || k; };
        var na = t('mancal.na', 'N/A');
        var eixoPrincipal = mancal.eixo_mm ? mancal.eixo_mm + ' mm' : (mancal.eixo_pol ? mancal.eixo_pol + ' (' + mancal.eixo_mm + ' mm)' : na);

        var html =
            '<h2>' +
            '<i class="fas fa-info-circle"></i> ' + mancal.designacao_completa +
            ' <i class="fas fa-copy copy-icon" data-copy="' + mancal.designacao_completa + '" title="Copiar designação"></i>' +
            '</h2>' +
            '<p><strong>' + t('mancal.type', 'Tipo') + ':</strong> ' + mancal.tipo + ' &nbsp;|&nbsp; <strong>' + t('mancal.shaft_std', 'Eixo') + ':</strong> ' + eixoPrincipal + '</p>';

        if (mancal.unidade_rolamento) {
            html +=
                '<div class="table-container"><table><thead><tr><th>' + t('mancal.bearing_type', 'Tipo') + '</th><th>' + t('mancal.designation', 'Designação') + '</th><th>' + t('mancal.fixation_method', 'Fixação') + '</th></tr></thead><tbody>' +
                '<tr><td>' + t('mancal.insert_bearing', 'Rolamento Inserido') + '</td><td>' + mancal.unidade_rolamento.rolamento_inserido + ' <i class="fas fa-copy copy-icon" data-copy="' + mancal.unidade_rolamento.rolamento_inserido + '" title="Copiar"></i></td><td>' + mancal.unidade_rolamento.metodo_fixacao + '</td></tr>' +
                '</tbody></table></div>';
        }

        if (mancal.rolamentos_compativeis) {
            var rows = mancal.rolamentos_compativeis.map(r =>
                '<tr><td>' + r.tipo + '</td><td>' + r.rolamento + ' <i class="fas fa-copy copy-icon" data-copy="' + r.rolamento + '" title="Copiar"></i></td><td>' + (r.bucha || na) + '</td><td>' + r.eixo + ' mm</td></tr>'
            ).join('');
            html += '<div class="table-container"><table><thead><tr><th>' + t('mancal.bearing_type', 'Tipo') + '</th><th>' + t('mancal.designation', 'Designação') + '</th><th>' + t('mancal.lock_washer', 'Bucha') + '</th><th>' + t('mancal.shaft_dia', 'Eixo') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        }

        if (mancal.vedacoes_compativeis) {
            var vRows = mancal.vedacoes_compativeis.map(v => '<tr><td>' + v + '</td></tr>').join('');
            html += '<div class="table-container"><table><thead><tr><th>' + t('mancal.seals_compatible', 'Vedações Compatíveis') + '</th></tr></thead><tbody>' + vRows + '</tbody></table></div>';
        }

        if (mancal.notas_tecnicas) {
            html += '<br><p><strong>' + t('mancal.note', 'Nota') + ':</strong> ' + mancal.notas_tecnicas + '</p>';
        }

        resultsContainer.innerHTML = html;
        svgCard.style.display = 'block';
        svgContainer.innerHTML = getSvgForType(mancal.tipo);
    }

    // ============ SHOW INITIAL ============
    function showInitialMessage() {
        resultsContainer.innerHTML = '<h2><i class="fas fa-hand-pointer"></i> ' + i18n.t('mancal.welcome_title') + '</h2><p>' + i18n.t('mancal.welcome_msg') + '</p>';
        resultCount.textContent = '';
        svgContainer.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1rem;font-size:0.85rem">' + i18n.t('mancal.click_hint') + '</p>';
    }

    // ============ COMPARE ============
    function updateComparePanel(db) {
        if (compareItems.length === 0) {
            comparePanel.style.display = 'none';
            return;
        }
        comparePanel.style.display = 'block';
        compareList.innerHTML = compareItems.map(k =>
            '<span class="compare-tag">' + k + ' <i class="fas fa-times remove-compare" data-key="' + k + '"></i></span>'
        ).join('');

        if (compareItems.length < 2) {
            compareTableWrap.innerHTML = '<p style="color:var(--text-secondary);font-size:.85rem">' + i18n.t('mancal.select_more') + '</p>';
            return;
        }

        var headers = [i18n.t('mancal.th_designation'), i18n.t('mancal.th_type'), i18n.t('mancal.th_shaft'), i18n.t('mancal.th_bearing'), i18n.t('mancal.th_fixation')].map(h => '<th>' + h + '</th>').join('');
        var rows = compareItems.map(k => {
            var d = db[k];
            var eixo = d.eixo_mm ? d.eixo_mm + ' mm' : (d.eixo_pol ? d.eixo_pol : '—');
            var rol = d.unidade_rolamento ? d.unidade_rolamento.rolamento_inserido : (d.rolamentos_compativeis ? d.rolamentos_compativeis[0].rolamento : '—');
            var fix = d.unidade_rolamento ? d.unidade_rolamento.metodo_fixacao : '—';
            return '<tr><td><strong>' + k + '</strong></td><td>' + d.tipo + '</td><td>' + eixo + '</td><td>' + rol + '</td><td>' + fix + '</td></tr>';
        }).join('');
        compareTableWrap.innerHTML = '<div class="table-container"><table><thead><tr>' + headers + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
    }

    function toggleCompare(key, db) {
        var idx = compareItems.indexOf(key);
        if (idx > -1) { compareItems.splice(idx, 1); }
        else { if (compareItems.length >= 4) return; compareItems.push(key); }
        updateComparePanel(db);
        // sync checkboxes
        document.querySelectorAll('.compare-cb').forEach(cb => {
            cb.checked = compareItems.includes(cb.dataset.key);
        });
    }

    // ============ SORT ============
    var sortAsc = true;
    document.querySelector('.sort-btn').addEventListener('click', function() {
        sortAsc = !sortAsc;
        this.innerHTML = sortAsc ? '<i class="fas fa-sort-amount-down-alt"></i> ' + i18n.t('mancal.sort_asc') : '<i class="fas fa-sort-amount-down"></i> ' + i18n.t('mancal.sort_desc');
        if (allKeys.length) {
            var db = typeof DB_MANCAIS !== 'undefined' ? DB_MANCAIS : {};
            allKeys.sort(function(a, b) {
                var aVal = db[a].eixo_mm || 0;
                var bVal = db[b].eixo_mm || 0;
                return sortAsc ? aVal - bVal : bVal - aVal;
            });
            displayFilteredResults(db, allKeys);
            syncCompareCheckboxes();
        }
    });

    function syncCompareCheckboxes() {
        document.querySelectorAll('.compare-cb').forEach(cb => {
            cb.checked = compareItems.includes(cb.dataset.key);
        });
    }

    // ============ EVENT LISTENERS ============
    function setupEventListeners(db) {
        searchForm.addEventListener('submit', e => e.preventDefault());

        var debouncedSearch = debounce(function() { performSearch(db); }, 250);
        searchInput.addEventListener('input', debouncedSearch);
        rolamentoInput.addEventListener('input', debouncedSearch);
        shaftInput.addEventListener('input', debouncedSearch);
        typeFilter.addEventListener('change', function() { performSearch(db); });
        fixFilter.addEventListener('change', function() { performSearch(db); });

        // copy
        resultsContainer.addEventListener('click', function(e) {
            var target = e.target;
            if (target.classList.contains('copy-icon')) {
                var text = target.dataset.copy;
                navigator.clipboard.writeText(text).catch(function() {});
                var orig = target.title;
                target.title = 'Copiado!';
                setTimeout(function() { target.title = orig; }, 1500);
                return;
            }
        });

        // compare checkbox
        resultsContainer.addEventListener('change', function(e) {
            if (e.target.classList.contains('compare-cb')) {
                toggleCompare(e.target.dataset.key, db);
            }
        });

        // remove from compare
        compareList.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-compare')) {
                toggleCompare(e.target.dataset.key, db);
            }
        });

        clearCompare.addEventListener('click', function() {
            compareItems = [];
            updateComparePanel(db);
            syncCompareCheckboxes();
        });

        // collapse all
        document.getElementById('collapse-all').addEventListener('click', function() {
            var bodies = document.querySelectorAll('.group-body');
            var allCollapsed = true;
            bodies.forEach(function(b) {
                if (!b.classList.contains('collapsed')) allCollapsed = false;
            });
            bodies.forEach(function(b) {
                b.classList.toggle('collapsed', !allCollapsed);
            });
            document.querySelectorAll('.group-title').forEach(function(t) {
                t.classList.toggle('collapsed', !allCollapsed);
            });
            this.classList.toggle('collapsed');
            var icon = this.querySelector('i');
            var span = this.querySelector('span');
            if (allCollapsed) {
                icon.className = 'fas fa-chevron-down';
                span.textContent = i18n.t('mancal.collapse_all');
            } else {
                icon.className = 'fas fa-chevron-up';
                span.textContent = i18n.t('mancal.expand_all');
            }
        });
    }

    // ============ INIT ============
    function initializeApp() {
        setupTheme();
        try {
            if (typeof DB_MANCAIS === 'undefined') {
                throw new Error('DB_MANCAIS not found');
            }
            if (loader) loader.style.display = 'none';
            buildFilters(DB_MANCAIS);
            setupAutocomplete(DB_MANCAIS);
            setupClearButtons(DB_MANCAIS);
            setupEventListeners(DB_MANCAIS);
            showInitialMessage();
        } catch (err) {
            console.error(err);
            if (loader) loader.style.display = 'none';
            resultsContainer.innerHTML = '<div class="card error-message">' + i18n.t('mancal.error_load') + '</div>';
        }
    }

    initializeApp();
});
