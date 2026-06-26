// Exportação para PDF e CSV
function exportarComparacaoCSV(dados) {
  const linhas = [
    i18n.t('custos.csv_headers'),
    ...dados.map(d => `${d.tipo},${d.custoTotal},${d.detalhes.replace(/,/g,';')}`)
  ];
  const csv = linhas.join('\n');
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'comparacao_custos.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportarComparacaoPDF(html) {
  const janela = window.open('', '', 'width=800,height=600');
  janela.document.write('<html><head><title>' + i18n.t('custos.title') + '</title></head><body>' + html + '</body></html>');
  janela.document.close();
  janela.print();
}
