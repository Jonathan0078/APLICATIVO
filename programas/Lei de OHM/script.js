// Aguarda o carregamento completo do DOM para iniciar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleção dos elementos do DOM
    const wheel = document.getElementById('ohm-wheel');
    const instruction = document.getElementById('instruction');
    const calculatorContent = document.getElementById('calculator-content');
    const formulaTitle = document.getElementById('formula-title');
    const formulaButtonsContainer = document.getElementById('formula-buttons');
    const inputSection = document.getElementById('input-section');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultEl = document.getElementById('result');
    const badge = document.getElementById('categoria-atual-label');

    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const icon1 = document.getElementById('icon1');
    const icon2 = document.getElementById('icon2');

    // Variáveis para guardar o estado atual do cálculo
    let currentFormula = null;
    let currentUnit = '';

    // Objeto com todos os dados e fórmulas da calculadora
    const data = {
        'P': { name: () => i18n.t('ohm.label_power'), unit: 'W', formulas: [
            { text: 'V × I', id: 'p_vi', inputs: ['V', 'I'] },
            { text: 'R × I²', id: 'p_ri2', inputs: ['R', 'I'] },
            { text: 'V² ÷ R', id: 'p_v2r', inputs: ['V', 'R'] },
        ]},
        'V': { name: () => i18n.t('ohm.label_voltage'), unit: 'V', formulas: [
            { text: 'R × I', id: 'v_ri', inputs: ['R', 'I'] },
            { text: 'P ÷ I', id: 'v_pi', inputs: ['P', 'I'] },
            { text: '√(P × R)', id: 'v_pr', inputs: ['P', 'R'] },
        ]},
        'I': { name: () => i18n.t('ohm.label_current'), unit: 'A', formulas: [
            { text: 'V ÷ R', id: 'i_vr', inputs: ['V', 'R'] },
            { text: 'P ÷ V', id: 'i_pv', inputs: ['P', 'V'] },
            { text: '√(P ÷ R)', id: 'i_pr', inputs: ['P', 'R'] },
        ]},
        'R': { name: () => i18n.t('ohm.label_resistance'), unit: 'Ω', formulas: [
            { text: 'V ÷ I', id: 'r_vi', inputs: ['V', 'I'] },
            { text: 'V² ÷ P', id: 'r_vp', inputs: ['V', 'P'] },
            { text: 'P ÷ I²', id: 'r_pi2', inputs: ['P', 'I'] },
        ]},
    };
    
    // Ícones para os inputs
    const iconsSVG = { 'P': '⚡', 'V': 'V', 'I': 'A', 'R': 'Ω' };
    const nomesGrandezas = { 'P': i18n.t('ohm.label_power'), 'V': i18n.t('ohm.label_voltage'), 'I': i18n.t('ohm.label_current'), 'R': i18n.t('ohm.label_resistance') };

    // Adiciona o listener de clique ao círculo
    wheel.addEventListener('click', (e) => {
        const quadrant = e.target.closest('.quadrant');
        if (!quadrant) return;

        const type = quadrant.dataset.type;
        
        // Ativa o quadrante clicado
        wheel.classList.add('active');
        document.querySelectorAll('.quadrant').forEach(q => q.classList.remove('active'));
        quadrant.classList.add('active');

        // Mostra a interface da calculadora
        instruction.style.display = 'none';
        calculatorContent.classList.remove('hidden');
        calculatorContent.style.display = 'flex';
        
        // Atualiza o badge e título
        badge.textContent = data[type].name();
        formulaTitle.textContent = i18n.t('ohm.calc_prefix') + ' ' + data[type].name();
        
        // Cria os botões de fórmula dinamicamente
        formulaButtonsContainer.innerHTML = '';
        data[type].formulas.forEach(formula => {
            const button = document.createElement('button');
            button.innerHTML = formula.text;
            button.onclick = () => selectFormula(formula, data[type].unit);
            formulaButtonsContainer.appendChild(button);
        });

        // Reseta as seções inferiores
        inputSection.classList.add('hidden');
        calculateBtn.classList.add('hidden');
        resultEl.textContent = '';
        resultEl.style.color = 'var(--primary)';
    });

    // Função chamada ao selecionar uma fórmula específica
    function selectFormula(formula, unit) {
        currentFormula = formula.id;
        currentUnit = unit;
        
        // Configura os inputs
        const label1 = document.getElementById('label1');
        const label2 = document.getElementById('label2');
        
        label1.textContent = data[formula.inputs[0]].name();
        label2.textContent = data[formula.inputs[1]].name();
        
        input1.placeholder = i18n.t('ohm.value_placeholder');
        input2.placeholder = i18n.t('ohm.value_placeholder');
        
        icon1.textContent = iconsSVG[formula.inputs[0]];
        icon2.textContent = iconsSVG[formula.inputs[1]];
        
        input1.value = '';
        input2.value = '';

        // Mostra a seção de inputs
        inputSection.classList.remove('hidden');
        calculateBtn.classList.remove('hidden');
        inputSection.classList.add('animate-fadeInUp');
        resultEl.textContent = '';
    }

    // Adiciona o listener ao botão de calcular
    calculateBtn.addEventListener('click', () => {
        if (!currentFormula) return;

        const val1 = parseFloat(input1.value);
        const val2 = parseFloat(input2.value);

        if (isNaN(val1) || isNaN(val2)) {
            showError(i18n.t('ohm.invalid_values'));
            return;
        }

        let result = 0;
        try {
            switch (currentFormula) {
                case 'p_vi': result = val1 * val2; break;
                case 'p_ri2': result = val1 * (val2 ** 2); break;
                case 'p_v2r': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_resistance')); result = (val1 ** 2) / val2; break;
                case 'v_ri': result = val1 * val2; break;
                case 'v_pi': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_current')); result = val1 / val2; break;
                case 'v_pr': if (val1 < 0 || val2 < 0) throw new Error(i18n.t('ohm.err_negative_values')); result = Math.sqrt(val1 * val2); break;
                case 'i_vr': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_resistance')); result = val1 / val2; break;
                case 'i_pv': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_voltage')); result = val1 / val2; break;
                case 'i_pr': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_resistance')); if (val1 < 0 || val2 < 0) throw new Error(i18n.t('ohm.err_negative_values')); result = Math.sqrt(val1 / val2); break;
                case 'r_vi': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_current')); result = val1 / val2; break;
                case 'r_vp': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_power')); result = (val1 ** 2) / val2; break;
                case 'r_pi2': if (val2 === 0) throw new Error(i18n.t('ohm.err_zero_current')); result = val1 / (val2 ** 2); break;
            }
            showResult(result, currentUnit);
        } catch (e) {
            showError(e.message);
        }
    });

    // Formata o número do resultado
    function formatResult(value) {
        if (Math.abs(value) > 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) return value.toExponential(4);
        if (value % 1 !== 0) return parseFloat(value.toFixed(4));
        return value;
    }

    // Mostra o resultado do cálculo
    function showResult(value, unit) {
        resultEl.innerHTML = `${formatResult(value)} <span style="font-size:1rem; color:var(--text-secondary);">${unit}</span>`;
        resultEl.style.color = 'var(--primary)';
        resultEl.classList.remove('text-red-400');
        resultEl.classList.add('animate-popIn');
        resultEl.addEventListener('animationend', () => resultEl.classList.remove('animate-popIn'), { once: true });
    }

    // Mostra uma mensagem de erro
    function showError(message) {
        resultEl.textContent = message;
        resultEl.style.color = 'var(--cor-erro)';
        resultEl.classList.add('animate-popIn');
        resultEl.addEventListener('animationend', () => resultEl.classList.remove('animate-popIn'), { once: true });
    }
});