document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const directSearchInput = document.getElementById('bearing-spec');
    const directSearchBtn = document.getElementById('direct-search-btn');
    const boreSearchInput = document.getElementById('bore-diameter-search');
    const outerSearchInput = document.getElementById('outer-diameter-search');
    const widthSearchInput = document.getElementById('width-search');
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const isoInput = document.getElementById('iso-spec-input');
    const isoCalculateBtn = document.getElementById('iso-calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDisplay = document.getElementById('result-display');
    const copyBtn = document.getElementById('copy-btn');
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const historyList = document.getElementById('history-list');
    // --- 2. ESTADO DA APLICAÇÃO ---
    let rolamentosDB = [];
    let searchHistory = JSON.parse(localStorage.getItem('bearingSearchHistory')) || [];
    let currentBearingData = null;

    // --- TRADUTOR AUTOMÁTICO DE TIPOS DE ROLAMENTO ---
    function translateType(tipo) {
        if (!tipo) return i18n.t('calc.type_unspecified');
        const lang = (typeof i18n !== 'undefined' && i18n.current) ? i18n.current : 'pt';
        if (lang === 'pt') return tipo;

        const map = {
            en: {
                "Rígido de Esferas": "Deep Groove Ball Bearing",
                "Rígido de Esferas (Blindado ZZ)": "Deep Groove Ball Bearing (Shielded ZZ)",
                "Rígido de Esferas (Vedado 2RS)": "Deep Groove Ball Bearing (Sealed 2RS)",
                "Rígido de Esferas (Série Extra Estreita)": "Deep Groove Ball Bearing (Extra Narrow Series)",
                "Rígido de Esferas (Série Estreita)": "Deep Groove Ball Bearing (Narrow Series)",
                "Rígido de Esferas (Série Extrafina)": "Deep Groove Ball Bearing (Extra Thin Series)",
                "Rolos Cilíndricos": "Cylindrical Roller Bearing",
                "Rolo Cilíndrico": "Cylindrical Roller Bearing",
                "Rolo Cilíndrico (NJ)": "Cylindrical Roller Bearing (NJ)",
                "Rolo Cilíndrico (NUP)": "Cylindrical Roller Bearing (NUP)",
                "Autocompensador de Rolos": "Spherical Roller Bearing",
                "Autocompensador de Rolos (Furo Cônico)": "Spherical Roller Bearing (Tapered Bore)",
                "Autocompensador de Rolos (Série Pesada)": "Spherical Roller Bearing (Heavy Series)",
                "Autocompensador de Esferas": "Self-Aligning Ball Bearing",
                "Contato Angular de Esferas": "Angular Contact Ball Bearing",
                "Contato Angular de Duas Carreiras": "Double Row Angular Contact Bearing",
                "Axial Autocompensador de Rolos": "Spherical Roller Thrust Bearing",
                "Rolo Cônico": "Tapered Roller Bearing",
                "Rolo Cônico (Polegada)": "Tapered Roller Bearing (Inch)",
                "Rolo Cônico de Duas Carreiras": "Double Row Tapered Roller Bearing",
                "Axial de Esferas": "Thrust Ball Bearing",
                "Agulha de Copo Extruído": "Drawn Cup Needle Roller Bearing",
                "Agulha com Anel Interno": "Needle Roller Bearing with Inner Ring",
                "Quatro Pontos de Contato": "Four-Point Contact Bearing",
                "Rolamento de Inserção (Y)": "Insert Bearing (Y-bearing)",
                "Mancal com Rolamento (Pillow Block)": "Pillow Block Bearing",
                "Mancal com Flange Quadrada (4 furos)": "Square Flange Unit (4-bolt)",
                "Rolamento Linear": "Linear Bearing"
            },
            es: {
                "Rígido de Esferas": "Rodamiento Rígido de Bolas",
                "Rígido de Esferas (Blindado ZZ)": "Rodamiento Rígido de Bolas (Blindado ZZ)",
                "Rígido de Esferas (Vedado 2RS)": "Rodamiento Rígido de Bolas (Sellado 2RS)",
                "Rígido de Esferas (Série Extra Estreita)": "Rodamiento Rígido de Bolas (Serie Extra Estrecha)",
                "Rígido de Esferas (Série Estreita)": "Rodamiento Rígido de Bolas (Serie Estrecha)",
                "Rígido de Esferas (Série Extrafina)": "Rodamiento Rígido de Bolas (Serie Extrafina)",
                "Rolos Cilíndricos": "Rodamiento de Rodillos Cilíndricos",
                "Rolo Cilíndrico": "Rodamiento de Rodillos Cilíndricos",
                "Rolo Cilíndrico (NJ)": "Rodamiento de Rodillos Cilíndricos (NJ)",
                "Rolo Cilíndrico (NUP)": "Rodamiento de Rodillos Cilíndricos (NUP)",
                "Autocompensador de Rolos": "Rodamiento de Rodillos a Rótula",
                "Autocompensador de Rolos (Furo Cônico)": "Rodamiento de Rodillos a Rótula (Agujero Cónico)",
                "Autocompensador de Rolos (Série Pesada)": "Rodamiento de Rodillos a Rótula (Serie Pesada)",
                "Autocompensador de Esferas": "Rodamiento de Bolas a Rótula",
                "Contato Angular de Esferas": "Rodamiento de Bolas de Contacto Angular",
                "Contato Angular de Duas Carreiras": "Rodamiento de Bolas de Contacto Angular de Dos Hileras",
                "Axial Autocompensador de Rolos": "Rodamiento Axial de Rodillos a Rótula",
                "Rolo Cônico": "Rodamiento de Rodillos Cónicos",
                "Rolo Cônico (Polegada)": "Rodamiento de Rodillos Cónicos (Pulgadas)",
                "Rolo Cônico de Duas Carreiras": "Rodamiento de Rodillos Cónicos de Dos Hileras",
                "Axial de Esferas": "Rodamiento Axial de Bolas",
                "Agulha de Copo Extruído": "Rodamiento de Agujas de Copa Estirada",
                "Agulha com Anel Interno": "Rodamiento de Agujas con Anillo Interior",
                "Quatro Pontos de Contato": "Rodamiento de Cuatro Puntos de Contacto",
                "Rolamento de Inserção (Y)": "Rodamiento de Inserción (Soporte Y)",
                "Mancal com Rolamento (Pillow Block)": "Soporte de Rodamiento (Pillow Block)",
                "Mancal com Flange Quadrada (4 furos)": "Soporte de Brida Cuadrada (4 agujeros)",
                "Rolamento Linear": "Rodamiento Lineal"
            }
        };

        return map[lang]?.[tipo] || tipo;
    }

    // --- 3. INICIALIZAÇÃO ---
    function init() {
        loadTheme();
        renderHistory();
        loadData(); 
        setupEventListeners();
    }

    // --- 4. FUNÇÕES DE DADOS (ATUALIZADA) ---
    function loadData() {
        try {
            showLoading(i18n.t('msg.loading_db'));
            if (typeof rolamentosDB_data !== 'undefined' && rolamentosDB_data.length > 0) {
                rolamentosDB = rolamentosDB_data;
                showPlaceholder(i18n.t('msg.db_success').replace('{count}', rolamentosDB.length));
            } else {
                showError(i18n.t('msg.critical_error_title'), i18n.t('msg.critical_error_desc'));
            }
        } catch (error) {
            showError(i18n.t('msg.unexpected_error_title'), i18n.t('msg.unexpected_error_desc'));
        }
    }

    // --- 5. FUNÇÕES DE LÓGICA PRINCIPAL ---
    function handleDirectSearch() {
        const spec = directSearchInput.value.trim().toUpperCase();
        if (!spec) {
            showWarning(i18n.t('msg.empty_entry'), i18n.t('msg.please_type_designation'));
            return;
        }
        showLoading(i18n.t('msg.searching_for').replace('{spec}', spec));
        const results = rolamentosDB.filter(b => b.designacao.toUpperCase().startsWith(spec));
        if (results.length === 1) {
            displayBearingDetails(results[0]);
            addToHistory(results[0].designacao);
        } else if (results.length > 1) {
            displaySearchResults(results);
            addToHistory(spec);
        } else {
            showWarning(i18n.t('msg.none_found').replace('{spec}', spec), i18n.t('msg.try_measures'));
        }
    }

    function handleAdvancedSearch() {
        const d = parseFloat(boreSearchInput.value) || null;
        const D = parseFloat(outerSearchInput.value) || null;
        const B = parseFloat(widthSearchInput.value) || null;
        if (!d && !D && !B) {
            showWarning(i18n.t('msg.empty_filters'), i18n.t('msg.fill_one_field'));
            return;
        }
        showLoading(i18n.t('msg.filtering'));
        const results = rolamentosDB.filter(b => {
            const match_d = !d || b.d === d;
            const match_D = !D || b.D === D;
            const match_B = !B || (b.B || b.T) === B;
            return match_d && match_D && match_B;
        });
        if (results.length > 0) {
            displaySearchResults(results);
        } else {
            showWarning(i18n.t('msg.no_results'), i18n.t('msg.no_results_criteria'));
        }
    }

    function handleISOCalculation() {
        const spec = isoInput.value.trim();
        if (!spec || spec.length < 2) {
            showWarning(i18n.t('msg.invalid_entry'), i18n.t('msg.min_2_chars'));
            return;
        }
        try {
            const codeStr = spec.slice(-2);
            const codeInt = parseInt(codeStr, 10);
            if (isNaN(codeInt)) throw new Error("NaN"); 
            let result;
            if (codeInt === 0) result = "10 mm";
            else if (codeInt === 1) result = "12 mm";
            else if (codeInt === 2) result = "15 mm";
            else if (codeInt === 3) result = "17 mm";
            else if (codeInt >= 4 && codeInt <= 96) result = `${codeInt * 5} mm`;
            else {
                showWarning(i18n.t('msg.iso_code_out').replace('{code}', codeStr), i18n.t('msg.iso_code_range'));
                return;
            }
            displayInfo(i18n.t('msg.iso_bore_for').replace('{spec}', spec), result);
        } catch (e) {
            showError(i18n.t('msg.calc_error').replace('{error}', 'Código não numérico'));
        }
    }

    // --- SVG ILLUSTRATION BY BEARING TYPE ---
    function getSvgForBearing(tipo) {
        const t = tipo ? tipo.toLowerCase() : '';
        const isDark = document.body.classList.contains('dark-theme');
        const bg = isDark ? '#1a2a3a' : '#f8f9fa';
        const stroke = isDark ? '#e9ecef' : '#495057';
        const accent = isDark ? '#60a5fa' : '#2563eb';
        const fill1 = isDark ? '#2d4a6a' : '#d0d7e0';
        const fill2 = isDark ? '#4a6a8a' : '#b0c0d0';
        const ballFill = isDark ? '#e9ecef' : '#fff';

        function svgBase(inner) {
            return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;"><style>.svg-bg{fill:${bg}} .svg-str{stroke:${stroke};stroke-width:1.5;fill:none} .svg-accent{fill:${accent}} .svg-fill1{fill:${fill1}} .svg-fill2{fill:${fill2}} .svg-ball{fill:${ballFill};stroke:${stroke};stroke-width:1}</style>${inner}</svg>`;
        }

        // --- Deep Groove Ball Bearing (Rígido de Esferas) ---
        if (t.includes('rígido') || t.includes('esferas') && !t.includes('autocompensador') && !t.includes('contato') && !t.includes('axial')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <!-- Outer ring -->
                <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
                <!-- Inner ring -->
                <rect x="70" y="55" width="60" height="40" rx="3" class="svg-fill2 svg-str"/>
                <!-- Bore -->
                <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Balls -->
                <circle cx="55" cy="75" r="7" class="svg-ball"/>
                <circle cx="75" cy="75" r="7" class="svg-ball"/>
                <circle cx="100" cy="75" r="7" class="svg-ball"/>
                <circle cx="125" cy="75" r="7" class="svg-ball"/>
                <circle cx="145" cy="75" r="7" class="svg-ball"/>
                <!-- Dimension lines -->
                <line x1="80" y1="60" x2="80" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="60" x2="120" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="38" x2="120" y2="38" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="36" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
                <line x1="40" y1="120" x2="40" y2="130" stroke="${stroke}" stroke-width="1"/>
                <line x1="160" y1="120" x2="160" y2="130" stroke="${stroke}" stroke-width="1"/>
                <line x1="40" y1="130" x2="160" y2="130" stroke="${stroke}" stroke-width="1"/>
                <text x="100" y="142" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">D</text>
            `);
        }

        // --- Cylindrical Roller (Rolo Cilíndrico) ---
        if (t.includes('rolo cilíndrico') || t.includes('rolos cilíndricos')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
                <rect x="70" y="55" width="60" height="40" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Rollers -->
                <rect x="52" y="60" width="8" height="30" rx="1" class="svg-ball"/>
                <rect x="70" y="60" width="8" height="30" rx="1" class="svg-ball"/>
                <rect x="88" y="60" width="8" height="30" rx="1" class="svg-ball"/>
                <rect x="106" y="60" width="8" height="30" rx="1" class="svg-ball"/>
                <rect x="124" y="60" width="8" height="30" rx="1" class="svg-ball"/>
                <rect x="142" y="60" width="8" height="30" rx="1" class="svg-ball"/>
                <line x1="80" y1="60" x2="80" y2="42" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="60" x2="120" y2="42" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="40" x2="120" y2="40" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="38" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
                <line x1="40" y1="120" x2="40" y2="130" stroke="${stroke}" stroke-width="1"/>
                <line x1="160" y1="120" x2="160" y2="130" stroke="${stroke}" stroke-width="1"/>
                <line x1="40" y1="130" x2="160" y2="130" stroke="${stroke}" stroke-width="1"/>
                <text x="100" y="142" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">D</text>
            `);
        }

        // --- Angular Contact Ball (Contato Angular) ---
        if (t.includes('contato angular')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <path d="M40,30 L160,30 L160,120 L40,120 Z" class="svg-fill1 svg-str"/>
                <rect x="70" y="50" width="60" height="50" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="50" width="40" height="50" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Angled raceways -->
                <path d="M48,42 Q55,60 52,75" stroke="${stroke}" stroke-width="1.5" fill="none"/>
                <path d="M152,42 Q145,60 148,75" stroke="${stroke}" stroke-width="1.5" fill="none"/>
                <!-- Balls with angle -->
                <circle cx="55" cy="65" r="6" class="svg-ball"/>
                <circle cx="75" cy="70" r="6" class="svg-ball"/>
                <circle cx="100" cy="75" r="6" class="svg-ball"/>
                <circle cx="125" cy="70" r="6" class="svg-ball"/>
                <circle cx="145" cy="65" r="6" class="svg-ball"/>
                <!-- Angle indicator -->
                <line x1="100" y1="75" x2="115" y2="50" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <text x="118" y="48" class="svg-accent" style="font-size:6px;font-weight:600">α</text>
                <line x1="80" y1="55" x2="80" y2="38" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="55" x2="120" y2="38" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="36" x2="120" y2="36" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="34" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Tapered Roller (Rolo Cônico) ---
        if (t.includes('rolo cônico') || t.includes('cónico')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <!-- Cup (outer ring) -->
                <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
                <!-- Cone (inner ring) -->
                <path d="M75,50 L125,50 L115,100 L85,100 Z" class="svg-fill2 svg-str"/>
                <!-- Bore -->
                <rect x="82" y="55" width="36" height="45" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Tapered rollers -->
                <polygon points="52,45 58,45 63,100 57,100" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <polygon points="70,48 76,48 80,100 74,100" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <polygon points="88,50 94,50 97,100 91,100" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <polygon points="106,50 112,50 115,100 109,100" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <polygon points="124,48 130,48 134,100 128,100" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <polygon points="142,45 148,45 143,100 137,100" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <line x1="82" y1="60" x2="82" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="118" y1="60" x2="118" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="82" y1="38" x2="118" y2="38" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="36" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Self-Aligning Ball (Autocompensador de Esferas) ---
        if (t.includes('autocompensador de esferas')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <!-- Spherical outer ring -->
                <path d="M40,40 Q100,20 160,40 L160,110 Q100,130 40,110 Z" class="svg-fill1 svg-str"/>
                <rect x="72" y="55" width="56" height="40" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Double row balls -->
                <circle cx="55" cy="62" r="5" class="svg-ball"/>
                <circle cx="70" cy="68" r="5" class="svg-ball"/>
                <circle cx="85" cy="72" r="5" class="svg-ball"/>
                <circle cx="100" cy="75" r="5" class="svg-ball"/>
                <circle cx="115" cy="72" r="5" class="svg-ball"/>
                <circle cx="130" cy="68" r="5" class="svg-ball"/>
                <circle cx="145" cy="62" r="5" class="svg-ball"/>
                <line x1="80" y1="58" x2="80" y2="38" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="58" x2="120" y2="38" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="36" x2="120" y2="36" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="34" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Spherical Roller (Autocompensador de Rolos) ---
        if (t.includes('autocompensador de rolos') || t.includes('axial autocompensador')) {
            if (t.includes('axial')) {
                return svgBase(`
                    <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                    <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.vista_esquematica')}</text>
                    <!-- Housing washer -->
                    <rect x="30" y="30" width="140" height="25" rx="4" class="svg-fill1 svg-str"/>
                    <!-- Shaft washer -->
                    <rect x="60" y="95" width="80" height="20" rx="4" class="svg-fill2 svg-str"/>
                    <!-- Barrel rollers arranged radially -->
                    <ellipse cx="55" cy="60" rx="10" ry="18" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                    <ellipse cx="80" cy="65" rx="10" ry="18" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                    <ellipse cx="100" cy="68" rx="10" ry="18" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                    <ellipse cx="120" cy="65" rx="10" ry="18" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                    <ellipse cx="145" cy="60" rx="10" ry="18" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                    <!-- Shaft -->
                    <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                    <line x1="80" y1="55" x2="80" y2="28" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                    <line x1="120" y1="55" x2="120" y2="28" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                    <line x1="80" y1="26" x2="120" y2="26" stroke="${accent}" stroke-width="1"/>
                    <text x="100" y="24" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
                `);
            }
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <!-- Spherical outer ring -->
                <path d="M40,40 Q100,15 160,40 L160,110 Q100,135 40,110 Z" class="svg-fill1 svg-str"/>
                <rect x="72" y="55" width="56" height="40" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Barrel rollers -->
                <ellipse cx="55" cy="65" rx="4" ry="12" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <ellipse cx="72" cy="70" rx="4" ry="12" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <ellipse cx="89" cy="73" rx="4" ry="12" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <ellipse cx="106" cy="73" rx="4" ry="12" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <ellipse cx="123" cy="70" rx="4" ry="12" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <ellipse cx="140" cy="65" rx="4" ry="12" class="svg-ball" stroke="${stroke}" stroke-width="0.8"/>
                <line x1="80" y1="58" x2="80" y2="36" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="58" x2="120" y2="36" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="34" x2="120" y2="34" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="32" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Thrust Ball (Axial de Esferas) ---
        if (t.includes('axial de esferas')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.vista_esquematica')}</text>
                <!-- Housing washer -->
                <rect x="30" y="25" width="140" height="25" rx="4" class="svg-fill1 svg-str"/>
                <!-- Shaft washer -->
                <rect x="60" y="100" width="80" height="20" rx="4" class="svg-fill2 svg-str"/>
                <!-- Balls between -->
                <circle cx="50" cy="60" r="6" class="svg-ball"/>
                <circle cx="70" cy="65" r="6" class="svg-ball"/>
                <circle cx="90" cy="65" r="6" class="svg-ball"/>
                <circle cx="110" cy="65" r="6" class="svg-ball"/>
                <circle cx="130" cy="65" r="6" class="svg-ball"/>
                <circle cx="150" cy="60" r="6" class="svg-ball"/>
                <!-- Cage indications -->
                <rect x="48" y="55" width="104" height="18" rx="2" class="svg-str" stroke-dasharray="3,2"/>
                <!-- Shaft -->
                <rect x="80" y="55" width="40" height="45" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <line x1="80" y1="55" x2="80" y2="22" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="55" x2="120" y2="22" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="20" x2="120" y2="20" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="18" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Needle Roller (Agulha) ---
        if (t.includes('agulha')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
                <rect x="70" y="55" width="60" height="40" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Needle rollers (thin, dense) -->
                <rect x="50" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="58" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="66" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="74" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="82" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="90" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="98" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="106" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="114" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="122" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="130" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="138" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <rect x="146" y="56" width="3" height="38" rx="1" class="svg-ball"/>
                <line x1="80" y1="60" x2="80" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="60" x2="120" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="38" x2="120" y2="38" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="36" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Four-Point Contact (Quatro Pontos de Contato) ---
        if (t.includes('quatro pontos') || t.includes('four-point')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
                <rect x="70" y="55" width="60" height="40" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Gothic arch raceway -->
                <path d="M50,60 Q55,50 60,60" stroke="${stroke}" stroke-width="1" fill="none"/>
                <path d="M140,60 Q145,50 150,60" stroke="${stroke}" stroke-width="1" fill="none"/>
                <path d="M50,90 Q55,100 60,90" stroke="${stroke}" stroke-width="1" fill="none"/>
                <path d="M140,90 Q145,100 150,90" stroke="${stroke}" stroke-width="1" fill="none"/>
                <!-- Single row balls with 4-point contact -->
                <circle cx="55" cy="75" r="7" class="svg-ball"/>
                <circle cx="75" cy="75" r="7" class="svg-ball"/>
                <circle cx="100" cy="75" r="7" class="svg-ball"/>
                <circle cx="125" cy="75" r="7" class="svg-ball"/>
                <circle cx="145" cy="75" r="7" class="svg-ball"/>
                <line x1="80" y1="60" x2="80" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="60" x2="120" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="38" x2="120" y2="38" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="36" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Insert Bearing / Y-bearing (Rolamento de Inserção) ---
        if (t.includes('inserção') || t.includes('insert')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
                <!-- Wide inner ring -->
                <rect x="68" y="50" width="64" height="50" rx="3" class="svg-fill2 svg-str"/>
                <rect x="80" y="50" width="40" height="50" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Setscrew on inner ring -->
                <rect x="86" y="50" width="4" height="8" fill="${accent}" stroke="${accent}" stroke-width="0.5"/>
                <rect x="110" y="50" width="4" height="8" fill="${accent}" stroke="${accent}" stroke-width="0.5"/>
                <!-- Balls -->
                <circle cx="55" cy="75" r="6" class="svg-ball"/>
                <circle cx="75" cy="75" r="6" class="svg-ball"/>
                <circle cx="100" cy="75" r="6" class="svg-ball"/>
                <circle cx="125" cy="75" r="6" class="svg-ball"/>
                <circle cx="145" cy="75" r="6" class="svg-ball"/>
                <line x1="80" y1="55" x2="80" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="55" x2="120" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="38" x2="120" y2="38" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="36" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
                <text x="100" y="130" text-anchor="middle" style="fill:${accent};font-size:6px">${i18n.t('calc.parafusos_fixacao')}</text>
            `);
        }

        // --- Pillow Block (Mancal com Rolamento) ---
        if (t.includes('pillow block') || (t.includes('mancal') && !t.includes('flange'))) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.vista_esquematica')}</text>
                <!-- Housing base -->
                <path d="M35,110 L40,80 L160,80 L165,110 Z" fill="${fill2}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Housing top -->
                <path d="M45,65 L45,80 L155,80 L155,65 Q100,45 45,65 Z" class="svg-fill1 svg-str"/>
                <!-- Bearing inside -->
                <rect x="70" y="60" width="60" height="40" rx="4" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <circle cx="100" cy="80" r="5" class="svg-ball"/>
                <circle cx="85" cy="80" r="5" class="svg-ball"/>
                <circle cx="115" cy="80" r="5" class="svg-ball"/>
                <!-- Shaft -->
                <rect x="80" y="76" width="40" height="8" fill="${accent}" rx="2"/>
                <!-- Base holes -->
                <circle cx="50" cy="115" r="4" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
                <circle cx="150" cy="115" r="4" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
                <text x="100" y="135" text-anchor="middle" style="fill:${stroke};font-size:7px">${i18n.t('calc.mancal_apoio')}</text>
            `);
        }

        // --- Flange Unit (Mancal com Flange) ---
        if (t.includes('flange') && t.includes('mancal')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.vista_esquematica')}</text>
                <!-- Square flange -->
                <rect x="40" y="40" width="120" height="80" rx="6" fill="${fill1}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Flange bore -->
                <rect x="70" y="60" width="60" height="40" rx="4" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <!-- Bearing -->
                <circle cx="100" cy="80" r="5" class="svg-ball"/>
                <circle cx="86" cy="80" r="5" class="svg-ball"/>
                <circle cx="114" cy="80" r="5" class="svg-ball"/>
                <!-- Shaft -->
                <rect x="80" y="76" width="40" height="8" fill="${accent}" rx="2"/>
                <!-- Mounting holes -->
                <circle cx="55" cy="55" r="4" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
                <circle cx="145" cy="55" r="4" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
                <circle cx="55" cy="105" r="4" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
                <circle cx="145" cy="105" r="4" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
                <text x="100" y="132" text-anchor="middle" style="fill:${stroke};font-size:7px">${i18n.t('calc.flange_quadrada')}</text>
            `);
        }

        // --- Linear Bearing (Rolamento Linear) ---
        if (t.includes('linear')) {
            return svgBase(`
                <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
                <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.corte_transversal')}</text>
                <!-- Sleeve outer -->
                <rect x="40" y="35" width="120" height="80" rx="4" class="svg-fill1 svg-str"/>
                <!-- Ball recirculation tracks -->
                <rect x="55" y="40" width="6" height="12" rx="2" class="svg-fill2" stroke="${stroke}" stroke-width="0.8"/>
                <rect x="139" y="40" width="6" height="12" rx="2" class="svg-fill2" stroke="${stroke}" stroke-width="0.8"/>
                <rect x="55" y="98" width="6" height="12" rx="2" class="svg-fill2" stroke="${stroke}" stroke-width="0.8"/>
                <rect x="139" y="98" width="6" height="12" rx="2" class="svg-fill2" stroke="${stroke}" stroke-width="0.8"/>
                <!-- Balls in tracks -->
                <circle cx="58" cy="46" r="2" class="svg-ball"/>
                <circle cx="58" cy="52" r="2" class="svg-ball"/>
                <circle cx="142" cy="46" r="2" class="svg-ball"/>
                <circle cx="142" cy="52" r="2" class="svg-ball"/>
                <circle cx="58" cy="98" r="2" class="svg-ball"/>
                <circle cx="58" cy="104" r="2" class="svg-ball"/>
                <circle cx="142" cy="98" r="2" class="svg-ball"/>
                <circle cx="142" cy="104" r="2" class="svg-ball"/>
                <!-- Shaft -->
                <rect x="75" y="55" width="50" height="40" fill="${accent}" rx="2" opacity="0.3"/>
                <rect x="80" y="60" width="40" height="30" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
                <line x1="80" y1="62" x2="80" y2="42" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="120" y1="62" x2="120" y2="42" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
                <line x1="80" y1="40" x2="120" y2="40" stroke="${accent}" stroke-width="1"/>
                <text x="100" y="38" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
            `);
        }

        // --- Fallback: generic bearing ---
        return svgBase(`
            <rect x="30" y="20" width="140" height="110" rx="6" class="svg-bg" />
            <text x="100" y="18" text-anchor="middle" style="fill:${stroke};font-size:7px;font-weight:600">${i18n.t('calc.vista_esquematica')}</text>
            <path d="M40,35 L160,35 L160,115 L40,115 Z" class="svg-fill1 svg-str"/>
            <rect x="70" y="55" width="60" height="40" rx="3" class="svg-fill2 svg-str"/>
            <rect x="80" y="55" width="40" height="40" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
            <circle cx="55" cy="75" r="7" class="svg-ball"/>
            <circle cx="75" cy="75" r="7" class="svg-ball"/>
            <circle cx="100" cy="75" r="7" class="svg-ball"/>
            <circle cx="125" cy="75" r="7" class="svg-ball"/>
            <circle cx="145" cy="75" r="7" class="svg-ball"/>
            <line x1="80" y1="60" x2="80" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
            <line x1="120" y1="60" x2="120" y2="40" stroke="${accent}" stroke-width="1" stroke-dasharray="3,2"/>
            <line x1="80" y1="38" x2="120" y2="38" stroke="${accent}" stroke-width="1"/>
            <text x="100" y="36" text-anchor="middle" class="svg-accent" style="font-size:7px;font-weight:600">d</text>
        `);
    }

    // --- 6. FUNÇÕES DE UI / EXIBIÇÃO ---
    function showPlaceholder(message) { resultDisplay.innerHTML = `<div class="result-placeholder"><i class="fa-solid fa-magnifying-glass"></i><p>${message}</p></div>`; copyBtn.style.display = 'none'; }
    function showLoading(message) { resultDisplay.innerHTML = `<div class="result-placeholder"><i class="fa-solid fa-spinner fa-spin"></i><p>${message}</p></div>`; copyBtn.style.display = 'none'; }
    function displayMessage(type, title, message) {
        const iconMap = { warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark', info: 'fa-circle-info' };
        const colorMap = { warning: 'var(--cor-destaque)', error: 'var(--cor-erro)', info: 'var(--primary)' };
        resultDisplay.innerHTML = `<div class="result-content"><div class="${type}-item" style="display:flex;flex-direction:column;gap:0.5rem;padding:1rem;background:var(--surface);border-radius:var(--radius-sm);border:1px solid var(--border);border-left:4px solid ${colorMap[type] || 'var(--primary)'}"><span style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:1rem;color:var(--text)"><i class="fa-solid ${iconMap[type] || 'fa-circle-info'}"></i> ${title}</span><span style="font-size:0.9rem;color:var(--text-secondary);line-height:1.5">${message}</span></div></div>`;
        copyBtn.style.display = 'none';
    }
    function showWarning(title, message = 'Verifique os dados e tente novamente.') { displayMessage('warning', title, message); }
    function showError(title, message = 'Ocorreu um problema inesperado.') { displayMessage('error', title, message); }
    function displayInfo(title, message) { displayMessage('info', title, message); }

    function displayBearingDetails(data) {
        currentBearingData = data;
        const larguraLabel = data.T ? i18n.t('calc.width_total') : i18n.t('calc.width_b');
        const larguraValue = data.T || data.B;
        let cargaDinamicaLabel = i18n.t('calc.radial_dyn');
        let cargaEstaticaLabel = i18n.t('calc.radial_stat');
        
        if (data.tipo && data.tipo.toLowerCase().includes('axial')) { 
            cargaDinamicaLabel = i18n.t('calc.axial_dyn'); 
            cargaEstaticaLabel = i18n.t('calc.axial_stat'); 
        }
        
        const formatValue = (value) => value ? value.toLocaleString(i18n.current === 'pt' ? 'pt-BR' : 'en-US') : '-';
        const tipoTraduzido = translateType(data.tipo);

        const isAxial = data.tipo && data.tipo.toLowerCase().includes('axial');
        const isLinear = data.tipo && data.tipo.toLowerCase().includes('linear');
        const hasSpeed = data.rpm_graxa != null || data.rpm_oleo != null;

        const dimItems = [
            { icon: 'fa-arrow-right-arrow-left', label: i18n.t('calc.bore'), value: `${data.d} mm` },
            { icon: 'fa-arrow-left-arrow-right', label: i18n.t('calc.outer'), value: `${data.D} mm` },
            { icon: 'fa-maximize', label: larguraLabel, value: `${larguraValue} mm` },
            { icon: 'fa-weight-scale', label: i18n.t('calc.mass'), value: data.massa ? `${data.massa} kg` : '-' },
        ];
        const loadItems = [
            { icon: isAxial ? 'fa-arrow-up' : 'fa-arrow-down', label: cargaDinamicaLabel, value: `${formatValue(data.C)} N` },
            { icon: isAxial ? 'fa-arrow-up' : 'fa-arrow-down', label: cargaEstaticaLabel, value: `${formatValue(data.C0)} N` },
        ];
        
        const gridHTML = `
            <div class="grid-section">
                <span class="grid-section-title"><i class="fa-solid fa-ruler"></i> ${i18n.t('calc.dimensoes')}</span>
                <div class="grid-subgrid">${dimItems.map(i => `<div class="result-item"><span class="item-icon"><i class="fa-solid ${i.icon}"></i></span><span class="label">${i.label}</span><span class="value">${i.value}</span></div>`).join('')}</div>
            </div>
            <div class="grid-section">
                <span class="grid-section-title"><i class="fa-solid fa-weight-hanging"></i> ${i18n.t('calc.capacidade_carga')}</span>
                <div class="grid-subgrid">${loadItems.map(i => `<div class="result-item"><span class="item-icon"><i class="fa-solid ${i.icon}"></i></span><span class="label">${i.label}</span><span class="value">${i.value}</span></div>`).join('')}</div>
            </div>
            ${hasSpeed ? `
            <div class="grid-section">
                <span class="grid-section-title"><i class="fa-solid fa-gauge-high"></i> ${i18n.t('calc.velocidade_maxima')}</span>
                <div class="grid-subgrid">${[
                    { icon: 'fa-droplet', label: i18n.t('calc.rpm_grease'), value: formatValue(data.rpm_graxa) },
                    { icon: 'fa-oil-can', label: i18n.t('calc.rpm_oil'), value: formatValue(data.rpm_oleo) },
                ].filter(s => s.value !== '-').map(i => `<div class="result-item"><span class="item-icon"><i class="fa-solid ${i.icon}"></i></span><span class="label">${i.label}</span><span class="value">${i.value} rpm</span></div>`).join('')}</div>
            </div>` : ''}
        `;
        const notesHTML = data.notas ? `<div class="grid-section notes-section"><span class="grid-section-title"><i class="fa-solid fa-circle-exclamation"></i> ${i18n.t('calc.observacoes')}</span><div class="grid-subgrid"><div class="result-item notes-item"><span class="value">${data.notas}</span></div></div></div>` : '';
        const svgHTML = getSvgForBearing(data.tipo);
        const finalHTML = `<div class="result-content"><div class="result-header"><div class="header-top"><span class="label">${i18n.t('calc.designation')}</span><button class="header-copy-btn" id="copy-btn-inline" title="${i18n.t('calc.copiar')}"><i class="fa-regular fa-copy"></i></button></div><span class="designation-value" id="result-value">${data.designacao}</span><span class="type-value"><i class="fa-solid fa-tag"></i> ${tipoTraduzido}</span></div><div class="result-body"><div class="results-grid">${gridHTML}${notesHTML}</div></div><div class="svg-card"><div class="svg-card-inner"><span class="svg-type-label">${tipoTraduzido}</span>${svgHTML}</div></div></div>`;
        
        resultDisplay.innerHTML = finalHTML;
        copyBtn.style.display = 'none';
        const inlineCopy = document.getElementById('copy-btn-inline');
        if (inlineCopy) {
            inlineCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(data.designacao).then(() => {
                    inlineCopy.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => { inlineCopy.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
                });
            });
        }
    }

    function displaySearchResults(results) {
        currentBearingData = null;
        resultDisplay.innerHTML = `<div class="result-content"><div class="result-header"><span class="label" style="text-align:left;display:block;font-size:0.75rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1.5px">${results.length} ${i18n.t('calc.results_found')}</span></div><div class="table-container" style="margin-top:0"><table><thead><tr><th>${i18n.t('calc.designation')}</th><th>${i18n.t('calc.type')}</th><th>d</th><th>D</th><th>B/T</th></tr></thead><tbody>${results.map(b => `<tr class="result-row" data-spec="${b.designacao}" title="${i18n.t('calc.click_details')} ${b.designacao}"><td><strong>${b.designacao}</strong></td><td>${translateType(b.tipo)}</td><td>${b.d}</td><td>${b.D}</td><td>${b.T || b.B}</td></tr>`).join('')}</tbody></table></div></div>`;
        copyBtn.style.display = 'none';
    }

    // --- 7. FUNÇÕES AUXILIARES ---
    function clearAll() {
        directSearchInput.value = ''; boreSearchInput.value = ''; outerSearchInput.value = '';
        widthSearchInput.value = ''; isoInput.value = '';
        showPlaceholder(i18n.t('calc.waiting_query'));
        currentBearingData = null;
        directSearchInput.focus();
    }
    function loadTheme() { if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-theme'); themeToggle.checked = true; } }
    function addToHistory(spec) { searchHistory = searchHistory.filter(item => item.toUpperCase() !== spec.toUpperCase()); searchHistory.unshift(spec); if (searchHistory.length > 10) { searchHistory.pop(); } localStorage.setItem('bearingSearchHistory', JSON.stringify(searchHistory)); renderHistory(); }
    function renderHistory() { if (searchHistory.length === 0) { historyList.innerHTML = `<li class="history-placeholder">${i18n.t('calc.no_history')}</li>`; return; } historyList.innerHTML = searchHistory.map(item => `<li data-spec="${item}" title="Buscar por ${item}">${item}</li>`).join(''); }

    // --- 8. EVENT LISTENERS ---
    function setupEventListeners() {
        directSearchBtn.addEventListener('click', handleDirectSearch);
        advancedSearchBtn.addEventListener('click', handleAdvancedSearch);
        isoCalculateBtn.addEventListener('click', handleISOCalculation);
        clearBtn.addEventListener('click', clearAll);
        directSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleDirectSearch(); });
        boreSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleAdvancedSearch(); });
        outerSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleAdvancedSearch(); });
        widthSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleAdvancedSearch(); });
        isoInput.addEventListener('keyup', e => { if (e.key === 'Enter') handleISOCalculation(); });
        
        copyBtn.addEventListener('click', () => {
            const resultValue = document.getElementById('result-value')?.innerText;
            if (resultValue) {
                navigator.clipboard.writeText(resultValue).then(() => {
                    const originalIcon = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => { copyBtn.innerHTML = originalIcon; }, 1500);
                });
            }
        });
        
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            if (currentBearingData) displayBearingDetails(currentBearingData);
        });
        
        historyList.addEventListener('click', e => {
            if (e.target?.matches('li[data-spec]')) {
                directSearchInput.value = e.target.getAttribute('data-spec');
                handleDirectSearch();
            }
        });
        
        resultDisplay.addEventListener('click', e => {
            const row = e.target.closest('.result-row');
            if (row) {
                directSearchInput.value = row.dataset.spec;
                handleDirectSearch();
            }
        });
        

    }

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    init();
});
