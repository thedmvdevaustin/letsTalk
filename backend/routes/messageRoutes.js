import express from 'express'
import { sendMessage } from '../controllers/messageController.js'
import protect from '../middleware/protect.js'
const routes = express.Router()

routes.post('/:id', protect, sendMessage)

export default routes