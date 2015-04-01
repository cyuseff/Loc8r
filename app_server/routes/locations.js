var router = require('express').Router();
var controller = require('../controllers/locations');

router.route('/')
	.get(controller.list);

router.route('/:locationid')
	.get(controller.show);

router.route('/:locationid/reviews/new')
	.get(controller.addReview)
	.post(controller.doAddReview);

module.exports = function(app){
  app.use('/location', router);
}