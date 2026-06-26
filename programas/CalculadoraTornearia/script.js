document.addEventListener('DOMContentLoaded', function() {
    // =================================================================================
    // TEMPLATES HTML DE CADA CALCULADORA
    // =================================================================================
    var CALC_TEMPLATES = {
        vc: '<div class="input-group"><label><span data-i18n="tornearia.label_diameter_d">Diâmetro D</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="vc-d"></div><div class="input-group"><label><span data-i18n="tornearia.label_rpm">RPM</span>:</label><input type="number" id="vc-rpm"></div><div class="radio-group" data-calculator="vc"><label><input type="radio" name="unit-vc" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-vc" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="vc" data-i18n="calc.btn">Calcular</button>',
        rpm: '<div class="input-group"><label><span data-i18n="tornearia.label_vc">Vc</span> <span class="vc-unit-label">[m/min]</span>:</label><input type="number" id="rpm-vc"></div><div class="input-group"><label><span data-i18n="tornearia.label_diameter_d_small">Diâmetro d</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="rpm-d"></div><div class="radio-group" data-calculator="rpm"><label><input type="radio" name="unit-rpm" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-rpm" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="rpm" data-i18n="calc.btn">Calcular</button>',
        avanco: '<div class="input-group"><label><span data-i18n="tornearia.label_machined_length_l">Comprimento usinado (L)</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="avanco-l"></div><div class="input-group"><label><span data-i18n="tornearia.label_rotations_n">Nº de rotações (n)</span>:</label><input type="number" id="avanco-n"></div><div class="radio-group" data-calculator="avanco"><label><input type="radio" name="unit-avanco" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-avanco" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="avanco" data-i18n="calc.btn">Calcular</button>',
        profundidade: '<div class="input-group"><label><span data-i18n="tornearia.label_larger_diameter_d">Diâmetro Maior D</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="profundidade-D"></div><div class="input-group"><label><span data-i18n="tornearia.label_smaller_diameter_d">Diâmetro Menor d</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="profundidade-d"></div><div class="radio-group" data-calculator="profundidade"><label><input type="radio" name="unit-profundidade" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-profundidade" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="profundidade" data-i18n="calc.btn">Calcular</button>',
        remocao: '<div class="input-group"><label><span data-i18n="tornearia.label_vc">Vc</span> <span class="vc-unit-label">[m/min]</span>:</label><input type="number" id="remocao-vc"></div><div class="input-group"><label><span data-i18n="tornearia.label_depth_ap">Profundidade (ap)</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="remocao-ap"></div><div class="input-group"><label><span data-i18n="tornearia.label_feed_fn">Avanço (fn)</span> <span class="feed-unit-label">[mm/rot]</span>:</label><input type="number" id="remocao-fn"></div><div class="radio-group" data-calculator="remocao"><label><input type="radio" name="unit-remocao" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-remocao" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="remocao" data-i18n="calc.btn">Calcular</button>',
        tempo: '<div class="input-group"><label><span data-i18n="tornearia.label_what_calculate">O que deseja calcular?</span></label><div class="radio-group" id="tempo-choice"><label><input type="radio" name="tempo-calc" value="tempo" checked> <span data-i18n="tornearia.choice_time_tc">Tempo (Tc)</span></label><label><input type="radio" name="tempo-calc" value="comprimento"> <span data-i18n="tornearia.choice_length_l">Comprimento (L)</span></label><label><input type="radio" name="tempo-calc" value="rpm"> <span data-i18n="tornearia.choice_rpm_n">RPM (n)</span></label><label><input type="radio" name="tempo-calc" value="avanco"> <span data-i18n="tornearia.choice_feed_f">Avanço (f)</span></label></div></div><div class="input-group"><label><span data-i18n="tornearia.label_time_tc">Tempo (Tc)</span> [min]:</label><input type="number" id="tempo-tc"></div><div class="input-group"><label><span data-i18n="tornearia.label_length_l">Comprimento (L)</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="tempo-l"></div><div class="input-group"><label><span data-i18n="tornearia.label_rpm_n">RPM (n)</span>:</label><input type="number" id="tempo-n"></div><div class="input-group"><label><span data-i18n="tornearia.label_feed_f">Avanço (f)</span> <span class="feed-unit-label">[mm/rot]</span>:</label><input type="number" id="tempo-f"></div><div class="radio-group" data-calculator="tempo"><label><input type="radio" name="unit-tempo" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-tempo" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="tempo" data-i18n="calc.btn">Calcular</button>',
        rugosidade: '<div class="input-group"><label><span data-i18n="tornearia.label_what_calculate">O que deseja calcular?</span></label><div class="radio-group" id="rugosidade-choice"><label><input type="radio" name="rugosidade-calc" value="rugosidade" checked> <span data-i18n="tornearia.choice_roughness_h">Rugosidade (h)</span></label><label><input type="radio" name="rugosidade-calc" value="avanco"> <span data-i18n="tornearia.choice_feed_f2">Avanço (f)</span></label><label><input type="radio" name="rugosidade-calc" value="raio"> <span data-i18n="tornearia.choice_radius_re">Raio (Re)</span></label></div></div><div class="input-group"><label><span data-i18n="tornearia.label_roughness_h">Rugosidade (h)</span> [µm]:</label><input type="number" id="rugosidade-h"></div><div class="input-group"><label><span data-i18n="tornearia.label_feed_f2">Avanço (f)</span> <span class="feed-unit-label">[mm/rot]</span>:</label><input type="number" id="rugosidade-f"></div><div class="input-group"><label><span data-i18n="tornearia.label_tip_radius_re">Raio da Ponta (Re)</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="rugosidade-re"></div><div class="radio-group" data-calculator="rugosidade"><label><input type="radio" name="unit-rugosidade" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-rugosidade" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="rugosidade" data-i18n="calc.btn">Calcular</button>',
        potencia: '<div class="input-group"><label><span data-i18n="tornearia.label_what_calculate">O que deseja calcular?</span></label><div class="radio-group" id="potencia-choice"><label><input type="radio" name="potencia-calc" value="potencia" checked> <span data-i18n="tornearia.choice_power_pc">Potência (Pc)</span></label><label><input type="radio" name="potencia-calc" value="vc"> <span data-i18n="tornearia.choice_speed_vc">Velocidade (Vc)</span></label></div></div><div class="input-group"><label><span data-i18n="tornearia.label_power_pc">Potência (Pc)</span> [kW]:</label><input type="number" id="potencia-pc"></div><div class="input-group"><label><span data-i18n="tornearia.label_speed_vc">Velocidade (Vc)</span> <span class="vc-unit-label">[m/min]</span>:</label><input type="number" id="potencia-vc"></div><div class="input-group"><label><span data-i18n="tornearia.label_depth_ap2">Profundidade (ap)</span> <span class="unit-label">[mm]</span>:</label><input type="number" id="potencia-ap"></div><div class="input-group"><label><span data-i18n="tornearia.label_feed_fn2">Avanço (fn)</span> <span class="feed-unit-label">[mm/rot]</span>:</label><input type="number" id="potencia-fn"></div><div class="input-group"><label><span data-i18n="tornearia.label_spec_force_kc">Força Espec. (kc)</span> [N/mm²]:</label><input type="number" id="potencia-kc" value="2100"></div><div class="input-group"><label><span data-i18n="tornearia.label_yield_eta">Rendimento (η)</span>:</label><input type="number" id="potencia-eta" value="0.8" step="0.1"></div><div class="radio-group" data-calculator="potencia"><label><input type="radio" name="unit-potencia" value="metric" checked> <span data-i18n="tornearia.metric">Métrico</span></label><label><input type="radio" name="unit-potencia" value="imperial"> <span data-i18n="tornearia.inches">Polegadas</span></label></div><button class="main-button" data-calculator="potencia" data-i18n="calc.btn">Calcular</button>'
    };

    // =================================================================================
    // DOM REFS
    // =================================================================================
    var inputsColumn = document.getElementById('inputs-column');
    var outputsColumn = document.getElementById('outputs-column');
    var resultsCard = document.getElementById('results-card');
    var resultPlaceholder = document.getElementById('resultPlaceholder');
    var menuToggle = document.getElementById('menuToggle');
    var closeMenuBtn = document.getElementById('closeMenuBtn');
    var fullscreenMenu = document.getElementById('fullscreenMenu');
    var themeToggle = document.getElementById('themeToggle');
    var overlayNav = document.getElementById('overlayNav');
    var currentCalc = null;

    // =================================================================================
    // THEME
    // =================================================================================
    function applyTheme(dark) {
        document.body.classList.toggle('dark-theme', dark);
        themeToggle.checked = dark;
        try { localStorage.setItem('tornearia-theme', dark ? 'dark' : 'light'); } catch(e) {}
    }
    try {
        var stored = localStorage.getItem('tornearia-theme');
        if (stored) applyTheme(stored === 'dark');
        else applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch(e) { applyTheme(false); }
    themeToggle.addEventListener('change', function() { applyTheme(this.checked); });

    // =================================================================================
    // MENU
    // =================================================================================
    function openMenu() { fullscreenMenu.classList.add('active'); }
    function closeMenu() { fullscreenMenu.classList.remove('active'); }
    menuToggle.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    fullscreenMenu.addEventListener('click', function(e) { if (e.target === fullscreenMenu) closeMenu(); });

    // =================================================================================
    // CONSTANTS & HELPERS
    // =================================================================================
    var MM_PER_INCH = 25.4;
    var FEET_PER_METER = 3.28084;

    var toastContainer = (function() {
        var c = document.querySelector('.toast-container');
        if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
        return c;
    })();

    function showToast(msg, timeout) {
        timeout = timeout || 3000;
        var t = document.createElement('div');
        t.className = 'toast'; t.textContent = msg;
        toastContainer.appendChild(t);
        void t.offsetWidth;
        t.classList.add('show');
        setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 250); }, timeout);
    }

    function getInput(id) { return parseFloat(document.getElementById(id).value) || 0; }
    function getSystem(id) {
        var el = document.querySelector('input[name="unit-' + id + '"]:checked');
        return el ? el.value : 'metric';
    }

    // Injeção do SVG Nativo no botão de copiar
    function showResult(label, value) {
        var safeValue = String(value);
        resultPlaceholder.style.display = 'none';
        var existing = resultsCard.querySelector('.result-content');
        if (existing) existing.remove();
        var div = document.createElement('div');
        div.className = 'result-content';
        div.innerHTML = '<div class="result-header"><span class="label">' + label + '</span><span class="designation-value">' + safeValue + '</span><button class="copy-btn" data-copy-value="' + safeValue.replace(/"/g, '&quot;') + '" title="' + (typeof i18n !== 'undefined' ? i18n.t('tornearia.copy_result_title') : 'Copiar resultado') + '"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button></div>';
        resultsCard.appendChild(div);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    // =================================================================================
    // CALCULATOR LOGIC
    // =================================================================================
    var calculators = {};

    function setupAdvancedCalculator(id, inputsMap) {
        document.addEventListener('change', function(e) {
            if (e.target && e.target.name === id + '-calc') updateAdvancedUI(id, inputsMap);
        });
    }

    function updateAdvancedUI(id, inputsMap) {
        if (!inputsMap) return;
        var choiceRadio = document.querySelector('input[name="' + id + '-calc"]:checked');
        if (!choiceRadio) return;
        var choice = choiceRadio.value;
        Object.keys(inputsMap).forEach(function(key) {
            var inputEl = document.getElementById(inputsMap[key]);
            if (inputEl) inputEl.disabled = false;
        });
        var targetInput = document.getElementById(inputsMap[choice]);
        if (targetInput) targetInput.disabled = true;
    }

    calculators.vc = {
        calculate: function() {
            var d = getInput('vc-d'), rpm = getInput('vc-rpm');
            var system = getSystem('vc');
            if (system === 'imperial') d *= MM_PER_INCH;
            if (!d || !rpm) return showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_fields') : 'Preencha todos os campos');
            var vc = (d * Math.PI * rpm) / 1000;
            var unit = system === 'imperial' ? 'SFM' : 'm/min';
            if (system === 'imperial') vc *= FEET_PER_METER;
            showResult(typeof i18n !== 'undefined' ? i18n.t('tornearia.result_cut_speed') : 'Velocidade de Corte', vc.toFixed(2) + ' ' + unit);
        }
    };

    calculators.rpm = {
        calculate: function() {
            var vc = getInput('rpm-vc'), d = getInput('rpm-d');
            var system = getSystem('rpm');
            if (!vc || !d) return showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_fields') : 'Preencha todos os campos');
            if (system === 'imperial') { vc /= FEET_PER_METER; d *= MM_PER_INCH; }
            var rpm = (vc * 1000) / (d * Math.PI);
            showResult(typeof i18n !== 'undefined' ? i18n.t('tornearia.result_calculated_rpm') : 'RPM Calculado', rpm.toFixed(0) + ' RPM');
        }
    };

    calculators.avanco = {
        calculate: function() {
            var l = getInput('avanco-l'), n = getInput('avanco-n');
            var system = getSystem('avanco');
            if (!l || !n) return showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_fields') : 'Preencha todos os campos');
            var f = l / n, unit = system === 'metric' ? 'mm/rot' : 'in/rev';
            showResult(typeof i18n !== 'undefined' ? i18n.t('tornearia.result_calculated_feed') : 'Avanço Calculado', f.toFixed(4) + ' ' + unit);
        }
    };

    calculators.profundidade = {
        calculate: function() {
            var D = getInput('profundidade-D'), d = getInput('profundidade-d');
            var system = getSystem('profundidade');
            if (!D || !d) return showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_fields') : 'Preencha todos os campos');
            var ap = (D - d) / 2, unit = system === 'metric' ? 'mm' : 'in';
            showResult(typeof i18n !== 'undefined' ? i18n.t('tornearia.result_calculated_depth') : 'Profundidade Calculada', ap.toFixed(3) + ' ' + unit);
        }
    };

    calculators.remocao = {
        calculate: function() {
            var vc = getInput('remocao-vc'), ap = getInput('remocao-ap'), fn = getInput('remocao-fn');
            var system = getSystem('remocao');
            if (!vc || !ap || !fn) return showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_fields') : 'Preencha todos os campos');
            if (system === 'imperial') { vc /= FEET_PER_METER; ap *= MM_PER_INCH; fn *= MM_PER_INCH; }
            var Q = (vc * 1000 * ap * fn) / 1000;
            var unit = system === 'metric' ? 'cm³/min' : 'in³/min';
            var result = system === 'imperial' ? Q / 16387.1 : Q;
            showResult(typeof i18n !== 'undefined' ? i18n.t('tornearia.result_mrr') : 'Taxa de Remoção', result.toFixed(2) + ' ' + unit);
        }
    };

    setupAdvancedCalculator('tempo', { tempo: 'tempo-tc', comprimento: 'tempo-l', rpm: 'tempo-n', avanco: 'tempo-f' });
    calculators.tempo = {
        calculate: function() {
            try {
                var choice = document.querySelector('input[name="tempo-calc"]:checked');
                if (!choice) return;
                choice = choice.value;
                var tempo = getInput('tempo-tc'), comprimento = getInput('tempo-l'), rpm = getInput('tempo-n'), avanco = getInput('tempo-f');
                var system = getSystem('tempo');
                if (system === 'imperial') { comprimento *= MM_PER_INCH; avanco *= MM_PER_INCH; }
                var result, label, unit = "min";
                if (choice === 'tempo') { if(!comprimento || !rpm || !avanco) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_comprimento_rpm_avanco') : 'Preencha Comprimento, RPM e Avanço'); result = comprimento / (rpm * avanco); label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_cut_time') : "Tempo de Corte"; }
                else if (choice === 'comprimento') { if(!tempo || !rpm || !avanco) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_tempo_rpm_avanco') : 'Preencha Tempo, RPM e Avanço'); result = tempo * rpm * avanco; label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_length') : "Comprimento"; unit = system === 'metric' ? 'mm' : 'in'; if(system === 'imperial') result /= MM_PER_INCH; }
                else if (choice === 'rpm') { if(!comprimento || !tempo || !avanco) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_comprimento_tempo_avanco') : 'Preencha Comprimento, Tempo e Avanço'); result = comprimento / (tempo * avanco); label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_rpm') : "RPM"; unit = "RPM"; }
                else { if(!comprimento || !tempo || !rpm) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_comprimento_tempo_rpm') : 'Preencha Comprimento, Tempo e RPM'); result = comprimento / (tempo * rpm); label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_feed') : "Avanço"; unit = system === 'metric' ? 'mm/rot' : 'in/rev'; if(system === 'imperial') result /= MM_PER_INCH; }
                showResult(label, result.toFixed(3) + ' ' + unit);
            } catch(e) { showToast(e.message); }
        }
    };

    setupAdvancedCalculator('rugosidade', { rugosidade: 'rugosidade-h', avanco: 'rugosidade-f', raio: 'rugosidade-re' });
    calculators.rugosidade = {
        calculate: function() {
            try {
                var choice = document.querySelector('input[name="rugosidade-calc"]:checked');
                if (!choice) return;
                choice = choice.value;
                var rugosidade = getInput('rugosidade-h'), avanco = getInput('rugosidade-f'), raio = getInput('rugosidade-re');
                var system = getSystem('rugosidade');
                if (system === 'imperial') { avanco *= MM_PER_INCH; raio *= MM_PER_INCH; }
                var result, label, unit;
                if (choice === 'rugosidade') { if(!avanco || !raio) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_avanco_raio') : 'Preencha Avanço e Raio'); result = (avanco*avanco / (8 * raio)) * 1000; label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_roughness_h') : "Rugosidade (h)"; unit="µm"; }
                else if (choice === 'avanco') { if(!rugosidade || !raio) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_rugosidade_raio') : 'Preencha Rugosidade e Raio'); result = Math.sqrt(rugosidade * 8 * raio / 1000); label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_feed_f') : "Avanço (f)"; unit = system === 'metric' ? 'mm/rot' : 'in/rev'; if(system === 'imperial') result /= MM_PER_INCH; }
                else { if(!rugosidade || !avanco) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_rugosidade_avanco') : 'Preencha Rugosidade e Avanço'); result = (avanco*avanco / (rugosidade / 1000)) / 8; label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_radius_re') : "Raio (Re)"; unit = system === 'metric' ? 'mm' : 'in'; if(system === 'imperial') result /= MM_PER_INCH; }
                showResult(label, result.toFixed(4) + ' ' + unit);
            } catch(e) { showToast(e.message); }
        }
    };

    setupAdvancedCalculator('potencia', { potencia: 'potencia-pc', vc: 'potencia-vc' });
    calculators.potencia = {
        calculate: function() {
            try {
                var choice = document.querySelector('input[name="potencia-calc"]:checked');
                if (!choice) return;
                choice = choice.value;
                var potencia = getInput('potencia-pc'), vc = getInput('potencia-vc'), ap = getInput('potencia-ap'), fn = getInput('potencia-fn'), kc = getInput('potencia-kc'), eta = getInput('potencia-eta');
                var system = getSystem('potencia');
                if (system === 'imperial') { vc /= FEET_PER_METER; ap *= MM_PER_INCH; fn *= MM_PER_INCH; }
                var result, label, unit;
                if (choice === 'potencia') { if(!vc || !ap || !fn) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_vc_ap_fn') : 'Preencha Vc, ap e fn'); result = (vc * ap * fn * kc) / (60000 * eta); label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_power_pc') : "Potência (Pc)"; unit = "kW"; }
                else { if(!potencia || !ap || !fn) throw new Error(typeof i18n !== 'undefined' ? i18n.t('tornearia.error_fill_pc_ap_fn') : 'Preencha Pc, ap e fn'); result = (potencia * 60000 * eta) / (ap * fn * kc); label = typeof i18n !== 'undefined' ? i18n.t('tornearia.result_speed_vc') : "Velocidade (Vc)"; unit = system === 'metric' ? 'm/min' : 'SFM'; if(system === 'imperial') result *= FEET_PER_METER; }
                showResult(label, result.toFixed(2) + ' ' + unit);
            } catch(e) { showToast(e.message); }
        }
    };

    // =================================================================================
    // TABLE LOADING (Com injeção de data-label para os Cards no Mobile)
    // =================================================================================
    var tableDisplayCard = null;
    function ensureTableCard() {
        if (!tableDisplayCard || !document.body.contains(tableDisplayCard)) {
            var existing = document.getElementById('table-display-card');
            if (existing) { tableDisplayCard = existing; return; }
            var card = document.createElement('div');
            card.id = 'table-display-card';
            card.className = 'card';
            card.style.display = 'none';
            outputsColumn.insertBefore(card, resultsCard);
            tableDisplayCard = card;
        }
    }

    async function displayTableFromFile(fileName) {
        try {
            var resp = await fetch(fileName);
            if (!resp.ok) throw new Error((typeof i18n !== 'undefined' ? i18n.t('tornearia.file_not_found') : 'Arquivo não encontrado: ') + resp.statusText);
            var data = await resp.json();
            var html = '';
            if (data.htmlContent) {
                html = '<h2 class="calc-title">' + (data.title || '') + '</h2>' + data.htmlContent;
            } else if (data.headers && data.rows) {
                html = '<h2 class="calc-title">' + (data.title || '') + '</h2><div class="table-container"><table><thead><tr>' + data.headers.map(function(h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + data.rows.map(function(row) { return '<tr>' + Object.values(row).map(function(cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
            } else {
                html = '<h2 class="calc-title">' + (data.title || (typeof i18n !== 'undefined' ? i18n.t('tornearia.table') : 'Tabela')) + '</h2><p>' + (typeof i18n !== 'undefined' ? i18n.t('tornearia.unrecognized_table_format') : 'Formato de tabela não reconhecido.') + '</p>';
            }
            ensureTableCard();
            resultsCard.style.display = 'none';
            inputsColumn.style.display = 'none';
            tableDisplayCard.style.display = 'block';
            tableDisplayCard.innerHTML = html;

            // ----------------------------------------------------------------

            closeMenu();
        } catch (err) {
            showToast((typeof i18n !== 'undefined' ? i18n.t('tornearia.error_loading_table') : 'Erro ao carregar tabela: ') + err.message);
        }
    }

    // =================================================================================
    // LOAD CALCULATOR
    // =================================================================================
    function loadCalculator(name) {
        if (name === currentCalc) return;
        currentCalc = name;

        if (tableDisplayCard) { tableDisplayCard.style.display = 'none'; }
        resultsCard.style.display = '';
        inputsColumn.style.display = '';

        var tmpl = CALC_TEMPLATES[name];
        if (!tmpl) return;

        inputsColumn.innerHTML = '<div class="card"><h2><i class="' + getCalcIcon(name) + '"></i> ' + getCalcTitle(name) + '</h2>' + tmpl + '</div>';
        resultPlaceholder.style.display = 'block';
        var existing = resultsCard.querySelector('.result-content');
        if (existing) existing.remove();

        if (typeof i18n !== 'undefined') i18n.translatePage(inputsColumn);

        var advInputs = { tempo: { tempo: 'tempo-tc', comprimento: 'tempo-l', rpm: 'tempo-n', avanco: 'tempo-f' }, rugosidade: { rugosidade: 'rugosidade-h', avanco: 'rugosidade-f', raio: 'rugosidade-re' }, potencia: { potencia: 'potencia-pc', vc: 'potencia-vc' } };
        if (advInputs[name]) updateAdvancedUI(name, advInputs[name]);
    }

    function getCalcIcon(name) {
        var icons = { vc: 'fa-solid fa-gauge-high', rpm: 'fa-solid fa-arrows-rotate', avanco: 'fa-solid fa-arrow-right-long', profundidade: 'fa-solid fa-arrows-down-to-line', remocao: 'fa-solid fa-industry', tempo: 'fa-solid fa-clock', rugosidade: 'fa-solid fa-wave-square', potencia: 'fa-solid fa-bolt' };
        return icons[name] || 'fa-solid fa-calculator';
    }

    function getCalcTitle(name) {
        var t = { vc: 'Velocidade de Corte (Vc)', rpm: 'RPM (n)', avanco: 'Avanço (f)', profundidade: 'Profundidade de Corte (ap)', remocao: 'Taxa de Remoção de Metal (Q)', tempo: 'Tempo de Corte (Tc)', rugosidade: 'Rugosidade Teórica (h)', potencia: 'Potência de Corte (Pc)' };
        var k = { vc: 'tornearia.title_vc', rpm: 'tornearia.title_rpm', avanco: 'tornearia.title_avanco', profundidade: 'tornearia.title_profundidade', remocao: 'tornearia.title_remocao', tempo: 'tornearia.title_tempo', rugosidade: 'tornearia.title_rugosidade', potencia: 'tornearia.title_potencia' };
        return typeof i18n !== 'undefined' && k[name] ? i18n.t(k[name]) : (t[name] || name);
    }

    // =================================================================================
    // EVENT DELEGATION
    // =================================================================================
    document.body.addEventListener('click', function(e) {
        var navLink = e.target.closest('[data-nav]');
        if (navLink) {
            e.preventDefault();
            loadCalculator(navLink.dataset.nav);
            closeMenu();
            document.querySelectorAll('.overlay-nav .nav-link').forEach(function(n) { n.classList.remove('active'); });
            navLink.classList.add('active');
            return;
        }

        var tableLink = e.target.closest('[data-table]');
        if (tableLink) {
            e.preventDefault();
            displayTableFromFile(tableLink.dataset.table);
            closeMenu();
            return;
        }

        var calcBtn = e.target.closest('.main-button[data-calculator]');
        if (calcBtn) {
            var id = calcBtn.dataset.calculator;
            if (calculators[id]) calculators[id].calculate();
            return;
        }

        var copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            var val = copyBtn.getAttribute('data-copy-value') || copyBtn.textContent;
            navigator.clipboard.writeText(val).then(
                function() { showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.result_copied') : 'Resultado copiado!'); },
                function() { showToast(typeof i18n !== 'undefined' ? i18n.t('tornearia.cannot_copy') : 'Não foi possível copiar'); }
            );
            return;
        }
    });

    // =================================================================================
    // BUILD OVERLAY MENU (highlight active)
    // =================================================================================
    overlayNav.querySelectorAll('[data-nav]').forEach(function(link) {
        link.addEventListener('click', function() {
            overlayNav.querySelectorAll('[data-nav]').forEach(function(n) { n.classList.remove('active'); });
            link.classList.add('active');
        });
    });

    // =================================================================================
    // LOAD DEFAULT
    // =================================================================================
    loadCalculator('vc');
    var firstNav = overlayNav.querySelector('[data-nav="vc"]');
    if (firstNav) firstNav.classList.add('active');
});
