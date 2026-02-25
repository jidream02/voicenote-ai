import prisma from '../utils/prismaClient.js'
import { chatWithNote } from '../services/gptService.js'

export const getMessages = async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.noteId, userId: req.user.id }
    })
    if (!note) return res.status(404).json({ error: 'Note not found' })

    const messages = await prisma.message.findMany({
      where: { noteId: req.params.noteId },
      orderBy: { createdAt: 'asc' }
    })
    res.json({ messages })
  } catch (err) {
    next(err)
  }
}

export const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body
    const note = await prisma.note.findFirst({
      where: { id: req.params.noteId, userId: req.user.id }
    })
    if (!note) return res.status(404).json({ error: 'Note not found' })

    // Save user message
    await prisma.message.create({
      data: { noteId: note.id, role: 'user', content }
    })

    // Get history for context
    const history = await prisma.message.findMany({
      where: { noteId: note.id },
      orderBy: { createdAt: 'asc' },
      take: 20
    })

    const gptMessages = history.map(m => ({ role: m.role, content: m.content }))
    const reply = await chatWithNote(gptMessages, note)

    // Save assistant message
    const message = await prisma.message.create({
      data: { noteId: note.id, role: 'assistant', content: reply }
    })

    res.json({ message })
  } catch (err) {
    next(err)
  }
}
