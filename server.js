//paquetes necesarios para el proyecto
var express = require('express');  
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorCompetencias = require('./controladores/competenciasController.js');

var app = express();

app.use(cors());

//parsear los atributos que son mandandos en una URL
app.use(bodyParser.urlencoded({
    extended: true
}));

//para que los pedidos y respuestas puedan estar en formato JSON
app.use(bodyParser.json());

//cuando se llama a la ruta /competencias, se ejecuta la acción obtener competencias del controller.
app.get("/generos", controladorCompetencias.listarGeneros);
app.get("/directores", controladorCompetencias.listarDirectores);
app.get("/actores", controladorCompetencias.listarActores);
app.get ('/competencias', controladorCompetencias.obtenerCompetencias);
app.get ('/competencias/:id', controladorCompetencias.obtener1Competencia);
app.get ('/competencias/:id/peliculas', controladorCompetencias.cargarOpciones);
app.post ('/competencias/:id/voto', controladorCompetencias.votar);
app.get ('/competencias/:id/resultados', controladorCompetencias.cargarResultados);
app.post('/competencias', controladorCompetencias.crearCompetencia);
app.delete('/competencias/:id/votos', controladorCompetencias.eliminarVotos);
app.delete('/competencias/:id', controladorCompetencias.eliminarCompetencia);
app.put('/competencias/:id', controladorCompetencias.editarCompetencia);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
//especificar el IP cuando haces pedidos a otra computadora 
var puerto = '8080';

//con esto se escuchan los pedidos del front end
app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});




