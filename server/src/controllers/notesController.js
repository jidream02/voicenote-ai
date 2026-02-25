import prisma from '../utils/prismaClient.js'

export const getNotes = async (req, res, next) => {
  try {
    const { search, tag, mode } = req.query
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.id,
        ...(search && { title: { contains: search, mode: 'insensitive' } }),
        ...(mode && { mode }),
        ...(tag && { tags: { some: { name: tag } } })
      },
      include: { tags: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ notes })
  } catch (err) {
    next(err)
  }
}

export const getNote = async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { tags: true, messages: { orderBy: { createdAt: 'asc' } } }
    })
    if (!note) return res.status(404).json({ error: 'Note not found' })
    res.json({ note })
  } catch (err) {
    next(err)
  }
}

export const deleteNote = async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    })
    if (!note) return res.status(404).json({ error: 'Note not found' })

    await prisma.note.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id
    const [total, byMode, recentNotes] = await Promise.all([
      prisma.note.count({ where: { userId } }),
      prisma.note.groupBy({ by: ['mode'], where: { userId }, _count: true }),
      prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: { createdAt: true, duration: true }
      })
    ])
    res.json({ total, byMode, recentNotes })
  } catch (err) {
    next(err)
  }
}
