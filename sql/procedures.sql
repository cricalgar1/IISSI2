-- RF-1-01 punto 2
DELIMITER //
CREATE OR REPLACE PROCEDURE 
	pBorrarUsuario(id INT)
BEGIN
	
	DECLARE tieneFotos INT;
	DECLARE tieneAficiones INT;
	DECLARE tieneFichaPreferencias INT;
	DECLARE tieneVinculos INT;
	DECLARE fechaBajaNueva DATE;
	
	SET tieneFotos = (SELECT COUNT(*) FROM fotos WHERE usuarioId = id);
	SET tieneAficiones = (SELECT COUNT(*) FROM personasaficiones WHERE usuarioId = id);
	SET tieneFichaPreferencias = (SELECT COUNT(*) FROM fichaPreferencias WHERE usuarioId = id);
	SET tieneVinculos = (SELECT COUNT(*) FROM vinculos WHERE emisorId = id OR receptorId = id);
	
	IF(tieneAficiones>0 OR tieneFotos>0 OR tieneFichaPreferencias>0 OR tieneVinculos>0) THEN
		
		SET fechaBajaNueva = SYSDATE();
		UPDATE Usuarios 
			SET fechaBaja = fechaBajaNueva 
			WHERE usuarioId = id;
	
	ELSE DELETE FROM usuarios WHERE usuarioId = id;
	END IF;
	
			
END //
DELIMITER ;

-- RF-1-02 Añadir fotos
DELIMITER //
CREATE OR REPLACE PROCEDURE 
	pAñadirFotos(emailUsuario VARCHAR (250), contraseña VARCHAR (50), nombre VARCHAR(60), url VARCHAR(250), descripcion VARCHAR(250))
BEGIN
	
	DECLARE id INT;
	SET id = (SELECT usuarioId FROM usuarios WHERE email=emailUsuario AND PASSWORD = contraseña);
	
	INSERT INTO Fotos(usuarioId, urlFoto, nombre, descripcion)
	VALUES (id, url, nombre, descripcion);
	
END //
DELIMITER ;

-- RF-1-02 Modificar fotos
DELIMITER //
CREATE OR REPLACE PROCEDURE 
	pModificarFotos(emailUsuario VARCHAR (250), contraseña VARCHAR (50), nombreP VARCHAR(60), urlP VARCHAR(250), descripcionP VARCHAR(250))
	
BEGIN	
	DECLARE id INT;
	SET id = (SELECT usuarioId FROM usuarios WHERE email=emailUsuario AND PASSWORD = contraseña);

	UPDATE Fotos
	SET urlFoto = urlP, nombre = nombreP, descripcion = descripcionP
	WHERE usuarioId = id;
	
END //
DELIMITER ;

-- RF-1-02 Eliminar fotos
DELIMITER //
CREATE OR REPLACE PROCEDURE 
	pEliminarFotos(emailUsuario VARCHAR(250), contraseña VARCHAR(50),
	nombre VARCHAR(60), url VARCHAR(250))

BEGIN 
	DECLARE id1 INT;
	DECLARE id2 INT;

	SET id1 = (SELECT usuarioId FROM usuarios WHERE email = emailUsuario AND PASSWORD = contraseña);	
	SET id2 = (SELECT fotoId FROM Fotos WHERE url = urlFoto);
	DELETE FROM Fotos WHERE usuarioId = id1 AND fotoId = id2;

END //
DELIMITER ;

-- RF-1-03 Añadir aficiones tabla UsuariosAficiones
DELIMITER //
CREATE OR REPLACE PROCEDURE
	pAñadirAficiones(nombreA VARCHAR(100), idU INT)
BEGIN		
	DECLARE aId INT;
	SET aId = (SELECT aficionId FROM aficiones WHERE nombre = nombreA);
	INSERT INTO UsuariosAficiones (usuarioId, aficionId) VALUES (idU, aId); 
END //
DELIMITER ;

-- RF-1-03 Eliminar
DELIMITER //
CREATE OR REPLACE PROCEDURE eliminaAficion (nombreAf VARCHAR(100), emailUsuario VARCHAR(250), contraseña VARCHAR(60))
	BEGIN
		DECLARE id1 INT;
		DECLARE id2 INT;
		SET id1 = (SELECT aficionId FROM Aficiones WHERE nombre = nombreAf);
		SET id2 = (SELECT usuarioId FROM Usuarios WHERE email = emailUsuario AND PASSWORD = contraseña);
		DELETE FROM UsuariosAficiones WHERE usuarioId = id2 AND aficionId = id1;
	END //
DELIMITER ;


-- RF-1-01 que un usuario pueda darse de baja
DELIMITER //
CREATE OR REPLACE PROCEDURE
	pmodificacionUsuario(nuevoNombre VARCHAR(60), emailUsuario VARCHAR(250),nuevaPASSWORD VARCHAR(50), nuevaBiografia VARCHAR(140),
	nuevaDireccion VARCHAR(150), nuevaFechaNac DATE, nuevaAltura INT, nuevoPeso INT, nuevoGenero ENUM('Masculino', 'Femenino', 'Otros'), 
	nuevoOjos ENUM('Negro', 'Castaño', 'Azul', 'Verde', 'Gris'), nuevoPelo ENUM('Negro', 'Castaño', 'Rubio', 'Rojo', 'Blanco', 'Gris'), 
	nuevoCodigoPostal CHAR(5), nuevaProvincia VARCHAR(64), nuevoMunicipio VARCHAR(64)) 
BEGIN 
	DECLARE id INT;
	DECLARE cPId INT;
	DECLARE pId INT;
	DECLARE mId INT;

	SET id = (SELECT usuarioId FROM Usuarios WHERE email=emailUsuario); 
	SET cPId = (SELECT codigoPostalId FROM CodigosPostales WHERE codigoPostalnum=nuevoCodigoPostal); 
	SET pId = (SELECT provinciaId FROM Provincias WHERE nombreProvincia=nuevaProvincia); 
	SET mId = (SELECT municipioId FROM Municipios WHERE nombreMunicipio=nuevoMunicipio); 
	
	UPDATE Usuarios
	
	SET nombre=nuevoNombre, biografia  =nuevaBiografia , fechaNacimiento=nuevaFechaNac, altura=nuevaAltura, peso=nuevoPeso,
		genero=nuevoGenero, colorOjos=nuevoOjos, colorPelo=nuevoPelo, codigoPostald=cPId, provinciaId=pId, municipioId=mId,
		PASSWORD=nuevaPASSWORD, direccion=nuevaDireccion 
	WHERE usuarioId=Id;
	
END//
DELIMITER ;

