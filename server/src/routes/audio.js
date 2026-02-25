import { Router } from 'express'
import { uploadAndProcess } from '../controllers/audioController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadAudio } from '../middleware/uploadMiddleware.js'

const router = Router()

router.post('/upload', authMiddleware, uploadAudio.single('audio'), uploadAndProcess)

export default router
