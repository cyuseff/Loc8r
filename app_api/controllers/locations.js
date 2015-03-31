var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

//
function sendJsonResponse(res, status, content){
	res.status(status).json(content);
}

var theEarth = {
	radius: 6371,
	getDistanceFromRands: function(rads){
		return parseFloat(rads * this.radius);
	},
	getRadsFromDistance: function(distance) {
		return parseFloat(distance / this.radius);
	}
};


function createLocation(loc) {
	var location = {
		distance: theEarth.getDistanceFromRands(loc.dis),
		name: loc.obj.name,
		address: loc.obj.address,
		rating: loc.obj.rating,
		facilities: loc.obj.facilities,
		_id: loc._id

	};
	return location;
}

function doAddReview(request, response, location) {

	if(!location) {
		sendJsonResponse(response, 404, {'message':'locationid not found'});
	} else {

		location.reviews.push({
			author: request.body.author,
			rating: parseFloat(request.body.rating),
			reviewText: request.body.reviewText
		});

		location.save(function(err, location){
			if(err) {
				sendJsonResponse(response, 404, err);
			} else {
				updateAverangeRating(location._id);
				sendJsonResponse(response, 201, location.reviews[location.reviews.length - 1]);
			}
		});

	}
}

var updateAverangeRating = function(locationid){
	Loc
		.findById(locationid)
		.select('rating reviews')
		.exec(function(err, location){
			if(!err && location) doSetAverangeRating(location);
		});
}

var doSetAverangeRating = function(location){
	
	if(location.reviews && location.reviews.length > 0) {
		var l = location.reviews.length;
		var rr = 0;
		for(var i=0; i<l; i++) rr += location.reviews[i].rating;

		var rating = parseFloat((rr / l).toFixed(2));

		location.rating = rating;
		location.save(function(err){
			if(err) {
				console.log(err);
			} else {
				console.log('Averange rating updated to ' + rating);
			}
		});
	}
}


// /locations
module.exports.locationsCreate = function(request, response){

	console.log(request.body);
	
	Loc.create({
		name: request.body.name,
		address: request.body.address,
		facilities: request.body.facilities.split(","),
		coords: [parseFloat(request.body.lng), parseFloat(request.body.lat)],
		openingTimes: [
			{
				days: request.body.days1,
				opening: request.body.opening1,
				closing: request.body.closing1,
				closed: request.body.closed1,
			},
			{
				days: request.body.days2,
				opening: request.body.opening2,
				closing: request.body.closing2,
				closed: request.body.closed2,
			}
		]
	}, function(err, location) {
		if (err) {
			sendJsonResponse(response, 400, err);
		} else {
			sendJsonResponse(response, 201, location);
		}
	});

}

module.exports.locationsListByDistance = function(request, response){
	
	var lng = parseFloat(request.query.lng);
	var lat = parseFloat(request.query.lat);
	var distance = request.query.distance || 20;

	var point = {
		type:'Point',
		coordinates:[lng, lat]
	}

	var geoOptions = {
		spherical:true,
		maxDistance: theEarth.getRadsFromDistance(distance),
		num:10
	};

	if(!lng || !lat) {
		sendJsonResponse(response, 404, {'message':'lng and lat query parameters are required'});
		return;
	}

	Loc.geoNear(point, geoOptions, function(err, results, stats){

		if(err) {
			sendJsonResponse(response, 404, err);
			return;
		} else {
			var locations = [];
			for(var i=0, l=results.length; i<l; i++) locations.push( new createLocation(results[i]) );
			sendJsonResponse(response, 200, locations);
		}
		
	});

}



// /locations/:locationid
module.exports.locationReadOne = function(request, response){

	if(request.params && request.params.locationid) {
		Loc
		.findById(request.params.locationid)
		.exec(function(err, location){
			if(!location) {
				sendJsonResponse(response, 404, {'message':'Location not found'});
				return;
			} else if (err) {
				sendJsonResponse(response, 404, err);
				return;
			}
			sendJsonResponse(response, 200, location);
		});
	} else {
		sendJsonResponse(response, 404, {'message':'No locationid in request'});
	}

}

module.exports.locationUpdateOne = function(request, response){
	sendJsonResponse(response, 200, {'status':'success'});
}

module.exports.locationDeleteOne = function(request, response){
	sendJsonResponse(response, 200, {'status':'success'});
}



// /locations/:locationid/review
module.exports.reviewsCreate = function(request, response){
	var locationid = request.params.locationid;
	if(locationid) {
		
		Loc
			.findById(locationid)
			.select('reviews')
			.exec(function(err, location){
				if(err) {
					sendJsonResponse(response, 404, err);
				} else {
					doAddReview(request, response, location);
				}
			});

	} else {
		sendJsonResponse(response, 404, {'message':'Not found, location required'});
	}
}



// /locations/:locationid/review/:reviewid
module.exports.reviewsReadOne = function(request, response){
	if(request.params && request.params.locationid && request.params.reviewid) {
		Loc
		.findById(request.params.locationid)
		.select('name reviews')	//this limit the response to only these 2 objects
		.exec(function(err, location){

			if(!location) {
				sendJsonResponse(response, 404, {'message':'Location not found'});
				return;
			} else if (err) {
				sendJsonResponse(response, 404, err);
				return;
			}

			if(location.reviews && location.reviews.length > 0) {
				console.log(location);
				var review = location.reviews.id(request.params.reviewid);
				console.log(review);

				if(!review) {
					sendJsonResponse(response, 404, {'message':'Review not found'});
				} else {
					var obj = {
						location:{
							name:location.name,
							id:request.params.locationid
						},
						review: review
					};
					sendJsonResponse(response, 200, obj);
				}
			} else {
				sendJsonResponse(response, 404, {'message':'no review found'});
			}

		});
	} else {
		sendJsonResponse(response, 404, {'message':'Not found, locationid and reviewid are both required'});
	}
}

module.exports.reviewsUpdateOne = function(request, response){
	response.status(200).json({'status':'success'});
}

module.exports.reviewsDeleteOne = function(request, response){
	response.status(200).json({'status':'success'});
}





