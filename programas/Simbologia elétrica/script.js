function normalizarSVG(svgStr) {
  var div = document.createElement('div');
  div.innerHTML = svgStr;
  var svg = div.querySelector('svg');
  if (svg) {
    if (!svg.getAttribute('viewBox')) {
      var MM_TO_PX = 3.543307;
      var toUser = function(v) { return (v || '').endsWith('mm') ? parseFloat(v) * MM_TO_PX : parseFloat(v); };
      var wv = toUser(svg.getAttribute('width') || '');
      var hv = toUser(svg.getAttribute('height') || '');
      if (wv && hv) svg.setAttribute('viewBox', '0 0 ' + wv + ' ' + hv);
    }
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.style.cssText = '';
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  return div.innerHTML;
}

function _t(key, fallback) {
  return typeof i18n !== 'undefined' && i18n.t ? i18n.t(key) : fallback;
}

var abaAtual = 'todos';
var itemInspecionado = null;
var favoritos = JSON.parse(localStorage.getItem('favs_iso_eletrica') || '[]');

var inputBusca = document.getElementById('input-busca');
if (inputBusca) inputBusca.addEventListener('input', renderizar);

var tabTodos = document.getElementById('tab-todos');
var tabFavs = document.getElementById('tab-favs');
if (tabTodos) tabTodos.addEventListener('click', function() { setAba('todos'); });
if (tabFavs) tabFavs.addEventListener('click', function() { setAba('favs'); });

var modalClose = document.getElementById('btn-modal-close');
if (modalClose) modalClose.addEventListener('click', function() { fecharModal(true); });

var modalBg = document.getElementById('modal');
if (modalBg) modalBg.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-bg')) fecharModal(true);
});

var btnFavModal = document.getElementById('btn-fav-modal');
if (btnFavModal) btnFavModal.addEventListener('click', alternarFavorito);

function simKey(id, campo) {
  return 'simbolos.eletrica.' + id + '.' + campo;
}

function tradSim(id, campo, fallback) {
  var lang = typeof i18n !== 'undefined' && i18n.current ? i18n.current : 'pt';
  if (lang !== 'pt') {
    var item = BD.find(function(i) { return i.id === id; });
    var langField = campo + '_' + lang;
    if (item && item[langField]) return item[langField];
  }
  return fallback;
}

function renderizar() {
  document.getElementById('count-favs').innerText = favoritos.length;
  var termo = inputBusca.value.toLowerCase();
  var filtrados = BD.filter(function(item) {
    var titulo = tradSim(item.id, 'titulo', item.titulo);
    var combina = titulo.toLowerCase().indexOf(termo) !== -1 || item.arquivo.toLowerCase().indexOf(termo) !== -1;
    if (abaAtual === 'favs') return combina && favoritos.indexOf(item.id) !== -1;
    return combina;
  });
  var grid = document.getElementById('grid');
  var estadoVazio = document.getElementById('vazio');
  if (filtrados.length === 0) {
    grid.innerHTML = '';
    estadoVazio.classList.add('visible');
  } else {
    estadoVazio.classList.remove('visible');
    grid.innerHTML = filtrados.map(function(i) {
      var fav = favoritos.indexOf(i.id) !== -1;
      var titulo = tradSim(i.id, 'titulo', i.titulo);
      return '<div class="card" data-id="' + i.id + '"><span class="fav-indicator">' + (fav ? '★' : '') + '</span><div class="canvas-box">' + normalizarSVG(i.svg) + '</div><span class="card-label">' + titulo + '</span></div>';
    }).join('');
    var cards = grid.querySelectorAll('.card');
    for (var c = 0; c < cards.length; c++) {
      (function(id) {
        cards[c].addEventListener('click', function() { inspecionar(id); });
      })(filtrados[c].id);
    }
  }
}

function setAba(alvo) {
  abaAtual = alvo;
  tabTodos.className = 'tab-btn ' + (alvo === 'todos' ? 'active' : 'inactive');
  tabFavs.className = 'tab-btn ' + (alvo === 'favs' ? 'active' : 'inactive');
  renderizar();
}

function inspecionar(id) {
  itemInspecionado = BD.find(function(i) { return i.id === id; });
  if (!itemInspecionado) return;
  document.getElementById('m-title').innerText = tradSim(id, 'titulo', itemInspecionado.titulo);
  document.getElementById('m-descricao').innerText = tradSim(id, 'descricao', itemInspecionado.descricao || _t('simbolos.fallback_desc_eletrica', 'Símbolo elétrico conforme norma IEC 60617.'));
  document.getElementById('m-funcionamento').innerText = tradSim(id, 'funcionamento', itemInspecionado.funcionamento || _t('simbolos.fallback_func', 'Consulte a documentação técnica.'));
  document.getElementById('m-svg').innerHTML = normalizarSVG(itemInspecionado.svg);
  atualizarBotaoModal();
  modalBg.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharModal(forcar) {
  if (forcar) {
    modalBg.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function atualizarBotaoModal() {
  if (!itemInspecionado) return;
  var isFav = favoritos.indexOf(itemInspecionado.id) !== -1;
  var txt = document.getElementById('btn-fav-text');
  if (isFav) {
    btnFavModal.className = 'action-btn btn-fav favourited';
    txt.innerText = _t('simbolos.remover_favorito', 'Remover Favorito');
  } else {
    btnFavModal.className = 'action-btn btn-fav';
    txt.innerText = _t('simbolos.favoritar', 'Favoritar');
  }
}

function alternarFavorito() {
  if (!itemInspecionado) return;
  var pos = favoritos.indexOf(itemInspecionado.id);
  if (pos === -1) {
    favoritos.push(itemInspecionado.id);
    dispararToast(_t('simbolos.salvo_favoritos', 'Salvo nos Favoritos'));
  } else {
    favoritos.splice(pos, 1);
    dispararToast(_t('simbolos.removido', 'Removido'));
  }
  localStorage.setItem('favs_iso_eletrica', JSON.stringify(favoritos));
  atualizarBotaoModal();
  renderizar();
}

function dispararToast(m) {
  var t = document.getElementById('toast');
  t.innerHTML = '<i class="fa-solid fa-check"></i> ' + m;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.remove('show'); }, 2000);
}

var themeToggle = document.getElementById('theme-toggle-checkbox');
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  if (themeToggle) themeToggle.checked = true;
}
if (themeToggle) {
  themeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
}

function atualizarTotal() {
  var el = document.getElementById('symbol-count');
  if (el && typeof i18n !== 'undefined' && i18n.t) {
    el.innerText = i18n.t('simbolos.total').replace('{n}', BD.length);
  }
}

function aplicarTraducoes() {
  if (typeof i18n !== 'undefined' && i18n.translatePage) {
    i18n.translatePage();
  }
  if (typeof i18n !== 'undefined' && i18n.t) {
    tabTodos.textContent = i18n.t('simbolos.todos');
    tabFavs.childNodes[0].textContent = i18n.t('simbolos.favoritos');
    if (itemInspecionado) atualizarBotaoModal();
    atualizarTotal();
    renderizar();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  aplicarTraducoes();
  renderizar();
});
