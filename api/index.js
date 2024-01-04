const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) =>
  ctx.reply("Могу рассказать Вам о погоде и актуальном курсе валют на сегодня")
);

bot.command("currency", async (ctx) => {
  await getCurrency(ctx);
});

bot.on(message("text"), async (ctx) => {
  // console.log(ctx);
  ctx.reply(
    'Чтобы узнать погоду, напишите: "Погода город". Если в ответе, указанная страна не совпадает с Вашей, введите название города на английском'
  );
});

// bot.launch();
module.exports = async (request, response) => {
  await bot.handleUpdate(request.body);
  response.send("OK");
};
