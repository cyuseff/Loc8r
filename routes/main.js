var ctrl = require('../app_server/controllers/main');

module.exports = function(app){
  app.use('/', ctrl);
}