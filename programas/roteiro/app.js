document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DA APLICAÇÃO ---
    let entries = JSON.parse(localStorage.getItem('roteiroLubrificacao')) || [];
    let currentComponents = [];
    let editId = null;

    // --- ELEMENTOS DO DOM ---
    const form = document.getElementById('lubForm');
    const componentsListEl = document.getElementById('componentsList');
    const componentTypeEl = document.getElementById('componentType');
    const componentTypeOtherEl = document.getElementById('componentTypeOther');
    const containerTypeOther = document.getElementById('containerTypeOther');
    const componentQtyEl = document.getElementById('componentQty');
    const componentLubEl = document.getElementById('componentLub');
    const addComponentBtn = document.getElementById('addComponentBtn');
    
    const tbody = document.querySelector('#entriesTable tbody');
    const searchInput = document.getElementById('search');
    const filterPeriodo = document.getElementById('filterPeriodo');
    const themeToggle = document.getElementById('theme-toggle-checkbox');

    // --- LÓGICA DO TEMA (DARK MODE) ---
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- LÓGICA DE MÚLTIPLOS COMPONENTES ---
    componentTypeEl.addEventListener('change', (e) => {
        if (e.target.value === 'outro') {
            containerTypeOther.style.display = 'block';
        } else {
            containerTypeOther.style.display = 'none';
            componentTypeOtherEl.value = '';
        }
    });

    addComponentBtn.addEventListener('click', () => {
        let type = componentTypeEl.value === 'outro' ? componentTypeOtherEl.value : componentTypeEl.options[componentTypeEl.selectedIndex]?.text;
        const qty = componentQtyEl.value || 1;
        const lub = componentLubEl.value;

        if (!componentTypeEl.value || (componentTypeEl.value === 'outro' && !type)) {
            alert(i18n.t('roteiro.alert_select_component'));
            return;
        }

        currentComponents.push({ id: Date.now(), type, qty, lub });
        renderComponentsList();
        
        componentTypeEl.value = '';
        containerTypeOther.style.display = 'none';
        componentTypeOtherEl.value = '';
        componentQtyEl.value = '';
        componentLubEl.value = '';
    });

    window.removeComponent = (id) => {
        currentComponents = currentComponents.filter(c => c.id !== id);
        renderComponentsList();
    };

    function renderComponentsList() {
        // Atualizado para utilizar as novas variáveis do design system (var(--bg), var(--border), var(--primary), etc.)
        componentsListEl.innerHTML = currentComponents.map(comp => `
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--bg); border: 1px solid var(--border); padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; color: var(--text);">
                <span style="font-weight: bold; color: var(--primary);">${comp.qty}x</span>
                <span>${comp.type}</span>
                ${comp.lub ? `<span style="color: var(--text-secondary);">(${comp.lub})</span>` : ''}
                <button type="button" onclick="removeComponent(${comp.id})" style="background: none; border: none; color: var(--cor-erro); cursor: pointer; padding: 0 0.2rem;"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `).join('');
    }

    // --- CÁLCULO INTELIGENTE DE DATAS ---
    function calculateNextDate(dateStr, period) {
        if (!dateStr || !period) return '--';
        const date = new Date(dateStr + 'T12:00:00'); 
        const p = period.toLowerCase();
        
        if (p.includes('semanal') || p.includes('7 dias')) date.setDate(date.getDate() + 7);
        else if (p.includes('quinzenal') || p.includes('15 dias')) date.setDate(date.getDate() + 15);
        else if (p.includes('mensal') || p.includes('1 mês')) date.setMonth(date.getMonth() + 1);
        else if (p.includes('bimestral') || p.includes('2 meses')) date.setMonth(date.getMonth() + 2);
        else if (p.includes('trimestral') || p.includes('3 meses')) date.setMonth(date.getMonth() + 3);
        else if (p.includes('semestral') || p.includes('6 meses')) date.setMonth(date.getMonth() + 6);
        else if (p.includes('anual') || p.includes('ano')) date.setFullYear(date.getFullYear() + 1);
        else return i18n.t('roteiro.check_manual');

        return date.toISOString().split('T')[0]; 
    }

    function formatDateToBR(dateStr) {
        if (!dateStr || dateStr.includes('Manual')) return dateStr;
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    // --- CRUD E GESTÃO DA TABELA ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEntry = {
            id: editId || Date.now(),
            equipamento: document.getElementById('equipamento').value,
            patrimonio: document.getElementById('patrimonio').value,
            periodo: document.getElementById('periodo').value,
            data_realizada: document.getElementById('data_realizada').value,
            observacoes: document.getElementById('observacoes').value,
            proxima_data: calculateNextDate(document.getElementById('data_realizada').value, document.getElementById('periodo').value),
            componentes: [...currentComponents]
        };

        if (editId) {
            entries = entries.map(entry => entry.id === editId ? newEntry : entry);
            editId = null;
            document.getElementById('saveBtn').innerHTML = '<i class="fa-solid fa-check"></i> ' + i18n.t('roteiro.save_record');
        } else {
            entries.push(newEntry);
        }

        saveData();
        renderTable();
        clearForm();
    });

    function renderTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const periodFilter = filterPeriodo.value.toLowerCase();

        const filtered = entries.filter(entry => {
            const matchesSearch = entry.equipamento.toLowerCase().includes(searchTerm) || entry.patrimonio.toLowerCase().includes(searchTerm);
            const matchesPeriod = periodFilter === '' || entry.periodo.toLowerCase().includes(periodFilter);
            return matchesSearch && matchesPeriod;
        });

        tbody.innerHTML = '';

        filtered.sort((a, b) => new Date(b.data_realizada) - new Date(a.data_realizada)).forEach(entry => {
            const hasComponents = entry.componentes && entry.componentes.length > 0;
            const trMain = document.createElement('tr');
            
            // Injeção dos atributos data-label para os cards no formato mobile
            trMain.innerHTML = `
                <td data-label="${i18n.t('roteiro.th_equipamento')}" style="padding: 1rem;">
                    <strong>${entry.equipamento}</strong>
                    ${hasComponents ? `<br><small style="color: var(--primary); cursor: pointer; display: inline-block; margin-top: 0.3rem;" onclick="toggleDetails(this)"><i class="fa-solid fa-chevron-down"></i> ` + i18n.t('roteiro.view_components') + `</small>` : ''}
                </td>
                <td data-label="${i18n.t('roteiro.th_patrimonio')}" style="padding: 1rem;">${entry.patrimonio}</td>
                <td data-label="${i18n.t('roteiro.th_periodo')}" style="padding: 1rem;">${entry.periodo}</td>
                <td data-label="${i18n.t('roteiro.th_data')}" style="padding: 1rem;">${formatDateToBR(entry.data_realizada)}</td>
                <td data-label="${i18n.t('roteiro.th_proxima')}" style="padding: 1rem; color: var(--cor-sucesso); font-weight: bold;">${formatDateToBR(entry.proxima_data)}</td>
                <td data-label="${i18n.t('roteiro.th_acoes')}" style="padding: 1rem; text-align: center;">
                    <button type="button" class="icon-button" onclick="editEntry(${entry.id})" title="${i18n.t('roteiro.edit')}"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" class="icon-button" style="color: var(--cor-erro);" onclick="deleteEntry(${entry.id})" title="${i18n.t('roteiro.delete')}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(trMain);

            if (hasComponents) {
                const trDetails = document.createElement('tr');
                trDetails.style.display = 'none';
                trDetails.className = 'row-details'; // Classe para proteger o layout no modo mobile e renderizar no tema certo
                
                let compHtml = entry.componentes.map(c => `<li style="margin-bottom: 0.3rem;"><strong>${c.qty}x ${c.type}</strong> - ${c.lub || i18n.t('roteiro.no_lub_specific')}</li>`).join('');

                trDetails.innerHTML = `
                    <td colspan="6" style="padding: 1rem; border-bottom: 1px solid var(--border);">
                        <div style="margin-left: 0.5rem; border-left: 3px solid var(--primary); padding-left: 1rem;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--text-secondary);">${i18n.t('roteiro.lub_details')}</h4>
                            <ul style="margin: 0; padding-left: 1rem; font-size: 0.9rem;">${compHtml}</ul>
                            ${entry.observacoes ? `<p style="margin: 0.8rem 0 0 0; font-size: 0.9rem;"><strong>${i18n.t('roteiro.obs_label')}:</strong> ${entry.observacoes}</p>` : ''}
                        </div>
                    </td>
                `;
                tbody.appendChild(trDetails);
            }
        });
    }

    window.toggleDetails = (btn) => {
        const tr = btn.closest('tr');
        const nextTr = tr.nextElementSibling;
        const icon = btn.querySelector('i');
        
        if (nextTr.style.display === 'none' || nextTr.style.display === '') {
            nextTr.style.display = 'table-row';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            nextTr.style.display = 'none';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    };

    window.editEntry = (id) => {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        document.getElementById('equipamento').value = entry.equipamento;
        document.getElementById('patrimonio').value = entry.patrimonio;
        document.getElementById('periodo').value = entry.periodo;
        document.getElementById('data_realizada').value = entry.data_realizada;
        document.getElementById('observacoes').value = entry.observacoes || '';
        
        currentComponents = entry.componentes ? [...entry.componentes] : [];
        renderComponentsList();

        editId = id;
        document.getElementById('saveBtn').innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> ' + i18n.t('roteiro.update_record');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteEntry = (id) => {
        if (confirm(i18n.t('roteiro.confirm_delete'))) {
            entries = entries.filter(e => e.id !== id);
            saveData();
            renderTable();
        }
    };

    function clearForm() {
        form.reset();
        editId = null;
        currentComponents = [];
        renderComponentsList();
        document.getElementById('saveBtn').innerHTML = '<i class="fa-solid fa-check"></i> ' + i18n.t('roteiro.save_record');
        containerTypeOther.style.display = 'none';
    }

    document.getElementById('clearBtn').addEventListener('click', clearForm);

    document.getElementById('clearAllBtn').addEventListener('click', () => {
        if (entries.length === 0) return;
        if (confirm(i18n.t('roteiro.confirm_clear_all'))) {
            entries = [];
            saveData();
            renderTable();
        }
    });

    document.getElementById('printBtn').addEventListener('click', () => window.print());

    document.getElementById('exportBtn').addEventListener('click', () => {
        if (entries.length === 0) return alert(i18n.t('roteiro.no_data_export'));
        
        let csvContent = i18n.t('roteiro.csv_header') + "\n";
        entries.forEach(e => {
            let compsStr = e.componentes ? e.componentes.map(c => `${c.qty}x ${c.type} (${c.lub || i18n.t('roteiro.na')})`).join(' | ') : '';
            const escapeStr = (str) => `"${(str || '').replace(/"/g, '""')}"`;
            csvContent += `${escapeStr(e.equipamento)},${escapeStr(e.patrimonio)},${escapeStr(e.periodo)},${formatDateToBR(e.data_realizada)},${formatDateToBR(e.proxima_data)},${escapeStr(compsStr)},${escapeStr(e.observacoes)}\n`;
        });

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `roteiro_lubrificacao_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    });

    function saveData() { localStorage.setItem('roteiroLubrificacao', JSON.stringify(entries)); }
    
    searchInput.addEventListener('input', renderTable);
    filterPeriodo.addEventListener('change', renderTable);
    
    // Inicialização
    renderTable();
});
