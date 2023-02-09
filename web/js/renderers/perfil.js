"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";

const perfilRenderer = {
    asCard: function(usuario, nAparicion,nFiltro, fotos) {
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
        <div class = "col-md-3">
            <div class = "row">
                <div class = "card border-secondary">
                    <div class ="body">
                        <img src="${fotoPerfil}" width="80" heigth= "80">
                    </div>
                    <h3><a href="/web/perfil2.html?usuarioId=${usuario.usuarioId}" class="text-dark align-self-center"> ${usuario.nombre}</a></h3>
                    <p class = "text-center" id ="aparicion"><h4/>${nAparicion} de ${nFiltro}</h4></p>
                    <p><button class ="btn btn-primary" onclick="creaSolicitud(${usuario.usuarioId})">Enviar Solicitud</button></p>
                </div>
                <p></p>
                <p></p>  
            </div> 
        </div>`;
        let card = parseHTML(html);
        return card;
    }
};

const perfilRendererBasico = {
    asCard: function(usuario,fotos) {

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
        <div class = "col-md-3">
            <div class = "row">
                <div class = "card border-secondary" style = "">
                    <div class ="body">
                        <img src="${fotoPerfil}" width="80" heigth= "80">
                    </div>
                    <h3><a href="/web/perfil2.html?usuarioId=${usuario.usuarioId}" class="text-dark align-self-center">${usuario.nombre}</a></h3>                    
                    <p><button class ="btn btn-primary" onclick="creaSolicitud(${usuario.usuarioId})">Enviar Solicitud</button></p>
                </div>
                <p></p>
                <p></p>  
            </div> 
        </div>`;
        let card = parseHTML(html);
        return card;
    }
};

export { perfilRenderer };
export { perfilRendererBasico };