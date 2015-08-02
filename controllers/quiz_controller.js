//importamos el modelo
var models = require('../models/models');

//get('/quizes/:id')
exports.show = function (req,res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: quiz });	
	});
	
};

//get('/quizes/:id/answer')
exports.answer = function (req,res){

	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	
	res.render('quizes/answer', { quiz:req.quiz, respuesta: resultado});
};

//get('/quizes')
exports.index = function(req,res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index',{quizes: quizes});
	}).catch(function(error){
		next(error);
	})
};

//Autoload - factoriza el codigo si la ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.findById(quizId).then(function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) { next(error); });

};