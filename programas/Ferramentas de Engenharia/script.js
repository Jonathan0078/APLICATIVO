// Dados das ferramentas de engenharia - VERSÃO ATUALIZADA COM TODAS AS FERRAMENTAS IMPLEMENTADAS
const engineeringTools = [
    // Materiais
    { id: 'tubo-aco-carbono', name: 'Tubo Aço Carbono', description: 'Especificações de tubos de aço carbono', category: 'materiais', icon: 'fas fa-pipe', calculator: 'tuboAcoCarbono' },
    { id: 'tubos-chapas-inox', name: 'Tubos e Chapas de Inox (com Costura)', description: 'Especificações de materiais inoxidáveis com costura', category: 'materiais', icon: 'fas fa-layer-group', calculator: 'tubosChapasInox' },

    // Cálculos
    { id: 'calculo-engrenagens', name: 'Cálculo de Engrenagens', description: 'Cálculos para dimensionamento de engrenagens', category: 'calculos', icon: 'fas fa-cogs', calculator: 'calculoEngrenagens' },
    { id: 'vazao', name: 'Cálculo de Vazão', description: 'Cálculos de vazão em tubulações', category: 'calculos', icon: 'fas fa-tint', calculator: 'vazao' },
    { id: 'volume-cilindros', name: 'Volume de Cilindros', description: 'Cálculo do volume de cilindros', category: 'calculos', icon: 'fas fa-database', calculator: 'volumeCilindros' },

    // Novas calculadoras implementadas (pendentes)
    { id: 'dimensionamento-eixos', name: 'Dimensionamento de Eixos', description: 'Dimensionamento de eixos por torque (diâmetro)', category: 'calculos', icon: 'fas fa-cogs', calculator: 'dimensionamentoEixos' },
    { id: 'espessura-parede-tubo', name: 'Espessura de Parede do Tubo', description: 'Cálculo da espessura mínima para pressão interna (tubo)', category: 'tabelas', icon: 'fas fa-circle-notch', calculator: 'espessuraParedeTubo' },
    { id: 'pressao-critica-sapata', name: 'Pressão Crítica da Sapata', description: 'Cálculo simples da pressão de contato da sapata (q = P / A)', category: 'calculos', icon: 'fas fa-compress-arrows-alt', calculator: 'pressaoCriticaSapata' },
    { id: 'atrito', name: 'Atrito', description: 'Cálculo de força de atrito a partir de μ e N', category: 'calculos', icon: 'fas fa-sliders-h', calculator: 'atrito' },
    { id: 'calculo-escada', name: 'Cálculo de Escada', description: 'Número de degraus e medidas recomendadas (espelho/piso)', category: 'calculos', icon: 'fas fa-stream', calculator: 'calculoEscada' },

    // Conversão - FERRAMENTAS AGORA IMPLEMENTADAS
    { id: 'converter-aco-construcao', name: 'Converter Aço - Construção Civil', description: 'Conversões para aço na construção civil', category: 'conversao', icon: 'fas fa-exchange-alt', calculator: 'converterAcoConstrucao' },
    { id: 'dimensionamento-construcao', name: 'Dimensionamento - Construção Civil', description: 'Cálculos de dimensionamento para construção', category: 'conversao', icon: 'fas fa-ruler-combined', calculator: 'dimensionamentoConstrucao' },
    { id: 'unidades-volume-capacidade', name: 'Unidades Volume e Capacidade', description: 'Conversão de unidades de volume', category: 'conversao', icon: 'fas fa-cube', calculator: 'unidadesVolumeCapacidade' },
    { id: 'momentos-reacoes-apoios', name: 'Momentos e Reações em Apoios', description: 'Cálculo de momentos e reações', category: 'conversao', icon: 'fas fa-balance-scale', calculator: 'momentosReacoesApoios' },
    { id: 'diametro-barras-cossinetes', name: 'Diâmetro de Barras - Cossinetes', description: 'Dimensões para roscas externas', category: 'conversao', icon: 'fas fa-circle', calculator: 'diametroBarrasCossinetes' },
    { id: 'diametro-furo-rosca', name: 'Diâmetro de Furo para Rosca', description: 'Furos para roscamento', category: 'conversao', icon: 'fas fa-circle-notch', calculator: 'diametroFuroRosca' },
    
    { id: 'conversao-polegadas-mm', name: 'Conversão Polegadas/Milímetros', description: 'Tabela de conversão polegadas para mm', category: 'conversao', icon: 'fas fa-ruler', calculator: 'conversaoPolegadas' },
    { id: 'diametro-furos-macho', name: 'Diâmetro de Furos para Macho', description: 'Tabela de furos para roscas internas', category: 'conversao', icon: 'fas fa-circle-notch', calculator: 'furosMacho' },
    { id: 'porcentagem', name: 'Cálculos de Porcentagem', description: 'Calculadora de porcentagens', category: 'conversao', icon: 'fas fa-percent', calculator: 'porcentagem' }
];

// Estado da aplicação
let currentCategory = 'all';
let searchTerm = '';

// Elementos DOM
const toolsGrid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const categoryBtns = document.querySelectorAll('.category-btn');
const modal = document.getElementById('toolModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');
const noResults = document.getElementById('noResults');

// Funções das calculadoras específicas
const calculators = {
    // Calculadoras existentes
    tuboAcoCarbono: function() {
        return `
            <h3>Tubo Aço Carbono</h3>
            <p>Especificações técnicas de tubos de aço carbono para aplicações industriais.</p>
            <div class="info-section">
                <h4>Especificações Padrão</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Diâmetro Nominal</th>
                            <th>Diâmetro Externo (mm)</th>
                            <th>Espessura (mm)</th>
                            <th>Peso (kg/m)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1/2"</td><td>21.3</td><td>2.77</td><td>1.27</td></tr>
                        <tr><td>3/4"</td><td>26.9</td><td>2.87</td><td>1.69</td></tr>
                        <tr><td>1"</td><td>33.7</td><td>3.38</td><td>2.50</td></tr>
                        <tr><td>1 1/4"</td><td>42.4</td><td>3.56</td><td>3.39</td></tr>
                        <tr><td>1 1/2"</td><td>48.3</td><td>3.68</td><td>4.05</td></tr>
                        <tr><td>2"</td><td>60.3</td><td>3.91</td><td>5.44</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },
    tubosChapasInox: function() {
        return `
            <h3>Tubos e Chapas de Inox (com Costura)</h3>
            <p>Calculadora rápida de massa para chapas e tubos inox. Selecione a liga para densidade automática.</p>
            <div class="input-group">
                <label>Tipo de Liga:</label>
                <select id="liga-inox">
                    <option value="AISI304">AISI 304 (ρ=7900 kg/m³)</option>
                    <option value="AISI316">AISI 316 (ρ=8000 kg/m³)</option>
                    <option value="AISI430">AISI 430 (ρ=7700 kg/m³)</option>
                    <option value="custom">Personalizada</option>
                </select>
            </div>
            <div class="input-group">
                <label>Tipo:</label>
                <select id="tipo-inox">
                    <option value="chapa">Chapa (placa)</option>
                    <option value="tubo">Tubo (parede)</option>
                </select>
            </div>

            <div id="chapa-inputs">
                <div class="input-group">
                    <label>Largura (mm):</label>
                    <input type="number" id="largura-chapa" step="any" placeholder="Ex: 1000">
                </div>
                <div class="input-group">
                    <label>Comprimento (mm):</label>
                    <input type="number" id="comprimento-chapa" step="any" placeholder="Ex: 2000">
                </div>
                <div class="input-group">
                    <label>Espessura (mm):</label>
                    <input type="number" id="espessura-chapa" step="any" placeholder="Ex: 2">
                </div>
            </div>

            <div id="tubo-inputs" style="display:none;">
                <div class="input-group">
                    <label>Diâmetro Externo (mm):</label>
                    <input type="number" id="diametro-externo-inox" step="any" placeholder="Ex: 114.3">
                </div>
                <div class="input-group">
                    <label>Espessura da Parede (mm):</label>
                    <input type="number" id="espessura-tubo-inox" step="any" placeholder="Ex: 2.77">
                </div>
                <div class="input-group">
                    <label>Comprimento (m):</label>
                    <input type="number" id="comprimento-tubo-inox" step="any" placeholder="Ex: 6">
                </div>
            </div>

            <div class="input-group" id="densidade-wrapper">
                <label>Densidade (kg/m³):</label>
                <input type="number" id="densidade-inox" step="any" placeholder="8000" value="8000">
            </div>

            <div class="input-group">
                <button id="show-tables-btn" class="calc-btn">Exibir Tabelas Comerciais</button>
            </div>
            <div id="tabelas-comerciais" style="display:none; margin-top:10px;"></div>

            <button class="calc-btn" onclick="calcularTubosChapasInox()">Calcular Massa</button>
            <div id="resultado-inox" class="result"></div>

            <script>
                // comportamento simples para mostrar/ocultar inputs e ligar densidade
                (function(){
                    const tipo = document.getElementById('tipo-inox');
                    const chapaInputs = document.getElementById('chapa-inputs');
                    const tuboInputs = document.getElementById('tubo-inputs');
                    const liga = document.getElementById('liga-inox');
                    const densidade = document.getElementById('densidade-inox');
                    const densidadeWrapper = document.getElementById('densidade-wrapper');
                    const showTablesBtn = document.getElementById('show-tables-btn');
                    const tabelas = document.getElementById('tabelas-comerciais');

                    const densidades = { AISI304: 7900, AISI316: 8000, AISI430: 7700 };

                    tipo.addEventListener('change', () => {
                        if (tipo.value === 'chapa') { chapaInputs.style.display = ''; tuboInputs.style.display = 'none'; }
                        else { chapaInputs.style.display = 'none'; tuboInputs.style.display = ''; }
                    });

                    liga.addEventListener('change', () => {
                        if (liga.value === 'custom') { densidadeWrapper.style.display = ''; }
                        else { densidadeWrapper.style.display = ''; densidade.value = densidades[liga.value]; }
                    });

                    showTablesBtn.addEventListener('click', () => {
                        if (tabelas.style.display === 'none') {
                            tabelas.style.display = '';
                            tabelas.innerHTML = window.renderTabelasInox();
                            showTablesBtn.textContent = 'Ocultar Tabelas Comerciais';
                        } else {
                            tabelas.style.display = 'none';
                            showTablesBtn.textContent = 'Exibir Tabelas Comerciais';
                        }
                    });
                })();
            </script>
        `;
    },

    calculoEngrenagens: function() {
        return `
            <h3>Cálculo de Engrenagens</h3>
            <div class="input-group">
                <label>Número de Dentes (Z1):</label>
                <input type="number" id="dentes-1" placeholder="Ex: 20">
            </div>
            <div class="input-group">
                <label>Número de Dentes (Z2):</label>
                <input type="number" id="dentes-2" placeholder="Ex: 40">
            </div>
            <div class="input-group">
                <label>Módulo (m):</label>
                <input type="number" id="modulo" step="0.1" placeholder="Ex: 2.5">
            </div>
            <div class="input-group">
                <label>RPM Motor:</label>
                <input type="number" id="rpm-motor" placeholder="Ex: 1800">
            </div>
            <button class="calc-btn" onclick="calcularEngrenagens()">Calcular</button>
            <div id="resultado-engrenagens" class="result"></div>
        `;
    },

    vazao: function() {
        return `
            <h3>Cálculo de Vazão</h3>
            <div class="input-group">
                <label>Diâmetro do Tubo (mm):</label>
                <input type="number" id="diametro-tubo" placeholder="Ex: 100">
            </div>
            <div class="input-group">
                <label>Velocidade do Fluido (m/s):</label>
                <input type="number" id="velocidade-fluido" step="0.1" placeholder="Ex: 2.5">
            </div>
            <button class="calc-btn" onclick="calcularVazao()">Calcular</button>
            <div id="resultado-vazao" class="result"></div>
        `;
    },

    volumeCilindros: function() {
        return `
            <h3>Volume de Cilindros</h3>
            <div class="input-group">
                <label>Diâmetro (mm):</label>
                <input type="number" id="diametro-cilindro" placeholder="Ex: 500">
            </div>
            <div class="input-group">
                <label>Altura (mm):</label>
                <input type="number" id="altura-cilindro" placeholder="Ex: 1000">
            </div>
            <button class="calc-btn" onclick="calcularVolumeCilindro()">Calcular</button>
            <div id="resultado-volume-cilindro" class="result"></div>
        `;
    },

    conversaoPolegadas: function() {
        return `
            <h3>Conversão Polegadas ↔ Milímetros</h3>
            <div class="input-group">
                <label>Polegadas:</label>
                <input type="number" id="polegadas" step="0.001" placeholder="Ex: 1.5">
            </div>
            <div class="input-group">
                <label>Milímetros:</label>
                <input type="number" id="milimetros" step="0.01" placeholder="Ex: 38.1">
            </div>
            <button class="calc-btn" onclick="converterPolegadas()">Converter</button>
            <div id="resultado-conversao" class="result"></div>
        `;
    },

    furosMacho: function() {
        return `
            <h3>Diâmetro de Furos para Macho</h3>
            <div class="input-group">
                <label>Rosca:</label>
                <select id="rosca-macho">
                    <option value="M3">M3 x 0,5</option>
                    <option value="M4">M4 x 0,7</option>
                    <option value="M5">M5 x 0,8</option>
                    <option value="M6">M6 x 1,0</option>
                    <option value="M8">M8 x 1,25</option>
                    <option value="M10">M10 x 1,5</option>
                    <option value="M12">M12 x 1,75</option>
                    <option value="M16">M16 x 2,0</option>
                    <option value="M20">M20 x 2,5</option>
                    <option value="M24">M24 x 3,0</option>
                </select>
            </div>
            <button class="calc-btn" onclick="consultarFuroMacho()">Consultar</button>
            <div id="resultado-furo-macho" class="result"></div>
        `;
    },

    porcentagem: function() {
        return `
            <h3>Cálculos de Porcentagem</h3>
            <div class="input-group">
                <label>Valor:</label>
                <input type="number" id="valor-porcentagem" step="0.01" placeholder="Ex: 100">
            </div>
            <div class="input-group">
                <label>Porcentagem (%):</label>
                <input type="number" id="percentual" step="0.01" placeholder="Ex: 15">
            </div>
            <button class="calc-btn" onclick="calcularPorcentagem()">Calcular</button>
            <div id="resultado-porcentagem" class="result"></div>
        `;
    },

    // NOVAS CALCULADORAS IMPLEMENTADAS
    converterAcoConstrucao: function() {
        return `
            <h3><i class="fas fa-exchange-alt"></i> Converter Aço - Construção Civil</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="bitola-aco">Bitola do Aço (mm):</label>
                    <select id="bitola-aco">
                        <option value="4.2">4.2 mm (CA-60)</option>
                        <option value="5.0">5.0 mm (CA-50)</option>
                        <option value="6.3">6.3 mm (CA-50)</option>
                        <option value="8.0">8.0 mm (CA-50)</option>
                        <option value="10.0">10.0 mm (CA-50)</option>
                        <option value="12.5">12.5 mm (CA-50)</option>
                        <option value="16.0">16.0 mm (CA-50)</option>
                        <option value="20.0">20.0 mm (CA-50)</option>
                        <option value="25.0">25.0 mm (CA-50)</option>
                        <option value="32.0">32.0 mm (CA-50)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="comprimento-barra">Comprimento da Barra (m):</label>
                    <input type="number" id="comprimento-barra" value="12" step="0.1">
                </div>
                <div class="input-group">
                    <label for="quantidade-barras">Quantidade de Barras:</label>
                    <input type="number" id="quantidade-barras" value="1" min="1">
                </div>
                <button onclick="calcularAcoConstrucao()" class="calc-btn">Calcular</button>
                <div id="resultado-aco-construcao" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-table"></i> Tabela de Referência - Aço para Construção Civil</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Bitola (mm)</th>
                            <th>Peso (kg/m)</th>
                            <th>Área (cm²)</th>
                            <th>Perímetro (cm)</th>
                            <th>Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>4.2</td><td>0.109</td><td>0.139</td><td>1.32</td><td>CA-60</td></tr>
                        <tr><td>5.0</td><td>0.154</td><td>0.196</td><td>1.57</td><td>CA-50</td></tr>
                        <tr><td>6.3</td><td>0.245</td><td>0.312</td><td>1.98</td><td>CA-50</td></tr>
                        <tr><td>8.0</td><td>0.395</td><td>0.503</td><td>2.51</td><td>CA-50</td></tr>
                        <tr><td>10.0</td><td>0.617</td><td>0.785</td><td>3.14</td><td>CA-50</td></tr>
                        <tr><td>12.5</td><td>0.963</td><td>1.227</td><td>3.93</td><td>CA-50</td></tr>
                        <tr><td>16.0</td><td>1.578</td><td>2.011</td><td>5.03</td><td>CA-50</td></tr>
                        <tr><td>20.0</td><td>2.466</td><td>3.142</td><td>6.28</td><td>CA-50</td></tr>
                        <tr><td>25.0</td><td>3.853</td><td>4.909</td><td>7.85</td><td>CA-50</td></tr>
                        <tr><td>32.0</td><td>6.313</td><td>8.042</td><td>10.05</td><td>CA-50</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    dimensionamentoConstrucao: function() {
        return `
            <h3><i class="fas fa-ruler-combined"></i> Dimensionamento - Construção Civil</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="tipo-elemento">Tipo de Elemento:</label>
                    <select id="tipo-elemento" onchange="atualizarCamposDimensionamento()">
                        <option value="viga">Viga</option>
                        <option value="pilar">Pilar</option>
                        <option value="laje">Laje</option>
                        <option value="fundacao">Fundação</option>
                    </select>
                </div>
                <div id="campos-dimensionamento">
                    </div>
                <button onclick="calcularDimensionamento()" class="calc-btn">Calcular Dimensionamento</button>
                <div id="resultado-dimensionamento" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-shield-alt"></i> Coeficientes de Segurança NBR 6118</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Elemento</th>
                            <th>γc (Concreto)</th>
                            <th>γs (Aço)</th>
                            <th>γf (Ações)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Vigas</td><td>1.4</td><td>1.15</td><td>1.4</td></tr>
                        <tr><td>Pilares</td><td>1.4</td><td>1.15</td><td>1.4</td></tr>
                        <tr><td>Lajes</td><td>1.4</td><td>1.15</td><td>1.4</td></tr>
                        <tr><td>Fundações</td><td>1.4</td><td>1.15</td><td>1.2</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    unidadesVolumeCapacidade: function() {
        return `
            <h3><i class="fas fa-cube"></i> Conversão de Unidades - Volume e Capacidade</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="valor-volume">Valor:</label>
                    <input type="number" id="valor-volume" step="any" placeholder="Digite o valor">
                </div>
                <div class="input-group">
                    <label for="unidade-origem">De:</label>
                    <select id="unidade-origem">
                        <option value="m3">Metro Cúbico (m³)</option>
                        <option value="cm3">Centímetro Cúbico (cm³)</option>
                        <option value="mm3">Milímetro Cúbico (mm³)</option>
                        <option value="l">Litro (L)</option>
                        <option value="ml">Mililitro (mL)</option>
                        <option value="gal_us">Galão Americano</option>
                        <option value="gal_uk">Galão Inglês</option>
                        <option value="ft3">Pé Cúbico (ft³)</option>
                        <option value="in3">Polegada Cúbica (in³)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="unidade-destino">Para:</label>
                    <select id="unidade-destino">
                        <option value="m3">Metro Cúbico (m³)</option>
                        <option value="cm3">Centímetro Cúbico (cm³)</option>
                        <option value="mm3">Milímetro Cúbico (mm³)</option>
                        <option value="l">Litro (L)</option>
                        <option value="ml">Mililitro (mL)</option>
                        <option value="gal_us">Galão Americano</option>
                        <option value="gal_uk">Galão Inglês</option>
                        <option value="ft3">Pé Cúbico (ft³)</option>
                        <option value="in3">Polegada Cúbica (in³)</option>
                    </select>
                </div>
                <button onclick="converterVolume()" class="calc-btn">Converter</button>
                <div id="resultado-volume" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-table"></i> Tabela de Conversão - Volume</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Unidade</th>
                            <th>Equivalente em m³</th>
                            <th>Equivalente em Litros</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1 m³</td><td>1</td><td>1000 L</td></tr>
                        <tr><td>1 cm³</td><td>0.000001</td><td>0.001 L</td></tr>
                        <tr><td>1 mm³</td><td>0.000000001</td><td>0.000001 L</td></tr>
                        <tr><td>1 L</td><td>0.001</td><td>1 L</td></tr>
                        <tr><td>1 mL</td><td>0.000001</td><td>0.001 L</td></tr>
                        <tr><td>1 Galão US</td><td>0.003785</td><td>3.785 L</td></tr>
                        <tr><td>1 Galão UK</td><td>0.004546</td><td>4.546 L</td></tr>
                        <tr><td>1 ft³</td><td>0.028317</td><td>28.317 L</td></tr>
                        <tr><td>1 in³</td><td>0.000016387</td><td>0.016387 L</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    momentosReacoesApoios: function() {
        return `
            <h3><i class="fas fa-balance-scale"></i> Cálculo de Momentos e Reações em Apoios</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="tipo-viga">Tipo de Viga:</label>
                    <select id="tipo-viga" onchange="atualizarCamposMomentos()">
                        <option value="simplesmente-apoiada">Simplesmente Apoiada</option>
                        <option value="engastada-livre">Engastada-Livre (Balanço)</option>
                        <option value="bi-engastada">Bi-engastada</option>
                        <option value="engastada-apoiada">Engastada-Apoiada</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="comprimento-viga">Comprimento da Viga (m):</label>
                    <input type="number" id="comprimento-viga" step="0.1" placeholder="Ex: 6.0">
                </div>
                <div class="input-group">
                    <label for="tipo-carga">Tipo de Carga:</label>
                    <select id="tipo-carga" onchange="atualizarCamposCargas()">
                        <option value="uniformemente-distribuida">Uniformemente Distribuída</option>
                        <option value="concentrada-centro">Concentrada no Centro</option>
                        <option value="concentrada-qualquer">Concentrada em Posição Qualquer</option>
                        <option value="triangular">Triangular</option>
                    </select>
                </div>
                <div id="campos-cargas">
                    </div>
                <button onclick="calcularMomentos()" class="calc-btn">Calcular</button>
                <div id="resultado-momentos" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-table"></i> Fórmulas de Referência</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Tipo de Viga</th>
                            <th>Carga</th>
                            <th>Momento Máximo</th>
                            <th>Reação nos Apoios</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Simplesmente Apoiada</td><td>Uniforme (q)</td><td>qL²/8</td><td>qL/2</td></tr>
                        <tr><td>Simplesmente Apoiada</td><td>Concentrada (P)</td><td>PL/4</td><td>P/2</td></tr>
                        <tr><td>Engastada-Livre</td><td>Uniforme (q)</td><td>qL²/2</td><td>qL</td></tr>
                        <tr><td>Engastada-Livre</td><td>Concentrada (P)</td><td>PL</td><td>P</td></tr>
                        <tr><td>Bi-engastada</td><td>Uniforme (q)</td><td>qL²/12</td><td>qL/2</td></tr>
                        <tr><td>Bi-engastada</td><td>Concentrada (P)</td><td>PL/8</td><td>P/2</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    diametroBarrasCossinetes: function() {
        return `
            <h3><i class="fas fa-circle"></i> Diâmetro de Barras para Cossinetes</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="rosca-externa">Rosca Externa Desejada:</label>
                    <select id="rosca-externa">
                        <option value="M3">M3 x 0.5</option>
                        <option value="M4">M4 x 0.7</option>
                        <option value="M5">M5 x 0.8</option>
                        <option value="M6">M6 x 1.0</option>
                        <option value="M8">M8 x 1.25</option>
                        <option value="M10">M10 x 1.5</option>
                        <option value="M12">M12 x 1.75</option>
                        <option value="M14">M14 x 2.0</option>
                        <option value="M16">M16 x 2.0</option>
                        <option value="M18">M18 x 2.5</option>
                        <option value="M20">M20 x 2.5</option>
                        <option value="M22">M22 x 2.5</option>
                        <option value="M24">M24 x 3.0</option>
                        <option value="M27">M27 x 3.0</option>
                        <option value="M30">M30 x 3.5</option>
                    </select>
                </div>
                <button onclick="consultarDiametroBarra()" class="calc-btn">Consultar</button>
                <div id="resultado-diametro-barra" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-table"></i> Tabela Completa - Diâmetro de Barras para Cossinetes</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Rosca Externa</th>
                            <th>Passo (mm)</th>
                            <th>Diâmetro da Barra (mm)</th>
                            <th>Tolerância (mm)</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>M3</td><td>0.5</td><td>3.0</td><td>±0.05</td><td>Rosca fina</td></tr>
                        <tr><td>M4</td><td>0.7</td><td>4.0</td><td>±0.05</td><td>Rosca fina</td></tr>
                        <tr><td>M5</td><td>0.8</td><td>5.0</td><td>±0.05</td><td>Rosca fina</td></tr>
                        <tr><td>M6</td><td>1.0</td><td>6.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M8</td><td>1.25</td><td>8.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M10</td><td>1.5</td><td>10.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M12</td><td>1.75</td><td>12.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M14</td><td>2.0</td><td>14.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M16</td><td>2.0</td><td>16.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M18</td><td>2.5</td><td>18.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M20</td><td>2.5</td><td>20.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M22</td><td>2.5</td><td>22.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M24</td><td>3.0</td><td>24.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M27</td><td>3.0</td><td>27.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                        <tr><td>M30</td><td>3.5</td><td>30.0</td><td>±0.05</td><td>Rosca normal</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    diametroFuroRosca: function() {
        return `
            <h3><i class="fas fa-circle-notch"></i> Diâmetro de Furo para Rosca Interna</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="rosca-interna">Rosca Interna Desejada:</label>
                    <select id="rosca-interna">
                        <option value="M3">M3 x 0.5</option>
                        <option value="M4">M4 x 0.7</option>
                        <option value="M5">M5 x 0.8</option>
                        <option value="M6">M6 x 1.0</option>
                        <option value="M8">M8 x 1.25</option>
                        <option value="M10">M10 x 1.5</option>
                        <option value="M12">M12 x 1.75</option>
                        <option value="M14">M14 x 2.0</option>
                        <option value="M16">M16 x 2.0</option>
                        <option value="M18">M18 x 2.5</option>
                        <option value="M20">M20 x 2.5</option>
                        <option value="M22">M22 x 2.5</option>
                        <option value="M24">M24 x 3.0</option>
                        <option value="M27">M27 x 3.0</option>
                        <option value="M30">M30 x 3.5</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="material-furo">Material:</label>
                    <select id="material-furo">
                        <option value="aco">Aço</option>
                        <option value="aluminio">Alumínio</option>
                        <option value="latao">Latão</option>
                        <option value="ferro-fundido">Ferro Fundido</option>
                        <option value="plastico">Plástico</option>
                    </select>
                </div>
                <button onclick="consultarDiametroFuro()" class="calc-btn">Consultar</button>
                <div id="resultado-diametro-furo" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-table"></i> Tabela Completa - Diâmetro de Furos para Rosca Interna</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Rosca</th>
                            <th>Passo (mm)</th>
                            <th>Diâmetro do Furo (mm)</th>
                            <th>Broca Recomendada</th>
                            <th>% de Rosca</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>M3 x 0.5</td><td>0.5</td><td>2.5</td><td>2.5</td><td>75%</td></tr>
                        <tr><td>M4 x 0.7</td><td>0.7</td><td>3.3</td><td>3.3</td><td>75%</td></tr>
                        <tr><td>M5 x 0.8</td><td>0.8</td><td>4.2</td><td>4.2</td><td>75%</td></tr>
                        <tr><td>M6 x 1.0</td><td>1.0</td><td>5.0</td><td>5.0</td><td>75%</td></tr>
                        <tr><td>M8 x 1.25</td><td>1.25</td><td>6.8</td><td>6.8</td><td>75%</td></tr>
                        <tr><td>M10 x 1.5</td><td>1.5</td><td>8.5</td><td>8.5</td><td>75%</td></tr>
                        <tr><td>M12 x 1.75</td><td>1.75</td><td>10.2</td><td>10.2</td><td>75%</td></tr>
                        <tr><td>M14 x 2.0</td><td>2.0</td><td>12.0</td><td>12.0</td><td>75%</td></tr>
                        <tr><td>M16 x 2.0</td><td>2.0</td><td>14.0</td><td>14.0</td><td>75%</td></tr>
                        <tr><td>M18 x 2.5</td><td>2.5</td><td>15.5</td><td>15.5</td><td>75%</td></tr>
                        <tr><td>M20 x 2.5</td><td>2.5</td><td>17.5</td><td>17.5</td><td>75%</td></tr>
                        <tr><td>M22 x 2.5</td><td>2.5</td><td>19.5</td><td>19.5</td><td>75%</td></tr>
                        <tr><td>M24 x 3.0</td><td>3.0</td><td>21.0</td><td>21.0</td><td>75%</td></tr>
                        <tr><td>M27 x 3.0</td><td>3.0</td><td>24.0</td><td>24.0</td><td>75%</td></tr>
                        <tr><td>M30 x 3.5</td><td>3.5</td><td>26.5</td><td>26.5</td><td>75%</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    }
,
    // Dimensionamento de eixos (diâmetro por torque)
    dimensionamentoEixos: function() {
        return `
            <h3><i class="fas fa-cogs"></i> Dimensionamento de Eixos</h3>
            <div class="input-group">
                <label>Torque Aplicado (N·m):</label>
                <input type="number" id="torque-eixo" step="any" placeholder="Ex: 500">
            </div>
            <div class="input-group">
                <label>Tensão Admissível do Material (MPa):</label>
                <input type="number" id="tensao-admissivel" step="any" placeholder="Ex: 100">
            </div>
            <div class="input-group">
                <label>Coeficiente de Segurança (γ):</label>
                <input type="number" id="coef-seguranca" step="0.1" value="2">
            </div>
            <button class="calc-btn" onclick="calcularDimensionamentoEixos()">Calcular</button>
            <div id="resultado-dimensionamento-eixos" class="result"></div>
        `;
    },

    // Espessura de parede de tubo para pressão interna (equação de Barlow simplificada)
    espessuraParedeTubo: function() {
        return `
            <h3><i class="fas fa-circle-notch"></i> Espessura de Parede do Tubo (Pressão Interna)</h3>
            <div class="input-group">
                <label>Pressão Interna (bar):</label>
                <input type="number" id="pressao-tubo" step="any" placeholder="Ex: 10">
            </div>
            <div class="input-group">
                <label>Diâmetro Externo (mm):</label>
                <input type="number" id="diametro-externo-tubo" step="any" placeholder="Ex: 100">
            </div>
            <div class="input-group">
                <label>Tensão Admissível do Material (MPa):</label>
                <input type="number" id="tensao-tubo" step="any" placeholder="Ex: 150">
            </div>
            <div class="input-group">
                <label>Fator de Segurança:</label>
                <input type="number" id="fator-seguranca-tubo" step="0.1" value="1.5">
            </div>
            <button class="calc-btn" onclick="calcularEspessuraParedeTubo()">Calcular</button>
            <div id="resultado-espessura-tubo" class="result"></div>
        `;
    },

    // Pressão crítica da sapata (pressão de contato)
    pressaoCriticaSapata: function() {
        return `
            <h3><i class="fas fa-compress-arrows-alt"></i> Pressão Crítica da Sapata</h3>
            <div class="input-group">
                <label>Carga na Sapata (kN):</label>
                <input type="number" id="carga-sapata" step="any" placeholder="Ex: 1500">
            </div>
            <div class="input-group">
                <label>Largura da Sapata (m):</label>
                <input type="number" id="largura-sapata" step="any" placeholder="Ex: 1.2">
            </div>
            <div class="input-group">
                <label>Comprimento da Sapata (m):</label>
                <input type="number" id="comprimento-sapata" step="any" placeholder="Ex: 1.2">
            </div>
            <button class="calc-btn" onclick="calcularPressaoCriticaSapata()">Calcular</button>
            <div id="resultado-pressao-sapata" class="result"></div>
        `;
    },

    // Atrito (F = μ * N)
    atrito: function() {
        return `
            <h3><i class="fas fa-sliders-h"></i> Atrito</h3>
            <div class="input-group">
                <label>Coeficiente de Atrito (μ):</label>
                <input type="number" id="coef-atrito" step="0.01" placeholder="Ex: 0.3">
            </div>
            <div class="input-group">
                <label>Força Normal (N):</label>
                <input type="number" id="forca-normal-atrito" step="any" placeholder="Ex: 1000">
            </div>
            <button class="calc-btn" onclick="calcularAtrito()">Calcular</button>
            <div id="resultado-atrito" class="result"></div>
        `;
    },

    // Cálculo de escada (espelho e piso recomendados)
    calculoEscada: function() {
        return `
            <h3><i class="fas fa-stream"></i> Cálculo de Escada</h3>
            <div class="input-group">
                <label>Altura Total (m):</label>
                <input type="number" id="altura-escada" step="any" placeholder="Ex: 3.0">
            </div>
            <div class="input-group">
                <label>Profundidade do Piso Desejada (mm) (opcional):</label>
                <input type="number" id="profundidade-piso" step="any" placeholder="Ex: 280">
            </div>
            <button class="calc-btn" onclick="calcularEscada()">Calcular</button>
            <div id="resultado-escada" class="result"></div>
        `;
    },

    // Conversão de aço construção civil (versão duplicada original ajustada para consistência visual)
    converterAcoConstrucao: function() {
        return `
            <h3><i class="fas fa-exchange-alt"></i> Converter Aço - Construção Civil</h3>
            <div class="calculator-section">
                <div class="input-group">
                    <label for="tipo-conversao-aco">Tipo de Conversão:</label>
                    <select id="tipo-conversao-aco">
                        <option value="kg-m2">kg → m² (chapa)</option>
                        <option value="m2-kg">m² → kg (chapa)</option>
                        <option value="barra-linear">Diâmetro → Peso Linear</option>
                        <option value="bitola-aco">Bitola CA → Diâmetro/Peso</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="valor-aco">Valor:</label>
                    <input type="number" id="valor-aco" step="any" placeholder="Digite o valor">
                </div>
                <button onclick="converterAcoConstrucao()" class="calc-btn">Converter</button>
                <div id="resultado-aco-construcao" class="result"></div>
            </div>
            
            <div class="info-section">
                <h4><i class="fas fa-table"></i> Bitolas Comerciais de Aço CA</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Bitola</th>
                            <th>Diâmetro (mm)</th>
                            <th>Peso (kg/m)</th>
                            <th>Classe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>CA-25</td><td>2.5</td><td>0.039</td><td>Estribo</td></tr>
                        <tr><td>CA-32</td><td>3.2</td><td>0.064</td><td>Estribo</td></tr>
                        <tr><td>CA-40</td><td>4.0</td><td>0.099</td><td>Estribo</td></tr>
                        <tr><td>CA-50</td><td>5.0</td><td>0.154</td><td>Principal</td></tr>
                        <tr><td>CA-60</td><td>6.3</td><td>0.245</td><td>Principal</td></tr>
                        <tr><td>CA-80</td><td>8.0</td><td>0.395</td><td>Principal</td></tr>
                        <tr><td>CA-100</td><td>10.0</td><td>0.617</td><td>Principal</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    }
};

// Função para renderizar as ferramentas
function renderTools() {
    const filteredTools = engineeringTools.filter(tool => {
        const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredTools.length === 0) {
        toolsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    toolsGrid.style.display = 'grid';
    noResults.style.display = 'none';

    toolsGrid.innerHTML = filteredTools.map(tool => {
        const isFunctional = tool.calculator && typeof calculators[tool.calculator] === 'function';
        const iconClass = tool.icon || 'fas fa-toolbox';
        const tags = tool.tags ? tool.tags.slice(0,3) : [];
        const toolI18nKey = 'ferreng.tool_' + tool.id.replace(/-/g, '_');
        return `
        <div class="tool-card" onclick="openTool('${tool.id}')">
            <div class="tool-icon ${tool.icon ? '' : 'fallback'}">
                <i class="${iconClass}" aria-hidden="true"></i>
            </div>
            <div class="tool-badge">${isFunctional ? '<span class="badge functional" data-i18n="ferreng.functional">Funcional</span>' : '<span class="badge dev" data-i18n="ferreng.dev">Em desenvolvimento</span>'}</div>
            <h3 class="tool-name" data-i18n="${toolI18nKey}">${tool.name}</h3>
            <p class="tool-description" data-i18n="${toolI18nKey}_desc">${tool.description}</p>
            <div class="tool-meta">
                <span class="tool-category">${tool.category || ''}</span>
                ${tags.map(t => `<span class="tool-tag">${t}</span>`).join('')}
            </div>
        </div>
        `;
    }).join('');
}

// Função para abrir ferramenta
function openTool(toolId) {
    const tool = engineeringTools.find(t => t.id === toolId);
    if (!tool) return;

    modalTitle.textContent = tool.name;
    
    if (tool.calculator && calculators[tool.calculator]) {
        modalContent.innerHTML = calculators[tool.calculator]();
    } else {
        modalContent.innerHTML = i18n.t('ferreng.dev_notice');
    }
    
    modal.style.display = 'flex';
    
    // Inicializar campos dinâmicos se necessário
    setTimeout(() => {
        if (tool.calculator === 'dimensionamentoConstrucao' && typeof atualizarCamposDimensionamento === 'function') {
            atualizarCamposDimensionamento();
        }
        if (tool.calculator === 'momentosReacoesApoios' && typeof atualizarCamposCargas === 'function') {
            atualizarCamposCargas();
        }
    }, 100);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    renderTools();
    
    // Busca
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderTools();
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTerm = '';
        renderTools();
    });
    
    // Categorias
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderTools();
        });
    });
    
    // Modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Theme (modo claro/escuro) ---
    try {
        const toggleBtn = document.getElementById('toggleTheme');
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
            if (toggleBtn) {
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-moon', 'fa-sun');
                    icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
                }
            }
            try { localStorage.setItem('engineering-tools-theme', theme); } catch(e){}
        }

        // Inicializa tema a partir do storage ou sistema
        const savedTheme = (function(){
            try { return localStorage.getItem('engineering-tools-theme'); } catch(e) { return null; }
        })();

        if (savedTheme) applyTheme(savedTheme);
        else {
            // detectar preferência do sistema
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }
    } catch (err) {
        console.warn('Erro ao inicializar tema:', err);
    }
});

// FUNÇÕES DE CÁLCULO IMPLEMENTADAS

// 1. Função para calcular aço construção civil
function calcularAcoConstrucao() {
    const bitola = parseFloat(document.getElementById("bitola-aco").value);
    const comprimento = parseFloat(document.getElementById("comprimento-barra").value);
    const quantidade = parseInt(document.getElementById("quantidade-barras").value);

    // Tabela de pesos por metro
    const pesos = {
        4.2: 0.109, 5.0: 0.154, 6.3: 0.245, 8.0: 0.395, 10.0: 0.617,
        12.5: 0.963, 16.0: 1.578, 20.0: 2.466, 25.0: 3.853, 32.0: 6.313
    };

    const areas = {
        4.2: 0.139, 5.0: 0.196, 6.3: 0.312, 8.0: 0.503, 10.0: 0.785,
        12.5: 1.227, 16.0: 2.011, 20.0: 3.142, 25.0: 4.909, 32.0: 8.042
    };

    const pesoUnitario = pesos[bitola];
    const areaUnitaria = areas[bitola];
    const pesoTotal = pesoUnitario * comprimento * quantidade;
    const areaTotal = areaUnitaria * quantidade;
    const comprimentoTotal = comprimento * quantidade;

    document.getElementById("resultado-aco-construcao").innerHTML = `
        <h4>Resultados do Cálculo:</h4>
        <p><strong>Bitola:</strong> ${bitola} mm</p>
        <p><strong>Peso por metro:</strong> ${pesoUnitario} kg/m</p>
        <p><strong>Área por barra:</strong> ${areaUnitaria} cm²</p>
        <p><strong>Comprimento total:</strong> ${comprimentoTotal.toFixed(2)} m</p>
        <p><strong>Peso total:</strong> ${pesoTotal.toFixed(2)} kg</p>
        <p><strong>Área total de aço:</strong> ${areaTotal.toFixed(2)} cm²</p>
    `;
}

// 2. Função para dimensionamento construção civil
function atualizarCamposDimensionamento() {
    const tipo = document.getElementById("tipo-elemento").value;
    const campos = document.getElementById("campos-dimensionamento");
    
    let html = '';
    switch(tipo) {
        case 'viga':
            html = `
                <div class="input-group">
                    <label for="momento-fletor">Momento Fletor (kN.m):</label>
                    <input type="number" id="momento-fletor" step="0.1">
                </div>
                <div class="input-group">
                    <label for="fck">fck do Concreto (MPa):</label>
                    <select id="fck">
                        <option value="20">C20</option>
                        <option value="25">C25</option>
                        <option value="30">C30</option>
                        <option value="35">C35</option>
                        <option value="40">C40</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="aco-tipo">Tipo de Aço:</label>
                    <select id="aco-tipo">
                        <option value="500">CA-50 (500 MPa)</option>
                        <option value="600">CA-60 (600 MPa)</option>
                    </select>
                </div>
            `;
            break;
        case 'pilar':
            html = `
                <div class="input-group">
                    <label for="forca-normal">Força Normal (kN):</label>
                    <input type="number" id="forca-normal" step="0.1">
                </div>
                <div class="input-group">
                    <label for="altura-pilar">Altura do Pilar (m):</label>
                    <input type="number" id="altura-pilar" step="0.1">
                </div>
                <div class="input-group">
                    <label for="fck-pilar">fck do Concreto (MPa):</label>
                    <select id="fck-pilar">
                        <option value="25">C25</option>
                        <option value="30">C30</option>
                        <option value="35">C35</option>
                        <option value="40">C40</option>
                    </select>
                </div>
            `;
            break;
        case 'laje':
            html = `
                <div class="input-group">
                    <label for="carga-laje">Carga Total (kN/m²):</label>
                    <input type="number" id="carga-laje" step="0.1">
                </div>
                <div class="input-group">
                    <label for="vao-laje">Vão da Laje (m):</label>
                    <input type="number" id="vao-laje" step="0.1">
                </div>
                <div class="input-group">
                    <label for="tipo-laje">Tipo de Laje:</label>
                    <select id="tipo-laje">
                        <option value="armada-uma-direcao">Armada em uma direção</option>
                        <option value="armada-duas-direcoes">Armada em duas direções</option>
                    </select>
                </div>
            `;
            break;
        case 'fundacao':
            html = `
                <div class="input-group">
                    <label for="carga-fundacao">Carga da Fundação (kN):</label>
                    <input type="number" id="carga-fundacao" step="0.1">
                </div>
                <div class="input-group">
                    <label for="tensao-solo">Tensão Admissível do Solo (kN/m²):</label>
                    <input type="number" id="tensao-solo" step="1">
                </div>
                <div class="input-group">
                    <label for="tipo-fundacao">Tipo de Fundação:</label>
                    <select id="tipo-fundacao">
                        <option value="sapata">Sapata Isolada</option>
                        <option value="radier">Radier</option>
                        <option value="estaca">Estaca</option>
                    </select>
                </div>
            `;
            break;
    }
    campos.innerHTML = html;
}

function calcularDimensionamento() {
    const tipo = document.getElementById("tipo-elemento").value;
    let resultado = '';
    
    switch(tipo) {
        case 'viga':
            const momento = parseFloat(document.getElementById("momento-fletor").value);
            const fck = parseFloat(document.getElementById("fck").value);
            const fyd = parseFloat(document.getElementById("aco-tipo").value) / 1.15; // Tensão de cálculo
            
            // Cálculo simplificado da altura útil necessária
            const d = Math.sqrt((momento * 1000000) / (0.295 * fck * 1000 * 0.8)); // em mm
            const h = d + 50; // altura total considerando cobrimento
            
            resultado = `
                <h4>Dimensionamento da Viga:</h4>
                <p><strong>Altura útil mínima:</strong> ${d.toFixed(0)} mm</p>
                <p><strong>Altura total sugerida:</strong> ${h.toFixed(0)} mm</p>
                <p><strong>Largura sugerida:</strong> ${Math.max(120, h/4).toFixed(0)} mm</p>
            `;
            break;
            
        case 'pilar':
            const forca = parseFloat(document.getElementById("forca-normal").value);
            const altura = parseFloat(document.getElementById("altura-pilar").value);
            const fckPilar = parseFloat(document.getElementById("fck-pilar").value);
            
            // Área mínima do pilar
            const areaPilar = Math.max(360, (forca * 1000) / (0.85 * fckPilar * 1000)); // cm²
            const lado = Math.sqrt(areaPilar); // pilar quadrado
            
            resultado = `
                <h4>Dimensionamento do Pilar:</h4>
                <p><strong>Área mínima:</strong> ${areaPilar.toFixed(0)} cm²</p>
                <p><strong>Seção quadrada sugerida:</strong> ${Math.max(15, lado).toFixed(0)} x ${Math.max(15, lado).toFixed(0)} cm</p>
                <p><strong>Armadura mínima:</strong> ${(areaPilar * 0.004).toFixed(2)} cm²</p>
            `;
            break;
            
        case 'laje':
            const carga = parseFloat(document.getElementById("carga-laje").value);
            const vao = parseFloat(document.getElementById("vao-laje").value);
            
            // Espessura mínima da laje
            const espessura = Math.max(70, vao * 1000 / 40); // mm
            
            resultado = `
                <h4>Dimensionamento da Laje:</h4>
                <p><strong>Espessura mínima:</strong> ${espessura.toFixed(0)} mm</p>
                <p><strong>Momento máximo:</strong> ${(carga * vao * vao / 8).toFixed(2)} kN.m/m</p>
            `;
            break;
            
        case 'fundacao':
            const cargaFund = parseFloat(document.getElementById("carga-fundacao").value);
            const tensaoSolo = parseFloat(document.getElementById("tensao-solo").value);
            
            const areaFundacao = cargaFund / tensaoSolo; // m²
            const ladoSapata = Math.sqrt(areaFundacao);
            
            resultado = `
                <h4>Dimensionamento da Fundação:</h4>
                <p><strong>Área necessária:</strong> ${areaFundacao.toFixed(2)} m²</p>
                <p><strong>Sapata quadrada sugerida:</strong> ${ladoSapata.toFixed(2)} x ${ladoSapata.toFixed(2)} m</p>
            `;
            break;
    }
    
    document.getElementById("resultado-dimensionamento").innerHTML = resultado;
}

// 3. Função para conversão de volume
function converterVolume() {
    const valor = parseFloat(document.getElementById("valor-volume").value);
    const origem = document.getElementById("unidade-origem").value;
    const destino = document.getElementById("unidade-destino").value;
    
    if (isNaN(valor)) {
        document.getElementById("resultado-volume").innerHTML = i18n.t('ferreng.enter_valid_value');
        return;
    }
    
    // Fatores de conversão para m³
    const fatores = {
        m3: 1,
        cm3: 0.000001,
        mm3: 0.000000001,
        l: 0.001,
        ml: 0.000001,
        gal_us: 0.003785412,
        gal_uk: 0.00454609,
        ft3: 0.028316847,
        in3: 0.000016387064
    };
    
    // Converter para m³ primeiro, depois para a unidade destino
    const valorM3 = valor * fatores[origem];
    const resultado = valorM3 / fatores[destino];
    
    const nomes = {
        m3: "Metro Cúbico (m³)",
        cm3: "Centímetro Cúbico (cm³)",
        mm3: "Milímetro Cúbico (mm³)",
        l: "Litro (L)",
        ml: "Mililitro (mL)",
        gal_us: "Galão Americano",
        gal_uk: "Galão Inglês",
        ft3: "Pé Cúbico (ft³)",
        in3: "Polegada Cúbica (in³)"
    };
    
    document.getElementById("resultado-volume").innerHTML = `
        <h4>Resultado da Conversão:</h4>
        <p><strong>${valor} ${nomes[origem]}</strong> = <strong>${resultado.toFixed(6)} ${nomes[destino]}</strong></p>
    `;
}

// 4. Funções para momentos e reações
function atualizarCamposMomentos() {
    const tipoViga = document.getElementById("tipo-viga").value;
    // Esta função pode ser expandida para mostrar diagramas específicos
}

function atualizarCamposCargas() {
    const tipoCarga = document.getElementById("tipo-carga").value;
    const campos = document.getElementById("campos-cargas") || document.createElement('div');
    
    let html = '';
    switch(tipoCarga) {
        case 'uniformemente-distribuida':
            html = `
                <div class="input-group">
                    <label for="carga-distribuida">Carga Distribuída (kN/m):</label>
                    <input type="number" id="carga-distribuida" step="0.1">
                </div>
            `;
            break;
        case 'concentrada-centro':
            html = `
                <div class="input-group">
                    <label for="carga-concentrada">Carga Concentrada (kN):</label>
                    <input type="number" id="carga-concentrada" step="0.1">
                </div>
            `;
            break;
        case 'concentrada-qualquer':
            html = `
                <div class="input-group">
                    <label for="carga-concentrada-pos">Carga Concentrada (kN):</label>
                    <input type="number" id="carga-concentrada-pos" step="0.1">
                </div>
                <div class="input-group">
                    <label for="posicao-carga">Posição da Carga (m):</label>
                    <input type="number" id="posicao-carga" step="0.1">
                </div>
            `;
            break;
        case 'triangular':
            html = `
                <div class="input-group">
                    <label for="carga-triangular-max">Carga Máxima (kN/m):</label>
                    <input type="number" id="carga-triangular-max" step="0.1">
                </div>
            `;
            break;
    }
    campos.innerHTML = html;
}

function calcularMomentos() {
    const tipoViga = document.getElementById("tipo-viga").value;
    const comprimento = parseFloat(document.getElementById("comprimento-viga").value);
    const tipoCarga = document.getElementById("tipo-carga").value;
    
    if (isNaN(comprimento)) {
        document.getElementById("resultado-momentos").innerHTML = i18n.t('ferreng.enter_beam_length');
        return;
    }
    
    let momento = 0;
    let reacao = 0;
    let descricao = '';
    
    if (tipoCarga === 'uniformemente-distribuida') {
        const q = parseFloat(document.getElementById("carga-distribuida").value);
        if (isNaN(q)) return;
        
        switch(tipoViga) {
            case 'simplesmente-apoiada':
                momento = (q * comprimento * comprimento) / 8;
                reacao = (q * comprimento) / 2;
                descricao = "Viga simplesmente apoiada com carga uniforme";
                break;
            case 'engastada-livre':
                momento = (q * comprimento * comprimento) / 2;
                reacao = q * comprimento;
                descricao = "Viga em balanço com carga uniforme";
                break;
            case 'bi-engastada':
                momento = (q * comprimento * comprimento) / 12;
                reacao = (q * comprimento) / 2;
                descricao = "Viga bi-engastada com carga uniforme";
                break;
        }
    } else if (tipoCarga === 'concentrada-centro') {
        const P = parseFloat(document.getElementById("carga-concentrada").value);
        if (isNaN(P)) return;
        
        switch(tipoViga) {
            case 'simplesmente-apoiada':
                momento = (P * comprimento) / 4;
                reacao = P / 2;
                descricao = "Viga simplesmente apoiada com carga concentrada no centro";
                break;
            case 'engastada-livre':
                momento = P * comprimento;
                reacao = P;
                descricao = "Viga em balanço com carga concentrada na extremidade";
                break;
            case 'bi-engastada':
                momento = (P * comprimento) / 8;
                reacao = P / 2;
                descricao = "Viga bi-engastada com carga concentrada no centro";
                break;
        }
    }
    
    document.getElementById("resultado-momentos").innerHTML = `
        <h4>Resultados:</h4>
        <p><strong>Configuração:</strong> ${descricao}</p>
        <p><strong>Momento Máximo:</strong> ${momento.toFixed(2)} kN.m</p>
        <p><strong>Reação nos Apoios:</strong> ${reacao.toFixed(2)} kN</p>
        <p><strong>Comprimento da Viga:</strong> ${comprimento} m</p>
    `;
}

// 5. Função para consultar diâmetro de barras
function consultarDiametroBarra() {
    const rosca = document.getElementById("rosca-externa").value;
    
    const dados = {
        'M3': { passo: 0.5, diametro: 3.0, tolerancia: '±0.05', obs: 'Rosca fina' },
        'M4': { passo: 0.7, diametro: 4.0, tolerancia: '±0.05', obs: 'Rosca fina' },
        'M5': { passo: 0.8, diametro: 5.0, tolerancia: '±0.05', obs: 'Rosca fina' },
        'M6': { passo: 1.0, diametro: 6.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M8': { passo: 1.25, diametro: 8.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M10': { passo: 1.5, diametro: 10.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M12': { passo: 1.75, diametro: 12.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M14': { passo: 2.0, diametro: 14.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M16': { passo: 2.0, diametro: 16.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M18': { passo: 2.5, diametro: 18.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M20': { passo: 2.5, diametro: 20.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M22': { passo: 2.5, diametro: 22.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M24': { passo: 3.0, diametro: 24.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M27': { passo: 3.0, diametro: 27.0, tolerancia: '±0.05', obs: 'Rosca normal' },
        'M30': { passo: 3.5, diametro: 30.0, tolerancia: '±0.05', obs: 'Rosca normal' }
    };
    
    const info = dados[rosca];
    
    document.getElementById("resultado-diametro-barra").innerHTML = `
        <h4>Especificações para ${rosca}:</h4>
        <p><strong>Passo da Rosca:</strong> ${info.passo} mm</p>
        <p><strong>Diâmetro da Barra:</strong> ${info.diametro} mm</p>
        <p><strong>Tolerância:</strong> ${info.tolerancia} mm</p>
        <p><strong>Observações:</strong> ${info.obs}</p>
    `;
}

// 6. Função para consultar diâmetro de furo
function consultarDiametroFuro() {
    const rosca = document.getElementById("rosca-interna").value;
    const material = document.getElementById("material-furo").value;
    
    const dados = {
        'M3': { passo: 0.5, furo: 2.5, broca: 2.5, rosca: '75%' },
        'M4': { passo: 0.7, furo: 3.3, broca: 3.3, rosca: '75%' },
        'M5': { passo: 0.8, furo: 4.2, broca: 4.2, rosca: '75%' },
        'M6': { passo: 1.0, furo: 5.0, broca: 5.0, rosca: '75%' },
        'M8': { passo: 1.25, furo: 6.8, broca: 6.8, rosca: '75%' },
        'M10': { passo: 1.5, furo: 8.5, broca: 8.5, rosca: '75%' },
        'M12': { passo: 1.75, furo: 10.2, broca: 10.2, rosca: '75%' },
        'M14': { passo: 2.0, furo: 12.0, broca: 12.0, rosca: '75%' },
        'M16': { passo: 2.0, furo: 14.0, broca: 14.0, rosca: '75%' },
        'M18': { passo: 2.5, furo: 15.5, broca: 15.5, rosca: '75%' },
        'M20': { passo: 2.5, furo: 17.5, broca: 17.5, rosca: '75%' },
        'M22': { passo: 2.5, furo: 19.5, broca: 19.5, rosca: '75%' },
        'M24': { passo: 3.0, furo: 21.0, broca: 21.0, rosca: '75%' },
        'M27': { passo: 3.0, furo: 24.0, broca: 24.0, rosca: '75%' },
        'M30': { passo: 3.5, furo: 26.5, broca: 26.5, rosca: '75%' }
    };
    
    const materiais = {
        'aco': 'Aço',
        'aluminio': 'Alumínio',
        'latao': 'Latão',
        'ferro-fundido': 'Ferro Fundido',
        'plastico': 'Plástico'
    };
    
    const info = dados[rosca];
    
    document.getElementById("resultado-diametro-furo").innerHTML = `
        <h4>Especificações para ${rosca} em ${materiais[material]}:</h4>
        <p><strong>Passo da Rosca:</strong> ${info.passo} mm</p>
        <p><strong>Diâmetro do Furo:</strong> ${info.furo} mm</p>
        <p><strong>Broca Recomendada:</strong> ${info.broca} mm</p>
        <p><strong>Porcentagem de Rosca:</strong> ${info.rosca}</p>
        <p><strong>Material:</strong> ${materiais[material]}</p>
    `;
}

// Funções existentes (mantidas para compatibilidade)
function calcularEngrenagens() {
    const dentes1 = parseInt(document.getElementById("dentes-1").value);
    const dentes2 = parseInt(document.getElementById("dentes-2").value);
    const modulo = parseFloat(document.getElementById("modulo").value);
    const rpmMotor = parseFloat(document.getElementById("rpm-motor").value);

    if (isNaN(dentes1) || isNaN(dentes2) || isNaN(modulo) || isNaN(rpmMotor)) {
        document.getElementById("resultado-engrenagens").innerHTML = i18n.t('ferreng.fill_all_fields');
        return;
    }

    const diametroPrimitivo1 = dentes1 * modulo;
    const diametroPrimitivo2 = dentes2 * modulo;
    const relacaoTransmissao = dentes2 / dentes1;
    const rpmSaida = rpmMotor / relacaoTransmissao;

    document.getElementById("resultado-engrenagens").innerHTML = `
        <p>Diâmetro Primitivo Engrenagem 1: ${diametroPrimitivo1.toFixed(2)} mm</p>
        <p>Diâmetro Primitivo Engrenagem 2: ${diametroPrimitivo2.toFixed(2)} mm</p>
        <p>Relação de Transmissão: ${relacaoTransmissao.toFixed(2)}</p>
        <p>RPM de Saída: ${rpmSaida.toFixed(2)}</p>
    `;
}

function calcularVazao() {
    const diametroTubo = parseFloat(document.getElementById("diametro-tubo").value);
    const velocidadeFluido = parseFloat(document.getElementById("velocidade-fluido").value);

    if (isNaN(diametroTubo) || isNaN(velocidadeFluido)) {
        document.getElementById("resultado-vazao").innerHTML = i18n.t('ferreng.fill_all_fields');
        return;
    }

    const raioTubo = diametroTubo / 2000; // Converter para metros
    const areaSecao = Math.PI * Math.pow(raioTubo, 2);
    const vazao = areaSecao * velocidadeFluido * 3600; // m³/h

    document.getElementById("resultado-vazao").innerHTML = `<p>Vazão: ${vazao.toFixed(2)} m³/h</p>`;
}

function calcularVolumeCilindro() {
    const diametroCilindro = parseFloat(document.getElementById("diametro-cilindro").value);
    const alturaCilindro = parseFloat(document.getElementById("altura-cilindro").value);

    if (isNaN(diametroCilindro) || isNaN(alturaCilindro)) {
        document.getElementById("resultado-volume-cilindro").innerHTML = i18n.t('ferreng.fill_all_fields');
        return;
    }

    const raioCilindro = diametroCilindro / 2; // mm
    const volumeMm3 = Math.PI * Math.pow(raioCilindro, 2) * alturaCilindro;
    const volumeLitros = volumeMm3 / 1000000; // Converter para litros

    document.getElementById("resultado-volume-cilindro").innerHTML = `<p>Volume: ${volumeLitros.toFixed(2)} Litros</p>`;
}

function converterPolegadas() {
    const polegadas = parseFloat(document.getElementById("polegadas").value);
    const milimetros = parseFloat(document.getElementById("milimetros").value);
    
    if (!isNaN(polegadas)) {
        const mm = polegadas * 25.4;
        document.getElementById("milimetros").value = mm.toFixed(3);
        document.getElementById("resultado-conversao").innerHTML = `${polegadas}" = ${mm.toFixed(3)} mm`;
    } else if (!isNaN(milimetros)) {
        const pol = milimetros / 25.4;
        document.getElementById("polegadas").value = pol.toFixed(4);
        document.getElementById("resultado-conversao").innerHTML = `${milimetros} mm = ${pol.toFixed(4)}"`;
    }
}

function consultarFuroMacho() {
    const rosca = document.getElementById("rosca-macho").value;
    const furos = {
        'M3': '2.5 mm',
        'M4': '3.3 mm',
        'M5': '4.2 mm',
        'M6': '5.0 mm',
        'M8': '6.8 mm',
        'M10': '8.5 mm',
        'M12': '10.2 mm',
        'M16': '14.0 mm',
        'M20': '17.5 mm',
        'M24': '21.0 mm'
    };
    
    document.getElementById("resultado-furo-macho").innerHTML = `
        <p><strong>Rosca ${rosca}:</strong> Furo de ${furos[rosca]}</p>
    `;
}

function calcularPorcentagem() {
    const valor = parseFloat(document.getElementById("valor-porcentagem").value);
    const percentual = parseFloat(document.getElementById("percentual").value);
    
    if (isNaN(valor) || isNaN(percentual)) {
        document.getElementById("resultado-porcentagem").innerHTML = i18n.t('ferreng.fill_all_fields');
        return;
    }
    
    const resultado = (valor * percentual) / 100;
    const valorFinal = valor + resultado;
    
    document.getElementById("resultado-porcentagem").innerHTML = `
        <p><strong>${percentual}% de ${valor}:</strong> ${resultado.toFixed(2)}</p>
        <p><strong>Valor + ${percentual}%:</strong> ${valorFinal.toFixed(2)}</p>
        <p><strong>Valor - ${percentual}%:</strong> ${(valor - resultado).toFixed(2)}</p>
    `;
}

// --- Funções novas implementadas ---

function calcularDimensionamentoEixos() {
    const torque = parseFloat(document.getElementById('torque-eixo').value); // N·m
    const tensao = parseFloat(document.getElementById('tensao-admissivel').value); // MPa
    const gamma = parseFloat(document.getElementById('coef-seguranca').value) || 2;

    if (isNaN(torque) || isNaN(tensao)) {
        document.getElementById('resultado-dimensionamento-eixos').innerHTML = i18n.t('ferreng.fill_torque_stress');
        return;
    }

    // Fórmula simplificada para diâmetro mínimo por torque com tensão cisalhante aproximada
    // τ = T*r / J  -> aproximando para barra circular sólida: τ_max = 16*T / (π*d^3)
    // para tensão admissível σ_adm usar τ_adm = σ_adm / 1.2 (conversão conservadora)
    const tauAdm = (tensao * 1e6) / 1.2; // Pa
    const T = torque; // N·m

    const d_cubed = (16 * T) / (Math.PI * tauAdm);
    const d = Math.pow(d_cubed, 1/3); // metros
    const d_mm = d * 1000;
    const d_seguro_mm = d_mm * gamma;

    document.getElementById('resultado-dimensionamento-eixos').innerHTML = `
        <h4>Resultado:</h4>
        <p>Diâmetro mínimo (teórico): <strong>${d_mm.toFixed(1)} mm</strong></p>
        <p>Diâmetro com fator de segurança (γ=${gamma}): <strong>${d_seguro_mm.toFixed(1)} mm</strong></p>
        <p>Observação: cálculo simplificado, verificar normas e condições de fadiga.</p>
    `;
}

function calcularEspessuraParedeTubo() {
    const pressaoBar = parseFloat(document.getElementById('pressao-tubo').value);
    const D_ext_mm = parseFloat(document.getElementById('diametro-externo-tubo').value);
    const tensaoMPa = parseFloat(document.getElementById('tensao-tubo').value);
    const fs = parseFloat(document.getElementById('fator-seguranca-tubo').value) || 1.5;

    if (isNaN(pressaoBar) || isNaN(D_ext_mm) || isNaN(tensaoMPa)) {
        document.getElementById('resultado-espessura-tubo').innerHTML = i18n.t('ferreng.fill_pressure_diameter_stress');
        return;
    }

    // Barlow simplificado: t = (P * D) / (2 * S * E + P)
    // onde P em MPa, D em mm, S tensão admissível (MPa), E = 1 (coeficiente de eficiência de junta)
    const P_MPa = pressaoBar * 0.1; // 1 bar = 0.1 MPa
    const D = D_ext_mm;
    const S = tensaoMPa / fs;
    const E = 1;

    const t_mm = (P_MPa * D) / (2 * S * E + P_MPa);

    document.getElementById('resultado-espessura-tubo').innerHTML = `
        <h4>Resultado:</h4>
        <p>Espessura mínima calculada: <strong>${t_mm.toFixed(2)} mm</strong></p>
        <p>Observação: fórmula de Barlow simplificada. Consulte normas (ASME/API/NBR) para aplicação prática.</p>
    `;
}

function calcularPressaoCriticaSapata() {
    const carga = parseFloat(document.getElementById('carga-sapata').value); // kN
    const largura = parseFloat(document.getElementById('largura-sapata').value); // m
    const comprimento = parseFloat(document.getElementById('comprimento-sapata').value); // m

    if (isNaN(carga) || isNaN(largura) || isNaN(comprimento)) {
        document.getElementById('resultado-pressao-sapata').innerHTML = i18n.t('ferreng.fill_load_dimensions');
        return;
    }

    const area = largura * comprimento; // m²
    const pressao = (carga) / area; // kN/m² == kPa

    document.getElementById('resultado-pressao-sapata').innerHTML = `
        <h4>Resultado:</h4>
        <p>Área da sapata: <strong>${area.toFixed(3)} m²</strong></p>
        <p>Pressão média aplicada ao solo: <strong>${pressao.toFixed(2)} kN/m² (kPa)</strong></p>
        <p>Compare com a tensão admissível do solo para verificar segurança.</p>
    `;
}

function calcularAtrito() {
    const mu = parseFloat(document.getElementById('coef-atrito').value);
    const N = parseFloat(document.getElementById('forca-normal-atrito').value);

    if (isNaN(mu) || isNaN(N)) {
        document.getElementById('resultado-atrito').innerHTML = i18n.t('ferreng.fill_friction_coeff_force');
        return;
    }

    const F = mu * N;

    document.getElementById('resultado-atrito').innerHTML = `
        <h4>Resultado:</h4>
        <p>Força de atrito estimada: <strong>${F.toFixed(2)} N</strong></p>
    `;
}

function calcularEscada() {
    const alturaTotal = parseFloat(document.getElementById('altura-escada').value); // m
    const profundidadePiso = parseFloat(document.getElementById('profundidade-piso').value); // mm (opcional)

    if (isNaN(alturaTotal)) {
        document.getElementById('resultado-escada').innerHTML = i18n.t('ferreng.fill_stair_height');
        return;
    }

    // Recomendações usuais: 2h + b = 630 mm (h = espelho em mm, b = piso em mm)
    // Escolher h entre 150-180 mm preferencialmente.
    const h_candidates = [150, 160, 170, 180];
    let chosen = h_candidates[1];
    if (!isNaN(profundidadePiso) && profundidadePiso > 0) {
        // escolher h que satisfaça 2h + b ≈ 630
        for (let h of h_candidates) {
            if (Math.abs(2*h + profundidadePiso - 630) < 20) { chosen = h; break; }
        }
    }

    const h_mm = chosen;
    const b_mm = 630 - 2*h_mm;

    const nDegraus = Math.ceil((alturaTotal * 1000) / h_mm);
    const alturaReal = (alturaTotal * 1000) / nDegraus; // mm

    document.getElementById('resultado-escada').innerHTML = `
        <h4>Resultado:</h4>
        <p>Número de degraus (aprox.): <strong>${nDegraus}</strong></p>
        <p>Espelho (h): <strong>${alturaReal.toFixed(0)} mm</strong></p>
        <p>Piso (b) recomendado: <strong>${b_mm.toFixed(0)} mm</strong></p>
        <p>Verifique normas locais (ABNT NBR) para critérios completos de segurança.</p>
    `;
}

// --- Função auxiliar para Tubos e Chapas de Inox ---
function calcularTubosChapasInox() {
    const tipo = document.getElementById('tipo-inox').value;
    const liga = document.getElementById('liga-inox') ? document.getElementById('liga-inox').value : null;
    const densidadeInput = parseFloat(document.getElementById('densidade-inox').value);
    const densidades = { AISI304: 7900, AISI316: 8000, AISI430: 7700 };
    const densidade = !isNaN(densidadeInput) ? densidadeInput : (liga && densidades[liga]) ? densidades[liga] : 8000;

    if (tipo === 'chapa') {
        const largura = parseFloat(document.getElementById('largura-chapa').value); // mm
        const comprimento = parseFloat(document.getElementById('comprimento-chapa').value); // mm
        const espessura = parseFloat(document.getElementById('espessura-chapa').value); // mm

        if (isNaN(largura) || isNaN(comprimento) || isNaN(espessura)) {
            document.getElementById('resultado-inox').innerHTML = 'Preencha largura, comprimento e espessura.';
            return;
        }

        const volume_m3 = (largura/1000) * (comprimento/1000) * (espessura/1000);
        const massa = volume_m3 * densidade;

        document.getElementById('resultado-inox').innerHTML = `
            <h4>Resultado (Chapa):</h4>
            <p>Volume: <strong>${volume_m3.toFixed(6)} m³</strong></p>
            <p>Massa estimada: <strong>${massa.toFixed(3)} kg</strong></p>
        `;
    } else {
        const D_ext = parseFloat(document.getElementById('diametro-externo-inox').value); // mm
        const t = parseFloat(document.getElementById('espessura-tubo-inox').value); // mm
        const comprimento = parseFloat(document.getElementById('comprimento-tubo-inox').value); // m

        if (isNaN(D_ext) || isNaN(t) || isNaN(comprimento)) {
            document.getElementById('resultado-inox').innerHTML = 'Preencha diâmetro externo, espessura e comprimento.';
            return;
        }

        const D_int = D_ext - 2*t; // mm
        const area_secao_mm2 = (Math.PI/4) * (D_ext*D_ext - D_int*D_int);
        const volume_m3 = (area_secao_mm2 / 1e6) * comprimento; // m³
        const massa = volume_m3 * densidade;

        document.getElementById('resultado-inox').innerHTML = `
            <h4>Resultado (Tubo):</h4>
            <p>Área da seção transversal: <strong>${area_secao_mm2.toFixed(2)} mm²</strong></p>
            <p>Volume: <strong>${volume_m3.toFixed(6)} m³</strong></p>
            <p>Massa estimada: <strong>${massa.toFixed(3)} kg</strong></p>
        `;
    }
}

// Renderiza tabelas comerciais básicas para chapas e tubos inox
window.renderTabelasInox = function() {
    // Tabela de chapas padrão (mm) com densidade 8000 kg/m3 -> peso aproximado por m²
    const chapas = [
        { esp: 1.0 }, { esp: 1.5 }, { esp: 2.0 }, { esp: 2.5 }, { esp: 3.0 }, { esp: 4.0 }, { esp: 5.0 }
    ];

    const tubos = [
        { dn: '1/2"', de: 21.3, t: 2.77, peso: 1.27 },
        { dn: '3/4"', de: 26.9, t: 2.87, peso: 1.69 },
        { dn: '1"', de: 33.7, t: 3.38, peso: 2.50 },
        { dn: '1 1/4"', de: 42.4, t: 3.56, peso: 3.39 },
        { dn: '1 1/2"', de: 48.3, t: 3.68, peso: 4.05 },
        { dn: '2"', de: 60.3, t: 3.91, peso: 5.44 }
    ];

    let html = '<div class="info-section"><h4><i class="fas fa-table"></i> Tabela de Chapas (peso por m² aproximado)</h4><table class="data-table"><thead><tr><th>Espessura (mm)</th><th>Peso (kg/m²)</th></tr></thead><tbody>';
    chapas.forEach(c => {
        const peso = (c.esp/1000) * 8000; // kg/m²
        html += `<tr><td>${c.esp}</td><td>${peso.toFixed(2)}</td></tr>`;
    });
    html += '</tbody></table></div>';

    html += '<div class="info-section"><h4><i class="fas fa-table"></i> Tabela de Tubos (exemplo, peso por metro)</h4><table class="data-table"><thead><tr><th>DN</th><th>Diâmetro Ext (mm)</th><th>Espessura (mm)</th><th>Peso (kg/m)</th></tr></thead><tbody>';
    tubos.forEach(t => {
        html += `<tr><td>${t.dn}</td><td>${t.de}</td><td>${t.t}</td><td>${t.peso}</td></tr>`;
    });
    html += '</tbody></table></div>';

    return html;
};

// Função para converter aço construção civil
function converterAcoConstrucao() {
    const tipoConversao = document.getElementById("tipo-conversao-aco").value;
    const valor = parseFloat(document.getElementById("valor-aco").value);
    
    if (isNaN(valor)) {
        document.getElementById("resultado-aco-construcao").innerHTML = "Por favor, insira um valor válido.";
        return;
    }
    
    let resultado = '';
    let descricao = '';
    
    switch(tipoConversao) {
        case 'kg-m2':
            // Converter kg para m² (considerando espessura padrão)
            const espessuraPadrao = 0.006; // 6mm em metros
            const densidadeAco = 7850; // kg/m³
            const areaM2 = valor / (espessuraPadrao * densidadeAco);
            resultado = `${valor} kg = ${areaM2.toFixed(3)} m²`;
            descricao = "Conversão considerando chapa de 6mm de espessura";
            break;
            
        case 'm2-kg':
            // Converter m² para kg (considerando espessura padrão)
            const espessuraPadrao2 = 0.006; // 6mm em metros
            const densidadeAco2 = 7850; // kg/m³
            const massaKg = valor * espessuraPadrao2 * densidadeAco2;
            resultado = `${valor} m² = ${massaKg.toFixed(2)} kg`;
            descricao = "Conversão considerando chapa de 6mm de espessura";
            break;
            
        case 'barra-linear':
            // Converter diâmetro de barra para peso linear
            const diametroMm = valor;
            const diametroM = diametroMm / 1000;
            const areaSecao = Math.PI * Math.pow(diametroM/2, 2);
            const pesoLinear = areaSecao * 7850; // kg/m
            resultado = `Barra Ø${diametroMm}mm = ${pesoLinear.toFixed(3)} kg/m`;
            descricao = "Peso linear aproximado";
            break;
            
        case 'bitola-aco':
            // Conversão de bitola CA para diâmetro
            const bitolas = {
                5: 5.0, 6: 6.0, 8: 8.0, 10: 10.0, 12: 12.0, 16: 16.0, 20: 20.0, 25: 25.0, 32: 32.0
            };
            const diametroBitola = bitolas[valor];
            if (diametroBitola) {
                const areaBitola = Math.PI * Math.pow(diametroBitola/2000, 2); // m²
                const pesoBitola = areaBitola * 7850; // kg/m
                resultado = `CA-${valor} = Ø${diametroBitola}mm = ${pesoBitola.toFixed(3)} kg/m`;
                descricao = "Bitola comercial de aço";
            } else {
                resultado = "Bitola não encontrada. Bitolas comuns: 5, 6, 8, 10, 12, 16, 20, 25, 32";
            }
            break;
    }
    
    document.getElementById("resultado-aco-construcao").innerHTML = `
        <h4>Resultado da Conversão:</h4>
        <p><strong>${resultado}</strong></p>
        <p><em>${descricao}</em></p>
    `;
}
