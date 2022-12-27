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

var lecturas = 0;

var sucursalOrigenSelect = document.getElementById("sucOrigen");
var indiceOrigen = "";

var sucursalDestinoSelect = document.getElementById("sucDestino");
var indiceDestino = "";


const almacenValido = /p{0x0056}+[0-9]+[A-Z]/g;
const numero = /\p{Nd}/gu;
const ARCHIVO_NO_COINCIDE = "¡El archivo no coincide con la sucursal seleccionada!";
const ERROR_DE_ARCHIVO = "¡Error en el archivo, favor de validar!";

var ExpRegSoloNumeros = "^[0-9]+$";

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
    document.getElementById('inputFileOrigen').innerHTML = '';
    document.getElementById("inputFileDestino").value = "";
    document.getElementById('inputFileDestino').innerHTML = '';
    document.getElementById("txtTraspasosResultado").value = "";
    mensaje = "";
    document.getElementById("txtDestino").textContent = "Estatus del archivo";
    document.getElementById("txtOrigen").textContent = "Estatus del archivo";
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
/*function preparaArchivoCarga() {
    var bandera = "origen";
    inicializarVariablesTraspaso(bandera);
    cargaArchivo(bandera);
    muestraTipoTraspaso(bandera);
}*/


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

            //Limpia los renglones obtenidos del archivo.
            //limpiarRenglones(fileOrigen.result);
            //Imprime en pantalla txtTraspasosDestino
            inicializarVariablesTraspaso(bandera);
            document.getElementById('txtTraspasosDestino').value = limpiarRenglones(fileDestino.result, bandera);
            muestraTipoTraspaso(bandera);

        }
        fileDestino.readAsText(this.files[0]);
    });

}

//comienza funcion de prueba
/*function leerArchivo(e) {

    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
}*/

/*document.getElementById('inputFileOrigen')
    .addEventListener('change', leerArchivo, false);*/

/*function mostrarContenido(contenido) {
    var bandera = "origen";
    inicializarVariablesTraspaso(bandera);
    document.getElementById('txtTraspasosOrigen').value = limpiarRenglones(contenido, bandera);
    muestraTipoTraspaso(bandera);
    //var elemento = document.getElementById('contenido-archivo');
    //elemento.innerHTML = contenido;
}*/

//termina funcion de prueba







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

/**Recibe un arreglo segmentado por "|" leído de un archivo y realiza la eliminacion de indices de 
 * la ubicacion que recibe por medio de una bandera**/
function limpiarArregloDeArchivo(arregloDeArchivo, banderaUbicacion) {
    let arregloSegmentadoArchivo = [];
    let tamanoArreglo = 0;
    let sucursalAlmacen = "";
    arregloSegmentadoArchivo = arregloDeArchivo;
    tamanoArreglo = arregloSegmentadoArchivo.length - 1;

    indiceOrigen = sucursalOrigenSelect.options[sucursalOrigenSelect.selectedIndex].value;
    indiceDestino = sucursalDestinoSelect.options[sucursalDestinoSelect.selectedIndex].value;

    sucursalAlmacen = obtenerSegmentoArreglo(quitarEspacios(arregloSegmentadoArchivo[4]), 4, "|");

    //LIMPIA PARTE INFERIOR DEL ARCHIVO DE ORIGEN
    if (banderaUbicacion == "origen") {
        //valida si se trata de un archivo de V05
        // if (indiceOrigen == "V05M" || indiceOrigen == "V05R" || indiceOrigen == "V05X") {
        if (indiceOrigen == "V05") {
            //if (sucursalAlmacen == indiceOrigen) {
            if (sucursalAlmacen == "V05R" || sucursalAlmacen == "V05X" || sucursalAlmacen == "V05M" || sucursalAlmacen == "V05I") {
                //Borra los ultimos elementos de un ARRAY
                for (var i = 0; i <= 1; i++) {
                    arregloSegmentadoArchivo.pop();
                }
                //Borra el priemer renglon de un ARRAY
                arregloSegmentadoArchivo.shift();
            } else {
                //alert("El archivo no coincide con la sucursal seleccioanda");
                arregloSegmentadoArchivo = [];
                mensaje = ARCHIVO_NO_COINCIDE;
            }



        } else {
            //Una vez dentro de esta funcion indica que el archivo no pertenece a V05 Y PERTENECE A UNA ATS
            if (sucursalAlmacen == indiceOrigen) {

                //Borra el ultimo registro de un ARRAY
                for (var x = 0; x <= 5; x++) {
                    arregloSegmentadoArchivo.pop();
                }

                //Borra el priemer renglon de un ARRAY
                for (var z = 0; z <= 1; z++) {
                    arregloSegmentadoArchivo.shift();
                }

            } else {
                //alert("El archivo no coincide con la sucursal seleccioanda");
                arregloSegmentadoArchivo = [];
                mensaje = ARCHIVO_NO_COINCIDE;
            }


        }

    }

    //LIMPIA LA PARTE INFERIOR DEL ARCHIVO DE DESTINO
    if (banderaUbicacion == "destino") {
        //valida si se trata de un archivo de V05
        //if (indiceDestino == "V05M" || indiceDestino == "V05R" || indiceDestino == "V05X") {
        if (indiceDestino == "V05") {

            //    if (sucursalAlmacen == indiceDestino) {
            if (sucursalAlmacen == "V05R" || sucursalAlmacen == "V05X" || sucursalAlmacen == "V05M" || sucursalAlmacen == "V05I") {
                for (var i = 0; i <= 1; i++) {
                    arregloSegmentadoArchivo.pop();
                }
                //Borra el priemer renglon de un ARRAY
                arregloSegmentadoArchivo.shift();

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

                //Borra el priemer renglon de un ARRAY
                for (var z = 0; z <= 1; z++) {
                    arregloSegmentadoArchivo.shift();
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
function validador(datosEntrada) {
    var valida = true;

    //valida campos vacio
    if (datosEntrada == []) {
        valida = false;
    }

    //valida 
    if (datosEntrada == null || datosEntrada == " ") {
        valida = false;
    }

    if (datosEntrada == 0) {
        valida = false;
    }

    return (valida);

}

function validadorConMensaje(datosEntrada) {
    //valida si hay datos en el archivo
    if (datosEntrada == []) {
        valida = false;
    }

    //valida el renglon si está vacio o es nulo
    if (datosEntrada == null || datosEntrada == " ") {
        valida = false;
    }
    //Valida el tamaño de la cadena sea igual a cero
    if (datosEntrada.length == 0) {
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

    let almacenInvalido = true;

    let tarjetaTraspasos = "";

    //Contruyo renglones y procedo a limpiar los espacios para armar un renglon que pueda ser interpretado
    renglonArchivo = renglonArchivo.split('\n');


    renglonArchivo = limpiarArregloDeArchivo(renglonArchivo, banderaUbicacion);
    almacenInvalido = validador(renglonArchivo);

    if (almacenInvalido) {

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

                        //valida ats
                        if (indiceOrigen == sucursalOrigen) {
                            //Guarda el renglon en el arreglo origen
                            RENGLONES_ARMADOS_ORIGEN.push(renglonesArmados);

                        } else if (indiceOrigen == "V05") {
                            RENGLONES_ARMADOS_ORIGEN.push(renglonesArmados);
                        } else {

                            almacenInvalido = false;

                        }

                    } else if (banderaUbicacion == "destino") {

                        renglonesArmados = validaCampoReferencia(renglonArchivoTemporal);
                        tipoMovimientoDestino = obtenerSegmentoArreglo(renglonesArmados, 6, "|");
                        sucursalDestino = obtenerSegmentoArreglo(renglonesArmados, 4, "|");
                        indiceDestino = sucursalDestinoSelect.options[sucursalDestinoSelect.selectedIndex].value;

                        //valida cedis


                        if (indiceDestino == sucursalDestino) {
                            //Guarda el renglon en el arreglo destino
                            RENGLONES_ARMADOS_DESTINO.push(renglonesArmados);

                        } else if (indiceDestino == "V05") {
                            RENGLONES_ARMADOS_DESTINO.push(renglonesArmados);
                        } else {

                            almacenInvalido = false;

                        }

                        //RENGLONES_ARMADOS_DESTINO.push(validaCampoReferencia(renglonArchivoTemporal));
                    }

                    tarjetaTraspasos = tarjetaTraspasos + obtenerSegmentoArreglo(renglonesArmados, 3, "|") + //Fecha
                        "|" + obtenerSegmentoArreglo(renglonesArmados, 5, "|") + //Consecutivo o folio
                        "|" + obtenerSegmentoArreglo(renglonesArmados, 4, "|") + //Almacen origen
                        "|" + obtenerSegmentoArreglo(renglonesArmados, 7, "|") + "\n"; //Costo

                    renglonesConcatenados = renglonesConcatenados + renglonesArmados + "\n";


                } else {
                    continuarLectura = false;
                }
            }
        }

    }


    if (almacenInvalido == false) {
        alert(mensaje);
        inicializarVariablesTraspaso("origen");
        inicializarVariablesTraspaso("destino");
        limpiarErrores();

        renglonesConcatenados = "";
        almacenInvalido = true;
    }

    console.log("***************TRASPASOS DE " + banderaUbicacion + " CARGADOS*****************");
    console.log(renglonesConcatenados);
    return tarjetaTraspasos;


}

//Recibe una cadena y un parametro slice, el resultado lo retorna como arreglo
function construirArreglo(cadenaEntrada, caracterSplit) {
    let arregloContruido = [];

    arregloContruido = cadenaEntrada.split(caracterSplit);

    return arregloContruido;
}

//Recibe un renglon de un arreglo y lo limpia de espacios continuos dejando solo uno, despues 
//los cambia por "|"
function quitarEspacios(renglonArchivo) {
    let renglonArmado = "";
    let renglonArmadoArray = [];

    let validaConsDestino = true;

    let almacen = "";

    //Se ignoran los primeros 2 indices ya que son informacion basura
    renglonArmado = renglonArchivo.toString();
    renglonArmado = renglonArmado.replace(/\s+/g, '|');
    renglonArmado = renglonArmado.replace(/[,]+/g, '');

    almacen = obtenerSegmentoArreglo(renglonArmado, 4, "|");
    //if (indiceOrigen == "V05M" || indiceOrigen == "V05R" || indiceOrigen == "V05X" || indiceDestino == "V05M" || indiceDestino == "V05R" || indiceOrigen == "V05X") {
    if (almacen == "V05M" || almacen == "V05X" || almacen == "V05R" || almacen == "V05I") {
        renglonArmadoArray = construirArreglo(renglonArmado, "|");

        for (var x = 0; x <= 1; x++) {
            renglonArmadoArray.pop();
        }
        renglonArmado = renglonArmadoArray.toString();
        renglonArmado = renglonArmado.replace(/[,]+/g, '|') + "|";

    } else {
        renglonArmado = renglonArmado.slice(1);

        validaConsDestino = validaNumero(obtenerSegmentoArreglo(renglonArmado, 10, "|"));

        if (validaConsDestino == false) {
            renglonArmado = renglonArmado + "|";

        }
    }

    return renglonArmado;

}

//Recibe una cadena al cual se valida si se trata de un numero
function validaNumero(renglonArchivo) {
    let valida = false;


    if (renglonArchivo != "") {

        if (renglonArchivo.match(ExpRegSoloNumeros) != null) {
            valida = true;
        }

    }
    return (valida);
}

//Reconstruye el renglon buscando corregir el error del segmento referencia donde 
//durante el split segementa la referencia en dos partes
function validaCampoReferencia(arregloRenglon) {
    let arregloRenglonCadena = "";
    let arregloRenglonArray = [];
    let tamanoArreglo = 0;
    let segmento = "";
    let movimiento = "";

    cia = obtenerSegmentoArreglo(arregloRenglon, 1, "|");
    zona = obtenerSegmentoArreglo(arregloRenglon, 2, "|");
    fecha = obtenerSegmentoArreglo(arregloRenglon, 3, "|");
    alm = obtenerSegmentoArreglo(arregloRenglon, 4, "|");
    consec = obtenerSegmentoArreglo(arregloRenglon, 5, "|");
    tpo_tra = obtenerSegmentoArreglo(arregloRenglon, 6, "|");
    costo = obtenerSegmentoArreglo(arregloRenglon, 7, "|");

    primeraParteRenglon = cia + "|" + zona + "|" + fecha + "|" + alm + "|" + consec + "|" + tpo_tra + "|" + costo + "|";

    //Obtiene el consecutivo de destino
    cons_det = obtenerSegmentoArreglo(arregloRenglon, 10, "|");
    //Debe de ser vacio ya que no hay dato en ese segmento, en caso contrario la referencia se ha divido en dos O MAS segmentos.
    if (cons_det == "") {
        cons_det = " ";
    }

    //Valido que alm_det tenga un almacen valido
    alm_des = obtenerSegmentoArreglo(arregloRenglon, 9, "|");

    if (alm_des == "V01A" || alm_des == "V06A" || alm_des == "V07A" || alm_des == "V09A" || alm_des == "V10A" || alm_des == "V09P" ||
        alm_des == "V11A" || alm_des == "V12A" || alm_des == "V13A" || alm_des == "V14A" || alm_des == "V15A" ||
        alm_des == "V20A" || alm_des == "V25A" || alm_des == "V05M" || alm_des == "V05X" || alm_des == "V05I" || alm_des == "V05R") {

        referencia = obtenerSegmentoArreglo(arregloRenglon, 8, "|");
        cons_det = obtenerSegmentoArreglo(arregloRenglon, 10, "|");

        segundaParteRenglon = referencia + "|" + alm_des + "|" + cons_det + "|";

    } else {
        //Se convierte en arreglo la cadena recibida
        arregloRenglonArray = construirArreglo(arregloRenglon, "|");
        movimiento = arregloRenglonArray[5];

        //Limpia los primeros datos

        for (var x = 0; x <= 6; x++) {
            arregloRenglonArray.shift();
        }

        //Limpia los ultimos datos EN UN TRASAL
        if (movimiento == "TRASAL") {
            for (var y = 0; y <= 2; y++) {

                segmento = arregloRenglonArray.pop();

                if (y == 1) {
                    cons_det = segmento;
                }

                if (y == 2) {
                    alm_des = segmento;
                }
            }

        }

        //Limpia los ultimos datos EN UN TRAENT

        if (movimiento == "TRAENT") {
            for (var y = 0; y <= 3; y++) {

                segmento = arregloRenglonArray.pop();

                if (y == 2) {
                    cons_det = segmento;
                }

                if (y == 3) {
                    alm_des = segmento;
                }
            }

        }

        //arreglo restante es la referencia
        arregloRenglonCadena = arregloRenglonArray.toString();
        referencia = arregloRenglonCadena.replace(/[,]+/g, ' ');
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


    //if (RENGLONES_ARMADOS_ORIGEN[1] == "") {
    if (bandera == "origen") {
        traspasoOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[1], 6, "|");
        sucOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[1], 4, "|");

        if (sucOrigen == "V05M" || sucOrigen == "V05R" || sucOrigen == "V05X" || sucOrigen == "V05I") {
            sucOrigen = "V05 CEDIS";
        }

        document.getElementById("txtOrigen").textContent = traspasoOrigen + " de SUC: " + sucOrigen;

    }
    //}


    //if (RENGLONES_ARMADOS_DESTINO[1] == "") {
    if (bandera == "destino") {
        traspasoDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[1], 6, "|");
        sucDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[1], 4, "|");

        if (sucDestino == "V05M" || sucDestino == "V05R" || sucDestino == "V05X" || sucDestino == "V05I") {
            sucDestino = "V05";
        }


        document.getElementById("txtDestino").textContent = traspasoDestino + " de SUC: " + sucDestino;
    }
    // }

}








//FUNCIONES DE REGLA DE NEGOCIO.
/*Funcion de boton conciliar*/
function conciliar() {
    let reporte = "";
    let respuesta = "";



    //Valida si pertenece al cedis
    //D -> DESTINO
    //O -> ORIGEN

    if (indiceDestino == "V05") {
       respuesta = respuesta + cambiaAlmacen05("V05M", "D");
       respuesta = respuesta + cambiaAlmacen05("V05R", "D");
       //respuesta = respuesta + cambiaAlmacen05("V05S", "D");
       //respuesta = respuesta + cambiaAlmacen05("V05I", "D");
       //respuesta = respuesta + cambiaAlmacen05("V05X", "D");

    } else if (indiceOrigen == "V05") {
        respuesta = respuesta + cambiaAlmacen05("V05M", "O");
        respuesta = respuesta + cambiaAlmacen05("V05R", "O");
        //respuesta = respuesta + cambiaAlmacen05("V05S", "O");
        //respuesta = respuesta + cambiaAlmacen05("V05I", "O");
        //respuesta = respuesta + cambiaAlmacen05("V05X", "O");

    } else if (indiceOrigen != "V05" || indiceDestino != "V05") {
        //No pertenece al cedis
        mensaje = buscaConsDet();
        reporte = construyeReporte();
        respuesta = reporte + mensaje;
    }

    document.getElementById("txtTraspasosResultado").value = respuesta;

}

function cambiaAlmacen05(almacen, indice) {
    let respuesta = "";
    if (indice == "O") {
        indiceOrigen = almacen;
    }

    if (indice == "D") {
        indiceDestino = almacen;
    }

    mensaje = buscaConsDet();
    reporte = construyeReporte();
    respuesta = reporte + mensaje;

    return respuesta;

}

function construyeReporte() {
    let respuesta = "";

    respuesta = traspasoOrigen + " DE " + sucOrigen + "  VS  " + traspasoDestino + " DE " + sucDestino + "\n";
    respuesta = respuesta + "Encontrados en " + sucOrigen + ": " + contadorTraspasosOrigen + "  VS  " + "Encontrados en " + sucDestino + ": " + contadorTraspasosDestino + "\n";
    //respuesta = respuesta + validaConciliacion() + "\n";




    return respuesta;
}

function contarFrecuencias(arrayAlmacenesOrigen, arrayAlmacenesDestino) {

    let respuesta = true;

    contadorTraspasosOrigen = arrayAlmacenesOrigen.length;
    contadorTraspasosDestino = arrayAlmacenesDestino.length;

    if (contadorTraspasosOrigen != contadorTraspasosDestino) {
        respuesta = false;
    }

    return respuesta;
}

//Realiza la busqueda de los folios de origen en los folios de destino
function buscaConsDet() {
    let encontrado;

    let tipoMovAlmacenOrigen = "";
    let tipoMovAlmacenDestino = "";

    let almacenOrigenConciliar = "";
    let almacenDestinoConciliar = "";
    let arrayAlmacenesOrigen = [];
    let arrayAlmacenesDestino = [];

    let conciliacion;




    //Se obtiene tipo de movimiento de almacen en origen
    for (var r = 0; r <= RENGLONES_ARMADOS_ORIGEN.length - 1; r++) {
        //Obtiene el almecen de origen
        almacenOrigenConciliar = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[r], 9, "|");
        //obtengo el tipo de movimeinto del almacen de origen
        tipoMovAlmacenOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[r], 6, "|");

        //Tipo de movimiento trasal en origen
        if (tipoMovAlmacenOrigen == "TRASAL") {



            //Realiza una depuracion de los almacenes, SE BUSCA EL ALMACEN QUE ESTA EN DESTINO DENTRO DE ORIGEN
            if (almacenOrigenConciliar == indiceDestino) {

                arrayAlmacenesOrigen.push(RENGLONES_ARMADOS_ORIGEN[r]);
                //consecOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[i], 5, "|");
            }


        }

        //Tipo de movimiento traent en origen
        if (tipoMovAlmacenOrigen == "TRAENT") {

            if (almacenOrigenConciliar == indiceDestino) {
                arrayAlmacenesOrigen.push(RENGLONES_ARMADOS_ORIGEN[r]);
                //consecOrigen = obtenerSegmentoArreglo(RENGLONES_ARMADOS_ORIGEN[i], 10, "|");
            }
        }
    }


    //Se obtiene tipo de movimiento de almacen en destino
    for (var y = 0; y <= RENGLONES_ARMADOS_DESTINO.length - 1; y++) {

        //Obtiene el almecen destino
        almacenDestinoConciliar = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 9, "|");

        //obtengo el tipo de movimeinto del almacen destino
        tipoMovAlmacenDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 6, "|");

        //Tipo de movimiento trasal en destino
        if (tipoMovAlmacenDestino == "TRASAL") {

            if (almacenDestinoConciliar == indiceOrigen) {
                //consecDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 5, "|");
                arrayAlmacenesDestino.push(RENGLONES_ARMADOS_DESTINO[y]);
            }

        }
        //Tipo de movimiento traent en destino
        if (tipoMovAlmacenDestino == "TRAENT") {

            if (almacenDestinoConciliar == indiceOrigen) {
                //consecDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 5, "|");
                arrayAlmacenesDestino.push(RENGLONES_ARMADOS_DESTINO[y]);
            }
            //consecDestino = obtenerSegmentoArreglo(RENGLONES_ARMADOS_DESTINO[y], 10, "|");
        }

    }

    //Cuenta traspasos encontrados en cada uno de los archivos.

    encontrado = contarFrecuencias(arrayAlmacenesOrigen, arrayAlmacenesDestino);

    if (encontrado == true) {

        //Valida el consecutivo de origen vs el consecutivo de destino

        if (tipoMovAlmacenOrigen == "TRAENT") {

        }

        if (tipoMovAlmacenOrigen == "TRASAL") {

        }

        //Valida la sumatoria total de los traspasos

        conciliacion = true;


    } else {
        //Error en la conciliacion
        //Se procede a buscar el folio no encontrado
        conciliacion = false;
        mensaje = "\n Error: Diferencia en Folios \n";

        //Valida si devuelve algun resultado en la busqueda de los folios.

        mensaje = mensaje + muestraTraspasosConciliados(arrayAlmacenesOrigen, arrayAlmacenesDestino);
        mensaje = mensaje + muestraTraspasosConciliados(arrayAlmacenesDestino, arrayAlmacenesOrigen);

    }

    if (conciliacion == true) {
        mensaje = "Conciliacion exitosa \n" + mensaje;
    }

    if (conciliacion == false) {
        mensaje = mensaje + "CONCILIACION FALLIDA :(";
    }

    return mensaje;
}


function muestraTraspasosConciliados(arrayAlmacenesOrigen, arrayAlmacenesDestino) {
    let consecOrigen = "";
    let consecDestino = "";
    let respuesta = "";
    let tipoMovimientoOrigen = obtenerSegmentoArreglo(arrayAlmacenesOrigen[1], 6, "|");
    let tipoMovimientoDestino = obtenerSegmentoArreglo(arrayAlmacenesDestino[1], 6, "|");
    let borrado = "";
    let contruirRenglonOrigen = "";
    let contruirRenglonDestino = "";
    let encontrado = false;
    let z = 0;

    //Valida el consecutivo de origen vs el consecutivo de destino
    for (var x = 0; x <= arrayAlmacenesOrigen.length - 1; x++) {
        //Inicializa variable de busqueda
        encontrado = false;
        //obtengo consecutivo de origen de acuerdo al tipo de movimiento
        if (tipoMovimientoOrigen == "TRAENT") {
            consecOrigen = obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 10, "|");
        }
        if (tipoMovimientoOrigen == "TRASAL") {
            consecOrigen = obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 5, "|");
        }

        //obtengo consecutivo de destino de acuerdo al tipo de movimiento
        while (encontrado == false && z <= arrayAlmacenesDestino.length - 1) {

            if (tipoMovimientoDestino == "TRAENT") {
                consecDestino = obtenerSegmentoArreglo(arrayAlmacenesDestino[z], 10, "|");
            }
            if (tipoMovimientoDestino == "TRASAL") {
                consecDestino = obtenerSegmentoArreglo(arrayAlmacenesDestino[z], 5, "|");
            }


            if (consecOrigen == consecDestino) {

                contruirRenglonOrigen = obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 3, "|") + "|" + obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 5, "|") + "|" + obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 7, "|");
                contruirRenglonDestino = obtenerSegmentoArreglo(arrayAlmacenesDestino[z], 3, "|") + "|" + obtenerSegmentoArreglo(arrayAlmacenesDestino[z], 5, "|") + "|" + obtenerSegmentoArreglo(arrayAlmacenesDestino[z], 7, "|");
                //respuesta = respuesta + contruirRenglonOrigen + "  " + contruirRenglonDestino + "\n";

                //borrado = arrayAlmacenesOrigen.pop();
                encontrado = true;

            }
            z++;
        }

        if (encontrado == false) {
            contruirRenglonOrigen = obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 3, "|") + "|" + obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 5, "|") + "|" + obtenerSegmentoArreglo(arrayAlmacenesOrigen[x], 7, "|");
            contruirRenglonDestino = "No encontrado";
            respuesta = respuesta + contruirRenglonOrigen + "  " + contruirRenglonDestino + "\n";

        }
    }

    //Responde FOLIOS ENCONTRADOS + FOLIOS NO ENCONTRADOS
    return respuesta;

}