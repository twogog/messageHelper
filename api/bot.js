const Bot = require("../bot/index")();

module.exports = async (request, response) => {
  try {
    await Bot.handleUpdate(request.body);
  } catch (error) {
    Bot.reply("Something went wrong, try again");
    console.log(error);
  } finally {
    response.send("OK");
  }
};
