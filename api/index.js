const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios");
const OpenAI = require("openai");
const fs = require("fs");
const crypto = require("crypto");

const openai = new OpenAI({
  apiKey: process.env.AI,
});

async function main(voice) {
  const fileName = crypto.randomUUID();
  const filePath = `/tmp/${fileName}.ogg`;
  fs.writeFileSync(filePath, voice);
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
    response_format: "text",
  });
  return transcription;
}

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => ctx.reply("Я создан для обработки аудио сообщений"));

bot.on(message("text"), async (ctx) => {
  ctx.reply("Скопируйте в чат аудио, чтобы получить его в текстовом формате");
});

bot.on(message("voice"), async (ctx) => {
  await ctx.telegram
    .getFileLink(ctx.message.voice.file_id)
    .then(async (url) => {
      await axios
        .get(url, { responseType: "arraybuffer" })
        .then(async (voice) => {
          ctx.reply(await main(voice.data));
        });
    });
});

bot.on(message("audio"), async (ctx) => {
  ctx.telegram.getFileLink(ctx.message.audio.file_id).then((url) => {
    axios.get(url, { responseType: "arraybuffer" }).then((voice) => {
      return voice;
    });
  });
});

// bot.launch();
module.exports = async (request, response) => {
  await bot.handleUpdate(request.body);
  response.send("OK");
};
