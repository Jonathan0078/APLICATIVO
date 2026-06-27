let currentTab = 'eixos';

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    // Montagem inicial de campos vazios/padrão
    addStage(25, 75);
    addStage(18, 72);

    const inputRpm = document.getElementById('rpmIn');
    if (inputRpm) {
        inputRpm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateGearbox();
        });
    }
});

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

function showTab(tabName, event) {
    currentTab = tabName;
    
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = message;
        errorContainer.classList.remove('hidden');
        setTimeout(() => {
            errorContainer.classList.add('hidden');
        }, 5000);
    }
}

function hideError() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer && !errorContainer.classList.contains('hidden')) {
        errorContainer.classList.add('hidden');
    }
}

function addStage(zMot = '', zMov = '') {
    const container = document.getElementById('stagesContainer');
    if (!container) return;

    const stageNum = container.children.length + 1;
    
    const div = document.createElement('div');
    div.className = 'stage-card';
    div.innerHTML = `
        <div class="stage-card-header">
            <strong><i class="fa-solid fa-gear"></i> Estágio <span class="stage-num">${stageNum}</span></strong>
            <button type="button" class="remove-btn" onclick="removeStage(this)" title="Remover Estágio">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="input-grid">
            <div class="input-group" style="margin-bottom: 0;">
                <label>Z Motora (Dentes)</label>
                <input type="number" class="z-mot" placeholder="Ex: 25" value="${zMot}" min="1" step="1">
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label>Z Movida (Dentes)</label>
                <input type="number" class="z-mov" placeholder="Ex: 75" value="${zMov}" min="1" step="1">
            </div>
        </div>
    `;
    
    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateGearbox();
        });
    });

    container.appendChild(div);
    updateStageLabels();
}

function removeStage(btn) {
    const container = document.getElementById('stagesContainer');
    if (container.children.length > 1) {
        btn.closest('.stage-card').remove();
        updateStageLabels();
        
        const main = document.querySelector('.app-main');
        if (main && !main.classList.contains('aguardando-calculo')) {
            calculateGearbox();
        }
    } else {
        showError('Atenção: O redutor precisa manter pelo menos um estágio configurado.');
    }
}

function updateStageLabels() {
    document.querySelectorAll('.stage-card').forEach((card, idx) => {
        const label = card.querySelector('.stage-num');
        if (label) label.innerText = idx + 1;
    });
}

function calculateGearbox() {
    hideError();
    const rpmInEl = document.getElementById('rpmIn');
    if (!rpmInEl) return;

    const rpmIn = parseFloat(rpmInEl.value);

    if (isNaN(rpmIn) || rpmIn <= 0) {
        showError('Atenção: Informe uma rotação de entrada (RPM) válida e maior que zero.');
        return;
    }

    const mainContainer = document.querySelector('.app-main');
    if (mainContainer) mainContainer.classList.remove('aguardando-calculo');

    const stages = document.querySelectorAll('.stage-card');
    let currentRpm = rpmIn;
    let currentHz = currentRpm / 60;
    let validationError = false;

    let htmlEixos = `
        <tr>
            <td><strong>Eixo 1 (Entrada)</strong></td>
            <td>${currentRpm.toFixed(1)} RPM</td>
            <td><strong style="color: var(--primary); font-family: monospace; font-size: 1.05rem;">${currentHz.toFixed(3)} Hz</strong></td>
        </tr>
    `;
    let htmlGmf = '';

    stages.forEach((stage, idx) => {
        const zMotEl = stage.querySelector('.z-mot');
        const zMovEl = stage.querySelector('.z-mov');

        const zMot = parseFloat(zMotEl.value);
        const zMov = parseFloat(zMovEl.value);

        if (isNaN(zMot) || isNaN(zMov) || zMot <= 0 || zMov <= 0) {
            validationError = true;
            return;
        }

        const gmfHz = currentHz * zMot;

        htmlGmf += `
            <tr>
                <td><strong>Estágio ${idx + 1}</strong><br><small style="color: var(--text-secondary);">Transmissão Eixo ${idx+1} para Eixo ${idx+2}</small></td>
                <td>${zMot} dentes / ${zMov} dentes</td>
                <td><strong style="color: var(--primary); font-family: monospace; font-size: 1.05rem;">${gmfHz.toFixed(2)} Hz</strong></td>
                <td style="font-family: monospace;">${(gmfHz * 2).toFixed(2)} Hz</td>
                <td style="font-family: monospace;">${(gmfHz * 3).toFixed(2)} Hz</td>
            </tr>
        `;

        currentRpm = currentRpm * (zMot / zMov);
        currentHz = currentRpm / 60;
        
        const nomeEixo = (idx === stages.length - 1) ? `Eixo ${idx + 2} (Saída)` : `Eixo ${idx + 2} (Intermediário)`;

        htmlEixos += `
            <tr>
                <td><strong>${nomeEixo}</strong></td>
                <td>${currentRpm.toFixed(1)} RPM</td>
                <td><strong style="color: var(--primary); font-family: monospace; font-size: 1.05rem;">${currentHz.toFixed(3)} Hz</strong></td>
            </tr>
        `;
    });

    if (validationError) {
        showError('Erro de Validação: Verifique o preenchimento do número de dentes em todos os cards.');
        return;
    }

    const outEixosEl = document.getElementById('outEixos');
    const outGmfEl = document.getElementById('outGmf');

    if (outEixosEl) outEixosEl.innerHTML = htmlEixos;
    if (outGmfEl) outGmfEl.innerHTML = htmlGmf;
}
