"use strict";

import {usuariosAPI_auto} from "/js/api/_usuarios.js";
import {authAPI} from "/js/api/auth.js";
import {messageRenderer} from "/js/renderers/messages.js";
import{sessionManager} from "/js/utils/session.js";
var id;

function main(){
    let formulario = document.getElementById("formulario");
    formulario.onsubmit = funcionLogin;
    let nombre = document.getElementById("nombre");
    nombre.onblur = getCorreo;
}

async function funcionLogin(event){
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);

    let nombre = document.getElementById("nombre").value;
    let password = document.getElementById("password").value;

        
    let usuarios = await usuariosAPI_auto.getAll();
    let usuario = usuarios.filter(u => u.nombre===nombre);
    let fechaBaja = usuario[0].fechaBaja;
    
    if(usuario.length===0){
        event.preventDefault();
        swal("¡Usuario no registrado!", "¡Registrate!", "error");  
    }
    else{
        if(fechaBaja===null){
            sendLogin(formData);
        }
        else{
            event.preventDefault();
            swal("¡Error!", "¡Este usuario tiene fecha de baja!", "error");
        }
    }
}

async function getCorreo(){
    let usuarios = await usuariosAPI_auto.getAll();
    let nombre = document.getElementById("nombre").value;
    let usuario = usuarios.filter(u => u.nombre===nombre);
    let email = usuario[0].email;
    document.getElementById("email").value = email;
}

async function sendLogin(formData) {
    try {
        let loginData = await authAPI.login(formData);
        let sessionToken = loginData.sessionToken;
        let loggedUser = loginData.user;
        id =sessionManager.login(sessionToken, loggedUser);
        window.location.href = "http://127.0.0.1:8080/feed.html";
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error en el login, error en contraseña", err);
    }
}

document.addEventListener("DOMContentLoaded", main);

export {id};
