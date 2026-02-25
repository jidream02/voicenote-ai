import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const PROMPTS = {
  ROADMAP: `Ты AI-ментор. Пользователь поделился своими мыслями голосом. Создай структурированный роадмап.
Верни ТОЛЬКО валидный JSON без markdown: { "title": "...", "summary": "...", "phases": [{ "name": "...", "duration": "...", "steps": ["..."] }], "keyInsights": ["..."] }`,

  PROBLEM_SOLVER: `Ты эксперт по решению проблем. Проанализируй проблему пользователя.
Верни ТОЛЬКО валидный JSON без markdown: { "problem": "...", "rootCauses": ["..."], "solutions": [{ "title": "...", "description": "..." }], "recommendation": "...", "nextStep": "..." }`,

  MENTOR: `Ты мудрый ментор. Выслушай и дай совет.
Верни ТОЛЬКО валидный JSON без markdown: { "summary": "...", "strengths": ["..."], "challenges": ["..."], "advice": ["..."], "questions": ["..."], "encouragement": "..." }`,

  MEETING_NOTES: `Структурируй запись встречи.
Верни ТОЛЬКО валидный JSON без markdown: { "title": "...", "decisions": ["..."], "actionItems": [{ "task": "...", "owner": "...", "deadline": "..." }] }`,

  REFLECTION: `Помоги с рефлексией. Проанализируй мысли.
Верни ТОЛЬКО валидный JSON без markdown: { "mood": "...", "mainThemes": ["..."], "insights": ["..."], "patterns": ["..."], "tomorrowFocus": "..." }`
}

export const analyzeTranscript = async (transcript, mode) => {
  const systemPrompt = PROMPTS[mode] || PROMPTS.REFLECTION

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: transcript }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })

  try {
    const text = response.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { raw: response.choices[0].message.content }
  }
}

export const chatWithNote = async (messages, noteContext) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `Ты AI-ассистент. Контекст заметки пользователя:
Транскрипт: ${noteContext.transcript}
AI анализ: ${JSON.stringify(noteContext.aiResult)}
Отвечай на вопросы по этой заметке на русском языке.`
      },
      ...messages
    ],
    temperature: 0.8,
    max_tokens: 1000
  })

  return response.choices[0].message.content
}
