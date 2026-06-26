document.addEventListener('DOMContentLoaded', () => {
    // === CONSTANTES E REFERÊNCIAS AO DOM ===
    const STORAGE_KEY = 'fmeaData_v2'; 
    const fmeaForm = document.getElementById('fmeaForm');
    const fmeaTableBody = document.querySelector('#fmeaTable tbody');
    const fmeaTableHead = document.querySelector('#fmeaTable thead');
    const editIndexInput = document.getElementById('editIndex');
    
    // Botões e Controles
    const submitBtn = fmeaForm.querySelector('button[type="submit"]');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const gerarPdfBtn = document.getElementById('gerarPdfBtn');
    const limparDadosBtn = document.getElementById('limparDadosBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const searchInput = document.getElementById('searchInput');
    const reavaliacaoSection = document.getElementById('reavaliacao-section');

    // Estado da Aplicação
    let fmeaData = [];
    let sortColumn = 'rpn';
    let sortDirection = 'desc';

    // === CRITÉRIOS DE AVALIAÇÃO S-O-D ===
    const CRITERIA = {
        severidade: [
            { nota: 1, texto: 'Nenhum efeito perceptível no processo ou no usuário' },
            { nota: 2, texto: 'Efeito mínimo, praticamente imperceptível' },
            { nota: 3, texto: 'Efeito leve, pequeno incômodo operacional' },
            { nota: 4, texto: 'Efeito leve, perda menor de desempenho' },
            { nota: 5, texto: 'Efeito moderado, degradação perceptível de desempenho' },
            { nota: 6, texto: 'Efeito moderado, insatisfação do operador/cliente' },
            { nota: 7, texto: 'Efeito significativo, perda parcial da função principal' },
            { nota: 8, texto: 'Efeito alto, parada do equipamento/linha sem risco às pessoas' },
            { nota: 9, texto: 'Risco à segurança ou ao meio ambiente, com aviso prévio' },
            { nota: 10, texto: 'Risco extremo à segurança ou ao meio ambiente, sem aviso prévio' }
        ],
        ocorrencia: [
            { nota: 1, texto: 'Remota: falha improvável, sem histórico (<1 em 1.500.000)' },
            { nota: 2, texto: 'Muito baixa: falhas isoladas (1 em 150.000)' },
            { nota: 3, texto: 'Baixa: falhas ocasionais (1 em 15.000)' },
            { nota: 4, texto: 'Baixa a moderada (1 em 2.000)' },
            { nota: 5, texto: 'Moderada: falhas associadas a processos similares (1 em 400)' },
            { nota: 6, texto: 'Moderada a alta (1 em 80)' },
            { nota: 7, texto: 'Alta: falhas recorrentes (1 em 20)' },
            { nota: 8, texto: 'Alta: falhas frequentes (1 em 8)' },
            { nota: 9, texto: 'Muito alta: falha quase certa (1 em 3)' },
            { nota: 10, texto: 'Muito alta: falha quase inevitável (>1 em 2)' }
        ],
        deteccao: [
            { nota: 1, texto: 'Detecção quase certa, controle praticamente 100% eficaz' },
            { nota: 2, texto: 'Muito alta chance de detecção pelos controles atuais' },
            { nota: 3, texto: 'Alta chance de detecção' },
            { nota: 4, texto: 'Moderadamente alta chance de detecção' },
            { nota: 5, texto: 'Chance moderada de detecção' },
            { nota: 6, texto: 'Baixa chance, controles pouco confiáveis' },
            { nota: 7, texto: 'Muito baixa chance de detecção' },
            { nota: 8, texto: 'Remota chance, controle quase não detecta' },
            { nota: 9, texto: 'Muito remota chance de detecção' },
            { nota: 10, texto: 'Detecção impossível: nenhum controle existe' }
        ]
    };

    function populateRatingSelect(selectEl, tipo, optional = false) {
        selectEl.innerHTML = '';
        if (optional) {
            const emptyOpt = document.createElement('option');
            emptyOpt.value = '';
            emptyOpt.textContent = '—';
            selectEl.appendChild(emptyOpt);
        }
        CRITERIA[tipo].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.nota;
            opt.textContent = `${item.nota} - ${item.texto}`;
            selectEl.appendChild(opt);
        });
        if (!optional) selectEl.value = '5';
    }

    function renderCriteriaTable(tipo) {
        const tbody = document.getElementById('criteriaTableBody');
        tbody.innerHTML = '';
        [...CRITERIA[tipo]].reverse().forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `<td>${item.nota}</td><td>${item.texto}</td>`;
        });
    }

    // === FUNÇÕES PRINCIPAIS ===

    function loadFromLocalStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            fmeaData = JSON.parse(data);
            renderTable();
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fmeaData));
    }

    function renderTable(dataToRender = fmeaData) {
        fmeaTableBody.innerHTML = '';
        const sortedData = [...dataToRender].sort((a, b) => {
            const valA = a[sortColumn] || '';
            const valB = b[sortColumn] || '';
            let comparison = 0;
            if (valA > valB) comparison = 1;
            else if (valA < valB) comparison = -1;
            return sortDirection === 'desc' ? comparison * -1 : comparison;
        });

        sortedData.forEach(item => {
            const row = fmeaTableBody.insertRow();
            const originalIndex = fmeaData.findIndex(originalItem => originalItem.id === item.id);
            row.className = getRpnColorClass(item.rpn);
            const prazoFormatado = item.prazo ? new Date(item.prazo + 'T00:00:00').toLocaleDateString() : '';

            row.innerHTML = `
                <td>${item.itemFuncao}</td>
                <td>${item.modoFalha}</td>
                <td>${item.causaFalha}</td>
                <td>${item.controlesAtuais}</td>
                <td>${item.s}</td>
                <td>${item.o}</td>
                <td>${item.d}</td>
                <td><b>${item.rpn}</b></td>
                <td>${item.acoesRecomendadas}</td>
                <td>${item.responsavel}</td>
                <td>${prazoFormatado}</td>
                <td><span class="status-cell ${getStatusClass(item.status)}">${item.status}</span></td>
                <td class="${getRpnColorClass(item.novoRpn)}">${item.novoRpn || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="action-button button-secondary" data-action="edit" data-index="${originalIndex}">${i18n.t('fmea.edit')}</button>
                    <button class="action-button button-danger" data-action="delete" data-index="${originalIndex}">${i18n.t('fmea.delete')}</button>
                </td>
            `;
        });
        updateSortIndicators();
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = i18n.t('fmea.saving');

        const s = parseInt(document.getElementById('severidade').value);
        const o = parseInt(document.getElementById('ocorrencia').value);
        const d = parseInt(document.getElementById('deteccao').value);
        const novaS = parseInt(document.getElementById('novaSeveridade').value) || null;
        const novaO = parseInt(document.getElementById('novaOcorrencia').value) || null;
        const novaD = parseInt(document.getElementById('novaDeteccao').value) || null;

        const entry = {
            id: Date.now() + Math.random(),
            itemFuncao: document.getElementById('itemFuncao').value,
            modoFalha: document.getElementById('modoFalha').value,
            efeitoFalha: document.getElementById('efeitoFalha').value,
            causaFalha: document.getElementById('causaFalha').value,
            controlesAtuais: document.getElementById('controlesAtuais').value,
            s: s, o: o, d: d,
            rpn: s * o * d,
            acoesRecomendadas: document.getElementById('acoesRecomendadas').value,
            responsavel: document.getElementById('responsavel').value,
            prazo: document.getElementById('prazo').value,
            status: document.getElementById('status').value,
            acoesRealizadas: document.getElementById('acoesRealizadas').value,
            novaS, novaO, novaD,
            novoRpn: (novaS && novaO && novaD) ? novaS * novaO * novaD : null,
        };
        
        const editIndex = editIndexInput.value;
        if (editIndex !== "") {
            entry.id = fmeaData[parseInt(editIndex)].id;
            fmeaData[parseInt(editIndex)] = entry;
            showToast(i18n.t('fmea.row_updated'));
        } else {
            fmeaData.push(entry);
            showToast(i18n.t('fmea.row_added'));
        }
        saveToLocalStorage();
        renderTable();
        resetForm();
    }

    function editRow(index) {
        const item = fmeaData[index];
        if (!item) return;
        document.getElementById('itemFuncao').value = item.itemFuncao;
        document.getElementById('modoFalha').value = item.modoFalha;
        document.getElementById('efeitoFalha').value = item.efeitoFalha;
        document.getElementById('causaFalha').value = item.causaFalha;
        document.getElementById('controlesAtuais').value = item.controlesAtuais;
        document.getElementById('severidade').value = item.s;
        document.getElementById('ocorrencia').value = item.o;
        document.getElementById('deteccao').value = item.d;
        document.getElementById('acoesRecomendadas').value = item.acoesRecomendadas;
        document.getElementById('responsavel').value = item.responsavel;
        document.getElementById('prazo').value = item.prazo;
        document.getElementById('status').value = item.status;
        document.getElementById('acoesRealizadas').value = item.acoesRealizadas || '';
        document.getElementById('novaSeveridade').value = item.novaS || '';
        document.getElementById('novaOcorrencia').value = item.novaO || '';
        document.getElementById('novaDeteccao').value = item.novaD || '';
        reavaliacaoSection.style.display = 'block';
        editIndexInput.value = index;
        submitBtn.textContent = i18n.t('fmea.update_row');
        cancelEditBtn.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteRow(index) {
        if (confirm(i18n.t('fmea.confirm_delete'))) {
            fmeaData.splice(index, 1);
            saveToLocalStorage();
            renderTable();
            showToast(i18n.t('fmea.row_deleted'), 'error');
        }
    }

    function resetForm() {
        fmeaForm.reset();
        document.getElementById('severidade').value = '5';
        document.getElementById('ocorrencia').value = '5';
        document.getElementById('deteccao').value = '5';
        document.getElementById('novaSeveridade').value = '';
        document.getElementById('novaOcorrencia').value = '';
        document.getElementById('novaDeteccao').value = '';
        editIndexInput.value = '';
        submitBtn.textContent = i18n.t('fmea.save_row');
        submitBtn.disabled = false;
        cancelEditBtn.style.display = 'none';
        reavaliacaoSection.style.display = 'none';
        fmeaForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

    function generatePdf() {
        if (fmeaData.length === 0) {
            showToast(i18n.t('fmea.table_empty_pdf'), 'error');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'legal' });
        const pageW = doc.internal.pageSize.getWidth();

        doc.setFontSize(16);
        doc.setTextColor(0, 51, 102);
        doc.text(i18n.t('fmea.pdf_report'), 40, 40);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(i18n.t('fmea.pdf_generated') + ' ' + new Date().toLocaleString(), 40, 55);
        doc.text(i18n.t('fmea.total_items') + ' ' + fmeaData.length, 40, 67);

        var headers = [i18n.t('fmea.item_function_col'), i18n.t('fmea.failure_mode_col'), i18n.t('fmea.failure_effect'), i18n.t('fmea.failure_cause'), i18n.t('fmea.controls_col'), 'S', 'O', 'D', 'RPN', i18n.t('fmea.recommended_actions'), i18n.t('fmea.responsible'), i18n.t('fmea.deadline'), i18n.t('fmea.status'), i18n.t('fmea.new_rpn')];
        var body = fmeaData.map(item => [
            item.itemFuncao || '', item.modoFalha || '', item.efeitoFalha || '', item.causaFalha || '',
            item.controlesAtuais || '', String(item.s || ''), String(item.o || ''), String(item.d || ''),
            String(item.rpn || ''), item.acoesRecomendadas || '', item.responsavel || '',
            item.prazo ? new Date(item.prazo + 'T00:00:00').toLocaleDateString() : '',
            item.status || '', item.novoRpn ? String(item.novoRpn) : 'N/A'
        ]);

        const autoTableConfig = {
            head: [headers],
            body: body,
            startY: 90,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102], fontSize: 7, halign: 'center' },
            styles: { fontSize: 6.5, cellPadding: 3, overflow: 'linebreak' },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 8) {
                    var rpn = parseInt(data.cell.raw, 10);
                    if (rpn >= 200) data.cell.styles.fillColor = [220, 53, 69];
                    else if (rpn >= 120) data.cell.styles.fillColor = [255, 193, 7];
                    else if (rpn >= 60) data.cell.styles.fillColor = [40, 167, 69];
                }
                if (data.section === 'body') {
                    var rowRpn = parseInt(data.row.raw[8], 10);
                    if (rowRpn >= 200) data.row.styles.fillColor = [255, 230, 230];
                    else if (rowRpn >= 120) data.row.styles.fillColor = [255, 248, 220];
                    else if (rowRpn >= 60) data.row.styles.fillColor = [230, 255, 230];
                }
            },
            didDrawPage: function(data) {
                doc.setFontSize(7);
                doc.text('Página ' + doc.internal.getCurrentPageInfo().pageNumber, pageW - 50, doc.internal.pageSize.getHeight() - 20);
            }
        };

        if (window.jspdfAutoTable && window.jspdfAutoTable.autoTable) window.jspdfAutoTable.autoTable(doc, autoTableConfig);
        else doc.autoTable(autoTableConfig);

        const tableMeta = doc.autoTable.previous || doc.lastAutoTable;
        var finalY = (tableMeta ? tableMeta.finalY : 150) + 15;
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.text(i18n.t('fmea.rpn_legend'), 40, finalY);
        doc.setFillColor(230, 255, 230); doc.rect(40, finalY + 5, 12, 8, 'F'); doc.text(i18n.t('fmea.rpn_low'), 56, finalY + 12);
        doc.setFillColor(255, 248, 220); doc.rect(120, finalY + 5, 12, 8, 'F'); doc.text(i18n.t('fmea.rpn_medium'), 136, finalY + 12);
        doc.setFillColor(255, 230, 230); doc.rect(210, finalY + 5, 12, 8, 'F'); doc.text(i18n.t('fmea.rpn_high'), 226, finalY + 12);
        doc.setFillColor(220, 53, 69); doc.rect(300, finalY + 5, 12, 8, 'F'); doc.text(i18n.t('fmea.rpn_critical'), 316, finalY + 12);

        doc.save('relatorio_fmea.pdf');
    }

    function exportToCsv() {
        if (fmeaData.length === 0) {
            showToast(i18n.t('fmea.table_empty_csv'), 'error');
            return;
        }
        const headers = [i18n.t('fmea.item_function_col'), i18n.t('fmea.failure_mode_col'), i18n.t('fmea.failure_effect'), i18n.t('fmea.failure_cause'), i18n.t('fmea.current_controls'), 'S', 'O', 'D', 'RPN', i18n.t('fmea.recommended_actions'), i18n.t('fmea.responsible'), i18n.t('fmea.deadline'), i18n.t('fmea.status'), i18n.t('fmea.actions_taken'), 'Nova S', 'Nova O', 'Nova D', 'Novo RPN'];
        const csvRows = [headers.join(',')];
        fmeaData.forEach(item => {
            const values = [item.itemFuncao, item.modoFalha, item.efeitoFalha, item.causaFalha, item.controlesAtuais, item.s, item.o, item.d, item.rpn, item.acoesRecomendadas, item.responsavel, item.prazo, item.status, item.acoesRealizadas, item.novaS, item.novaO, item.novaD, item.novoRpn].map(v => `"${String(v || '').replace(/"/g, '""')}"`);
            csvRows.push(values.join(','));
        });
        const blob = new Blob([`\uFEFF${csvRows.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `fmea_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(i18n.t('fmea.csv_exported'));
    }

    function getRpnColorClass(rpn) {
        if (!rpn) return '';
        if (rpn >= 200) return 'rpn-critical';
        if (rpn >= 120) return 'rpn-high';
        if (rpn >= 60) return 'rpn-medium';
        return 'rpn-low';
    }

    function getStatusClass(status) {
        return { 'Pendente': 'status-pendente', 'Em Andamento': 'status-andamento', 'Concluído': 'status-concluido' }[status] || '';
    }

    function updateSortIndicators() {
        fmeaTableHead.querySelectorAll('th[data-sort]').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sort === sortColumn) th.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        });
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }
    
    // === EVENT LISTENERS ===
    fmeaForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', resetForm);
    gerarPdfBtn.addEventListener('click', generatePdf);
    exportCsvBtn.addEventListener('click', exportToCsv);
    limparDadosBtn.addEventListener('click', () => {
        if (confirm(i18n.t('fmea.confirm_clear_all'))) {
            fmeaData = [];
            saveToLocalStorage();
            renderTable();
            resetForm();
            showToast(i18n.t('fmea.data_cleared'), 'error');
        }
    });

    fmeaTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.action-button');
        if (!button) return;
        const action = button.dataset.action;
        const index = parseInt(button.dataset.index, 10);
        if (action === 'edit') editRow(index);
        else if (action === 'delete') deleteRow(index);
    });

    fmeaTableHead.addEventListener('click', (e) => {
        const th = e.target.closest('th[data-sort]');
        if (!th) return;
        const newSortColumn = th.dataset.sort;
        if (sortColumn === newSortColumn) sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        else {
            sortColumn = newSortColumn;
            sortDirection = ['s', 'o', 'd', 'rpn', 'novoRpn'].includes(newSortColumn) ? 'desc' : 'asc';
        }
        renderTable();
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        renderTable(fmeaData.filter(item => Object.values(item).some(val => String(val || '').toLowerCase().includes(searchTerm))));
    });

    // === MODAL DE CRITÉRIOS ===
    const criteriaModal = document.getElementById('criteriaModal');
    document.querySelectorAll('.info-btn').forEach(btn => btn.addEventListener('click', () => {
        renderCriteriaTable(btn.dataset.criteriaTab);
        criteriaModal.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === btn.dataset.criteriaTab));
        criteriaModal.style.display = 'flex';
    }));
    criteriaModal.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
        renderCriteriaTable(btn.dataset.tab);
        criteriaModal.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === btn.dataset.tab));
    }));
    document.getElementById('closeCriteriaModal').addEventListener('click', () => criteriaModal.style.display = 'none');

    // === INICIALIZAÇÃO ===
    populateRatingSelect(document.getElementById('severidade'), 'severidade');
    populateRatingSelect(document.getElementById('ocorrencia'), 'ocorrencia');
    populateRatingSelect(document.getElementById('deteccao'), 'deteccao');
    populateRatingSelect(document.getElementById('novaSeveridade'), 'severidade', true);
    populateRatingSelect(document.getElementById('novaOcorrencia'), 'ocorrencia', true);
    populateRatingSelect(document.getElementById('novaDeteccao'), 'deteccao', true);
    loadFromLocalStorage();
});
