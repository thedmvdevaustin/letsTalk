import express from 'express'
import { getUserChats, createChat, accessSpecificChat, addMembersToChat, changeNameOfChat, removeMemberFromChat } from '../controllers/chatController.js'
import protect from '../middleware/protect.js'
const routes = express.Router()

routes.get('/', protect, getUserChats)
routes.post('/create', protect, createChat)
routes.get('/:id', protect, accessSpecificChat)
routes.put('/:id/add', protect, addMembersToChat)
routes.put('/:id/rename', protect, changeNameOfChat)
routes.put('/:id/remove', protect, removeMemberFromChat)
export default routes