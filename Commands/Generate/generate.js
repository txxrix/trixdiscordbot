const config = require("../../config.json");
const fs = require("fs");
const timediff = require('timediff');
const Data = require("../../data.json");
const db = require('quick.db');

Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

let currentdate = new Date();
var datetime = currentdate.getDate() + "/"
  + (currentdate.getMonth() + 1) + "/"
  + currentdate.getFullYear() + " @ "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds();

module.exports = {
  name: "generate",
  aliases: ['gen'],
  category: "Generate",
  description: "Generates an account.",
  usage: "N/A",
  run: async (bot, message, args) => {
    if (!message.guild) return;
    if (!message.guild.members.cache.get(message.author.id).roles.cache.has(config.generate_role_id)) return message.channel.send("Sorry, but you cannot use that.");

    if (config.developer_mode === true) return message.channel.send("Developer mode is on, please wait until trix#6969 has resolved all issues.");
    if (!message.channel.id === config.generate_channel_id) return message.channel.send("Please only generate accounts in <#" + config.generate_channel_id + ">.");

    let target = args[0];

    if (!target) return message.channel.send("Please give me a target, you can choose out of: " + config.targets + '.')
    if (!fs.existsSync(`./accs/${target}.json`)) return message.channel.send("I couldn't find that target, make sure your target is correct.");

    if (!fs.existsSync('./accs/Fortnite.json')) return message.channel.send("I couldn't find the accounts file for Fortnite, please contact trix#6969.");
    if (!fs.existsSync('./accs/Minecraft.json')) return message.channel.send("I couldn't find the accounts file for Minecraft, please contact trix#6969.");
    if (!fs.existsSync('./accs/Netflix.json')) return message.channel.send("I couldn't find the accounts file for Netflix, please contact trix#6969.");
    if (!fs.existsSync('./accs/Spotify.json')) return message.channel.send("I couldn't find the accounts file for Spotify, please contact trix#6969.");
    if (!fs.existsSync('./accs/Yahoo.json')) return message.channel.send("I couldn't find the accounts file for Yahoo, please contact trix#6969.");

    if (Data.cooldowns[message.author.id + target] && new Date(Data.cooldowns[message.author.id + target].date) > new Date()) {
      let diff = timediff(new Date(), new Date(Data.cooldowns[message.author.id + target].date));
      return message.channel.send(`You currently have a cooldown for ${target}, please wait ${diff.minutes} more minute(s) until you can generate again.`);
    }

    let obj = JSON.parse(fs.readFileSync(`./accs/${target}.json`).toString());

    if (config.acc_amount > obj.accs.length) return message.channel.send(`The accounts for ${target} are currently out of stock, please try again later.`);
    let accstext = obj.accs.slice(obj.accs.length - 1);

    message.author.send(`Hello, here's your account: ` + accstext);
    message.channel.send("Successfully sent you the account in DMs!");

    let cdTime = db.get('cooldown');
    if (!cdTime) cdTime = 200000;

    let date = new Date(new Date().setMilliseconds(new Date().getMilliseconds() + cdTime));
    Data.cooldowns[message.author.id + target] = { "date": date };
    fs.writeFileSync("./data.json", JSON.stringify(Data));

    console.log(`[${datetime}] ${message.author.username}#${message.author.discriminator} / ${message.author.id} - [${target}] Account: ${accstext}`);
  }
}