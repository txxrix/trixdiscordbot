const config = require("../../config.json");
const { get } = require("got").default;
const fs = require("fs");

const currentdate = new Date();
const datetime = currentdate.getDate() + "/"
  + (currentdate.getMonth() + 1) + "/"
  + currentdate.getFullYear() + " @ "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds();

module.exports = {
  name: "add",
  aliases: ['refill', 'restsock'],
  category: "Owner",
  description: "Refills the bot with accounts.",
  usage: "<Target> <File Attachment with: Accounts.",
  run: async (bot, message, args) => {
    if (message.channel.type !== "dm") return;
    if (message.author.id !== config.owner_id_1 && message.author.id !== config.owner_id_2) return;

    let target = args[0];
    if (!target) return message.channel.send(`Please give me a target to refill. Command usage : \`${config.prefix}refill <target> <File Attachment>.\``);

    if (!fs.existsSync(`./accs/${target}.json`)) return user.send("Can't find that target, make sure the target is correct.");

    let link = message.attachments.first();
    if (!link) return message.channel.send(`Please give me a attachment to refill. Command usage : \`${config.prefix}refill <File_Attachment>.\``);

    let ext = link.url;
    let extfull = ext.split(".");

    let attEx = extfull[extfull.length - 1];
    if (attEx != "txt") {
      let getting = await get(link, { "responsetarget": "text" });
      message.channel.send("Abort, possible malicious content. V1");
      fs.appendFile('Malicious_Content.txt', `\n${datetime}\n${message.author.tag} | ${message.author.id}\n"${getting.body}"`, function (err) {
        if (err) return console.log(err);
      })
      return console.log(`A user possibly tried to restock malicious content. User: ${message.author.tag} | ${message.author.id} | File Extention: ${attEx} | Content: MaliciousContent.txt`);
    }

    let text = (await get(link, { "responsetarget": "text" })).body;
    var accs = text.replace("\r", "").split("\n");
    let obj = JSON.parse(fs.readFileSync(`./accs/${target}.json`).toString());

    if (!text.includes(":") && !text.includes("@") || !text.includes(".")) {
      console.log(`A user possibly tried to restock malicious content. User: ${message.author.tag} | ${message.author.id} | Content: ${text}`)
      return message.channel.send("Abort, malicious content. V2");
    }

    accs.forEach(t => { obj.accs.push(t) });
    fs.writeFileSync(`./accs/${target}.json`, JSON.stringify(obj));
    message.channel.send(`Successfully refilled ${accs.length} accounts!`);
    return console.log(`${message.author.username}#${message.author.discriminator} - \`${message.author.id}\` stocked accs at ${currentdate}`);

  }
}