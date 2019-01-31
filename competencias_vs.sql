USE `competencias`;
DROP TABLE IF EXISTS `vs_competencias`;

CREATE TABLE `vs_competencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `vs_competencias` (`id`, `nombre`)
VALUES
(1,'¿Cuál es la mejor película?'),
(2,'¿Qué drama te hizo llorar más?'),
(3,'¿Cuál es la peli más bizarra?'),
(4,'¿Cuál es la que te hizo reir más?'); 

CREATE TABLE `voto` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_competencia` int(11) unsigned NOT NULL,
  `id_pelicula` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`);

ALTER TABLE `vs_competencias` ADD COLUMN  `genero_id` int(11) NOT NULL;
ALTER TABLE `vs_competencias` ADD COLUMN  `director_id` int(11) NOT NULL;
ALTER TABLE `vs_competencias` ADD COLUMN  `actor_id` int(11) NOT NULL;


