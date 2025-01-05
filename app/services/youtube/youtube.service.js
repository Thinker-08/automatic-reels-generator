/* eslint-disable no-undef */
const axios = require('axios');
const spawn = require("child_process").spawn;
const path = require('path');

const API_KEY = process.env.API_KEY;
const YOUTUBE_SEARCH_URL = process.env.YOUTUBE_SEARCH_URL;

const youtubeService = {};

youtubeService.getYoutubeVideos = async ({
  searchTerms, uploadFrom }) => {
    const params = {
      order: 'viewCount',
      publishedAfter: uploadFrom,
      q: searchTerms,
      type: 'video',
      videoDuration: 'short',
      key: API_KEY,
      relevanceLanguage: 'en'
      // location: '23.5120,80.3290',
      // locationRadius: '1000km',
    };
    console.log('Started Looking for Videos')
    const youtubeVideoDetails = await axios.get(`${YOUTUBE_SEARCH_URL}`, {
      headers: {
        Accept: 'application/json',
      },
      params,
    });

    const latestVideo = youtubeVideoDetails.data.items[0];
    console.log(youtubeVideoDetails.data);
    const youtubeVideoUrl = `https://www.youtube.com/watch?v=${latestVideo.id.videoId}`;
    console.log('Found Video:', youtubeVideoUrl);

    // Adjust path to Python script to ensure proper execution
    const scriptPath = path.resolve('./app/services/downloadVideoScript.py');

    // Create a new Promise to handle the response
    console.log('Started Downloading Video');
    return new Promise((resolve, reject) => {
      const process = spawn('python', [scriptPath, youtubeVideoUrl]);

      let output = '';
      let error = '';

      // Capture stdout data
      process.stdout.on('data', function(data) {
        output += data.toString();
      });

      // Capture stderr data
      process.stderr.on('data', function(data) {
        error += data.toString();
      });

      // Capture process closure and resolve/reject promise
      process.on('close', function(code) {
        if (code === 0) {
          console.log('Finished Downloading Video');
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1]; // Get the last line
          resolve(lastLine);
        } else {
          // If there was an error, reject the promise with the error message
          reject(`Error downloading video: ${error.trim()}`);
        }
      });
    });
};

module.exports = youtubeService;
