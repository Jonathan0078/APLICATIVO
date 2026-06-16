document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const searchInput = document.getElementById('search-input');
    const shaftInput = document.getElementById('shaft-input'); // NOVO
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-container');
    const themeToggle = document.getElementById('theme-toggle');
    const loader = document.getElementById('loader'); // NOVO

    // --- FUNÇÃO DE UTILIDADE: DEBOUNCE ---
    function debounce(func, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    async function initializeApp() {
        setupTheme();
        try {
            const response = await fetch('database.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar a base de dados: ${response.statusText}`);
            }
            const DB_MANCAIS = await response.json();
            
            // Esconde o loader e mostra a mensagem inicial
            if(loader) loader.style.display = 'none';
            setupEventListeners(DB_MANCAIS);
            showInitialMessage();

        } catch (error) {
            console.error("Não foi possível carregar a base de dados:", error);
            if(loader) loader.style.display = 'none';
            showErrorMessage("Falha crítica: Não foi possível carregar a base de dados. Verifique o console para mais detalhes.");
        }
    }

    // --- LÓGICA DE BUSCA REFINADA ---
    function performSearch(DB_MANCAIS) {
        const searchTerm = searchInput.value.trim().toUpperCase();
        const shaftSize = shaftInput.value.trim();

        if (searchTerm === '' && shaftSize === '') {
            showInitialMessage();
            return;
        }

        let filteredKeys = Object.keys(DB_MANCAIS);

        // Filtro por designação
        if (searchTerm) {
            filteredKeys = filteredKeys.filter(key => key.toUpperCase().includes(searchTerm));
        }

        // Filtro por diâmetro do eixo
        if (shaftSize) {
            filteredKeys = filteredKeys.filter(key => {
                const mancal = DB_MANCAIS[key];
                // Verifica o eixo principal (para unidades de rolamento)
                if (mancal.eixo_mm && mancal.eixo_mm == shaftSize) {
                    return true;
                }
                // Verifica nos rolamentos compatíveis (para mancais bipartidos)
                if (mancal.rolamentos_compativeis) {
                    return mancal.rolamentos_compativeis.some(r => r.eixo == shaftSize);
                }
                return false;
            });
        }
        
        displayFilteredResults(filteredKeys);
    }

    // --- CONFIGURAÇÃO DOS EVENTOS ---
    function setupEventListeners(DB_MANCAIS) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        // Um único debounce para os dois campos de filtro
        const debouncedSearch = debounce(() => performSearch(DB_MANCAIS));
        searchInput.addEventListener('input', debouncedSearch);
        shaftInput.addEventListener('input', debouncedSearch);

        // Event listener com delegação para os botões de resultado e de cópia
        resultsContainer.addEventListener('click', async (event) => {
            const target = event.target;

            // Lógica para copiar texto
            if (target.classList.contains('copy-icon')) {
                const textToCopy = target.dataset.copy;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    const originalTitle = target.title;
                    target.title = "Copiado!";
                    setTimeout(() => { target.title = originalTitle; }, 2000);
                } catch (err) {
                    console.error('Falha ao copiar texto: ', err);
                    alert("Não foi possível copiar.");
                }
                return; // Impede que o clique no ícone propague para o botão
            }
            
            // Lógica para exibir detalhes do mancal
            if (target.classList.contains('result-item-button')) {
                const key = target.dataset.key;
                if (DB_MANCAIS[key]) {
                    displayMancalData(DB_MANCAIS[key]);
                    document.getElementById('results-card').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // --- FUNÇÕES DE EXIBIÇÃO ---
    function displayFilteredResults(keys) {
        resultsContainer.innerHTML = '';
        const title = document.createElement('h2');
        title.innerHTML = `<i class="fas fa-list-ul" aria-hidden="true"></i> Resultados da Busca`;
        resultsContainer.appendChild(title);

        if (keys.length === 0) {
            resultsContainer.innerHTML += `<p>Nenhum resultado encontrado para os filtros aplicados.</p>`;
            return;
        }
        
        const listContainer = document.createElement('div');
        listContainer.className = 'results-list';
        keys.forEach(key => {
            const button = document.createElement('button');
            button.className = 'result-item-button';
            button.textContent = key;
            button.dataset.key = key;
            listContainer.appendChild(button);
        });
        resultsContainer.appendChild(listContainer);
    }
    
    // FUNÇÃO ATUALIZADA PARA MOSTRAR ÍCONES DE CÓPIA
    function displayMancalData(mancal) {
        let eixoPrincipal = mancal.eixo_mm ? `${mancal.eixo_mm} mm` : (mancal.eixo_pol ? `${mancal.eixo_pol} (${mancal.eixo_mm} mm)` : 'N/A');
        
        let detailsHtml = `
            <h2>
                <i class="fas fa-info-circle" aria-hidden="true"></i> ${mancal.designacao_completa}
                <i class="fas fa-copy copy-icon" data-copy="${mancal.designacao_completa}" title="Copiar Designação Completa"></i>
            </h2>
            <p><strong>Tipo:</strong> ${mancal.tipo} | <strong>Eixo Padrão:</strong> ${eixoPrincipal}</p>`;

        if (mancal.rolamentos_compativeis) {
            const rolamentosRows = mancal.rolamentos_compativeis.map(r => `
                <tr>
                    <td>${r.tipo}</td>
                    <td>${r.rolamento} <i class="fas fa-copy copy-icon" data-copy="${r.rolamento}" title="Copiar Designação do Rolamento"></i></td>
                    <td>${r.bucha || 'N/A'}</td>
                    <td>${r.eixo} mm</td>
                </tr>`).join('');
            const vedacoesRows = mancal.vedacoes_compativeis.map(v => `<tr><td>${v}</td></tr>`).join('');
            detailsHtml += `
                <div class="table-container">
                    <table><thead><tr><th>Tipo de Rolamento</th><th>Designação</th><th>Bucha de Fixação</th><th>Ø Eixo</th></tr></thead><tbody>${rolamentosRows}</tbody></table>
                </div>
                <div class="table-container">
                    <table><thead><tr><th>Vedações Compatíveis</th></tr></thead><tbody>${vedacoesRows}</tbody></table>
                </div>`;
        }

        if (mancal.unidade_rolamento) {
            detailsHtml += `
                <div class="table-container">
                    <table><thead><tr><th>Componente</th><th>Designação</th></tr></thead><tbody>
                        <tr><td>Rolamento de Inserção</td><td>${mancal.unidade_rolamento.rolamento_inserido} <i class="fas fa-copy copy-icon" data-copy="${mancal.unidade_rolamento.rolamento_inserido}" title="Copiar Designação do Rolamento"></i></td></tr>
                        <tr><td>Método de Fixação</td><td>${mancal.unidade_rolamento.metodo_fixacao}</td></tr>
                    </tbody></table>
                </div>`;
        }
        
        if (mancal.notas_tecnicas) {
             detailsHtml += `<br><p><strong>Nota:</strong> ${mancal.notas_tecnicas}</p>`;
        }
        resultsContainer.innerHTML = detailsHtml;
    }

    function showInitialMessage() {
        resultsContainer.innerHTML = '<h2><i class="fas fa-hand-pointer" aria-hidden="true"></i> Bem-vindo!</h2><p>Use os filtros acima para encontrar as especificações do mancal que você precisa.</p>';
    }

    function showErrorMessage(message) {
        resultsContainer.innerHTML = `<div class="card error-message">${message}</div>`;
    }

    // --- LÓGICA DO TEMA ---
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

    // --- PONTO DE ENTRADA DA APLICAÇÃO ---
    initializeApp();
});
