"use strict";

import { sessionManager } from "/js/utils/session.js";
import { usuariosAPI_auto } from "/js/api/_usuarios.js";

let id = sessionManager.getLoggedUser().usuarioId;

let numMes = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12};


async function main(){
    console.log("sljf");
    darBaja();
}

async function darBaja(){
    let boton = document.getElementById("baja");
    boton.addEventListener("click", accion);
}

async function accion(){
    let usuario = await usuariosAPI_auto.getById(id);
    let fd = new FormData();
    for(let clave in usuario){
        fd.append(clave, usuario[clave]);
    }

    //Cambiamos el formato de la fecha de alta y de nacimiento
    cambiarFormatoFecha(fd, "fechaAlta");
    cambiarFormatoFecha(fd, "fechaNacimiento");

    //Cambiamos el formato de la fecha de baja
    let mes = new Date().getMonth() + 1;
    let dia = new Date().getDate();
    let anio = new Date().getFullYear();
    let fechaBaja = anio + "-" + mes + "-" + dia;
    fd.set("fechaBaja", fechaBaja);
    
    //Print the form data on the console
    for(let pair of fd.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
    }

    try{
        await usuariosAPI_auto.update(fd, id);
        alert("Usuario dado de baja correctamente.");
        sessionManager.logout();
        window.location.href = "/login.html";
    }catch(error){
        alert("No ha sido posible dar de baja al usuario");
    }
}

function cambiarFormatoFecha(formData, tipoFecha){
    formData.set(tipoFecha, formData.get(tipoFecha).split(", ")[1].split("00:00:00")[0]);
    let fecha = formData.get(tipoFecha).split(" ");
    let dia = fecha[0];
    let mes = numMes[fecha[1]];
    let anho = fecha[2];

    formData.set(tipoFecha, anho + "-" + mes + "-" + dia);
}

document.addEventListener("DOMContentLoaded", main);