function limpiarC(){

    document.getElementById("mostrar").value="";
    document.getElementById("select1").value= "";
    document.getElementById("select2").value= "";
    document.getElementById("fes").value="";
    document.getElementById("omc").value="";
    document.getElementById("res1").value="";
    document.getElementById("res2").value="";
    document.getElementById("res3").value="";
   
}

function limpiarB(){
    document.getElementById("ma").value="";
    document.getElementById("la").value="";
    document.getElementById("cm").value="";
    document.getElementById("res6").value="";
    document.getElementById("mostrar").value="";
    document.getElementById("select1").value= "";
    document.getElementById("select2").value= "";
    document.getElementById("fes").value="";
    document.getElementById("omc").value="";
    document.getElementById("res1").value="";
    document.getElementById("res2").value="";
    document.getElementById("res3").value="";
}
function mostrarS(){
	var valor = document.getElementById("mostrar").value;
	if(valor==1){
		mostrarS1();
	}
	if(valor==2){
		mostrarS2();
	}
}

function mostrarS1(){
	document.getElementById('select1').style.display='block'
    document.getElementById('select2').style.display='none'
    document.getElementById("res1").innerHTML=valor;
}

function mostrarS2(){
	document.getElementById('select2').style.display='block'
    document.getElementById('select1').style.display='none'
    document.getElementById("res1").innerHTML=valor;
}


function validarC(){
    
    opcEqui= document.getElementById("mostrar").value;
    
    fm1= document.getElementById("select1").value;
    fm2= document.getElementById("select2").value;
    fes= document.getElementById("fes").value;
    omc= document.getElementById("omc").value;
   
    // // document.getElementById("res1").value=opcEqui;
    if(omc < fes){
        famb=omc;
        
    }
    else{
        famb=fes;
       
    }
    
    if (opcEqui==1){
        document.getElementById("res1").value=fm1;
        document.getElementById("res2").value=famb;
        document.getElementById("res3").value= fm1*famb;

    }
    if (opcEqui==2){
        document.getElementById("res1").value=fm2;
        document.getElementById("res2").value=famb;
        document.getElementById("res3").value= fm2*famb;

        

    }

}
function validar2C(){
    
    ma=document.getElementById("ma").value;
    la= document.getElementById("la").value;
    cm= document.getElementById("cm").value;
    fam= document.getElementById("res3").value;

    if(ma <= la && ma <=cm ){
        
        famb1=ma;
        
    }
     else if(la <=  ma && la <= cm ){
            famb1=la;
            
    }
     else {
            famb1=cm;
     }
     document.getElementById("res6").value=fam*famb1

    
}

