// Dados das ferramentas de engenharia - VERSÃO PREMIUM APRIMORADA
const engineeringTools = [
    // Materiais
    { 
        id: 'tubo-aco-carbono', 
        name: 'Tubo Aço Carbono', 
        description: 'Especificações técnicas completas de tubos de aço carbono para aplicações industriais', 
        category: 'materiais', 
        icon: 'fas fa-pipe', 
        calculator: 'tuboAcoCarbono',
        tags: ['tubo', 'aço', 'carbono', 'industrial', 'especificações'],
        difficulty: 'básico',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'tubos-chapas-inox', 
        name: 'Tubos e Chapas de Inox', 
        description: 'Especificações detalhadas de materiais inoxidáveis com costura para construção', 
        category: 'materiais', 
        icon: 'fas fa-layer-group', 
        calculator: 'tubosChapasInox',
        tags: ['inox', 'tubos', 'chapas', 'costura', 'construção'],
        difficulty: 'intermediário',
        lastUpdated: '2025-01-13'
    },

    // Cálculos
    { 
        id: 'calculo-engrenagens', 
        name: 'Cálculo de Engrenagens', 
        description: 'Cálculos avançados para dimensionamento e análise de sistemas de engrenagens', 
        category: 'calculos', 
        icon: 'fas fa-cogs', 
        calculator: 'calculoEngrenagens',
        tags: ['engrenagens', 'dimensionamento', 'transmissão', 'mecânica'],
        difficulty: 'avançado',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'vazao', 
        name: 'Cálculo de Vazão', 
        description: 'Cálculos precisos de vazão em tubulações e sistemas hidráulicos', 
        category: 'calculos', 
        icon: 'fas fa-tint', 
        calculator: 'vazao',
        tags: ['vazão', 'tubulação', 'hidráulica', 'fluidos'],
        difficulty: 'intermediário',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'volume-cilindros', 
        name: 'Volume de Cilindros', 
        description: 'Cálculo preciso do volume de cilindros e recipientes cilíndricos', 
        category: 'calculos', 
        icon: 'fas fa-database', 
        calculator: 'volumeCilindros',
        tags: ['volume', 'cilindro', 'geometria', 'recipientes'],
        difficulty: 'básico',
        lastUpdated: '2025-01-13'
    },

    // Conversão
    { 
        id: 'converter-aco-construcao', 
        name: 'Converter Aço - Construção Civil', 
        description: 'Conversões completas para aço na construção civil com tabelas de referência', 
        category: 'conversao', 
        icon: 'fas fa-exchange-alt', 
        calculator: 'converterAcoConstrucao',
        tags: ['aço', 'construção', 'civil', 'conversão', 'bitola'],
        difficulty: 'intermediário',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'dimensionamento-construcao', 
        name: 'Dimensionamento - Construção Civil', 
        description: 'Cálculos de dimensionamento estrutural para construção civil', 
        category: 'conversao', 
        icon: 'fas fa-ruler-combined', 
        calculator: 'dimensionamentoConstrucao',
        tags: ['dimensionamento', 'estrutural', 'construção', 'NBR'],
        difficulty: 'avançado',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'unidades-volume-capacidade', 
        name: 'Unidades Volume e Capacidade', 
        description: 'Conversão precisa entre diferentes unidades de volume e capacidade', 
        category: 'conversao', 
        icon: 'fas fa-cube', 
        calculator: 'unidadesVolumeCapacidade',
        tags: ['volume', 'capacidade', 'unidades', 'conversão'],
        difficulty: 'básico',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'momentos-reacoes-apoios', 
        name: 'Momentos e Reações em Apoios', 
        description: 'Cálculo de momentos fletores e reações em apoios estruturais', 
        category: 'conversao', 
        icon: 'fas fa-balance-scale', 
        calculator: 'momentosReacoesApoios',
        tags: ['momentos', 'reações', 'apoios', 'estrutural'],
        difficulty: 'avançado',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'diametro-barras-cossinetes', 
        name: 'Diâmetro de Barras - Cossinetes', 
        description: 'Dimensões precisas para roscas externas e cossinetes', 
        category: 'conversao', 
        icon: 'fas fa-circle', 
        calculator: 'diametroBarrasCossinetes',
        tags: ['diâmetro', 'barras', 'cossinetes', 'roscas'],
        difficulty: 'intermediário',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'diametro-furo-rosca', 
        name: 'Diâmetro de Furo para Rosca', 
        description: 'Cálculo de furos para roscamento interno com precisão', 
        category: 'conversao', 
        icon: 'fas fa-circle-notch', 
        calculator: 'diametroFuroRosca',
        tags: ['furo', 'rosca', 'roscamento', 'interno'],
        difficulty: 'intermediário',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'conversao-polegadas-mm', 
        name: 'Conversão Polegadas/Milímetros', 
        description: 'Tabela completa de conversão entre polegadas e milímetros', 
        category: 'conversao', 
        icon: 'fas fa-ruler', 
        calculator: 'conversaoPolegadas',
        tags: ['polegadas', 'milímetros', 'conversão', 'medidas'],
        difficulty: 'básico',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'diametro-furos-macho', 
        name: 'Diâmetro de Furos para Macho', 
        description: 'Tabela completa de furos para roscas internas com machos', 
        category: 'conversao', 
        icon: 'fas fa-circle-notch', 
        calculator: 'furosMacho',
        tags: ['furos', 'macho', 'roscas', 'internas'],
        difficulty: 'intermediário',
        lastUpdated: '2025-01-13'
    },
    { 
        id: 'porcentagem', 
        name: 'Cálculos de Porcentagem', 
        description: 'Calculadora avançada de porcentagens para engenharia', 
        category: 'conversao', 
        icon: 'fas fa-percent', 
        calculator: 'porcentagem',
        tags: ['porcentagem', 'percentual', 'cálculos', 'matemática'],
        difficulty: 'básico',
        lastUpdated: '2025-01-13'
    }
];

// Estado da aplicação aprimorado
class AppState {
    constructor() {
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.currentView = 'grid';
        this.sortBy = 'name';
        this.favorites = this.loadFavorites();
        this.theme = this.loadTheme();
        this.filteredTools = [...engineeringTools];
        this.isLoading = false;
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('engineering-tools-favorites') || '[]');
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('engineering-tools-favorites', JSON.stringify(this.favorites));
    }

    loadTheme() {
        return localStorage.getItem('engineering-tools-theme') || 'light';
    }

    saveTheme() {
        localStorage.setItem('engineering-tools-theme', this.theme);
    }

    toggleFavorite(toolId) {
        const index = this.favorites.indexOf(toolId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(toolId);
        }
        this.saveFavorites();
        this.updateUI();
    }

    isFavorite(toolId) {
        return this.favorites.includes(toolId);
    }

    updateUI() {
        this.filterAndSortTools();
        this.renderTools();
        this.updateCategoryCounts();
        this.updateStats();
    }

    filterAndSortTools() {
        let filtered = [...engineeringTools];

        // Filtrar por categoria
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(tool => tool.category === this.currentCategory);
        }

        // Filtrar por busca
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(tool => 
                tool.name.toLowerCase().includes(searchLower) ||
                tool.description.toLowerCase().includes(searchLower) ||
                tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Ordenar
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'category':
                    return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
                case 'recent':
                    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
                default:
                    return 0;
            }
        });

        this.filteredTools = filtered;
    }

    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');
        const noResults = document.getElementById('noResults');

        if (this.filteredTools.length === 0) {
            toolsGrid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        toolsGrid.style.display = 'grid';
        noResults.style.display = 'none';

        // Aplicar classe de visualização
        toolsGrid.className = `tools-grid view-${this.currentView}`;

        toolsGrid.innerHTML = this.filteredTools.map((tool, index) => `
            <article class="tool-card" 
                     data-tool-id="${tool.id}" 
                     style="animation-delay: ${index * 0.1}s"
                     role="gridcell"
                     tabindex="0"
                     aria-label="${tool.name}">
                <div class="tool-card-header">
                    <div class="tool-icon">
                        <i class="${tool.icon}" aria-hidden="true"></i>
                    </div>
                    <div class="tool-actions">
                        <button class="tool-action-btn favorite-btn ${this.isFavorite(tool.id) ? 'active' : ''}" 
                                data-tool-id="${tool.id}"
                                title="${this.isFavorite(tool.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
                                aria-label="${this.isFavorite(tool.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                            <i class="${this.isFavorite(tool.id) ? 'fas fa-heart' : 'far fa-heart'}" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="tool-card-content">
                    <h3 class="tool-title">${tool.name}</h3>
                    <p class="tool-description">${tool.description}</p>
                    <div class="tool-meta">
                        <span class="tool-category">${this.getCategoryLabel(tool.category)}</span>
                        <span class="tool-difficulty difficulty-${tool.difficulty}">${this.getDifficultyLabel(tool.difficulty)}</span>
                    </div>
                    <div class="tool-tags">
                        ${tool.tags.slice(0, 3).map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="tool-card-footer">
                    <button class="tool-open-btn" data-tool-id="${tool.id}">
                        <i class="fas fa-calculator" aria-hidden="true"></i>
                        Abrir Ferramenta
                    </button>
                </div>
            </article>
        `).join('');

        // Adicionar event listeners
        this.addToolEventListeners();
    }

    getCategoryLabel(category) {
        const labels = {
            'materiais': 'Materiais',
            'calculos': 'Cálculos',
            'tabelas': 'Tabelas',
            'conversao': 'Conversão'
        };
        return labels[category] || category;
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            'básico': 'Básico',
            'intermediário': 'Intermediário',
            'avançado': 'Avançado'
        };
        return labels[difficulty] || difficulty;
    }

    addToolEventListeners() {
        // Event listeners para abrir ferramentas
        document.querySelectorAll('.tool-open-btn, .tool-card').forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.target.closest('.tool-action-btn')) return;
                
                const toolId = element.dataset.toolId || element.querySelector('[data-tool-id]')?.dataset.toolId;
                if (toolId) {
                    this.openTool(toolId);
                }
            });
        });

        // Event listeners para favoritos
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const toolId = btn.dataset.toolId;
                this.toggleFavorite(toolId);
                this.showToast(
                    this.isFavorite(toolId) ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!',
                    'success'
                );
            });
        });

        // Keyboard navigation
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    updateCategoryCounts() {
        const counts = {
            all: engineeringTools.length,
            materiais: 0,
            calculos: 0,
            tabelas: 0,
            conversao: 0
        };

        engineeringTools.forEach(tool => {
            if (counts.hasOwnProperty(tool.category)) {
                counts[tool.category]++;
            }
        });

        Object.keys(counts).forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = counts[category];
            }
        });
    }

    updateStats() {
        const toolCount = engineeringTools.length;
        document.getElementById('toolCount').textContent = toolCount;
        document.getElementById('footerToolCount').textContent = toolCount;
    }

    openTool(toolId) {
        const tool = engineeringTools.find(t => t.id === toolId);
        if (!tool) return;

        const modal = document.getElementById('toolModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalCategory = document.getElementById('modalCategory');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = tool.name;
        modalCategory.textContent = this.getCategoryLabel(tool.category);
        modalContent.innerHTML = this.getCalculatorContent(tool.calculator);

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Focus management
        modal.focus();
    }

    closeModal() {
        const modal = document.getElementById('toolModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    getCalculatorContent(calculatorType) {
        if (calculators[calculatorType]) {
            return calculators[calculatorType]();
        }
        return '<p>Calculadora em desenvolvimento...</p>';
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle" aria-hidden="true"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" aria-label="Fechar notificação">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.remove();
        }, 5000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.saveTheme();
        
        const themeIcon = document.querySelector('#toggleTheme i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    }
}

// Instância global do estado da aplicação
const appState = new AppState();

// Calculadoras (mantendo as existentes e adicionando melhorias)
const calculators = {
    tuboAcoCarbono: function() {
        return `
            <div class="calculator-header">
                <h3><i class="fas fa-pipe"></i> Especificações - Tubo Aço Carbono</h3>
                <p>Consulte as especificações técnicas de tubos de aço carbono para aplicações industriais.</p>
            </div>
            <div class="calculator-content">
                <div class="info-section">
                    <h4><i class="fas fa-table" aria-hidden="true"></i> Tabela de Especificações</h4>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Diâmetro Nominal</th>
                                    <th>Diâmetro Externo (mm)</th>
                                    <th>Espessura (mm)</th>
                                    <th>Peso (kg/m)</th>
                                    <th>Aplicação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>1/2"</td><td>21.3</td><td>2.77</td><td>1.27</td><td>Residencial</td></tr>
                                <tr><td>3/4"</td><td>26.9</td><td>2.87</td><td>1.69</td><td>Residencial</td></tr>
                                <tr><td>1"</td><td>33.7</td><td>3.38</td><td>2.50</td><td>Comercial</td></tr>
                                <tr><td>1 1/4"</td><td>42.4</td><td>3.56</td><td>3.39</td><td>Comercial</td></tr>
                                <tr><td>1 1/2"</td><td>48.3</td><td>3.68</td><td>4.05</td><td>Industrial</td></tr>
                                <tr><td>2"</td><td>60.3</td><td>3.91</td><td>5.44</td><td>Industrial</td></tr>
                                <tr><td>2 1/2"</td><td>73.0</td><td>5.16</td><td>8.63</td><td>Industrial</td></tr>
                                <tr><td>3"</td><td>88.9</td><td>5.49</td><td>11.29</td><td>Industrial</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="calculator-section">
                    <h4><i class="fas fa-calculator" aria-hidden="true"></i> Calculadora de Peso</h4>
                    <div class="input-group">
                        <label for="diametro-nominal">Diâmetro Nominal:</label>
                        <select id="diametro-nominal">
                            <option value="21.3,2.77">1/2" (21.3mm)</option>
                            <option value="26.9,2.87">3/4" (26.9mm)</option>
                            <option value="33.7,3.38">1" (33.7mm)</option>
                            <option value="42.4,3.56">1 1/4" (42.4mm)</option>
                            <option value="48.3,3.68">1 1/2" (48.3mm)</option>
                            <option value="60.3,3.91">2" (60.3mm)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="comprimento-tubo">Comprimento (m):</label>
                        <input type="number" id="comprimento-tubo" placeholder="Ex: 6" step="0.1" min="0.1">
                    </div>
                    <button onclick="calcularPesoTubo()" class="calc-btn">
                        <i class="fas fa-calculator" aria-hidden="true"></i>
                        Calcular Peso
                    </button>
                    <div id="resultado-peso-tubo" class="result"></div>
                </div>
            </div>
        `;
    },

    calculoEngrenagens: function() {
        return `
            <div class="calculator-header">
                <h3><i class="fas fa-cogs"></i> Cálculo de Engrenagens</h3>
                <p>Calcule parâmetros essenciais para dimensionamento de sistemas de engrenagens.</p>
            </div>
            <div class="calculator-content">
                <div class="calculator-section">
                    <h4><i class="fas fa-cogs" aria-hidden="true"></i> Parâmetros das Engrenagens</h4>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="dentes-1">Número de Dentes (Z1):</label>
                            <input type="number" id="dentes-1" placeholder="Ex: 20" min="1">
                        </div>
                        <div class="input-group">
                            <label for="dentes-2">Número de Dentes (Z2):</label>
                            <input type="number" id="dentes-2" placeholder="Ex: 40" min="1">
                        </div>
                    </div>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="modulo">Módulo (m):</label>
                            <input type="number" id="modulo" step="0.1" placeholder="Ex: 2.5" min="0.1">
                        </div>
                        <div class="input-group">
                            <label for="rpm-motor">RPM Motor:</label>
                            <input type="number" id="rpm-motor" placeholder="Ex: 1800" min="1">
                        </div>
                    </div>
                    <button onclick="calcularEngrenagens()" class="calc-btn">
                        <i class="fas fa-calculator" aria-hidden="true"></i>
                        Calcular Sistema
                    </button>
                    <div id="resultado-engrenagens" class="result"></div>
                </div>
                <div class="info-section">
                    <h4><i class="fas fa-info-circle" aria-hidden="true"></i> Fórmulas Utilizadas</h4>
                    <div class="formula-list">
                        <div class="formula-item">
                            <strong>Relação de Transmissão:</strong> i = Z2 / Z1
                        </div>
                        <div class="formula-item">
                            <strong>Diâmetro Primitivo:</strong> d = m × Z
                        </div>
                        <div class="formula-item">
                            <strong>RPM Saída:</strong> RPM2 = RPM1 / i
                        </div>
                        <div class="formula-item">
                            <strong>Distância entre Centros:</strong> a = (d1 + d2) / 2
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    vazao: function() {
        return `
            <div class="calculator-header">
                <h3><i class="fas fa-tint"></i> Cálculo de Vazão</h3>
                <p>Calcule a vazão em tubulações e sistemas hidráulicos com precisão.</p>
            </div>
            <div class="calculator-content">
                <div class="calculator-section">
                    <h4><i class="fas fa-tint" aria-hidden="true"></i> Parâmetros da Tubulação</h4>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="diametro-tubo">Diâmetro do Tubo (mm):</label>
                            <input type="number" id="diametro-tubo" placeholder="Ex: 100" min="1">
                        </div>
                        <div class="input-group">
                            <label for="velocidade-fluido">Velocidade do Fluido (m/s):</label>
                            <input type="number" id="velocidade-fluido" step="0.1" placeholder="Ex: 2.5" min="0.1">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="tipo-fluido">Tipo de Fluido:</label>
                        <select id="tipo-fluido">
                            <option value="agua">Água</option>
                            <option value="oleo">Óleo</option>
                            <option value="ar">Ar</option>
                            <option value="vapor">Vapor</option>
                        </select>
                    </div>
                    <button onclick="calcularVazao()" class="calc-btn">
                        <i class="fas fa-calculator" aria-hidden="true"></i>
                        Calcular Vazão
                    </button>
                    <div id="resultado-vazao" class="result"></div>
                </div>
                <div class="info-section">
                    <h4><i class="fas fa-chart-line" aria-hidden="true"></i> Velocidades Recomendadas</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Tipo de Fluido</th>
                                <th>Velocidade Mín. (m/s)</th>
                                <th>Velocidade Máx. (m/s)</th>
                                <th>Aplicação</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Água - Sucção</td><td>0.6</td><td>1.5</td><td>Bombas</td></tr>
                            <tr><td>Água - Recalque</td><td>1.0</td><td>3.0</td><td>Tubulações</td></tr>
                            <tr><td>Óleo Hidráulico</td><td>1.0</td><td>5.0</td><td>Sistemas</td></tr>
                            <tr><td>Ar Comprimido</td><td>5.0</td><td>20.0</td><td>Pneumática</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // Adicionar outras calculadoras aqui...
    volumeCilindros: function() {
        return `
            <div class="calculator-header">
                <h3><i class="fas fa-database"></i> Volume de Cilindros</h3>
                <p>Calcule o volume de cilindros e recipientes cilíndricos com precisão.</p>
            </div>
            <div class="calculator-content">
                <div class="calculator-section">
                    <h4><i class="fas fa-database" aria-hidden="true"></i> Dimensões do Cilindro</h4>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="diametro-cilindro">Diâmetro (mm):</label>
                            <input type="number" id="diametro-cilindro" placeholder="Ex: 500" min="1">
                        </div>
                        <div class="input-group">
                            <label for="altura-cilindro">Altura (mm):</label>
                            <input type="number" id="altura-cilindro" placeholder="Ex: 1000" min="1">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="unidade-resultado">Unidade do Resultado:</label>
                        <select id="unidade-resultado">
                            <option value="mm3">mm³</option>
                            <option value="cm3">cm³</option>
                            <option value="m3">m³</option>
                            <option value="litros">Litros</option>
                        </select>
                    </div>
                    <button onclick="calcularVolumeCilindro()" class="calc-btn">
                        <i class="fas fa-calculator" aria-hidden="true"></i>
                        Calcular Volume
                    </button>
                    <div id="resultado-volume-cilindro" class="result"></div>
                </div>
            </div>
        `;
    }
};

// Funções de cálculo aprimoradas
function calcularPesoTubo() {
    const diametroData = document.getElementById('diametro-nominal').value.split(',');
    const comprimento = parseFloat(document.getElementById('comprimento-tubo').value);
    const resultado = document.getElementById('resultado-peso-tubo');

    if (!comprimento || comprimento <= 0) {
        resultado.innerHTML = '<div class="error">Por favor, insira um comprimento válido.</div>';
        return;
    }

    const diametroExterno = parseFloat(diametroData[0]);
    const espessura = parseFloat(diametroData[1]);
    const pesoUnitario = ((Math.PI * (diametroExterno - espessura) * espessura * 7.85) / 1000);
    const pesoTotal = pesoUnitario * comprimento;

    resultado.innerHTML = `
        <div class="result-success">
            <h4><i class="fas fa-check-circle" aria-hidden="true"></i> Resultado do Cálculo</h4>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Peso Unitário:</span>
                    <span class="result-value">${pesoUnitario.toFixed(2)} kg/m</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Peso Total:</span>
                    <span class="result-value">${pesoTotal.toFixed(2)} kg</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Comprimento:</span>
                    <span class="result-value">${comprimento} m</span>
                </div>
            </div>
        </div>
    `;
}

function calcularEngrenagens() {
    const z1 = parseInt(document.getElementById('dentes-1').value);
    const z2 = parseInt(document.getElementById('dentes-2').value);
    const modulo = parseFloat(document.getElementById('modulo').value);
    const rpm1 = parseInt(document.getElementById('rpm-motor').value);
    const resultado = document.getElementById('resultado-engrenagens');

    if (!z1 || !z2 || !modulo || !rpm1) {
        resultado.innerHTML = '<div class="error">Por favor, preencha todos os campos.</div>';
        return;
    }

    const relacaoTransmissao = z2 / z1;
    const diametroPrimitivo1 = modulo * z1;
    const diametroPrimitivo2 = modulo * z2;
    const rpm2 = rpm1 / relacaoTransmissao;
    const distanciaCentros = (diametroPrimitivo1 + diametroPrimitivo2) / 2;

    resultado.innerHTML = `
        <div class="result-success">
            <h4><i class="fas fa-check-circle" aria-hidden="true"></i> Resultados do Sistema</h4>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Relação de Transmissão:</span>
                    <span class="result-value">${relacaoTransmissao.toFixed(3)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Diâmetro Primitivo 1:</span>
                    <span class="result-value">${diametroPrimitivo1.toFixed(2)} mm</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Diâmetro Primitivo 2:</span>
                    <span class="result-value">${diametroPrimitivo2.toFixed(2)} mm</span>
                </div>
                <div class="result-item">
                    <span class="result-label">RPM Saída:</span>
                    <span class="result-value">${rpm2.toFixed(1)} rpm</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Distância entre Centros:</span>
                    <span class="result-value">${distanciaCentros.toFixed(2)} mm</span>
                </div>
            </div>
        </div>
    `;
}

function calcularVazao() {
    const diametro = parseFloat(document.getElementById('diametro-tubo').value);
    const velocidade = parseFloat(document.getElementById('velocidade-fluido').value);
    const tipoFluido = document.getElementById('tipo-fluido').value;
    const resultado = document.getElementById('resultado-vazao');

    if (!diametro || !velocidade) {
        resultado.innerHTML = '<div class="error">Por favor, preencha todos os campos.</div>';
        return;
    }

    const raio = diametro / 2000; // Converter mm para m
    const area = Math.PI * Math.pow(raio, 2);
    const vazaoM3s = area * velocidade;
    const vazaoLs = vazaoM3s * 1000;
    const vazaoM3h = vazaoM3s * 3600;

    const densidades = {
        agua: 1000,
        oleo: 850,
        ar: 1.225,
        vapor: 0.6
    };

    const densidade = densidades[tipoFluido] || 1000;
    const vazaoMassica = vazaoM3s * densidade;

    resultado.innerHTML = `
        <div class="result-success">
            <h4><i class="fas fa-check-circle" aria-hidden="true"></i> Resultados da Vazão</h4>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Área da Seção:</span>
                    <span class="result-value">${(area * 10000).toFixed(4)} cm²</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Vazão Volumétrica:</span>
                    <span class="result-value">${vazaoLs.toFixed(2)} L/s</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Vazão Volumétrica:</span>
                    <span class="result-value">${vazaoM3h.toFixed(2)} m³/h</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Vazão Mássica:</span>
                    <span class="result-value">${vazaoMassica.toFixed(2)} kg/s</span>
                </div>
            </div>
        </div>
    `;
}

function calcularVolumeCilindro() {
    const diametro = parseFloat(document.getElementById('diametro-cilindro').value);
    const altura = parseFloat(document.getElementById('altura-cilindro').value);
    const unidade = document.getElementById('unidade-resultado').value;
    const resultado = document.getElementById('resultado-volume-cilindro');

    if (!diametro || !altura) {
        resultado.innerHTML = '<div class="error">Por favor, preencha todos os campos.</div>';
        return;
    }

    const raio = diametro / 2;
    const volumeMm3 = Math.PI * Math.pow(raio, 2) * altura;

    let volumeConvertido, unidadeLabel;
    
    switch (unidade) {
        case 'mm3':
            volumeConvertido = volumeMm3;
            unidadeLabel = 'mm³';
            break;
        case 'cm3':
            volumeConvertido = volumeMm3 / 1000;
            unidadeLabel = 'cm³';
            break;
        case 'm3':
            volumeConvertido = volumeMm3 / 1000000000;
            unidadeLabel = 'm³';
            break;
        case 'litros':
            volumeConvertido = volumeMm3 / 1000000;
            unidadeLabel = 'L';
            break;
        default:
            volumeConvertido = volumeMm3;
            unidadeLabel = 'mm³';
    }

    resultado.innerHTML = `
        <div class="result-success">
            <h4><i class="fas fa-check-circle" aria-hidden="true"></i> Resultado do Volume</h4>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Volume:</span>
                    <span class="result-value">${volumeConvertido.toFixed(6)} ${unidadeLabel}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Área da Base:</span>
                    <span class="result-value">${(Math.PI * Math.pow(raio, 2)).toFixed(2)} mm²</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Perímetro:</span>
                    <span class="result-value">${(2 * Math.PI * raio).toFixed(2)} mm</span>
                </div>
            </div>
        </div>
    `;
}

// Event Listeners e Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Remover loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1500);

    // Inicializar tema
    appState.setTheme(appState.theme);

    // Event listeners principais
    setupEventListeners();

    // Inicializar UI
    appState.updateUI();

    // Adicionar animações de entrada
    document.body.classList.add('loaded');
});

function setupEventListeners() {
    // Busca
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');

    searchInput.addEventListener('input', debounce((e) => {
        appState.searchTerm = e.target.value;
        appState.updateUI();
    }, 300));

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        appState.searchTerm = '';
        appState.updateUI();
        searchInput.focus();
    });

    // Categorias
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            appState.currentCategory = btn.dataset.category;
            appState.updateUI();
        });
    });

    // Tema
    document.getElementById('toggleTheme').addEventListener('click', () => {
        appState.toggleTheme();
    });

    // Modal
    document.getElementById('closeModal').addEventListener('click', () => {
        appState.closeModal();
    });

    document.getElementById('modalBackdrop').addEventListener('click', () => {
        appState.closeModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            appState.closeModal();
        }
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            appState.currentView = btn.dataset.view;
            appState.updateUI();
        });
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        appState.sortBy = e.target.value;
        appState.updateUI();
    });

    // Reset filters
    document.getElementById('resetFilters').addEventListener('click', () => {
        searchInput.value = '';
        appState.searchTerm = '';
        appState.currentCategory = 'all';
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        document.querySelector('[data-category="all"]').classList.add('active');
        document.querySelector('[data-category="all"]').setAttribute('aria-pressed', 'true');
        
        appState.updateUI();
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adicionar estilos para loading screen e outras melhorias
const additionalStyles = `
<style>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.3s ease;
}

.loading-content {
    text-align: center;
    color: white;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

.premium-badge {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #1a202c;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-left: 1rem;
}

.stats-display {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.stat-item {
    text-align: center;
    background: rgba(255,255,255,0.1);
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    backdrop-filter: blur(10px);
}

.stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fbbf24;
}

.stat-label {
    font-size: 0.8rem;
    opacity: 0.9;
}

.category-count {
    background: rgba(255,255,255,0.2);
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

.tools-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.tools-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--cor-primaria);
}

.tools-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.view-toggle {
    display: flex;
    background: var(--card-bg);
    border-radius: 0.5rem;
    padding: 0.25rem;
    box-shadow: var(--shadow-sm);
}

.view-btn {
    padding: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s;
}

.view-btn.active {
    background: var(--cor-secundaria);
    color: white;
}

.sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: var(--card-bg);
    color: var(--cor-texto);
}

.tool-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.tool-actions {
    display: flex;
    gap: 0.5rem;
}

.tool-action-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    background: var(--cor-fundo);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tool-action-btn:hover {
    background: var(--cor-secundaria);
    color: white;
}

.tool-action-btn.active {
    background: var(--cor-perigo);
    color: white;
}

.tool-meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tool-difficulty {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.difficulty-básico {
    background: #dcfce7;
    color: #166534;
}

.difficulty-intermediário {
    background: #fef3c7;
    color: #92400e;
}

.difficulty-avançado {
    background: #fee2e2;
    color: #991b1b;
}

.tool-tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.tool-tag {
    background: var(--cor-fundo);
    color: var(--cor-texto-secundario);
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
}

.tool-card-footer {
    margin-top: auto;
}

.tool-open-btn {
    width: 100%;
    padding: 0.75rem;
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.tool-open-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
}

.toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.toast {
    background: var(--card-bg);
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
}

.toast-success {
    border-left: 4px solid var(--cor-sucesso);
}

.toast-error {
    border-left: 4px solid var(--cor-perigo);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.toast-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background 0.2s;
}

.toast-close:hover {
    background: var(--cor-fundo);
}

@media (max-width: 768px) {
    .tools-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .tools-controls {
        justify-content: space-between;
    }
    
    .stats-display {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .stat-item {
        padding: 0.5rem;
    }
    
    .toast {
        min-width: auto;
        width: calc(100vw - 2rem);
    }
}
</style>
`;

// Adicionar estilos ao head
document.head.insertAdjacentHTML('beforeend', additionalStyles);
