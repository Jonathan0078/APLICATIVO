function Limpiar(){
    document.getElementById("diametro").value="";
    document.getElementById("diametroIn").value="";
    document.getElementById("ancho").value="";
    document.getElementById("anchoIn").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
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
		alert("Ingresa un número válido para el diametro");
		document.getElementById("diametro").value ="";
		document.getElementById("diametro").focus();
		return false;
	}
	if(document.getElementById("ancho").value == "" || isNaN(document.getElementById("ancho").value)) {
		alert("Ingresa un número válido para el ancho");
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