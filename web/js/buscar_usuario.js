import { usuariosAPI_auto } from "/js/api/_usuarios.js";
import { fotosAPI_auto } from "/js/api/_fotos.js";
import { perfilRendererBasico } from "/js/renderers/perfil.js";

export async function buscarU(){
    let galleryContainer = document.getElementById("hola");
    let card;
    let fotos = await fotosAPI_auto.getAll();
    //Para actualizar
    galleryContainer.replaceChildren();

    //variables para buscar
    var texto, filtroMa, filtroMi, usuario, name;
    texto = document.getElementById("inputFiltro");
    filtroMa = new String(texto.value.toUpperCase());
    filtroMi = new String(texto.value.toLowerCase());
    usuario = await usuariosAPI_auto.getAll();

    for(let u of usuario){
        name = u.nombre;
        if(name.indexOf(filtroMa)>=0 || name.indexOf(filtroMi)>=0){
            card = perfilRendererBasico.asCard(u,fotos);
            galleryContainer.appendChild(card);
        }
    }
}