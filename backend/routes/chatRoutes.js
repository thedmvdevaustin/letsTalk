import express from 'express'
import { getUserChats, createChat, accessSpecificChat } from '../controllers/chatController.js'
import protect from '../middleware/protect.js'
const routes = express.Router()

routes.get('/', protect, getUserChats)
routes.post('/create', protect, createChat)
routes.get('/:id', protect, accessSpecificChat)

export default routes