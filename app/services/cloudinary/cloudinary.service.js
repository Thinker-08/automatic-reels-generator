/* eslint-disable no-undef */
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

const cloudinaryService = {};

cloudinaryService.uploadVideo = async (videoPath) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    const result = await cloudinary.uploader.upload(videoPath, {
        folder: '',
        resource_type: 'video'});
    return result.url;
};

module.exports = cloudinaryService;