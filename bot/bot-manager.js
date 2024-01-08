const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios/dist/node/axios.cjs");
const AiManager = require("./ai-manager");
import { kv } from "@vercel/kv";

module.exports = class Bot extends Telegraf {
  constructor(token) {
    super(token);
    this.AiManager = new AiManager();
    this.timeOutMsg = (timeout) => `Нужно подождать еще ${timeout} секунд`;
  }

  onWelcome() {
    this.start((ctx) => ctx.reply("Привет!"));
  }

  onText() {
    this.on(message("text"), async (ctx) => {
      const timeout = await this.__checkTimeOut();
      timeout && ctx.reply(this.timeOutMsg(timeout));
      !timeout && ctx.reply(await this.AiManager.getChatTalk(ctx.message.text));
    });
  }

  onAudio() {
    this.on([message("audio"), message("voice")], async (ctx) => {
      const timeout = await this.__checkTimeOut();
      timeout && ctx.reply(this.timeOutMsg(timeout));

      !timeout &&
        (await ctx.telegram
          .getFileLink(
            ctx.message?.voice?.file_id || ctx.message?.audio?.file_id
          )
          .then(async (url) => {
            await axios
              .get(url, { responseType: "arraybuffer" })
              .then(async (audio) => {
                ctx.reply(await this.AiManager.getTranscription(audio.data));
              });
          }));
    });
  }

  onInfo() {
    this.command("info", (ctx) => {
      ctx.reply(
        [
          "- Скопируйте в чат аудио файл, чтобы получить его текстовую расшифровку",
          "",
          "- Введите сообщение, чтобы что-то узнать у чата",
        ].join("\n")
      );
    });
  }

  async __checkTimeOut() {
    const data = await kv.get("timeout_timer");
    if (!data) {
      await kv.set("timeout_timer", "nevermind", { ex: 25 });
      return false;
    }
    const time = await kv.ttl("timeout_timer");
    return time;
  }

  startLaunch() {
    this.launch();
  }
};
