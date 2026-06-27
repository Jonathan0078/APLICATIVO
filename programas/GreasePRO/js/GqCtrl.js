function toggleBearingSelector() {
    var card = document.getElementById('bearing-selector-card');
    if (!card) return;
    if (card.style.display === 'none') {
        card.style.display = '';
        var searchInput = document.getElementById('bearingSearch');
        populateBearingList(searchInput ? searchInput.value : '');
    } else {
        card.style.display = 'none';
    }
}

// Limite de movimento (px) para diferenciar um toque (seleção) de um arrasto (scroll)
var BEARING_TAP_THRESHOLD = 10;

function populateBearingList(searchTerm) {
    var list = document.getElementById('bearingList');
    if (!list) return;
    var term = (searchTerm || '').toLowerCase();
    list.innerHTML = '';
    var found = 0;
    for (var i = 0; i < rolamentosDB_data.length; i++) {
        var b = rolamentosDB_data[i];
        if (term === '' || b.designacao.toLowerCase().indexOf(term) !== -1 || b.tipo.toLowerCase().indexOf(term) !== -1) {
            var item = document.createElement('div');
            item.className = 'bearing-list-item';
            item.setAttribute('role', 'option');
            item.dataset.index = i;
            item.textContent = b.designacao + '  \u2022  \u00D8' + b.D + '\u00D7' + b.B + 'mm  \u2022  ' + b.tipo;

            item.addEventListener('click', function() {
                onBearingSelect(parseInt(this.dataset.index));
            });

            // Guarda onde o toque começou, sem bloquear o scroll nativo
            item.addEventListener('touchstart', function(e) {
                var touch = e.changedTouches[0];
                this._touchStartX = touch.clientX;
                this._touchStartY = touch.clientY;
            }, { passive: true });

            // Só seleciona se o dedo não se moveu (toque real, não arrasto/scroll)
            item.addEventListener('touchend', function(e) {
                var touch = e.changedTouches[0];
                var dx = Math.abs(touch.clientX - (this._touchStartX || touch.clientX));
                var dy = Math.abs(touch.clientY - (this._touchStartY || touch.clientY));
                if (dx < BEARING_TAP_THRESHOLD && dy < BEARING_TAP_THRESHOLD) {
                    e.preventDefault(); // evita o click fantasma duplicar a seleção
                    onBearingSelect(parseInt(this.dataset.index));
                }
                // se moveu mais que o limite, foi scroll: não faz nada, deixa rolar
            }, { passive: false });

            list.appendChild(item);
            found++;
        }
    }
    if (found === 0) {
        var empty = document.createElement('div');
        empty.className = 'bearing-list-empty';
        empty.textContent = t('grease.gq.no_bearings', 'Nenhum rolamento encontrado');
        list.appendChild(empty);
    }
    var label = list.previousElementSibling;
    if (label && found > 0) {
        var countSpan = label.querySelector('.result-count');
        if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.className = 'result-count';
            label.appendChild(countSpan);
        }
        countSpan.textContent = ' (' + found + ')';
    }
}

function onBearingSelect(index) {
    if (isNaN(index) || !rolamentosDB_data[index]) return;
    var b = rolamentosDB_data[index];
    document.getElementById('diametro').value = b.D;
    document.getElementById('ancho').value = b.B;
    document.getElementById('bearingSearch').value = '';
    mmaIn(b.D);
    mmaIn2(b.B);
    toggleBearingSelector();
}

function Limpiar(){
    document.getElementById("diametro").value="";
    document.getElementById("diametroIn").value="";
    document.getElementById("ancho").value="";
    document.getElementById("anchoIn").value="";
    document.getElementById("bearingSearch").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
    populateBearingList('');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { populateBearingList(''); });
} else {
    populateBearingList('');
}

function mmaIn(valNum) {
    pulg=valNum/25.4;
	document.getElementById("diametroIn").value=pulg.toFixed(4);
}

function inaMm(valNum) {
    mili=valNum*25.4;
	document.getElementById("diametro").value=mili.toFixed(4);
}

function mmaIn2(valNum) {
    pulgi=valNum/25.4;
	document.getElementById("anchoIn").value=pulgi.toFixed(4);
}

function inaMm2(valNum) {
    milil=valNum*25.4;
	document.getElementById("ancho").value=milil.toFixed(4);
}

function t(key, fallback) {
    return (typeof i18n !== 'undefined' && i18n.t) ? i18n.t(key) : fallback;
}

function ValidarC(){
	document.getElementById("diametro").value = document.getElementById("diametro").value.replace(/,/, ".");
	document.getElementById("ancho").value = document.getElementById("ancho").value.replace(/,/, ".");

	if(document.getElementById("diametro").value == "" || isNaN(document.getElementById("diametro").value)) {
		alert(t('grease.gq.err_diameter', 'Enter a valid diameter'));
		document.getElementById("diametro").value ="";
		document.getElementById("diametro").focus();
		return false;
	}
	if(document.getElementById("ancho").value == "" || isNaN(document.getElementById("ancho").value)) {
		alert(t('grease.gq.err_width', 'Enter a valid width'));
		document.getElementById("ancho").value ="";
		document.getElementById("ancho").focus();
		return false;
	}
	Calcular(); 
}

function Calcular() {   
      x = document.getElementById("diametro").value;  
	  y = document.getElementById("ancho").value; 
	  x1 = document.getElementById("diametroIn").value;  
	  y1 = document.getElementById("anchoIn").value; 
	  
      res=x*y*.005;      
      res2=res/28.35;    
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
    document.getElementById('res1-val').textContent = res.toFixed(2) + " g";
    document.getElementById('res2-val').textContent = res2.toFixed(2) + " oz";
}
