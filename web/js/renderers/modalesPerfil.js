"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const modalesRenderer = {

    modalAñadirFoto: function(numFotos, numMaxFotos){
        let modal = 
            `<div class="modal fade" id="añadir" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Sube una foto</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <form id="formularioAñadirFoto">

                                <div class="mb-3">
                                    <label for="url" class="col-form-label">URL de la imagen:</label>
                                    <input type="text" name="url" class="form-control" id="url">
                                </div>
                                        
                                <div class="mb-3">
                                    Previsualización de la imagen:
                                    <br>
                                    <img id="preview" src="" width="200"></img>
                                    <div id="mensaje"></div>
                                </div>    
                                    
                                <div id="opciones"></div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            
            `;
    
        if(numFotos>=numMaxFotos){
            modal = 
                `<div class="modal fade" id="añadir" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <!--Cabecera del modal con botón de cerrar pestaña-->
                                <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Máximo número de fotos</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <!--Cuerpo del modal donde estrá nuestro formulario-->
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="nombre" class="col-form-label">Has alcanzado el máximo número de fotos. Para subir una nueva foto, antes debes eliminar una.</label>
                                </div>                            
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        modal = parseHTML(modal);
        return modal;
    }, 

    opcionesFotos: function(){
    
        let html = `
            <div class="container" id="campos">
                <div class="mb-3">
                    <label for="titulo" class="col-form-label">Titulo:</label>
                    <input type="text"  name="titulo" class="form-control" id="titulo" required>
                </div>

                <div class="mb-3">
                    <label for="descripcion" class="col-form-label">Descripción:</label>
                    <textarea type="textarea"  name="descripcion" class="form-control" id="descripcion" required></textarea>
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="boton">Enviar</button>
                </div>
            </div>
        `;

        let opciones = parseHTML(html);
        return opciones;
    },
}

export { modalesRenderer };