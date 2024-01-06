const Bot = require("./bot-manager");

module.exports = () => {
  const $Bot = new Bot(process.env.TOKEN);
  // $Bot.onWelcome();
  $Bot.onInfo();
  $Bot.onText();
  $Bot.onAudio();
  // $Bot.startLaunch(); // for local tests
  return $Bot;
};
