import Groq from 'groq-sdk'
import fs from 'fs'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const transcribeAudio = async (filePath) => {
  const audioStream = fs.createReadStream(filePath)
  const transcription = await groq.audio.transcriptions.create({
    file: audioStream,
    model: 'whisper-large-v3',
    language: 'ru'
  })
  return transcription.text
}
