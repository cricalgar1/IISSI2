DELIMITER //
CREATE OR REPLACE PROCEDURE
populate()
BEGIN

SET FOREIGN_KEY_CHECKS=0;
DELETE FROM Usuarios;
DELETE FROM FichaPreferencias;
DELETE FROM Vinculos;
/*DELETE FROM Conversaciones;
DELETE FROM Mensajes;*/
DELETE FROM Fotos;
DELETE FROM Aficiones;
DELETE FROM UsuariosAficiones;
DELETE FROM VinculosUsuarios;
DELETE FROM FichaPreferenciaAficiones;
DELETE FROM Provincias;
DELETE FROM Municipios;
DELETE FROM CodigosPostales;

SET FOREIGN_KEY_CHECKS=1;

ALTER TABLE Usuarios AUTO_INCREMENT=1;
ALTER TABLE FichaPreferencias AUTO_INCREMENT=1;
ALTER TABLE Vinculos AUTO_INCREMENT=1;
/*ALTER TABLE Conversaciones AUTO_INCREMENT=1;
ALTER TABLE Mensajes AUTO_INCREMENT=1;*/
ALTER TABLE Fotos AUTO_INCREMENT=1;
ALTER TABLE Aficiones AUTO_INCREMENT=1;
ALTER TABLE UsuariosAficiones AUTO_INCREMENT=1;
ALTER TABLE VinculosUsuarios AUTO_INCREMENT=1;
ALTER TABLE FichaPreferenciaAficiones AUTO_INCREMENT=1;
ALTER TABLE Provincias AUTO_INCREMENT=1;
ALTER TABLE Municipios AUTO_INCREMENT=1;
ALTER TABLE CodigosPostales AUTO_INCREMENT=1;


INSERT INTO Provincias (nombreProvincia) VALUES
('Almería'),
('Cádiz'),
('Córdoba'),
('Granada'),
('Huelva'),
('Jaén'),
('Málaga'),
('Sevilla');

INSERT INTO Municipios (provinciaId, nombreMunicipio) VALUES
(1, 'Ejido'),
(1, 'Berja'),
(1, 'Vera'),
(2, 'Jerez de la Frontera'),
(2, 'Rota'),
(2, 'Algeciras'),
(2, 'Chiclana de la Frontera'),
(2, 'Puerto de Santa Maria'),
(2, 'Barbate'),
(3, 'Fuente de Tójar'),
(3, 'Priego de Cordoba'),
(3, 'Iznajar'),
(4, 'Motril'),
(4, 'Almuñécar'),
(4, 'Gójar'),
(4, 'Guadix'),
(5, 'Lepe'),
(5, 'Almonte'),
(5, 'Isla Cristina'),
(5, 'Ayamonte'),
(5, 'Punta Umbría'),
(6, 'Linares'),
(6, 'Úbeda'),
(6, 'Baeza'),
(7, 'Marbella'),
(7, 'Ronda'),
(7, 'Fuengirola'),
(7, 'Estepona'),
(7, 'Mijas'),
(7, 'Benalmádena'),
(7, 'Antequera'),
(8, 'Dos Hermanas'),
(8, 'Utrera'),
(8, 'Alcalá de Guadaira'),
(8, 'Tomares'),
(8, 'Mairena del Aljarafe'),
(8, 'Camas'),
(8, 'Sevilla'),
(8, 'Espartinas');
INSERT INTO CodigosPostales (municipioId, codigoPostal) VALUES
(1, '04700'),
(2, '04760'),
(3, '04620'),
(4, '11401'),
(5, '11520'),
(6, '11200'),
(7, '11130'),
(8, '11500'),
(9, '11160'),
(10, '14815'),
(11, '14800'),
(12, '14970'),
(13, '18600'),
(14, '18690'),
(15, '18150'),
(16, '18500'),
(17, '21440'),
(18, '21730'),
(19, '21410'),
(20, '21400'),
(21, '21100'),
(22, '23700'),
(23, '23400'),
(24, '23440'),
(25, '29600'),
(26, '29400'),
(27, '29640'),
(28, '29680'),
(29, '29650'),
(30, '29630'),
(31, '29200'),
(32, '41700'),
(33, '41710'),
(34, '41500'),
(35, '41940'),
(36, '41927'),
(37, '41900'),
(38, '41001'),
(38, '41002'),
(38, '41003'),
(38, '41004'),
(38, '41005'),
(38, '41006'),
(38, '41007'),
(38, '41008'),
(38, '41009'),
(38, '41010'),
(38, '41011'),
(38, '41012'),
(38, '41013'),
(38, '41014'),
(38, '41015'),
(38, '41016'),
(38, '41017'),
(38, '41018'),
(38, '41019'),
(38, '41020'),
(38, '41092'),
(38, '41970'),
(39, '41807');

-- Contraseñas: admin
INSERT INTO Usuarios (email, PASSWORD, nombre, fechaNacimiento, altura, peso, genero, colorOjos, colorPelo, fechaAlta, fechaBaja, biografia, direccion, codigoPostalId, provinciaId, municipioId ) VALUES
('manolo10@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'man-olo', '1980-03-12', 180, 80.0, 'Masculino', 'Negro', 'Castaño', '2016-03-12', NULL, 'MDLR', 'Avenida Reina Mercedes, 39, 1ºC', 1, 1, 1),
('jaimeramos@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'jose_xd', '1976-06-04', 170, 75.7, 'Otros', 'Azul', 'Rojo', '2016-06-04', NULL, 'amigo de mis amigos','Sevilla, C/ Castillo de Marchenilla 1 3ºD', 2, 2, 2),
('luciaa6@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'luciaR', '1967-10-22', 155, 62.3, 'Femenino', 'Verde', 'Rubio', '2020-10-22', NULL, 'Estudiante de Derecho', 'Calle Tarfia, 24, 2ºA', 3, 3, 3),
('pepegarcia@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'pepeUwU', '2000-12-01', 167 , 70.5 , 'Femenino', 'Verde', 'Rojo', '2021-12-01',NULL,'Estudiante Derecho', 'Calle Dormitorio,4,3ºB', 1, 1, 1),
('marialuisa@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'Mluisa03', '2000-01-30', 175, 78.6, 'Otros', 'Negro', 'Castaño', '2021-01-30', NULL, 'Me gusta el Betis','Urbanizacion Las Dalias, 7, 4ºA', 2, 2, 2),
('albertomartinez@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'Xx_Alberto69_xX', '1986-03-20', 190, 84.5, 'Masculino', 'Verde', 'Rubio', '2019-04-20', NULL, 'futbolista', 'Alicante, Avenida de Orihuela 5 3ªA', 3, 3, 3),
('martagomez@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'Martita3', '1990-11-02', 159, 55.3, 'Femenino', 'Gris', 'Gris', '2021-11-02', NULL, 'Profesora', 'Sevilla, Calle San Luis, 25, 1ªB', 4, 4, 4),
('jimenagarcia@gmail.com', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'Jimmy', '1999-7-18', 163, 67.5, 'Femenino', 'Azul', 'Rubio', '2020-7-18', NULL, 'Mi gato se llama Misi','Avenida Platero, 45,5ºC',1, 5, 1),
('admin@us.es', 'pbkdf2:sha256:260000$bZUw1ka5b73LrdTr$75393ababfc9b8cc24dbaf5140fad9d2158a83af75df194eddbf6519fed08ec2', 'admin', '1990-05-28', 165, 70, 'Otros', 'Castaño', 'Castaño', '2022-05-28', NULL, 'Proyecto', 'Avenida Renia Mercedes', 38, 8, 7);


INSERT INTO FichaPreferencias (usuarioId, rangoEdad, rangoEstatura, rangoPeso, filtroGenero, filtroOjo, filtroColorPelo, ubicacion) VALUES
(1, 23, 165, 70, 'Masculino', 'Verde', 'Negro', 'Provincia'),
(2, 24, 171, 60, 'Femenino', 'Gris', 'Rubio', 'Provincia'),
(3, 25, 175, 65, 'Masculino', 'Castaño', 'Rubio', 'Provincia'),
(4, 21, 170, 60, 'Femenino', 'Negro', 'Negro', 'Provincia'),
(5, 22, 167, 55, 'Femenino', 'Azul', 'Castaño', 'Provincia');

INSERT INTO Vinculos (activo, fecha, fechaAceptacion, fechaRevocacion) VALUES
(1, '2021-03-19', '2021-03-20', null),
(1, '2021-12-15', '2021-12-20', null),
(1, '2021-12-15', '2021-12-16', null),
(1, '2021-12-04', '2021-12-07', null),
(1, '2020-04-04', '2020-04-05', null),
(1, '2021-12-03', '2021-12-07', null),
(1, '2021-02-15', '2021-02-16', null),
(1, '2021-06-19', '2021-06-19', null),
(1, '2021-04-03', '2021-04-06', NULL),
(1, '2020-08-13', '2020-09-19', null);
/*
INSERT INTO Conversaciones (vinculoId, fechaInicio, fechaFin) VALUES
(1,'2021-03-21',NULL),
(2,'2021-12-23',NULL),
(3,'2021-12-17','2021-12-30'),
(4,'2021-12-09',NULL),
(5,'2020-04-23',NULL),
(6,'2021-12-07','2021-12-31'),
(7,'2021-02-27',NULL),
(8,'2021-06-21',NULL),
(9,'2021-10-11', '2021-12-01');



INSERT INTO Mensajes (conversacionId, texto, fechaMensaje) VALUES
(1,'hola, ¿que tal?', '2021-03-21'),
(1,'heyy, muy bien y tu?','2021-03-22'),
(2,'¿has visto la nueva peli de Spiderman', '2021-12-23'),
(2,'si es increible!!!', '2021-12-24'),
(3, 'hola', '2021-12-17'),
(3, '¿como te llamas?', '2021-12-18'),
(3, 'adios', '2021-12-30'),
(4, 'no tengo entradas', '2021-12-09'),
(4, 'Una pena', '2021-12-10'),	
(5, 'uwu', '2020-04-23'),
(5, 'owo', '2022-01-01'),
(6, 'hey,k tal', '2021-12-07'),
(6, 'WoOoOoO, perdona por responder', '2021-12-30'),
(6, 'np', '2021-12-30'),
(7,'hola que pasa?','2021-02-28'),
(7,'nada','2021-03-03'),
(8,'como estas?','2021-10-13'),
(8,'bien','2021-10-13'),
(9, 'Hola qué pasa?', '2021-10-12'),
(9, 'He estado ocupado', '2021-11-06');
*/

INSERT INTO Fotos (usuarioId, urlFoto, nombre, descripcion, fechaPublicacion, fotoPerfil) VALUES
(2, 'comofuncionaque.com/wp-content/uploads/2015/05/La-persona-es-un-ser-capaz-de-pensar-razonar-tener-sentimientos-y-emociones.jpg.jpg', 'foto1', 'hola, uwu', '2021-04-03', 1),
(2, 'i.blogs.es/5efe2c/cap_001/450_1000.jpg', 'foto2', 'hey, buenas tardes','2021-05-03', 0),
(2, 'services.meteored.com/img/article/des-micro-organismes-terrestres-capables-de-survivre-temporairement-sur-mars-316371-1_1280.jpeg','foto3','esquiando','2020-12-31', 0),
(3, 'ichef.bbci.co.uk/news/640/cpsprodpb/192F/production/_111874460_gettyimages-1162834347-1.jpg', 'foto4', 'año nuevo', '2021-01-03', 1),
(6, 'i.blogs.es/f2c5cd/02nasa2-superjumbo/1366_2000.jpg', 'foto6', 'mi jardin', '2021-06-05', 1),
(6, 's-i.huffpost.com/gen/1224269/images/o-ANGRY-STOCK-PHOTOS-facebook.jpg','foto9','feliz cumpleaños para mi!','2021-4-15', 0),
(7, 'thepopularlist.com/wp-content/uploads/2019/11/shutterstock_439112008.jpg','foto10','netflix&chill','2021-10-23', 1),
(7, 'media.istockphoto.com/photos/happy-senior-man-giving-thumb-up-picture-id153696622', 'foto11', 'entrenando', '2021-12-01', 0),
(8, 'www.lolwot.com/wp-content/uploads/2015/06/18-hilarious-and-bizarre-stock-photos-13.jpg', 'foto12', 'Con mis amigas', '2020-09-12', 1);


INSERT INTO Aficiones (nombre) VALUES
('Futbol'),
('Cine'),
('Surfear'),
('Pintura'),
('Musica'),
('Videojuegos'),
('Baloncesto'),
('Voleybol'),
('Hockey'),
('Fotografia'),
('Lectura'),
('Senderismo'),
('Correr'),
('Nadar'),
('Cocinar'),
('Ceramica'),
('Animales')
;

INSERT INTO UsuariosAficiones (usuarioId, aficionId) VALUES
(1,1),
(2,4),
(3,5),
(8,3),
(5,2);


INSERT INTO VinculosUsuarios (vinculoId, emisorId, receptorId) VALUES
(1, 2, 4),
(2, 3, 4),
(3, 4, 5),
(4, 4, 6),
(5, 6, 7),
(6, 7, 8), 
(7, 1, 4),
(8, 3, 5),
(9, 1, 5),
(10, 1, 3);


INSERT INTO fichaPreferenciaAficiones (fichaPreferenciaId, aficionId) VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5);

END //
DELIMITER ;

CALL populate();
