function toggleBearingSelector() {
    var card = document.getElementById('bearing-selector-card');
    if (card.style.display === 'none') {
        card.style.display = '';
        populateBearingList(document.getElementById('bearingSearch').value);
    } else {
        card.style.display = 'none';
    }
}

function populateBearingList(searchTerm) {
    var list = document.getElementById('bearingList');
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
            
            // [Alteração Cirúrgica 1]: Resolve largura B ou T para exibição na lista
            var w = b.B !== undefined ? b.B : (b.T !== undefined ? b.T : '-');
            item.textContent = b.designacao + '  \u2022  \u00D8' + b.D + '\u00D7' + w + 'mm  \u2022  ' + b.tipo;
            
            item.addEventListener('click', function() {
                onBearingSelect(parseInt(this.dataset.index));
            });
            item.addEventListener('touchstart', function(e) {
                this._touchStartX = e.changedTouches[0].clientX;
                this._touchStartY = e.changedTouches[0].clientY;
                this._touchMoved = false;
            }, { passive: true });
            item.addEventListener('touchmove', function(e) {
                var t = e.changedTouches[0];
                var dx = Math.abs(t.clientX - this._touchStartX);
                var dy = Math.abs(t.clientY - this._touchStartY);
                if (dx > 10 || dy > 10) {
                    this._touchMoved = true;
                }
            }, { passive: true });
            item.addEventListener('touchend', function(e) {
                if (this._touchMoved) return; // foi scroll, não toque - ignora seleção
                e.preventDefault();
                onBearingSelect(parseInt(this.dataset.index));
            });
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

// [Alteração Cirúrgica 2]: Resolve largura B ou T no clique de preenchimento dos inputs
function onBearingSelect(index) {
    if (isNaN(index)) return;
    var b = rolamentosDB_data[index];
    var w = b.B !== undefined ? b.B : (b.T !== undefined ? b.T : '');
    document.getElementById('diametro').value = b.D;
    document.getElementById('ancho').value = w;
    document.getElementById('bearingSearch').value = '';
    mmaIn(b.D);
    mmaIn2(w);
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
