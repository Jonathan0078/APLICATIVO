document.getElementById('calculateBtn').addEventListener('click', function() {
    // Efficiency Inputs
    const feedFines = parseFloat(document.getElementById('feedFines').value);
    const productFines = parseFloat(document.getElementById('productFines').value);
    const rejectFines = parseFloat(document.getElementById('rejectFines').value);

    // Capacity Inputs
    const screenWidth = parseFloat(document.getElementById('screenWidth').value);
    const screenLength = parseFloat(document.getElementById('screenLength').value);
    const totalFeedRate = parseFloat(document.getElementById('totalFeedRate').value);
    const materialDensity = parseFloat(document.getElementById('materialDensity').value);
    const screenAperture = parseFloat(document.getElementById('screenAperture').value);
    const materialCorrectionFactor = parseFloat(document.getElementById('materialCorrectionFactor').value);
    const apertureCorrectionFactor = parseFloat(document.getElementById('apertureCorrectionFactor').value);

    // Mapeamento de UI
    const erroContainer = document.getElementById('erro-container');
    const erroMsg = document.getElementById('erro-msg');
    const resultsContainer = document.getElementById('results');
    const placeholder = document.getElementById('resultPlaceholder');

    // Reseta estado
    erroContainer.style.display = 'none';
    resultsContainer.style.display = 'none';

    // Validate inputs (Sem alert nativo)
    if (isNaN(feedFines) || isNaN(productFines) || isNaN(rejectFines) ||
        isNaN(screenWidth) || isNaN(screenLength) || isNaN(totalFeedRate) || isNaN(materialDensity) || isNaN(screenAperture) ||
        isNaN(materialCorrectionFactor) || isNaN(apertureCorrectionFactor) ||
        feedFines < 0 || productFines < 0 || rejectFines < 0 ||
        screenWidth <= 0 || screenLength <= 0 || totalFeedRate <= 0 || materialDensity <= 0 || screenAperture <= 0 ||
        materialCorrectionFactor <= 0 || apertureCorrectionFactor <= 0) {
        
        // Define a mensagem (usa o i18n se existir, senão usa o fallback em português)
        erroMsg.textContent = typeof i18n !== 'undefined' && i18n.t 
            ? i18n.t('peneira.error_invalid_inputs') 
            : "Please fill all fields with valid numeric values greater than zero.";
        
        erroContainer.style.display = 'block';
        placeholder.style.display = 'block';
        return;
    }

    placeholder.style.display = 'none';

    // --- Efficiency Calculation ---
    let screeningEfficiency = 0;
    if (feedFines > 0) {
        screeningEfficiency = (productFines / feedFines) * 100;
    }

    // --- Capacity Calculation (Simplified Model) ---
    // This is a very simplified model. Real capacity calculations are complex and depend on many factors.
    // A common approach is to use a base capacity per unit area and apply correction factors.
    // For demonstration, let's assume a base capacity (e.g., 50 ton/h/m² for a standard screen)
    const baseCapacityPerArea = 50; // Example: ton/h/m² for a specific material and screen type

    const screenArea = screenWidth * screenLength;
    const theoreticalCapacity = baseCapacityPerArea * screenArea;

    // Apply correction factors
    const actualCapacity = theoreticalCapacity * materialCorrectionFactor * apertureCorrectionFactor;
    const specificCapacity = actualCapacity / screenArea;

    // Display results
    document.getElementById('screeningEfficiency').textContent = screeningEfficiency.toFixed(2);
    document.getElementById('actualCapacity').textContent = actualCapacity.toFixed(2);
    document.getElementById('specificCapacity').textContent = specificCapacity.toFixed(2);
    
    // Show results container
    resultsContainer.style.display = 'grid';
});
