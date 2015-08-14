var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


var Sequelize = require('sequelize'); //cargar modelo ORM

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar definición de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Establecemos la relacion 1aN entre Quiz y Comments
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar definion tabla Quiz
exports.Comment = Comment; //exportar definicion tabla Comment

//sequelize.sync() crea e inicializa la tabla de preguntas en BD. Crea el fichero quiz.sqlite
sequelize.sync().then(function() {
	//success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0){ //la tabla se inicializa solo si esta vacia
			Quiz.create(
				{
					pregunta: 'Capital de Italia',
					respuesta: 'Roma',
					tema: 'otro'
				});
			Quiz.create(
				{
					pregunta: 'Capital de Grecia',
					respuesta: 'Atenas',
					tema: 'humanidades'
				});
			Quiz.create(
				{
					pregunta: 'Capital de Portugal',
					respuesta: 'Lisboa',
					tema:'ocio'
				}).then(function(){
					console.log('Base de datos inicializada')
				});
		};
	});
})
