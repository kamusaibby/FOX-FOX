const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
	config: {
  name: "song",
  aliases: ["xing", "song"],
  version: "0.0.1",
  author: "ArYAN",
  countDown: 5,
  role: 0,
  shortDescription: "sing tomake chai",
  longDescription: "sing janne kyun tanveer evan ",
  category: "MUSIC",
  guide: "/music dj lappa lappa"
	},

  onStart: async function ({ api, event, args }) {
    let songName, type;

    if (
      args.length > 1 &&
      (args[args.length - 1] === "audio" || args[args.length - 1] === "audio")
    ) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "audio";
    }

    const processingMessage = await api.sendMessage(
      "🎵 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...!!",
      event.threadID,
      null,
      event.messageID
    );

    try {
      // Search for the song on YouTube
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("No results found for your search query.");
      }

      // Get the top result from the search
      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;

      // Construct API URL for downloading the top result
      const apiKey = "itzaryan";
      const apiUrl = `https://aryan-ai-xyz.vercel.app/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      // Get the direct download URL from the API
      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch song. Status code: ${response.status}`
        );
      }

      // Set the filename based on the song title and type
      const filename = `${topResult.title}.${type === "audio" ? "mp3" : "mp3"}`;
      const downloadPath = path.join(__dirname, filename);

      const songBuffer = await response.buffer();

      // Save the song file locally
      fs.writeFileSync(downloadPath, songBuffer);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🎵𝐌𝐮𝐬𝐢𝐜\n━━━━━━━━━━━━━━━\n\n${topResult.title}`,
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(`Failed to download and send song: ${error.message}`);
      api.sendMessage(
        `Failed to download song: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
