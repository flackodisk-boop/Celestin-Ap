const fs = require("fs");
const path = require("path");
const axios = require("axios");

const filePath = path.join(__dirname, "assets", "shoti.json");
const videoPath = path.join(__dirname, "tmp", "shoti.mp4");

// Helper function to get or initialize the shoti.json file
const getShotiData = () => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
};

exports.config = {
  name: "shoti",
  author: "Your_Name",
  description: "Fetch a random TikTok video",
  method: "post",
  category: "utility",
  link: ["/shoti"]
};

exports.initialize = async function ({ req, res }) {
  try {
    const data = getShotiData();

    if (data.length === 0) {
      return res.json({ message: "No URLs available", status: 404 });
    }

    const randomUrl = data[Math.floor(Math.random() * data.length)];
    const response = await axios.get(`https://tikwm.com/api/?url=${randomUrl}`);
    const videoData = response.data.data;

    const username = videoData.author.unique_id;
    const nickname = videoData.author.nickname;
    const videoUrl = videoData.play;
    const title = videoData.title || "No title available";

    console.log(`Fetched video for user: ${username} (${nickname}), Title: ${title}`);

    // Download the video
    const videoStream = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(videoPath);
    videoStream.data.pipe(writer);

    writer.on("finish", () => {
      res.json({
        message: "Video fetched successfully",
        details: {
          title,
          username,
          nickname,
          videoUrl,
        },
        videoPath, // Path to the saved video
        status: 200
      });
    });

    writer.on("error", (err) => {
      console.error("Error saving video:", err.message);
      res.json({ message: "Error downloading the video", status: 500 });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ message: "Error fetching video data", status: 500 });
  }
};
