/* eslint-disable no-undef */
const {google} = require('googleapis');
const crypto = require('crypto');

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URL = process.env.REDIRECT_URL;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner'
];

const generateAuthToken = async (uploadFrom, searchTerms) => {
    const state = encodeURIComponent(JSON.stringify({
        uploadFrom: uploadFrom,
        searchTerms: searchTerms
    }));
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
        state: state,
      });
    console.log(authorizationUrl);
    return authorizationUrl;
};

module.exports = generateAuthToken;