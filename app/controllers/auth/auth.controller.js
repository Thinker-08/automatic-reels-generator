/* eslint-disable no-undef */
const _ = require('lodash');
const axios = require('axios');

const authController = {};

authController.googleAuth = async (req, res) => {
    try {
        const authCode = _.get(req, 'query.code');
        const state = _.get(req, 'query.state');
        const { uploadFrom, searchTerms } = JSON.parse(decodeURIComponent(state));
        return res.redirect(
            `http://localhost:3000/api/v1/reels/create?uploadFrom=${uploadFrom}&searchTerms=${searchTerms}&authCode=${authCode}`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = authController;