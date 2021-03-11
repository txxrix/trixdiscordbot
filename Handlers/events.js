const fs = require("fs");

module.exports = (bot) => {
  fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
      if (!file.endsWith('.js')) return;
      const evt = require(`../events/${file}`);
      let evtName = file.split('.')[0];
      bot.on(evtName, evt.bind(null, bot));
    });
  });
}