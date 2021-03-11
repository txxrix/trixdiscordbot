const config = require('../../config.json');
const ms = require('ms');
const db = require('quick.db');

module.exports = {
  name: "cooldown",
  aliases: ['changecooldown'],
  category: "Owner",
  description: "Changes the cooldown time.",
  usage: "<Time (Example: 24h, 1m)>",
  run: async (bot, message, args) => {
    if (message.channel.type !== "dm") return;
    if (message.author.id !== config.owner_id_1 && message.author.id !== config.owner_id_2) return;

    let time = args[0];
    let check = db.get('cooldown');

    if (!time) return message.channel.send("Please give me a correct time, examples: `1d (1 day), 1h (1 hour), 1m (1 minute), 1s (1 second)`.");

    let cdTime = ms(time);

    if (check) {
      db.set('cooldown', cdTime);

      let oldTime = ms(check, { long: true });
      let newTime = ms(cdTime, { long: true })

      return message.channel.send(`Successfully changed the cooldown time from ${oldTime} to ${newTime}.`);
    }
    else {
      db.set('cooldown', cdTime);
      let newTime = ms(cdTime, { long: true })

      return message.channel.send(`Successfully set the cooldown time to ${newTime}.`);
    }
  }
}