"use strict";
import { usuariosAPI_auto } from "/js/api/_usuarios.js";
import { fotosAPI_auto } from "/js/api/_fotos.js";
import { vinculosAPI_auto } from "/js/api/_vinculos.js";
import { vinculosusuariosAPI_auto } from "/js/api/_vinculosusuarios.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { perfilRendererBasico } from "/js/renderers/perfil.js";
import { sessionManager } from "/js/utils/session.js";

async function main() {
    console.log("Fuera");
    cargarUsuarios();
}

async function cargarUsuarios() {
    let galleryContainer = document.getElementById("hola");
        try {
            let usuario = await usuariosAPI_auto.getAll();
            let fotos = await fotosAPI_auto.getAll();
            console.log(usuario, fotos);
            for(let u of usuario){
                let card = perfilRendererBasico.asCard(u,fotos);
                galleryContainer.appendChild(card);
            }
        } catch (err) {
            messageRenderer.showErrorAsAlert("Error", err);    
        }
}

async function creaSolicitud(id){
    let hoy = new Date();
    let usuario = await usuariosAPI_auto.getAll();
    let fecha = hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
    let vincusrs = await vinculosusuariosAPI_auto.getAll();
    let vinculos = await vinculosAPI_auto.getAll();
    let nuevoId = vinculos.length+1;
    console.log(nuevoId);

    //Modificamos la url para que pueda entrar bien en la BBDD
    //let usuarioId = 6;
    let usuarioId = sessionManager.getLoggedUser().usuarioId;
    let emisor = usuarioId;
    let receptor = id;

    usuario = usuario.find(u => u.usuarioId === id);

    let intermed = vincusrs.find(vinc => (vinc.emisorId === emisor && vinc.receptorId === receptor) || (vinc.emisorId === receptor && vinc.receptorId === emisor));
    
    if(intermed === undefined){
           

        if(usuario.fechaBaja !== null){
            alert("no puedes enviar solicitudes a un usuario dado de baja");
        }
        else if(sessionManager.getLoggedUser().fechaBaja !== null){
            alert("no puedes enviar solicitudes dado de baja");
        }

        else{
            let vinculo = {
                activo: 0,
                fecha: fecha,
                /*fechaAceptacion: null,
                fechaRevocacion: null*/
            }
            console.log(vinculo);
    
            let vinculoUsrs = {
                vinculoId: nuevoId,
                emisorId: usuarioId,
                receptorId: receptor
            }
    
    
            let vinculoCreado = new FormData();
            for (let clave in vinculo) {
                console.log(clave,", ", vinculo[clave]);
                vinculoCreado.append(clave, vinculo[clave]);
            }
    
            let vinculoUsrsCreado = new FormData();
            for (let clave in vinculoUsrs) {
                vinculoUsrsCreado.append(clave, vinculoUsrs[clave]);
            }
            
    
            //Subimos la foto a la BBDD
            try {
                await vinculosAPI_auto.create(vinculoCreado);
                await vinculosusuariosAPI_auto.create(vinculoUsrsCreado);
                location.reload();
            } catch (err) {
                alert("Ha habido un error al crear el vinculo")
            }
        }
    }
    else{

        let vinculox = vinculos.find(v => v.vinculoId === intermed["vinculoId"]);

        if(vinculox.activo===1){
            alert("Ya tienes un vinculo con este usuario");
        }

        else if(usuario.fechaBaja !== null){
            alert("no puedes enviar solicitudes a un usuario dado de baja");
        }
        else if(sessionManager.getLoggedUser().fechaBaja !== null){
            alert("no puedes enviar solicitudes dado de baja");
        }

        else{
            let vinculoUsrs = {
                vinculoId: intermed["vinculoId"],
                emisorId: usuarioId,
                receptorId: target["usuarioId"]
            }
            let vinculoUsrsModificado = new FormData();
            for (let clave in vinculoUsrs) {
                vinculoUsrsModificado.append(clave, vinculoUsrs[clave]);
            }

            let vinculo = {
                activo: 0,
                fecha: fecha,
                /*fechaAceptacion: null,
                fechaRevocacion: null*/
           }

           let nuevosDatos = new FormData();

            for (let clave in vinculo) {
                nuevosDatos.append(clave, vinculo[clave]);
            }
            console.log(intermed["vinculoId"]);

            try {
                await vinculosusuariosAPI_auto.update(vinculoUsrsModificado, intermed["vinculoUsuarioId"]);
                await vinculosAPI_auto.update(nuevosDatos, intermed["vinculoId"]);
                location.reload();
            } catch (err) {
                alert("Ha habido un error al modificar el vinculo.");
            }
        }
    }
        
}

window.creaSolicitud=creaSolicitud;


document.addEventListener("DOMContentLoaded", main);
