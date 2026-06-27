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
        hamburgerBtn.classList.toggle('is-open');
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
        showNotification(i18n.t('tc.record_deleted'), 'error');
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
        data.dateAdded = new Date().toLocaleDateString(i18n.current === 'pt' ? 'pt-BR' : (i18n.current === 'en' ? 'en-US' : 'es-ES'));

        if (storageKey === 'planos_RASP' || storageKey === 'planos_IMPACT') {
            const prefix = storageKey.split('_')[1];
            data.tag = `${prefix}-${data.transportador.toUpperCase()}-${data.id}`;
        }
        
        saveData(storageKey, data);
        showNotification(i18n.t('tc.record_saved'));
        form.reset();
        renderSavedItems(storageKey, 'lista-salvos');
    }

    // --- FUNÇÃO GENÉRICA PARA RENDERIZAR ITENS SALVOS ---
    function renderSavedItems(storageKey, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const items = JSON.parse(localStorage.getItem(storageKey)) || [];
        let dateLocale = i18n.current === 'pt' ? 'pt-BR' : (i18n.current === 'en' ? 'en-US' : 'es-ES');
        let html = `<h3>${i18n.t('tc.saved_records')} (${items.length})</h3>`;
        
        if (items.length === 0) {
            html += '<p>' + i18n.t('tc.no_records') + '</p>';
        } else {
            items.slice().reverse().forEach(item => {
                let itemContent = '';
                switch(storageKey) {
                    case 'inspecoesGerais':
                        itemContent = `<p><strong>${i18n.t('tc.tc_label')}:</strong> ${item.transportador} | <strong>${i18n.t('tc.inspector')}:</strong> ${item.inspetor}</p><p><strong>${i18n.t('tc.date')}:</strong> ${new Date(item.data).toLocaleDateString(dateLocale,{timeZone:'UTC'})} | <strong>${i18n.t('tc.saved_at')}:</strong> ${item.dateAdded}</p><p><strong>${i18n.t('tc.obs')}:</strong> ${item.observacoes || i18n.t('common.na')}</p>`;
                        break;
                    case 'planosPreventivos':
                        itemContent = `<p><strong>${i18n.t('tc.tc_label')}:</strong> ${item.transportador} | <strong>${i18n.t('tc.frequency')}:</strong> ${item.frequencia}</p><p><strong>${i18n.t('tc.tasks')}:</strong> ${item.tarefas.replace(/\n/g, ', ')}</p>`;
                        break;
                    case 'planosSeletivos':
                        itemContent = `<p><strong>${i18n.t('tc.tc_label')}:</strong> ${item.transportador} | <strong>${i18n.t('tc.component')}:</strong> ${item.componente}</p><p><strong>${i18n.t('tc.diagnosis')}:</strong> ${item.diagnostico}</p><p><strong>${i18n.t('tc.action')}:</strong> ${item.acao}</p>`;
                        break;
                    case 'planos_RASP':
                    case 'planos_IMPACT':
                        itemContent = `<p><strong>${i18n.t('tc.tag_label')}:</strong> ${item.tag}</p><p><strong>${i18n.t('tc.tc_label')}:</strong> ${item.transportador}</p><p><strong>${i18n.t('tc.plan')}:</strong> ${item.planoAcao}</p>`;
                        break;
                    case 'rolosCadastrados':
                         itemContent = `<p><strong>${i18n.t('tc.tc_label')}:</strong> ${item.tc} | <strong>${i18n.t('tc.position')}:</strong> ${item.posicao}</p><p><strong>${i18n.t('tc.type')}:</strong> ${item.tipo} | <strong>${i18n.t('tc.installed_at')}:</strong> ${new Date(item.dataInstalacao).toLocaleDateString(dateLocale,{timeZone:'UTC'})}</p>`;
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
                if (confirm(i18n.t('tc.confirm_delete'))) {
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
            <h2>${i18n.t(title)}</h2>
            <form id="${formId}" data-storage-key="${sKey}">${formContent}<button type="submit" class="btn btn-primary">${i18n.t(buttonText)}</button></form>
            <div class="saved-items-list" id="lista-salvos"></div>`;
        
        switch (page) {
            case 'dashboard':
                const keys = ['inspecoesGerais', 'planosPreventivos', 'planosSeletivos', 'planos_RASP', 'planos_IMPACT', 'rolosCadastrados'];
                const keyLabels = {
                    inspecoesGerais: 'tc.dash_inspections',
                    planosPreventivos: 'tc.dash_preventive',
                    planosSeletivos: 'tc.dash_selective',
                    planos_RASP: 'tc.dash_rasp',
                    planos_IMPACT: 'tc.dash_impact',
                    rolosCadastrados: 'tc.dash_rollers'
                };
                let listItems = keys.map(key => {
                    const count = (JSON.parse(localStorage.getItem(key)) || []).length;
                    return `<li><strong>${i18n.t(keyLabels[key])}:</strong> ${count}</li>`;
                }).join('');
                mainContent.innerHTML += `<div class="info-card"><h2>${i18n.t('tc.dashboard')}</h2><p>${i18n.t('tc.dashboard_desc')}</p><ul>${listItems}</ul></div>`;
                break;
            
            case 'inspecaoGeral':
                mainContent.innerHTML = baseHtmlForm('tc.title_insp', 'form-inspecao', 'inspecoesGerais', `
                    <label>${i18n.t('tc.tag_transp')}:</label><input type="text" name="transportador" required>
                    <label>${i18n.t('tc.inspector_name')}:</label><input type="text" name="inspetor" required>
                    <label>${i18n.t('tc.inspection_date')}:</label><input type="date" name="data" required>
                    <label>${i18n.t('tc.obs')}:</label><textarea name="observacoes" rows="4"></textarea>`, 'tc.save_inspection');
                document.getElementById('form-inspecao').addEventListener('submit', handleFormSubmit);
                renderSavedItems('inspecoesGerais', 'lista-salvos');
                break;
            
            case 'planoPreventivo':
                mainContent.innerHTML = baseHtmlForm('tc.title_preventive', 'form-preventivo', 'planosPreventivos', `
                    <label>${i18n.t('tc.tag_transp')}:</label><input type="text" name="transportador" required>
                    <label>${i18n.t('tc.frequency')}:</label><select name="frequencia" required><option value="" disabled selected>${i18n.t('tc.select_option')}</option><option value="Semanal">${i18n.t('tc.weekly')}</option><option value="Mensal">${i18n.t('tc.monthly')}</option><option value="Anual">${i18n.t('tc.yearly')}</option></select>
                    <label>${i18n.t('tc.tasks_per_line')}:</label><textarea name="tarefas" rows="5" required></textarea>`, 'tc.save_plan');
                document.getElementById('form-preventivo').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planosPreventivos', 'lista-salvos');
                break;

            case 'planoSeletivo':
                mainContent.innerHTML = baseHtmlForm('tc.title_selective', 'form-seletivo', 'planosSeletivos', `
                    <label>${i18n.t('tc.tag_transp')}:</label><input type="text" name="transportador" required>
                    <label>${i18n.t('tc.target_component')}:</label><input type="text" name="componente" required>
                    <label>${i18n.t('tc.diagnosis_anomaly')}:</label><textarea name="diagnostico" rows="3" required></textarea>
                    <label>${i18n.t('tc.corrective_action')}:</label><textarea name="acao" rows="4" required></textarea>`, 'tc.save_plan');
                document.getElementById('form-seletivo').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planosSeletivos', 'lista-salvos');
                break;

            case 'planoRaspadores':
                mainContent.innerHTML = baseHtmlForm('tc.title_rasp', 'form-raspadores', 'planos_RASP', `
                    <label>${i18n.t('tc.affected_conveyor')}:</label><input type="text" name="transportador" required>
                    <label>${i18n.t('tc.action_plan')}:</label><textarea name="planoAcao" rows="5" required></textarea>`, 'tc.generate_plan_tag');
                document.getElementById('form-raspadores').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planos_RASP', 'lista-salvos');
                break;
            
            case 'planoMesaImpacto':
                mainContent.innerHTML = baseHtmlForm('tc.title_impact', 'form-impacto', 'planos_IMPACT', `
                    <label>${i18n.t('tc.affected_conveyor')}:</label><input type="text" name="transportador" required>
                    <label>${i18n.t('tc.action_plan')}:</label><textarea name="planoAcao" rows="5" required></textarea>`, 'tc.generate_plan_tag');
                document.getElementById('form-impacto').addEventListener('submit', handleFormSubmit);
                renderSavedItems('planos_IMPACT', 'lista-salvos');
                break;

            case 'idRolos':
                mainContent.innerHTML = baseHtmlForm('tc.title_roller', 'form-rolos', 'rolosCadastrados', `
                    <label>${i18n.t('tc.tag_transp')}:</label><input type="text" name="tc" required>
                    <label>${i18n.t('tc.roller_position')}:</label><input type="text" name="posicao" placeholder="${i18n.t('tc.roller_position_ph')}" required>
                    <label>${i18n.t('tc.roller_type')}:</label><input type="text" name="tipo" required>
                    <label>${i18n.t('tc.installation_date')}:</label><input type="date" name="dataInstalacao" required>`, 'tc.register_roller');
                document.getElementById('form-rolos').addEventListener('submit', handleFormSubmit);
                renderSavedItems('rolosCadastrados', 'lista-salvos');
                break;

            case 'mapeamentoRoletes':
                const storageKeyMap = 'mapeamentoRoletes_data';
                mainContent.innerHTML += `
                    <div class="info-card">
                        <h2>${i18n.t('tc.roller_mapping_title')}</h2>
                        <p>${i18n.t('tc.roller_mapping_desc')}</p>
                        <div class="conveyor-map">${Array.from({ length: 30 }, (_, i) => `<div class="roller ok" data-id="R${i+1}" title="R${i+1} - OK">R${i+1}</div>`).join('')}</div>
                        <div class="roller-legend">
                            <div class="legend-item"><span class="legend-color-box ok"></span> OK</div>
                            <div class="legend-item"><span class="legend-color-box atencao"></span> ${i18n.t('tc.warning')}</div>
                            <div class="legend-item"><span class="legend-color-box trocar"></span> ${i18n.t('tc.replace')}</div>
                        </div>
                        <div class="map-actions">
                            <button id="save-map-btn" type="button" class="btn btn-primary">${i18n.t('tc.save_mapping')}</button>
                            <button id="clear-map-btn" class="btn danger-btn" type="button">${i18n.t('tc.clear_mapping')}</button>
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
                    showNotification(i18n.t('tc.map_saved'));
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
                    if (confirm(i18n.t('tc.confirm_clear_map'))) {
                        localStorage.removeItem(storageKeyMap);
                        loadMapState();
                        showNotification(i18n.t('tc.map_cleared'), 'error');
                    }
                });
                loadMapState();
                break;

            case 'roteiroVisual':
                mainContent.innerHTML += `<div class="info-card">${i18n.t('tc.roteiro_visual')}</div>`;
                break;
            case 'diretrizesSeguranca':
                mainContent.innerHTML += `<div class="info-card">${i18n.t('tc.diretrizes_seguranca')}</div>`;
                break;
            case 'desviosOcultos':
                mainContent.innerHTML += `<div class="info-card">${i18n.t('tc.desvios_ocultos')}</div>`;
                break;
            case 'orientacoesCampo':
                mainContent.innerHTML += `<div class="info-card">${i18n.t('tc.orientacoes_campo')}</div>`;
                break;
            
            default:
                mainContent.innerHTML += `<h2>${i18n.t('tc.page_not_found')}</h2>`;
        }
    }

    // Inicialização
    loadPage('dashboard');
});
