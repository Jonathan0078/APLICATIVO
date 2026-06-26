const greasespa = (typeof showCalculator !== 'undefined');

function createCalculatorMenu() {
    // Prevent duplicate sidebar in SPA mode
    if (document.getElementById('calculator-sidebar')) return;
    const calculadoras = [
        { nome: 'Cálculo de Mistura de Óleos', arquivo: 'Calculadora2v.html', icone: 'fas fa-tint', key: 'grease.menu.mistura' },
        { nome: 'Fluxo de Óleo em Mancais', arquivo: 'CalculadoraDFAACP.html', icone: 'fas fa-water', key: 'grease.menu.fluxo' },
        { nome: 'Fator de Multiplicação', arquivo: 'CalculadoraFM.html', icone: 'fas fa-calculator', key: 'grease.menu.fator_mult' },
        { nome: 'Fator de Redução de Moto-Turbina', arquivo: 'CalculadoraFRMT.html', icone: 'fas fa-cogs', key: 'grease.menu.fator_red' },
        { nome: 'Frequência de Troca', arquivo: 'CalculadoraFT.html', icone: 'fas fa-clock', key: 'grease.menu.freq_troca' },
        { nome: 'Grau de Qualidade', arquivo: 'CalculadoraGq.html', icone: 'fas fa-star', key: 'grease.menu.grau_qualidade' },
        { nome: 'Cálculo H', arquivo: 'CalculadoraH.html', icone: 'fas fa-chart-line', key: 'grease.menu.calc_h' },
        { nome: 'Índice de Viscosidade', arquivo: 'CalculadoraIV.html', icone: 'fas fa-thermometer-half', key: 'grease.menu.indice_visc' },
        { nome: 'Viscosidade a Alta Pressão', arquivo: 'CalculadoraVAE.html', icone: 'fas fa-compress', key: 'grease.menu.visc_alta_pressao' },
        { nome: 'Viscosidade de Graxas', arquivo: 'CalculadoraVGR.html', icone: 'fas fa-oil-can', key: 'grease.menu.visc_graxas' }
    ];

    const overlay = document.createElement('div');
    overlay.className = 'calculator-overlay'; 
    overlay.id = 'calculator-overlay';
    overlay.onclick = closeCalculatorMenu;

    const sidebar = document.createElement('nav');
    sidebar.className = 'calculator-sidebar'; 
    sidebar.id = 'calculator-sidebar';

    const tituloProgramas = typeof i18n !== 'undefined' ? i18n.t('nav.programs') : 'Programas';

    const header = document.createElement('div');
    header.className = 'calculator-menu-header';
    header.innerHTML = `<h2><i class="fas fa-tools"></i> <span data-i18n="nav.programs">${tituloProgramas}</span></h2>`;

    const menuList = document.createElement('ul');
    menuList.className = 'calculator-menu-list';
    menuList.style.listStyle = 'none';

    const currentPage = window.location.pathname.split('/').pop();
    const currentHash = window.location.hash.replace('#', '');

    calculadoras.forEach(calc => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'calculator-menu-item';
        link.href = greasespa ? '#' : calc.arquivo;
        
        const nomeTraduzido = typeof i18n !== 'undefined' ? i18n.t(calc.key) : calc.nome;
        link.innerHTML = `<i class="${calc.icone}"></i> <span data-i18n="${calc.key}">${nomeTraduzido}</span>`;
        
        if (currentHash === calc.arquivo || currentPage === calc.arquivo) {
            link.style.color = 'var(--accent-color)';
        }
        
        link.addEventListener('click', function(e) {
            if (greasespa) {
                e.preventDefault();
                closeCalculatorMenu();
                if (typeof showCalculator === 'function') {
                    showCalculator(calc.arquivo);
                }
            }
        });
        
        li.appendChild(link);
        menuList.appendChild(li);
    });

    const liHome = document.createElement('li');
    const tituloInicio = typeof i18n !== 'undefined' ? i18n.t('nav.home') : 'Início';
    const homeLink = document.createElement('a');
    homeLink.className = 'calculator-menu-item home-button';
    homeLink.href = greasespa ? '#' : '../../index.html';
    homeLink.innerHTML = `<i class="fas fa-home"></i> <span data-i18n="nav.home">${tituloInicio}</span>`;
    homeLink.addEventListener('click', function(e) {
        if (greasespa) {
            e.preventDefault();
            closeCalculatorMenu();
            if (typeof showHome === 'function') showHome();
        }
    });
    liHome.appendChild(homeLink);
    menuList.appendChild(liHome);

    sidebar.appendChild(header);
    sidebar.appendChild(menuList);

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);
}

function setupMenuButton() {
    createCalculatorMenu();
    
    // Suporta o botão quer utilize a classe '.menu-button' ou '.hamburger-menu' no HTML
    const menuButton = document.querySelector('.menu-button') || document.querySelector('.hamburger-menu');
    if (menuButton) {
        menuButton.addEventListener('click', toggleCalculatorMenu);
        menuButton.removeAttribute('onclick');
    }
}

function toggleCalculatorMenu() {
    const overlay = document.getElementById('calculator-overlay');
    const sidebar = document.getElementById('calculator-sidebar');
    if (overlay && sidebar) {
        if (sidebar.classList.contains('active')) closeCalculatorMenu();
        else openCalculatorMenu();
    }
}

function openCalculatorMenu() {
    const overlay = document.getElementById('calculator-overlay');
    const sidebar = document.getElementById('calculator-sidebar');
    if (overlay && sidebar) {
        // A adição da classe .active ativa as transições e o visibility no CSS
        overlay.classList.add('active');
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCalculatorMenu() {
    const overlay = document.getElementById('calculator-overlay');
    const sidebar = document.getElementById('calculator-sidebar');
    if (overlay && sidebar) {
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', setupMenuButton);
