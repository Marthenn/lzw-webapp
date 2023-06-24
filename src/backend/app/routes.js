const express = require('express');
const controllers = require('./controllers');

module.exports = (app) => {
    const router = express.Router();

    router.get('/history', controllers.get_history);
    router.post('/encode', controllers.encode);
    router.post('/decode', controllers.decode);
    router.delete('/history', controllers.delete_history);

    app.use('/', router);
}
