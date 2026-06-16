document.getElementById('calculateBtn').addEventListener('click', function() {
    const crusherType = document.getElementById('crusherType').value;
    const materialHardness = document.getElementById('materialHardness').value;
    const operatingHours = parseFloat(document.getElementById('operatingHours').value);
    const nominalLifespan = parseFloat(document.getElementById('nominalLifespan').value);
    const dailyOperatingHours = parseFloat(document.getElementById('dailyOperatingHours').value);

    if (isNaN(operatingHours) || isNaN(nominalLifespan) || isNaN(dailyOperatingHours) || nominalLifespan <= 0 || dailyOperatingHours <= 0) {
        alert("Por favor, preencha todos os campos com valores numéricos válidos e maiores que zero para Vida Útil Nominal e Horas de Operação Diária.");
        return;
    }

    // Determine severity factor based on crusher type and material hardness
    let severityFactor = 1.0; // Default to normal wear

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
        else if (materialHardness === 'high') severityFactor = 1.5; // Impact crushers are more sensitive to hard materials
    }

    // Calculate estimated total lifespan
    const estimatedTotalLifespan = nominalLifespan / severityFactor;

    // Calculate remaining lifespan
    const remainingLifespan = estimatedTotalLifespan - operatingHours;

    // Calculate remaining days and estimated replacement date
    let remainingDays = 0;
    let replacementDate = "N/A";

    if (remainingLifespan > 0) {
        remainingDays = remainingLifespan / dailyOperatingHours;
        const today = new Date();
        const futureDate = new Date(today.setDate(today.getDate() + remainingDays));
        replacementDate = futureDate.toLocaleDateString('pt-BR');
    } else {
        remainingDays = 0;
        replacementDate = "Vida útil excedida!";
    }

    // Display results
    document.getElementById('estimatedTotalLifespan').textContent = estimatedTotalLifespan.toFixed(0);
    document.getElementById('remainingLifespan').textContent = remainingLifespan.toFixed(0);
    document.getElementById('remainingDays').textContent = remainingDays.toFixed(0);
    document.getElementById('replacementDate').textContent = replacementDate;

    // Show results container and hide placeholder
    document.getElementById('results').style.display = 'grid';
    document.getElementById('resultPlaceholder').style.display = 'none';
});