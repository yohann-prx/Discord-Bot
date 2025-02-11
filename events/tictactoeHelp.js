const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.content !== "!tictactoe-help") return;

    const helpEmbed = {
      color: 0x0099ff,
      title: "❓ Tic Tac Toe Help",
      description: "How to play Tic Tac Toe:",
      fields: [
        {
          name: "Start a game",
          value: "Type `!tictactoe` to start a new game",
        },
        {
          name: "Making moves",
          value:
            "Use numbers 1-9 to place your X:\n" + "1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣",
        },
        {
          name: "Rules",
          value:
            "- You play as X, bot plays as O\n" +
            "- Get three in a row to win\n" +
            "- Can be horizontal, vertical, or diagonal",
        },
      ],
      footer: {
        text: "Have fun playing!",
      },
    };

    message.channel.send({ embeds: [helpEmbed] });
  },
};
