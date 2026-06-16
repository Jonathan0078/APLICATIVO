// js/calculadora.js

import { tabelaSimilaridade } from '../data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
    const tempOperacaoInput = document.getElementById('temp-operacao');
    const tipoEquipamentoSelect = document.getElementById('tipo-equipamento');
    const calculateButton = document.getElementById('calculate-button');
    const calculatorResultDiv = document.getElementById('calculator-result');
    const recommendedVgText = document.getElementById('recommended-vg-text');
    const justificationText = document.getElementById('calculator-justification');
    const findOilsButton = document.getElementById('find-oils-button');
    const calculatorSearchResultsContainer = document.getElementById('calculator-search-results-container');
    
    // --- NOVOS ELEMENTOS DOM PARA PROJETOS SALVOS ---
    const projectNameInput = document.getElementById('project-name');
    const saveProjectBtn = document.getElementById('save-project-btn');
    const savedProjectsSelect = document.getElementById('saved-projects-select');
    const loadProjectBtn = document.getElementById('load-project-btn');
    const deleteProjectBtn = document.getElementById('delete-project-btn');

    let savedProjects = JSON.parse(localStorage.getItem('calculadoraVGProjects')) || [];

    // --- LÓGICA DE PROJETOS SALVOS (NOVA) ---
    function populateSavedProjects() {
        if (!savedProjectsSelect) return;
        savedProjectsSelect.innerHTML = '<option value="">-- Nenhum projeto salvo --</option>';
        if (savedProjects.length > 0) {
            savedProjects.forEach((project, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = project.name;
                savedProjectsSelect.appendChild(option);
            });
        }
    }

    function saveProject() {
        if (!projectNameInput || !tempOperacaoInput || !tipoEquipamentoSelect) return;
        const name = projectNameInput.value.trim();
        const temp = tempOperacaoInput.value;
        const tipo = tipoEquipamentoSelect.value;
        
        if (!name) {
            alert('Por favor, dê um nome ao projeto antes de salvar.');
            return;
        }
        if (!temp || !tipo) {
            alert('Por favor, preencha a temperatura e o tipo de equipamento para salvar.');
            return;
        }

        const projectData = {
            name: name,
            temp: temp,
            tipo: tipo
        };

        // Verifica se já existe um projeto com o mesmo nome e oferece para sobrepor
        const existingProjectIndex = savedProjects.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
        if (existingProjectIndex !== -1) {
            if (confirm(`Já existe um projeto com o nome "${name}". Deseja sobrepô-lo?`)) {
                savedProjects[existingProjectIndex] = projectData;
            } else {
                return; // Cancela a operação
            }
        } else {
            savedProjects.push(projectData);
        }

        localStorage.setItem('calculadoraVGProjects', JSON.stringify(savedProjects));
        
        projectNameInput.value = '';
        populateSavedProjects();
        alert(`Projeto "${name}" salvo com sucesso!`);
    }

    function loadProject() {
        if (!savedProjectsSelect || !tempOperacaoInput || !tipoEquipamentoSelect) return;
        const projectIndex = savedProjectsSelect.value;
        if (projectIndex === "") {
            alert("Por favor, selecione um projeto para carregar.");
            return;
        }

        const project = savedProjects[projectIndex];
        if (!project) return;
        tempOperacaoInput.value = project.temp;
        tipoEquipamentoSelect.value = project.tipo;
        
        // Recalcula e mostra os resultados automaticamente ao carregar
        if (calculateButton) calculateButton.click();
    }

    function deleteProject() {
        if (!savedProjectsSelect) return;
        const projectIndex = savedProjectsSelect.value;
        if (projectIndex === "") {
            alert("Por favor, selecione um projeto para apagar.");
            return;
        }

        const projectName = savedProjects[projectIndex]?.name || '';
        if (confirm(`Tem a certeza que deseja apagar o projeto "${projectName}"? Esta ação não pode ser desfeita.`)) {
            savedProjects.splice(projectIndex, 1);
            localStorage.setItem('calculadoraVGProjects', JSON.stringify(savedProjects));
            populateSavedProjects();
            // Limpa os campos se o projeto apagado era o que estava carregado
            if (projectNameInput.placeholder === `Editando: ${projectName}`) {
                tempOperacaoInput.value = '';
                tipoEquipamentoSelect.value = '';
                calculatorResultDiv.classList.add('hidden');
                calculatorSearchResultsContainer.innerHTML = '';
            }
            alert(`Projeto "${projectName}" apagado.`);
        }
    }

    // --- LÓGICA DA CALCULADORA ---
    function calcularViscosidade() {
        const temp = parseFloat(tempOperacaoInput.value);
        const tipo = tipoEquipamentoSelect.value;

        if (!tipo || isNaN(temp)) {
            alert("Por favor, preencha a temperatura e o tipo de equipamento.");
            return;
        }

        let vg = 0;
        let justification = "";

        if (tipo === "redutor_paralelo") {
            if (temp <= 50) { vg = 220; } 
            else if (temp <= 80) { vg = 320; } 
            else { vg = 460; }
            justification = "Para redutores de eixos paralelos, a viscosidade aumenta com a temperatura para garantir uma película lubrificante robusta sob maior estresse térmico.";
        } else if (tipo === "redutor_semfim") {
            if (temp <= 50) { vg = 460; } 
            else { vg = 680; }
            justification = "Redutores coroa e sem-fim geram alto atrito de deslizamento, exigindo óleos de alta viscosidade para proteger o bronze da coroa, especialmente em temperaturas elevadas.";
        } else if (tipo === "hidraulico_palhetas") {
            if (temp <= 50) { vg = 32; } 
            else if (temp <= 70) { vg = 46; } 
            else { vg = 68; }
            justification = "Sistemas hidráulicos com bombas de palhetas são sensíveis à viscosidade. Um óleo mais fino (VG 32/46) é ideal para eficiência, mas um mais grosso (VG 68) é necessário em altas temperaturas para evitar o desgaste.";
        } else if (tipo === "hidraulico_pistoes") {
             if (temp <= 60) { vg = 46; } 
            else { vg = 68; }
            justification = "Bombas de pistões operam com altas pressões. A viscosidade VG 46 é um padrão, mas VG 68 é recomendado para temperaturas de operação mais altas para manter a película e a vedação interna.";
        } else if (tipo === "mancal_deslizamento") {
            if (temp <= 60) { vg = 68; } 
            else { vg = 100; }
            justification = "Mancais de deslizamento dependem da formação de um filme hidrodinâmico. A viscosidade deve ser suficiente para suportar a carga, aumentando com a temperatura para compensar o afinamento do óleo.";
        }
        
        recommendedVgText.textContent = `ISO VG ${vg}`;
        justificationText.textContent = justification;
        calculatorResultDiv.classList.remove('hidden');
        findOilsButton.classList.remove('hidden');
        findOilsButton.onclick = () => buscarPorViscosidade(vg, calculatorSearchResultsContainer);
    }
    
    function buscarPorViscosidade(viscosidade, container) {
        const vgString = String(viscosidade);
        const resultados = tabelaSimilaridade.filter(grupo => grupo.ISO_VG === vgString);

        let html = `<h3 class="results-header">Produtos Encontrados para ISO VG ${viscosidade}</h3>`;

        if (resultados.length === 0) {
            html += `<p>Nenhum produto encontrado para a viscosidade ISO VG ${viscosidade}.</p>`;
        } else {
            html += '<ul class="results-list">'
            resultados.forEach(grupo => {
                html += `<li class="application-group"><h4>Aplicação: ${grupo.APLICACAO}</h4></li>`;
                for (const marca in grupo.PRODUTOS) {
                    const produto = grupo.PRODUTOS[marca];
                    html += `
                        <li>
                            <div class="list-item-header">
                                <div class="product-details">
                                    <span class="brand">${marca}:</span>
                                    <span class="product">${produto.NOME}</span>
                                </div>
                            </div>
                            <div class="tech-data-grid">
                               <div class="tech-data-item"><span class="label">BASE</span><span class="value">${produto.BASE}</span></div>
                                <div class="tech-data-item"><span class="label">ÍNDICE VISC.</span><span class="value">${produto.IV}</span></div>
                                <div class="tech-data-item"><span class="label">P. FULGOR</span><span class="value">${produto.PONTO_FULGOR}°C</span></div>
                                <div class="tech-data-item"><span class="label">P. FLUIDEZ</span><span class="value">${produto.PONTO_FLUIDEZ}°C</span></div>
                            </div>
                        </li>
                    `;
                }
            });
            html += '</ul>';
        }

        container.innerHTML = html;
    }

    // --- EVENT LISTENERS ---
    if (calculateButton) calculateButton.addEventListener('click', calcularViscosidade);
    if (saveProjectBtn) saveProjectBtn.addEventListener('click', saveProject);
    if (loadProjectBtn) loadProjectBtn.addEventListener('click', loadProject);
    if (deleteProjectBtn) deleteProjectBtn.addEventListener('click', deleteProject);

    // --- INICIALIZAÇÃO ---
    populateSavedProjects();
});
