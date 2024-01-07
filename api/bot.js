const Bot = require("../bot/index")();
const { Telegraf } = require("telegraf");

module.exports = async (request, response) => {
  try {
    await Bot.handleUpdate(request.body);
  } catch (error) {
    Telegraf.reply("На боте установлено ограничение в 200 запросов в день");
    console.log(error);
  } finally {
    response.send("OK");
  }
};
