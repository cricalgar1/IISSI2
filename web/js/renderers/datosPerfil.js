"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const dataRenderer = {

    asData: function(usuario, fotoPerfil,aficiones){

        let fechaHoy = new Date();
        let fechaNacimiento = new Date(usuario.fechaNacimiento);
        let años = fechaHoy.getFullYear() - fechaNacimiento.getFullYear();
        let meses = fechaHoy.getMonth() - fechaNacimiento.getMonth();
        if(meses < 0 || (meses === 0 && fechaHoy.getDate() < fechaNacimiento.getDate())){
            años--;
        }

        let altura = usuario.altura / 100;

        let html = `
            <div class="row" id="datos">
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex flex-column align-items-center text-center">
                                    <img src="${fotoPerfil}" class="rounded-circle" height="150" width="150">
                                         
                                    <div class="mt-3">
                                        <h4>${usuario.nombre}</h4>
                                        <p class="text-secondary mb-1">${usuario.biografia}</p>
                                        <p class="text-secondary mb-1">${usuario.direccion}</p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex flex-column align-items-center text-center" >                                 
                                        <div class="mt-4"id="divAficionesPerfil">
                                            <h5>Aficiones</h5>
                                            ${aficiones}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                        

                    
                    

                    <div class="col-md-8">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Género</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${usuario.genero}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Edad</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${años} años
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Peso</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${usuario.peso} kg
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Altura</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${altura} m
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Color de ojos</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${usuario.colorOjos}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Color de pelo</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${usuario.colorPelo}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-12">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#añadir" id="botonAñadir">Añadir foto</button>
                                    <div class="btn-group" id="botonCambiarFoto">
                                        <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Foto de perfil
                                        </button>
                                        <ul class="dropdown-menu">
                                            <div id="opcionesFotoPerfil"></div>
                                            <li><a class="dropdown-item" href="/web/perfil2.html" id="default">Ninguna foto</a></li>
                                        </ul>
                                    </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            `;

        let container = parseHTML(html);
        return container;
    }
}

export { dataRenderer };