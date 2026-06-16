function Limpiar(){

  document.getElementById("diametro").value="";
  document.getElementById("diametroIn").value="";
  document.getElementById("espesor").value="";
  document.getElementById("espesorIn").value="";
  document.getElementById("longitud").value="";
  document.getElementById("longitudIn").value="";
  document.getElementById("res1").value="";
  document.getElementById("res2").value="";
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
document.getElementById("espesorIn").value=pulgi.toFixed(4);
}
function inaMm2(valNum) {
  milil=valNum*25.4;
document.getElementById("espesor").value=milil.toFixed(4);
}
function mmaIn3(valNum) {
  pulgi=valNum/25.4;
document.getElementById("longitudIn").value=pulgi.toFixed(4);
}
function inaMm3(valNum) {
  milil=valNum*25.4;
document.getElementById("longitud").value=milil.toFixed(4);
}

function ValidarDatos(){

	// document.getElementById("diametro").value = document.getElementById("diametro").value.replace(/,/, ".");
	// document.getElementById("espesor").value = document.getElementById("espesor").value.replace(/,/, ".");
  // document.getElementById("logitud").value = document.getElementById("longitud").value.replace(/,/, ".");
	

	// if(document.getElementById("diametro").value == "" || isNaN(document.getElementById("diametro").value)) {
	// 	alert("Ingresa un número válido para el diametro");
	// 	document.getElementById("diametro").value ="";
	// 	document.getElementById("diametro").focus();
	// 	return false;
	// }
	// if(document.getElementById("espesor").value == "" || isNaN(document.getElementById("espesor").value)) {
	// 	alert("Ingresa un número válido para el espesor");
	// 	document.getElementById("espesor").value ="";
	// 	document.getElementById("espesor").focus();
	// 	return false;
	// }
  // if(document.getElementById("longitud").value == "" || isNaN(document.getElementById("longitud").value)) {
	// 	alert("Ingresa un número válido para la longitud");
	// 	document.getElementById("longitud").value ="";
	// 	document.getElementById("longitud").focus();
	// 	return false;
	// }
	Calcular(); 
}

function Calcular(){
         //declaracion de valores 
         long = document.getElementById("longitudIn").value; 
         diam = document.getElementById("diametroIn").value; 
         espe = document.getElementById("espesorIn").value; 
        //operaciones
          area=long*Math.PI*diam;
          volumen=(area*espe)/1.805;          ;
          volumenIn=volumen*28.35;
  
          // cambiar a onzas 0.5, los 2 poner los 2 valores. gramos agregar conversión
  
          document.getElementById("res1").value = volumen.toFixed(4);
          document.getElementById("res2").value = volumenIn.toFixed(4);
}