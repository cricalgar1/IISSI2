DELIMITER //
CREATE OR REPLACE PROCEDURE
createTables()
BEGIN
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS Provincias;
DROP TABLE IF EXISTS Municipios;
DROP TABLE IF EXISTS CodigosPostales;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS FichaPreferencias;
DROP TABLE IF EXISTS Vinculos;
DROP TABLE IF EXISTS Conversaciones;
DROP TABLE IF EXISTS Mensajes;
DROP TABLE IF EXISTS Fotos;
DROP TABLE IF EXISTS Aficiones;
DROP TABLE IF EXISTS UsuariosAficiones;
DROP TABLE IF EXISTS VinculosUsuarios;
DROP TABLE IF EXISTS FichaPreferenciaAficiones;

SET FOREIGN_KEY_CHECKS=1;

-- Provincias
CREATE TABLE Provincias (
  	provinciaId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombreProvincia VARCHAR(64) NOT NULL /* Obligatorio */
);


-- Municipios de una provincia
CREATE TABLE Municipios (
	municipioId	INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  	provinciaId INT NOT NULL, /* Obligatorio */
  	nombreMunicipio VARCHAR(64) NOT NULL, /* Obligatorio */
  	FOREIGN KEY(provinciaId) REFERENCES Provincias(provinciaId)
);

-- Codigo postal
CREATE TABLE CodigosPostales (
	codigoPostalId INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	municipioId INT NOT NULL, /* Obligatorio */
	codigoPostal CHAR(5) NOT NULL,
  	FOREIGN KEY(municipioId) REFERENCES Municipios(municipioId)
);

CREATE TABLE Usuarios(
	usuarioId INT NOT NULL AUTO_INCREMENT,
	email VARCHAR(128) NOT NULL,
	PASSWORD LONGTEXT NOT NULL,
	nombre VARCHAR(128) NOT NULL,
	fechaNacimiento DATE NOT NULL,
	altura INT DEFAULT(170) NOT NULL,
	peso DOUBLE DEFAULT(75) NOT NULL, 
	genero ENUM('Masculino', 'Femenino', 'Otros') NOT NULL, 
	colorOjos ENUM('Negro', 'Castaño', 'Azul', 'Verde', 'Gris') NOT NULL,
	colorPelo ENUM('Negro', 'Castaño', 'Rubio', 'Rojo', 'Blanco', 'Gris') DEFAULT('Negro') NOT NULL,
	fechaAlta DATE DEFAULT CURRENT_TIMESTAMP(), /*RN_1_0a RN_1_0b {readonly}*/
	fechaBaja DATE,
	biografia VARCHAR(1024) NOT NULL,
	direccion VARCHAR (64) NOT NULL, 
	codigoPostalId INT,
	provinciaId INT NOT NULL,
	municipioId INT,
	PRIMARY KEY (usuarioId),
  	FOREIGN KEY(provinciaId) REFERENCES Provincias(provinciaId),
  	FOREIGN KEY(municipioId) REFERENCES Municipios(municipioId),
	UNIQUE (email),
	UNIQUE (nombre),
	CONSTRAINT RN_1_3_register_date_after_DoB CHECK(fechaAlta >= fechaNacimiento),
	CONSTRAINT RN_1_3_register_date_earlier_withdrawal 
		CHECK(NOT (fechaBaja IS NOT NULL) OR (fechaBaja >= fechaAlta)),
	CONSTRAINT RN1_0b_PesoNegativo CHECK (peso>0),
	CONSTRAINT RN1_0b_AlturaNegativa CHECK (altura>0)
);



CREATE TABLE FichaPreferencias(
	fichaPreferenciaId INT NOT NULL AUTO_INCREMENT,
	usuarioId INT NOT NULL,
	rangoEdad INT,
	rangoEstatura INT,
	rangoPeso INT,
	filtroGenero VARCHAR(60),
	filtroOjo VARCHAR(60),
	filtroColorPelo VARCHAR(60),
	ubicacion VARCHAR(60),
	PRIMARY KEY(fichaPreferenciaId),
	FOREIGN KEY(usuarioId) REFERENCES Usuarios(usuarioId) ON DELETE CASCADE,
	CONSTRAINT invalidcolorOjo CHECK (filtroOjo IN ('Negro', 'Castaño', 'Azul', 'Verde', 'Gris')),
	CONSTRAINT invalidGenero CHECK (filtroGenero IN ('Masculino', 'Femenino', 'Otros')),
	CONSTRAINT invalidColorPelo CHECK (filtroColorPelo IN ('Negro','Castaño', 'Rubio', 'Rojo', 'Blanco', 'Gris')),
	CONSTRAINT invalidUbicacion CHECK(ubicacion IN ('Codigo Postal', 'Municipio', 'Provincia'))
);

CREATE TABLE Vinculos(
	vinculoId INT NOT NULL AUTO_INCREMENT,
	activo BOOLEAN NOT NULL,
	fecha DATE NOT NULL,
	fechaAceptacion DATE,
	fechaRevocacion DATE,
	PRIMARY KEY (vinculoId),
	CONSTRAINT Rn2_01a CHECK (fecha<=fechaAceptacion),
	CONSTRAINT Rn2_01b CHECK (fechaAceptacion<=fechaRevocacion)
);

/*
CREATE TABLE Conversaciones(
	conversacionId INT NOT NULL AUTO_INCREMENT,
	vinculoId INT NOT NULL,
	fechaInicio DATE NOT NULL,
	fechaFin DATE,
	PRIMARY KEY (conversacionId),
	FOREIGN KEY (vinculoId) REFERENCES vinculos(vinculoId),
	CONSTRAINT RN4_01 CHECK(fechaInicio <= fechaFin)
);

CREATE TABLE Mensajes(
	mensajeId INT NOT NULL AUTO_INCREMENT,
	conversacionId INT NOT NULL,
	texto VARCHAR (300) NOT NULL,
	fechaMensaje DATE NOT NULL,
	PRIMARY KEY (mensajeId),
	FOREIGN KEY (conversacionId) REFERENCES Conversaciones (conversacionId) ON DELETE CASCADE
);
*/

CREATE TABLE Fotos(
	fotoId INT NOT NULL AUTO_INCREMENT,
	usuarioId INT NOT NULL,
	urlFoto VARCHAR(2048) NOT NULL,
	nombre VARCHAR(64) NOT NULL,
	descripcion VARCHAR(1024),
	fechaPublicacion DATE DEFAULT (SYSDATE()) NOT NULL,
	fotoPerfil BOOLEAN NOT NULL,
	PRIMARY KEY (fotoId),
	FOREIGN KEY(usuarioId) REFERENCES Usuarios(usuarioId) ON DELETE CASCADE,
	UNIQUE (urlFoto)
);
	


CREATE TABLE Aficiones(
	aficionId INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(100) NOT NULL,
	PRIMARY KEY(aficionId),
	UNIQUE(nombre)
);


CREATE TABLE UsuariosAficiones(
	usuarioAficionId INT NOT NULL AUTO_INCREMENT,
	usuarioId INT NOT NULL,
	aficionId INT NOT NULL,
	PRIMARY KEY(usuarioAficionId),
	FOREIGN KEY(usuarioId) REFERENCES Usuarios(usuarioId) ON DELETE CASCADE,
	FOREIGN KEY(aficionId) REFERENCES Aficiones(aficionId) ON DELETE CASCADE,
	UNIQUE(usuarioId, aficionId)
);
		
CREATE TABLE FichaPreferenciaAficiones(
	fichaPreferenciaAficionId INT NOT NULL AUTO_INCREMENT,
	fichaPreferenciaid INT NOT NULL,
	aficionId INT NOT NULL,
	PRIMARY KEY(fichaPreferenciaAficionId),
	FOREIGN KEY (fichaPreferenciaid) REFERENCES fichapreferencias(fichaPreferenciaId) ON DELETE CASCADE,
	FOREIGN KEY (aficionId) REFERENCES aficiones(aficionId) ON DELETE CASCADE
); 


CREATE TABLE VinculosUsuarios(
	vinculoUsuarioId INT NOT NULL AUTO_INCREMENT,
	vinculoId INT NOT NULL,
	emisorId INT NOT NULL,
	receptorId INT NOT NULL,
	PRIMARY KEY (vinculoUsuarioId),
	FOREIGN KEY (vinculoId) REFERENCES Vinculos (vinculoId) ON DELETE CASCADE,
	FOREIGN KEY (emisorId) REFERENCES Usuarios (usuarioId) ON DELETE CASCADE,
	FOREIGN KEY (receptorId) REFERENCES Usuarios (usuarioId) ON DELETE CASCADE,
	UNIQUE (emisorId, receptorId),
	CONSTRAINT Rn3_02b CHECK(emisorId != receptorId)
);


END //
DELIMITER ;

CALL createTables();
