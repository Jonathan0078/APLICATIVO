function limpiarC(){
    document.getElementById("nli").value="";
    document.getElementById("nlf").value="";
    document.getElementById("vsg").value="";
    document.getElementById("tft").value="";
    document.getElementById("tfb").value="";
    document.getElementById("res1").value="";
    document.getElementById("res2").value="";
}
function validarC(){
    nivelI=document.getElementById("nli").value;
    nivelF=document.getElementById("nlf").value;
    v=document.getElementById("vsg").value;
    tF=document.getElementById("tft").value;
    tB=document.getElementById("tfb").value;
    
    res1=((v/tF)/(1/tB-1))*(Math.log(nivelF/nivelI));
    document.getElementById("res1").value=res1.toFixed(4);
    res2=res1/(v/tF);
    document.getElementById("res2").value=res2.toFixed(4);



    
}