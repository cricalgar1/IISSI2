"use strict";
import { vinculoRenderer } from "/js/renderers/usuariosVinc.js";
import { fotosAPI_auto } from "/js/api/_fotos.js";
import { vinculosusuariosAPI_auto } from "/js/api/_vinculosusuarios.js";
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

            amistades = amistades.filter(amistad => amistad.fechaRevocacion !== null);

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
                else if (usuarioId === emisorId && sinAceptar.includes(vinculoId)) {
                    idAmigos.push(receptorId);
                }
            }

            console.log(idAmigos);


                // Obtenemos los usuarios amigos
            let amigos = usuarios.filter(amistad => amistad.usuarioId !== usuarioId && idAmigos.includes(amistad.usuarioId));

                // Miramos si hay algun amigo
            if (amigos.length === 0) {
                noVinculos(contenedor);
                
            } else {

                let tarjetas = vinculoRenderer.asRevocado(amigos, fotos);
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
                                <h5>No tienes ningun vinculo revocado por el momento.</h5>
                                <br>
                                <h4>¡Esperemos que asi siga!</h4>
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




document.addEventListener("DOMContentLoaded", main);