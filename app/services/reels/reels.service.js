/* eslint-disable no-undef */
const axios = require('axios');

const igUserId = process.env.IG_USER_ID; // Instagram User ID
const igAccessToken = process.env.IG_ACCESS_TOKEN; // Instagram Access Token

const reelsService = {};

reelsService.uploadReel = async (videoUrl, caption = 'Hello World!') => {
  try {

    // create a container for the API URL
    console.log('Creating a container for the API URL');
    const apiUrl = `https://graph.instagram.com/v21.0/${igUserId}/media`;
    const params = {
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
      share_to_feed: false,
      access_token: igAccessToken,
    };

    const response = await axios.post(apiUrl, null, {
      params,
    });
    
    if (response.data && response.data.id) {
        console.log('Container created successfully. Container ID:', response.data.id);
  
        // Poll the container status until it is finished
        const containerId = response.data.id;
        console.log('Starting polling of container status');
        await reelsService.pollContainerStatus(containerId);
        console.log('Polling of container status completed');
        console.log('Publishing the reel');
        const publishMedia = await reelsService.publishReel(containerId);
        console.log('Reel published successfully:', publishMedia);
        return publishMedia;
      }
  } catch (error) {
    console.error('Error uploading reel:', error.response?.data || error.message);
    throw error;
  }
};

reelsService.getContainerStatus = async (containerId) => {
    try {
      const apiUrl = `https://graph.instagram.com/v21.0/${containerId}`;
      const params = {
        fields: 'status_code,status',
        access_token: igAccessToken,
      };
      const response = await axios.get(apiUrl, {
        params,
      });
  
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching container status:', error.response?.data || error.message);
      throw error;
    }
  };

  reelsService.pollContainerStatus = async (containerId) => {
    try {
      let attemptCount = 0;
      const maxAttempts = 6;
  
      while (attemptCount < maxAttempts) {
        console.log(`Polling container status (attempt ${attemptCount + 1} of ${maxAttempts})...`);
        const statusResponse = await reelsService.getContainerStatus(containerId);
        console.log('Current Status:', statusResponse.status);
  
        if (statusResponse.status_code === 'FINISHED' && statusResponse.status === 'FINISHED') {
          console.log('Reel processing finished:', statusResponse.status);
          return statusResponse;
        }
  
        // Increment the attempt counter
        attemptCount += 1;
  
        // Wait for 10 seconds before the next attempt
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
  
      console.log('Assuming reel processing is finished after 6 attempts.');
      return {
        status_code: 'FINISHED',
        status: 'FINISHED',
        id: containerId,
      };
    } catch (error) {
      console.error('Error polling container status:', error.message);
      throw error;
    }
  };
  

  reelsService.publishReel = async (containerId) => {
    try {
      const apiUrl = `https://graph.instagram.com/v21.0/${igUserId}/media_publish`;
      const params = {
        creation_id: containerId,
        access_token: igAccessToken,
      };

      const response = await axios.post(apiUrl, null, {
        params,
      });
  
      if (response.data) {
        console.log('Reel published successfully:', response.data);
        return response.data;
      }
    } catch (err) {
      console.error('Error publishing reel:', err.response?.data || err.message);
      throw err;
    }
  };
module.exports = reelsService;
