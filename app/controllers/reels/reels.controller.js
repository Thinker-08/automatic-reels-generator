/* eslint-disable no-undef */
const _ = require('lodash');
const moment = require('moment');

const { successResponse, errorResponse } = require('../../common/responseWrapper');
const youtubeService = require('../../services/youtube/youtube.service');
const cloudinaryService = require('../../services/cloudinary/cloudinary.service');
const reelsService = require('../../services/reels/reels.service');
const aniListService = require('../../services/anime/anilst.service');

const reelsController = {};

reelsController.generateReels = async (req, res) => {
    const currentTime = moment();
    const {characters: charactersList, title} = await aniListService.getAnimeCharacters(21);
    const shuffled = charactersList.sort(() => 0.5 - Math.random());
    const randomlySelectedAnimeCharacters = shuffled.slice(0, 1);
    let searchTerms = title.replace(/\s/g, '+') + '+';
    _.map(randomlySelectedAnimeCharacters, (character, index) => {
        const formattedCharacter = character.replace(/\s/g, '+');
        if (index === randomlySelectedAnimeCharacters.length - 1) {
            searchTerms += formattedCharacter;
        } else {
            searchTerms += formattedCharacter + '+';
        }
    });
    console.log(searchTerms);
    const uploadFrom = _.get(req, 'query.uploadFrom', currentTime.subtract(
        1, 'month').format('YYYY-MM-DDTHH:mm:ss[Z]'));
    try {
        if (!searchTerms) {
            return errorResponse(res, 400, 'Search terms are missing');
        }
        
        const youtubeVideos = await youtubeService.getYoutubeVideos({
            searchTerms, uploadFrom
        });
        console.log('Here is the downloaded video path', youtubeVideos);
        console.log('Started Uploading Video to get a public URL');
        const cloudinaryCloudURL = await cloudinaryService.uploadVideo(youtubeVideos);
        console.log('Here is the cloudinary cloud url', cloudinaryCloudURL);
        console.log('Started Uploading Video to Instagram');
        const reels = await reelsService.uploadReel(cloudinaryCloudURL);
        console.log('Here is the reels', reels);
        return successResponse(res, 200, reels);
    } catch (err) {
        console.log(err);
        return errorResponse(res, 500, 'Internal server error');
    }
};

module.exports = reelsController; 