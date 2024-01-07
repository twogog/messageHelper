const Bot = require("../bot/index")();
const { Telegraf } = require("telegraf");

module.exports = async (request, response) => {
  try {
    await Bot.handleUpdate(request.body);
  } catch (error) {
    // Telegraf.reply("Something went wrong, try again");
    console.log(error);
  } finally {
    response.send("OK");
  }
};
