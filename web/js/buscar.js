import { usuariosAPI_auto } from "/js/api/_usuarios.js";
import { fotosAPI_auto } from "/js/api/_fotos.js";
import { perfilRenderer } from "/js/renderers/perfil.js";
import { fichapreferenciasAPI_auto } from "/js/api/_fichapreferencias.js";
import { sessionManager } from "/js/utils/session.js";

export async function cargaU(){
    let galleryContainer = document.getElementById("hola");
    let card;
    let fotos = await fotosAPI_auto.getAll();
    //Ficha preferencias
    let fichaP = await  fichapreferenciasAPI_auto.getAll();

    //Para actualizar
    galleryContainer.replaceChildren();


    //Pillar todos los usuarios
    let usuario = await usuariosAPI_auto.getAll();
    let c0 = $("#chkveg0");
    let c1 = $("#chkveg1");
    let c2 = $("#chkveg2");
    let c3 = $("#chkveg3");
    let c4 = $("#chkveg4");
    let c5 = $("#chkveg5");
    let c6 = $("#chkveg6");

    //Contador de aparición de usuario y de filtros activos
    let nAparicion = 0;
    let nFiltro = 0;

    for(let ck0 of c0.val()){
        if(ck0){
            nFiltro++;
            break;
        }
    }
    for(let ck1 of c1.val()){
        if(ck1){
            nFiltro++;
            break;
        }
    }
    for(let ck2 of c2.val()){
        if(ck2){
            nFiltro++;
            break;
        }
    }
    for(let ck3 of c3.val()){
        if(ck3){
            nFiltro++;
            break;
        }
    }
    for(let ck4 of c4.val()){
        if(ck4){
            nFiltro++;
            break;
        }
    }
    for(let ck5 of c5.val()){
        if(ck5){
            nFiltro++;
            break;
        }
    }
    for(let ck6 of c6.val()){
        if(ck6){
            nFiltro++;
            break;
        }
    }


    //Recorrer los usuarios
    for(let u of usuario){

        if(u.fechaBaja === null){
            //Usuario = Valor?

            //Filtro-0
            for(let check0 of c0.val()){

                //nFiltro++;

                var fNac = new Date(u.fechaNacimiento).getFullYear();
                var fAct = new Date().getFullYear();
                var edad = fAct - fNac;
                var edadC = Number(check0); 
                if(edadC <= edad && edad<=(edadC+9) && edadC<=50 && nAparicion<1){
                    nAparicion++;
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }else if(edadC <= edad && edad<=(edadC+9) && edadC<=50 && nAparicion>0){
                    nAparicion++;
                    galleryContainer.removeChild(card);
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }else if(edadC <= edad && edadC>50 && nAparicion<1){
                    nAparicion++;
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }else if(edadC <= edad && edadC>50 && nAparicion>0){
                    nAparicion++;
                    galleryContainer.removeChild(card);
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }
            }

            //Filtro-1
            if(c1.val().includes(u.genero) && nAparicion<1){
                nAparicion++;
                card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                galleryContainer.appendChild(card);
            }else if(c1.val().includes(u.genero) && nAparicion>0){
                nAparicion++;
                galleryContainer.removeChild(card);
                card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                galleryContainer.appendChild(card);
            }

            //Filtro-2
            if(c2.val().includes(u.colorOjos) && nAparicion<1){
                nAparicion++;
                card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                galleryContainer.appendChild(card);
            }else if(c2.val().includes(u.colorOjos) && nAparicion>0){
                nAparicion++;
                galleryContainer.removeChild(card);
                card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                galleryContainer.appendChild(card);
            }
        
            //Filtro-3
            if(c3.val().includes(u.colorPelo) && nAparicion<1){
                nAparicion++;
                card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                galleryContainer.appendChild(card);
            }else if(c3.val().includes(u.colorPelo) && nAparicion>0){
                nAparicion++;
                galleryContainer.removeChild(card);
                card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                galleryContainer.appendChild(card);
            }

            //Filtro-4
            for(let check4 of c4.val()){

                //nFiltro++;

                let alt = Number(check4);
                if(alt <= u.altura && (alt+9) >= u.altura && nAparicion<1){
                    nAparicion++;
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }else if(alt <= u.altura && (alt+9) >= u.altura && nAparicion>0){
                    nAparicion++;
                    galleryContainer.removeChild(card);
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }
            }

            //Filtro-5
            for(let check5 of c5.val()){
                
                //nFiltro++;

                let pes = Number(check5);
                if(pes <= u.peso && (pes+9.9) >= u.peso && pes <= 100. && nAparicion<1){
                    nAparicion++;
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }
                else if(pes <= u.peso && (pes+9.9) >= u.peso && pes <= 100. && nAparicion>0){
                    nAparicion++;
                    galleryContainer.removeChild(card);
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }else if(pes>100. && pes <= u.peso && nAparicion<1){
                    nAparicion++;
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }
                else if(pes>100. && pes <= u.peso && nAparicion>0){
                    nAparicion++;
                    galleryContainer.removeChild(card);
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }
            }

            //Filtro-6
            for(let check6 of c6.val()){
                //nFiltro
                if(u.provinciaId <= check6 && u.provinciaId > (check6-2) && nAparicion<1){
                    nAparicion++;
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }else if(u.provinciaId <= check6 && u.provinciaId >= (check6-2) && nAparicion>0){
                    nAparicion++;
                    galleryContainer.removeChild(card);
                    card = perfilRenderer.asCard(u,nAparicion,nFiltro, fotos);
                    galleryContainer.appendChild(card);
                }
            }
       
            nAparicion = 0;
        }
    }

    //usuario loggeado
    let uId =sessionManager.getLoggedUser().usuarioId;

    let fichaPreferencia = {
        usuarioId: uId,
        rangoEdad: c0.val()[0],
        rangoEstatura: c4.val()[0],
        rangoPeso: c5.val()[0],
        filtroGenero: c1.val()[0],
        filtroOjo: c2.val()[0],
        filtroColorPelo: c3.val()[0],
        ubicacion: c6.val()[0]
    }


    let uPref = [];
    for(let ficha of fichaP){
        uPref.push(ficha.usuarioId);
    }

    if(uPref.includes(uId)){
        await fichapreferenciasAPI_auto.update(fichaPreferencia, uId);
    }else{
        await fichapreferenciasAPI_auto.create(fichaPreferencia);
    }

    console.log(await fichapreferenciasAPI_auto.getAll());
}