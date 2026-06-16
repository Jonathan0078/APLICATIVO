function limpiarC(){
    document.getElementById("ft").value="";  
    document.getElementById("fc").value="";  
    document.getElementById("fh").value="";   
    document.getElementById("fv").value="";  
    document.getElementById("fp").value="";  
    document.getElementById("fd").value="";   
    document.getElementById("rpm").value="";  
    document.getElementById("diam").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}

function ValidarC(){
        document.getElementById("diam").value = document.getElementById("diam").value.replace(/,/, ".");
        document.getElementById("rpm").value = document.getElementById("rpm").value.replace(/,/, ".");

        if(document.getElementById("ft").value == "" || isNaN(document.getElementById("ft").value)) {
            alert("Elige una opción válida para la temperatura en la carcasa ");
            document.getElementById("ft").value ="";
            document.getElementById("ft").focus();
            return false;
        }
        if(document.getElementById("fc").value == "" || isNaN(document.getElementById("fc").value)) {
            alert("Elige una opción válida para la contaminación solida ");
            document.getElementById("fc").value ="";
            document.getElementById("fc").focus();
            return false;
        }
        if(document.getElementById("fh").value == "" || isNaN(document.getElementById("fh").value)) {
            alert("Elige una opción válida para la humedad");
            document.getElementById("fh").value ="";
            document.getElementById("fh").focus();
            return false;
        }
        if(document.getElementById("fv").value == "" || isNaN(document.getElementById("fv").value)) {
            alert("Elige una opción válida para la vibración");
            document.getElementById("fv").value ="";
            document.getElementById("fv").focus();
            return false;
        }
        if(document.getElementById("fp").value == "" || isNaN(document.getElementById("fp").value)) {
            alert("Elige una opción válida para la posición del eje");
            document.getElementById("fp").value ="";
            document.getElementById("fp").focus();
            return false;
        }
        if(document.getElementById("fd").value == "" || isNaN(document.getElementById("fd").value)) {
            alert("Elige una opción válida para el diseño del rodamiento");
            document.getElementById("fd").value ="";
            document.getElementById("fd").focus();
            return false;
        }
          
        if(document.getElementById("rpm").value == "" || isNaN(document.getElementById("rpm").value)) {
            alert("Ingresa un número válido para la velocidad rpm");
            document.getElementById("rpm").value ="";
            document.getElementById("rpm").focus();
            return false;
        }
        if(document.getElementById("diam").value == "" || isNaN(document.getElementById("diam").value)) {
            alert("Ingresa un número válido para el diametro");
            document.getElementById("diam").value ="";
            document.getElementById("diam").focus();
            return false;
        }
    CalculaFRMT(); 
}

function CalculaFRMT() {  
//declaración de variables
//asignación de valores
    vFt = document.getElementById("ft").value;  
    vFc = document.getElementById("fc").value;  
    vFh = document.getElementById("fh").value;   
    vFv = document.getElementById("fv").value;  
    vFp = document.getElementById("fp").value;  
    vFd = document.getElementById("fd").value;   
    n = document.getElementById("rpm").value;  
    d = document.getElementById("diam").value;  
//operaciones
        k=vFt*vFc*vFh*vFv*vFp*vFd;  
        nxd=n*Math.sqrt(d);
        mult=4*d;
        div= 14000000/nxd;
        resta= div-mult;
        res=k*resta;
        text=res.toFixed(0);
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
    document.getElementById('resultado-valor').textContent = text + " Horas";
}