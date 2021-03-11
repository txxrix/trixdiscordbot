const config = require("../../config.json");
const Discord = require('discord.js');
const fs = require('fs');

const currentdate = new Date();
const datetime = currentdate.getDate() + "/"
  + (currentdate.getMonth() + 1) + "/"
  + currentdate.getFullYear() + " @ "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds();

module.exports = {
  name: "stock",
  aliases: ['accounts'],
  category: "Info",
  description: "Returns the current stock.",
  usage: "N/A",
  run: async (bot, message, args) => {
    if (!message.guild) return;

    let embed = new Discord.MessageEmbed()
      .setTitle("Generator Stock")
      .setDescription("Accounts currently in stock:")
      .addField('Fortnite Accounts:', JSON.parse(fs.readFileSync(`./accs/Fortnite.json`).toString()).accs.length / config.acc_amount, true)
      .addField('Minecraft Accounts:', JSON.parse(fs.readFileSync(`./accs/Minecraft.json`).toString()).accs.length / config.acc_amount, true)
      .addField('Netflix Accounts:', JSON.parse(fs.readFileSync(`./accs/Netflix.json`).toString()).accs.length / config.acc_amount, true)
      .addField('Spotify Accounts:', JSON.parse(fs.readFileSync(`./accs/Spotify.json`).toString()).accs.length / config.acc_amount, true)
      .addField('Yahoo Accounts:', JSON.parse(fs.readFileSync(`./accs/Yahoo.json`).toString()).accs.length / config.acc_amount, true)
      .setFooter("Made by trix#6969")
      .setColor("RANDOM");

    message.channel.send(embed);

    return console.log(`${message.author.username}#${message.author.discriminator} - ${message.author.id} used the command ${config.prefix}stock at ${datetime}`)
  }
}