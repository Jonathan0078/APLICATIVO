function limpiarC(){
	document.getElementById("ace1").value ="";
	document.getElementById("ace2").value ="";
	document.getElementById("porc").value ="";
	document.getElementById("vis1").value ="";
	document.getElementById("vis2").value ="";
	document.getElementById("visd").value ="";
	document.getElementById("result").value ="";
	document.getElementById("result1").value ="";
	document.getElementById("result2").value ="";
	
}


function mostrarT(){
	var valor = document.getElementById("calculadora").value;
	if(valor==1){
		mostrarTabla1();
	}
	if(valor==2){
		mostrarTabla2();
	}
}
function mostrarTabla1(){
	document.getElementById('tabla1').style.display='block';
	document.getElementById('tabla2').style.display='none';
	document.getElementById('tabbody1').style.display='block';
	document.getElementById('tabbody2').style.display='none';

}
function mostrarTabla2(){
	document.getElementById('tabla2').style.display='block';
	document.getElementById('tabla1').style.display='none';
	document.getElementById('tabbody2').style.display='block';
	document.getElementById('tabbody1').style.display='none';

}
function validar1v(){

	document.getElementById("ace1").value = document.getElementById("ace1").value.replace(/,/, ".");
	document.getElementById("ace2").value = document.getElementById("ace2").value.replace(/,/, ".");
	document.getElementById("porc").value = document.getElementById("porc").value.replace(/,/, ".");

	if(document.getElementById("ace1").value == "" || isNaN(document.getElementById("ace1").value)) {
		alert("Ingresa un número válido para >Aceite #1");
		document.getElementById("ace1").value ="";
		document.getElementById("ace1").focus();
		return false;
	}
	if(document.getElementById("ace2").value == "" || isNaN(document.getElementById("ace2").value)) {
		alert("Ingresa un número válido para >Aceite #2");
		document.getElementById("ace2").value ="";
		document.getElementById("ace2").focus();
		return false;
	}
	if(document.getElementById("porc").value == "" || isNaN(document.getElementById("porc").value)) {
		alert("Ingresa un número válido para >Porcentaje de aceite 1");
		document.getElementById("porc").value ="";
		document.getElementById("porc").focus();
		return false;
	}
	
	Calcular(); 	
}

function Calcular(){
	kv1 = document.getElementById("ace1").value;
	kv2 = document.getElementById("ace2").value;
	x1 = document.getElementById("porc").value/100;
	// k = document.getElementById("temp").value; 
	
	res=(100*(Math.exp(Math.log(kv2)*Math.exp(x1*Math.log(Math.log(kv1)/Math.log(kv2))))))/100;	
	document.getElementById("result").value = res.toFixed(3)+"cSt";
}

function validar2v(){

	document.getElementById("vis1").value = document.getElementById("vis1").value.replace(/,/, ".");
	document.getElementById("vis2").value = document.getElementById("vis2").value.replace(/,/, ".");
	document.getElementById("visd").value = document.getElementById("visd").value.replace(/,/, ".");

	if(document.getElementById("vis1").value == "" || isNaN(document.getElementById("vis1").value)) {
		alert("Ingresa un número válido para > Viscocidad de Aceite #1");
		document.getElementById("vis1").value ="";
		document.getElementById("vis1").focus();
		return false;
	}
	if(document.getElementById("vis2").value == "" || isNaN(document.getElementById("vis2").value)) {
		alert("Ingresa un número válido para > Viscodidad de Aceite #2");
		document.getElementById("vis2").value ="";
		document.getElementById("vis2").focus();
		return false;
	}
	if(document.getElementById("visd").value == "" || isNaN(document.getElementById("visd").value)) {
		alert("Ingresa un número válido para > Viscosidad deseada");
		document.getElementById("visd").value ="";
		document.getElementById("visd").focus();
		return false;
	}
	
	Calcular2();
}

function Calcular2(){
	
	vis1 = document.getElementById("vis1").value;
	vis2 = document.getElementById("vis2").value;
	visd = document.getElementById("visd").value;
	temp2 =4.1; 
	a=Math.log(visd+temp2);
	b=Math.log(vis1+temp2);
	c=Math.log(vis2+temp2);
	res1=(10000*(Math.log(a/c)/Math.log(b/c)))/100;
	res2=100-(res1);
	document.getElementById("result1").value =res1.toFixed(4)+" %";
	document.getElementById("result2").value =res2.toFixed(4)+" %";
}




