function limpiarC(){
    document.getElementById("mostrar").value="";
    document.getElementById("select1").value= "";
    document.getElementById("select2").value= "";
    document.getElementById("fes").value="";
    document.getElementById("omc").value="";
    document.getElementById("res1").textContent="";
    document.getElementById("res2").textContent="";
    document.getElementById("res3").textContent="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}

function limpiarB(){
    document.getElementById("ma").value="";
    document.getElementById("la").value="";
    document.getElementById("cm").value="";
    document.getElementById("res6").textContent="";
    document.getElementById("mostrar").value="";
    document.getElementById("select1").value= "";
    document.getElementById("select2").value= "";
    document.getElementById("fes").value="";
    document.getElementById("omc").value="";
    document.getElementById("res1").textContent="";
    document.getElementById("res2").textContent="";
    document.getElementById("res3").textContent="";
}

function mostrarS(){
    var valor = document.getElementById("mostrar").value;
    if(valor==1){ mostrarS1(); }
    if(valor==2){ mostrarS2(); }
}

function mostrarS1(){
    document.getElementById('select1').style.display='block';
    document.getElementById('select2').style.display='none';
}

function mostrarS2(){
    document.getElementById('select2').style.display='block';
    document.getElementById('select1').style.display='none';
}

function validarC(){
    var opcEqui = document.getElementById("mostrar").value;
    var fm1 = document.getElementById("select1").value;
    var fm2 = document.getElementById("select2").value;
    var fes = document.getElementById("fes").value;
    var omc = document.getElementById("omc").value;

    var famb = (parseFloat(omc) < parseFloat(fes)) ? omc : fes;

    var freqRef, ssf;
    if(opcEqui==1){
        freqRef = fm1;
        ssf = parseFloat(fm1) * parseFloat(famb);
    } else if(opcEqui==2){
        freqRef = fm2;
        ssf = parseFloat(fm2) * parseFloat(famb);
    } else {
        return;
    }

    document.getElementById("res1").textContent = freqRef;
    document.getElementById("res2").textContent = famb;
    document.getElementById("res3").textContent = ssf.toFixed(2) + " horas";
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
}

function validar2C(){
    var ma = parseFloat(document.getElementById("ma").value);
    var la = parseFloat(document.getElementById("la").value);
    var cm = parseFloat(document.getElementById("cm").value);
    var fam = parseFloat(document.getElementById("res3").textContent);

    var famb1;
    if(ma <= la && ma <= cm){
        famb1 = ma;
    } else if(la <= ma && la <= cm){
        famb1 = la;
    } else {
        famb1 = cm;
    }

    var temporal = fam * famb1;
    document.getElementById("res6").textContent = temporal.toFixed(2) + " horas";
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
}
