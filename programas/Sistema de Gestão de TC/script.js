document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DOS ELEMENTOS PRINCIPAIS DA INTERFACE ---
    const mainContent = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.sidebar nav a');

    // --- FUNÇÕES DE CONTROLE DA INTERFACE (UI/UX) ---
    function toggleMenu() {
        sidebar.classList.toggle('is-open');
        overlay.classList.toggle('is-active');
    }
    function closeMenuOnLinkClick() {
        if (sidebar.classList.contains('is-open')) {
            toggleMenu();
        }
    }
    function setActiveLink(currentPage) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // --- EVENT LISTENERS DA INTERFACE ---
    hamburgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
            closeMenuOnLinkClick();
        });
    });

    // --- FUNÇÕES DE DADOS (localStorage) ---
    function showNotification(message, type = 'success') {
        const notificationArea = document.getElementById('notification-area');
        if (!notificationArea) return;
        notificationArea.innerHTML = `<div class="notification ${type}">${message}</div>`;
        setTimeout(() => {
            if (notificationArea) notificationArea.innerHTML = '';
        }, 4000);
    }

    function saveData(key, data) {
        let items = JSON.parse(localStorage.getItem(key)) || [];
        items.push(data);
        localStorage.setItem(key, JSON.stringify(items));
    }

    function deleteItem(key, id) {
        let items = JSON.parse(localStorage.getItem(key)) || [];
        const updatedItems = items.filter(item => item.id.toString() !== id.toString());
        localStorage.setItem(key, JSON.stringify(updatedItems));
        showNotification('Registro excluído com sucesso!', 'error');
    }

    // --- FUNÇÃO GENÉRICA PARA LIDAR COM FORMULÁRIOS ---
    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const storageKey = form.dataset.storageKey;
        if (!storageKey) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.id = Date.now();
        data.dateAdded = new Date().toLocaleDateString('pt-BR');

        if (storageKey === 'planos_RASP' || storageKey === 'planos_IMPACT') {
            const prefix = storageKey.split('_')[1];
            data.tag = `${prefix}-${data.transportador.toUpperCase()}-${data.id}`;
        }
        
        saveData(storageKey, data);
        showNotification('Registro salvo com sucesso!');
        form.reset();
        renderSavedItems(storageKey, 'lista-salvos');
    }

    // --- FUNÇÃO GENÉRICA PARA RENDERIZAR ITENS SALVOS ---
    function renderSavedItems(storageKey, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const items = JSON.parse(localStorage.getItem(storageKey)) || [];
        let html = `<h3>Registros Salvos (${items.length})</h3>`;
        
        if (items.length === 0) {
            html += '<p>Nenhum registro encontrado.</p>';
        } else {
            items.slice().reverse().forEach(item => {
                let itemContent = '';
                switch(storageKey) {
                    case 'inspecoesGerais':
                        itemContent = `<p><strong>TC:</strong> ${item.transportador} | <strong>Inspetor:</strong> ${item.inspetor}</p><p><strong>Data:</strong> ${new Date(item.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})} | <strong>Salvo em:</strong> ${item.dateAdded}</p><p><strong>Obs:</strong> ${item.observacoes || 'N/A'}</p>`;
                        break;
                    case 'planosPreventivos':
                        itemContent = `<p><strong>TC:</strong> ${item.transportador} | <strong>Frequência:</strong> ${item.frequencia}</p><p><strong>Tarefas:</strong> ${item.tarefas.replace(/\n/g, ', ')}</p>`;
                        break;
                    case 'planosSeletivos':
                        itemContent = `<p><strong>TC:</strong> ${item.transportador} | <strong>Componente:</strong> ${item.componente}</p><p><strong>Diagnóstico:</strong> ${item.diagnostico}</p><p><strong>Ação:</strong> ${item.acao}</p>`;
                        break;
                    case 'planos_RASP':
                    case 'planos_IMPACT':
                        itemContent = `<p><strong>TAG:</strong> ${item.tag}</p><p><strong>TC:</strong> ${item.transportador}</p><p><strong>Plano:</strong> ${item.planoAcao}</p>`;
                        break;
                    case 'rolosCadastrados':
                         itemContent = `<p><strong>TC:</strong> ${item.tc} | <strong>Posição:</strong> ${item.posicao}</p><p><strong>Tipo:</strong> ${item.tipo} | <strong>Instalado em:</strong> ${new Date(item.dataInstalacao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</p>`;
                        break;
                }
                html += `<div class="saved-item">${itemContent}<button class="delete-btn" data-id="${item.id}" data-key="${storageKey}">X</button></div>`;
            });
        }
        container.innerHTML = html;

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToDelete = e.target.dataset.id;
                const key = e.target.dataset.key;
                if (confirm('Tem certeza que deseja excluir este registro?')) {
                    deleteItem(key, idToDelete);
                    renderSavedItems(key, containerId);
                }
            });
        });
    }

    // --- FUNÇÕES DE CONTEÚDO E CARREGAMENTO DE PÁGINA ---
    function loadPage(page) {
        mainContent.innerHTML = '<div id="notification-area"></div>';
        setActiveLink(page);
        
        const baseHtmlForm = (title, formId, sKey, formContent, buttonText) => `
            <h2>${title}</h2>
            <form id="${formId}" data-storage-key="${sKey}">${formContent}<button type="submit" class="btn btn-primary">${buttonText}</button></form>
            <div class="saved-items-list" id="lista-salvos"></div>`;
        
        switch (page) {
            case 'dashboard':
                const keys = ['inspecoesGerais', 'planosPreventivos', 'planosSeletivos', 'planos_RASP', 'planos_IMPACT', 'rolosCadastrados'];
                let listItems = keys.map(key => {
                    const name = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    const count = (JSON.parse(localStorage.getItem(key)) || []).length;
                    return `<li><strong>${name}:</strong> ${count}</li>`;
                }).join('');
                mainContent.innerHTML += `<div class="info-card"><h2>Dashboard</h2><p>Contagem de registros salvos em cada categoria:</p><ul>${listItems}</ul></div>`;
                break;
            
            case 'inspecaoGeral':
                mainContent.innerHTML = baseHtmlForm('1. Inspeção Geral de TC', 'form-inspecao', 'inspecoesGerais', `
                    <label>TAG do Transportador:</label><input type="text" name="transportador" required>
                    <label>Nome do Inspetor:</label><input type="text" name="inspetor" required>
                    <label>Data da Inspeção:</label><input type="date" name="data" required>
                    <label>Observações:</label><textarea name="observacoes" rows="4"></textarea>`, 'Salvar Inspeção');
                document.getElementById('form-inspecao').addEventListener('submit', handleFormSubmit);
                renderSavedItems('inspecoesGerais', 'lista-salvos');
                break;
            
            case 'planoPreventivo':
                mainContent.innerHTML = baseHtmlForm('2.1. Plano de Manutenção Preventiva', 'form-preventivo', 'planosPreventivos', `
                    <label>TAG do Transportador:</label><input type="text" name="transportador" required>
                    <label>Frequência:</label><select name="frequencia" required><option value="" disabled selected>Selecione</option><option value="Semanal">Semanal</option><option value="Mensal">Mensal</option><option value="Anual">Anual</option></select>
                    <label>Tarefas (uma por linha):</label><textarea name="tarefas" rows="5" required></textarea>`, 'Salvar Plano');
                document.getElementById('form-preventivo').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planosPreventivos', 'lista-salvos');
                break;

            case 'planoSeletivo':
                mainContent.innerHTML = baseHtmlForm('2.3. Plano Seletivo', 'form-seletivo', 'planosSeletivos', `
                    <label>TAG do Transportador:</label><input type="text" name="transportador" required>
                    <label>Componente Alvo:</label><input type="text" name="componente" required>
                    <label>Diagnóstico / Anomalia:</label><textarea name="diagnostico" rows="3" required></textarea>
                    <label>Ação Corretiva Proposta:</label><textarea name="acao" rows="4" required></textarea>`, 'Salvar Plano');
                document.getElementById('form-seletivo').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planosSeletivos', 'lista-salvos');
                break;

            case 'planoRaspadores':
                mainContent.innerHTML = baseHtmlForm('2.4. Plano para Raspadores e TAG', 'form-raspadores', 'planos_RASP', `
                    <label>Transportador Afetado:</label><input type="text" name="transportador" required>
                    <label>Plano de Ação:</label><textarea name="planoAcao" rows="5" required></textarea>`, 'Gerar Plano e TAG');
                document.getElementById('form-raspadores').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planos_RASP', 'lista-salvos');
                break;
            
            case 'planoMesaImpacto':
                mainContent.innerHTML = baseHtmlForm('2.5. Plano para Mesa de Impacto e TAG', 'form-impacto', 'planos_IMPACT', `
                    <label>Transportador Afetado:</label><input type="text" name="transportador" required>
                    <label>Plano de Ação:</label><textarea name="planoAcao" rows="5" required></textarea>`, 'Gerar Plano e TAG');
                document.getElementById('form-impacto').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planos_IMPACT', 'lista-salvos');
                break;

            case 'idRolos':
                mainContent.innerHTML = baseHtmlForm('2.6. Identificação de Rolos', 'form-rolos', 'rolosCadastrados', `
                    <label>TAG do Transportador:</label><input type="text" name="tc" required>
                    <label>Posição do Rolo:</label><input type="text" name="posicao" placeholder="Ex: Carga 15" required>
                    <label>Tipo/Modelo do Rolo:</label><input type="text" name="tipo" required>
                    <label>Data de Instalação:</label><input type="date" name="dataInstalacao" required>`, 'Cadastrar Rolo');
                document.getElementById('form-rolos').addEventListener('submit', handleFormSubmit);
                renderSavedItems('rolosCadastrados', 'lista-salvos');
                break;

            case 'mapeamentoRoletes':
                const storageKeyMap = 'mapeamentoRoletes_data';
                mainContent.innerHTML += `
                    <div class="info-card">
                        <h2>2.7 Mapeamento de Roletes</h2>
                        <p>Clique em um rolete para alterar seu status e depois salve as alterações.</p>
                        <div class="conveyor-map">${Array.from({ length: 30 }, (_, i) => `<div class="roller ok" data-id="R${i+1}" title="R${i+1} - OK">R${i+1}</div>`).join('')}</div>
                        <div class="roller-legend">
                            <div class="legend-item"><span class="legend-color-box ok"></span> OK</div>
                            <div class="legend-item"><span class="legend-color-box atencao"></span> Atenção</div>
                            <div class="legend-item"><span class="legend-color-box trocar"></span> Trocar</div>
                        </div>
                        <div class="map-actions">
                            <button id="save-map-btn" type="button" class="btn btn-primary">Salvar Mapeamento</button>
                            <button id="clear-map-btn" class="btn danger-btn" type="button">Limpar Mapeamento</button>
                        </div>
                    </div>`;
                const rollers = document.querySelectorAll('.roller');
                const saveMapState = () => {
                    const mapState = {};
                    rollers.forEach(roller => {
                        let status = 'ok';
                        if (roller.classList.contains('atencao')) status = 'atencao';
                        if (roller.classList.contains('trocar')) status = 'trocar';
                        mapState[roller.dataset.id] = status;
                    });
                    localStorage.setItem(storageKeyMap, JSON.stringify(mapState));
                    showNotification('Mapeamento salvo com sucesso!');
                };
                const loadMapState = () => {
                    const savedState = JSON.parse(localStorage.getItem(storageKeyMap));
                    if (savedState) {
                        rollers.forEach(roller => {
                            const status = savedState[roller.dataset.id] || 'ok';
                            roller.className = `roller ${status}`;
                            roller.title = `${roller.dataset.id} - ${status.toUpperCase()}`;
                        });
                    }
                };
                rollers.forEach(roller => {
                    roller.addEventListener('click', () => {
                        if (roller.classList.contains('trocar')) {
                            roller.className = 'roller ok';
                        } else if (roller.classList.contains('atencao')) {
                            roller.className = 'roller trocar';
                        } else {
                            roller.className = 'roller atencao';
                        }
                    });
                });
                document.getElementById('save-map-btn').addEventListener('click', saveMapState);
                document.getElementById('clear-map-btn').addEventListener('click', () => {
                    if (confirm('Tem certeza que deseja limpar todo o mapeamento?')) {
                        localStorage.removeItem(storageKeyMap);
                        loadMapState();
                        showNotification('Mapeamento limpo.', 'error');
                    }
                });
                loadMapState();
                break;

            case 'roteiroVisual':
                mainContent.innerHTML += `<div class="info-card"><h2>2.2. Roteiro de Inspeção Visual</h2><p>Este roteiro auxilia o inspetor a focar nos pontos críticos durante uma inspeção de campo.</p><h3>Checklist de Rota de Inspeção</h3><ul><li><strong>Área de Carga:</strong> Verificar derramamento, condição da mesa de impacto, alinhamento das guias laterais, cortinas de borracha.</li><li><strong>Percurso da Correia (Lado Carga):</strong> Observar o alinhamento da correia, roletes de carga travados, quebrados ou ruidosos. Procurar por limpeza da estrutura.</li><li><strong>Percurso da Correia (Lado Retorno):</strong> Observar o alinhamento da correia no retorno, roletes de retorno travados ou com acúmulo de material.</li><li><strong>Área de Descarga:</strong> Verificar condição do raspador primário e secundário, acúmulo de material no tambor de acionamento, e se o material cai corretamente no chute de descarga.</li><li><strong>Acionamento e Esticador:</strong> Inspecionar visualmente por vazamentos no redutor, ruídos anormais no motor, e condição geral do sistema de esticamento (contrapeso, parafusos, etc).</li><li><strong>Segurança:</strong> Checar se todas as guardas de proteção estão no lugar e botões de emergência acessíveis.</li></ul></div>`;
                break;
            case 'diretrizesSeguranca':
                mainContent.innerHTML += `<div class="info-card"><h2>2.8. Diretrizes de Segurança em TC</h2><h3>Procedimentos Essenciais de Segurança - REGRA DE OURO</h3><p><strong>NENHUMA tarefa justifica o risco. A segurança é INEGOCIÁVEL.</strong></p><ul><li><strong>Bloqueio e Etiquetagem (LOTO):</strong> SEMPRE desenergize, bloqueie e etiquete o equipamento antes de QUALQUER intervenção. Confirme a energia zero no painel e localmente.</li><li><strong>EPIs Obrigatórios:</strong> Uso obrigatório de capacete com jugular, óculos de segurança, protetor auricular, luvas de proteção adequadas à tarefa, e botas de segurança com biqueira de aço.</li><li><strong>Análise de Risco da Tarefa (ART):</strong> Preencha uma ART antes de iniciar qualquer trabalho não rotineiro.</li><li><strong>Guardas de Proteção:</strong> É PROIBIDO operar o transportador sem todas as guardas de proteção devidamente instaladas e fixadas. Inspecione-as sempre.</li><li><strong>Pontos de Pinçamento (Nip Points):</strong> Mantenha-se afastado de todos os pontos rotativos onde o corpo ou roupas possam ser puxados: tambores, roletes, esticadores e acionamentos.</li></ul></div>`;
                break;
            case 'desviosOcultos':
                mainContent.innerHTML += `<div class="info-card"><h2>2.9. Desvios Ocultos em TC</h2><h3>O que os Olhos Não Veem</h3><p>A verdadeira manutenção preditiva busca os sinais antes da falha. Fique atento a:</p><ul><li><strong>Análise de Ruído:</strong> Um leve chiado pode ser um rolamento de rolete começando a falhar. Grave o som com o celular e compare ao longo do tempo.</li><li><strong>Análise de Vibração:</strong> Pode indicar desalinhamento, roletes excêntricos ou problemas na emenda da correia. Use as mãos (com segurança) ou equipamentos para sentir vibrações na estrutura.</li><li><strong>Termografia:</strong> Um aumento de temperatura é um indicador poderoso. Use um termômetro infravermelho para checar mancais, redutores e motores. Compare componentes similares.</li><li><strong>Acúmulo de Material:</strong> Pó fino sob os roletes de retorno ("caspa" do transportador) sinaliza desgaste da cobertura da correia ou raspadores ineficientes. Analise a origem do material.</li><li><strong>Monitoramento da Corrente do Motor:</strong> Um aumento súbito ou gradual na corrente elétrica do motor (ver no painel elétrico) indica aumento de esforço, causado por roletes travados, desalinhamento ou atrito excessivo.</li></ul></div>`;
                break;
            case 'orientacoesCampo':
                mainContent.innerHTML += `<div class="info-card"><h2>2.10. Orientações Básicas para Inspeções em Campo</h2><h3>Como Realizar uma Inspeção Eficaz e Segura</h3><ol><li><strong>Planeje a Rota:</strong> Revise o roteiro visual (item 2.2) e saiba quais transportadores serão inspecionados. Verifique permissões de trabalho.</li><li><strong>Inspeção com Equipamento Parado (LOTO):</strong> Com o equipamento devidamente bloqueado, faça uma inspeção tátil e próxima dos componentes. Verifique folgas, desgaste e fixação.</li><li><strong>Inspeção com Equipamento em Operação:</strong> A uma distância segura, observe o comportamento dinâmico: alinhamento da correia, ruídos, vibrações, eficiência dos raspadores.</li><li><strong>Registre TUDO:</strong> Use este software para registrar cada anomalia. Fotografe e descreva detalhadamente (localização, severidade).</li><li><strong>Priorize os Desvios:</strong> Classifique os problemas encontrados por criticidade (ex: P1-Emergencial, P2-Urgente, P3-Programável) para facilitar a criação dos planos de ação.</li><li><strong>Comunique Imediatamente:</strong> Ao final da inspeção, comunique os pontos críticos (P1) para a equipe de operação e manutenção. Crie os planos de ação necessários.</li></ol></div>`;
                break;
            
            default:
                mainContent.innerHTML += `<h2>Página não encontrada</h2>`;
        }
    }

    // Inicialização
    loadPage('dashboard');
});
