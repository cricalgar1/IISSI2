"use strict";
import { galleryRenderer } from "/js/renderers/galeria.js";
import { fotosconusuariosAPI_auto } from "/js/api/_fotosconusuarios.js";
import { amistadesAPI_auto } from "/js/api/_amistades.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { sessionManager } from "/js/utils/session.js";
import { parseHTML } from "/js/utils/parseHTML.js";



async function main() {
    cargaFotos();
}

async function cargaFotos() {
    let contenedor = document.getElementById("galeria");

    try {

        if (sessionManager.isLogged()) {
            let fotos = await fotosconusuariosAPI_auto.getAll();
            let fotosPerfil = {};
            let amistades = await amistadesAPI_auto.getAll();
            let idAmigos = [];
            let usuarioId = sessionManager.getLoggedUser().usuarioId;
            //let usuarioId = 4;

            // Obtenemos los id de los amigos
            for (let amistad of amistades) {
                let receptorId = amistad.receptorId;
                let emisorId = amistad.emisorId;

                if (usuarioId === emisorId) {
                    idAmigos.push(receptorId);
                } else if (usuarioId === receptorId) {
                    idAmigos.push(emisorId);
                }
            }

            console.log(idAmigos);

            // Obtenemos las fotos de los amigos (fotos que se mostrarán)
            fotos = fotos.filter(foto => foto.usuarioId !== usuarioId && idAmigos.includes(foto.usuarioId) && foto.fechaBaja != null);

            // Miramos si hay alguna foto que mostrar
            if (fotos.length === 0) {
                noFotos(contenedor);
            
            } else {
                // Obtenemos las fotos de perfil
                for (let foto of fotos) {
                    if (foto.fotoPerfil === 1) {
                        fotosPerfil[foto.nombreUsuario] = foto.urlFoto;
                    }
                }

                let tarjetas = galleryRenderer.asCardFeed(fotos, fotosPerfil);
                contenedor.appendChild(tarjetas);
            }
          
        
        } else {
             iniciaSesion(contenedor);
        }

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error al cargar las fotos", err);
    }
}

function iniciaSesion(contenedor) {
    let texto = 'Tienes que estar logueado para ver las fotos';

    let html = `<div class="d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-4">
                        <main>
                            <div>
                                <h4> ${texto}</h4>
                                <br>
                                <a href="/login.html" class="btn btn-primary iniciaSesion">Login</a>
                                <a href="/register.html" class="btn btn-primary iniciaSesion">Registro</a>
                            </div>
                        </main>
                    </div>
                    <img class="img-fluid w-50 d-none d-sm-block" src="images/necesitaLogin.svg" alt="">
                </div`;

    let res = parseHTML(html);

    contenedor.appendChild(res);
}

function noFotos(contenedor) {
    let texto = 'Tienes que estar logueado para ver las fotos';

    let html = `<div class="d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-4">
                        <main>
                            <div>
                                <h5>Esto está un poco vacío.</h5>
                                <h5>Parece que tus amigos no han posteado ninguna foto.</h5>
                                <br>
                                <h4>¡Anímate y diles que suban algo!</h4>
                            </div>
                        </main>
                    </div>
                    <img class="img-fluid w-50 d-none d-sm-block" src="images/noFotos.svg" alt="">
                </div`;

    let res = parseHTML(html);

    contenedor.appendChild(res);
}

document.addEventListener("DOMContentLoaded", main);