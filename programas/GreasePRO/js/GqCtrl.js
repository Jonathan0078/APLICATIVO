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
    var select = document.getElementById('bearingSelect');
    var term = (searchTerm || '').toLowerCase();
    select.innerHTML = '';
    var found = 0;
    for (var i = 0; i < rolamentosDB_data.length; i++) {
        var b = rolamentosDB_data[i];
        if (term === '' || b.designacao.toLowerCase().indexOf(term) !== -1 || b.tipo.toLowerCase().indexOf(term) !== -1) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.textContent = b.designacao + ' — Ø' + b.D + 'mm × ' + b.B + 'mm (' + b.tipo + ')';
            select.appendChild(opt);
            found++;
        }
    }
    if (found === 0) {
        var opt = document.createElement('option');
        opt.value = '';
        opt.disabled = true;
        opt.textContent = i18n.t('grease.gq.no_bearings') || 'Nenhum rolamento encontrado';
        select.appendChild(opt);
    }
}

function onBearingSelect() {
    var idx = document.getElementById('bearingSelect').value;
    if (idx === '') return;
    var b = rolamentosDB_data[parseInt(idx)];
    document.getElementById('diametro').value = b.D;
    document.getElementById('ancho').value = b.B;
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

function ValidarC(){
	document.getElementById("diametro").value = document.getElementById("diametro").value.replace(/,/, ".");
	document.getElementById("ancho").value = document.getElementById("ancho").value.replace(/,/, ".");

	if(document.getElementById("diametro").value == "" || isNaN(document.getElementById("diametro").value)) {
		alert(i18n.t('grease.gq.err_diameter'));
		document.getElementById("diametro").value ="";
		document.getElementById("diametro").focus();
		return false;
	}
	if(document.getElementById("ancho").value == "" || isNaN(document.getElementById("ancho").value)) {
		alert(i18n.t('grease.gq.err_width'));
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