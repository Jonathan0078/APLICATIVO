function validar1v(){

	document.getElementById("deje").value = document.getElementById("deje").value.replace(/,/, ".");
	document.getElementById("dcoj").value = document.getElementById("dcoj").value.replace(/,/, ".");
  document.getElementById("carga").value = document.getElementById("carga").value.replace(/,/, ".");
  document.getElementById("largo").value = document.getElementById("largo").value.replace(/,/, ".");
  document.getElementById("rpm").value = document.getElementById("rpm").value.replace(/,/, ".");
  
  if(document.getElementById("deje").value == "" || isNaN(document.getElementById("deje").value)) {
		alert("Ingresa un número válido para el diametro del eje");
		document.getElementById("deje").value ="";
		document.getElementById("deje").focus();
		return false;
	}
	if(document.getElementById("dcoj").value == "" || isNaN(document.getElementById("dcoj").value)) {
		alert("Ingresa un número válido para el diámetro del cojinete");
		document.getElementById("dcoj").value ="";
		document.getElementById("dcoj").focus();
		return false;
	}
	if(document.getElementById("carga").value == "" || isNaN(document.getElementById("carga").value)) {
		alert("Ingresa un número válido para la carga constante");
		document.getElementById("carga").value ="";
		document.getElementById("carga").focus();
		return false;
  }
  if(document.getElementById("largo").value == "" || isNaN(document.getElementById("largo").value)) {
		alert("Ingresa un número válido para el largo del cojinete");
		document.getElementById("largo").value ="";
		document.getElementById("largo").focus();
		return false;
  }
  if(document.getElementById("rpm").value == "" || isNaN(document.getElementById("rpm").value)) {
		alert("Ingresa un número válido para la velocidad de rotación(RPM)	");
		document.getElementById("rpm").value ="";
		document.getElementById("rpm").focus();
		return false;
	}
	
	RealLove(); 	
}

function RealLove(){

  ft = document.getElementById("trabajo").value; 
  d = document.getElementById("deje").value;  
  dcoj = document.getElementById("dcoj").value; 
  w = document.getElementById("carga").value; 
  l = document.getElementById("largo").value;  
  n = document.getElementById("rpm").value; 
  
  //operaciones calcular m
  m = 1000* ((dcoj-d)/d); 
if (ft==1){
  //resultao='trabajo galones x min';
  //resultao=m*5;
  d2=Math.pow(d , 2);
  fn=m*d2; 
  en=.0043*(w/d);
  su=l+en;
  mu=.000000001*su*fn*n;
  result=29.3*mu;
  //resultao= 29.3*(.000000001*(l+(.0043(w/d))))*(m*(Math.pow(d , 2))*n);
  document.getElementById("resultado").value = result.toFixed(4)+" Galones por minuto";
}

else if(ft==2){
  //resultao='trabajo gotas x min';
  //resultao=m*n;
  d2=Math.pow(d , 2);
  fn=m*d2; 
  en=.0043*(w/d);
  su=l+en;
  mu=.001*(su*fn*n);
  result=3.32*mu;
 // resultao= 3.2*(.001*(l+(.0043(w/d))))*(m*(Math.pow(d , 2))*n);
  document.getElementById("resultado").value = result.toFixed(4)+" Gotas por minuto";
}
}
function Limpiar(){
      document.getElementById("deje").value="";
      document.getElementById("dcoj").value="";
      document.getElementById("carga").value="";
      document.getElementById("largo").value="";
      document.getElementById("rpm").value="";
     
    }
