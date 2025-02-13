const { Events } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args)); // Fixed fetch import
const cheerio = require("cheerio");

// Event to handle the message creation
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.content.startsWith("!share")) return;

    const args = message.content.slice(6).trim().split(" ");
    const url = args[0];

    if (!url) {
      return message.reply(
        "Please provide a URL to share. Usage: !share <url>",
      );
    }

    try {
      // Basic URL validation
      if (!url.match(/^https?:\/\//i)) {
        return message.reply(
          "Please provide a valid URL starting with http:// or https://",
        );
      }

      // Fetch the webpage
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract metadata
      const metadata = {
        title:
          $("title").first().text() ||
          $('meta[property="og:title"]').attr("content") ||
          "No title available",
        description:
          $('meta[name="description"]').attr("content") ||
          $('meta[property="og:description"]').attr("content") ||
          "No description available",
        image:
          $('meta[property="og:image"]').attr("content") ||
          $('meta[property="twitter:image"]').attr("content"),
        siteName:
          $('meta[property="og:site_name"]').attr("content") ||
          new URL(url).hostname,
      };

      // Trim long descriptions
      if (metadata.description.length > 200) {
        metadata.description = metadata.description.substring(0, 197) + "...";
      }

      // Create embed
      const linkEmbed = {
        color: 0x0099ff,
        title: metadata.title.substring(0, 256), // Discord limit
        url: url,
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL(),
        },
        description: metadata.description,
        fields: [
          {
            name: "Source",
            value: metadata.siteName,
            inline: true,
          },
          {
            name: "Shared by",
            value: `<@${message.author.id}>`,
            inline: true,
          },
        ],
        timestamp: new Date(),
      };

      // Add thumbnail if image exists and URL is valid
      if (metadata.image && metadata.image.match(/^https?:\/\//i)) {
        linkEmbed.thumbnail = { url: metadata.image };
      }

      // Send the embed
      await message.channel.send({ embeds: [linkEmbed] });

      // Try to delete the original command message
      try {
        await message.delete();
      } catch (err) {
        console.log("Could not delete original message");
      }
    } catch (error) {
      console.error("Error details:", error);
      message.reply(
        "Failed to process the link. Please make sure it's a valid URL and try again.",
      );
    }
  },
};
