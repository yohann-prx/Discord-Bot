const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot) return false;

    const quoi = ["Quoi", "Pourquoi"];

    const found = quoi.some((x) =>
      message.content.toLowerCase().includes(x.toLowerCase()),
    );
    if (!found) return;

    message.reply("Feur");
  },
};
