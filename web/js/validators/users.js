"use strict";

const validarUsuario = {
    validarEdad: function(formData){
        let fecha = new Date();
        let año_hoy = fecha.getFullYear();
        let fecha_nacimiento = formData.get("fechaNacimiento");
        let año_nacimiento = fecha_nacimiento.substring(0,4);
        let edad = año_hoy-año_nacimiento
        let errores=[];

        if(edad<18){
            errores.push("Debes ser mayor de edad");
        }
        return errores;

    },
    validarPeso: function(formData){
        let peso = formData.get("peso");
        let errores=[];

        if(peso<1){
            errores.push("El peso debe ser positivo");
        }
        return errores;

    },

    validarAltura: function(formData){
        let altura = formData.get("altura");
        let errores=[];

        if(altura<1){
            errores.push("La altura debe ser positiva");
        }
        return errores;

    },

    validarCampos: function(formData){
        let nombre = formData.get("nombre");
        let email = formData.get("email");
        let contraseña = formData.get("password");
        let direccion = formData.get("direccion");
        let fechaNacimiento = formData.get("fechaNacimiento");
        let peso = formData.get("peso");
        let altura = formData.get("altura");
        let genero = formData.get("genero");
        let colorOjos = formData.get("colorOjos");
        let colorPelo = formData.get("colorPelo");
        let biografia = formData.get("biografia");

        let campos = [];

        if(nombre == "" || email == "" || contraseña == "" || direccion == "" || fechaNacimiento == "" || peso == "" ||
            altura == "" || genero == "" || colorOjos == "" || colorPelo == "" || biografia == ""){
                campos.push("Error");
        }

        return campos;

    }
};

export {validarUsuario};
