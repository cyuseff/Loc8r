module.exports.index = function(request, response){
	response.writeHead(302, {'Location': '/location'});
	response.end();
}

module.exports.about = function(request, response){
	response.render('generic-text', {'title': 'About Us'});
}

module.exports.signin = function(request, response){
	response.render('signin-index', {'title': 'Sign in Loc8r'});
}