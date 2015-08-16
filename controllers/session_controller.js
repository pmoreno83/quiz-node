//MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
	if (req.session.user){
		next();
	} else {
		res.redirect('/login');
	}
};

//MW de autologout
exports.autoLogout = function(req, res, next){
	
	if (req.session.last){
		var diferencia = req.time - req.session.last;
	
		if (diferencia > 120000){ //si han pasado mas de 2 minutos desde la ultima transaccion, se hace logout
			res.redirect('/logout');
			return;
		} else {
			req.session.last = req.time;
		}
	}

	next(); 

};

//GET /login . formulario de login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sessions/new', {errors: errors});
};

//POST /login - crea la sesion
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;
	var userController = require('./user_controller');

	userController.autenticar(login, password, function(error, user){
		if (error){ //si hay error retornamos mensaje de error de sesion
			req.session.errors = [{"message": 'Se ha producido un error ' + error}];
			res.redirect('/login');
			return;
		}

		//crear req.session.user y guardar campos id y username
		//la sesion se define por la existencia de req.session.user
		req.session.user = {id: user.id, username: user.username};
		req.session.last = new Date().getTime();
		res.redirect(req.session.redir.toString());//redireccion a path anterior a login
	});

};

//DELETE /logout - destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	delete req.session.last;
	res.redirect(req.session.redir.toString());//redireccion a path anterior a login
};