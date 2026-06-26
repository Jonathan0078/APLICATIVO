document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
  }
  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });

  const campos = ['custo-parada','custo-pecas','custo-mao-obra','falhas-ano','intervalo-prev','custo-prev','inflacao'];
  campos.forEach(id => {
    document.getElementById(id).addEventListener('input', atualizarGraficoEmTempoReal);
  });

  function atualizarGraficoEmTempoReal() {
    const custoParada = parseFloat(document.getElementById('custo-parada').value);
    const custoPecas = parseFloat(document.getElementById('custo-pecas').value);
    const custoMaoObra = parseFloat(document.getElementById('custo-mao-obra').value);
    const falhasAno = parseFloat(document.getElementById('falhas-ano').value);
    const intervaloPrev = parseFloat(document.getElementById('intervalo-prev').value);
    const custoPrev = parseFloat(document.getElementById('custo-prev').value);
    const inflacao = parseFloat(document.getElementById('inflacao').value) || 0;
    if ([custoParada, custoPecas, custoMaoObra, falhasAno, custoPrev].some(isNaN) || intervaloPrev <= 0 || isNaN(intervaloPrev)) {
      if (window.graficoCustosInstance) window.graficoCustosInstance.destroy();
      document.getElementById('tabelaCustos').innerHTML = '';
      return;
    }
    const custoCorretiva = (custoParada + custoPecas + custoMaoObra) * falhasAno;
    const manutPrevAno = 12 / intervaloPrev;
    const custoPreventiva = manutPrevAno * custoPrev;
    let anos = [], corretivaArr = [], preventivaArr = [], economiaArr = [], cCor = custoCorretiva, cPrev = custoPreventiva;
    for (let i = 1; i <= 10; i++) {
      anos.push(i);
      corretivaArr.push(Math.round(cCor));
      preventivaArr.push(Math.round(cPrev));
      economiaArr.push(Math.round(cCor - cPrev));
      cCor = aplicarInflacao(cCor, inflacao, 1);
      cPrev = aplicarInflacao(cPrev, inflacao, 1);
    }
    if (window.graficoCustosInstance) window.graficoCustosInstance.destroy();
    const ctx = document.getElementById('graficoCustos').getContext('2d');
    window.graficoCustosInstance = plotarGraficoEconomia(ctx, {anos, corretiva: corretivaArr, preventiva: preventivaArr, economia: economiaArr});
    atualizarTabelaCustos(anos, corretivaArr, preventivaArr, economiaArr);
  }

  function atualizarTabelaCustos(anos, corretivaArr, preventivaArr, economiaArr) {
    const locale = i18n.current === 'pt' ? 'pt-BR' : i18n.current === 'es' ? 'es' : 'en';
    let html = '<table>';
    html += '<thead><tr><th>' + i18n.t('custos.table_year') + '</th><th>' + i18n.t('custos.table_corretiva') + '</th><th>' + i18n.t('custos.table_preventiva') + '</th><th>' + i18n.t('custos.table_economia') + '</th></tr></thead><tbody>';
    for (let i = 0; i < anos.length; i++) {
      html += '<tr><td>' + anos[i] + '</td><td>' + corretivaArr[i].toLocaleString(locale) + '</td><td>' + preventivaArr[i].toLocaleString(locale) + '</td><td>' + economiaArr[i].toLocaleString(locale) + '</td></tr>';
    }
    html += '</tbody></table>';
    document.getElementById('tabelaCustos').innerHTML = html;
  }

  document.getElementById('form-custos').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('resultado-container').classList.add('hidden');

    const custoParada = parseFloat(document.getElementById('custo-parada').value);
    const custoPecas = parseFloat(document.getElementById('custo-pecas').value);
    const custoMaoObra = parseFloat(document.getElementById('custo-mao-obra').value);
    const falhasAno = parseFloat(document.getElementById('falhas-ano').value);
    const intervaloPrev = parseFloat(document.getElementById('intervalo-prev').value);
    const custoPrev = parseFloat(document.getElementById('custo-prev').value);
    const inflacao = parseFloat(document.getElementById('inflacao').value) || 0;

    if ([custoParada, custoPecas, custoMaoObra, falhasAno, custoPrev].some(isNaN) || intervaloPrev <= 0 || isNaN(intervaloPrev)) {
      document.getElementById('resultado').innerHTML = '<span class="error-message">' + i18n.t('custos.error_invalid') + '</span>';
      document.getElementById('resultado-container').classList.remove('hidden');
      if (window.graficoCustosInstance) window.graficoCustosInstance.destroy();
      return;
    }

    const custoCorretiva = (custoParada + custoPecas + custoMaoObra) * falhasAno;
    const manutPrevAno = 12 / intervaloPrev;
    const custoPreventiva = manutPrevAno * custoPrev;

    let anos = [], corretivaArr = [], preventivaArr = [], economiaArr = [];
    let cCor = custoCorretiva, cPrev = custoPreventiva;
    for (let i = 1; i <= 10; i++) {
      anos.push(i);
      corretivaArr.push(Math.round(cCor));
      preventivaArr.push(Math.round(cPrev));
      economiaArr.push(Math.round(cCor - cPrev));
      cCor = aplicarInflacao(cCor, inflacao, 1);
      cPrev = aplicarInflacao(cPrev, inflacao, 1);
    }

    let economia = custoCorretiva - custoPreventiva;
    const locale = i18n.current === 'pt' ? 'pt-BR' : i18n.current === 'es' ? 'es' : 'en';
    let msg = '<strong>' + i18n.t('custos.result_corretiva') + '</strong> R$ ' + custoCorretiva.toLocaleString(locale, {minimumFractionDigits: 2}) + '<br>';
    msg += '<strong>' + i18n.t('custos.result_preventiva') + '</strong> R$ ' + custoPreventiva.toLocaleString(locale, {minimumFractionDigits: 2}) + '<br>';

    if (custoCorretiva > custoPreventiva) {
      msg += '<span class="success-message">' + i18n.t('custos.result_preventive_wins') + '<br>' + i18n.t('custos.result_savings') + ' <b>R$ ' + economia.toLocaleString(locale, {minimumFractionDigits: 2}) + '</b></span>';
    } else if (custoCorretiva < custoPreventiva) {
      msg += '<span class="error-message">' + i18n.t('custos.result_corrective_wins') + '<br>' + i18n.t('custos.result_loss') + ' <b>R$ ' + Math.abs(economia).toLocaleString(locale, {minimumFractionDigits: 2}) + '</b></span>';
    } else {
      msg += '<span class="success-message">' + i18n.t('custos.result_equal') + '</span>';
    }
    msg += '<br><small>' + i18n.t('custos.result_note') + '</small>';
    document.getElementById('resultado').innerHTML = msg;
    document.getElementById('resultado-container').classList.remove('hidden');

    if (window.graficoCustosInstance) window.graficoCustosInstance.destroy();
    const ctx = document.getElementById('graficoCustos').getContext('2d');
    window.graficoCustosInstance = plotarGraficoEconomia(ctx, {anos, corretiva: corretivaArr, preventiva: preventivaArr, economia: economiaArr});
    atualizarTabelaCustos(anos, corretivaArr, preventivaArr, economiaArr);

    salvarComparacaoHistorico({
      data: new Date().toLocaleString(locale),
      corretiva: custoCorretiva,
      preventiva: custoPreventiva,
      inflacao,
      economia,
      entrada: { custoParada, custoPecas, custoMaoObra, falhasAno, intervaloPrev, custoPrev }
    });
    atualizarHistoricoComparador();
  });
});

function atualizarHistoricoComparador() {
  const historico = obterHistoricoComparador();
  const ul = document.getElementById('historico-list');
  if (!ul) return;
  ul.innerHTML = '';
  const locale = i18n.current === 'pt' ? 'pt-BR' : i18n.current === 'es' ? 'es' : 'en';
  historico.slice(-10).reverse().forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = '<b>' + item.data + '</b>: ' + i18n.t('custos.history_corretiva') + ' R$ ' + item.corretiva.toLocaleString(locale) + ', ' + i18n.t('custos.history_preventiva') + ' R$ ' + item.preventiva.toLocaleString(locale) + ', ' + i18n.t('custos.inflation').replace(' (%)', '') + ' ' + item.inflacao + '%<br>' + i18n.t('custos.history_economia') + ' <b>R$ ' + item.economia.toLocaleString(locale) + '</b>';
    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('limpar-historico-btn').onclick = function() {
    if (confirm(i18n.t('custos.confirm_clear'))) {
      limparHistoricoComparador();
      atualizarHistoricoComparador();
    }
  };
  document.getElementById('historico-container').style.display = 'block';
  atualizarHistoricoComparador();

  document.getElementById('exportar-csv').addEventListener('click', function() {
    const dados = [
      {
        tipo: i18n.t('custos.chart_corretiva'),
        custoTotal: (parseFloat(document.getElementById('custo-parada').value) + parseFloat(document.getElementById('custo-pecas').value) + parseFloat(document.getElementById('custo-mao-obra').value)) * parseFloat(document.getElementById('falhas-ano').value),
        detalhes: i18n.t('custos.csv_downtime') + ': R$' + document.getElementById('custo-parada').value + ', ' + i18n.t('custos.csv_parts') + ': R$' + document.getElementById('custo-pecas').value + ', ' + i18n.t('custos.csv_labor') + ': R$' + document.getElementById('custo-mao-obra').value + ', ' + i18n.t('custos.csv_failures') + ': ' + document.getElementById('falhas-ano').value
      },
      {
        tipo: i18n.t('custos.chart_preventiva'),
        custoTotal: (12 / parseFloat(document.getElementById('intervalo-prev').value)) * parseFloat(document.getElementById('custo-prev').value),
        detalhes: i18n.t('custos.csv_interval') + ': ' + document.getElementById('intervalo-prev').value + ' ' + i18n.t('custos.csv_months') + ', ' + i18n.t('custos.csv_prev_cost') + ': R$' + document.getElementById('custo-prev').value
      }
    ];
    exportarComparacaoCSV(dados);
  });

  document.getElementById('exportar-pdf').addEventListener('click', function() {
    const conteudo = document.getElementById('resultado-container').innerHTML;
    const style = '<style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #ccc;text-align:center;}th{background:#2563eb;color:#fff;}h2{color:#2563eb;}.success-message{color:#10b981;}.error-message{color:#ef4444;}</style>';
    exportarComparacaoPDF('<h1>' + i18n.t('custos.title') + '</h1>' + style + conteudo);
  });
});
