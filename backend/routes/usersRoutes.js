import express from 'express'
import protect from '../middleware/protect.js'
import { searchUsers, accessOneUser } from '../controllers/usersController.js'

const routes = express.Router()

routes.get('/search', protect, searchUsers)
routes.get('/:id', protect, accessOneUser)

export default routes