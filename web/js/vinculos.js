"use strict";
import { vinculoRenderer } from "/js/renderers/usuariosVinc.js";
import { fotosAPI_auto } from "/js/api/_fotos.js";
import { vinculosusuariosAPI_auto } from "/js/api/_vinculosusuarios.js";
import {usuariosAPI_auto} from "/js/api/_usuarios.js";
import { amistadesAPI_auto } from "/js/api/_amistades.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { sessionManager } from "/js/utils/session.js";
import { parseHTML } from "/js/utils/parseHTML.js";
import { modalesRenderer } from "/js/renderers/modalesVinculos.js";
import {vinculosAPI_auto} from "/js/api/_vinculos.js";

async function main() {
    cargaVinculos();
}

async function cargaVinculos() {
    let contenedor = document.getElementById("usuarioVinc");
    try {

        if (sessionManager.isLogged()) {
            let amistades = await amistadesAPI_auto.getAll();
            let fotos = await fotosAPI_auto.getAll();
            let amistades2 = await vinculosAPI_auto.getAll();
            let usuarios = await usuariosAPI_auto.getAll();
            let vincusrs = await vinculosusuariosAPI_auto.getAll();
            let idAmigos = []; 
            //let usuarioId = loggedUser.usuarioId;
            //let usuarioId = sessionManager.getLoggedId();
            let usuarioId = sessionManager.getLoggedUser().usuarioId;
            //let usuarioId = 6;
            console.log(sessionManager.isLogged());
            console.log(usuarioId);
            console.log(sessionManager.getLoggedUser().nombre)

                // Obtenemos los id de los amigos
            for (let amistad of amistades) {
                let receptorId = amistad.receptorId;
                let emisorId = amistad.emisorId;

                if (usuarioId === emisorId) {
                    idAmigos.push(receptorId);
                } else if (usuarioId === receptorId) {
                    idAmigos.push(emisorId);
                }
            }

            console.log(idAmigos);


                // Obtenemos los usuarios amigos
            let amigos = usuarios.filter(amistad => amistad.usuarioId !== usuarioId && idAmigos.includes(amistad.usuarioId));

                // Miramos si hay algun amigo
            if (amigos.length === 0) {
            /* let botonAddVinculo = document.getElementById("botonEnviar");
                botonAddVinculo.style.visibility = "hidden";*/
                
                noVinculos(contenedor);

                let contModales = document.getElementById("modales");
                let modalAñadirVinculo = modalesRenderer.modalAñadirVinculo();
                contModales.appendChild(modalAñadirVinculo);

                let formulario = document.getElementById("formularioAñadirVinculo");
                formulario.onsubmit = checkFormulario;
                
            } else {

                let tarjetas = vinculoRenderer.asVincUsr(amigos,fotos);
                contenedor.appendChild(tarjetas);
            
                let contModales = document.getElementById("modales");
                let modalAñadirVinculo = modalesRenderer.modalAñadirVinculo();
                contModales.appendChild(modalAñadirVinculo);

                let formulario = document.getElementById("formularioAñadirVinculo");
                formulario.onsubmit = checkFormulario;
            }    
        } else {
            let botonAddVinculo = document.getElementById("botonEnviar");
            botonAddVinculo.style.visibility = "hidden";
            iniciaSesion(contenedor);
        }

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error al cargar los vinculos", err);
    }
}

function turnInactive(id){
    if(confirm("¿Seguro que quieres revocar este vinculo?")){
        off(id);
    }
    else{
        console.log("Vinculo no revocado");
    }
}
window.turnInactive=turnInactive;

async function off(id){
    let hoy = new Date();
    let fecha = hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
    let vincusrs = await vinculosusuariosAPI_auto.getAll();
    let amistades2 = await vinculosAPI_auto.getAll();
    //let usuarioId = loggedUser.usuarioId;
    let usuarioId = sessionManager.getLoggedUser().usuarioId;
    //let usuarioId = 6;
    let receptor = id;
    let emisor = usuarioId;
    let intermed = vincusrs.find(vinc => (vinc.emisorId === emisor && vinc.receptorId === receptor) || (vinc.emisorId === receptor && vinc.receptorId === emisor));
    let vinculof = amistades2.find(ami => ami.vinculoId === intermed.vinculoId);
   
    let fecha2 = new Date(vinculof.fecha);
    console.log(fecha2);
    let nuevaFecha = fecha2.getFullYear() + "-" + (fecha2.getMonth() + 1) + "-" + fecha2.getDate();
    console.log(nuevaFecha);

    let fecha3 = new Date(vinculof.fechaAceptacion);
    console.log(fecha3.getY);
    let nuevaFecha2 = fecha3.getFullYear() + "-" + (fecha3.getMonth() + 1) + "-" + fecha3.getDate();    
    console.log(nuevaFecha2);

    let vinculo = {
        activo: 0,
        fecha: nuevaFecha,
        fechaAceptacion : nuevaFecha2,
        fechaRevocacion: fecha
    }

    let nuevosDatos = new FormData();

    for (let clave in vinculo) {
        nuevosDatos.append(clave, vinculo[clave]);
    }

    try {
        await vinculosAPI_auto.update(nuevosDatos, vinculof.vinculoId);
        location.reload();
    } catch (err) {
        alert("Ha habido un error al modificar el vinculo.")
    }
}

window.off=off;


function checkFormulario(event) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);

    //Si formData tienen todos los campos llamamos a la función de subir vinculo
    if (formData.has("nombre")) {
        enviarVinculo(formData);
    }
    else{
        alert("introduce el nombre");
    }
}

async function enviarVinculo(formData) {
    let hoy = new Date();
    let fecha = hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
    let usuarios = await usuariosAPI_auto.getAll();
    let vincusrs = await vinculosusuariosAPI_auto.getAll();
    let vinculos = await vinculosAPI_auto.getAll();
    let nuevoId = vinculos.length+1;
    console.log(nuevoId);

    //Modificamos la url para que pueda entrar bien en la BBDD
    let nombre = formData.get("nombre");
    //let usuarioId = sessionManager.getLoggedId();
    let usuarioId = sessionManager.getLoggedUser().usuarioId;
    //let usuarioId = 6;
    let emisor = usuarioId;
    console.log(emisor);
    let target = usuarios.find(usuario => usuario.nombre === nombre);
    console.log(target);

    if(target === undefined){
        alert("el usuario no existe");
    }
    else{
        let receptor = target["usuarioId"];
        console.log(receptor);
        let intermed = vincusrs.find(vinc => (vinc.emisorId === emisor && vinc.receptorId === receptor) || (vinc.emisorId === receptor && vinc.receptorId === emisor));
        console.log(intermed);
        if(intermed === undefined){
           
            if(target.fechaBaja !== null){
                alert("no puedes enviar solicitudes a un usuario dado de baja");
            }
            else if(sessionManager.getLoggedUser().fechaBaja !== null){
                alert("no puedes enviar solicitudes dado de baja");
            }
            else{
                let vinculo = {
                    activo: 0,
                    fecha: fecha,
                    /*fechaAceptacion: null,
                    fechaRevocacion: null*/
                }
                console.log(vinculo);
    
                let vinculoUsrs = {
                    vinculoId: nuevoId,
                    emisorId: usuarioId,
                    receptorId: receptor
                }
    
    
                let vinculoCreado = new FormData();
                for (let clave in vinculo) {
                    console.log(clave,", ", vinculo[clave]);
                    vinculoCreado.append(clave, vinculo[clave]);
                }
    
                let vinculoUsrsCreado = new FormData();
                for (let clave in vinculoUsrs) {
                    vinculoUsrsCreado.append(clave, vinculoUsrs[clave]);
                }
                
    
                //Subimos la foto a la BBDD
                try {
                    await vinculosAPI_auto.create(vinculoCreado);
                    await vinculosusuariosAPI_auto.create(vinculoUsrsCreado);
                    location.reload();
                } catch (err) {
                    alert("Ha habido un error al crear el vinculo")
                }
            }
        }
        else{

            let vinculox = vinculos.find(v => v.vinculoId === intermed["vinculoId"]);

            if(vinculox.activo===1){
                alert("Ya tienes un vinculo con este usuario");
            }
            else if(target.fechaBaja !== null){
                alert("no puedes enviar solicitudes a un usuario dado de baja");
            }
            else if(sessionManager.getLoggedUser().fechaBaja !== null){
                alert("no puedes enviar solicitudes dado de baja");
            }
            else{
                let vinculoUsrs = {
                    vinculoId: intermed["vinculoId"],
                    emisorId: usuarioId,
                    receptorId: target["usuarioId"]
                }
                let vinculoUsrsModificado = new FormData();
                for (let clave in vinculoUsrs) {
                    vinculoUsrsModificado.append(clave, vinculoUsrs[clave]);
                }
    
                let vinculo = {
                    activo: 0,
                    fecha: fecha,
                    /*fechaAceptacion: null,
                    fechaRevocacion: null*/
               }
    
               let nuevosDatos = new FormData();
    
                for (let clave in vinculo) {
                    nuevosDatos.append(clave, vinculo[clave]);
                }
                console.log(intermed["vinculoId"]);
    
                try {
                    await vinculosusuariosAPI_auto.update(vinculoUsrsModificado, intermed["vinculoUsuarioId"]);
                    await vinculosAPI_auto.update(nuevosDatos, intermed["vinculoId"]);
                    location.reload();
                } catch (err) {
                    alert("Ha habido un error al modificar el vinculo.");
                }
            }
        }
        
    }
}


function iniciaSesion(contenedor) {
    let texto = 'Tienes que estar logueado para ver tus vinculos';

    let html = `<div class="d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-4">
                        <main>
                            <div>
                                <h4> ${texto}</h4>
                                <br>
                                <a href="/login.html" class="btn btn-primary">Login</a>
                                <a href="/register.html" class="btn btn-primary">Registro</a>
                            </div>
                        </main>
                    </div>
                    <img class="img-fluid w-50 d-none d-sm-block" src="images/necesitaLogin.svg" alt="">
                </div`;

    let res = parseHTML(html);

    contenedor.appendChild(res);
}

function noVinculos(contenedor) {
    
    let html = `<div class="d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-4">
                        <main>
                            <div>
                                <h5>Esto está un poco vacío.</h5>
                                <h5>No tienes ningun vinculo activo por el momento.</h5>
                                <br>
                                <h4>¡Manda solicitudes a tus amigos!</h4>
                            </div>
                        </main>
                    </div>
                    <img class="img-fluid w-50 d-none d-sm-block" src="images/noFotos.svg" alt="">
                </div`;

    let res = parseHTML(html);

    contenedor.appendChild(res);
}

/*
function turnInactive(amigo){
    let usuariosvinculos = await usuariosAPI_auto.getAll();
    let conexiones = usuariosvinculos.filter(camistad => c.emisorId !== usuarioId && idAmigos.includes(amistad.usuarioId));
}
*/
 
export { turnInactive, off };



document.addEventListener("DOMContentLoaded", main);