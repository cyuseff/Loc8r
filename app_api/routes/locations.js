var router = require('express').Router();
var controller = require('../controllers/locations');

//locations
router.route('/')
	.get(controller.locationsListByDistance)
	.post(controller.locationsCreate);

router.route('/:locationid')
	.get(controller.locationReadOne)
	.put(controller.locationUpdateOne)
	.delete(controller.locationDeleteOne);


//review
router.route('/:locationid/reviews')
	.post(controller.reviewsCreate);

router.route('/:locationid/reviews/:reviewid')
	.get(controller.reviewsReadOne)
	.put(controller.reviewsUpdateOne)
	.delete(controller.reviewsDeleteOne);
	

module.exports = function(app){
  app.use('/api/locations', router);
}