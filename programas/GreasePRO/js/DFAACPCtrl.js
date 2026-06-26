function validar1v(){
    document.getElementById("deje").value = document.getElementById("deje").value.replace(/,/, ".");
    document.getElementById("dcoj").value = document.getElementById("dcoj").value.replace(/,/, ".");
    document.getElementById("carga").value = document.getElementById("carga").value.replace(/,/, ".");
    document.getElementById("largo").value = document.getElementById("largo").value.replace(/,/, ".");
    document.getElementById("rpm").value = document.getElementById("rpm").value.replace(/,/, ".");

    if(document.getElementById("deje").value == "" || isNaN(document.getElementById("deje").value)) {
        alert(i18n.t('grease.dfaacp.err_eixo'));
        document.getElementById("deje").value ="";
        document.getElementById("deje").focus();
        return false;
    }
    if(document.getElementById("dcoj").value == "" || isNaN(document.getElementById("dcoj").value)) {
        alert(i18n.t('grease.dfaacp.err_cojinete'));
        document.getElementById("dcoj").value ="";
        document.getElementById("dcoj").focus();
        return false;
    }
    if(document.getElementById("carga").value == "" || isNaN(document.getElementById("carga").value)) {
        alert(i18n.t('grease.dfaacp.err_carga'));
        document.getElementById("carga").value ="";
        document.getElementById("carga").focus();
        return false;
    }
    if(document.getElementById("largo").value == "" || isNaN(document.getElementById("largo").value)) {
        alert(i18n.t('grease.dfaacp.err_largo'));
        document.getElementById("largo").value ="";
        document.getElementById("largo").focus();
        return false;
    }
    if(document.getElementById("rpm").value == "" || isNaN(document.getElementById("rpm").value)) {
        alert(i18n.t('grease.dfaacp.err_rpm'));
        document.getElementById("rpm").value ="";
        document.getElementById("rpm").focus();
        return false;
    }
    RealLove();
}

function RealLove(){
    var ft = document.getElementById("trabajo").value;
    var d = parseFloat(document.getElementById("deje").value);
    var dcoj = parseFloat(document.getElementById("dcoj").value);
    var w = parseFloat(document.getElementById("carga").value);
    var l = parseFloat(document.getElementById("largo").value);
    var n = parseFloat(document.getElementById("rpm").value);

    var m = 1000 * ((dcoj - d) / d);
    var result, resultText;

    if(ft == 1){
        var d2 = Math.pow(d, 2);
        var fn = m * d2;
        var en = 0.0043 * (w / d);
        var su = l + en;
        var mu = 0.000000001 * su * fn * n;
        result = 29.3 * mu;
        resultText = result.toFixed(4) + " Galões por minuto";
    } else if(ft == 2){
        var d2 = Math.pow(d, 2);
        var fn = m * d2;
        var en = 0.0043 * (w / d);
        var su = l + en;
        var mu = 0.001 * (su * fn * n);
        result = 3.32 * mu;
        resultText = result.toFixed(4) + " Gotas por minuto";
    } else {
        return;
    }

    document.getElementById("resultado").textContent = resultText;
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
}

function Limpiar(){
    document.getElementById("deje").value="";
    document.getElementById("dcoj").value="";
    document.getElementById("carga").value="";
    document.getElementById("largo").value="";
    document.getElementById("rpm").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}
