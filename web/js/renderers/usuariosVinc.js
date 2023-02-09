"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
import { usuarioRenderer } from "/js/renderers/usuarios.js";

const vinculoRenderer = {
    asVincUsr: function (usuarios, fotos) {
        let vinculoContainer = parseHTML('<div class="usuario-vinculado"></div>');
        let row = parseHTML('<div class="row row-cols-1 row-cols-md-4 g-4"></div>');
        vinculoContainer.appendChild(row);
        
        for (let usuario of usuarios) {
            let card = usuarioRenderer.asActive(usuario, fotos);
            row.appendChild(card);
        }
        return vinculoContainer;
    },


    asSolicitud: function (usuarios, fotos) {
        let vinculoContainer = parseHTML('<div class="usuario-vinculado"></div>');
        let row = parseHTML('<div class="row row-cols-1 row-cols-md-4 g-4"></div>');
        vinculoContainer.appendChild(row);
        
        for (let usuario of usuarios) {
            let card = usuarioRenderer.asSolicita(usuario, fotos);
            row.appendChild(card);
        }
        return vinculoContainer;
    },

    asRevocado:  function (usuarios, fotos) {
        let vinculoContainer = parseHTML('<div class="usuario-vinculado"></div>');
        let row = parseHTML('<div class="row row-cols-1 row-cols-md-4 g-4"></div>');
        vinculoContainer.appendChild(row);
        
        for (let usuario of usuarios) {
            let card = usuarioRenderer.asRevoca(usuario, fotos);
            row.appendChild(card);
        }
        return vinculoContainer;
    }


};

export { vinculoRenderer };