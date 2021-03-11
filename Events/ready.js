module.exports = async (bot) => {
  console.log(`${bot.user.username}#${bot.user.discriminator} is now online!\n`);
  bot.user.setActivity(`Made by trix#6969`);
}