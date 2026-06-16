document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const directSearchInput = document.getElementById('bearing-spec');
    const directSearchBtn = document.getElementById('direct-search-btn');
    const boreSearchInput = document.getElementById('bore-diameter-search');
    const outerSearchInput = document.getElementById('outer-diameter-search');
    const widthSearchInput = document.getElementById('width-search');
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const isoInput = document.getElementById('iso-spec-input');
    const isoCalculateBtn = document.getElementById('iso-calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDisplay = document.getElementById('result-display');
    const copyBtn = document.getElementById('copy-btn');
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const historyList = document.getElementById('history-list');
    const suggestionsBox = document.getElementById('suggestions-box');

    // --- 2. ESTADO DA APLICAÇÃO ---
    let rolamentosDB = [];
    let searchHistory = JSON.parse(localStorage.getItem('bearingSearchHistory')) || [];

    // --- 3. INICIALIZAÇÃO ---
    function init() {
        loadTheme();
        renderHistory();
        loadData(); // Não precisa mais de 'await'
        setupEventListeners();
    }

    // --- 4. FUNÇÕES DE DADOS (ATUALIZADA) ---
    function loadData() {
        try {
            showLoading('Carregando base de dados...');

            // Verifica diretamente se a variável do database.js existe e tem dados
            if (typeof rolamentosDB_data !== 'undefined' && rolamentosDB_data.length > 0) {
                // Atribui os dados à variável principal da aplicação
                rolamentosDB = rolamentosDB_data;
                // Exibe a mensagem de sucesso com a contagem correta
                showPlaceholder(`Base de dados com ${rolamentosDB.length} rolamentos. Pronto para consultar.`);
                console.log(`Sucesso: ${rolamentosDB.length} rolamentos carregados diretamente do database.js.`);
            } else {
                // Se a única fonte de dados falhar, exibe um erro crítico
                showError('Erro Crítico', 'Não foi possível carregar a base de dados. Verifique se o arquivo database.js está incluído e correto no seu HTML.');
                console.error('A variável "rolamentosDB_data" não foi encontrada ou está vazia.');
            }
        } catch (error) {
            // Captura de erros inesperados durante o processo
            showError('Erro Inesperado', 'Ocorreu um problema ao processar a base de dados.');
            console.error('Erro inesperado na função loadData:', error);
        }
    }

    // --- 5. FUNÇÕES DE LÓGICA PRINCIPAL ---
    function handleAutocomplete() {
        const query = directSearchInput.value.trim().toUpperCase();
        if (query.length < 1) {
            suggestionsBox.style.display = 'none';
            return;
        }
        const suggestions = rolamentosDB.filter(b => b.designacao.toUpperCase().startsWith(query)).slice(0, 10);
        suggestionsBox.innerHTML = '';
        if (suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.classList.add('suggestion-item');
                item.textContent = suggestion.designacao;
                item.addEventListener('click', () => {
                    directSearchInput.value = suggestion.designacao;
                    suggestionsBox.style.display = 'none';
                    handleDirectSearch();
                });
                suggestionsBox.appendChild(item);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    }

    function handleDirectSearch() {
        const spec = directSearchInput.value.trim().toUpperCase();
        suggestionsBox.style.display = 'none';
        if (!spec) {
            showWarning('Entrada Vazia', 'Por favor, digite uma designação.');
            return;
        }
        showLoading(`Buscando por "${spec}"...`);
        const results = rolamentosDB.filter(b => b.designacao.toUpperCase().startsWith(spec));
        if (results.length === 1) {
            displayBearingDetails(results[0]);
            addToHistory(results[0].designacao);
        } else if (results.length > 1) {
            displaySearchResults(results);
            addToHistory(spec);
        } else {
            showWarning(`Nenhum rolamento encontrado para '${spec}'.`, 'Tente a busca por medidas ou a calculadora de furo ISO.');
        }
    }

    function handleAdvancedSearch() {
        const d = parseFloat(boreSearchInput.value) || null;
        const D = parseFloat(outerSearchInput.value) || null;
        const B = parseFloat(widthSearchInput.value) || null;
        if (!d && !D && !B) {
            showWarning('Filtros Vazios', 'Preencha ao menos um campo para a busca por medidas.');
            return;
        }
        showLoading('Filtrando rolamentos...');
        const results = rolamentosDB.filter(b => {
            const match_d = !d || b.d === d;
            const match_D = !D || b.D === D;
            const match_B = !B || (b.B || b.T) === B;
            return match_d && match_D && match_B;
        });
        if (results.length > 0) {
            displaySearchResults(results);
        } else {
            showWarning('Nenhum Resultado', 'Nenhum rolamento encontrado com os critérios informados.');
        }
    }

    function handleISOCalculation() {
        const spec = isoInput.value.trim();
        if (!spec || spec.length < 2) {
            showWarning("Entrada Inválida", "Digite uma designação com pelo menos 2 caracteres.");
            return;
        }
        try {
            const codeStr = spec.slice(-2);
            const codeInt = parseInt(codeStr, 10);
            if (isNaN(codeInt)) throw new Error("Os dois últimos caracteres não são numéricos.");
            let result;
            if (codeInt === 0) result = "10 mm";
            else if (codeInt === 1) result = "12 mm";
            else if (codeInt === 2) result = "15 mm";
            else if (codeInt === 3) result = "17 mm";
            else if (codeInt >= 4 && codeInt <= 96) result = `${codeInt * 5} mm`;
            else {
                showWarning(`Código '${codeStr}' fora do padrão.`, "A calculadora cobre códigos de 00 a 96.");
                return;
            }
            displayInfo(`Furo ISO para '${spec}'`, result);
        } catch (e) {
            showError(`Erro ao calcular: ${e.message}`);
        }
    }

    // --- 6. FUNÇÕES DE UI / EXIBIÇÃO ---
    function showPlaceholder(message) { resultDisplay.innerHTML = `<div class="result-placeholder"><i class="fa-solid fa-magnifying-glass"></i><p>${message}</p></div>`; copyBtn.style.display = 'none'; }
    function showLoading(message) { resultDisplay.innerHTML = `<div class="result-placeholder"><i class="fa-solid fa-spinner fa-spin"></i><p>${message}</p></div>`; copyBtn.style.display = 'none'; }
    function displayMessage(type, title, message) {
        const iconMap = { warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark', info: 'fa-circle-info' };
        resultDisplay.innerHTML = `<div class="result-item ${type}-item"><span class="label">${title}</span><span class="value" style="font-family: var(--fonte-principal); font-size: 1.1rem; font-weight: normal;">${message}</span></div>`;
        copyBtn.style.display = 'none';
    }
    function showWarning(title, message = 'Verifique os dados e tente novamente.') { displayMessage('warning', title, message); }
    function showError(title, message = 'Ocorreu um problema inesperado.') { displayMessage('error', title, message); }
    function displayInfo(title, message) { displayMessage('info', title, message); }

    function displayBearingDetails(data) {
        const larguraLabel = data.T ? 'Largura Total (T)' : 'Largura (B)';
        const larguraValue = data.T || data.B;
        let cargaDinamicaLabel = 'Carga Radial Din. (C)';
        let cargaEstaticaLabel = 'Carga Radial Est. (C0)';
        if (data.tipo && data.tipo.toLowerCase().includes('axial')) { cargaDinamicaLabel = 'Carga Axial Din. (C)'; cargaEstaticaLabel = 'Carga Axial Est. (C0)'; }
        const formatValue = (value) => value ? value.toLocaleString('pt-BR') : '-';
        const gridItems = [
            { label: 'Furo (d)', value: `${data.d} mm` }, { label: 'Externo (D)', value: `${data.D} mm` },
            { label: larguraLabel, value: `${larguraValue} mm` }, { label: 'Massa', value: data.massa ? `${data.massa} kg` : '-' },
            { label: cargaDinamicaLabel, value: `${formatValue(data.C)} N` }, { label: cargaEstaticaLabel, value: `${formatValue(data.C0)} N` },
            { label: 'RPM (Graxa)', value: formatValue(data.rpm_graxa) }, { label: 'RPM (Óleo)', value: formatValue(data.rpm_oleo) },
        ];
        const gridItemsHTML = gridItems.map(item => `<div class="result-item"><span class="label">${item.label}</span><span class="value">${item.value || '-'}</span></div>`).join('');
        const notesHTML = data.notas ? `<div class="result-item notes-item"><span class="label">Observação</span><span class="value">${data.notas}</span></div>` : '';
        const finalHTML = `<div class="result-content"><div class="result-header"><span class="label">Designação</span><span class="designation-value" id="result-value">${data.designacao}</span><span class="type-value">${data.tipo || 'Tipo não especificado'}</span></div><div class="results-grid">${gridItemsHTML}${notesHTML}</div></div>`;
        resultDisplay.innerHTML = finalHTML;
        copyBtn.style.display = 'inline-flex';
    }

    function displaySearchResults(results) {
        resultDisplay.innerHTML = `<div class="result-item"><span class="label" style="font-family: 'Roboto', sans-serif;">${results.length} resultado(s) encontrado(s):</span></div><div class="table-container"><table><thead><tr><th>Designação</th><th>Tipo</th><th>d</th><th>D</th><th>B/T</th></tr></thead><tbody>${results.map(b => `<tr class="result-row" data-spec="${b.designacao}" title="Clique para ver detalhes de ${b.designacao}"><td><strong>${b.designacao}</strong></td><td>${b.tipo}</td><td>${b.d}</td><td>${b.D}</td><td>${b.T || b.B}</td></tr>`).join('')}</tbody></table></div>`;
        copyBtn.style.display = 'none';
    }

    // --- 7. FUNÇÕES AUXILIARES ---
    function clearAll() {
        directSearchInput.value = ''; boreSearchInput.value = ''; outerSearchInput.value = '';
        widthSearchInput.value = ''; isoInput.value = '';
        showPlaceholder('Aguardando sua consulta...');
        directSearchInput.focus();
    }
    function loadTheme() { if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-theme'); themeToggle.checked = true; } }
    function addToHistory(spec) { searchHistory = searchHistory.filter(item => item.toUpperCase() !== spec.toUpperCase()); searchHistory.unshift(spec); if (searchHistory.length > 10) { searchHistory.pop(); } localStorage.setItem('bearingSearchHistory', JSON.stringify(searchHistory)); renderHistory(); }
    function renderHistory() { if (searchHistory.length === 0) { historyList.innerHTML = '<li class="history-placeholder">Nenhuma busca recente.</li>'; return; } historyList.innerHTML = searchHistory.map(item => `<li data-spec="${item}" title="Buscar por ${item}">${item}</li>`).join(''); }

    // --- 8. EVENT LISTENERS ---
    function setupEventListeners() {
        directSearchBtn.addEventListener('click', handleDirectSearch);
        advancedSearchBtn.addEventListener('click', handleAdvancedSearch);
        isoCalculateBtn.addEventListener('click', handleISOCalculation);
        clearBtn.addEventListener('click', clearAll);
        directSearchInput.addEventListener('input', handleAutocomplete);
        directSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleDirectSearch(); });
        boreSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleAdvancedSearch(); });
        outerSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleAdvancedSearch(); });
        widthSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleAdvancedSearch(); });
        isoInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleISOCalculation(); });
        copyBtn.addEventListener('click', () => {
            const resultValue = document.getElementById('result-value')?.innerText;
            if (resultValue) {
                navigator.clipboard.writeText(resultValue).then(() => {
                    const originalIcon = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => { copyBtn.innerHTML = originalIcon; }, 1500);
                });
            }
        });
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        historyList.addEventListener('click', e => {
            if (e.target?.matches('li[data-spec]')) {
                directSearchInput.value = e.target.getAttribute('data-spec');
                handleDirectSearch();
            }
        });
        resultDisplay.addEventListener('click', e => {
            const row = e.target.closest('.result-row');
            if (row) {
                directSearchInput.value = row.dataset.spec;
                handleDirectSearch();
            }
        });
        document.addEventListener('click', e => {
            if (!e.target.closest('.autocomplete-container')) {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    init();
});
