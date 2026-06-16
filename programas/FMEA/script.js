document.addEventListener('DOMContentLoaded', () => {
    // === CONSTANTES E REFERÊNCIAS AO DOM ===
    const STORAGE_KEY = 'fmeaData_v2'; // Chave atualizada para evitar conflitos com dados antigos
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

    // === FUNÇÕES PRINCIPAIS ===

    /**
     * Carrega os dados do localStorage e renderiza a tabela.
     */
    function loadFromLocalStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            fmeaData = JSON.parse(data);
            renderTable();
        }
    }

    /**
     * Salva os dados atuais no localStorage.
     */
    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fmeaData));
    }

    /**
     * Renderiza a tabela FMEA. Aceita um array de dados para renderizar (para a busca).
     * @param {Array} dataToRender - O array de dados a ser exibido. Padrão: fmeaData.
     */
    function renderTable(dataToRender = fmeaData) {
        fmeaTableBody.innerHTML = '';

        // Ordena os dados antes de renderizar
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

            // Formata a data para exibição
            const prazoFormatado = item.prazo ? new Date(item.prazo + 'T00:00:00').toLocaleDateString('pt-BR') : '';

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
                    <button class="action-button button-secondary" data-action="edit" data-index="${originalIndex}">Editar</button>
                    <button class="action-button button-danger" data-action="delete" data-index="${originalIndex}">Excluir</button>
                </td>
            `;
        });

        updateSortIndicators();
    }

    /**
     * Lida com o envio do formulário para adicionar ou atualizar uma linha.
     * @param {Event} e - O evento de submit do formulário.
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';

        const s = parseInt(document.getElementById('severidade').value);
        const o = parseInt(document.getElementById('ocorrencia').value);
        const d = parseInt(document.getElementById('deteccao').value);

        const novaS = parseInt(document.getElementById('novaSeveridade').value) || null;
        const novaO = parseInt(document.getElementById('novaOcorrencia').value) || null;
        const novaD = parseInt(document.getElementById('novaDeteccao').value) || null;

        const entry = {
            id: Date.now() + Math.random(), // ID único para rastreamento confiável
            itemFuncao: document.getElementById('itemFuncao').value,
            modoFalha: document.getElementById('modoFalha').value,
            efeitoFalha: document.getElementById('efeitoFalha').value, // Mantido nos dados, mas removido da tabela para simplificar
            causaFalha: document.getElementById('causaFalha').value,
            controlesAtuais: document.getElementById('controlesAtuais').value,
            s: s,
            o: o,
            d: d,
            rpn: s * o * d,
            acoesRecomendadas: document.getElementById('acoesRecomendadas').value,
            responsavel: document.getElementById('responsavel').value,
            prazo: document.getElementById('prazo').value,
            status: document.getElementById('status').value,
            acoesRealizadas: document.getElementById('acoesRealizadas').value,
            novaS: novaS,
            novaO: novaO,
            novaD: novaD,
            novoRpn: (novaS && novaO && novaD) ? novaS * novaO * novaD : null,
        };
        
        const editIndex = editIndexInput.value;

        if (editIndex !== "") {
            entry.id = fmeaData[parseInt(editIndex)].id; // Mantém o ID original
            fmeaData[parseInt(editIndex)] = entry;
            showToast('Linha atualizada com sucesso!');
        } else {
            fmeaData.push(entry);
            showToast('Nova falha adicionada com sucesso!');
        }

        saveToLocalStorage();
        renderTable();
        resetForm();
    }

    /**
     * Prepara o formulário para editar uma linha.
     * @param {number} index - O índice da linha a ser editada.
     */
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
        
        // Preenche e exibe a seção de reavaliação
        document.getElementById('acoesRealizadas').value = item.acoesRealizadas || '';
        document.getElementById('novaSeveridade').value = item.novaS || '';
        document.getElementById('novaOcorrencia').value = item.novaO || '';
        document.getElementById('novaDeteccao').value = item.novaD || '';
        reavaliacaoSection.style.display = 'block';
        
        editIndexInput.value = index;
        submitBtn.textContent = 'Atualizar Linha';
        cancelEditBtn.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Exclui uma linha da tabela.
     * @param {number} index - O índice da linha a ser excluída.
     */
    function deleteRow(index) {
        if (confirm('Tem certeza que deseja excluir esta linha?')) {
            fmeaData.splice(index, 1);
            saveToLocalStorage();
            renderTable();
            showToast('Linha excluída.', 'error');
        }
    }

    /**
     * Reseta o formulário para o estado inicial.
     */
    function resetForm() {
        fmeaForm.reset();
        editIndexInput.value = '';
        submitBtn.textContent = 'Salvar Linha';
        submitBtn.disabled = false;
        cancelEditBtn.style.display = 'none';
        reavaliacaoSection.style.display = 'none';
        // Remove classes de validação
        fmeaForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

    /**
     * Gera um PDF da tabela FMEA.
     */
    function generatePdf() {
        if (fmeaData.length === 0) {
            showToast('A tabela está vazia. Adicione dados antes de gerar o PDF.', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'legal' });

        doc.text("Relatório FMEA - " + new Date().toLocaleDateString('pt-BR'), 40, 40);

        doc.autoTable({
            html: '#fmeaTable',
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102] }, // var(--cor-primaria)
            styles: { fontSize: 7, cellPadding: 4 },
            didParseCell: function (data) {
                // Remove a coluna de "Ações" do PDF
                if (data.column.index === 13 && data.section === 'body') {
                   data.cell.text = '';
                }
            },
            // Garante que colunas longas quebrem a linha
             columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 70 },
                2: { cellWidth: 70 },
                3: { cellWidth: 70 },
                8: { cellWidth: 80 },
            }
        });

        doc.save(`relatorio_fmea_${Date.now()}.pdf`);
    }

    /**
     * Exporta os dados da tabela para um arquivo CSV.
     */
    function exportToCsv() {
        if (fmeaData.length === 0) {
            showToast('A tabela está vazia. Nada para exportar.', 'error');
            return;
        }
        
        const headers = [
            'Item/Função', 'Modo de Falha', 'Efeito da Falha', 'Causa da Falha', 'Controles Atuais',
            'S', 'O', 'D', 'RPN', 'Ações Recomendadas', 'Responsável', 'Prazo', 'Status',
            'Ações Realizadas', 'Nova S', 'Nova O', 'Nova D', 'Novo RPN'
        ];
        
        const csvRows = [headers.join(',')];
        
        fmeaData.forEach(item => {
            const values = [
                item.itemFuncao, item.modoFalha, item.efeitoFalha, item.causaFalha, item.controlesAtuais,
                item.s, item.o, item.d, item.rpn, item.acoesRecomendadas, item.responsavel, item.prazo, item.status,
                item.acoesRealizadas, item.novaS, item.novaO, item.novaD, item.novoRpn
            ].map(v => `"${String(v || '').replace(/"/g, '""')}"`); // Trata valores nulos e aspas
            
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF para Excel ler UTF-8
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `fmea_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Dados exportados para CSV!');
    }

    // === FUNÇÕES AUXILIARES ===

    function getRpnColorClass(rpn) {
        if (!rpn) return '';
        if (rpn >= 200) return 'rpn-critical';
        if (rpn >= 120) return 'rpn-high';
        if (rpn >= 60) return 'rpn-medium';
        return 'rpn-low';
    }

    function getStatusClass(status) {
        const statusMap = {
            'Pendente': 'status-pendente',
            'Em Andamento': 'status-andamento',
            'Concluído': 'status-concluido'
        };
        return statusMap[status] || '';
    }

    function updateSortIndicators() {
        fmeaTableHead.querySelectorAll('th[data-sort]').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sort === sortColumn) {
                th.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }

    /**
     * Mostra uma notificação toast na tela.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - 'success' ou 'error'.
     */
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Força o repaint para a animação funcionar
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

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
        if (confirm('Atenção! Isso apagará TODOS os dados da tabela. Deseja continuar?')) {
            fmeaData = [];
            saveToLocalStorage();
            renderTable();
            resetForm();
            showToast('Todos os dados foram limpos.', 'error');
        }
    });

    // Delegação de eventos para botões de Ação na tabela
    fmeaTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.action-button');
        if (!button) return;

        const action = button.dataset.action;
        const index = parseInt(button.dataset.index, 10);

        if (action === 'edit') {
            editRow(index);
        } else if (action === 'delete') {
            deleteRow(index);
        }
    });

    // Ordenação da tabela pelo cabeçalho
    fmeaTableHead.addEventListener('click', (e) => {
        const th = e.target.closest('th[data-sort]');
        if (!th) return;

        const newSortColumn = th.dataset.sort;
        if (sortColumn === newSortColumn) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = newSortColumn;
            // Para colunas numéricas, o padrão é decrescente. Para texto, crescente.
            sortDirection = ['s', 'o', 'd', 'rpn', 'novoRpn'].includes(newSortColumn) ? 'desc' : 'asc';
        }
        renderTable();
    });

    // Filtro/Busca na tabela
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = fmeaData.filter(item => {
            // Busca em todos os valores do objeto, tratando valores nulos
            return Object.values(item).some(val => 
                String(val || '').toLowerCase().includes(searchTerm)
            );
        });
        renderTable(filteredData);
    });
    
    // Validação em tempo real para campos numéricos
    fmeaForm.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            const val = parseInt(input.value);
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            // Permite campo vazio (para reavaliação opcional), mas valida se preenchido
            if (input.value && (val < min || val > max)) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
    });

    // === INICIALIZAÇÃO ===
    loadFromLocalStorage();
});
