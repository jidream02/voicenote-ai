import { Router } from 'express'
import { getNotes, getNote, deleteNote, getStats } from '../controllers/notesController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/stats', getStats)
router.get('/', getNotes)
router.get('/:id', getNote)
router.delete('/:id', deleteNote)

export default router
