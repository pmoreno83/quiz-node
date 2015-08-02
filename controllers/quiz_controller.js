//importamos el modelo
var models = require('../models/models');

//get('/quizes/:id')
exports.show = function (req,res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz, errors: [] });	
	});
	
};

//get('/quizes/:id/answer')
exports.answer = function (req,res){

	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	
	res.render('quizes/answer', { quiz:req.quiz, respuesta: resultado, errors: []});
};

//get('/quizes')
exports.index = function(req,res){

	if (req.query.search === undefined) {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index',{quizes: quizes, errors: []});
			}).catch(function(error){
				next(error);
			});
	} else {

		var busca = '%'+req.query.search.replace(' ','%') +'%';
		models.Quiz.findAll({where: ["pregunta like ?", busca], order: [['pregunta', 'ASC']]}).then(function(resultados){
			res.render('quizes/busca',{resultados: resultados, errors: []});
		}).catch(function(error){
			next(error);
		});
	};
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


exports.new = function(req,res){
	var quiz = models.Quiz.build( //crea objeto quiz
			{pregunta:"Pregunta", respuesta:"Respuesta", tema:"Tema" }
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {

  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema" ]})
        .then( function(){ res.redirect('/quizes');}); 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};


// PUT /quizes/:id
exports.update = function(req, res) {

  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};