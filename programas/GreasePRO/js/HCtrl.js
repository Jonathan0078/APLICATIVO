function limpiarC(){
    document.getElementById("humedad").value="";
    document.getElementById("temC").value="";
    document.getElementById("temF").value="";
    document.getElementById("metro").value="";
    document.getElementById("pies").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}

function celsiusFarenheit(valNum) {
	document.getElementById("temF").value=valNum*(9/5)+32;
}

function farenheitCelsius(valNum) {
	document.getElementById("temC").value=(valNum-32)*(5/9);
}

function metroFt(valNum) {
	document.getElementById("pies").value=valNum*3.281;
}

function ftMetro(valNum) {
	document.getElementById("metro").value=valNum/3.281;
}

function validarC(){
    h=document.getElementById("humedad").value;
    c=document.getElementById("temC").value;
    m=document.getElementById("metro").value;
    ft=document.getElementById("pies").value;

    if (h === "" || c === "" || m === "") {
        alert(i18n.t('grease.h.err_required'));
        return;
    }

    pvsF=6.11*Math.pow(10, (7.5*(5/9*(c-32))/(237.7+5/9*(c-32))));
    pvsC=6.11*Math.pow(10, (7.5*(c/(237.7+c))));
    document.getElementById("res3").textContent=pvsC.toFixed(2);
    document.getElementById("res4").textContent=pvsF.toFixed(2);

    pvaC=(h*pvsC)/100;
    pvaF=(h*pvsF)/100;
    document.getElementById("res5").textContent=pvaC.toFixed(2);
    document.getElementById("res6").textContent=pvaF.toFixed(2);

    tprC=(-430.22+237.7*(Math.log(pvaC)))/(-Math.log(pvaC)+19.08);
    tprF=(-430.22+237.7*(Math.log(pvaF)))/((-1*(Math.log(pvaF)))+19.08);
    document.getElementById("res1").textContent=tprC.toFixed(2);
    document.getElementById("res2").textContent=tprF.toFixed(2);

    paC=1013*Math.exp(-1*(m*0.3048)/7000);
    paF=1013*Math.exp(-(ft)/7000);
    document.getElementById("res7").textContent=paC.toFixed(2);
    document.getElementById("res8").textContent=paF.toFixed(2);

    cpC=1013/paC;
    cpF=1013/paF;
    document.getElementById("res9").textContent=cpC.toFixed(2);
    
    pvraC=pvaC/cpC;
    pvraF=pvaF/cpF;
    document.getElementById("res11").textContent=pvraC.toFixed(2);
    document.getElementById("res12").textContent=pvraF.toFixed(2);

    haC2=(pvraC*100)/(parseFloat(m)+parseFloat(273)+parseFloat(461));
    document.getElementById("res13").textContent=haC2.toFixed(2);
    document.getElementById("res14").textContent=(haC2/ 16.018).toFixed(2);

    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'grid';
}