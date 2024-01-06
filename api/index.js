const Bot = require("../bot/index")();

module.exports = async (request, response) => {
  await Bot.handleUpdate(request.body);
  response.send("OK");
};
