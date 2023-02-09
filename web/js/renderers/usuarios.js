"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";

const usuarioRenderer = {
    asActive: function (usuario, fotos) {
        
        //Lista con las fotos de los usuarios
        fotos = fotos.filter(foto => foto.usuarioId == usuario.usuarioId);

        //Filtro foto perfil o foto predefinida
        let fotoPerfil = fotos.filter(foto => foto.fotoPerfil === 1);
        if (fotoPerfil.length === 0) {
            fotoPerfil = "/web/images/user.png";
        } else {
            fotoPerfil = "https://" + fotoPerfil[0].urlFoto;
        }

        let html = `
            <div class="row text-center">
                <div class="col-md">
                    <div class="card border-secondary" style = "">
                        <br>
                        <div class ="body">
                            <img src="${fotoPerfil}" width="80" heigth= "80">
                        </div>
                        <div class="card-body align-items-center d-flex justify-content-center">
                            <h5 id= "button revoke" class="card-title text-center" font-size: 30px">${usuario.nombre}</h5>
                        </div>
                        <div>
                            <button type="button" onclick="turnInactive(${usuario.usuarioId})" class="btn btn-primary col-xs-11">Revocar</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

        let active = parseHTML(html);
        return active;
    },

    asSolicita: function (usuario, fotos) {
        
        //Lista con las fotos de los usuarios
        fotos = fotos.filter(foto => foto.usuarioId == usuario.usuarioId);

        //Filtro foto perfil o foto predefinida
        let fotoPerfil = fotos.filter(foto => foto.fotoPerfil === 1);
        if (fotoPerfil.length === 0) {
            fotoPerfil = "/web/images/user.png";
        } else {
            fotoPerfil = "https://" + fotoPerfil[0].urlFoto;
        }

        let html = `
            <div class="row text-center">
                <div class="col-md">
                    <div class="card border-secondary" style = "">
                        <br>
                        <div class ="body">
                            <img src="${fotoPerfil}" width="80" heigth= "80">
                        </div>
                        <div class="card-body align-items-center d-flex justify-content-center">
                            <h5 id= "button revoke" class="card-title text-center" font-size: 30px">${usuario.nombre}</h5>
                        </div>
                        <div style="display: inline">
                            <button type="button" onclick="aceptaSolicitud(${usuario.usuarioId})" class="btn btn-primary">Aceptar</button>
                            <button type="button" onclick="rechazaSolicitud(${usuario.usuarioId})" class="btn btn-primary">Rechazar</button>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            `;

        let active = parseHTML(html);
        return active;
    },

    asRevoca: function (usuario, fotos) {
        
        //Lista con las fotos de los usuarios
        fotos = fotos.filter(foto => foto.usuarioId == usuario.usuarioId);

        //Filtro foto perfil o foto predefinida
        let fotoPerfil = fotos.filter(foto => foto.fotoPerfil === 1);
        if (fotoPerfil.length === 0) {
            fotoPerfil = "/web/images/user.png";
        } else {
            fotoPerfil = "https://" + fotoPerfil[0].urlFoto;
        }

        let html = `
            <div class="row text-center">
                <div class="col-md">
                    <div class="card border-secondary" style = "">
                        <br>
                        <div class ="body">
                            <img src="${fotoPerfil}" width="80" heigth= "80">
                        </div>
                        <div class="card-body align-items-center d-flex justify-content-center">
                            <h5 id= "button revoke" class="card-title text-center" font-size: 30px">${usuario.nombre}</h5>
                        </div>
                    </div>
                </div>
            </div>
            `;

        let active = parseHTML(html);
        return active;
    }
};



export { usuarioRenderer };