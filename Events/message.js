const config = require("../config.json");

module.exports = async (bot, message) => {
  if (message.author.bot) return;

  const prefix = config.prefix;

  if (!message.content.startsWith(prefix)) return;
  if (message.guild && !message.member) {
    message.member = await message.guild.fetchMember(message);
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = bot.commands.get(cmd);

  if (!command) command = bot.commands.get(bot.aliases.get(cmd));
  if (!command) return message.channel.send("Command not found, please run the help command for more information.");

  if (command) {
    command.run(bot, message, args);
  }
};