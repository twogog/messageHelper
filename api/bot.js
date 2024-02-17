const Bot = require('../bot/index')();

module.exports = async (request, response) => {
  try {
    await Bot.handleUpdate(request.body);
  } catch (error) {
    Bot.reply('🙈');
    console.log(error);
  } finally {
    response.send('OK');
  }
};
