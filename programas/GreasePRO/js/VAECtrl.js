listaTipoLubricacion = new Array('Salpique','Circulación');
listaTipoReduccion   = new Array('Reducción simple <10:1','Reducción Multiple  >10:1');
listaPotencia        = new Array('0-1', '1-5', '5-10', '10-20', '20-30', '30-50', '50-75', '75-100', '100-1000', '>1000');
listaVelocidad       = new Array('0-150','150-300','300-1000','1000-2000','2000-5000','5000-10000');
matriz = new Array (); 
matriz[0] = new Array ('0-1 0-150','460','460','150','320'); 
matriz[1] = new Array ('0-1 150-300','320','460','150','320'); 
matriz[2] = new Array ('0-1 300-1000','150','320','68','150');
matriz[3] = new Array ('0-1 1000-2000','68','150','68','150');
matriz[4] = new Array ('0-1 300-1000','150','320','68','150');
matriz[5] = new Array ('0-1 2000-5000','46 Hydraulic','68','46 Hydraulic','68');
matriz[6] = new Array ('0-1 5000-10000','32 R&O','46 Hydraulic','32 R&O','46 Hydraulic');
matriz[7] = new Array ('1-5 0-150','460','460','150','320');
matriz[8] = new Array ('1-5 150-300','320','460','150','320');
matriz[9] = new Array ('1-5 300-1000','150','320','68','150');
matriz[10] = new Array ('1-5 1000-2000','68','150','68','150');
matriz[11] = new Array ('1-5 2000-5000','46 Hydraulic','68','46 Hydraulic','68');
matriz[12] = new Array ('1-5 5000-10000','46 Hydraulic','68','46 Hydraulic','68');
matriz[13] = new Array ('5-10 0-150','460','460','150','320');
matriz[14] = new Array ('5-10 150-300','320','460','150','320');
matriz[15] = new Array ('5-10 300-1000','150','320','68','150');
matriz[16] = new Array ('5-10 1000-2000','68','150','68','150');
matriz[17] = new Array ('5-10 2000-5000','68','150','68','150');
matriz[18] = new Array ('5-10 5000-10000','46 Hydraulic','68','46 Hydraulic','68');
matriz[19] = new Array ('10-20 0-150','460','460','150','320');
matriz[20] = new Array ('10-20 150-300','320','460','150','320');
matriz[21] = new Array ('10-20 300-1000','150','320','150','320');
matriz[22] = new Array ('10-20 1000-2000','150','320','68','320');
matriz[23] = new Array ('10-20 2000-5000','68','150','68','150');
matriz[24] = new Array ('10-20 5000-10000','68','150','68','150');
matriz[25] = new Array ('20-30 0-150','460','460','150','320');
matriz[26] = new Array ('20-30 150-300','320','460','150','320');
matriz[27] = new Array ('20-30 300-1000','150','460','150','320');
matriz[28] = new Array ('20-30 1000-2000','150','320','150','320');
matriz[29] = new Array ('20-30 2000-5000','150','320','68','320');
matriz[30] = new Array ('20-30 5000-10000','68','150','68','150');
matriz[31] = new Array ('30-50 0-150','460','680','320','460');
matriz[32] = new Array ('30-50 150-300','460','680','320','460');
matriz[33] = new Array ('30-50 300-1000','320','460','150','320');
matriz[34] = new Array ('30-50 1000-2000','150','320','150','320');
matriz[35] = new Array ('30-50 2000-5000','150','320','150','320');
matriz[36] = new Array ('30-50 5000-10000','68','150','68','150');
matriz[37] = new Array ('50-75 0-150','460','680','320','460');
matriz[38] = new Array ('50-75 150-300','460','680','320','460');
matriz[39] = new Array ('50-75 300-1000','460','460','150','320');
matriz[40] = new Array ('50-75 1000-2000','320','460','150','320');
matriz[41] = new Array ('50-75 2000-5000','150','320','150','320');
matriz[42] = new Array ('50-75 5000-10000','68','150','68','150');
matriz[43] = new Array ('75-100 0-150','460','680','320','460');
matriz[44] = new Array ('75-100 150-300','460','680','320','460');
matriz[45] = new Array ('75-100 300-1000','460','680','320','460');
matriz[46] = new Array ('75-100 1000-2000','320','460','150','320');
matriz[47] = new Array ('75-100 2000-5000','150','320','150','320');
matriz[48] = new Array ('75-100 5000-10000','68','150','68','150');
matriz[49] = new Array ('100-1000 0-150','680','680','680','680');
matriz[50] = new Array ('100-1000 150-300','680','680','680','680');
matriz[51] = new Array ('100-1000 300-1000','460','680','320','460');
matriz[52] = new Array ('100-1000 1000-2000','320','460','150','320');
matriz[53] = new Array ('100-1000 2000-5000','150','320','150','320');
matriz[54] = new Array ('100-1000 5000-10000','68','150','68','150');
matriz[55] = new Array ('>1000 0-150','1000','1000','680','680');
matriz[56] = new Array ('>1000 150-300','680','680','680','680');
matriz[57] = new Array ('>1000 300-1000','460','680','320','460');
matriz[58] = new Array ('>1000 1000-2000','320','460','150','320');
matriz[59] = new Array ('>1000 2000-5000','150','320','150','320');
matriz[60] = new Array ('>1000 5000-10000','68','150','68','150');

function cargarListas() 
{  
// Cargamos lista de Tipo de Lubricacion
for (x=0;x < listaTipoLubricacion.length;x++)   
    document.formulario.TipoLubricacion[x] = new Option(listaTipoLubricacion[x]);
// Cargamos lista de Tipo de Reduccion
for (x=0;x < listaTipoReduccion.length;x++)   
    document.formulario.TipoReduccion[x] = new Option(listaTipoReduccion[x]);
// Cargamos lista de Tipo de Lubricacion
for (x=0;x < listaPotencia.length;x++)   
    document.formulario.Potencia[x] = new Option(listaPotencia[x]);
// Cargamos lista de Tipo de Lubricacion
for (x=0;x < listaVelocidad.length;x++)   
    document.formulario.Velocidad[x] = new Option(listaVelocidad[x]);
}

function MostrarValor()
{
    var indiceL = document.formulario.TipoLubricacion.selectedIndex;
    var indiceR = document.formulario.TipoReduccion.selectedIndex;
    
    var indicep = document.formulario.Potencia.selectedIndex;
    var x_potencia   = document.formulario.Potencia.options[indicep].text;
    
    var indicev = document.formulario.Velocidad.selectedIndex;
    var x_velocidad   = document.formulario.Velocidad.options[indicev].text;
    var respuesta = "***";
    x_cadena = x_potencia + " " + x_velocidad;
    for (i=0;i<matriz.length;i++)
    {
      if (matriz[i][0] == x_cadena)
      {
            if (indiceL == 0)
            {
                if (indiceR == 0)
                {
                    respuesta = matriz[i][1];
                }
                else
                {
                    respuesta = matriz[i][2];
                }
            }
            else
            {
                if (indiceR == 0)
                {
                    respuesta = matriz[i][3];
                }
                else
                {
                    respuesta = matriz[i][4];
                }
            }
      }
    }
    document.getElementById('result-placeholder').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
    document.getElementById('resultado-valor').textContent = respuesta;
}

function limpiarC(){
    document.getElementById('result-placeholder').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
}