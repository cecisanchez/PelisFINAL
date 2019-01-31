// Conexion de la base de datos 

var con = require('../lib/conexionbd.js');

module.exports = {
  listarGeneros: listarGeneros,
  listarDirectores: listarDirectores,
  listarActores: listarActores,
  obtenerCompetencias: obtenerCompetencias,
  obtener1Competencia: obtener1Competencia,
  cargarOpciones: cargarOpciones,
  votar: votar,
  cargarResultados: cargarResultados,
  crearCompetencia: crearCompetencia,
  eliminarVotos: eliminarVotos,
  eliminarCompetencia: eliminarCompetencia,
  editarCompetencia: editarCompetencia,
};

// Lista generos
function listarGeneros(req, res) {
  var sql = 'SELECT * FROM genero';
  
  con.query(sql, function(error, resultado, campos) {
    if(error) {
      console.log("Hubo un error en la consulta Generos.", error.message);
      return res.status(500).send("Hubo un error en la consulta Generos.");
    };
    res.status(200).send(JSON.stringify(resultado));
  })
};

// Lista directores
function listarDirectores(req, res) {
  var sql = 'SELECT * FROM director';
  
  con.query(sql, function(error, resultado, campos) {
    if(error) {
      console.log("Hubo un error en la consulta de Directores.", error.message);
      return res.status(500).send("Hubo un error en la consulta Directores.");
    };
    res.status(200).send(JSON.stringify(resultado));
  })
};

// Lista actores y actrices
function listarActores(req, res) {
  var sql = 'SELECT * FROM actor';
  
  con.query(sql, function(error, resultado, campos) {
    if(error) {
      console.log("Hubo un error en la consulta de Actores.", error.message);
      return res.status(500).send("Hubo un error en la consulta de Actores.");
    };
    res.status(200).send(JSON.stringify(resultado));
  })
};

// Filtro de busqueda de peliculas
function buscarPeliculas(genero, director, actor) {
  var unionBd = function() {
    var sql = '';
    if(director > 0) {
      sql += ` JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id
               JOIN director ON director_pelicula.director_id = director.id`
    }
    if(actor > 0) {
      sql += ` JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id
               JOIN actor ON actor_pelicula.actor_id = actor.id`
    }
    return sql;
  }

  var filtradoBd = function() {
    var sql = '';
    if((genero + director + actor) > 0) {
      sql += ' WHERE ';
    }
    if(genero > 0) {
      sql += 'genero_id = ' + genero;
    }
    if(genero > 0 && (director > 0 || actor > 0)) {
      sql += ' AND ';
    }
    if(director > 0) {
      sql += 'director.id = ' + director;
    }
    if(director > 0 && actor > 0) {
      sql += ' AND ';
    }
    if(actor > 0) {
      sql += 'actor.id = ' + actor;
    }
    return sql;
  }

  var sql = 'SELECT pelicula.* FROM pelicula' + unionBd() + filtradoBd() + ' ORDER BY RAND() LIMIT 2';

  return sql;
}

// Se Obtienen LA Competencia seleccionada
function obtener1Competencia(req, res) {
  var id = req.params.id;
  //console.log(id);
  var sql = 'SELECT * FROM vs_competencias WHERE id = ?';

  con.query(sql, [id], function(error, resultado, campos) {
    if(error) {
      console.log("Hubo un error en la consulta de 1 competencia.", error.message);
      return res.status(500).send("Hubo un error en la consulta de 1 competencia.");
    };
    if(!id) {
      console.log("La competencia no existe.");
      return res.status(404).send("La competencia no existe.");
    };
    //console.log(resultado[0])
    res.send(JSON.stringify(resultado[0]));
  })
};

// Se Obtienen las Competencias de la BD
function obtenerCompetencias(req, res) {
    var sql = 'select * from vs_competencias'; 
    //console.log(sql);  
    con.query(sql, function(error, resultado, fields) {
      if (error) {
        console.log ("Hubo un error en la consulta Competencias.", error.message);
        return res.status(404).send("Hubo un error en la consulta Competencias.");
      }
      res.send(JSON.stringify(resultado));
    });
  };

  
 
// Se obtienen las 2 peliculas random para la Competencia
function cargarOpciones(req, res) {
    var idCompetencia = req.params.id;

    //PRIMER CONSULTA DE COMPETENCIAS
    var sql = 'select * from vs_competencias WHERE vs_competencias.id= ' + idCompetencia; 
 
    con.query(sql, function(error, resultado, fields) {
        if(resultado.length <= 0) {
        console.log("La competencia no existe.");
        return res.status(404).send("La competencia no existe.");
        }

        if (error) {
        console.log ("Hubo un error en la consulta.", error.message);
        return res.status(404).send("Hubo un error en la consulta.");
        }
        
      //creamos el objeto Opciones
      var respuesta = {
        competencia: resultado[0].nombre,
        genero_id: resultado[0].genero_id,
        director_id: resultado[0].director_id,
        actor_id: resultado[0].actor_id,
      };
    
      var sql = buscarPeliculas(respuesta.genero_id, respuesta.director_id, respuesta.actor_id);
   con.query(sql, function(error, resultado, campos) {
     if(error) {
       console.log("Hubo un error en la consulta.", error.message);
       return res.status(500).send("Hubo un error en la consulta.");
     };
     respuesta.peliculas = resultado;
     res.send(JSON.stringify(respuesta));
     console.log(sql);
     console.log(respuesta);
   })
 })
};

  // Se guardan los votos
function votar(req, res) {
  var idCompetencia = req.params.id;
  var idPelicula = req.body.idPelicula;

  var sql = 'INSERT INTO voto (id_competencia, id_pelicula) VALUES (' + idCompetencia + ', ' + idPelicula + ')'; 
  //console.log(sql);  
  con.query(sql, function(error, resultado, fields) {
    if(!idCompetencia) {
      console.log("La competencia no existe.");
      return res.status(500).send("La competencia no existe.");
    };
    if(!idPelicula) {
      console.log("La pelicula no existe");
      return res.status(500).send("La pelicula no existe.");
    };
    if (error) {
      console.log ("Hubo un error al registrar un voto", error.message);
      return res.status(500).send("Hubo un error al registrar un voto.");
    };
    res.status(200).send("Voto agregado");
    //console.log('Id Competencia' + idCompetencia);
    //console.log('Id Peli' + idPelicula);
    console.log("Agregaste el voto a la DB en la tabla voto.");
  });
};

// Se Obtienen los resultados
function cargarResultados(req, res) {
  var idCompetencia = 1;

  var sql = `SELECT vs_competencias.nombre, 
  pelicula.id, 
  pelicula.titulo, 
  pelicula.poster, 
  count(voto.id_pelicula) as votos
  FROM vs_competencias
  JOIN voto ON voto.id_competencia = vs_competencias.id 
  JOIN pelicula ON voto.id_pelicula = pelicula.id
  WHERE vs_competencias.id = ` + idCompetencia + `
  GROUP BY pelicula.id
  ORDER BY votos DESC
  LIMIT 0,3;` 

  con.query(sql, function(error, resultado, fields) {
    if(error) {
      console.log ("Hubo un error en la consulta de los Resultados.", error.message);
      return res.status(404).send("Hubo un error en la consulta de los Resultados.");
    }
    var respuesta = {
      competencia: resultado[0].nombre,
      resultados: resultado,
    }
    res.send(JSON.stringify(respuesta));
  });
};

function crearCompetencia(req, res) {
  var nombre = req.body.nombre === '' ? null : req.body.nombre;
  var genero_id = req.body.genero;
  var director_id = req.body.director;
  var actor_id = req.body.actor;

  // Buscamos si existe una competencia con el mismo nombre
  var sqlBusqueda = 'SELECT * FROM vs_competencias WHERE nombre = ?'
  con.query(sqlBusqueda, [nombre], function(error, resultado, campos) {
    if(resultado && resultado.length !== 0) {
      console.log("La competencia ya existe.");
      return res.status(422).send("La competencia ya existe.");
    } else {
      // Valida que existan al menos dos competencias con los filtros
      var sqlbuscarPeliculas = buscarPeliculas(genero_id, director_id, actor_id);
      con.query(sqlbuscarPeliculas, [nombre], function(error, resultado, campos) {
        if(resultado && resultado.length < 2) {
          console.log("La cantidad de resultados obtenidos no es suficiente.");
          return res.status(422).send("La cantidad de resultados obtenidos no es suficiente.");
        } else {
          var sql = 'INSERT INTO vs_competencias (nombre, genero_id, director_id, actor_id) VALUES (?, ?, ?, ?)';
          con.query(sql, [nombre, genero_id, director_id, actor_id], function(error, resultado, campos) {
            if(error) {
              console.log("El nombre no puede estar vacia.", error.message);
              return res.status(422).send("El nombre no puede estar vacia.");
            }
            
            return res.status(200).send("Se creo la competencia.");
          })
        };
      })  
    }
  })
};


// Eliminar los votos de una competencia
function eliminarVotos(req, res) {
  var idCompetencia = req.params.id;

  var sql = 'DELETE FROM voto WHERE id_competencia = (' + idCompetencia + ')';
  con.query(sql, function(error, resultado, campos) {
    if(error) {
      console.log("No se borraron los votos.", error.message);
      return res.status(500).send("No se borraron votos.");
    };
    return res.status(200).send("Se eliminaron los votos.");
  })

};

// Eliminamos la competencia seleccionada
function eliminarCompetencia(req, res) {
  var idCompetencia = req.params.id;
  var sql = 'DELETE FROM vs_competencias WHERE id = (' + idCompetencia + ')';
  con.query(sql, function(error, resultado, campos) {
    if(error) {
      console.log("No se encuentra la competencia.", error.message);
      return res.status(404).send("No se encuentra la competencia.");
    };
    eliminarVotos(req, res);
  })
};

// Editamos el nombre de LA competencia
function editarCompetencia(req, res) {
  var idCompetencia = req.params.id;
  var nuevoNombre = req.body.nombre === '' ? null : req.body.nombre;
  var sql = 'UPDATE vs_competencias SET nombre = ? WHERE id = (' + idCompetencia + ')';
  con.query(sql, [nuevoNombre], function(error, resultado, campos) {
    if(error) {
      console.log("Completar campo nombre.", error.message);
      return res.status(422).send("Completar campo nombre.");
    }
    if(!idCompetencia) {
      console.log("La competencia no existe");
      return res.status(404).send("La competencia no existe.");
    }
    console.log("Se edito la competencia.");
    res.status(200).send("Se edito la competencia.");
  })
};
  
  
  