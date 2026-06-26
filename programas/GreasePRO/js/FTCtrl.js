function limpiarC(){
    document.getElementById("nli").value="";
    document.getElementById("nlf").value="";
    document.getElementById("vsg").value="";
    document.getElementById("tft").value="";
    document.getElementById("tfb").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}

function validarC(){
    nivelI=document.getElementById("nli").value;
    nivelF=document.getElementById("nlf").value;
    v=document.getElementById("vsg").value;
    tF=document.getElementById("tft").value;
    tB=document.getElementById("tfb").value;
    
    // Basic validation
    if (nivelI === "" || nivelF === "" || v === "" || tF === "" || tB === "") {
        alert(i18n.t('grease.ft.err_required'));
        return;
    }

    res1=((v/tF)/(1/tB-1))*(Math.log(nivelF/nivelI));
    document.getElementById("res1-val").textContent=res1.toFixed(2) + " min";
    res2=res1/(v/tF);
    document.getElementById("res2-val").textContent=res2.toFixed(2);

    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
}