const { Events } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.content.startsWith("!veille")) return;

    const args = message.content.slice(7).trim().split(" ");
    const subCommand = args[0]?.toLowerCase();

    switch (subCommand) {
      case "list":
        await handleList(message);
        break;
      case "random":
        await handleRandom(message);
        break;
      case "top":
        await handleTop(message);
        break;
      default:
        await showHelp(message);
    }
  },
};

async function handleList(message) {
  try {
    const response = await fetch("http://localhost:3000/veille/all");
    const links = await response.json();

    const groupedLinks = links.reduce((acc, link) => {
      if (!acc[link.titres]) acc[link.titres] = [];
      acc[link.titres].push(link);
      return acc;
    }, {});

    const embed = {
      color: 0x0099ff,
      title: "📚 Veille Links",
      fields: Object.entries(groupedLinks).map(([title, links]) => ({
        name: `${title} (${links.length})`,
        value: links
          .map((link) => `• [${link.description}](${link.url})`)
          .join("\n"),
      })),
    };

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching links:", error);
    message.reply("Failed to fetch links. Please try again later.");
  }
}

async function handleRandom(message) {
  try {
    const response = await fetch("http://localhost:3000/veille/random");
    const link = await response.json();

    const embed = {
      color: 0x0099ff,
      title: "🎲 Random Veille Link",
      description: link.description,
      url: link.url,
    };

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching random link:", error);
    message.reply("Failed to fetch a random link. Please try again later.");
  }
}

async function handleTop(message) {
  try {
    const response = await fetch("http://localhost:3000/veille/top");
    const users = await response.json();

    const embed = {
      color: 0x0099ff,
      title: "🏆 Top Contributors",
      description: users
        .map(
          (user, index) =>
            `${index + 1}. ${user.username} - ${user.points} points`,
        )
        .join("\n"),
    };

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching top users:", error);
    message.reply("Failed to fetch top contributors. Please try again later.");
  }
}

async function showHelp(message) {
  const embed = {
    color: 0x0099ff,
    title: "📚 Veille Commands Help",
    fields: [
      {
        name: "!veille list",
        value: "Shows all saved links grouped by category",
      },
      {
        name: "!veille random",
        value: "Shows a random saved link",
      },
      {
        name: "!veille top",
        value: "Shows top contributors",
      },
    ],
  };

  message.channel.send({ embeds: [embed] });
}
