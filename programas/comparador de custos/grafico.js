function plotarGraficoEconomia(ctx, dados) {
  const style = getComputedStyle(document.body);
  const primaryColor = style.getPropertyValue('--primary-color').trim() || '#2563eb';
  const errorColor = style.getPropertyValue('--error-color').trim() || '#ef4444';
  const successColor = style.getPropertyValue('--success-color').trim() || '#10b981';
  const textColor = style.getPropertyValue('--text-color').trim() || '#1e293b';
  const gridColor = style.getPropertyValue('--border-color').trim() || '#e2e8f0';

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dados.anos,
      datasets: [
        {
          label: i18n.t('custos.chart_corretiva'),
          data: dados.corretiva,
          backgroundColor: errorColor + '99',
          borderColor: errorColor,
          borderWidth: 1
        },
        {
          label: i18n.t('custos.chart_preventiva'),
          data: dados.preventiva,
          backgroundColor: successColor + '99',
          borderColor: successColor,
          borderWidth: 1
        },
        {
          label: i18n.t('custos.chart_economia'),
          data: dados.economia,
          backgroundColor: primaryColor + '88',
          borderColor: primaryColor,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { family: "'Inter', sans-serif" } }
        },
        title: {
          display: true,
          text: i18n.t('custos.chart_title'),
          color: textColor,
          font: { family: "'Inter', sans-serif", size: 16, weight: '600' }
        }
      },
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            text: i18n.t('custos.chart_year'),
            color: textColor,
            font: { family: "'Inter', sans-serif" }
          },
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          stacked: false,
          title: {
            display: true,
            text: i18n.t('custos.chart_value'),
            color: textColor,
            font: { family: "'Inter', sans-serif" }
          },
          beginAtZero: true,
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      }
    }
  });
}
