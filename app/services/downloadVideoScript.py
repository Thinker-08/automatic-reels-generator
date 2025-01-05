from flask import request, jsonify
from pytube import YouTube
import logging
import re
import subprocess
import os
import sys
import uuid

# Enable logging for debugging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def is_valid_youtube_url(url):
    pattern = r"^(https?://)?(www\.)?youtube\.com/watch\?v=[\w-]+(&\S*)?$"
    return re.match(pattern, url) is not None

def generate_random_filename(extension):
    return f"{uuid.uuid4().hex}.{extension}"

def download_video_yt_dlp_best(url):
    try:
        logger.debug("Using yt-dlp to download the best quality video with audio.")
        random_filename = generate_random_filename("mp4")
        output_path = os.path.join(os.getcwd(), random_filename)

        command = [
            "yt-dlp",
            "-f", "bestvideo+bestaudio/best",
            "--merge-output-format", "mp4",
            "-o", output_path,
            url,
        ]
        subprocess.run(command, check=True)

        if os.path.exists(output_path):
            return True, output_path, None
        else:
            return False, None, "File not found after download."
    except subprocess.CalledProcessError as e:
        logger.error(f"Error downloading best quality video with yt-dlp: {e}")
        return False, None, str(e)

def download_video_pytube_best(url):
    try:
        yt = YouTube(url)
        logger.info("Fetching all available streams...")
        streams = yt.streams.filter(progressive=True, file_extension='mp4')

        # Log all streams for debugging
        logger.info(f"Available streams: {[str(stream) for stream in streams]}")

        # Find the stream with the highest resolution
        best_stream = streams.order_by("resolution").desc().first()

        if best_stream:
            logger.info(f"Downloading best available video: {yt.title} at resolution {best_stream.resolution}")
            random_filename = generate_random_filename("mp4")
            output_path = os.path.join(os.getcwd(), random_filename)
            best_stream.download(output_path=os.getcwd(), filename=random_filename)
            return True, output_path, None
        else:
            return False, None, "No suitable video stream found."
    except Exception as e:
        logger.error(f"Error downloading best quality video with Pytube: {e}")
        return False, None, str(e)

def convert_video_with_ffmpeg(input_path):
    try:
        logger.info("Converting video with ffmpeg...")
        output_path = generate_random_filename("mp4")
        output_path_full = os.path.join(os.getcwd(), output_path)

        command = [
            "ffmpeg",
            "-i", input_path,
            "-c:v", "libx264",
            "-crf", "23",
            "-preset", "medium",
            "-c:a", "aac",
            "-b:a", "128k",
            "-vf", "scale=1080:-2",
            "-r", "30",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            output_path_full
        ]

        subprocess.run(command, check=True)

        if os.path.exists(output_path_full):
            os.remove(input_path)  # Delete the original video
            return output_path_full, None
        else:
            return None, "Converted video not found."
    except subprocess.CalledProcessError as e:
        logger.error(f"Error during video conversion: {e}")
        return None, str(e)

def download_best_quality(url):
    if not url:
        return "Missing 'url' parameter in the request body."

    if not is_valid_youtube_url(url):
        return "Invalid YouTube URL."

    success, path, error_message = download_video_pytube_best(url)

    if not success:
        logger.info("Attempting to download with yt-dlp for best quality...")
        success, path, error_message = download_video_yt_dlp_best(url)

    if success:
        converted_path, conversion_error = convert_video_with_ffmpeg(path)
        if converted_path:
            return converted_path
        else:
            return conversion_error
    else:
        return error_message

if __name__ == "__main__":
    url = sys.argv[1]
    result = download_best_quality(url)
    print(result)