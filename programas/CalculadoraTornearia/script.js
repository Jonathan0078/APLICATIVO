document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // GERENCIAMENTO DE TELAS, NAVEGAÇÃO E TEMA
    // =================================================================================
    const screens = document.querySelectorAll('.screen');
    const headerTitle = document.getElementById('header-title');
    const backButton = document.getElementById('back-button');
    const tableDisplayCard = document.getElementById('table-display-card');
    let navigationHistory = ['screen-main-menu'];

    function navigateTo(screenId) {
        if (screenId !== navigationHistory[navigationHistory.length - 1]) {
            navigationHistory.push(screenId);
        }
        screens.forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.add('active');
        updateHeader(screenId);
    }

    function goBack() {
        if (navigationHistory.length > 1) {
            navigationHistory.pop();
            const previousScreenId = navigationHistory[navigationHistory.length - 1];
            screens.forEach(screen => screen.classList.remove('active'));
            document.getElementById(previousScreenId).classList.add('active');
            updateHeader(previousScreenId);
        }
    }

    function updateHeader(screenId) {
        const isMainMenu = screenId === 'screen-main-menu';
        backButton.style.display = isMainMenu ? 'none' : 'block';
        if (isMainMenu) {
            headerTitle.textContent = 'Cálculos da Tornearia';
        } else {
            const screen = document.getElementById(screenId);
            const titleElement = screen.querySelector('.calc-title, .submenu-title');
            headerTitle.textContent = titleElement ? titleElement.textContent : 'Cálculos da Tornearia';
        }
    }

    // =================================================================================
    // LÓGICA PARA CARREGAR TABELAS EXTERNAS
    // =================================================================================
    async function displayTableFromFile(fileName) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`Arquivo não encontrado: ${response.statusText}`);
            const data = await response.json();
            let tableHTML = '';
            if (data.htmlContent) {
                tableHTML = `<h2 class="calc-title">${data.title || ''}</h2>${data.htmlContent}`;
            } else if (data.headers && data.rows) {
                tableHTML = `<h2 class="calc-title">${data.title || ''}</h2><div class="table-container"><table><thead><tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row => `<tr>${Object.values(row).map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
            } else {
                tableHTML = `<h2 class="calc-title">${data.title || 'Tabela'}</h2><p>Formato de tabela não reconhecido.</p>`;
            }
            tableDisplayCard.innerHTML = tableHTML;
            headerTitle.textContent = data.title || 'Tabela';
        } catch (error) {
            console.error('Erro ao carregar a tabela:', error);
            tableDisplayCard.innerHTML = `<h2 class="calc-title">Erro</h2><p>Não foi possível carregar o arquivo da tabela '${fileName}'. Verifique o console para mais detalhes.</p>`;
        }
    }
    
    // =================================================================================
    // LÓGICA DE UNIDADES E CÁLCULOS
    // =================================================================================
    const MM_PER_INCH = 25.4;
    const FEET_PER_METER = 3.28084;
    const calculators = {};

    // Toast helper
    const toastContainer = (() => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    })();

    function showToast(message, timeout = 3000) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = message;
        toastContainer.appendChild(t);
        // force reflow to enable transition
        void t.offsetWidth;
        t.classList.add('show');
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, timeout);
    }

    const showResult = (id, label, value) => {
        const el = document.getElementById(`result-${id}`);
        const safeValue = String(value);
        el.innerHTML = `<span class="label">${label}</span><span class="value">${safeValue}</span><button class="copy-btn" data-copy-target="result-${id}" title="Copiar resultado">Copiar</button>`;
        el.style.display = 'block';
    };

    const setupAdvancedCalculator = (id, inputsMap) => {
        const choiceRadios = document.querySelectorAll(`input[name="${id}-calc"]`);
        const updateUI = () => {
            const choice = document.querySelector(`input[name="${id}-calc"]:checked`).value;
            Object.values(inputsMap).forEach(inputId => {
                const inputEl = document.getElementById(inputId);
                if (inputEl) inputEl.disabled = false;
            });
            const targetInput = document.getElementById(inputsMap[choice]);
            if (targetInput) targetInput.disabled = true;
        };
        choiceRadios.forEach(radio => radio.addEventListener('change', updateUI));
        updateUI();
    };
    
    const getInput = (id) => parseFloat(document.getElementById(id).value) || 0;
    const getSystem = (id) => document.querySelector(`input[name="unit-${id}"]:checked`).value;
    
    // --- Calculadoras Simples ---
    calculators.vc = {
        inputs: { d: 'vc-d', rpm: 'vc-rpm' },
        calculate: (values, system) => {
            let d = values.d;
            if (system === 'imperial') d *= MM_PER_INCH;
            if (!d || !values.rpm) return showToast('Preencha todos os campos.');
            let vc = (d * Math.PI * values.rpm) / 1000;
            const unit = system === 'imperial' ? 'SFM' : 'm/min';
            if (system === 'imperial') vc *= FEET_PER_METER;
            showResult('vc', 'Velocidade de Corte', `${vc.toFixed(2)} ${unit}`);
        }
    };
    
    // --- CORREÇÃO DE SINTAXE EM TODAS AS CALCULADORAS RESTANTES ---
    
    calculators.rpm = {
        inputs: { vc: 'rpm-vc', d: 'rpm-d' },
        calculate: (values, system) => {
            let { vc, d } = values;
        if (!vc || !d) return showToast('Preencha todos os campos.');
            if (system === 'imperial') { vc /= FEET_PER_METER; d *= MM_PER_INCH; }
            const rpm = (vc * 1000) / (d * Math.PI);
            showResult('rpm', 'RPM Calculado', `${rpm.toFixed(0)} RPM`);
        }
    };
    
    calculators.avanco = {
        inputs: { l: 'avanco-l', n: 'avanco-n' },
        calculate: (values, system) => {
            if (!values.l || !values.n) return showToast('Preencha todos os campos.');
            const f = values.l / values.n, unit = system === 'metric' ? 'mm/rot' : 'in/rev';
            showResult('avanco', 'Avanço Calculado', `${f.toFixed(4)} ${unit}`);
        }
    };
    
    calculators.profundidade = {
        inputs: { D: 'profundidade-D', d: 'profundidade-d' },
        calculate: (values, system) => {
            if (!values.D || !values.d) return showToast('Preencha todos os campos.');
            const ap = (values.D - values.d) / 2, unit = system === 'metric' ? 'mm' : 'in';
            showResult('profundidade', 'Profundidade Calculada', `${ap.toFixed(3)} ${unit}`);
        }
    };

    calculators.remocao = {
        inputs: { vc: 'remocao-vc', ap: 'remocao-ap', fn: 'remocao-fn' },
        calculate: (values, system) => {
            let { vc, ap, fn } = values;
            if (!vc || !ap || !fn) return showToast('Preencha todos os campos.');
            if (system === 'imperial') { vc /= FEET_PER_METER; ap *= MM_PER_INCH; fn *= MM_PER_INCH; }
            const Q = (vc * 1000 * ap * fn) / 1000;
            const unit = system === 'metric' ? 'cm³/min' : 'in³/min';
            const result = system === 'imperial' ? Q / 16387.1 : Q;
            showResult('remocao', 'Taxa de Remoção', `${result.toFixed(2)} ${unit}`);
        }
    };

    // --- Calculadoras Avançadas ---
    setupAdvancedCalculator('tempo', { tempo: 'tempo-tc', comprimento: 'tempo-l', rpm: 'tempo-n', avanco: 'tempo-f' });
    calculators.tempo = {
        inputs: { tempo: 'tempo-tc', comprimento: 'tempo-l', rpm: 'tempo-n', avanco: 'tempo-f' },
        calculate: (values, system) => {
            try {
                const choice = document.querySelector('input[name="tempo-calc"]:checked').value;
                let { tempo, comprimento, rpm, avanco } = values;
                if (system === 'imperial') { comprimento *= MM_PER_INCH; avanco *= MM_PER_INCH; }
                let result, label, unit = "min";
                if (choice === 'tempo') { if(!comprimento || !rpm || !avanco) throw new Error("Preencha Comprimento, RPM e Avanço"); result = comprimento / (rpm * avanco); label = "Tempo de Corte"; }
                else if (choice === 'comprimento') { if(!tempo || !rpm || !avanco) throw new Error("Preencha Tempo, RPM e Avanço"); result = tempo * rpm * avanco; label = "Comprimento"; unit = system === 'metric' ? 'mm' : 'in'; if(system === 'imperial') result /= MM_PER_INCH;}
                else if (choice === 'rpm') { if(!comprimento || !tempo || !avanco) throw new Error("Preencha Comprimento, Tempo e Avanço"); result = comprimento / (tempo * avanco); label = "RPM"; unit = "RPM"; }
                else { if(!comprimento || !tempo || !rpm) throw new Error("Preencha Comprimento, Tempo e RPM"); result = comprimento / (tempo * rpm); label = "Avanço"; unit = system === 'metric' ? 'mm/rot' : 'in/rev'; if(system === 'imperial') result /= MM_PER_INCH;}
                showResult('tempo', label, `${result.toFixed(3)} ${unit}`);
            } catch (e) { showToast(e.message); }
        }
    };
    
    setupAdvancedCalculator('rugosidade', { rugosidade: 'rugosidade-h', avanco: 'rugosidade-f', raio: 'rugosidade-re' });
    calculators.rugosidade = {
        inputs: { rugosidade: 'rugosidade-h', avanco: 'rugosidade-f', raio: 'rugosidade-re' },
        calculate: (values, system) => {
            try {
                const choice = document.querySelector('input[name="rugosidade-calc"]:checked').value;
                let { rugosidade, avanco, raio } = values;
                if (system === 'imperial') { avanco *= MM_PER_INCH; raio *= MM_PER_INCH; }
                let result, label, unit;
                if (choice === 'rugosidade') { if(!avanco || !raio) throw new Error("Preencha Avanço e Raio"); result = (avanco**2 / (8 * raio)) * 1000; label = "Rugosidade (h)"; unit="µm";}
                else if (choice === 'avanco') { if(!rugosidade || !raio) throw new Error("Preencha Rugosidade e Raio"); result = Math.sqrt(rugosidade * 8 * raio / 1000); label = "Avanço (f)"; unit = system === 'metric' ? 'mm/rot' : 'in/rev'; if(system === 'imperial') result /= MM_PER_INCH;}
                else { if(!rugosidade || !avanco) throw new Error("Preencha Rugosidade e Avanço"); result = (avanco**2 / (rugosidade / 1000)) / 8; label = "Raio (Re)"; unit = system === 'metric' ? 'mm' : 'in'; if(system === 'imperial') result /= MM_PER_INCH; }
                showResult('rugosidade', label, `${result.toFixed(4)} ${unit}`);
            } catch(e) { showToast(e.message); }
        }
    };
    
    setupAdvancedCalculator('potencia', { potencia: 'potencia-pc', vc: 'potencia-vc' });
    calculators.potencia = {
        inputs: { potencia: 'potencia-pc', vc: 'potencia-vc', ap: 'potencia-ap', fn: 'potencia-fn', kc: 'potencia-kc', eta: 'potencia-eta' },
        calculate: (values, system) => {
            try {
                const choice = document.querySelector('input[name="potencia-calc"]:checked').value;
                let { potencia, vc, ap, fn, kc, eta } = values;
                if (system === 'imperial') { vc /= FEET_PER_METER; ap *= MM_PER_INCH; fn *= MM_PER_INCH; }
                let result, label, unit;
                if (choice === 'potencia') { if(!vc || !ap || !fn) throw new Error("Preencha Vc, ap e fn"); result = (vc * ap * fn * kc) / (60000 * eta); label = "Potência (Pc)"; unit = "kW"; }
                else { if(!potencia || !ap || !fn) throw new Error("Preencha Pc, ap e fn"); result = (potencia * 60000 * eta) / (ap * fn * kc); label = "Velocidade (Vc)"; unit = system === 'metric' ? 'm/min' : 'SFM'; if(system === 'imperial') result *= FEET_PER_METER; }
                showResult('potencia', label, `${result.toFixed(2)} ${unit}`);
            } catch(e) { showToast(e.message); }
        }
    };
    
    // =================================================================================
    // INICIALIZAÇÃO E CONEXÃO DOS EVENTOS
    // =================================================================================
    // copy button handling and theme persistence
    document.body.addEventListener('click', (event) => {
        const screenTarget = event.target.closest('[data-screen]');
        if (screenTarget) navigateTo(screenTarget.dataset.screen);

        const tableTarget = event.target.closest('[data-tablefile]');
        if (tableTarget) {
            displayTableFromFile(tableTarget.dataset.tablefile);
            navigateTo('screen-table-display');
        }

        const calcButton = event.target.closest('.main-button[data-calculator]');
        if (calcButton) {
            const id = calcButton.dataset.calculator;
            const calc = calculators[id];
            if (calc) {
                const values = {};
                Object.keys(calc.inputs).forEach(key => {
                    values[key] = getInput(calc.inputs[key]);
                });
                const system = getSystem(id);
                calc.calculate(values, system);
            }
        }

        // copy result
        const copyBtn = event.target.closest('.copy-btn');
        if (copyBtn) {
            const containerId = copyBtn.getAttribute('data-copy-target');
            const container = document.getElementById(containerId);
            if (container) {
                const text = container.querySelector('.value') ? container.querySelector('.value').textContent : container.textContent;
                navigator.clipboard?.writeText(text).then(() => showToast('Resultado copiado'), () => showToast('Não foi possível copiar'));
            }
        }
    });
    backButton.addEventListener('click', goBack);

    // theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    function applyTheme(theme) {
        if (theme === 'dark') document.body.classList.add('dark-theme'); else document.body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.checked = theme === 'dark';
        try { localStorage.setItem('calc-theme', theme); } catch(e){}
    }
    // initialize theme from storage or system
    try {
        const stored = localStorage.getItem('calc-theme');
        if (stored) applyTheme(stored);
        else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    } catch(e) { applyTheme('light'); }
    if (themeToggle) themeToggle.addEventListener('change', (e) => applyTheme(e.target.checked ? 'dark' : 'light'));
});
