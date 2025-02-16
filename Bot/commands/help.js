module.exports = {
  name: "help",
  description: "Shows the help message with available commands",
  execute(message) {
    const helpEmbed = {
      color: 0x0099ff,
      title: "Moderation Commands",
      description: "Here are the available moderation commands:",
      fields: [
        {
          name: "!kick @user [reason]",
          value: "Kicks the mentioned user from the server",
        },
        {
          name: "!ban @user [reason]",
          value: "Bans the mentioned user from the server",
        },
        {
          name: "!unban userID [reason]",
          value: "Unbans a user using their ID",
        },
        {
          name: "!banlist",
          value: "Shows a list of all banned users in the server",
        },
        {
          name: "!clear [number]",
          value: "Clears the specified number of messages (1-100)",
        },
        {
          name: "!help",
          value: "Shows this help message",
        },
        {
          name: "!tictactoe-help",
          value: "Shows help message for Tic Tac Toe game",
        },
        {
          name: "!share <url>",
          value: "Shares a link with rich preview in the current channel",
        },
      ],
      footer: {
        text: "Moderator permissions required to use these commands",
      },
    };

    message.channel.send({ embeds: [helpEmbed] });
  },
};
