" use strict ";
import { usuariosaficionesAPI_auto } from "/js/api/_usuariosaficiones.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { aficionesAPI_auto } from "/js/api/_aficiones.js";
import { parseHTML } from "/js/utils/parseHTML.js";
import { sessionManager } from "/js/utils/session.js";
import {usuariosAPI_auto} from "/js/api/_usuarios.js";

//Cogemos el id del usuario logeado
let id = sessionManager.getLoggedUser().usuarioId;

//Cogemos los tres form del .html
let formAñadirAficion = document.getElementById("formAñadirAficion");
let formActualizaPerfil = document.getElementById("formActualizarPerfil");
let formActualizarAficion = document.getElementById("formActualizarAficion");

let numMes = {"January":1, "February":2, "March":3, "April":4, "May":5, "June":6, "July":7, "August":8, "September":9, "October":10, "November":11, "December":12};


async function main(){
    //Hacemos las llamadas para cargar los datos y el check de las aficiones
    cargaUsuarios();
    cargaAficionesCheck();

    //Hacemos llamada a los eventos correspondientes al enviar los formularios
    formAñadirAficion.onsubmit = creaAficion;
    formActualizaPerfil.onsubmit = actualizaPerfil;
    formActualizarAficion.onsubmit = actualizarAficiones;


    let user= await usuariosAPI_auto.getById(id);
}


//Nada mas entrar nos debe aparecer este checkbox generado dinamicamente con las aficiones 
async function cargaAficionesCheck() {
    //Cargamos todas las aficiones de la base de datos
    var aficiones = await aficionesAPI_auto.getAll();
    


    //Cargamos el div donde generaremos nuestras aficiones
    let divAficiones = document.getElementById("divAficiones");
    try {
        //Por cada aficion generamos un checkbox dentro del div 
        for(let e of aficiones){
            //Creamos una variable input y tipocheckbox
            let html=   
                `<label for="${e.aficionId}" class="md-3 mt-3 form-label">
                
                    <input type="checkbox" id="${e.aficionId}" name="aficion" class="form-check-input" value="${e.nombre}"> 
                    ${e.nombre} 
                
                </label>` ;

            //Parseamos el html
            let res = parseHTML(html);
            
            //Y lo agregamos a nuestro checkbox
            divAficiones.appendChild(res);

        }

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error al cargar las aficiones", err);
    }

    //Hacemos una llamada a la funcion que nos checkea las aficiones del usuario
    checkeaAficiones();
    
}


async function checkeaAficiones(){
    //Cogemos las aficiones del usuario con es Id
    let aficionesUsusarios = await usuariosaficionesAPI_auto.getAll();
    let aficionesUs=[];

    for(let a of aficionesUsusarios){
        if(a.usuarioId == id) aficionesUs.push(a);
    }
    //Si solo tiene una aficion
    if(aficionesUs.length == 1){
        document.getElementById(aficionesUs[0].aficionId).checked=true;
    }
    //Si tiene mas de una aficion
    else if(aficionesUs.length > 1){

        //Iteramos cada una y la marcamos
        for(let e of aficionesUs){
            document.getElementById(e.aficionId).checked=true;
        }
    }
          
}

async function cargaUsuarios(){
    
    let nombre=document.getElementById("nombre");
    let direccion =document.getElementById("direccion");
    let biografia = document.getElementById("biografia");
    let estatura= document.getElementById("altura");
    let peso = document.getElementById("peso");
    let pelo = document.getElementById("colorPelo");
    let ojos = document.getElementById("colorOjos");
    let genero = document.getElementById("genero");

    try{
        let datosUs = await usuariosAPI_auto.getById(id);

        nombre.value=datosUs.nombre;
        direccion.value=datosUs.direccion;
        biografia.value=datosUs.biografia;
        estatura.value=datosUs.altura;
        peso.value=datosUs.peso;
        pelo.value=datosUs.colorPelo;
        ojos.value=datosUs.colorOjos;
        genero.value=datosUs.genero;
        

    }catch(err){
        messageRenderer.showErrorAsAlert("Error", err);    
    }

}

async function creaAficion(event){
    event.preventDefault();
    let form =event.target;

    //Creamos las variable formData y enviar
    let formData= new FormData(form);
    let enviar = new FormData();

    //Si tiene una aficion (es decir el campo no está vacio)
    if(formData.get("aficion").length>1){
        
        //Creamos la nueva aficion a almacenar con su campo nombre
        let nueva={
            nombre: formData.get("aficion")
        }
        
        for(let clave in nueva){
            enviar.append(clave,nueva[clave]);
        }

        //Si todo va bien enviamos a las BD la nueva aficion
        try {
            await aficionesAPI_auto.create(enviar);
            location.reload();
        
        //Si no nos saca por pantalla este error
        } catch (err) {
            alert("Ha habido un error al crear la aficion")
        }

    }
}

async function actualizaPerfil(event){
    event.preventDefault();
    let form =event.target;

    //Creamos dos formData 
    let formData =new FormData(form);
    let enviar=new FormData();

    //Cogemos algunos datos del usuario
    let user= await usuariosAPI_auto.getById(id);

    //Creamos el perfil actualizado
    let modif={
        PASSWORD: user.PASSWORD,
        fechaNacimiento:user.fechaNacimiento,
        email: user.email,
        nombre: formData.get("nombre"),
        altura: formData.get("altura"),
        peso: formData.get("peso"),
        genero: formData.get("genero"),
        colorOjos: formData.get("colorOjos"),
        colorPelo: formData.get("colorPelo"),
        biografia: formData.get("biografia"),
        direccion: formData.get("direccion"),
        provinciaId:user.provinciaId
    }

    //Cambiamos el formato de la fecha para que pueda entrar bien en la bbdd (Formato: YYYY-MM-DD)
    modif["fechaNacimiento"]= modif["fechaNacimiento"].split(", ")[1].split("00:00:00")[0];
    let fecha = modif["fechaNacimiento"].split(" ");
    let dia = fecha[0];
    let mes = numMes[fecha[1]];
    let anho = fecha[2];

    modif["fechaNacimiento"]= anho + "-" + mes + "-" + dia;

    //Por cada campo de usuario lo metemos en un formData
    for(let clave in modif){
        enviar.append(clave,modif[clave]);
    }

    //Si todo va bien enviamos a las BD el perfil actualizado
    try {
        await usuariosAPI_auto.update(enviar,id);
        location.reload();
    
    //Si no nos saca por pantalla este error
    } catch (err) {
        alert("Ha habido un error al actualizar el perfil")
    }   

}

async function actualizarAficiones(event){
    event.preventDefault();
    let form =event.target;

    //Creamos dos formData 
    let formData =new FormData(form);
    let enviar=new FormData();

    let cogidas=formData.getAll("aficion");
    console.log(cogidas);

    //Cogemos todas las aficiones, aficiones de usuarios y creamos un array vacio
    let aficiones= await aficionesAPI_auto.getAll();
    let aficionesUsuarios= await usuariosaficionesAPI_auto.getAll();
    let aficionesUs=[];
    
    //Vamos metiendo en el array las aficiones de ese usuario
    for(let a of aficionesUsuarios){
        if(a.usuarioId == id) aficionesUs.push(a);
    }


    //Vamos mirando por cada aficion
    for(let a of aficiones){
        console.log(0);


        //Por cada aficion miramos en las aficiones del usuario
        for(let e of aficionesUs){
            console.log(1)
            //Si estaba en las aficiones del usuario antes
            if(e.aficionId == a.aficionId){

                //Y ya no está la eliminamos de la tabla
                if(!cogidas.includes(a.nombre)) {
                    console.log(3)

                    //Si todo va bien eliminamos de la base de datos esa aficion
                    try {
                        await usuariosaficionesAPI_auto.delete(e.usuarioAficionId);
                        location.reload();
    
                    //Si no nos saca por pantalla este error
                    } catch (err) {
                        alert("Ha habido un error al eliminar una aficion")
                    }  
                    
                }
            }
        }

        //Si la aficion esta en las cogidas y no esta en las del usuario
        if(cogidas.includes(a.nombre) && aficionesUs.find(e=>e.aficionId == a.aficionId) == undefined) {
            //Creamos un objeto
            let nuevo={
                aficionId: a.aficionId,
                usuarioId: id
            }

            //Lo pasamos a formData
            for(let clave in nuevo){
                enviar.append(clave,nuevo[clave]);
            }

            //Si todo va bien vinculamos ese usuario a la aficion
            try {
                await usuariosaficionesAPI_auto.create(enviar);
                location.reload();

            //Si no nos saca por pantalla este error
            } catch (err) {
                alert("Ha habido un error al añadir una aficion")
            }  
                
            
        }

    }
    checkeaAficiones();
}


document.addEventListener("DOMContentLoaded", main);