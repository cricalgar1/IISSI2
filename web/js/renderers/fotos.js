"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";

const photoRenderer = {
    asCard: function (foto, fotosPerfil) {

        let fecha = new Date(foto.fechaPublicacion);
        fecha = fecha.toISOString().split("T")[0];

        let fotoPerfil;
        if(fotosPerfil[foto.nombreUsuario] === undefined) {
            fotoPerfil = "/web/images/user.png";
        }else{
            fotoPerfil = "https://" + fotosPerfil[foto.nombreUsuario];
        }

        let html = `
            <div class="col">
                <div class="card h-100">
                    <div class="card-header">
                        <a href="/web/perfil2.html?usuarioId=${foto.usuarioId}" class="text-dark align-self-center">
                            <img src="${fotoPerfil}"
                                class="rounded-circle" width="50" height="50">
                            ${foto.nombreUsuario}
                        </a>
                    </div>

                    <img src="https://${foto.urlFoto}" class="card-img-top zoom" />

                    <div class="card-body">
                        <h5 class="card-title">${foto.nombre}</h5>
                        <div class="scroll-desc">
                            <p class="card-text">
                                ${foto.descripcion}
                            </p>
                        </div>

                    </div>
                    <div class="card-footer">
                        <small class="text-muted">${fecha}</small>
                    </div>
                </div>
            </div>`;

        let card = parseHTML(html);
        return card;
    },

    asCardPerfil: function (foto) {
        let fecha = new Date(foto.fechaPublicacion);
        fecha = fecha.toISOString().split("T")[0];

        let html = `
            <div class="col">
                <div class="card h-100">
                    <img src="https://${foto.urlFoto}" class="card-img-top zoom" />

                    <div class="card-body">
                        <h5 class="card-title">${foto.nombre}</h5>
                        <div class="scroll-desc">
                            <p class="card-text">
                                ${foto.descripcion}
                            </p>
                        </div>

                    </div>
                    <div class="card-footer d-flex">
                        <small class="text-muted mr-auto p-2 flex-grow-1">${fecha}</small>
                        <div id="botonesFotos${foto.fotoId}">
                            <a class="btn btn-secondary btn-sm p-2" href="/web/modificarFoto.html?fotoId=${foto.fotoId}">Opciones</a>
                        </div>
                        
                    </div>
                </div>
            </div>`;

        let card = parseHTML(html);
        return card;
    },

    asCardModificar: function(foto){
        let fecha = new Date(foto.fechaPublicacion);
        fecha = fecha.toISOString().split("T")[0];

        let html = `
            <div>
                <img src="https://${foto.urlFoto}" class="card-img-top zoom" />

                <div class="card-body">
                    <div class="card-title">
                        <input type="text" class="form-control my-2" id="titulo" value="${foto.nombre}">
                    </div>                    
                    <div class="scroll-desc">
                        <p class="card-text">
                            <textarea type="textarea" class="form-control" id="descripcion">${foto.descripcion}</textarea>
                        </p>
                    </div>
                    <div class="form-row">
                        <button type="submit" class="btn btn-success mt-3" id="cambio">Hacer cambios</button>
                        <button type="button" class="btn btn-danger mt-3" id="eliminar">Eliminar</button>
                    </div>
                </div>
            </div>`;
        
        let card = parseHTML(html);
        return card;
    }
};

export { photoRenderer };