document.getElementById('calculateBtn').addEventListener('click', function() {
    const crusherType = document.getElementById('crusherType').value;
    const materialHardness = document.getElementById('materialHardness').value;
    const operatingHours = parseFloat(document.getElementById('operatingHours').value);
    const nominalLifespan = parseFloat(document.getElementById('nominalLifespan').value);
    const dailyOperatingHours = parseFloat(document.getElementById('dailyOperatingHours').value);

    // Mapeamento da UI
    const erroContainer = document.getElementById('erro-container');
    const erroMsg = document.getElementById('erro-msg');
    const resultsContainer = document.getElementById('results');
    const placeholder = document.getElementById('resultPlaceholder');
    const verdictContainer = document.getElementById('verdict-container');

    // Reseta estado
    erroContainer.style.display = 'none';
    resultsContainer.style.display = 'none';

    // Validação
    if (isNaN(operatingHours) || isNaN(nominalLifespan) || isNaN(dailyOperatingHours) || nominalLifespan <= 0 || dailyOperatingHours <= 0 || operatingHours < 0) {
        erroMsg.textContent = i18n.t('trituradores.err_fill_fields');
        erroContainer.style.display = 'block';
        placeholder.style.display = 'block';
        return;
    }

    placeholder.style.display = 'none';

    // Fator de Severidade
    let severityFactor = 1.0; 
    if (crusherType === 'jaw') {
        if (materialHardness === 'low') severityFactor = 0.9;
        else if (materialHardness === 'medium') severityFactor = 1.1;
        else if (materialHardness === 'high') severityFactor = 1.3;
    } else if (crusherType === 'cone') {
        if (materialHardness === 'low') severityFactor = 0.8;
        else if (materialHardness === 'medium') severityFactor = 1.0;
        else if (materialHardness === 'high') severityFactor = 1.2;
    } else if (crusherType === 'impact') {
        if (materialHardness === 'low') severityFactor = 1.0;
        else if (materialHardness === 'medium') severityFactor = 1.2;
        else if (materialHardness === 'high') severityFactor = 1.5; 
    }

    // Cálculos
    const estimatedTotalLifespan = nominalLifespan / severityFactor;
    const remainingLifespan = estimatedTotalLifespan - operatingHours;
    let remainingDays = 0;
    let replacementDate = "N/A";

    // Alimenta os campos numéricos
    document.getElementById('outEstimated').value = estimatedTotalLifespan.toFixed(0);
    document.getElementById('outRemaining').value = remainingLifespan.toFixed(0);

    // Alimenta o Veredito (container estilizado)
    verdictContainer.className = 'resultado-container'; // Limpa as classes de cor

    if (remainingLifespan > 0) {
        remainingDays = remainingLifespan / dailyOperatingHours;
        const today = new Date();
        const futureDate = new Date(today.setDate(today.getDate() + remainingDays));
        replacementDate = futureDate.toLocaleDateString(i18n.locale ? i18n.locale() : 'pt-BR');
        
        document.getElementById('outDays').value = remainingDays.toFixed(0);
        document.getElementById('outDate').textContent = "📅 " + replacementDate;
        document.getElementById('outDateSub').textContent = i18n.t('trituradores.normal_op');
        verdictContainer.classList.add('success'); // Fica com fundo/borda verde
    } else {
        document.getElementById('outDays').value = "0";
        document.getElementById('outDate').textContent = "🚨 " + i18n.t('trituradores.immediate_replacement');
        document.getElementById('outDateSub').textContent = i18n.t('trituradores.exceeded_life');
        verdictContainer.classList.add('error'); // Fica com fundo/borda vermelho
    }

    resultsContainer.style.display = 'block';
});
