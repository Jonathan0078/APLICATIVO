

// Função para criar o menu hambúrguer nas calculadoras
function createCalculatorMenu() {
    // Lista das calculadoras disponíveis
    const calculadoras = [
        { nome: 'Cálculo de Mistura de Óleos', arquivo: 'Calculadora2v.html', icone: 'fas fa-tint' },
        { nome: 'Fluxo de Óleo em Mancais', arquivo: 'CalculadoraDFAACP.html', icone: 'fas fa-water' },
        { nome: 'Fator de Multiplicação', arquivo: 'CalculadoraFM.html', icone: 'fas fa-calculator' },
        { nome: 'Fator de Redução de Moto-Turbina', arquivo: 'CalculadoraFRMT.html', icone: 'fas fa-cogs' },
        { nome: 'Frequência de Troca', arquivo: 'CalculadoraFT.html', icone: 'fas fa-clock' },
        { nome: 'Grau de Qualidade', arquivo: 'CalculadoraGq.html', icone: 'fas fa-star' },
        { nome: 'Cálculo H', arquivo: 'CalculadoraH.html', icone: 'fas fa-chart-line' },
        { nome: 'Índice de Viscosidade', arquivo: 'CalculadoraIV.html', icone: 'fas fa-thermometer-half' },
        { nome: 'Viscosidade a Alta Pressão', arquivo: 'CalculadoraVAE.html', icone: 'fas fa-compress' },
        { nome: 'Viscosidade de Graxas', arquivo: 'CalculadoraVGR.html', icone: 'fas fa-oil-can' }
    ];

    // Cria o overlay
    const overlay = document.createElement('div');
    overlay.id = 'calculator-overlay';
    overlay.className = 'calculator-overlay';
    
    // Cria o menu lateral
    const sidebarMenu = document.createElement('div');
    sidebarMenu.id = 'calculator-sidebar';
    sidebarMenu.className = 'calculator-sidebar';
    
    // Cabeçalho do menu
    const menuHeader = document.createElement('div');
    menuHeader.className = 'calculator-menu-header';
    menuHeader.innerHTML = `
        <h2><i class="fas fa-calculator"></i> GreasePRO</h2>
        <button class="close-calculator-menu" id="close-calculator-menu">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Lista de calculadoras
    const menuList = document.createElement('div');
    menuList.className = 'calculator-menu-list';
    
    // Botão para voltar ao menu principal
    const homeButton = document.createElement('a');
    homeButton.href = './index.html';
    homeButton.className = 'calculator-menu-item home-button';
    homeButton.innerHTML = '<i class="fas fa-home"></i> Menu Principal';
    menuList.appendChild(homeButton);
    
    // Adiciona as calculadoras
    calculadoras.forEach(calc => {
        const menuItem = document.createElement('a');
        menuItem.href = calc.arquivo;
        menuItem.className = 'calculator-menu-item';
        menuItem.innerHTML = `<i class="${calc.icone}"></i> ${calc.nome}`;
        menuList.appendChild(menuItem);
    });
    
    // Monta o menu
    sidebarMenu.appendChild(menuHeader);
    sidebarMenu.appendChild(menuList);
    
    // Adiciona ao body
    document.body.appendChild(overlay);
    document.body.appendChild(sidebarMenu);
    
    return { overlay, sidebarMenu };
}

// Função para configurar o botão do menu existente no cabeçalho
function setupMenuButton() {
    // Busca pelo botão existente no cabeçalho
    const menuButton = document.querySelector('.menu-button');
    
    if (menuButton) {
        // Cria o menu se ainda não existir
        if (!document.getElementById('calculator-sidebar')) {
            const { overlay, sidebarMenu } = createCalculatorMenu();
            
            // Configura os event listeners
            menuButton.addEventListener('click', function(e) {
                e.preventDefault();
                toggleCalculatorMenu();
            });
            
            // Fechar menu ao clicar no overlay
            overlay.addEventListener('click', function() {
                closeCalculatorMenu();
            });
            
            // Fechar menu ao clicar no botão X
            document.getElementById('close-calculator-menu').addEventListener('click', function() {
                closeCalculatorMenu();
            });
        }
        
        // Remove onclick existente
        menuButton.removeAttribute('onclick');
        
        // Garante que o botão tenha o ícone correto
        if (!menuButton.querySelector('i')) {
            menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
}

// Função para abrir/fechar o menu
function toggleCalculatorMenu() {
    const overlay = document.getElementById('calculator-overlay');
    const sidebar = document.getElementById('calculator-sidebar');
    
    if (overlay && sidebar) {
        const isOpen = sidebar.classList.contains('active');
        
        if (isOpen) {
            closeCalculatorMenu();
        } else {
            openCalculatorMenu();
        }
    }
}

// Função para abrir o menu
function openCalculatorMenu() {
    const overlay = document.getElementById('calculator-overlay');
    const sidebar = document.getElementById('calculator-sidebar');
    
    if (overlay && sidebar) {
        overlay.classList.add('active');
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar o menu
function closeCalculatorMenu() {
    const overlay = document.getElementById('calculator-overlay');
    const sidebar = document.getElementById('calculator-sidebar');
    
    if (overlay && sidebar) {
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', setupMenuButton);

