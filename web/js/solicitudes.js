"use strict";
import { vinculoRenderer } from "/js/renderers/usuariosVinc.js";
import { vinculosusuariosAPI_auto } from "/js/api/_vinculosusuarios.js";
import { fotosAPI_auto } from "/js/api/_fotos.js";
import {vinculosAPI_auto} from "/js/api/_vinculos.js";
import {usuariosAPI_auto} from "/js/api/_usuarios.js";
import { amistadesAPI_auto } from "/js/api/_amistades.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { sessionManager } from "/js/utils/session.js";
import { parseHTML } from "/js/utils/parseHTML.js";

async function main() {
    cargaVinculos();
}

async function cargaVinculos() {
    let contenedor = document.getElementById("usuarioVinc");
    try {

        if (sessionManager.isLogged()) {
            let fotos = await fotosAPI_auto.getAll();
            let amistades = await vinculosAPI_auto.getAll();
            let vincusrs = await vinculosusuariosAPI_auto.getAll();
            let usuarios = await usuariosAPI_auto.getAll();
            let idAmigos = [];
            let sinAceptar = [];
            let usuarioId = sessionManager.getLoggedUser().usuarioId;
            //let usuarioId = 6;

            vincusrs = vincusrs.filter(vinc => vinc.emisorId === usuarioId || vinc.receptorId === usuarioId);

            amistades = amistades.filter(amistad => amistad.fechaAceptacion === null && amistad.fechaRevocacion === null);

            for(let amistad of amistades){
            let vinculoId = amistad.vinculoId;
                sinAceptar.push(vinculoId);
            }
                // Obtenemos los id de los amigos
            for (let vinculo of vincusrs) {
                let receptorId = vinculo.receptorId;
                let emisorId = vinculo.emisorId;
                let vinculoId = vinculo.vinculoId;

                if (usuarioId === receptorId && sinAceptar.includes(vinculoId)) {
                    idAmigos.push(emisorId);
                }
            }

            console.log(idAmigos);


                // Obtenemos los usuarios amigos
            let amigos = usuarios.filter(amistad => amistad.usuarioId !== usuarioId && idAmigos.includes(amistad.usuarioId));

                // Miramos si hay algun amigo
            if (amigos.length === 0) {
                noVinculos(contenedor);
                
            } else {

                let tarjetas = vinculoRenderer.asSolicitud(amigos, fotos);
                contenedor.appendChild(tarjetas);
            }
            
        } else {
            iniciaSesion(contenedor);
        }

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error al cargar los vinculos", err);
    }
}

function iniciaSesion(contenedor) {
    let texto = 'Tienes que estar logueado para ver tus vinculos';

    let html = `<div class="d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-4">
                        <main>
                            <div>
                                <h4> ${texto}</h4>
                                <br>
                                <a href="/login.html" class="btn btn-primary">Login</a>
                                <a href="/register.html" class="btn btn-primary">Registro</a>
                            </div>
                        </main>
                    </div>
                    <img class="img-fluid w-50 d-none d-sm-block" src="images/necesitaLogin.svg" alt="">
                </div`;

    let res = parseHTML(html);

    contenedor.appendChild(res);
}

function noVinculos(contenedor) {
    
    let html = `<div class="d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-4">
                        <main>
                            <div>
                                <h5>Esto está un poco vacío.</h5>
                                <h5>No tienes ninguna solicitud de amistad por el momento.</h5>
                                <br>
                                <h4>¡Manda solicitudes a tus amigos!</h4>
                            </div>
                        </main>
                    </div>
                    <img class="img-fluid w-50 d-none d-sm-block" src="images/noFotos.svg" alt="">
                </div`;

    let res = parseHTML(html);

    contenedor.appendChild(res);
}

/*
function turnInactive(amigo){
    let usuariosvinculos = await usuariosAPI_auto.getAll();
    let conexiones = usuariosvinculos.filter(camistad => c.emisorId !== usuarioId && idAmigos.includes(amistad.usuarioId));
}
*/

function aceptaSolicitud(id){
    if(confirm("¿Seguro que quieres aceptar esta solicitud?")){
        on(id);
    }
    else{
        console.log("Vinculo no creado");
    }
}
window.aceptaSolicitud=aceptaSolicitud;

async function on(id){
    let hoy = new Date();
    let fecha = hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
    console.log(hoy);
    let vincusrs = await vinculosusuariosAPI_auto.getAll();
    let amistades2 = await vinculosAPI_auto.getAll();
    //let usuarioId = 6;
    let usuarioId = sessionManager.getLoggedUser().usuarioId;
    let receptor = id;
    let emisor = usuarioId;
    let intermed = vincusrs.find(vinc => (vinc.emisorId === emisor && vinc.receptorId === receptor) || (vinc.emisorId === receptor && vinc.receptorId === emisor));
    let vinculof = amistades2.find(ami => ami.vinculoId === intermed.vinculoId);

    let fecha2 = new Date(vinculof.fecha);
    console.log(fecha2);
    let nuevaFecha = fecha2.getYear() + "-" + (fecha2.getMonth() + 1) + "-" + fecha2.getDate();
   
    if(sessionManager.getLoggedUser().fechaBaja !== null){
        alert("no puedes aceptar solicitudes dado de baja");
    }
    else{
        let vinculo = {
            activo: 1,
            fecha: nuevaFecha,
            fechaAceptacion : fecha,
            /*fechaRevocacion: null*/
        }
    
        let nuevosDatos = new FormData();
    
        for (let clave in vinculo) {
            nuevosDatos.append(clave, vinculo[clave]);
        }
    
        try {
            await vinculosAPI_auto.update(nuevosDatos, vinculof.vinculoId);
            location.reload();
        } catch (err) {
            alert("Ha habido un error al aceptar la solicitud.")
        }
    }
}

window.on=on;


function rechazaSolicitud(id){
    if(confirm("¿Seguro que quieres rechazar esta solicitud?")){
        descart(id);
    }
    else{
        console.log("Solicitud no rechazada");
    }
}
window.rechazaSolicitud=rechazaSolicitud;

async function descart(id){
    let vincusrs = await vinculosusuariosAPI_auto.getAll();
    let amistades2 = await vinculosAPI_auto.getAll();
    //let usuarioId = 6;
    let usuarioId = sessionManager.getLoggedUser().usuarioId;
    let receptor = id;
    let emisor = usuarioId;
    let intermed = vincusrs.find(vinc => (vinc.emisorId === emisor && vinc.receptorId === receptor) || (vinc.emisorId === receptor && vinc.receptorId === emisor));
    let vinculof = amistades2.find(ami => ami.vinculoId === intermed.vinculoId);

    if(sessionManager.getLoggedUser().fechaBaja !== null){
        alert("no puedes rechazar solicitudes dado de baja");
    }
    else{
        try {
            await vinculosusuariosAPI_auto.delete(intermed.vinculoUsuarioId);
            await vinculosAPI_auto.delete(vinculof.vinculoId);
            location.reload();
        } catch (err) {
            alert("Ha habido un error al rechazar la solicitud.")
        }
    }
}
window.descart=descart;



document.addEventListener("DOMContentLoaded", main);