function limpiarC(){
    document.getElementById("ace1").value ="";
    document.getElementById("ace2").value ="";
    document.getElementById("porc").value ="";
    document.getElementById("vis1").value ="";
    document.getElementById("vis2").value ="";
    document.getElementById("visd").value ="";
    document.getElementById("result").textContent ="";
    document.getElementById("result1").textContent ="";
    document.getElementById("result2").textContent ="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content1').style.display = 'none';
    document.getElementById('result-content2').style.display = 'none';
}

function mostrarT(){
    var valor = document.getElementById("calculadora").value;
    if(valor==1){ mostrarTabla1(); }
    if(valor==2){ mostrarTabla2(); }
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
        alert(i18n.t('grease.v2.err_aceite1'));
        document.getElementById("ace1").value ="";
        document.getElementById("ace1").focus();
        return false;
    }
    if(document.getElementById("ace2").value == "" || isNaN(document.getElementById("ace2").value)) {
        alert(i18n.t('grease.v2.err_aceite2'));
        document.getElementById("ace2").value ="";
        document.getElementById("ace2").focus();
        return false;
    }
    if(document.getElementById("porc").value == "" || isNaN(document.getElementById("porc").value)) {
        alert(i18n.t('grease.v2.err_porcentaje'));
        document.getElementById("porc").value ="";
        document.getElementById("porc").focus();
        return false;
    }
    Calcular();
}

function Calcular(){
    var kv1 = parseFloat(document.getElementById("ace1").value);
    var kv2 = parseFloat(document.getElementById("ace2").value);
    var x1 = parseFloat(document.getElementById("porc").value) / 100;

    var res = (100 * (Math.exp(Math.log(kv2) * Math.exp(x1 * Math.log(Math.log(kv1) / Math.log(kv2)))))) / 100;

    document.getElementById("result").textContent = res.toFixed(3) + " cSt";
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content2').style.display = 'none';
    document.getElementById('result-content1').style.display = 'block';
}

function validar2v(){
    document.getElementById("vis1").value = document.getElementById("vis1").value.replace(/,/, ".");
    document.getElementById("vis2").value = document.getElementById("vis2").value.replace(/,/, ".");
    document.getElementById("visd").value = document.getElementById("visd").value.replace(/,/, ".");

    if(document.getElementById("vis1").value == "" || isNaN(document.getElementById("vis1").value)) {
        alert(i18n.t('grease.v2.err_visc1'));
        document.getElementById("vis1").value ="";
        document.getElementById("vis1").focus();
        return false;
    }
    if(document.getElementById("vis2").value == "" || isNaN(document.getElementById("vis2").value)) {
        alert(i18n.t('grease.v2.err_visc2'));
        document.getElementById("vis2").value ="";
        document.getElementById("vis2").focus();
        return false;
    }
    if(document.getElementById("visd").value == "" || isNaN(document.getElementById("visd").value)) {
        alert(i18n.t('grease.v2.err_viscd'));
        document.getElementById("visd").value ="";
        document.getElementById("visd").focus();
        return false;
    }
    Calcular2();
}

function Calcular2(){
    var vis1 = parseFloat(document.getElementById("vis1").value);
    var vis2 = parseFloat(document.getElementById("vis2").value);
    var visd = parseFloat(document.getElementById("visd").value);
    var temp2 = 4.1;
    var a = Math.log(visd + temp2);
    var b = Math.log(vis1 + temp2);
    var c = Math.log(vis2 + temp2);
    var res1 = (10000 * (Math.log(a / c) / Math.log(b / c))) / 100;
    var res2 = 100 - res1;

    document.getElementById("result1").textContent = res1.toFixed(4) + " %";
    document.getElementById("result2").textContent = res2.toFixed(4) + " %";
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content1').style.display = 'none';
    document.getElementById('result-content2').style.display = 'block';
}
