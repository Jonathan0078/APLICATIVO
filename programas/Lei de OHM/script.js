// Aguarda o carregamento completo do DOM para iniciar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleção dos elementos do DOM
    const wheel = document.getElementById('ohm-wheel');
    const instruction = document.getElementById('instruction');
    const calculatorInterface = document.getElementById('calculator-interface');
    const calculatorContent = document.getElementById('calculator-content');
    const formulaTitle = document.getElementById('formula-title');
    const formulaButtonsContainer = document.getElementById('formula-buttons');
    const inputSection = document.getElementById('input-section');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultEl = document.getElementById('result');

    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const icon1 = document.getElementById('icon1');
    const icon2 = document.getElementById('icon2');

    // Variáveis para guardar o estado atual do cálculo
    let currentFormula = null;
    let currentUnit = '';

    // Objeto com todos os dados e fórmulas da calculadora
    const data = {
        'P': { name: 'Potência', unit: 'W', formulas: [
            { text: 'V &times; I', id: 'p_vi', inputs: ['V', 'I'] },
            { text: 'R &times; I<sup>2</sup>', id: 'p_ri2', inputs: ['R', 'I'] },
            { text: 'V<sup>2</sup> &divide; R', id: 'p_v2r', inputs: ['V', 'R'] },
        ]},
        'V': { name: 'Tensão', unit: 'V', formulas: [
            { text: 'R &times; I', id: 'v_ri', inputs: ['R', 'I'] },
            { text: 'P &divide; I', id: 'v_pi', inputs: ['P', 'I'] },
            { text: '&radic;(P &times; R)', id: 'v_pr', inputs: ['P', 'R'] },
        ]},
        'I': { name: 'Corrente', unit: 'A', formulas: [
            { text: 'V &divide; R', id: 'i_vr', inputs: ['V', 'R'] },
            { text: 'P &divide; V', id: 'i_pv', inputs: ['P', 'V'] },
            { text: '&radic;(P &divide; R)', id: 'i_pr', inputs: ['P', 'R'] },
        ]},
        'R': { name: 'Resistência', unit: 'Ω', formulas: [
            { text: 'V &divide; I', id: 'r_vi', inputs: ['V', 'I'] },
            { text: 'V<sup>2</sup> &divide; P', id: 'r_vp', inputs: ['V', 'P'] },
            { text: 'P &divide; I<sup>2</sup>', id: 'r_pi2', inputs: ['P', 'I'] },
        ]},
    };
    
    // Ícones para os inputs
    const iconsSVG = { 'P': '⚡️', 'V': 'V', 'I': 'A', 'R': 'Ω' };

    // Adiciona o listener de clique ao círculo
    wheel.addEventListener('click', (e) => {
        const quadrant = e.target.closest('.quadrant');
        if (!quadrant) return;

        const type = quadrant.dataset.type;
        
        // Ativa o quadrante clicado, aplicando classes CSS
        wheel.classList.add('active');
        document.querySelectorAll('.quadrant').forEach(q => q.classList.remove('active'));
        quadrant.classList.add('active');

    // Mostra a interface da calculadora com animação
    instruction.style.display = 'none';
    calculatorContent.classList.remove('hidden');
    calculatorInterface.style.opacity = '1';
    calculatorInterface.style.transform = 'scale(1)';
        
        formulaTitle.innerHTML = `Calcular ${data[type].name}`;
        
        // Cria os botões de fórmula dinamicamente
        formulaButtonsContainer.innerHTML = '';
        data[type].formulas.forEach(formula => {
            const button = document.createElement('button');
            button.innerHTML = formula.text;
            button.onclick = () => selectFormula(formula, data[type].unit);
            formulaButtonsContainer.appendChild(button);
        });

    // Reseta as seções inferiores da calculadora
    inputSection.classList.add('hidden');
    calculateBtn.classList.add('hidden');
        resultEl.textContent = '';
    });

    // Função chamada ao selecionar uma fórmula específica
    function selectFormula(formula, unit) {
        currentFormula = formula.id;
        currentUnit = unit;
        
        // Configura os inputs (labels, placeholders e ícones)
        const label1 = document.getElementById('label1');
        const label2 = document.getElementById('label2');
        
        label1.textContent = data[formula.inputs[0]].name;
        label2.textContent = data[formula.inputs[1]].name;
        
        input1.placeholder = `Digite o valor...`;
        input2.placeholder = `Digite o valor...`;
        
        icon1.textContent = iconsSVG[formula.inputs[0]];
        icon2.textContent = iconsSVG[formula.inputs[1]];
        
        input1.value = '';
        input2.value = '';

    // Mostra a seção de inputs com animação
    inputSection.classList.remove('hidden');
    calculateBtn.classList.remove('hidden');
    inputSection.classList.add('animate-fadeInUp');
    }

    // Adiciona o listener ao botão de calcular
    calculateBtn.addEventListener('click', () => {
        if (!currentFormula) return;

        const val1 = parseFloat(input1.value);
        const val2 = parseFloat(input2.value);

        if (isNaN(val1) || isNaN(val2)) {
            showError("Valores inválidos.");
            return;
        }

        let result = 0;
        try {
             // Executa o cálculo correto baseado na fórmula selecionada
             switch (currentFormula) {
                case 'p_vi': result = val1 * val2; break;
                case 'p_ri2': result = val1 * (val2 ** 2); break;
                case 'p_v2r': if (val2 === 0) throw new Error("Resistência não pode ser zero."); result = (val1 ** 2) / val2; break;
                case 'v_ri': result = val1 * val2; break;
                case 'v_pi': if (val2 === 0) throw new Error("Corrente não pode ser zero."); result = val1 / val2; break;
                case 'v_pr': result = Math.sqrt(val1 * val2); break;
                case 'i_vr': if (val2 === 0) throw new Error("Resistência не pode ser zero."); result = val1 / val2; break;
                case 'i_pv': if (val2 === 0) throw new Error("Tensão não pode ser zero."); result = val1 / val2; break;
                case 'i_pr': if (val2 === 0) throw new Error("Resistência não pode ser zero."); result = Math.sqrt(val1 / val2); break;
                case 'r_vi': if (val2 === 0) throw new Error("Corrente não pode ser zero."); result = val1 / val2; break;
                case 'r_vp': if (val2 === 0) throw new Error("Potência não pode ser zero."); result = (val1 ** 2) / val2; break;
                case 'r_pi2': if (val2 === 0) throw new Error("Corrente não pode ser zero."); result = val1 / (val2 ** 2); break;
            }
            showResult(result, currentUnit);
        } catch (e) {
            showError(e.message);
        }
    });

    // Formata o número do resultado para melhor visualização
    function formatResult(value) {
        if (Math.abs(value) > 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) return value.toExponential(4);
        if (value % 1 !== 0) return parseFloat(value.toFixed(4));
        return value;
    }

    // Mostra o resultado do cálculo com animação
    function showResult(value, unit) {
    resultEl.innerHTML = `${formatResult(value)} <span style="font-size:1rem; color:var(--cor-secundaria);">${unit}</span>`;
    resultEl.classList.remove('text-red-400');
    resultEl.classList.add('animate-popIn');
        // Remove a classe de animação após ela terminar para poder ser usada novamente
        resultEl.addEventListener('animationend', () => resultEl.classList.remove('animate-popIn'), { once: true });
    }

    // Mostra uma mensagem de erro com animação
    function showError(message) {
    resultEl.textContent = message;
    resultEl.style.color = 'var(--cor-erro)';
    resultEl.classList.add('animate-popIn');
        resultEl.addEventListener('animationend', () => resultEl.classList.remove('animate-popIn'), { once: true });
    }
});

      
