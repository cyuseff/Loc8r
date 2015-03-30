var router = require('express').Router();
var controller = require('../app_server/controllers/main');

router.route('/')
	.get(controller.index);

router.route('/about')
	.get(controller.about);

router.route('/signin')
	.get(controller.signin);

module.exports = function(app){
  app.use('/', router);
}