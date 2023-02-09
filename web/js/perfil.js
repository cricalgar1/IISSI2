"use strict";

import { fotosAPI_auto } from "/js/api/_fotos.js";
import { usuariosAPI_auto } from "/js/api/_usuarios.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { sessionManager } from "/js/utils/session.js";
import { galleryRenderer } from "/js/renderers/galeria.js";
import { dataRenderer } from "/js/renderers/datosPerfil.js";
import { parseHTML } from "/js/utils/parseHTML.js";
import { modalesRenderer } from "/js/renderers/modalesPerfil.js";

import { usuariosaficionesAPI_auto } from "/js/api/_usuariosaficiones.js";
import { aficionesAPI_auto } from "/js/api/_aficiones.js";

let contenedorFotos = document.getElementById("fotos");
let contenedorDatos = document.getElementById("datos");

let urlParams = new URLSearchParams(window.location.search);
let usuarioId = urlParams.get("usuarioId");
let numMaxFotos = 5;
let id = sessionManager.getLoggedUser().usuarioId;

let numMes = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12};


async function main() {
    //Si no es igual a null significa que el usuario ha clickado en el nombre de un perfil (en el feed)
    if(usuarioId!==null){
        id = usuarioId;
    }

    cargaPag();
}

async function cargaPag() {

    try {
        let fotos = await fotosAPI_auto.getAll();
        let infoUsuario = await usuariosAPI_auto.getById(id);

        //Nos quedamos con las fotos del usuario
        fotos = fotos.filter(foto => foto.usuarioId == id);
        let numFotos = fotos.length;

        //Tomamos la foto de perfil del usuario
        let fotoPerfil = fotos.filter(foto => foto.fotoPerfil === 1);
        if (fotoPerfil.length === 0) {
            fotoPerfil = "/web/images/user.png";
        } else {
            fotoPerfil = "https://" + fotoPerfil[0].urlFoto;
        }

        let aficiones= await cargaAficionesPerfil();

        //Cargamos los datos del usuario
        let datos = dataRenderer.asData(infoUsuario, fotoPerfil,aficiones);
        contenedorDatos.appendChild(datos);
        await opcionesFotoPerfil(fotos);

        //Cargamos las fotos
        let tarjetas = galleryRenderer.asCardPerfil(fotos);
        contenedorFotos.appendChild(tarjetas);

        //Escondemos el botón de añadir foto si el usuario está en el perfil de otra persona
        if(usuarioId!== null){
            let botonAñadir = document.getElementById("botonAñadir");
            botonAñadir.style.display = "none";
            
            let botonCambiarFotoPerfil = document.getElementById("botonCambiarFoto");
            botonCambiarFotoPerfil.style.display = "none";

            for(let foto of fotos){
                let idDiv = "botonesFotos" + foto.fotoId;
                let botonesFotos = document.getElementById(idDiv);
                botonesFotos.style.display = "none";
            }
            
        }else{
            //Cargamos los modales en función del número de fotos que tengamos
            let contModales = document.getElementById("modales");
            let modalAñadirFoto = modalesRenderer.modalAñadirFoto(numFotos, numMaxFotos);
            contModales.appendChild(modalAñadirFoto);

            //Evento de campo de texto url, que aparece en el modal en el que puedes subir foto
            if (numFotos < numMaxFotos) {
                let formulario = document.getElementById("formularioAñadirFoto");
                formulario.onsubmit = checkFormulario;
                document.getElementById("url").addEventListener("change", previsualizar);
            }
        }

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error al cargar las fotos");
    }
}

function previsualizar() {

    //Tomamos el valor del campo de texto
    let url = document.getElementById("url").value;

    let contOpciones = document.getElementById("opciones");

    //Insertamos el valor en el campo src de img para que se muestre y
    // en caso de error que vaya a la función noExiste
    let imagen = document.getElementById("preview");
    imagen.src = url;
    imagen.onerror = noExiste;

    let res = document.getElementById("mensaje");
    if (res.firstChild !== null) {
        res.removeChild(res.firstChild);
        imagen.style.visibility = "visible";
    }

    //Si la imagen existe, la mostramos y eliminamos el mensaje de que no existe (si se hubiera puesto)
    if (imagen.style.visibility === "visible" || imagen.style.visibility === "") {
        if (contOpciones.firstChild === null) {
            contOpciones.appendChild(modalesRenderer.opcionesFotos());

        }
    }

}

function noExiste() {

    //Escondemos la imagen para que no salga el icono de imagen y los campos para rellenar
    let imagen = document.getElementById("preview");
    imagen.style.visibility = "hidden";

    if (document.getElementById("campos") !== null) {
        let contOpciones = document.getElementById("opciones");
        contOpciones.removeChild(document.getElementById("campos"));
    }

    //Escribimos el mensaje de que no existe la imagen
    let contMensaje = document.getElementById("mensaje");
    if (contMensaje.firstChild === null) {
        let mensaje = `
            <div class="mb-3" id="mensaje">
                <h6 style="color:red;">La imagen no existe</h6>
            </div>`;

        mensaje = parseHTML(mensaje);
        contMensaje.appendChild(mensaje);
    }
}

//CHECKEA EL FORMULARIO
function checkFormulario(event) {
    event.preventDefault();
    let form = event.target;

    let formData = new FormData(form);

    //Si formData tienen todos los campos llamamos a la función de subir foto
    if (formData.has("url") && formData.has("descripcion") && formData.has("titulo")) {
        enviarFoto(formData);
    }
}

//ENVIAR FOTO A LA BBDD
async function enviarFoto(formData) {
    let hoy = new Date();
    let fecha = hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();

    //Modificamos la url para que pueda entrar bien en la BBDD
    let url = formData.get("url");
    if (url.startsWith("https://") === true) {
        url = url.replace("https://", "");
    }

    //Creamos object de la foto
    let foto = {
        usuarioId: id,
        urlFoto: url,
        nombre: formData.get("titulo"),
        descripcion: formData.get("descripcion"),
        fechaPublicacion: fecha,
        fotoPerfil: 0
    }

    //Creamos un formData a partir del object anterior
    let fotoCreada = new FormData();
    for (let clave in foto) {
        fotoCreada.append(clave, foto[clave]);
    }

    //Subimos la foto a la BBDD
    try {
        await fotosAPI_auto.create(fotoCreada);
        location.reload();
    } catch (err) {
        alert("Ha habido un error al enviar la foto.")
    }
}

async function cargaAficionesPerfil(){
    //Cargamos el div donde mostraremos las aficiones
    let div=[];
    //Cogemos las aficiones de todos los usuarios
    let aficionesUsuarios = await usuariosaficionesAPI_auto.getAll();

    let aficionesUs;
    let elemento;

    //Nos quedamos con la del usuarios logeado
    for(let a of aficionesUsuarios){
        if(a.usuarioId == id) aficionesUs=a; 
        
    }
    console.log(id);
    
    //Cogemos todas las aficiones de la base de datos
    let aficiones = await aficionesAPI_auto.getAll();
    if(aficionesUs != undefined){    
        //Si solo tiene una aficion
        if(aficionesUs.length=1){
            //Vamos iterando cada una de las aficiones
            for(let a of aficiones){
                //Cogemos la aficion con el mismo id que la del usuario 
                if(a.aficionId == aficionesUs.aficionId) elemento= a;
               
            }
           
            //Agregamos al array la aficion
            div.push(elemento.nombre);

        //Si tiene mas de una aficion
        }else if(aficionesUs.length > 1){
            //Vamos iterando por cada una de las aficiones
            for(let e of aficionesUs){

                //Vamos iterando cada una de las aficiones
                for(let a of aficiones){
                    //Cogemos la aficion con el mismo id que la del usuario 
                    if(a.aficionId == e.aficionId) elemento= a;

                    div.push(elemento.nombre);
                }
            }
        }
    //Si no tiene aficiones
    }else{
        //Agregamos al array la cadena de texto
        let res="Parece que no tiene aficiones" ;
        div.push(res);        
    }

    console.log(div)
    return div;
}

//CARGA LAS OPCIONES DE CAMBIAR LA FOTO DE PERFIL Y AÑADE EVENTOS A LOS BOTONES
async function opcionesFotoPerfil(fotos){
    let opciones = document.getElementById("opcionesFotoPerfil");


    for(let i=0; i<fotos.length; i++){

        //Añadimos la opción
        let html = `<li><a class="dropdown-item">Foto ${i+1}</a></li>`;
        let opcion = parseHTML(html);
        opciones.appendChild(opcion);

        //Le damos acción
        opcion.addEventListener("click", function(){
            try{

                //Actualizamos el campo fotoPerfil a 1 de la opción seleccionada y lo subimos a la base de datos
                fotos[i].fotoPerfil=1;
                
                fotosAPI_auto.update(fotoModificada(fotos[i]), fotos[i].fotoId);

                //Actualizamos el campo fotoPerfil a 0 de las demás fotos
                for(let j=0; j<fotos.length; j++){
                    if(j!=i && fotos[j].fotoPerfil==1){
                        fotos[j].fotoPerfil=0;
                        fotosAPI_auto.update(fotoModificada(fotos[j]), fotos[j].fotoId); 
                    }
                }
                location.reload();

            }catch(err){
                alert("Ha habido un error al modificar la foto de perfil");
            }
        });
    }

    let barra = parseHTML(`<li><hr class="dropdown-divider"></li>`);
    opciones.appendChild(barra);

    //Igual que antes pero con la opción default (ponemos todas las fotos con fotoPerfil a 0)
    let fotoDefault = document.getElementById("default");
    fotoDefault.addEventListener("click", function(){
        for(let i=0; i<fotos.length; i++){
            if(fotos[i].fotoPerfil==1){
                fotos[i].fotoPerfil=0;
                try{
                    fotosAPI_auto.update(fotoModificada(fotos[i]), fotos[i].fotoId);
                }catch(err){
                    alert("Ha habido un error al modificar la foto de perfil");
                }
            }
        }

        location.reload();
    });
}

//Función auxiliar de opcionesFotoPerfil
function fotoModificada(foto){
    let fotoCreada = new FormData();
    for (let clave in foto) {
        fotoCreada.append(clave, foto[clave]);
    }

    //Cambiamos el formato de la fecha para que pueda entrar bien en la bbdd (Formato: YYYY-MM-DD)
    fotoCreada.set("fechaPublicacion", fotoCreada.get("fechaPublicacion").split(", ")[1].split("00:00:00")[0]);
    let fecha = fotoCreada.get("fechaPublicacion").split(" ");
    let dia = fecha[0];
    let mes = numMes[fecha[1]];
    let anho = fecha[2];

    fotoCreada.set("fechaPublicacion", anho + "-" + mes + "-" + dia);

    return fotoCreada;
}

document.addEventListener("DOMContentLoaded", main);
