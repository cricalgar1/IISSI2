CREATE OR REPLACE VIEW fotosConUsuarios AS
	SELECT F.*, U.nombre AS nombreUsuario, U.fechaBaja
	FROM fotos F JOIN usuarios U ON (F.usuarioId = U.usuarioId);
	
CREATE OR REPLACE VIEW amistades AS
	SELECT VU.emisorId, VU.receptorId
	FROM vinculos V JOIN vinculosusuarios VU ON (V.vinculoId=VU.vinculoId)
	WHERE V.activo=1;