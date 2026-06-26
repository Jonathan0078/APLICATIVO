document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       TEMA (claro/escuro) — persistido em localStorage
       ===================================================== */
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    /* =====================================================
       CALCULADORA DE CARGA TÉRMICA
       ===================================================== */
    const STORAGE_KEY = 'ctp_inputs_v1';
    const inputs = Array.from(document.querySelectorAll('.calc-input'));
    const resKcal = document.getElementById('res-kcal');
    const resBtu = document.getElementById('res-btu');
    const resTr = document.getElementById('res-tr');
    const emptyState = document.getElementById('empty-state');
    const recomendacaoEl = document.getElementById('result-recomendacao');
    const btnReset = document.getElementById('btn-reset');

    // Fator de conversão kcal/h -> Btu/h (valor de referência usual: 3,968)
    const FATOR_KCAL_PARA_BTU = 3.968;

    // Capacidades comerciais comuns de aparelhos de ar-condicionado (Btu/h)
    const CAPACIDADES_COMERCIAIS = [7000, 9000, 12000, 18000, 21000, 24000, 30000, 36000, 48000, 60000];

    function capacidadeRecomendada(totalBtu) {
        if (totalBtu <= 0) return null;
        const encontrada = CAPACIDADES_COMERCIAIS.find(c => c >= totalBtu);
        return encontrada || CAPACIDADES_COMERCIAIS[CAPACIDADES_COMERCIAIS.length - 1];
    }

    function carregarValoresSalvos() {
        try {
            const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            inputs.forEach(input => {
                if (input.id && salvos[input.id] !== undefined) {
                    input.value = salvos[input.id];
                }
            });
        } catch (e) {
            console.warn('Não foi possível carregar valores salvos.', e);
        }
    }

    function salvarValores() {
        const dados = {};
        inputs.forEach(input => {
            if (input.id && input.value !== '') {
                dados[input.id] = input.value;
            }
        });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
        } catch (e) {
            console.warn('Não foi possível salvar os valores.', e);
        }
    }

    function sanitizarValor(input) {
        let valor = parseFloat(input.value);
        if (isNaN(valor)) return;
        if (valor < 0) {
            input.value = 0;
            input.classList.add('input-invalid');
            setTimeout(() => input.classList.remove('input-invalid'), 600);
        }
    }

    function calcularCargaTermica() {
        let totalKcal = 0;

        inputs.forEach(input => {
            sanitizarValor(input);
            const valor = parseFloat(input.value) || 0;
            const fator = parseFloat(input.getAttribute('data-fator')) || 0;
            totalKcal += (valor * fator);
        });

        const totalBtu = totalKcal * FATOR_KCAL_PARA_BTU;
        const totalTr = totalBtu / 12000;

        const numLocale = (typeof i18n !== 'undefined' && i18n.current === 'en') ? 'en-US' : i18n.current === 'es' ? 'es' : 'pt-BR';
        resKcal.textContent = Math.round(totalKcal).toLocaleString(numLocale);
        resBtu.innerHTML = `${Math.round(totalBtu).toLocaleString(numLocale)} <span style="font-size: 1rem;">Btu/h</span>`;
        resTr.textContent = totalTr.toFixed(2).toLocaleString(numLocale);

        // Estado vazio
        if (emptyState) {
            emptyState.hidden = totalKcal > 0;
        }

        // Recomendação de equipamento comercial mais próximo
        if (recomendacaoEl) {
            const capacidade = capacidadeRecomendada(totalBtu);
            if (capacidade) {
                recomendacaoEl.hidden = false;
                // Formatação do número adaptada ao idioma se o objeto i18n o permitir, caso contrário fallback para pt-BR
                const localeStr = (typeof i18n !== 'undefined' && i18n.current === 'en') ? 'en-US' : i18n.current === 'es' ? 'es' : 'pt-BR';
                recomendacaoEl.innerHTML = `${i18n.t('ctermica.suggested_equip')} <strong>${capacidade.toLocaleString(localeStr)} Btu/h</strong>`;
            } else {
                recomendacaoEl.hidden = true;
            }
        }

        salvarValores();
    }

    carregarValoresSalvos();
    calcularCargaTermica();

    inputs.forEach(input => {
        input.addEventListener('input', calcularCargaTermica);
        // Evita rolagem acidental da página ao usar as setas do teclado físico em foco
        input.addEventListener('wheel', () => input.blur(), { passive: true });
    });

    // Botão de reset
    if (btnReset) {
        btnReset.addEventListener('click', function () {
            const confirmar = window.confirm(i18n.t('ctermica.confirm_clear'));
            if (!confirmar) return;
            inputs.forEach(input => { input.value = ''; });
            localStorage.removeItem(STORAGE_KEY);
            calcularCargaTermica();
            inputs[0] && inputs[0].focus();
        });
    }

    /* =====================================================
       MODAL "FATORES UTILIZADOS"
       ===================================================== */
    const infoData = {
        janelas: {
            titulo: i18n.t('ctermica.mod.win_title'),
            itens: [
                [i18n.t('ctermica.sun_east_west'), i18n.t('ctermica.mod.win_1')],
                [i18n.t('ctermica.sun_se_sw'), i18n.t('ctermica.mod.win_2')],
                [i18n.t('ctermica.sun_ne_nw'), i18n.t('ctermica.mod.win_3')],
                [i18n.t('ctermica.sun_north'), i18n.t('ctermica.mod.win_4')],
                [i18n.t('ctermica.shade'), i18n.t('ctermica.mod.win_5')]
            ],
            nota: i18n.t('ctermica.mod.win_note')
        },
        construcao: {
            titulo: i18n.t('ctermica.mod.con_title'),
            itens: [
                [i18n.t('ctermica.wall_30'), i18n.t('ctermica.mod.con_1')],
                [i18n.t('ctermica.wall_15'), i18n.t('ctermica.mod.con_2')],
                [i18n.t('ctermica.roof_no_iso'), i18n.t('ctermica.mod.con_3')],
                [i18n.t('ctermica.roof_iso'), i18n.t('ctermica.mod.con_4')]
            ],
            nota: i18n.t('ctermica.mod.con_note')
        },
        internas: {
            titulo: i18n.t('ctermica.mod.int_title'),
            itens: [
                [i18n.t('ctermica.light_inc'), i18n.t('ctermica.mod.int_1')],
                [i18n.t('ctermica.light_fluor'), i18n.t('ctermica.mod.int_2')],
                [i18n.t('ctermica.equip'), i18n.t('ctermica.mod.int_3')]
            ],
            nota: i18n.t('ctermica.mod.int_note')
        },
        ocupacao: {
            titulo: i18n.t('ctermica.mod.occ_title'),
            itens: [
                [i18n.t('ctermica.people_sit'), i18n.t('ctermica.mod.occ_1')],
                [i18n.t('ctermica.work_light'), i18n.t('ctermica.mod.occ_2')],
                [i18n.t('ctermica.ventilation'), i18n.t('ctermica.mod.occ_3')]
            ],
            nota: i18n.t('ctermica.mod.occ_note')
        }
    };

    const overlay = document.getElementById('info-modal-overlay');
    const modalTitulo = document.getElementById('info-modal-titulo');
    const modalLista = document.getElementById('info-modal-lista');
    const modalNota = document.getElementById('info-modal-nota');
    const modalClose = document.getElementById('info-modal-close');

    function abrirModal(chave) {
        const dados = infoData[chave];
        if (!dados || !overlay) return;

        modalTitulo.textContent = dados.titulo;
        modalLista.innerHTML = dados.itens.map(([label, valor]) =>
            `<dt>${label}</dt><dd>${valor}</dd>`
        ).join('');
        modalNota.textContent = dados.nota;

        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        modalClose.focus();
    }

    function fecharModal() {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', () => abrirModal(btn.getAttribute('data-info')));
    });

    if (modalClose) modalClose.addEventListener('click', fecharModal);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) fecharModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });
});

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}
