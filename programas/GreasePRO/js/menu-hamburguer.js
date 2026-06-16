document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('overlay');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    
    // Clone o menu desktop para criar o menu mobile
    const mobileMenu = sidebarWrapper.cloneNode(true);
    mobileMenu.classList.remove('menu-desktop');
    mobileMenu.classList.add('menu-mobile');
    document.body.appendChild(mobileMenu);

    // Função para alternar o menu
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Função para o botão "Acessar Calculadoras" que apenas abre o menu
    window.showCalculators = function () {
        if (!mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    };

    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link
    const mobileLinks = mobileMenu.getElementsByTagName('a');
    Array.from(mobileLinks).forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active') && link.href.includes('mostrarfame')) {
                toggleMenu();
            }
        });
    });

    // Ajustar menu em resize da janela
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});