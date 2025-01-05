/* eslint-disable no-undef */
const apiV1Prefix = '/api/v1';

module.exports = function (app) {
    app.use(`${apiV1Prefix}/reels`, require('./controllers/reels'));
    app.use(`${apiV1Prefix}/auth`, require('./controllers/auth'));
}