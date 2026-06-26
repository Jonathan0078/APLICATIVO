document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rime-form');
    const resultDisplay = document.getElementById('result-display');
    const recommendationDisplay = document.getElementById('recommendation-display');
    const criticidadeSelect = document.getElementById('criticidade');
    const estrategiaSelect = document.getElementById('estrategia');
    const allCells = document.querySelectorAll('#rime-matrix td');

    // Função para limpar destaques e resultados
    const clearResults = () => {
        allCells.forEach(cell => cell.classList.remove('highlight'));
        resultDisplay.textContent = i18n.t('rime.waiting');
        resultDisplay.className = 'result-display';
        recommendationDisplay.innerHTML = `<p><strong>${i18n.t('rime.recommended_action')}</strong> ${i18n.t('rime.select_hint')}</p>`;
    };

    // Evento de submissão do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Limpa o destaque anterior
        allCells.forEach(cell => cell.classList.remove('highlight'));

        // Obtém os valores dos selects
        const criticidadeValue = parseInt(criticidadeSelect.value);
        const estrategiaValue = parseInt(estrategiaSelect.value);

        // Obtém a letra da linha para identificar a célula
        const criticidadeRow = criticidadeSelect.options[criticidadeSelect.selectedIndex].dataset.row;

        // Calcula a pontuação
        const score = criticidadeValue * estrategiaValue;

        // Encontra e destaca a célula correspondente
        const targetCellId = `cell-${criticidadeRow}-${estrategiaValue}`;
        const targetCell = document.getElementById(targetCellId);
        if (targetCell) {
            targetCell.classList.add('highlight');
            targetCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }

        // Exibe a pontuação e a recomendação
        resultDisplay.textContent = `${i18n.t('rime.score')}: ${score}`;
        updateRecommendation(score);
    });

    // Evento de reset do formulário
    form.addEventListener('reset', () => {
        clearResults();
    });

    // Indicador de scroll na Matriz RIME (mostra/esconde o fade da direita)
    const tableWrapper = document.querySelector('.table-scroll-wrapper');
    if (tableWrapper) {
        const checkScrollEnd = () => {
            const atEnd = tableWrapper.scrollLeft + tableWrapper.clientWidth >= tableWrapper.scrollWidth - 2;
            tableWrapper.classList.toggle('scrolled-end', atEnd);
        };
        tableWrapper.addEventListener('scroll', checkScrollEnd);
        window.addEventListener('resize', checkScrollEnd);
        checkScrollEnd();
    }

    // Função para atualizar a recomendação e a cor do display de resultado
    const updateRecommendation = (score) => {
        let recommendationText = '';
        let resultClass = '';

        if (score >= 20) {
            resultClass = 'alta';
            recommendationText = i18n.t('rime.rec.max');
        } else if (score >= 12) {
            resultClass = 'media';
            recommendationText = i18n.t('rime.rec.high');
        } else if (score >= 7) {
            resultClass = 'baixa';
            recommendationText = i18n.t('rime.rec.medium');
        } else {
            resultClass = 'baixa';
            recommendationText = i18n.t('rime.rec.low');
        }

        resultDisplay.className = `result-display ${resultClass}`;
        recommendationDisplay.innerHTML = `<p><strong>${i18n.t('rime.recommended_action')}</strong> ${recommendationText}</p>`;
    };
});
