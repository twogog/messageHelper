const OpenAI = require("openai");
const fs = require("fs");
const crypto = require("crypto");

module.exports = class AiManager {
  constructor() {
    this.OpenAi = new OpenAI({
      apiKey: process.env.AI,
    });
  }

  async getTranscription(audio) {
    const filePath = this.__writeAudioAndGetPath(audio);
    const transcription = await this.OpenAi.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "text",
    });
    return transcription;
  }

  __writeAudioAndGetPath(audio) {
    const fileName = crypto.randomUUID();
    const filePath = `/tmp/${fileName}.mp3`;
    fs.writeFileSync(filePath, audio);
    return filePath;
  }
};
