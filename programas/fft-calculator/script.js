// Função principal de inicialização
function initializeCalculator() {
    console.log('Inicializando calculadora FFT...');

    // Verifica se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não carregado!');
        alert('Erro: Chart.js não foi carregado. Recarregue a página.');
        return;
    }

    // Adiciona listener ao botão calcular
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculateClick);
        console.log('Event listener adicionado ao botão calcular');
    } else {
        console.error('Botão calcular não encontrado!');
        return;
    }

    // Inicializa outros componentes
    initializeTabControls();
    initializeZoomControls();
    initializeExportControls();
    initializeDiagnosticControls(); // Adicionado para os botões de diagnóstico

    console.log('Calculadora inicializada com sucesso');
}

// Função para lidar com o cálculo
function handleCalculateClick() {
    try {
        const timeDataInput = document.getElementById('time-data').value;
        const sampleRate = parseFloat(document.getElementById('sample-rate').value);
        const windowFunction = document.getElementById('window-function').value;

        let timeData = timeDataInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

        if (timeData.length === 0) {
            alert('Por favor, insira dados numéricos válidos separados por vírgulas.');
            return;
        }

        // --- Aplica a função de janelamento ---
        let windowedData = applyWindow(timeData, windowFunction);

        // --- Garante que o comprimento dos dados seja uma potência de 2 (Zero Padding) ---
        const N = Math.pow(2, Math.ceil(Math.log2(windowedData.length)));
        const paddedData = padData(windowedData, N);

        // --- Verifica se análise com overlap está habilitada ---
        const overlapPercentage = parseFloat(document.getElementById('overlap-percentage').value) || 50;
        const enableOverlap = overlapPercentage > 0;

        let fftResults = [];
        let finalMagnitudes = [];
        let fftResult = null;

        if (enableOverlap && windowedData.length > 512) {
            // Análise com sobreposição
            const windowSize = Math.pow(2, Math.floor(Math.log2(windowedData.length / 4)));
            const hopSize = Math.floor(windowSize * (1 - overlapPercentage / 100));

            for (let i = 0; i + windowSize <= windowedData.length; i += hopSize) {
                const segment = windowedData.slice(i, i + windowSize);
                const paddedSegment = padData(segment, windowSize);
                const segmentFFT = fft(paddedSegment);
                fftResults.push(segmentFFT);
            }

            // Média das magnitudes dos segmentos
            const segmentLength = fftResults[0].length;
            finalMagnitudes = new Array(segmentLength / 2).fill(0);

            fftResults.forEach(result => {
                const segmentMagnitudes = result.slice(0, segmentLength / 2).map(c => Math.sqrt(c.re * c.re + c.im * c.im) / (segmentLength/2));
                segmentMagnitudes.forEach((mag, i) => {
                    finalMagnitudes[i] += mag / fftResults.length;
                });
            });

            fftResult = fftResults[0]; // Usar primeira janela para outras análises
        } else {
            // FFT tradicional sem overlap
            fftResult = fft(paddedData);
            const dataLength = paddedData.length;
            finalMagnitudes = fftResult.slice(0, dataLength / 2).map(c => Math.sqrt(c.re * c.re + c.im * c.im) / (dataLength/2));
        }

        const freqs = Array.from({ length: finalMagnitudes.length }, (_, i) => i * sampleRate / (finalMagnitudes.length * 2));

        // --- Usa magnitudes calculadas com ou sem overlap ---
        const magnitudes = finalMagnitudes;

        // --- Análise Envelope (Demodulação) ---
        let envelopeMagnitudes = [];
        if (document.getElementById('enable-envelope')?.checked) {
            envelopeMagnitudes = calculateEnvelopeSpectrum(timeData, sampleRate);
        }

        // --- Encontra a frequência de pico ---
        const peak = findPeak(magnitudes, freqs);

        // --- Análise estatística avançada do espectro ---
        const spectralStats = calculateAdvancedStatistics(magnitudes, freqs, timeData);

        // --- Análise diagnóstica avançada ---
        const rpm = parseFloat(document.getElementById('rpm').value);
        const diagnosticResults = performDiagnosticAnalysis(magnitudes, freqs, rpm, peak);

        // --- Análise de modulação ---
        const modulationAnalysis = analyzeModulation(magnitudes, freqs, rpm);

        // --- Análise de fase ---
        const phaseAnalysis = calculatePhaseAnalysis(fftResult, freqs, rpm);

        // --- Adiciona análises aos resultados diagnósticos ---
        diagnosticResults.modulation = modulationAnalysis;
        diagnosticResults.phase = phaseAnalysis;

        // --- Salva dados atuais para comparação ---
        currentSpectralData = {
            magnitudes: magnitudes,
            frequencies: freqs,
            peak: peak,
            timestamp: new Date(),
            diagnostics: diagnosticResults,
            statistics: spectralStats
        };

        // --- Análise de tendências se houver baseline ---
        let trendAnalysis = null;
        if (baselineData) {
            trendAnalysis = analyzeTrendWithBaseline(currentSpectralData, baselineData);
        }

        // --- Exibe os resultados ---
        displayResults(magnitudes, freqs, peak, diagnosticResults, spectralStats, trendAnalysis);

    } catch (error) {
        console.error('Erro durante o cálculo FFT:', error);
        alert('Erro durante o cálculo. Verifique os dados de entrada.');
    }
}

let fftChart;
let envelopeChart;
let spectrogramChart;
let trendChart;

// Variáveis para análise avançada
let spectralHistory = [];
let baselineData = null;
let currentSpectralData = null;

function updateChart(freqs, magnitudes, harmonics = []) {
    const ctx = document.getElementById('fft-chart');
    if (!ctx) {
        console.error('Canvas fft-chart não encontrado!');
        return;
    }

    if (fftChart) {
        fftChart.destroy();
    }

    try {
        fftChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: freqs.map(f => f.toFixed(2)),
                datasets: [{
                    label: 'Magnitude do Espectro da FFT',
                    data: magnitudes,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Frequência (Hz)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Magnitude'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const freq = parseFloat(context[0].label);
                                const rpm = parseFloat(document.getElementById('rpm').value) || 1800;
                                const rotationFreq = rpm / 60;
                                const order = Math.round(freq / rotationFreq * 10) / 10;
                                return `Frequência: ${freq.toFixed(2)} Hz ${order > 0.5 && order < 10.5 ? `(≈${order.toFixed(1)}X RPM)` : ''}`;
                            },
                            label: function(context) {
                                return `Magnitude: ${context.raw.toFixed(4)}`;
                            }
                        }
                    }
                }
            }
        });

        console.log('Gráfico criado com sucesso');
    } catch (error) {
        console.error('Erro ao criar gráfico:', error);
        alert('Erro ao criar gráfico. Verifique se os dados estão corretos.');
    }
}

function applyWindow(data, windowType) {
    const n = data.length;
    if (windowType === 'none') {
        return data;
    }
    return data.map((val, i) => {
        let multiplier;
        if (windowType === 'hamming') {
            multiplier = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (n - 1));
        } else if (windowType === 'hanning') {
            multiplier = 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
        } else if (windowType === 'blackman') {
            multiplier = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / (n - 1)) + 0.08 * Math.cos(4 * Math.PI * i / (n - 1));
        } else if (windowType === 'kaiser') {
            // Janela Kaiser simplificada (beta = 8.6)
            const beta = 8.6;
            const alpha = (n - 1) / 2;
            const arg = beta * Math.sqrt(1 - Math.pow((i - alpha) / alpha, 2));
            multiplier = besselI0(arg) / besselI0(beta);
        } else { // Default to rectangular (none)
            multiplier = 1;
        }
        return val * multiplier;
    });
}

// Função de Bessel modificada de primeira ordem (para janela Kaiser)
function besselI0(x) {
    let sum = 1;
    let term = 1;
    for (let k = 1; k <= 10; k++) {
        term *= (x / (2 * k)) * (x / (2 * k));
        sum += term;
    }
    return sum;
}

function padData(data, length) {
    const padded = new Array(length).fill(0);
    for (let i = 0; i < data.length; i++) {
        padded[i] = data[i];
    }
    return padded;
}

function findPeak(magnitudes, freqs) {
    let peakMagnitude = -1;
    let peakFrequency = -1;
    // Ignora o componente DC (frequência 0) para encontrar picos significativos
    for (let i = 1; i < magnitudes.length; i++) {
        if (magnitudes[i] > peakMagnitude) {
            peakMagnitude = magnitudes[i];
            peakFrequency = freqs[i];
        }
    }
    return { magnitude: peakMagnitude, frequency: peakFrequency };
}

// --- Algoritmo FFT (Cooley-Tukey) ---
function fft(data) {
    const n = data.length;
    if (n <= 1) {
        // Converte para o formato complexo {re, im} na base da recursão
        return data.map(d => ({ re: d, im: 0 }));
    }

    // Reorganiza os dados usando a permutação bit-reversal
    const output = new Array(n);
    for (let i = 0; i < n; i++) {
        // Garantir que 'bits' seja um inteiro (Math.log2 devolve número, mas pode ser float)
        const bits = Math.floor(Math.log2(n));
        const j = reverseBits(i, bits);
        output[j] = { re: data[i], im: 0 };
    }

    // Iterações do Cooley-Tukey
    for (let size = 2; size <= n; size *= 2) {
        const halfSize = size / 2;
        const angle_step = -2 * Math.PI / size;
        for (let i = 0; i < n; i += size) {
            let angle = 0;
            for (let j = i; j < i + halfSize; j++) {
                const k = j + halfSize;

                const w_re = Math.cos(angle);
                const w_im = Math.sin(angle);

                const t_re = output[k].re * w_re - output[k].im * w_im;
                const t_im = output[k].re * w_im + output[k].im * w_re;

                output[k].re = output[j].re - t_re;
                output[k].im = output[j].im - t_im;

                output[j].re += t_re;
                output[j].im += t_im;

                angle += angle_step;
            }
        }
    }
    return output;
}

function reverseBits(x, bits) {
    let y = 0;
    for (let i = 0; i < bits; i++) {
        y = (y << 1) | (x & 1);
        x >>= 1;
    }
    return y;
}

// --- Função auxiliar para encontrar índice da frequência mais próxima ---
function findClosestFrequencyIndex(freqs, targetFreq) {
    let closestIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < freqs.length; i++) {
        const diff = Math.abs(freqs[i] - targetFreq);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    }

    return closestIndex;
}

// --- Sistema de Interpretação Diagnóstica ---
function performDiagnosticAnalysis(magnitudes, freqs, rpm, peak) {
    const rotationFreq = rpm / 60; // Frequência de rotação em Hz
    const results = {
        rotationFreq: rotationFreq,
        harmonics: [],
        bearingFrequencies: calculateBearingFrequencies(rpm),
        faultDetection: {
            unbalance: false,
            misalignment: false,
            looseness: false,
            bearingDefects: [],
            gearProblems: false,
            beltProblems: false
        },
        severityLevel: 'Normal',
        recommendations: []
    };

    // Detecta harmônicos da frequência de rotação
    for (let i = 1; i <= 10; i++) {
        const harmonicFreq = rotationFreq * i;
        const closestIndex = findClosestFrequencyIndex(freqs, harmonicFreq);
        if (closestIndex !== -1 && Math.abs(freqs[closestIndex] - harmonicFreq) < rotationFreq * 0.1) {
            results.harmonics.push({
                order: i,
                frequency: freqs[closestIndex],
                magnitude: magnitudes[closestIndex],
                theoretical: harmonicFreq
            });
        }
    }

    // Análise de desbalanceamento (1X RPM)
    const unbalanceThreshold = Math.max(...magnitudes) * 0.3;
    if (results.harmonics.length > 0 && results.harmonics[0].magnitude > unbalanceThreshold) {
        results.faultDetection.unbalance = true;
        results.recommendations.push("Verificar balanceamento do rotor");
    }

    // Análise de desalinhamento (2X, 3X RPM)
    const alignment2X = results.harmonics.find(h => h.order === 2);
    const alignment3X = results.harmonics.find(h => h.order === 3);
    if ((alignment2X && alignment2X.magnitude > unbalanceThreshold * 0.6) ||
        (alignment3X && alignment3X.magnitude > unbalanceThreshold * 0.4)) {
        results.faultDetection.misalignment = true;
        results.recommendations.push("Verificar alinhamento do equipamento");
    }

    // Análise de folgas (múltiplos harmônicos)
    if (results.harmonics.length >= 5) {
        const highHarmonics = results.harmonics.filter(h => h.order >= 3 && h.magnitude > unbalanceThreshold * 0.2);
        if (highHarmonics.length >= 3) {
            results.faultDetection.looseness = true;
            results.recommendations.push("Verificar fixações e folgas mecânicas");
        }
    }

    // Análise de defeitos em rolamentos
    results.faultDetection.bearingDefects = analyzeBasilarFrequencies(magnitudes, freqs, results.bearingFrequencies);

    // Determina severidade
    results.severityLevel = determineSeverityLevel(results);

    return results;
}

function calculateBearingFrequencies(rpm) {
    // Frequências características típicas de rolamentos (valores padrão)
    const rotationFreq = rpm / 60;
    return {
        BPFO: rotationFreq * 3.5, // Ball Pass Frequency Outer race
        BPFI: rotationFreq * 5.4, // Ball Pass Frequency Inner race
        FTF: rotationFreq * 0.4,  // Fundamental Train Frequency
        BSF: rotationFreq * 2.3   // Ball Spin Frequency
    };
}

function analyzeBasilarFrequencies(magnitudes, freqs, bearingFreqs) {
    const defects = [];
    const threshold = Math.max(...magnitudes) * 0.15;

    Object.entries(bearingFreqs).forEach(([type, freq]) => {
        const index = findClosestFrequencyIndex(freqs, freq);
        if (index !== -1 && magnitudes[index] > threshold) {
            defects.push({
                type: type,
                frequency: freq,
                magnitude: magnitudes[index],
                description: getBearingDefectDescription(type)
            });
        }
    });

    return defects;
}

function getBearingDefectDescription(type) {
    const descriptions = {
        BPFO: 'Defeito na pista externa do rolamento',
        BPFI: 'Defeito na pista interna do rolamento',
        FTF: 'Defeito na gaiola do rolamento',
        BSF: 'Defeito nos elementos rolantes'
    };
    return descriptions[type] || 'Defeito desconhecido';
}

function determineSeverityLevel(results) {
    let severityScore = 0;

    if (results.faultDetection.unbalance) severityScore += 2;
    if (results.faultDetection.misalignment) severityScore += 3;
    if (results.faultDetection.looseness) severityScore += 4;
    if (results.faultDetection.bearingDefects.length > 0) severityScore += 5;

    if (severityScore === 0) return 'Normal';
    if (severityScore <= 3) return 'Atenção';
    if (severityScore <= 7) return 'Alerta';
    return 'Crítico';
}

// --- Função para exibir interpretação diagnóstica ---
function displayDiagnosticInterpretation(diagnosticResults) {
    const interpretationOutput = document.getElementById('interpretation-output');
    if (!interpretationOutput) {
        console.error('Elemento interpretation-output não encontrado');
        return;
    }

    const severityClass = `severity-${diagnosticResults.severityLevel.toLowerCase()}`;

    let html = `
        <div class="diagnostic-summary">
            <div class="severity-indicator ${severityClass}">
                <strong>Nível de Severidade:</strong> ${diagnosticResults.severityLevel}
            </div>
            <p><strong>Frequência de Rotação:</strong> ${diagnosticResults.rotationFreq.toFixed(2)} Hz (${(diagnosticResults.rotationFreq * 60).toFixed(0)} RPM)</p>
        </div>

        <div class="fault-analysis">
            <h4>Análise de Falhas Detectadas</h4>
            <ul class="fault-list">
    `;

    if (diagnosticResults.faultDetection.unbalance) {
        html += '<li class="fault-detected">❌ <strong>Desbalanceamento:</strong> Detectado na frequência 1X RPM</li>';
    } else {
        html += '<li class="fault-ok">✅ <strong>Balanceamento:</strong> Dentro dos parâmetros normais</li>';
    }

    if (diagnosticResults.faultDetection.misalignment) {
        html += '<li class="fault-detected">❌ <strong>Desalinhamento:</strong> Detectado em harmônicos 2X/3X RPM</li>';
    } else {
        html += '<li class="fault-ok">✅ <strong>Alinhamento:</strong> Dentro dos parâmetros normais</li>';
    }

    if (diagnosticResults.faultDetection.looseness) {
        html += '<li class="fault-detected">❌ <strong>Folgas Mecânicas:</strong> Múltiplos harmônicos detectados</li>';
    } else {
        html += '<li class="fault-ok">✅ <strong>Fixações:</strong> Dentro dos parâmetros normais</li>';
    }

    if (diagnosticResults.faultDetection.bearingDefects.length > 0) {
        diagnosticResults.faultDetection.bearingDefects.forEach(defect => {
            html += `<li class="fault-detected">❌ <strong>Rolamento (${defect.type}):</strong> ${defect.description} - ${defect.frequency.toFixed(2)} Hz</li>`;
        });
    } else {
        html += '<li class="fault-ok">✅ <strong>Rolamentos:</strong> Sem defeitos característicos detectados</li>';
    }

    html += '</ul></div>';

    if (diagnosticResults.harmonics.length > 0) {
        html += `
            <div class="harmonics-analysis">
                <h4>Análise de Harmônicos</h4>
                <table class="harmonics-table">
                    <thead>
                        <tr>
                            <th>Ordem</th>
                            <th>Freq. Teórica (Hz)</th>
                            <th>Freq. Detectada (Hz)</th>
                            <th>Magnitude</th>
                            <th>Indicação</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        diagnosticResults.harmonics.forEach(harmonic => {
            const indication = getHarmonicIndication(harmonic.order, harmonic.magnitude);
            html += `
                <tr>
                    <td>${harmonic.order}X</td>
                    <td>${harmonic.theoretical.toFixed(2)}</td>
                    <td>${harmonic.frequency.toFixed(2)}</td>
                    <td>${harmonic.magnitude.toFixed(4)}</td>
                    <td>${indication}</td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';
    }

    if (diagnosticResults.recommendations.length > 0) {
        html += `
            <div class="recommendations">
                <h4>Recomendações de Manutenção</h4>
                <ul class="recommendations-list">
        `;
        diagnosticResults.recommendations.forEach(rec => {
            html += `<li>🔧 ${rec}</li>`;
        });
        html += '</ul></div>';
    }

    // Adiciona frequências características de rolamentos
    html += `
        <div class="bearing-frequencies">
            <h4>Frequências Características de Rolamentos</h4>
            <div class="bearing-freq-grid">
                <div class="bearing-freq-item">
                    <strong>BPFO:</strong> ${diagnosticResults.bearingFrequencies.BPFO.toFixed(2)} Hz
                    <small>(Pista Externa)</small>
                </div>
                <div class="bearing-freq-item">
                    <strong>BPFI:</strong> ${diagnosticResults.bearingFrequencies.BPFI.toFixed(2)} Hz
                    <small>(Pista Interna)</small>
                </div>
                <div class="bearing-freq-item">
                    <strong>FTF:</strong> ${diagnosticResults.bearingFrequencies.FTF.toFixed(2)} Hz
                    <small>(Gaiola)</small>
                </div>
                <div class="bearing-freq-item">
                    <strong>BSF:</strong> ${diagnosticResults.bearingFrequencies.BSF.toFixed(2)} Hz
                    <small>(Esferas)</small>
                </div>
            </div>
        </div>
    `;

    interpretationOutput.innerHTML = html;
}

function getHarmonicIndication(order, magnitude) {
    // Implementação simplificada
    if (order === 1) {
        if (magnitude > 0.5) return 'Desbalanceamento severo';
        if (magnitude > 0.3) return 'Desbalanceamento moderado';
        return 'Normal';
    } else if (order === 2) {
        if (magnitude > 0.4) return 'Desalinhamento severo';
        if (magnitude > 0.2) return 'Possível desalinhamento';
        return 'Normal';
    } else if (order >= 3) {
        if (magnitude > 0.2) return 'Folgas mecânicas';
        return 'Baixo';
    }
    return 'Análise indisponível';
}

// --- Função para gerar alertas inteligentes ---
function generateIntelligentAlerts(diagnosticResults, spectralStats, trendAnalysis) {
    const alerts = [];

    // Alertas baseados em severidade
    if (diagnosticResults.severityLevel === 'Crítico') {
        alerts.push({
            type: 'critical',
            message: 'ATENÇÃO: Condição crítica detectada! Parada imediata recomendada.',
            priority: 1
        });
    } else if (diagnosticResults.severityLevel === 'Alerta') {
        alerts.push({
            type: 'warning',
            message: 'Condição de alerta detectada. Programar manutenção em breve.',
            priority: 2
        });
    }

    // Alertas específicos por tipo de defeito
    if (diagnosticResults.faultDetection.unbalance) {
        alerts.push({
            type: 'maintenance',
            message: 'Desbalanceamento detectado. Verificar balanceamento do rotor.',
            priority: 3
        });
    }

    if (diagnosticResults.faultDetection.bearingDefects.length > 0) {
        alerts.push({
            type: 'maintenance',
            message: `Defeitos em rolamentos detectados: ${diagnosticResults.faultDetection.bearingDefects.map(d => d.type).join(', ')}`,
            priority: 2
        });
    }

    return alerts;
}

function displayIntelligentAlerts(alerts) {
    const alertsOutput = document.getElementById('alerts-output');
    if (!alertsOutput) {
        console.error('Elemento alerts-output não encontrado');
        return;
    }

    if (alerts.length === 0) {
        alertsOutput.innerHTML = '<div class="alert-info">✅ Nenhum alerta crítico detectado.</div>';
        return;
    }

    let html = '<h4>🚨 Alertas Inteligentes</h4>';
    alerts.forEach(alert => {
        const alertClass = `alert-${alert.type}`;
        html += `<div class="${alertClass}">${alert.message}</div>`;
    });

    alertsOutput.innerHTML = html;
}

// --- Cálculo de indicadores estatísticos avançados ---
function calculateAdvancedStatistics(magnitudes, freqs, timeData) {
    // RMS
    const rms = Math.sqrt(timeData.reduce((sum, val) => sum + val * val, 0) / timeData.length);

    // Fator de Crista
    const peak = Math.max(...timeData.map(Math.abs));
    const crestFactor = peak / rms;

    // Curtose (indicador de impactos)
    const mean = timeData.reduce((sum, val) => sum + val, 0) / timeData.length;
    const variance = timeData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / timeData.length;
    const stdDev = Math.sqrt(variance);
    const kurtosis = timeData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / timeData.length;

    // Centróide espectral
    const totalEnergy = magnitudes.reduce((sum, mag) => sum + mag, 0);
    const centroid = magnitudes.reduce((sum, mag, i) => sum + mag * freqs[i], 0) / totalEnergy;

    // Distribuição de energia por bandas
    const lowBand = magnitudes.slice(0, Math.floor(magnitudes.length * 0.33)).reduce((sum, mag) => sum + mag, 0);
    const midBand = magnitudes.slice(Math.floor(magnitudes.length * 0.33), Math.floor(magnitudes.length * 0.66)).reduce((sum, mag) => sum + mag, 0);
    const highBand = magnitudes.slice(Math.floor(magnitudes.length * 0.66)).reduce((sum, mag) => sum + mag, 0);

    const energyDistribution = {
        low: (lowBand / totalEnergy) * 100,
        mid: (midBand / totalEnergy) * 100,
        high: (highBand / totalEnergy) * 100
    };

    return {
        rms: rms,
        crestFactor: crestFactor,
        kurtosis: kurtosis,
        centroid: centroid,
        energyDistribution: energyDistribution
    };
}

function updateSpectralAnalysisDisplay(stats) {
    // Indicadores básicos
    const rmsElement = document.getElementById('rms-value');
    const crestElement = document.getElementById('crest-factor-value');
    const kurtosisElement = document.getElementById('kurtosis-value');
    const centroidElement = document.getElementById('centroid-value');

    if (rmsElement) rmsElement.textContent = stats.rms.toFixed(4);
    if (crestElement) crestElement.textContent = stats.crestFactor.toFixed(2);
    if (kurtosisElement) kurtosisElement.textContent = stats.kurtosis.toFixed(2);
    if (centroidElement) centroidElement.textContent = `${stats.centroid.toFixed(1)} Hz`;

    // Distribuição de energia
    const lowEnergyBar = document.getElementById('low-energy-bar');
    const lowEnergyText = document.getElementById('low-energy-text');
    const midEnergyBar = document.getElementById('mid-energy-bar');
    const midEnergyText = document.getElementById('mid-energy-text');
    const highEnergyBar = document.getElementById('high-energy-bar');
    const highEnergyText = document.getElementById('high-energy-text');

    if (lowEnergyBar) lowEnergyBar.style.width = `${stats.energyDistribution.low}%`;
    if (lowEnergyText) lowEnergyText.textContent = `${stats.energyDistribution.low.toFixed(1)}%`;
    if (midEnergyBar) midEnergyBar.style.width = `${stats.energyDistribution.mid}%`;
    if (midEnergyText) midEnergyText.textContent = `${stats.energyDistribution.mid.toFixed(1)}%`;
    if (highEnergyBar) highEnergyBar.style.width = `${stats.energyDistribution.high}%`;
    if (highEnergyText) highEnergyText.textContent = `${stats.energyDistribution.high.toFixed(1)}%`;
}

// --- Análise de envelope para detecção de modulação ---
function calculateEnvelopeSpectrum(timeData, sampleRate) {
    // Filtragem passa-alta para isolar componentes de alta frequência
    const filteredData = applyHighPassFilter(timeData, sampleRate, 1000); // 1kHz de corte

    // Cálculo do envelope através da transformada de Hilbert (aproximação)
    const envelope = calculateHilbertEnvelope(filteredData);

    // FFT do envelope
    const envelopeFFT = fft(padData(envelope, Math.pow(2, Math.ceil(Math.log2(envelope.length)))));
    const N = envelopeFFT.length;
    const envelopeMagnitudes = envelopeFFT.slice(0, N / 2).map(c => Math.sqrt(c.re * c.re + c.im * c.im) / (N/2));

    return envelopeMagnitudes;
}

function applyHighPassFilter(data, sampleRate, cutoffFreq) {
    // Filtro passa-alta simples (Butterworth de primeira ordem aproximado)
    const RC = 1 / (2 * Math.PI * cutoffFreq);
    const dt = 1 / sampleRate;
    const alpha = RC / (RC + dt);

    let filtered = [data[0]];
    for (let i = 1; i < data.length; i++) {
        filtered[i] = alpha * (filtered[i-1] + data[i] - data[i-1]);
    }
    return filtered;
}

function calculateHilbertEnvelope(data) {
    // Aproximação simples do envelope usando média móvel da magnitude
    const envelope = [];
    const windowSize = Math.max(3, Math.floor(data.length / 100));

    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;

        for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
            sum += Math.abs(data[j]);
            count++;
        }
        envelope[i] = sum / count;
    }
    return envelope;
}

// --- Análise de modulação para detecção de defeitos ---
function analyzeModulation(magnitudes, freqs, rpm) {
    const rotationFreq = rpm / 60;
    const modulations = [];

    // Procura por bandas laterais ao redor de harmônicos
    for (let harmonic = 1; harmonic <= 5; harmonic++) {
        const harmonicFreq = rotationFreq * harmonic;
        const harmonicIndex = findClosestFrequencyIndex(freqs, harmonicFreq);

        if (harmonicIndex !== -1) {
            // Verifica bandas laterais ±1X RPM
            const leftSideband = findClosestFrequencyIndex(freqs, harmonicFreq - rotationFreq);
            const rightSideband = findClosestFrequencyIndex(freqs, harmonicFreq + rotationFreq);

            if (leftSideband !== -1 && rightSideband !== -1) {
                const centerMag = magnitudes[harmonicIndex];
                const leftMag = magnitudes[leftSideband];
                const rightMag = magnitudes[rightSideband];

                const modulationDepth = (leftMag + rightMag) / centerMag;

                if (modulationDepth > 0.1) { // 10% de modulação
                    modulations.push({
                        harmonic: harmonic,
                        frequency: harmonicFreq,
                        modulationDepth: modulationDepth,
                        indication: getModulationIndication(modulationDepth)
                    });
                }
            }
        }
    }

    return modulations;
}

function getModulationIndication(depth) {
    if (depth > 0.5) return 'Modulação severa - Verificar desalinhamento ou folgas';
    if (depth > 0.3) return 'Modulação moderada - Monitorar condição';
    if (depth > 0.1) return 'Modulação leve - Condição aceitável';
    return 'Normal';
}

// --- Análise de fase entre componentes ---
function calculatePhaseAnalysis(fftResult, freqs, rpm) {
    const rotationFreq = rpm / 60;
    const phaseAnalysis = [];

    // Calcula fase dos harmônicos principais
    for (let harmonic = 1; harmonic <= 3; harmonic++) {
        const harmonicFreq = rotationFreq * harmonic;
        const index = findClosestFrequencyIndex(freqs, harmonicFreq);

        if (index !== -1) {
            const phase = Math.atan2(fftResult[index].im, fftResult[index].re) * 180 / Math.PI;
            phaseAnalysis.push({
                harmonic: harmonic,
                frequency: harmonicFreq,
                phase: phase,
                magnitude: Math.sqrt(fftResult[index].re * fftResult[index].re + fftResult[index].im * fftResult[index].im)
            });
        }
    }

    return phaseAnalysis;
}

// --- Análise de tendências ---
function analyzeTrendWithBaseline(currentData, baselineData) {
    const comparison = {
        timestamp: new Date(),
        peakFreqChange: currentData.peak.frequency - baselineData.peak.frequency,
        peakMagChange: ((currentData.peak.magnitude - baselineData.peak.magnitude) / baselineData.peak.magnitude) * 100,
        rmsChange: ((currentData.statistics.rms - baselineData.statistics.rms) / baselineData.statistics.rms) * 100,
        crestFactorChange: currentData.statistics.crestFactor - baselineData.statistics.crestFactor,
        trend: 'Estável'
    };

    // Determina tendência geral
    if (Math.abs(comparison.peakMagChange) > 20 || Math.abs(comparison.rmsChange) > 20) {
        comparison.trend = comparison.peakMagChange > 0 ? 'Deterioração' : 'Melhoria';
    }

    return comparison;
}

function updateTrendingDisplay(trendAnalysis) {
    const trendingOutput = document.getElementById('trending-output');
    if (!trendingOutput) return;

    let html = `
        <div class="trend-summary">
            <h5>Análise de Tendências</h5>
            <p><strong>Tendência Geral:</strong> ${trendAnalysis.trend}</p>
            <p><strong>Mudança no Pico:</strong> ${trendAnalysis.peakMagChange.toFixed(1)}%</p>
            <p><strong>Mudança no RMS:</strong> ${trendAnalysis.rmsChange.toFixed(1)}%</p>
        </div>
    `;

    trendingOutput.innerHTML = html;
}

// --- Inicialização de controles ---
function initializeTabControls() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0) {
        console.warn('Botões de aba não encontrados');
        return;
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');

            if (!targetTab) {
                console.error('Atributo data-tab não encontrado no botão');
                return;
            }

            // Remove active de todas as abas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Ativa a aba selecionada
            button.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-analysis`);
            if (targetContent) {
                targetContent.classList.add('active');
            } else {
                console.error(`Elemento ${targetTab}-analysis não encontrado`);
            }
        });
    });
}

function initializeZoomControls() {
    const zoomButtons = [
        { id: 'zoom-peak-btn', action: zoomToPeak },
        { id: 'zoom-harmonics-btn', action: zoomToHarmonics },
        { id: 'zoom-bearing-btn', action: zoomToBearing },
        { id: 'reset-zoom-btn', action: resetZoom }
    ];

    zoomButtons.forEach(({ id, action }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                action();
            });
        }
    });
}

function zoomToPeak() {
    if (fftChart && currentSpectralData) {
        const peak = currentSpectralData.peak;
        const margin = peak.frequency * 0.1;
        fftChart.options.scales.x.min = Math.max(0, peak.frequency - margin);
        fftChart.options.scales.x.max = peak.frequency + margin;
        fftChart.update();
    }
}

function zoomToHarmonics() {
    if (fftChart && currentSpectralData) {
        const rotationFreq = currentSpectralData.diagnostics.rotationFreq;
        fftChart.options.scales.x.min = 0;
        fftChart.options.scales.x.max = rotationFreq * 10;
        fftChart.update();
    }
}

function zoomToBearing() {
    if (fftChart && currentSpectralData) {
        const bearingFreqs = currentSpectralData.diagnostics.bearingFrequencies;
        const maxBearingFreq = Math.max(...Object.values(bearingFreqs));
        fftChart.options.scales.x.min = 0;
        fftChart.options.scales.x.max = maxBearingFreq * 1.5;
        fftChart.update();
    }
}

function resetZoom() {
    if (fftChart) {
        delete fftChart.options.scales.x.min;
        delete fftChart.options.scales.x.max;
        fftChart.update();
    }
}

function initializeExportControls() {
    const exportButtons = [
        { id: 'download-report-btn', action: downloadReport },
        { id: 'export-data-btn', action: exportData },
        { id: 'save-baseline-btn', action: saveBaseline },
        { id: 'compare-baseline-btn', action: compareBaseline },
        { id: 'export-results-btn', action: exportResults }
    ];

    exportButtons.forEach(({ id, action }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                action();
            });
        }
    });
}

function downloadReport() {
    if (currentSpectralData) {
        generateAndDownloadReport(currentSpectralData);
    } else {
        alert('Calcule uma FFT primeiro para gerar o relatório.');
    }
}

function exportData() {
    if (currentSpectralData) {
        exportResults(currentSpectralData);
    } else {
        alert('Nenhum resultado para exportar. Calcule uma FFT primeiro.');
    }
}

function saveBaseline() {
    if (currentSpectralData) {
        baselineData = JSON.parse(JSON.stringify(currentSpectralData));
        baselineData.timestamp = new Date();

        localStorage.setItem('fftCalculatorBaseline', JSON.stringify(baselineData));
        alert('Baseline salvo com sucesso! Data: ' + baselineData.timestamp.toLocaleString('pt-BR'));
        updateBaselineComparison();
    } else {
        alert('Calcule uma FFT primeiro antes de salvar como baseline.');
    }
}

function compareBaseline() {
    const savedBaseline = localStorage.getItem('fftCalculatorBaseline');
    if (savedBaseline && currentSpectralData) {
        baselineData = JSON.parse(savedBaseline);
        const comparison = analyzeTrendWithBaseline(currentSpectralData, baselineData);
        displayBaselineComparison(comparison);
    } else if (!savedBaseline) {
        alert('Nenhum baseline salvo encontrado.');
    } else {
        alert('Calcule uma FFT primeiro antes de comparar.');
    }
}

function exportResults(data) {
    const exportData = {
        timestamp: data.timestamp,
        peak: data.peak,
        statistics: data.statistics,
        diagnostics: data.diagnostics,
        frequencies: data.frequencies,
        magnitudes: data.magnitudes
    };

    // Cria arquivo CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Frequencia (Hz),Magnitude,Ordem\n";

    data.frequencies.forEach((freq, index) => {
        const order = freq / (data.diagnostics.rotationFreq || 1);
        csvContent += `${freq.toFixed(4)},${data.magnitudes[index].toFixed(6)},${order.toFixed(2)}\n`;
    });

    // Download do arquivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analise_vibracional_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateAndDownloadReport(data) {
    const reportContent = `
RELATÓRIO DE ANÁLISE VIBRACIONAL
Data: ${new Date().toLocaleString('pt-BR')}

RESUMO EXECUTIVO:
- Nível de Severidade: ${data.diagnostics.severityLevel}
- Frequência de Rotação: ${data.diagnostics.rotationFreq.toFixed(2)} Hz
- Frequência de Pico: ${data.peak.frequency.toFixed(2)} Hz
- Magnitude de Pico: ${data.peak.magnitude.toFixed(4)}

ESTATÍSTICAS:
- RMS: ${data.statistics.rms.toFixed(4)}
- Fator de Crista: ${data.statistics.crestFactor.toFixed(2)}
- Curtose: ${data.statistics.kurtosis.toFixed(2)}

DEFEITOS DETECTADOS:
${data.diagnostics.faultDetection.unbalance ? '- Desbalanceamento' : ''}
${data.diagnostics.faultDetection.misalignment ? '- Desalinhamento' : ''}
${data.diagnostics.faultDetection.looseness ? '- Folgas mecânicas' : ''}

RECOMENDAÇÕES:
${data.diagnostics.recommendations.map(r => `- ${r}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_diagnostico_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function updateBaselineComparison() {
    const comparisonDiv = document.getElementById('comparison-details');
    if (comparisonDiv && baselineData) {
        comparisonDiv.innerHTML = `
            <div class="baseline-info">
                <p><strong>✅ Baseline salvo:</strong> ${baselineData.timestamp ? new Date(baselineData.timestamp).toLocaleString('pt-BR') : 'Data não disponível'}</p>
                <p>Use o botão "Comparar com Baseline" para analisar mudanças.</p>
            </div>
        `;
    }
}

function displayBaselineComparison(comparison) {
    const comparisonDiv = document.getElementById('comparison-details');
    if (!comparisonDiv) return;

    let html = `
        <h5>Comparação com Baseline</h5>
        <p><strong>Data do Baseline:</strong> ${new Date(baselineData.timestamp).toLocaleString('pt-BR')}</p>
        <p><strong>Data Atual:</strong> ${comparison.timestamp.toLocaleString('pt-BR')}</p>

        <div class="comparison-summary">
            <div class="comparison-item ${comparison.peakMagChange > 20 ? 'change-negative' : comparison.peakMagChange < -20 ? 'change-positive' : 'change-neutral'}">
                <strong>Magnitude do Pico:</strong> ${comparison.peakMagChange.toFixed(1)}%
            </div>
            <div class="comparison-item ${comparison.rmsChange > 20 ? 'change-negative' : comparison.rmsChange < -20 ? 'change-positive' : 'change-neutral'}">
                <strong>RMS:</strong> ${comparison.rmsChange.toFixed(1)}%
            </div>
            <div class="comparison-item">
                <strong>Tendência:</strong> ${comparison.trend}
            </div>
        </div>
    `;

    comparisonDiv.innerHTML = html;
}

function displayResults(magnitudes, freqs, peak, diagnosticResults, spectralStats, trendAnalysis) {
    // Exibe resultados básicos
    const fftOutput = document.getElementById('fft-output');
    if (fftOutput) {
        fftOutput.textContent = `Frequência de Pico: ${peak.frequency.toFixed(4)} Hz\nMagnitude de Pico: ${peak.magnitude.toFixed(4)}\n\nDados da FFT (Magnitude):\n` + magnitudes.slice(0, 20).map((m, i) => `Freq: ${freqs[i].toFixed(2)} Hz, Mag: ${m.toFixed(4)}`).join('\n') + '\n...';
    }

    const peakFrequencyResult = document.getElementById('peak-frequency-result');
    if (peakFrequencyResult) {
        peakFrequencyResult.innerHTML = `<strong>Frequência de Pico:</strong> ${peak.frequency.toFixed(4)} Hz com magnitude de ${peak.magnitude.toFixed(4)}`;
    }

    // Atualiza indicador de condição geral
    const conditionIndicator = document.getElementById('overall-condition');
    if (conditionIndicator) {
        const severityClass = `severity-${diagnosticResults.severityLevel.toLowerCase()}`;
        conditionIndicator.className = `condition-indicator ${severityClass}`;
        conditionIndicator.textContent = diagnosticResults.severityLevel;
    }

    // --- Exibe interpretação diagnóstica ---
    displayDiagnosticInterpretation(diagnosticResults);

    // --- Atualiza análises estatísticas ---
    updateSpectralAnalysisDisplay(spectralStats);

    // --- Gera alertas inteligentes ---
    const intelligentAlerts = generateIntelligentAlerts(diagnosticResults, spectralStats, trendAnalysis);
    displayIntelligentAlerts(intelligentAlerts);

    // --- Atualiza o gráfico ---
    updateChart(freqs, magnitudes, diagnosticResults.harmonics);

    // --- Atualiza visualização 3D se ativada ---
    if (typeof updateSpectral3D === 'function') {
        updateSpectral3D(freqs, magnitudes);
    }

    // --- Atualiza análise de tendências se disponível ---
    if (trendAnalysis) {
        updateTrendingDisplay(trendAnalysis);
    }
}

// Event listeners carregados após o DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - inicializando calculadora');

    // Aguarda um pouco para garantir que o Chart.js carregou
    setTimeout(() => {
        initializeCalculator();
    }, 100);
});