-- RF-2-01
DELIMITER //
CREATE OR REPLACE FUNCTION
	fvinculosRevocados() 
	RETURNS INT
	BEGIN
		RETURN(
		SELECT Vinculos.vinculoId FROM Vinculos 
		WHERE Vinculos.activo=false
		);
	END //
DELIMITER ;

-- RF-4-01
/*
DELIMITER //
CREATE OR REPLACE FUNCTION elegirMensajes(fFin DATE) RETURNS VARCHAR(500) 
	BEGIN 
		DECLARE conjMensajes VARCHAR(500);
		DECLARE id INT;
		
		SET id = (SELECT conversacionId FROM conversaciones WHERE fechaFin=fFin);
	RETURN (SELECT texto FROM mensajes WHERE conversacionId = id);
	END//
DELIMITER ;

*/

