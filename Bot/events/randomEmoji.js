const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    // Ignore bot messages
    if (message.author.bot) return false;

    // Check if message contains an exclamation mark
    if (!message.content.includes("sigma")) return;

    // Array of fun emojis
    const emojis = ["🗿", "🧏‍♂️", "💪", "🤴"];

    // Select random emoji
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // React to the message with the random emoji
    message
      .react(randomEmoji)
      .catch((error) => console.error("Failed to react with emoji:", error));

    // Also send the emoji as a reply with a fun message
    message
      .reply(`I am the Sigma ${randomEmoji}`)
      .catch((error) => console.error("Failed to send message:", error));
  },
};
