const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const config = require("../../config.json");

module.exports = {
  name: "help",
  aliases: ['commands'],
  category: "Info",
  description: "Returns all commands or information about a specific command.",
  usage: "[Command]",
  run: async (bot, message, args) => {
    if (args[0]) {
      return getCMD(bot, message, args[0]);
    } else {
      return getAll(bot, message);
    }
  }
}

function getAll(bot, message) {

  const embed = new Discord.MessageEmbed()
    .setTitle("Command List")
    .setColor(config.color)
    .setTimestamp()
    .setFooter(`Requested by ${message.author.username}`, `${message.author.avatarURL({ dynamic: true })}`)

  const commands = (category) => {
    return bot.commands
      .filter(cmd => cmd.category === category)
      .map(cmd => `❯ \`${cmd.name}\` - ${cmd.description}`)
      .join("\n");
  }

  const info = bot.categories
    .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
    .reduce((string, category) => string + "\n" + category);

  return message.channel.send(embed.setDescription(info));
}

function getCMD(bot, message, input) {
  const embed = new Discord.MessageEmbed()

  const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

  let info = `No information found for command \`${input.toLowerCase()}\``;

  if (!cmd) {
    return message.channel.send(embed.setColor("RED").setDescription(info));
  }

  if (cmd.name) info = `**Command name**: ${cmd.name}`;
  if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
  if (cmd.description) info += `\n**Description**: ${cmd.description}`;
  if (cmd.category) info += `\n**Category**: ${cmd.category}`;
  if (cmd.example) info += `\n**Example**: ${cmd.example}`;
  if (cmd.usage) {
    info += `\n**Usage**: ${cmd.usage}`;
    embed.setFooter(`Syntax: <> = required, [] = optional`);
  }

  return message.channel.send(embed.setColor(config.color).setDescription(info));
}