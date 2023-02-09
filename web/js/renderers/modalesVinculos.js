"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const modalesRenderer = {

    modalAñadirVinculo: function(){
        let modal = 
            `<div class="modal fade" id="añadir" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Manda tu solicitud</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <form id="formularioAñadirVinculo">

                                <div class="mb-3">
                                    <label for="nombre" class="col-form-label">Nombre del usuario:</label>
                                    <input type="text" name="nombre" class="form-control" id="nombre">
                                </div>
                                    
                                
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-primary" id="boton">Enviar</button>
                                </div>
                                    
                                <div id="opciones"></div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            
            `;
    

        modal = parseHTML(modal);
        return modal;
    },
}

export { modalesRenderer };