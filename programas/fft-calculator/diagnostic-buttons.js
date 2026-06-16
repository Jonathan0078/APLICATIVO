
document.addEventListener('DOMContentLoaded', () => {
    const startDiagnosticBtn = document.querySelector('#interpretation-section .action-btn:nth-child(1)');
    const pauseDiagnosticBtn = document.querySelector('#interpretation-section .action-btn:nth-child(2)');
    const stopDiagnosticBtn = document.querySelector('#interpretation-section .action-btn:nth-child(3)');
    const restartDiagnosticBtn = document.querySelector('#interpretation-section .action-btn:nth-child(4)');

    if (startDiagnosticBtn) {
        startDiagnosticBtn.addEventListener('click', () => {
            if (window.currentSpectralData) {
                const aiResults = window.aiDiagnostic.analyzeWithAI(window.currentSpectralData);
                displayAIResults(aiResults);
            } else {
                alert('Por favor, primeiro calcule a FFT antes de iniciar o diagnóstico com IA.');
            }
        });
    }

    if (pauseDiagnosticBtn) {
        pauseDiagnosticBtn.addEventListener('click', () => {
            alert('Funcionalidade de pausar diagnóstico ainda não implementada.');
        });
    }

    if (stopDiagnosticBtn) {
        stopDiagnosticBtn.addEventListener('click', () => {
            const aiResultsContainer = document.getElementById('ai-results');
            if (aiResultsContainer) {
                aiResultsContainer.innerHTML = '';
            }
            alert('Diagnóstico parado.');
        });
    }

    if (restartDiagnosticBtn) {
        restartDiagnosticBtn.addEventListener('click', () => {
            if (window.currentSpectralData) {
                const aiResults = window.aiDiagnostic.analyzeWithAI(window.currentSpectralData);
                displayAIResults(aiResults);
            } else {
                alert('Por favor, primeiro calcule a FFT antes de reiniciar o diagnóstico com IA.');
            }
        });
    }

    function displayAIResults(aiResults) {
        const aiResultsContainer = document.getElementById('ai-results');
        if (!aiResultsContainer) {
            console.error('Elemento ai-results não encontrado');
            return;
        }

        let html = `
            <div class="ai-summary">
                <h4>Diagnóstico da IA</h4>
                <p><strong>Confiança Geral:</strong> ${(aiResults.confidence * 100).toFixed(1)}%</p>
                <p><strong>Nível de Risco:</strong> ${aiResults.riskLevel}</p>
            </div>
            <div class="ai-details">
                <h5>Detalhes da Análise</h5>
        `;

        for (const [fault, result] of Object.entries(aiResults.diagnosis)) {
            if (result.detected) {
                html += `
                    <div class="ai-fault-card">
                        <h6>${fault.charAt(0).toUpperCase() + fault.slice(1)}</h6>
                        <p><strong>Confiança:</strong> ${(result.confidence * 100).toFixed(1)}%</p>
                        <p><strong>Sintomas:</strong> ${result.symptoms.join(', ')}</p>
                    </div>
                `;
            }
        }

        html += '</div>';

        if (aiResults.recommendations.length > 0) {
            html += `
                <div class="ai-recommendations">
                    <h5>Recomendações da IA</h5>
                    <ul>
            `;
            aiResults.recommendations.forEach(rec => {
                html += `<li><strong>${rec.action}</strong> (Prioridade: ${rec.priority})</li>`;
            });
            html += '</ul></div>';
        }

        aiResultsContainer.innerHTML = html;
    }
});
