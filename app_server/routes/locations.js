var router = require('express').Router();
var controller = require('../controllers/locations');

router.route('/')
	.get(controller.list);

router.route('/show')
	.get(controller.show);

router.route('/review/new')
	.get(controller.add_review);

module.exports = function(app){
  app.use('/location', router);
}