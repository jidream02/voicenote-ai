import fs from 'fs'
import prisma from '../utils/prismaClient.js'

export const uploadAndProcess = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file provided' })

    const { mode = 'REFLECTION', title } = req.body
    const filePath = req.file.path
    const audioUrl = `/uploads/audio/${req.file.filename}`

    let transcript = 'Транскрипт недоступен'
    let aiResult = getMockResult(mode)

    const hasGroqKey = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('ВАШ')

    if (hasGroqKey) {
      try {
        const { transcribeAudio } = await import('../services/whisperService.js')
        const { analyzeTranscript } = await import('../services/gptService.js')
        transcript = await transcribeAudio(filePath)
        aiResult = await analyzeTranscript(transcript, mode)
      } catch (aiErr) {
        console.error('AI error:', aiErr.message)
      }
    }

    const noteTitle = title || `Заметка ${new Date().toLocaleDateString('ru')}`

    const note = await prisma.note.create({
      data: {
        userId: req.user.id,
        title: noteTitle,
        audioUrl,
        transcript,
        mode,
        aiResult,
        duration: req.body.duration ? parseInt(req.body.duration) : null,
      },
      include: { tags: true }
    })

    res.status(201).json({ note })
  } catch (err) {
    if (req.file?.path) { try { fs.unlinkSync(req.file.path) } catch {} }
    next(err)
  }
}

function getMockResult(mode) {
  const mocks = {
    ROADMAP: {
      title: 'Роадмап',
      summary: 'AI анализ будет доступен после настройки Groq API ключа.',
      phases: [
        { name: 'Фаза 1 — Начало', duration: '1-2 нед.', steps: ['Определить цель', 'Собрать ресурсы'] },
        { name: 'Фаза 2 — Реализация', duration: '3-4 нед.', steps: ['Выполнить задачи', 'Проверить прогресс'] },
      ],
      keyInsights: ['Добавь Groq API ключ для реального анализа']
    },
    PROBLEM_SOLVER: {
      problem: 'Описание проблемы',
      rootCauses: ['Причина 1', 'Причина 2'],
      solutions: [{ title: 'Решение', description: 'Добавь Groq API ключ' }],
      nextStep: 'Настроить AI'
    },
    MENTOR: {
      summary: 'Ментор выслушал тебя.',
      advice: ['Добавь Groq API ключ для реальных советов'],
      questions: ['Что для тебя сейчас самое важное?'],
      encouragement: 'Ты на правильном пути! 💪'
    },
    MEETING_NOTES: {
      title: 'Заметки встречи',
      decisions: ['Решение 1'],
      actionItems: [{ task: 'Настроить AI', owner: 'Ты', deadline: 'Сегодня' }]
    },
    REFLECTION: {
      mood: 'Нейтральное',
      insights: ['Добавь Groq API ключ для анализа'],
      mainThemes: ['Саморазвитие'],
      tomorrowFocus: 'Настроить AI анализ'
    }
  }
  return mocks[mode] || mocks.REFLECTION
}
