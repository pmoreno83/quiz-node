var path = require('path');
var Sequelize = require('sequelize'); //cargar modelo ORM

//usar BD sqlite
var sequelize = new Sequelize(null, null, null, 
				{
					dialect: "sqlite",
					storage: "quiz.sqlite"
				});

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //exportar definion tabla Quiz

//sequelize.sync() crea e inicializa la tabla de preguntas en BD. Crea el fichero quiz.sqlite
sequelize.sync().success(function() {
	//success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		if (count === 0){ //la tabla se inicializa solo si esta vacia
			Quiz.create(
				{
					pregunta: 'Capital de Italia',
					respuesta: 'Roma'
				}).success(function(){
					console.log('Base de datos inicializada')
				});
		};
	});
})
