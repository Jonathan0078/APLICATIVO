function limpiarC(){
	document.getElementById("vis40c").value ="";
	document.getElementById("vis100c").value ="";
	document.getElementById("inVi").value ="";
	document.getElementById("inVis").value ="";
	document.getElementById("visc40c").value ="";
	document.getElementById("visc100c").value ="";
	document.getElementById("inVisc").value ="";
	document.getElementById("visco100c").value ="";
	document.getElementById("visco40c").value ="";
	
}
function validarC(){
	var valor = document.getElementById("calculadora").value;
	if(valor==1){
		mostrarTabla1();
	}
	if(valor==2){
		mostrarTabla2();
	}
	if(valor==3){
		mostrarTabla3();
	}
}
function mostrarTabla1(){
	document.getElementById('tabla1').style.display='block'
	document.getElementById('tabla2').style.display='none'
	document.getElementById('tabla3').style.display='none'
	document.getElementById('tabbody1').style.display='block';
	document.getElementById('tabbody2').style.display='none';
	document.getElementById('tabbody3').style.display='none';
}
function mostrarTabla2(){
	document.getElementById('tabla2').style.display='block'
	document.getElementById('tabla1').style.display='none'
	document.getElementById('tabla3').style.display='none'
	document.getElementById('tabbody2').style.display='block';
	document.getElementById('tabbody1').style.display='none';
	document.getElementById('tabbody3').style.display='none';
}
function mostrarTabla3(){
	document.getElementById('tabla3').style.display='block'
	document.getElementById('tabla1').style.display='none'
	document.getElementById('tabla2').style.display='none'
	document.getElementById('tabbody3').style.display='block';
	document.getElementById('tabbody1').style.display='none';
	document.getElementById('tabbody2').style.display='none';
}
function celsiusFarenheit(valNum) {
	document.getElementById("vis104f").value=valNum*(9/5)+32;
  }
  function farenheitCelsius(valNum) {
	document.getElementById("vis40c").value=(valNum-32)*(5/9);
  }
  
  function celsiusFarenheit1(valNum) {
	document.getElementById("vis212f").value=valNum*(9/5)+32;
  }
  function farenheitCelsius1(valNum) {
	document.getElementById("vis100c").value=(valNum-32)*(5/9);
  }

function calculaIV(Q1,Q2) {
     var Q3,Q4,Q5,Q6,Q7;

     
        if ( Q2 >= 2 && Q2 < 4){
           Q3 = 0.827 * Math.pow(Q2,2) + 1.632 * Q2 - 0.181;
           Q4 = 0.3094 * Math.pow(Q2,2) + 0.182 * Q2;
           Q6 = (Q3 + Q4 - Q1) / Q4 * 100;
           }
           
        if ( Q2 >= 4 && Q2 < 6.1){
           Q3 = -2.6758 * Math.pow(Q2,2) + 96.671 * Q2 - 269.664 * Math.sqrt(Q2) + 215.025;
           Q4 = -7.1955 * Math.pow(Q2,2) + 241.992 * Q2 - 725.478 * Math.sqrt(Q2) + 603.88;
           Q6 = (Q3 + Q4 - Q1) / Q4 * 100;           
           }
    
        if ( Q2 >= 6.1 && Q2 < 7.2){
           Q3 = 2.32 * Math.pow(Q2,1.5626);
           Q4 = 2.838 * Math.pow(Q2,2) - 27.35 * Q2 + 81.83;
           Q6 = (Q3 + Q4 - Q1) / Q4 * 100;
           }
           
        if ( Q2 >= 7.2 && Q2 < 12.4){
           Q3 = 0.1922 * Math.pow(Q2,2) + 8.25 * Q2 - 18.728;
           Q4 = 0.5463 * Math.pow(Q2,2) + 2.442 * Q2 - 14.16;
           Q6 = (Q3 + Q4 - Q1) / Q4 * 100;
           }     
           
        if ( Q2 >= 12.4 && Q2 <= 70){
           Q3 = 1795.2 * Math.pow(Q2,(-2)) + 0.1818 * Math.pow(Q2,2) + 10.357 * Q2 - 54.547;
           Q4 = 0.6995 * Math.pow(Q2,2) - 1.19 * Q2 + 7.6;
           Q6 = (Q3 + Q4 - Q1) / Q4 * 100;
           }  
                     
        if ( Q2 > 70){
           Q3 = 0.1684 * Math.pow(Q2,2) + 11.85 * Q2 -97;
           Q5 = 0.8353 * Math.pow(Q2,2) + 14.67 * Q2 -216;
           Q4 = 0.6669 * Math.pow(Q2,2) + 2.82 * Q2 -119;
           Q6 =(Q5 - Q1) / Q4 * 100;
           }
     
    
    
   		 if (Q6 >= 100) {
        
       		 Q7 = ((Math.log(Q3) / Math.log(10)) - (Math.log(Q1) / Math.log (10))) / ( Math.log(Q2)/ Math.log(10)); 
        	 Q6 = (( Math.pow(10,Q7)-1) / 0.00715 ) + 100;
        
    }   

    Q6 = parseInt(Q6 + 0.5);   
    
    return Q6;
} 


function validarIV() {
	document.getElementById("vis40c").value = document.getElementById("vis40c").value.replace(/,/, ".");
	document.getElementById("vis100c").value = document.getElementById("vis100c").value.replace(/,/, ".");

	document.getElementById("inVi").value = document.getElementById("inVi").value.replace(/,/, ".");

	if(document.getElementById("vis40c").value == "" || isNaN(document.getElementById("vis40c").value)) {
		alert("Ingresa un número válido para Viscosidad cSt (mm²/s) a 40°C/104°F");
		document.getElementById("vis40c").value ="";
		document.getElementById("vis40c").focus();
		return false;
	}
	if(document.getElementById("vis100c").value == "" || isNaN(document.getElementById("vis100c").value)) {
		alert("Ingresa un número válido para Viscosidad cSt (mm²/s) a 100°C/212°F");
		document.getElementById("vis100c").value ="";
		document.getElementById("vis100c").focus();
		return false;
	}
	if(parseFloat(document.getElementById("vis40c").value) < 2) {
		alert("Ingresa un número superior a 2 para Viscosidad cSt (mm²/s) a 40°C/104°F");
		document.getElementById("vis40c").value ="";
		document.getElementById("vis40c").focus();
		return false;
	}
	if(parseFloat(document.getElementById("vis100c").value) < 2) {
		alert("Ingresa un número superior a 2 para Viscosidad cSt (mm²/s) a 100°C/212°F");
		document.getElementById("vis100c").value ="";
		document.getElementById("vis100c").focus();
		return false;
	}
	if(parseFloat(document.getElementById("vis40c").value) <= parseFloat(document.getElementById("vis100c").value)) {
		alert("Viscosidad cSt (mm²/s) a 40°C/104°F debe ser mayor a Viscosidad cSt (mm²/s) a 100°C/212°F");
		document.getElementById("vis40c").value = "";
		document.getElementById("vis100c").value = "";
		document.getElementById("vis40c").focus();
		return false;
	}
	var kv100 = parseFloat(document.getElementById("vis100c").value);
	var kv40 = parseFloat(document.getElementById("vis40c").value);
	var result = calculaIV(kv40, kv100);


	document.getElementById("inVi").value = result;
}

function celsiusFarenheit2(valNum) {
	document.getElementById("visc104f").value=valNum*(9/5)+32;
}
function farenheitCelsius2(valNum) {
	document.getElementById("visc40c").value=(valNum-32)*(5/9);
}

function calcula100(vindex,kv40) {
      var Vi;
      var n = 2;
      do {
         Vi = calculaIV(kv40,n); 
         n = n + 0.01;
         } while ( Vi <= vindex && n <= 500.00);
         n = parseInt(n * 100 + 0.01) / 100;
      return n;

}  

function validar100() {
	document.getElementById("inVis").value = document.getElementById("inVis").value.replace(/,/, ".");
	document.getElementById("visc40c").value = document.getElementById("visc40c").value.replace(/,/, ".");

	if(document.getElementById("inVis").value == "" || isNaN(document.getElementById("inVis").value)) {
		alert("Ingresa un número válido para Índice de Viscosidad");
		document.getElementById("inVis").value = "";
		document.getElementById("inVis").focus();
		return false;
	}
	if(document.getElementById("visc40c").value == "" || isNaN(document.getElementById("visc40c").value)) {
		alert("Ingresa un número válido para Viscosidad cSt (mm²/s) a 100°C/212°F");
		document.getElementById("visc40c").value = "";
		document.getElementById("visc40c").focus();
		return false;
	}

	if(parseFloat(document.getElementById("visc40c").value) < 2) {
		alert("Ingresa un número superior a 2 para Viscosidad cSt (mm²/s) a 40°C/104°F");
		document.getElementById("visc40c").value = "";
		document.getElementById("visc40c").focus();
		return false;
	}
	var vi = parseFloat(document.getElementById("inVis").value);
	var kv40 = parseFloat(document.getElementById("visc40c").value);
	var result = calcula100(vi, kv40);

	if(500 < result || result < 2) {
		alert("Cálculo no valido");
	}
	else {
	document.getElementById("visc100c").value = result;
	document.getElementById("visc212f").value = result*(9/5)+32;
	}
}


function celsiusFarenheit3(valNum) {
	document.getElementById("visco104f").value=valNum*(9/5)+32;
}
function farenheitCelsius3(valNum) {
	document.getElementById("visco100c").value=(valNum-32)*(5/9);
}

function calcula40(vindex,kv100) {
     var Vi,b;
     var n = kv100;
     do {
        Vi = calculaIV(n , kv100); 
        n = n + 0.05;
  
        } while ( Vi >= vindex && n <= 2000);
        n = parseInt(n * 100 + 0.1) / 100
     return n;
} 

function validar40() {
	document.getElementById("inVisc").value = document.getElementById("inVisc").value.replace(/,/, ".");
	document.getElementById("visco100c").value = document.getElementById("visco100c").value.replace(/,/, ".");

	if(document.getElementById("inVisc").value == "" || isNaN(document.getElementById("inVisc").value)) {
		alert("Ingresa un número válido para Índice de Viscosidad");
		document.getElementById("inVisc").value = "";
		document.getElementById("inVisc").focus();
		return false;
	}
	if(document.getElementById("visco100c").value == "" || isNaN(document.getElementById("visco100c").value)) {
		alert("Ingresa un número válido para Viscosidad cSt (mm²/s) a 100°C/212°F");
		document.getElementById("visco100c").value = "";
		document.getElementById("visco100c").focus();
		return false;
	}

	if(parseFloat(document.getElementById("visco100c").value) < 2) {
		alert("Ingresa un número superior a 2 Viscosidad cSt (mm²/s) a 100°C/212°F");
		document.getElementById("visco100c").value = "";
		document.getElementById("visco100c").focus();
		return false;
	}
	var vi = parseFloat(document.getElementById("inVisc").value);
	var kv100 = parseFloat(document.getElementById("visco100c").value);
	var result = calcula40(vi, kv100);

	if(result < kv100 || result < 2 || result > 2000) {
		alert("¡Estás fuera del rango útil de la ecuación!");
	}
	else {
    
    if(result - parseInt(result) == 0) {
		document.getElementById("visco40c").value = result + ".0";
		document.getElementById("visc212f").value = result*(9/5)+32
	}
	else {
		document.getElementById("visco40c").value = result;
		document.getElementById("visco212f").value = result*(9/5)+32
	}
    }
}