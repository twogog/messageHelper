import $Bot from '../bot/index.js';

export default async function (request, response) {
  try {
    const Bot = $Bot();
    await Bot.handleUpdate(request.body);
  } catch (error) {
    Bot.reply('🙈');
    console.log(error);
  } finally {
    response.send('OK');
  }
}

export const config = {
  runtime: 'edge',
};
