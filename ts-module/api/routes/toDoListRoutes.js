'use strict';
module.exports = function(app) {
    var test = require('../controllers/toDoListControllers');

    //test Routes
    app.route('/test')
        .get(test.test);

}