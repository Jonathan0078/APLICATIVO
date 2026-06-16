// Controle de navegação do menu
window.showSection = function(sectionId) {
    console.log('Mostrando seção:', sectionId); // Debug

    const contentSections = document.querySelectorAll('.content-section');
    const menuItems = document.querySelectorAll('.menu-item');
    const mainContent = document.querySelector('.main-content');
    const menu = document.querySelector('.menu-container');

    // Verifica se estamos em modo standalone
    const urlParams = new URLSearchParams(window.location.search);
    const isStandalone = urlParams.get('standalone') === 'true';
    const targetSection = urlParams.get('section');

    if (isStandalone && menu) {
        menu.style.display = 'none';  // Esconde o menu em modo standalone
        if (targetSection) {
            sectionId = targetSection;  // Usa a seção da URL
        }
    }
    
    // Primeiro, mostra o container principal
    if (mainContent) {
        mainContent.style.display = 'block';
    }

    // Esconde todas as seções e remove classes ativas
    contentSections.forEach(section => {
        if (section.id === `${sectionId}-section`) {
            section.style.display = 'block';
            section.classList.add('active');
        } else {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });

    // Atualiza os itens do menu
    menuItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Força a exibição da seção selecionada
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        // Garante que o scroll vá até a seção
        selectedSection.scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const mainContent = document.querySelector('.main-content');
    const menu = document.querySelector('.main-menu');

    // Verifica se estamos em modo standalone
    const urlParams = new URLSearchParams(window.location.search);
    const isStandalone = urlParams.get('standalone') === 'true';
    const targetSection = urlParams.get('section');

    // Se estiver em modo standalone, esconde o menu e mostra apenas a seção especificada
    if (isStandalone && menu) {
        menu.style.display = 'none';
        if (targetSection) {
            // Reorganiza o conteúdo da seção para incluir o cabeçalho
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                if (!section.querySelector('.section-header')) {
                    const header = section.querySelector('h2');
                    if (header) {
                        // Cria o novo cabeçalho da seção
                        const headerDiv = document.createElement('div');
                        headerDiv.className = 'section-header';
                        
                        // Cria o botão de voltar
                        const backButton = document.createElement('button');
                        backButton.className = 'back-button';
                        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Voltar';
                        backButton.onclick = function() {
                            const baseUrl = window.location.href.split('?')[0];
                            window.location.href = baseUrl;
                        };
                        
                        // Remove o h2 original do seu lugar e adiciona ao novo cabeçalho
                        header.remove();
                        headerDiv.appendChild(backButton);
                        headerDiv.appendChild(header);
                        
                        // Cria um container para o conteúdo
                        const contentDiv = document.createElement('div');
                        contentDiv.className = 'section-content';
                        
                        // Move todo o conteúdo restante para o novo container
                        while (section.firstChild) {
                            contentDiv.appendChild(section.firstChild);
                        }
                        
                        // Adiciona o cabeçalho e o conteúdo à seção
                        section.appendChild(headerDiv);
                        section.appendChild(contentDiv);
                    }
                }
            });
            
            window.showSection(targetSection);
        }
    }

    // Função para inicializar as seções com o conteúdo correto
    function initializeSections() {
        const sections = {
            'capture': ['.sensor-controls', '.input-column'],
            'analysis': ['.output-column', '#fft-output'],
            'diagnostic': ['#interpretation-section', '#alerts-section'],
            '3d-view': ['#spectral-3d-section'],
            'reports': ['#reports-tab'],
            'database': ['#database-tools'],
            'settings': ['#settings-section']
        };

        // Verifica se estamos em modo popup
        const isPopup = new URLSearchParams(window.location.search).get('popup') === '1';
        if (isPopup) {
            mainContent.style.display = 'block';
        }

        // Move (não clona) o conteúdo para as seções apropriadas
        Object.entries(sections).forEach(([sectionId, selectors]) => {
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                selectors.forEach(selector => {
                    const content = document.querySelector(selector);
                    if (content && !targetSection.querySelector(selector)) {
                        targetSection.appendChild(content);
                    }
                });
            }
        });
    }

    // Adiciona evento de clique para abrir seções em nova aba
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                // Remove qualquer hash existente e adiciona os parâmetros
                const currentUrl = new URL(window.location.href.split('#')[0]);
                currentUrl.searchParams.set('section', sectionId);
                currentUrl.searchParams.set('standalone', 'true');
                
                // Abre em uma nova aba e previne o comportamento padrão
                const newWindow = window.open(currentUrl.toString(), '_blank');
                if (newWindow) {
                    newWindow.focus();
                }

                // Força a exibição da seção selecionada
                const selectedSection = document.getElementById(`${sectionId}-section`);
                if (selectedSection) {
                    selectedSection.style.display = 'block';
                }
            }
        });
    });

    // Ouve por mudanças no hash e carrega a seção correta
    window.addEventListener('hashchange', () => {
        const hash = location.hash ? decodeURIComponent(location.hash.replace('#', '')) : 'capture';
        window.showSection(hash);
    });

    // Inicializa as seções e configura o estado inicial
    initializeSections();

    // Configura o estado inicial da página
    const initialHash = location.hash ? decodeURIComponent(location.hash.replace('#', '')) : 'capture';
    
    // Mostra a seção inicial
    window.showSection(initialHash);

    // Verifica novamente o modo popup para garantir que o conteúdo principal seja exibido
    if (new URLSearchParams(window.location.search).get('popup') === '1') {
        mainContent.style.display = 'block';
    }
    const isPopup = new URLSearchParams(window.location.search).has('popup');

    if (isPopup && initialHash) {
        // Se for um popup, esconde o menu principal e mostra a seção
        if (mainContent) mainContent.style.display = 'none';
        window.showSection(initialHash);
    } else {
        // Na página principal, esconde todas as seções e o conteúdo principal
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        if (mainContent) mainContent.style.display = 'none';
    }
    
    // Se a página foi aberta como "popup" (nova aba do menu), escondemos a grade do menu
    // e mostramos o conteúdo principal diretamente para parecer uma página dedicada.
    try {
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get('popup') === '1') {
            const mainMenu = document.querySelector('.main-menu');
            const mainContent = document.querySelector('.main-content');
            if (mainMenu) mainMenu.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            // adiciona classe para desabilitar animações/transições na nova aba
            try { document.documentElement.classList.add('popup-mode'); } catch (e) { /* noop */ }
        }
    } catch (e) {
        // noop
    }
});
