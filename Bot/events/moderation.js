const { Events, PermissionsBitField } = require("discord.js");

// Event to handle the message creation
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore bot messages and messages that don't start with the prefix
    if (message.author.bot || !message.content.startsWith("!")) return;

    // Check if user has admin or moderator permissions
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
    ) {
      return message.reply(
        "You do not have permission to use moderation commands.",
      );
    }

    const args = message.content.slice(1).split(" ");
    const command = args.shift().toLowerCase();

    // Handle moderation commands
    switch (command) {
      case "kick":
        await handleKick(message, args);
        break;
      case "ban":
        await handleBan(message, args);
        break;
      case "unban":
        await handleUnban(message, args);
        break;
      case "banlist":
        await handleBanList(message);
        break;
      case "clear":
        await handleClear(message, args);
        break;
      case "help":
        await showHelp(message);
        break;
    }
  },
};

// Function to handle the kick command
async function handleKick(message, args) {
  if (!args[0]) return message.reply("Please mention a user to kick");

  const target = message.mentions.members.first();
  if (!target) return message.reply("Could not find that user");

  const reason = args.slice(1).join(" ") || "No reason provided";

  try {
    await target.kick(reason);
    message.channel.send(
      `Successfully kicked ${target.user.tag} for: ${reason}`,
    );
  } catch (error) {
    console.error("Error kicking user:", error);
    message.reply(
      "Failed to kick the user. Make sure I have the right permissions and the user is kickable.",
    );
  }
}

// Function to handle the ban command
async function handleBan(message, args) {
  if (!args[0]) return message.reply("Please mention a user to ban");

  const target = message.mentions.members.first();
  if (!target) return message.reply("Could not find that user");

  const reason = args.slice(1).join(" ") || "No reason provided";

  try {
    await target.ban({ reason: reason });
    message.channel.send(
      `Successfully banned ${target.user.tag} for: ${reason}`,
    );
  } catch (error) {
    console.error("Error banning user:", error);
    message.reply(
      "Failed to ban the user. Make sure I have the right permissions and the user is bannable.",
    );
  }
}

// Function to handle the unban command
async function handleUnban(message, args) {
  if (!args[0]) {
    return message.reply("Please provide a user ID to unban");
  }

  const userId = args[0];
  const reason = args.slice(1).join(" ") || "No reason provided";

  try {
    // First, fetch the ban entry to make sure the user is actually banned
    const banInfo = await message.guild.bans.fetch(userId);
    if (!banInfo) {
      return message.reply("This user is not banned");
    }

    // Unban the user
    await message.guild.members.unban(userId, reason);
    message.channel.send(
      `Successfully unbanned ${banInfo.user.tag} (ID: ${userId})\nReason: ${reason}`,
    );

    // Try to send a DM to the unbanned user
    try {
      const unbannedUser = await client.users.fetch(userId);
      await unbannedUser.send(
        `You have been unbanned from ${message.guild.name}\nReason: ${reason}`,
      );
    } catch (dmError) {
      console.log("Could not DM the unbanned user");
    }
  } catch (error) {
    if (error.code === 10026) {
      // Unknown Ban error code
      return message.reply("This user is not banned from this server.");
    }
    console.error("Error unbanning user:", error);
    message.reply(
      "Failed to unban the user. Make sure the ID is correct and I have the right permissions.",
    );
  }
}

// Function to handle the banlist command
async function handleBanList(message) {
  try {
    const bans = await message.guild.bans.fetch();
    if (bans.size === 0) {
      return message.reply("There are no banned users in this server.");
    }

    const banListEmbed = {
      color: 0xff0000,
      title: "Banned Users List",
      description: "Here are all currently banned users:",
      fields: bans.map((ban) => ({
        name: `${ban.user.tag} (ID: ${ban.user.id})`,
        value: `Reason: ${ban.reason || "No reason provided"}`,
      })),
      footer: {
        text: `Total bans: ${bans.size}`,
      },
    };

    message.channel.send({ embeds: [banListEmbed] });
  } catch (error) {
    console.error("Error fetching ban list:", error);
    message.reply(
      "Failed to fetch the ban list. Make sure I have the right permissions.",
    );
  }
}

// Function to handle the clear command
async function handleClear(message, args) {
  const amount = parseInt(args[0]);

  if (isNaN(amount)) {
    return message.reply("Please provide a valid number of messages to clear");
  }

  if (amount < 1 || amount > 100) {
    return message.reply("Please provide a number between 1 and 100");
  }

  try {
    const deleted = await message.channel.bulkDelete(amount, true);
    message.channel
      .send(`Successfully deleted ${deleted.size} messages`)
      .then((msg) => {
        setTimeout(() => msg.delete(), 3000); // Delete confirmation after 3 seconds
      });
  } catch (error) {
    console.error("Error clearing messages:", error);
    message.reply(
      "Failed to clear messages. Messages older than 14 days cannot be bulk deleted.",
    );
  }
}

// Function to show the help message
function showHelp(message) {
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
}
