import Bot from './bot-manager.js';

export default function () {
  const $Bot = new Bot(process.env.TOKEN);
  $Bot.onWelcome();
  $Bot.onInfo();
  $Bot.onText();
  $Bot.onAudio();
  // $Bot.startLaunch(); // for local tests
  return $Bot;
}
