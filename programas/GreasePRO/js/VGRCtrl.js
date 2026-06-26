function Limpiar(){
    document.getElementById("diametro").value="";
    document.getElementById("diametroIn").value="";
    document.getElementById("espesor").value="";
    document.getElementById("espesorIn").value="";
    document.getElementById("longitud").value="";
    document.getElementById("longitudIn").value="";
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}

function mmaIn(valNum) {
    document.getElementById("diametroIn").value=(valNum/25.4).toFixed(4);
}
function inaMm(valNum) {
    document.getElementById("diametro").value=(valNum*25.4).toFixed(4);
}
function mmaIn2(valNum) {
    document.getElementById("espesorIn").value=(valNum/25.4).toFixed(4);
}
function inaMm2(valNum) {
    document.getElementById("espesor").value=(valNum*25.4).toFixed(4);
}
function mmaIn3(valNum) {
    document.getElementById("longitudIn").value=(valNum/25.4).toFixed(4);
}
function inaMm3(valNum) {
    document.getElementById("longitud").value=(valNum*25.4).toFixed(4);
}

function ValidarDatos(){
    var longIn = document.getElementById("longitudIn").value;
    var diamIn = document.getElementById("diametroIn").value;
    var espeIn = document.getElementById("espesorIn").value;

    if(longIn === "" || diamIn === "" || espeIn === "") {
        alert(i18n.t('grease.vgr.err_required'));
        return;
    }
    Calcular();
}

function Calcular(){
    var long = parseFloat(document.getElementById("longitudIn").value);
    var diam = parseFloat(document.getElementById("diametroIn").value);
    var espe = parseFloat(document.getElementById("espesorIn").value);

    var area = long * Math.PI * diam;
    var volumen = (area * espe) / 1.805;
    var volumenIn = volumen * 28.35;

    document.getElementById("res1").textContent = volumen.toFixed(4) + " oz";
    document.getElementById("res2").textContent = volumenIn.toFixed(4) + " g";
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
}
