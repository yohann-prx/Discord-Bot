const { Events } = require("discord.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const specialDomainHandlers = require("../utils/linkHandlers");
const {
  categories,
  sanitizeUrl,
  checkRateLimit,
} = require("../utils/urlUtils");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.content.startsWith("!share")) return;

    // Check rate limit
    if (!checkRateLimit(message.author.id)) {
      return message.reply("Please wait 30 seconds between sharing links.");
    }

    const args = message.content.slice(6).trim().split(" ");
    const rawUrl = args[0];

    if (!rawUrl) {
      return message.reply(
        "Please provide a URL to share. Usage: !share <url>",
      );
    }

    try {
      // Validate and sanitize URL
      const url = sanitizeUrl(rawUrl);
      const urlObject = new URL(url);

      if (!urlObject.protocol.startsWith("http")) {
        return message.reply("Please provide a valid HTTP/HTTPS URL");
      }

      // Fetch webpage content
      const response = await fetch(url);
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
          urlObject.hostname,
      };

      // Check for special domain handlers
      const domain = urlObject.hostname.replace("www.", "");
      let specialEmbed = null;

      if (specialDomainHandlers[domain]) {
        specialEmbed = await specialDomainHandlers[domain](urlObject);
      }

      // Create rich embed
      const linkEmbed = {
        color: specialEmbed?.color || 0x0099ff,
        title: specialEmbed?.title || metadata.title,
        url: url,
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL(),
        },
        description: metadata.description,
        thumbnail: metadata.image ? { url: metadata.image } : null,
        fields: [
          {
            name: "Category",
            value: categories[domain] || "🔗 Link",
            inline: true,
          },
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
        footer: {
          text: "🔗 Shared via LinkShare",
        },
      };

      // Send the embed
      await message.channel.send({ embeds: [linkEmbed] });

      // Delete the original command message
      try {
        await message.delete();
      } catch (error) {
        console.error("Could not delete original message:", error);
      }
    } catch (error) {
      console.error("Error processing link:", error);
      message.reply(
        "Failed to process the link. Please make sure it's a valid URL and try again.",
      );
    }
  },
};
