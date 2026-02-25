import { Router } from 'express'
import { getMessages, sendMessage } from '../controllers/chatController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/:noteId', getMessages)
router.post('/:noteId', sendMessage)

export default router
