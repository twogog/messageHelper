import {Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import AiManager from './ai-manager.js';
import {kv} from '@vercel/kv';

export default class Bot extends Telegraf {
  constructor(token) {
    super(token);
    this.AiManager = new AiManager();
    this.serverlessLifespan = 10; // in seconds
  }

  onWelcome() {
    this.start((ctx) => ctx.reply('Привет!'));
  }

  onText() {
    this.on(message('text'), async (ctx) => {
      const timeout = await this.__checkTimeOut();
      timeout && ctx.reply(this.__timeOutMsg(timeout));
      // Because serverless has a limited lifespan
      !timeout &&
        ctx.reply(
          await this.AiManager.getChatTalk(
            this.__addConstrictionPhrase(ctx.message.text)
          )
        );
    });
  }

  onAudio() {
    this.on([message('audio'), message('voice')], async (ctx) => {
      const timeout = await this.__checkTimeOut();
      timeout && ctx.reply(this.__timeOutMsg(timeout));

      !timeout &&
        (await ctx.telegram
          .getFileLink(
            ctx.message?.voice?.file_id || ctx.message?.audio?.file_id
          )
          .then(async (url) => {
            await fetch(url).then(async (audio) => {
              ctx.reply(await this.AiManager.getTranscription(audio.data));
            });
          }));
    });
  }

  onInfo() {
    this.command('info', (ctx) => {
      ctx.reply(
        [
          '- Скопируйте в чат аудио файл, чтобы получить его текстовую расшифровку',
          '',
          '- Введите сообщение, чтобы что-то узнать у чата',
        ].join('\n')
      );
    });
  }

  async __checkTimeOut() {
    const data = await kv.get('timeout_timer');
    if (!data) {
      await kv.set('timeout_timer', 'nevermind', {ex: 25});
      return false;
    }
    const time = await kv.ttl('timeout_timer');
    return time;
  }

  startLaunch() {
    this.launch();
  }

  __addConstrictionPhrase(chatMsg) {
    const threshold = Math.abs(this.serverlessLifespan - 3);
    const phrase = `Answer within ${threshold} seconds. `;
    return threshold < 21 ? phrase + chatMsg : chatMsg;
  }

  __timeOutMsg(timeout) {
    return `Нужно подождать еще ${timeout} сек.`;
  }
}
