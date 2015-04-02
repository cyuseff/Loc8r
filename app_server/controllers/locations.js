var Req = require('request');
var apiOption = {
	server : 'http://localhost:5000'
}

if(process.env.NODE_ENV === 'production') {
	apiOption.server = 'https://whispering-citadel-7231.herokuapp.com';
}


var renderHomepage = function(request, response, body){

	var message;
	if(!(body instanceof Array)) {
		message = 'API lookup error';
		body = [];
	} else {
		if(!body.length) {
			message = 'No places found nearby';
		}
	}

	response.render('location-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find plces to work with wifi near you!'
		},
		sidebar: 'Cras imperdiet nulla odio, vitae tempus ex mattis ac. Sed sit amet velit id nulla iaculis viverra. Nullam nisl urna, finibus nec efficitur a, mattis ut odio. Pellentesque porttitor lacus et orci pellentesque semper. Etiam egestas vel enim vel blandit.',
		locations: body,
		message: message
	});
}


var renderShowPage = function(request, response, body){
	response.render('location-show', {
		title: body.name,
		pageHeader: {title: body.name},
		sidebar: 'Cras imperdiet nulla odio, vitae tempus ex mattis ac. Sed sit amet velit id nulla iaculis viverra. Nullam nisl urna, finibus nec efficitur a, mattis ut odio. Pellentesque porttitor lacus et orci pellentesque semper. Etiam egestas vel enim vel blandit.',
		location: body
	});
}

var renderReviewForm = function(request, response, body){
	response.render('location-review-form', {
		title: 'Review "'+ body.name + '" on Loc8r',
		pageHeader: { title: 'Review '+ body.name },
		error: request.query.err
	});
}


var showError = function(request, response, status){
	var title, content;

	if(status === 404) {
		title = '404, page not found';
		content = "Oh dear. Looks like we can't find this page. Sorry";
	} else {
		title = status + ", something's gone wrong.";
		content = 'Something, somewhere, has gone just a little bit wrong.';
	}

	response.status(status);
	response.render('generic-text', {
		title:title,
		content:content
	});
}








var formatDistance = function(distance){
	var numDist, unit;
	if(distance > 1) {
		numDist = parseFloat(distance).toFixed(1);
		unit = 'km';
	} else {
		numDist = parseInt(distance * 1000,10);
		unit = 'm';
	}
	return numDist+unit;
}

module.exports.list = function(request, response){

	var path = '/api/locations';
	var options = {
		url: apiOption.server + path,
		method: 'GET',
		json: {},
		qs: {
			lng:-70.6513606,
			lat:-33.4332801,
			distance: 20
		}
	};

	Req(options, function(err, res, body){
		if(res.statusCode === 200 && body.length) {
			for(var i=0, l=body.length; i<l; i++) body[i].distance = formatDistance(body[i].distance);
		}
		
		renderHomepage(request, response, body);
	});
}




var getLocationInfo = function(request, response, callback){
	var path = '/api/locations/'+request.params.locationid;
	var options = {
		url: apiOption.server + path,
		method: 'GET',
		json:{}
	};

	Req(options, function(err, res, body){

		if(res.statusCode === 200) {
			var coords = {
				lng: body.coords[0],
				lat: body.coords[1]
			}
			body.coords = coords;
			callback(request, response, body);
		} else {
			showError(request, response, res.statusCode);
		}
	});
}

module.exports.show = function(request, response){
	getLocationInfo(request, response, renderShowPage);
}

module.exports.addReview = function(request, response){
	getLocationInfo(request, response, renderReviewForm);
}

module.exports.doAddReview = function(request, response){
	
	var locationid = request.params.locationid;
	var path = '/api/locations/'+locationid+'/reviews';
	var options = {
		url: apiOption.server + path,
		method: 'POST',
		json:{
			author: request.body.name,
			rating: parseInt(request.body.rating),
			reviewText: request.body.review
		}
	};

	if(!options.json.author || !options.json.rating || !options.json.reviewText) {
		response.redirect('/location/'+locationid+'/reviews/new?err=val');
	} else {
		Req(options, function(err, res, body){
			if(res.statusCode === 201) {
				response.redirect('/location/'+locationid);
			} else if(res.statusCode === 400 && body.name && body.name === 'ValidationError' ) {
				response.redirect('/location/'+locationid+'/reviews/new?err=val');
			} else {
				showError(request, response, res.statusCode);
			}
		});
	}


}





