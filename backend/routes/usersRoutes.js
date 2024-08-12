import express from 'express'
import protect from '../middleware/protect.js'
import { searchUsers } from '../controllers/usersController.js'

const routes = express.Router()

routes.get('/search', protect, searchUsers)

export default routes