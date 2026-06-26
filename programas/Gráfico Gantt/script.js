document.addEventListener('DOMContentLoaded', () => {
    // SELETORES DE ELEMENTOS DOM
    const dashboard = document.getElementById('dashboard');
    const filterInput = document.getElementById('filter-tasks');
    const ganttChart = document.getElementById('gantt-chart');
    const taskForm = document.getElementById('task-form');
    const isMilestoneCheckbox = document.getElementById('is-milestone');
    const endDateInput = document.getElementById('end-date');
    const startDateInput = document.getElementById('start-date');
    const formError = document.getElementById('form-error');
    const exportXlsxButton = document.getElementById('export-xlsx-button');
    const exportPdfButton = document.getElementById('export-pdf-button');
    const clearButton = document.getElementById('clear-button');
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');

    // ESTADO DA APLICAÇÃO
    let tasks = JSON.parse(localStorage.getItem('ganttTasksV11')) || [];
    
    // FUNÇÕES DE TEMA
    const applyTheme = (isDark) => { document.body.classList.toggle('dark-theme', isDark); themeToggleCheckbox.checked = isDark; };
    const toggleTheme = () => { const isDark = themeToggleCheckbox.checked; localStorage.setItem('theme', isDark ? 'dark' : 'light'); applyTheme(isDark); };
    const loadTheme = () => { const savedTheme = localStorage.getItem('theme'); const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; applyTheme(savedTheme === 'dark' || (savedTheme === null && prefersDark)); };
    
    // FUNÇÕES DE CÁLCULO E ANÁLISE
    const getTaskDuration = (task) => { if (task.isMilestone) return 0; const start = new Date(task.start); const end = new Date(task.end); return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; };
    const calculateDashboardMetrics = () => {
        let overallProgress = 0, overdueCount = 0, projectTotalDays = 0;
        if (tasks.length > 0) {
            let totalDurationWeightedProgress = 0, totalDuration = 0;
            const today = new Date(); today.setHours(0, 0, 0, 0);
            tasks.filter(t => !t.isMilestone).forEach(task => {
                const duration = getTaskDuration(task);
                totalDurationWeightedProgress += (task.progress || 0) * duration;
                totalDuration += duration;
                if (new Date(task.end) < today && (task.progress || 0) < 100) overdueCount++;
            });
            overallProgress = totalDuration > 0 ? Math.round(totalDurationWeightedProgress / totalDuration) : 0;
            const taskDates = tasks.map(t => new Date(t.start));
            if (tasks.some(t => !t.isMilestone)) {
                taskDates.push(...tasks.filter(t => !t.isMilestone).map(t => new Date(t.end)));
            }
            if (taskDates.length > 0) {
                const projectStartDate = new Date(Math.min(...taskDates));
                const projectEndDate = new Date(Math.max(...taskDates));
                projectTotalDays = Math.ceil((projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24)) + 1;
            }
        }
        const metricCard = (label, value, color) => `<div class="metric-card" style="border-color: ${color};"><div class="label">${label}</div><div class="value" style="color: ${color};">${value}</div></div>`;
        
        // Atualizado com as novas variáveis do design system
        dashboard.innerHTML = metricCard(i18n.t('gantt.overall_progress'), `${overallProgress}%`, 'var(--primary)') + 
                              metricCard(i18n.t('gantt.overdue_tasks'), overdueCount, 'var(--cor-erro)') + 
                              metricCard(i18n.t('gantt.duration_days'), projectTotalDays, 'var(--cor-sucesso)') + 
                              metricCard(i18n.t('gantt.total_items'), tasks.length, 'var(--secondary)');
    };
    const saveTasks = () => localStorage.setItem('ganttTasksV11', JSON.stringify(tasks));

    // FUNÇÃO DE RENDERIZAÇÃO PRINCIPAL (LAYOUT DE LISTA)
    const render = () => {
        const searchTerm = filterInput.value.toLowerCase();
        const filteredTasks = tasks.filter(t => t.name.toLowerCase().includes(searchTerm)).sort((a, b) => new Date(a.start) - new Date(b.start));
        
        calculateDashboardMetrics();
        ganttChart.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            // Atualizado com a nova variável para texto suave
            ganttChart.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 2rem;"><p>${i18n.t('gantt.no_tasks')}</p></div>`;
            return;
        }

        filteredTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.dataset.id = task.id;
            taskEl.className = 'task-bar';
            
            // Atualizado com a nova variável primária
            taskEl.style.backgroundColor = task.isMilestone ? 'var(--cor-destaque)' : task.color || 'var(--primary)';
            
            const progress = task.progress || 0;
            const startDateFormatted = new Date(task.start).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
            const endDateFormatted = new Date(task.end).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});

            if (task.isMilestone) {
                taskEl.innerHTML = `
                    <div class="task-content">
                        <span class="task-name" title="${task.name}"><i class="fa-solid fa-star"></i> ${task.name}</span>
                        <div class="task-details">
                            <div class="task-date-info">${startDateFormatted}</div>
                        </div>
                    </div>`;
            } else {
                taskEl.innerHTML = `
                    <div class="progress-bar" style="width: ${progress}%"></div>
                    <div class="task-content">
                        <span class="task-name" contenteditable="true">${task.name}</span>
                        <div class="task-details">
                            <div class="task-date-info">
                                ${startDateFormatted} - ${endDateFormatted}<br>
                                <small>${getTaskDuration(task)} dias</small>
                            </div>
                            <div class="progress-input-wrapper">
                                <input type="number" class="task-progress-input" value="${progress.toFixed(0)}" min="0" max="100" data-task-id="${task.id}"/>
                                <span>%</span>
                            </div>
                        </div>
                    </div>`;
            }
            ganttChart.appendChild(taskEl);
        });
    };

    const updateTaskProgress = (inputElement) => {
        const taskId = parseInt(inputElement.dataset.taskId);
        const progress = Math.max(0, Math.min(100, parseFloat(inputElement.value)));
        const task = tasks.find(t => t.id === taskId);
        if (task && !isNaN(progress)) {
            task.progress = progress;
            inputElement.value = progress.toFixed(0);
            const taskBar = inputElement.closest('.task-bar');
            if (taskBar) {
                const progressBar = taskBar.querySelector('.progress-bar');
                progressBar.style.width = `${progress}%`;
            }
            saveTasks();
            calculateDashboardMetrics();
        }
    };

    // MANIPULADORES DE EVENTOS
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('task-name').value.trim();
        const start = startDateInput.value;
        const isMilestone = isMilestoneCheckbox.checked;
        const end = isMilestone ? start : endDateInput.value;
        formError.textContent = '';
        if (new Date(start) > new Date(end) && !isMilestone) {
            formError.textContent = i18n.t('gantt.error_end_before_start'); return;
        }
        tasks.push({ id: Date.now(), name, start, end, isMilestone, dependencies: [], progress: 0, color: `hsl(${Math.random() * 360}, 45%, 40%)` });
        taskForm.reset();
        endDateInput.disabled = false;
        saveTasks();
        render();
    });
    
    ganttChart.addEventListener('change', (e) => { if (e.target.classList.contains('task-progress-input')) { updateTaskProgress(e.target); } });
    ganttChart.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('task-progress-input')) { e.target.blur(); e.preventDefault(); } });
    filterInput.addEventListener('input', render);
    themeToggleCheckbox.addEventListener('change', toggleTheme);
    clearButton.addEventListener('click', () => { if(confirm(i18n.t('gantt.confirm_clear'))) { tasks = []; saveTasks(); render(); } });
    isMilestoneCheckbox.addEventListener('change', (e) => { endDateInput.disabled = e.target.checked; if (e.target.checked) endDateInput.value = startDateInput.value; });
    startDateInput.addEventListener('change', () => { if (isMilestoneCheckbox.checked) endDateInput.value = startDateInput.value; });
    
    exportXlsxButton.addEventListener('click', () => {
        const data = tasks.map(t => ({ 'ID': t.id, [i18n.t('gantt.xlsx_name')]: t.name, [i18n.t('gantt.xlsx_start')]: t.start, [i18n.t('gantt.xlsx_end')]: t.end, [i18n.t('gantt.xlsx_duration')]: getTaskDuration(t), [i18n.t('gantt.xlsx_progress')]: t.progress || 0, [i18n.t('gantt.xlsx_milestone')]: t.isMilestone ? i18n.t('gantt.xlsx_yes') : i18n.t('gantt.xlsx_no') }));
        const worksheet = XLSX.utils.json_to_sheet(data); const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tarefas"); XLSX.writeFile(workbook, "tarefas.xlsx");
    });
    
    // FUNÇÃO DE EXPORTAR PDF
    exportPdfButton.addEventListener('click', () => {
        const chartElement = document.getElementById('gantt-chart');
        const originalButtonText = exportPdfButton.innerHTML;
        exportPdfButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + i18n.t('gantt.generating');
        exportPdfButton.disabled = true;

        html2canvas(chartElement, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: document.body.classList.contains('dark-theme') ? '#112233' : '#ffffff' 
        })
        .then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth() - 40; 
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasRatio = canvas.height / canvas.width;
            
            let finalHeight = pdfWidth * canvasRatio;
            
            pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, finalHeight > (pdfHeight - 40) ? (pdfHeight - 40) : finalHeight);
            pdf.save('lista-de-tarefas.pdf');
        })
        .catch(err => { 
            console.error("Erro ao gerar PDF:", err); 
            alert(i18n.t('gantt.error_pdf')); 
        })
        .finally(() => { 
            exportPdfButton.innerHTML = originalButtonText; 
            exportPdfButton.disabled = false; 
        });
    });

    // INICIALIZAÇÃO
    loadTheme();
    render();
});
