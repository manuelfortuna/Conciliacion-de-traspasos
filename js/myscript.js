//VARIABLES GLOBALES
var RENGLONES_ARMADOS_ORIGEN = [];
var RENGLONES_ARMADOS_DESTINO = [];
var cia = "";
var zona = "";
var fecha = "";
var alm = "";
var consec = "";
var tpo_tra = "";
var costo = "";
var referencia = "";
var alm_des = "";
var cons_det = "";
var mensaje = "";

var sucursalOrigenSelect = document.getElementById("sucOrigen");
var indiceOrigen = "";

var sucursalDestinoSelect = document.getElementById("sucDestino");
var indiceDestino = "";


const almacenValido = /p{0x0056}+[0-9]+[A-Z]/g;
const numero = /\p{Nd}/gu;
const ARCHIVO_NO_COINCIDE = "¡El archivo no coincide con la sucursal seleccionada!";


var contadorTraspasosOrigen = 0;
var contadorTraspasosDestino = 0;

var traspasoOrigen = "";
var traspasoDestino = "";
var sucOrigen = "";
var sucDestino = "";



/*INICIO DE FUNCIONES.*/

//FUNCIONES DE INICILIAZACION.
/*Funciones de limpieza de archivo*/
function limpiarErrores() {
    document.getElementById("txtTraspasosDestino").value = "";
    document.getElementById("txtTraspasosOrigen").value = "";
    document.getElementById("inputFileOrigen").value = "";
    document.getElementById("inputFileDestino").value = "";
    document.getElementById("txtTraspasosResultado").value = "";
    mensaje = "";
    inicializarVariablesTraspaso("origen");
    inicializarVariablesTraspaso("destino");
}


//Realiza la inicializacion de las variables globales que se utilizan en el armado de un renglon,
//Realiza la inicializacion de los arreglos globales que almacenan los renglones obtenidos del archivo
//con la nomenclatura de separacion "|"
function inicializarVariablesTraspaso(bandera) {
    cia = "";
    zona = "";
    fecha = "";
    alm = "";
    consec = "";
    tpo_tra = "";
    costo = "";
    referencia = "";
    alm_des = "";
    cons_det = "";
    mensaje = "";

    if (bandera == "origen") {
        if (validador(RENGLONES_ARMADOS_ORIGEN)) {
            limpiarArreglo(RENGLONES_ARMADOS_ORIGEN);
        }

    }

    if (bandera == "destino") {
        if (validador(RENGLONES_ARMADOS_DESTINO)) {
            limpiarArreglo(RENGLONES_ARMADOS_DESTINO);
        }

    }

    contadorTraspasosDestino = 0;
    contadorTraspasosOrigen = 0;

}


//Recibe un arreglo con todos los registros leidos del archivo
function limpiarArreglo(arregloLleno) {

    while (arregloLleno.length > 0) {
        arregloLleno.pop();

    }

    return arregloLleno;
}



//FUNCIONES DE LECTURA DE ARCHIVO.
/*Funciones de guardado de archivo y lectura de archivo*/
function cargaArchivo() {
    document.getElementById('inputFileOrigen').addEventListener('change', function () {
        var fileOrigen = new FileReader();
        var bandera = "origen";
        fileOrigen.onload = () => {
            //Limpia los renglones obtenidos del archivo.
            //limpiarRenglones(fileOrigen.result);
            //Imprime en pantalla txtTraspasosOrigen
            inicializarVariablesTraspaso(bandera);

            document.getElementById('txtTraspasosOrigen').value = limpiarRenglones(fileOrigen.result, bandera);
            muestraTipoTraspaso(bandera);

        }
        fileOrigen.readAsText(this.files[0]);
    });

    document.getElementById('inputFileDestino').addEventListener('change', function () {
        var fileDestino = new FileReader();
        var bandera = "destino";
        fileDestino.onload = () => {
            //Imprime en pantalla txtTraspasosDestino
            inicializarVariablesTraspaso(bandera);
            document.getElementById('txtTraspasosDestino').value = limpiarRenglones(fileDestino.result, bandera);
            muestraTipoTraspaso(bandera);

        }
        fileDestino.readAsText(this.files[0]);
    });


}




//FUNCIONES DE GUARDADO DE ARCHIVO.
/*Funciones encargadas de la lectura del archivo*/
function guardarArchivo(t) {
    var datos = t;
    var textFileAsBlob = new Blob([datos], { type: 'text/plain' });
    var downloadLink = document.createElement("a");
    var nombreArchivo = "";
    //nombreArchivo = document.getElementById("inputFile").files[0].name;
    nombreArchivo = "CONCILIACION DE TRASPASOS " + sucOrigen + " VS " + sucDestino;
    downloadLink.download = nombreArchivo;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();

}

/** 
* 
*  Base64 encode / decode 
*  http://www.webtoolkit.info/ 
* 
**/

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9+/=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/rn/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}


function salvar(t) {
    if (window.ActiveXObject) {
        var v = window.open('', 'pp', '');
        v.document.open();
        v.document.write(t + '<scr' + 'ipt>document.execCommand("SaveAs",null,"archivo.txt");</scr' + 'ipt>');
        v.document.close();
    } else {
        if (typeof btoa == 'function') {
            window.location = 'data:application/octet-stream;base64,' + btoa(t);
        }

        else {
            window.location = 'data:application/octet-stream;base64,' + Base64.encode(t);
        }

    }
}




//FUNCIONES DE LIMPIEZA, MANIPULACION O SEGMENTACION DE RENGLON.

/**Recibe un arreglo segmentado por "|" leído de un archivo y realiza la eliminacion de indices que recibe por medio de una bandera**/
function limpiarArregloDeArchivo(arregloDeArchivo, banderaUbicacion) {
    let arregloSegmentadoArchivo = [];
    let tamanoArreglo = 0;
    let sucursalAlmacen = "";
    arregloSegmentadoArchivo = arregloDeArchivo;
    tamanoArreglo = arregloSegmentadoArchivo.length - 1;

    indiceOrigen = sucursalOrigenSelect.options[sucursalOrigenSelect.selectedIndex].value;
    indiceDestino = sucursalDestinoSelect.options[sucursalDestinoSelect.selectedIndex].value;

    sucursalAlmacen = obtenerSegmentoArreglo(quitarEspacios(arregloSegmentadoArchivo[4]), 4, "|");

    //LIMPIA PARTE INFERIOR DEL ARCHIVO
    if (banderaUbicacion == "origen") {
        //valida si se trata de un archivo de V05
        if (indiceOrigen == "V05M" || indiceOrigen == "V05R" || indiceOrigen == "V05X") {

            if (sucursalAlmacen == indiceOrigen) {
                for (var i = 0; i <= 1; i++) {
                    arregloSegmentadoArchivo.pop();
                }
            } else {
                //alert("El archivo no coincide con la sucursal seleccioanda");
                arregloSegmentadoArchivo = [];
                mensaje = ARCHIVO_NO_COINCIDE;
            }



        } else {
            //Una vez dentro de esta funcion indica que el archivo no pertenece a V05 Y PERTENECE A UNA ATS
            if (sucursalAlmacen == indiceOrigen) {
                for (var x = 0; x <= 5; x++) {
                    arregloSegmentadoArchivo.pop();
                }
            } else {
                //alert("El archivo no coincide con la sucursal seleccioanda");
                arregloSegmentadoArchivo = [];
                mensaje = ARCHIVO_NO_COINCIDE;
            }


        }

    }

    if (banderaUbicacion == "destino") {
        //valida si se trata de un archivo de V05
        if (indiceDestino == "V05M" || indiceDestino == "V05R" || indiceDestino == "V05X") {

            if (sucursalAlmacen == indiceDestino) {
                for (var i = 0; i <= 1; i++) {
                    arregloSegmentadoArchivo.pop();
                }
            } else {
                //alert("El archivo no coincide con la sucursal seleccioanda");
                arregloSegmentadoArchivo = [];
                mensaje = ARCHIVO_NO_COINCIDE;
            }



        } else {
            //Una vez dentro de esta funcion indica que el archivo no pertenece a V05 Y PERTENECE A UNA ATS
            if (sucursalAlmacen == indiceDestino) {
                for (var x = 0; x <= 5; x++) {
                    arregloSegmentadoArchivo.pop();
                }
            } else {
                //alert("El archivo no coincide con la sucursal seleccioanda");

                arregloSegmentadoArchivo = [];
                mensaje = ARCHIVO_NO_COINCIDE;
            }


        }
    }


    return arregloSegmentadoArchivo;
}

/**Recibe una cadena, un segmento a obtener y el split con el que se realiza la separacion**/
function obtenerSegmentoArreglo(cadena, segmento, splitBuscado) {

    let cadenaArray = cadena;

    cadenaArray = cadenaArray.split(splitBuscado);
    return cadenaArray[segmento - 1];

}

//Compara el registro de cada renglon contra vacios, espacios y encuentra el limite del documento.
function validador(clavesEntrada) {
    var valida = true;
    if (clavesEntrada == []) {
        valida = false;
    }

    if (clavesEntrada == null || clavesEntrada == " ") {
        valida = false;
    }

    return (valida);

}


//Prepara los renglones provenientes del archivo
function limpiarRenglones(registrosArchivo, banderaUbicacion) {

    var renglonArchivo = registrosArchivo;
    let renglonesArmados = "";
    let renglonesConcatenados = "";
    let renglonArchivoTemporal = [];
    var i = 0;
    var continuarLectura = true;

    let tipoMovimientoOrigen = "";
    let sucursalOrigen = "";

    let tipoMovimientoDestino = "";
    let sucursalDestino = "";

    let almacenInvalido = false;

    //Contruyo renglones y procedo a limpiar los espacios para armar un renglon que pueda ser interpretado
    renglonArchivo = renglonArchivo.split('\n');


    renglonArchivo = limpiarArregloDeArchivo(renglonArchivo, banderaUbicacion);

    if (validador(renglonArchivo)) {

        for (var i = 0; i <= renglonArchivo.length - 1; i++) {

            renglonArchivoTemporal = quitarEspacios(renglonArchivo[i]);

            if (continuarLectura == true) {

                if (validador(renglonArchivoTemporal)) {

                    if (banderaUbicacion == "origen") {
                        //Realiza la extraccion del campo referencia
                        renglonesArmados = validaCampoReferencia(renglonArchivoTemporal);

                        tipoMovimientoOrigen = obtenerSegmentoArreglo(renglonesArmados, 6, "|");
                        sucursalOrigen = obtenerSegmentoArreglo(renglonesArmados, 4, "|");

                        indiceOrigen = sucursalOrigenSelect.options[sucursalOrigenSelect.selectedIndex].value;

                        if (indiceOrigen == sucursalOrigen) {
                            //Guarda el renglon en el arreglo origen
                            RENGLONES_ARMADOS_ORIGEN.push(renglonesArmados);

                        } else {
                            almacenInvalido = true;

                        }

                    } else if (banderaUbicacion == "destino") {

                        renglonesArmados = validaCampoReferencia(renglonArchivoTemporal);
                        tipoMovimientoDestino = obtenerSegmentoArreglo(renglonesArmados, 6, "|");
                        sucursalDestino = obtenerSegmentoArreglo(renglonesArmados, 4, "|");
                        indiceDestino = sucursalDestinoSelect.options[sucursalDestinoSelect.selectedIndex].value;

                        if (indiceDestino == sucursalDestino) {
                            //Guarda el renglon en el arreglo destino
                            RENGLONES_ARMADOS_DESTINO.push(renglonesArmados);

                        } else {

                            almacenInvalido = true;

                        }

                        //RENGLONES_ARMADOS_DESTINO.push(validaCampoReferencia(renglonArchivoTemporal));
                    }


                    renglonesConcatenados = renglonesConcatenados + renglonesArmados + "\n";

                } else {
                    continuarLectura = false;
                }
            }
        }

    } else {
        alert("Favor de colocar una clave valida");
    }

    if (almacenInvalido) {
        alert("El almacen del archivo de destino no coincide con el almacen seleccionado");
        inicializarVariablesTraspaso();
        renglonesConcatenados = "";
        almacenInvalido = false;
    }
    return renglonesConcatenados;


}

//Recibe un renglon de un arreglo y lo limpia de espacios continuos dejando solo uno, despues 
//los cambia por "|"
function quitarEspacios(renglonArchivo) {
    let renglonArmado = "";

    //Se ignoran los primeros 2 indices ya que son informacion basura
    renglonArmado = renglonArchivo.toString();
    renglonArmado = renglonArmado.replace(/\s+/g, '|');
    renglonArmado = renglonArmado.slice(1);
    return renglonArmado;

}

//Recibe un arreglo al cual se valida si se trata de un numero
function validaNumero(renglonArchivo) {
    var valida = true;

    for (i = 0; i <= renglonArchivo.length - 1; i++) {
        console.log(isNaN(renglonArchivo[i]));
        if (isNaN(renglonArchivo[i]) == true) {
            console.log("N soy numero");

            valida = false;
        }
        return (valida);

    }
    return (valida);
}

//Reconstruye el renglon buscando corregir el error del segmento referencia donde 
//durante el split segementa la referencia en dos partes
function validaCampoReferencia(arregloRenglon) {
    let primeraParteRenglon = "";
    let segundaParteRenglon = "";

    cia = obtenerSegmentoArreglo(arregloRenglon, 1, "|");
    zona = obtenerSegmentoArreglo(arregloRenglon, 2, "|");
    fecha = obtenerSegmentoArreglo(arregloRenglon, 3, "|");
    alm = obtenerSegmentoArreglo(arregloRenglon, 4, "|");
    consec = obtenerSegmentoArreglo(arregloRenglon, 5, "|");
    tpo_tra = obtenerSegmentoArreglo(arregloRenglon, 6, "|");
    costo = obtenerSegmentoArreglo(arregloRenglon, 7, "|");


    primeraParteRenglon = cia + "|" + zona + "|" + fecha + "|" + alm + "|" + consec + "|" + tpo_tra + "|" + costo + "|";
    //Valida que el movimiento sea TRASAL ya que es el movimiento donde no hay dato en consecutivo de destino cons_det.
    //if (tpo_tra == "TRASAL") {

    //Obtiene el consecutivo de destino
    cons_det = obtenerSegmentoArreglo(arregloRenglon, 10, "|");
    //Debe de ser vacio ya que no hay dato en ese segmento, en caso contrario la referencia se ha divido en dos segmentos.
    if (cons_det == "") {
        cons_det = " ";
    }
    //Valido que alm_det tenga un almacen valido
    alm_des = obtenerSegmentoArreglo(arregloRenglon, 9, "|");

    if (alm_des == "V01A" || alm_des == "V06A" || alm_des == "V07A" || alm_des == "V09A" || alm_des == "V10A" || alm_des == "V09P" ||
        alm_des == "V11A" || alm_des == "V12A" || alm_des == "V13A" || alm_des == "V14A" || alm_des == "V15A" ||
        alm_des == "V20A" || alm_des == "V25A" || alm_des == "V05M" || alm_des == "V05X" || alm_des == "V05X" || alm_des == "V05R") {

        referencia = obtenerSegmentoArreglo(arregloRenglon, 8, "|");
        cons_det = obtenerSegmentoArreglo(arregloRenglon, 10, "|");

        segundaParteRenglon = referencia + "|" + alm_des + "|" + cons_det + "|";

    } else {
        //obtenemos el segmento de referencia y el segmento de almacen destino alm_des para concatenarlos.
        referencia = obtenerSegmentoArreglo(arregloRenglon, 8, "|");
        alm_des = obtenerSegmentoArreglo(arregloRenglon, 9, "|");
        cons_det = obtenerSegmentoArreglo(arregloRenglon, 11, "|");

        //Se crea una nueva referencia con la union de los dos textos
        referencia = referencia + "-" + alm_des;

        //Se crea un nuevo alm dest porque debe llevar el almacen
        // alm_des = cons_det;
        alm_des = obtenerSegmentoArreglo(arregloRenglon, 10, "|");
        //Se crea un nuevo cons_dest porque no debe de llevar nada.        

        segundaParteRenglon = referencia + "|" + alm_des + "|" + cons_det + "|";

    }


    arregloRenglon = primeraParteRenglon + segundaParteRenglon;

    return arregloRenglon;
}



//FUNCIONES DE MENSAJES A MOSTRAR.
//obtengo el tipo de traspaso de los archivos de origen y destino
function muestraTipoTraspaso(bandera) {
    /*let traspasoOrigen = "";
    let traspasoDestino = "";
    let sucOrigen = "";
    let sucDestino = "";*/

    if (bandera == "origen") {
        traspasoOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[1], 6, "|");
        sucOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[1], 4, "|");
        document.getElementById("txtOrigen").textContent = traspasoOrigen + " de SUC: " + sucOrigen;

    }

    if (bandera == "destino") {
        traspasoDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[1], 6, "|");
        sucDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[1], 4, "|");
        document.getElementById("txtDestino").textContent = traspasoDestino + " de SUC: " + sucDestino;
    }


}


//FUNCIONES DE REGLA DE NEGOCIO.
/*Funcion de boton conciliar*/
function conciliar() {
    let reporte = "";

    mensaje = buscaConsDet();


    reporte = construyeReporte();

    document.getElementById("txtTraspasosResultado").value = reporte + mensaje;

}

function construyeReporte() {
    let respuesta = "";

    contarFrecuencias();

    respuesta = traspasoOrigen + " DE " + sucOrigen + "  VS  " + traspasoDestino + " DE " + sucDestino + "\n";
    respuesta = respuesta + "Encontrados en " + sucOrigen + ": " + contadorTraspasosOrigen + "  VS  " + "Encontrados en " + sucDestino + ": " + contadorTraspasosDestino + "\n";

    return respuesta;
}

function contarFrecuencias() {
    for (var i = 0; i <= RENGLONES_ARMADOS_ORIGEN.length - 1; i++) {
        if (sucDestino == obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[i], 9, "|")) {
            contadorTraspasosOrigen++;
        }
    }

    for (var x = 0; x <= RENGLONES_ARMADOS_DESTINO.length - 1; x++) {
        if (sucOrigen == obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[x], 9, "|")) {
            contadorTraspasosDestino++;

        }

    }

}

//Realiza la busqueda de los folios de origen en los folios de destino
function buscaConsDet() {
    let consecOrigen = "";
    let consecDestino = "";
    let encontrado = false;

    let tipoMovAlmacenOrigen = "";
    let tipoMovAlmacenDestino = "";

    for (var i = 0; i <= RENGLONES_ARMADOS_ORIGEN.length - 1; i++) {
        tipoMovAlmacenOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[i], 6, "|");

        if (tipoMovAlmacenOrigen == "TRASAL") {
            consecOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[i], 5, "|");
        }
        if (tipoMovAlmacenOrigen == "TRAENT") {
            consecOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[i], 10, "|");
        }

        for (var y = 0; y <= RENGLONES_ARMADOS_DESTINO.length - 1; y++) {

            tipoMovAlmacenDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 6, "|");
            if (tipoMovAlmacenDestino == "TRASAL") {
                consecDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 5, "|");
            }
            if (tipoMovAlmacenDestino == "TRAENT") {
                consecDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 10, "|");
            }

            if (consecOrigen == consecDestino) {
                mensaje = mensaje + "ConsOrigen: " + consecOrigen + " --> ConsDestino: " + consecDestino + "\n";

                encontrado = true;
            }

        }
        if (encontrado == false) {

            //mensaje = mensaje + "ConsOrigen: " + consecOrigen + " --> No encontrado " + "\n";
            console.log(mensaje + "ConsOrigen: " + consecOrigen + " --> No encontrado " + "\n");
        }
    }
    return mensaje;
}