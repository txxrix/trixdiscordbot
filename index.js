const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const bot = new Discord.Client();

bot.categories = fs.readdirSync('./commands/');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

['command', 'events'].forEach(handler => {
  require(`./handlers/${handler}`)(bot);
});

bot.login(config.token)