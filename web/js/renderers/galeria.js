"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
import { photoRenderer } from "/js/renderers/fotos.js";

const galleryRenderer = {
    asCardFeed: function (fotos, fotosPerfil) {
        let galleryContainer = parseHTML('<div class="photo-gallery"></div>');
        let row = parseHTML('<div class="row row-cols-1 row-cols-md-2 g-4"></div>');
        galleryContainer.appendChild(row);
        
        for (let foto of fotos) {
            let card = photoRenderer.asCard(foto, fotosPerfil);
            row.appendChild(card);
        }
        return galleryContainer;
    },

    asCardPerfil: function (fotos) {
        let galleryContainer = parseHTML('<div class="photo-gallery"></div>');
        let row = parseHTML('<div class="row row-cols-1 row-cols-md-2 g-4"></div>');
        galleryContainer.appendChild(row);
        
        for (let foto of fotos) {
            let card = photoRenderer.asCardPerfil(foto);
            row.appendChild(card);
        }
        return galleryContainer;
    }
};

export { galleryRenderer };