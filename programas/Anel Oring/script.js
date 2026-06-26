document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO TEMA (CLARO/ESCURO) ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const body = document.body;

    /**
     * Aplica o tema (claro ou escuro) ao corpo do documento.
     * @param {string} theme - O tema a ser aplicado ('dark' ou 'light').
     */
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    };

    // Adiciona um evento para alternar o tema quando o botão é clicado
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    
    // Define 'light' como padrão se nenhum tema estiver guardado no localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


    // --- LÓGICA DE CÁLCULO DO ANEL O-RING ---
    const calculateBtn = document.getElementById('calcular');

    calculateBtn.addEventListener('click', () => {
        const tipoAlojamento = document.getElementById('tipoAlojamento').value;
        const diametro = document.getElementById('diametro').value;
        const resultadoDiv = document.getElementById('resultado');

        if (!diametro) {
            resultadoDiv.innerHTML = `
                <div class="result-placeholder">
                    <i class="fas fa-exclamation-triangle" style="color: var(--error-color);"></i>
                    <p>${i18n.t('oring.error_select')}</p>
                </div>
            `;
            return;
        }

        const tabelaValores = {
            estatico: {
                "1.78": { W: "1.78 ±0.08", L: "1.25 a 1.35", E: "0.05 a 0.13", G: 2.50, R2: "0.1 a 0.4", parbank: "3,6 (G+44%)" },
                "2.62": { W: "2.62 ±0.08", L: "2.05 a 2.15", E: "0.05 a 0.13", G: 3.70, R2: "0.1 a 0.4", parbank: "4,403 (G+19%)" },
                "3.53": { W: "3.53 ±0.13", L: "2.80 a 2.95", E: "0.08 a 0.16", G: 4.90, R2: "0.2 a 0.6", parbank: "5,39 (G+10%)" },
                "5.33": { W: "5.33 ±0.13", L: "4.30 a 4.50", E: "0.08 a 0.18", G: 7.30, R2: "0.5 a 1.0", parbank: "8,03 (G+10%)" },
                "6.99": { W: "6.99 ±0.15", L: "5.75 a 5.95", E: "0.10 a 0.20", G: 9.70, R2: "0.5 a 1.0", parbank: "10,573 (G+8%)" }
            },
            dinamico: {
                "1.78": { W: "1.78 ±0.08", L: "1.40 a 1.45", E: "0.05 a 0.13", G: 2.50, R2: "0.1 a 0.4", parbank: "3,6 (G+44%)" },
                "2.62": { W: "2.62 ±0.08", L: "2.25 a 2.30", E: "0.05 a 0.13", G: 3.70, R2: "0.1 a 0.4", parbank: "4,403 (G+19%)" },
                "3.53": { W: "3.53 ±0.13", L: "3.05 a 3.10", E: "0.08 a 0.16", G: 4.90, R2: "0.2 a 0.6", parbank: "5,39 (G+10%)" },
                "5.33": { W: "5.33 ±0.13", L: "4.65 a 4.75", E: "0.08 a 0.18", G: 7.30, R2: "0.5 a 1.0", parbank: "8,03 (G+10%)" },
                "6.99": { W: "6.99 ±0.15", L: "6.00 a 6.10", E: "0.10 a 0.20", G: 9.70, R2: "0.5 a 1.0", parbank: "10,573 (G+8%)" }
            }
        };

        const encostoDinamicoValores = {
            "1.78": { medida: "0.36", percentual: "20%" }, "2.62": { medida: "0.39", percentual: "15%" },
            "3.53": { medida: "0.46", percentual: "13%" }, "5.33": { medida: "0.64", percentual: "12%" },
            "6.99": { medida: "0.91", percentual: "13%" }
        };
        const encostoEstaticoValores = {
            "1.78": { medida: "0.46", percentual: "26%" }, "2.62": { medida: "0.52", percentual: "20%" },
            "3.53": { medida: "0.64", percentual: "18%" }, "5.33": { medida: "0.96", percentual: "18%" },
            "6.99": { medida: "1.19", percentual: "17%" }
        };

        function parseRange(rangeStr) {
            const [minVal, maxVal] = rangeStr.split('a').map(s => parseFloat(s.trim()));
            return [minVal, maxVal];
        }

        const dados = tabelaValores[tipoAlojamento][diametro];
        const [eMin, eMax] = parseRange(dados.E);
        const gpMin = (eMin / 2).toFixed(2);
        const gpMax = (eMax / 2).toFixed(2);
        const gpStr = `${gpMin} a ${gpMax}`;

        const encostoValores = tipoAlojamento === 'dinamico' ? encostoDinamicoValores[diametro] : encostoEstaticoValores[diametro];

        const tipoLabel = i18n.t(tipoAlojamento === 'estatico' ? 'oring.static' : 'oring.dynamic');
        const resultadoHTML = `
            <div class="result-header">
                <h3>${i18n.t('oring.result_header')} W = ${diametro} mm (${tipoLabel})</h3>
            </div>
            <div class="result-body" style="display: block;">
                <div class="result-images">
                    <div class="result-image">
                        <img src="images/Aplicativo_calculo_canal_anel_oring_fabricadoprojeto.png" alt="${i18n.t('oring.housing_diagram')}">
                    </div>
                    <div class="result-image">
                        <img src="images/Aplicativo_calculo_canal_anel_oring_fabricadoprojeto-2.png" alt="${i18n.t('oring.housing_view')}">
                    </div>
                </div>
                <div class="result-table-wrapper">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 12px; border: 1px solid var(--border-color); background: var(--primary-color); color: white; font-weight: 600; text-align: left;">${i18n.t('oring.table_param')}</th>
                                <th style="padding: 12px; border: 1px solid var(--border-color); background: var(--primary-color); color: white; font-weight: 600; text-align: left;">${i18n.t('oring.table_value')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>W</span> ${i18n.t('oring.w_section')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${dados.W} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>L</span> ${i18n.t('oring.l_depth')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${dados.L} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>G</span> ${i18n.t('oring.g_width')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${dados.G} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>E</span> ${i18n.t('oring.e_clearance')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${dados.E} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>GP</span> ${i18n.t('oring.gp_radial')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${gpStr} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>R1</span> ${i18n.t('oring.r1_corner')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">±0.15 mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>R2</span> ${i18n.t('oring.r2_housing')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${dados.R2} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>X</span> ${i18n.t('oring.x_finish')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">0.8 µm Ra</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);"><span>Y</span> ${i18n.t('oring.y_finish')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">1.6 µm Ra</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);">${i18n.t('oring.avg_groove')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${encostoValores.medida} mm</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);">${i18n.t('oring.avg_groove_pct')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${encostoValores.percentual}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid var(--border-color);">${i18n.t('oring.backup_ring')}</td><td class="value" style="padding: 8px; border: 1px solid var(--border-color); font-weight: 600;">${dados.parbank}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        resultadoDiv.innerHTML = resultadoHTML;
    });
});