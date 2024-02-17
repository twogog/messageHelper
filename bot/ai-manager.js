import OpenAI from 'openai';

export default class AiManager {
  constructor() {
    this.OpenAi = new OpenAI({
      apiKey: process.env.AI,
    });
  }

  async getTranscription(audio) {
    const transcription = await this.OpenAi.audio.transcriptions.create({
      file: new ReadableStream(audio),
      model: 'whisper-1',
      response_format: 'text',
    });
    return transcription;
  }

  async getChatTalk(message) {
    const completion = await this.OpenAi.chat.completions.create({
      messages: [{role: 'system', content: message}],
      model: 'gpt-3.5-turbo',
      response_format: {type: 'text'},
    });

    return completion.choices[0].message.content;
  }
}
