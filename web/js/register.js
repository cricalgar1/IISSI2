import {messageRenderer} from "/js/renderers/messages.js";
import {validarUsuario} from "/js/validators/users.js";
import {authAPI} from "/js/api/auth.js";
import{sessionManager} from "/js/utils/session.js";


function main(){
    let form = document.getElementById("formulario");
    form.onsubmit = funcionErrores;
}

function funcionErrores(event){
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    
    let campo_edad = validarUsuario.validarEdad(formData);
    let campo_peso = validarUsuario.validarPeso(formData);
    let campo_altura = validarUsuario.validarAltura(formData);
    let campos = validarUsuario.validarCampos(formData);
    
    if(campo_edad.length>0 && campos.length == 0){
        event.preventDefault();
        let edad = document.getElementById("fechaNacimiento");
        edad.style.border = "3px solid red";    
        let errorsDiv = document.getElementById("error_edad");
        errorsDiv.innerHTML = campo_edad.join();

    }
    if(campo_peso.length>0 && campos.length == 0){
        event.preventDefault();
        let peso = document.getElementById("peso");
        peso.style.border = "3px solid red";
        let errorsDiv = document.getElementById("error_peso");
        errorsDiv.innerHTML = campo_peso.join();
    }
    if(campo_altura.length>0 && campos.length == 0){
        event.preventDefault();
        let altura = document.getElementById("altura");
        altura.style.border = "3px solid red";
        let errorsDiv = document.getElementById("error_altura");
        errorsDiv.innerHTML = campo_altura.join();
    }
    if(campos.length>0) {
        event.preventDefault();
        swal("¡Todos los campos son obligatorios!", "Completa el formulario", "error");
    }
    else{
        sendRegister(formData);
    }
}

async function sendRegister(formData) {
    try {
        let loginData = await authAPI.register(formData);
        let sessionToken = loginData.sessionToken;
        let loggedUser = loginData.user;
        sessionManager.login(sessionToken, loggedUser);
        window.location.href = "http://127.0.0.1:8080/feed.html";
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error registering a new user", err);
    }
}

document.addEventListener("DOMContentLoaded", main);
