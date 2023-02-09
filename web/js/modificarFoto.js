"use strict"

import { fotosAPI_auto } from "/js/api/_fotos.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { photoRenderer } from "/js/renderers/fotos.js";

let urlParams = new URLSearchParams(window.location.search);
let fotoId = urlParams.get("fotoId");
let contenedor = document.getElementById("foto");

let fotoElegida;

let numMes = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12};

async function main(){
    cargaDatosFotos();
}

async function cargaDatosFotos(){
    try{
        let foto = await fotosAPI_auto.getById(fotoId);
        fotoElegida = foto;

        let card = photoRenderer.asCardModificar(foto);
        console.log(card);
        contenedor.appendChild(card);

        let formulario = document.getElementById("formulario");
        formulario.onsubmit = hacerCambios;

        let botonEliminar = document.getElementById("eliminar");
        botonEliminar.addEventListener("click", eliminarFoto);


    }catch(err){
        messageRenderer.showErrorAsAlert("Error al cargar los datos de la publicación.");
    }
}

async function hacerCambios(event){
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);


    for(let clave in fotoElegida){
        console.log(clave +" - " + fotoElegida[clave]);
        formData.append(clave, fotoElegida[clave]);
    }

    formData.set("nombre", document.getElementById("titulo").value);
    formData.set("descripcion", document.getElementById("descripcion").value);

    //Cambiamos el formato de la fecha para que pueda entrar bien en la bbdd (Formato: YYYY-MM-DD)
    formData.set("fechaPublicacion", formData.get("fechaPublicacion").split(", ")[1].split("00:00:00")[0]);
    let fecha = formData.get("fechaPublicacion").split(" ");
    let dia = fecha[0];
    let mes = numMes[fecha[1]];
    let anho = fecha[2];

    formData.set("fechaPublicacion", anho + "-" + mes + "-" + dia);

    try{
        await fotosAPI_auto.update(formData, fotoId);
        window.location.href = "/web/perfil2.html";
    }catch(err){
        messageRenderer.showErrorAsAlert("Error al modificar la publicación.");
    }

}

async function eliminarFoto(){
    let respuesta = confirm("¿Estás seguro de que quieres eliminar esta publicación?");

    if(respuesta){
        try{
            await fotosAPI_auto.delete(fotoId);
            window.location.href = "/web/perfil2.html";
        }catch(err){
            messageRenderer.showErrorAsAlert("Error al eliminar la publicación.");
        }
    }
}

document.addEventListener("DOMContentLoaded", main);