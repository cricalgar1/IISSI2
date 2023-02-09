"use strict";

import { parseHTML } from "/js/utils/parsehtml.js";
import {provinciasAPI_auto} from "/js/api/_provincias.js";
import{ BASE_URL, requestOptions } from '/js/api/common.js';    
import {municipiosAPI_auto} from "/js/api/_municipios.js";
import {codigospostalesAPI_auto} from "/js/api/_codigosPostales.js";


function main(){
    
    let provincias = document.getElementById("provincias");
    provincias.onblur = funcionProvincias;
    
    let boton_municipios = document.getElementById("botonMunicipio");
    boton_municipios.onclick = funcionMunicipios;

    let codigoId = document.getElementById("codigoPostal");
    codigoId.onblur = funcionCodigoPostal;

}

async function funcionProvincias(event){
    let provincias = await provinciasAPI_auto.getAll();
    let dato_introducido = document.getElementById("provincias").value;
    console.log(dato_introducido);
    let proviniciaIdFinal = dato_introducido;
    document.getElementById("provinciaId").value = proviniciaIdFinal;
}

async function funcionMunicipios(event){

    let municipios = await municipiosAPI_auto.getAll();
    let dato_introducido_provincias = document.getElementById("provincias").value;
    let m = municipios.filter(municipio => municipio.provinciaId==dato_introducido_provincias);
    let opcion_municipios = document.getElementById("municipios");
    for(let i = 0; i<m.length; i++){
        let municipio = m[i];
        let nombre = municipio.nombreMunicipio;
        let html = `<option value="${i}">${nombre} (${i+1})</option>`;
        let opcion = parseHTML(html);
        opcion_municipios.appendChild(opcion);
    }
}

async function funcionCodigoPostal(event){
    let dato_introducido = document.getElementById("codigoPostal").value;
    console.log(dato_introducido);
    let codigos = await codigospostalesAPI_auto.getAll();
    let c = codigos.filter(codigo => codigo.codigoPostal===dato_introducido);
    let codigoPostalIdFinal = c[0].codigoPostalId;
    document.getElementById("codigoPostalId").value = codigoPostalIdFinal;
}

document.addEventListener("DOMContentLoaded", main);