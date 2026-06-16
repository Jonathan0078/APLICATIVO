document.addEventListener('DOMContentLoaded', () => {
    const convertBtn = document.getElementById('convert-btn');
    const mmInput = document.getElementById('mm-input');
    const resultText = document.getElementById('result-text');
    const referenceContainer = document.getElementById('reference-container');
    const copyBtn = document.getElementById('copy-btn');
    const themeBtn = document.getElementById('theme-btn');
    const toast = document.getElementById('toast');

    // Inicializar tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();

    // Valores de referência comuns em polegadas fracionárias
    const commonFractions = [
        { fraction: "1/16", mm: 1.5875 },
        { fraction: "1/8", mm: 3.175 },
        { fraction: "3/16", mm: 4.7625 },
        { fraction: "1/4", mm: 6.35 },
        { fraction: "5/16", mm: 7.9375 },
        { fraction: "3/8", mm: 9.525 },
        { fraction: "7/16", mm: 11.1125 },
        { fraction: "1/2", mm: 12.7 },
        { fraction: "9/16", mm: 14.2875 },
        { fraction: "5/8", mm: 15.875 },
        { fraction: "11/16", mm: 17.4625 },
        { fraction: "3/4", mm: 19.05 },
        { fraction: "13/16", mm: 20.6375 },
        { fraction: "7/8", mm: 22.225 },
        { fraction: "15/16", mm: 23.8125 },
        { fraction: "1", mm: 25.4 },
        { fraction: "1-1/4", mm: 31.75 },
        { fraction: "1-1/2", mm: 38.1 },
        { fraction: "1-3/4", mm: 44.45 },
        { fraction: "2", mm: 50.8 },
        { fraction: "2-1/4", mm: 57.15 },
        { fraction: "2-1/2", mm: 63.5 },
        { fraction: "2-3/4", mm: 69.85 },
        { fraction: "3", mm: 76.2 },
        { fraction: "3-1/4", mm: 82.55 },
        { fraction: "3-1/2", mm: 88.9 },
        { fraction: "3-3/4", mm: 95.25 },
        { fraction: "4", mm: 101.6 }
    ];

    // Criar e exibir os valores de referência
    commonFractions.forEach(({ fraction, mm }) => {
        const referenceItem = document.createElement('div');
        referenceItem.className = 'reference-item';
        referenceItem.innerHTML = `
            <span class="fraction">${fraction}"</span>
            <span class="mm">${mm} mm</span>
        `;
        referenceItem.addEventListener('click', () => {
            mmInput.value = mm;
            performConversion();
        });
        referenceContainer.appendChild(referenceItem);
    });

    function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    }

    function convertMmToFractionalInches(mm) {
        if (isNaN(mm) || mm < 0) {
            return "Entrada inválida";
        }
        
        if (mm > 999999) {
            return "Valor muito grande";
        }
        
        // Remove o resultado anterior
        resultText.style.opacity = '0';

        const inchesTotal = mm / 25.4;
        const wholeInches = Math.floor(inchesTotal);
        const fractionalInches = inchesTotal - wholeInches;

        if (fractionalInches < 0.0001) {
            return `${wholeInches}"`;
        }

        const maxDenominator = 64;
        let bestFit = {
            numerator: 0,
            denominator: 1,
            error: fractionalInches
        };

        for (let denominator = 2; denominator <= maxDenominator; denominator *= 2) {
            const numerator = Math.round(fractionalInches * denominator);
            const error = Math.abs(fractionalInches - (numerator / denominator));

            if (error < bestFit.error) {
                bestFit = { numerator, denominator, error };
            }
        }

        let { numerator, denominator } = bestFit;

        if (numerator === 0) {
            return `${wholeInches}"`;
        }

        const commonDivisor = gcd(numerator, denominator);
        numerator /= commonDivisor;
        denominator /= commonDivisor;

        if (denominator === 1) {
             return `${wholeInches + numerator}"`;
        }

        if (wholeInches === 0) {
            return `${numerator}/${denominator}"`;
        }

        return `${wholeInches} ${numerator}/${denominator}"`;
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function updateThemeIcon() {
    if (!themeBtn) return; // se o botão não existir, não tenta atualizar
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function performConversion() {
        const mmValueStr = mmInput.value.replace(',', '.');
        const mmValue = parseFloat(mmValueStr);

        if (mmInput.value.trim() === '') {
            resultText.textContent = '-';
            resultText.style.opacity = '1';
            return;
        }

        const result = convertMmToFractionalInches(mmValue);
        resultText.textContent = result;
        resultText.style.opacity = '1';
    }

    convertBtn.addEventListener('click', performConversion);

    mmInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performConversion();
        }
    });

    // Copiar resultado
    copyBtn.addEventListener('click', async () => {
        const result = resultText.textContent;
        if (result !== '-') {
            try {
                await navigator.clipboard.writeText(result);
                showToast('Resultado copiado!');
            } catch (err) {
                showToast('Erro ao copiar');
            }
        }
    });

    // Alternar tema
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });

    // histórico removido — nada a inicializar aqui
});
