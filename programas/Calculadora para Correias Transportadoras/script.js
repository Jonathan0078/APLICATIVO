document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    inicializarMenu();
    inicializarApp();
});

function inicializarMenu() {
    const floatingMenu = document.getElementById('floatingMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuBtn = document.getElementById('menuBtn');

    function toggleMenu() {
        floatingMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }
    function closeMenu() {
        if (floatingMenu.classList.contains('active')) {
            floatingMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    document.querySelectorAll('.calc-item[data-calc]').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const calcId = this.getAttribute('data-calc');
            mostrarCalculadora(calcId);
            closeMenu();
        });
    });
}

function inicializarApp() {
    const inputsCalculadora = document.querySelectorAll('.campo-calculo');
    inputsCalculadora.forEach(input => {
        input.addEventListener('input', function() {
            const painelPai = input.closest('.calculadora');
            if (painelPai) {
                const divResultado = painelPai.querySelector('.resultado');
                if (divResultado) {
                    divResultado.style.display = 'none';
                    divResultado.classList.remove('fade-in');
                }
            }
        });
    });
}

function mostrarCalculadora(idCalculadora) {
    document.querySelectorAll('.calculadora').forEach(calc => {
        calc.classList.add('hidden');
    });
    document.querySelectorAll('.calc-item[data-calc]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(idCalculadora).classList.remove('hidden');
    document.querySelector('.calc-item[data-calc="' + idCalculadora + '"]').classList.add('active');
}

function exibirResultado(idElemento, htmlConteudo, isErro = false) {
    const el = document.getElementById(idElemento);
    el.innerHTML = htmlConteudo;
    el.style.display = 'block';
    el.className = 'resultado';
    el.classList.add(isErro ? 'erro' : 'sucesso');
    el.classList.add('fade-in');
}

function calcularVelocidadeDireta() {
    const n_motor = parseFloat(document.getElementById('direto-n-motor').value);
    const i_redutor = parseFloat(document.getElementById('direto-i-redutor').value);
    const d_rolo = parseFloat(document.getElementById('direto-d-rolo').value);
    const t_volta = parseFloat(document.getElementById('direto-t-volta').value);
    const resultadoEl = 'resultado-direto';
    if (isNaN(n_motor) || isNaN(i_redutor) || isNaN(d_rolo) || isNaN(t_volta)) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_fill_numeric') + '</p>', true);
        return;
    }
    if (i_redutor <= 0 || d_rolo <= 0 || t_volta <= 0) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_direct_positive') + '</p>', true);
        return;
    }
    const rpm_rolo = n_motor / i_redutor;
    const v_correia_m_min = (Math.PI * d_rolo * rpm_rolo) / 1000;
    const comprimento_total = (v_correia_m_min / 60) * t_volta;
    const htmlResultado = `
        <p>${i18n.t('correia.roll_rpm')} <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>${i18n.t('correia.belt_speed_label')} <strong>${v_correia_m_min.toFixed(2)} m/min</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">${i18n.t('correia.total_length')} <strong>${comprimento_total.toFixed(2)} ${i18n.t('correia.meters')}</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularVelocidadeIndireta() {
    const n_motor = parseFloat(document.getElementById('indireto-n-motor').value);
    const d_polia_motora = parseFloat(document.getElementById('indireto-d-polia-motora').value);
    const d_polia_movida = parseFloat(document.getElementById('indireto-d-polia-movida').value);
    const i_redutor = parseFloat(document.getElementById('indireto-i-redutor').value);
    const d_rolo = parseFloat(document.getElementById('indireto-d-rolo').value);
    const t_volta = parseFloat(document.getElementById('indireto-t-volta').value);
    const resultadoEl = 'resultado-indireto';
    if (isNaN(n_motor) || isNaN(d_polia_motora) || isNaN(d_polia_movida) || isNaN(i_redutor) || isNaN(d_rolo) || isNaN(t_volta)) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_fill_numeric') + '</p>', true);
        return;
    }
    if (d_polia_movida <= 0 || i_redutor <= 0 || d_rolo <= 0 || d_polia_motora <= 0 || t_volta <= 0) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_indirect_positive') + '</p>', true);
        return;
    }
    const n_entrada_redutor = n_motor * (d_polia_motora / d_polia_movida);
    const rpm_rolo = n_entrada_redutor / i_redutor;
    const v_correia_m_min = (Math.PI * d_rolo * rpm_rolo) / 1000;
    const comprimento_total = (v_correia_m_min / 60) * t_volta;
    const htmlResultado = `
        <p>${i18n.t('correia.reducer_input_rpm')} <strong>${n_entrada_redutor.toFixed(2)} RPM</strong></p>
        <p>${i18n.t('correia.roll_rpm')} <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>${i18n.t('correia.belt_speed_label')} <strong>${v_correia_m_min.toFixed(2)} m/min</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">${i18n.t('correia.total_length')} <strong>${comprimento_total.toFixed(2)} ${i18n.t('correia.meters')}</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularComprimentoBobina() {
    const d_externo = parseFloat(document.getElementById('bobina-d-externo').value);
    const d_interno = parseFloat(document.getElementById('bobina-d-interno').value);
    const e_correia = parseFloat(document.getElementById('bobina-e-correia').value);
    const resultadoEl = 'resultado-bobina';
    if (isNaN(d_externo) || isNaN(d_interno) || isNaN(e_correia)) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_fill_numeric') + '</p>', true);
        return;
    }
    if (e_correia <= 0) {
         exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_belt_thickness') + '</p>', true);
        return;
    }
     if (d_externo <= d_interno) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_logic_prefix') + '</strong> ' + i18n.t('correia.error_diameter_logic') + '</p>', true);
        return;
    }
    const numerador = Math.PI * (Math.pow(d_externo, 2) - Math.pow(d_interno, 2));
    const denominador = 4 * e_correia * 1000;
    const comprimento_metros = numerador / denominador;
    const htmlResultado = `
        <p>${i18n.t('correia.estimated_length')} <strong>${comprimento_metros.toFixed(2)} ${i18n.t('correia.meters')}</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularRedutorDireto() {
    const v_correia = parseFloat(document.getElementById('inv-direto-velocidade').value);
    const n_motor = parseFloat(document.getElementById('inv-direto-n-motor').value);
    const d_rolo = parseFloat(document.getElementById('inv-direto-d-rolo').value);
    const resultadoEl = 'resultado-inverso-direto';
    if (isNaN(v_correia) || isNaN(n_motor) || isNaN(d_rolo)) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_fill_numeric') + '</p>', true);
        return;
    }
    if (v_correia <= 0 || n_motor <= 0 || d_rolo <= 0) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_direct_positive_values') + '</p>', true);
        return;
    }
    const rpm_rolo = (v_correia * 1000) / (Math.PI * d_rolo);
    const i_redutor = n_motor / rpm_rolo;
    const htmlResultado = `
        <p>${i18n.t('correia.calculated_roll_rpm')} <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">${i18n.t('correia.theoretical_ratio')} <strong>${i_redutor.toFixed(2)} : 1</strong></p>
        <p class="aviso-pratico"><strong>${i18n.t('correia.note_theoretical')}</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularRedutorComPolias() {
    const v_correia = parseFloat(document.getElementById('inv-polias-velocidade').value);
    const n_motor = parseFloat(document.getElementById('inv-polias-n-motor').value);
    const d_polia_motora = parseFloat(document.getElementById('inv-polias-d-polia-motora').value);
    const d_polia_movida = parseFloat(document.getElementById('inv-polias-d-polia-movida').value);
    const d_rolo = parseFloat(document.getElementById('inv-polias-d-rolo').value);
    const resultadoEl = 'resultado-inverso-polias';
    if (isNaN(v_correia) || isNaN(n_motor) || isNaN(d_polia_motora) || isNaN(d_polia_movida) || isNaN(d_rolo)) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_fill_numeric') + '</p>', true);
        return;
    }
    if (v_correia <= 0 || n_motor <= 0 || d_polia_motora <= 0 || d_polia_movida <= 0 || d_rolo <= 0) {
        exibirResultado(resultadoEl, '<p><strong>' + i18n.t('correia.error_prefix') + '</strong> ' + i18n.t('correia.error_all_positive') + '</p>', true);
        return;
    }
    const rpm_rolo = (v_correia * 1000) / (Math.PI * d_rolo);
    const n_entrada_redutor = n_motor * (d_polia_motora / d_polia_movida);
    const i_redutor = n_entrada_redutor / rpm_rolo;
    const htmlResultado = `
        <p>${i18n.t('correia.calculated_roll_rpm')} <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>${i18n.t('correia.reducer_input_rpm')} <strong>${n_entrada_redutor.toFixed(2)} RPM</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">${i18n.t('correia.theoretical_ratio')} <strong>${i_redutor.toFixed(2)} : 1</strong></p>
        <p class="aviso-pratico"><strong>${i18n.t('correia.note_theoretical')}</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}
