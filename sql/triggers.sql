DELIMITER //
CREATE OR REPLACE TRIGGER 
RN02_02_trigger
AFTER INSERT ON VinculosUsuarios FOR EACH ROW
BEGIN

DECLARE numEmisor INT;
SET numEmisor = (SELECT COUNT(1) FROM VinculosUsuarios
NATURAL JOIN Vinculos WHERE emisorId = NEW.emisorId GROUP BY fecha ORDER  BY numEmisor ASC LIMIT 1); 

IF(numEmisor>1) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo puede solicitar hasta 5 vínculos por día natural';
END IF;

END //
DELIMITER ;


-- Sólo un vínculo activo por cada par de usuarios
DELIMITER //
CREATE OR REPLACE TRIGGER 
RN02_04_trigger
AFTER INSERT ON VinculosUsuarios FOR EACH ROW
BEGIN 
	
	DECLARE numVinculos INT;
	SET numVinculos = (SELECT COUNT(*) FROM VinculosUsuarios
NATURAL JOIN Vinculos WHERE emisorId = NEW.receptorId AND receptorId = NEW.emisorId);
	
	IF(numVinculos>0) THEN 		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'Solo puede haber un vínculo activo por cada par de usuarios';
	END IF;

END //
DELIMITER ;



-- No se puede repetir vinculoId en la tabla vinculosUsuarios
DELIMITER //
CREATE OR REPLACE TRIGGER
	tNoVinculoIdRepetidoInsert
BEFORE INSERT ON vinculosusuarios FOR EACH ROW
BEGIN
	
	DECLARE cuentaVinculoId INT;
	
	SET cuentaVinculoId = (SELECT COUNT(*) FROM vinculosusuarios WHERE vinculoId = NEW.vinculoId);
	
	IF (cuentaVinculoId >= 1) THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'No se puede insertar un vínculo cuyo vinculoId esté repetido';
	END IF;

END //
DELIMITER ;

-- No se puede repetir vinculoId en la tabla vinculosUsuarios
DELIMITER //
CREATE OR REPLACE TRIGGER
	tNoVinculoIdRepetidoUpdate
BEFORE UPDATE ON vinculosusuarios FOR EACH ROW
BEGIN
	
	DECLARE cuentaVinculoId INT;
	
	SET cuentaVinculoId = (SELECT COUNT(*) FROM vinculosusuarios WHERE vinculoId = new.vinculoId);
	
	IF (cuentaVinculoId >= 1) THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'No se puede actualizar un vínculo cuyo vinculoId esté repetido';
	END IF;

END //
DELIMITER ;


-- RN-1-01 Personas registradas mayores de edad
DELIMITER //
CREATE OR REPLACE TRIGGER
	tUsuariosMayoresEdad
AFTER INSERT ON usuarios FOR EACH ROW
	BEGIN
		DECLARE nacimiento DATE;
		DECLARE entrada DATE;
		DECLARE edad INT;
		
		SET nacimiento= (SELECT fechaNacimiento FROM usuarios WHERE usuarioId= new.usuarioId);
		SET entrada= (SELECT fechaAlta FROM Usuarios WHERE usuarioId=NEW.usuarioId);
		SET edad = TIMESTAMPDIFF(YEAR,nacimiento,entrada);
		
		IF(edad<18) THEN
		
		SIGNAL SQLSTATE '45000' 
		SET message_text ='La persona de la cuenta debe ser mayor de edad para poder registrarse';
		
		END IF;
	END //
DELIMITER ;

		
-- RN-1-04 Como máximo 5 fotos por usuarios
DELIMITER //
CREATE OR REPLACE TRIGGER
	tMaximoFotos
BEFORE INSERT ON fotos FOR EACH ROW
	BEGIN
		DECLARE numFotos INT;
		SET numFotos = (SELECT COUNT(*) FROM fotos WHERE usuarioId = NEW.usuarioId);
		
		IF(numFotos>=5) THEN
		
		SIGNAL SQLSTATE '45000' 
		SET message_text ='Un usuario solo puede subir 5 fotos a su cuenta';
		
		END IF;
	END //
DELIMITER ;
		

-- Se debe establecer una fecha de revocación al romper el vínculo
DELIMITER //
CREATE OR REPLACE TRIGGER 
	tFechaRevocacionActivoUpdate
BEFORE UPDATE ON vinculos FOR EACH ROW
BEGIN

	IF(NEW.activo = 0 AND NEW.fechaRevocacion IS NULL) THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'RN2-01: Un vínculo que previamente estaba activo y que ya no lo está, debe tener fecha de revocación';
	
	END IF;
	
END //

DELIMITER ; 

-- La fecha de los mensajes deben estar dentro del intervalo de las fechas de conversacion RN4_03
/*
DELIMITER //

CREATE OR REPLACE TRIGGER
	tFechaMensajes
BEFORE INSERT ON Mensajes FOR EACH ROW 
BEGIN
		DECLARE f_inicio DATE;
		DECLARE f_fin DATE;

		SET f_inicio = (SELECT fechaInicio FROM Conversaciones WHERE conversacionId = NEW.conversacionId);

		SET f_fin = (SELECT fechaFin FROM Conversaciones WHERE conversacionId = NEW.conversacionId);

		IF (NEW.fechaMensaje < f_Inicio OR NEW.fechaMensaje > f_fin) THEN 
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La fecha del mensaje debe ser posterior a la fecha de inicio de conversación y anterior a la fecha de fin de conversación';
		END IF;
END//
DELIMITER ;
*/
-- RN 2-05 usuarios activo solicitudes
DELIMITER //
CREATE OR REPLACE TRIGGER
	SolicitudesSoloActivosInsert
BEFORE INSERT ON VinculosUsuarios FOR EACH ROW
BEGIN
	
	DECLARE fechaDeBajaE DATE;
	DECLARE fechaDeBajaR DATE;
	
	SET fechaDeBajaE = (SELECT fechaBaja FROM Usuarios WHERE usuarioId = new.emisorId);
	SET fechaDeBajaR = (SELECT fechaBaja FROM Usuarios WHERE usuarioId = new.receptorId);
	
	IF (fechaDeBajaE != 'NULL' OR fechaDeBajaR != 'NULL') THEN
		DELETE FROM vinculos WHERE vinculos.vinculoId = new.vinculoId;
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'Un usuario no activo, es decir, con fecha de baja, no puede 
		enviar una solicitud de amistad a otro usuario ni tampoco recibirla';
	END IF;

END //
DELIMITER ;


DELIMITER //
CREATE OR REPLACE TRIGGER
	SolicitudesSoloActivosUpdate
BEFORE UPDATE ON VinculosUsuarios FOR EACH ROW
BEGIN
	
	DECLARE fechaDeBajaE DATE;
	DECLARE fechaDeBajaR DATE;
	
	SET fechaDeBajaE = (SELECT fechaBaja FROM Usuarios WHERE usuarioId = new.emisorId);
	SET fechaDeBajaR = (SELECT fechaBaja FROM Usuarios WHERE usuarioId = new.receptorId);
	
	IF (fechaDeBajaE != 'NULL' OR fechaDeBajaR != 'NULL') THEN
		DELETE FROM vinculos WHERE vinculoId = NEW.vinculoId;
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'Un usuario no activo, es decir, con fecha de baja, no puede 
		enviar una solicitud de amistad a otro usuario ni tampoco recibirla';
	END IF;

END //
DELIMITER ;

/*
-- RN 4-02 conversación de chat normal solo con vinculo activo--
DELIMITER //
CREATE OR REPLACE TRIGGER
	ConversacionesSoloVinculoActivoInsert
BEFORE INSERT ON Conversaciones FOR EACH ROW
BEGIN
	
	DECLARE vinc BOOLEAN;
	
	SET vinc = (SELECT activo FROM Vinculos WHERE vinculoId = NEW.vinculoId);
	IF (vinc = 0) THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'No se puede iniciar una conversacion entre dos usuarios si su vinculo no es activo';
	END IF;

END //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER
	ConversacionesSoloVinculoActivoUpdate
BEFORE UPDATE ON Conversaciones FOR EACH ROW
BEGIN
	
	DECLARE vinc BOOLEAN;
	
	SET vinc = (SELECT activo FROM Vinculos WHERE vinculoId = NEW.vinculoId);
	IF (vinc = 0) THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'No se puede iniciar una conversacion entre dos usuarios si su vinculo no es activo';
	END IF;

END //
DELIMITER ;
*/