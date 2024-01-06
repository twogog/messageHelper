const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios");
const AiManager = require("./ai-manager");

module.exports = class Bot extends Telegraf {
  constructor(token) {
    super(token);
    this.AiManager = new AiManager();
  }

  onWelcome() {
    this.start((ctx) => ctx.reply("Я создан для обработки аудио сообщений"));
  }

  onText() {
    this.on(message("text"), async (ctx) => {
      ctx.message.text !== "/help" &&
        ctx.reply(await this.AiManager.getChatTalk(ctx.message.text));
    });
  }

  onAudio() {
    this.on([message("audio"), message("voice")], async (ctx) => {
      await ctx.telegram
        .getFileLink(ctx.message?.voice?.file_id || ctx.message?.audio?.file_id)
        .then(async (url) => {
          await axios
            .get(url, { responseType: "arraybuffer" })
            .then(async (audio) => {
              ctx.reply(await this.AiManager.getTranscription(audio.data));
            });
        });
    });
  }

  onHelp() {
    this.command("help", (ctx) => {
      ctx.reply(
        [
          "- Скопируйте в чат аудио файл, чтобы получить его текстовую расшифровку",
          "",
          "- Введите сообщение, чтобы что-то узнать у чата",
        ].join("\n")
      );
    });
  }
  startLaunch() {
    this.launch();
  }
};