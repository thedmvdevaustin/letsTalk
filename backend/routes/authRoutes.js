import express from 'express'
import { register, login, logout } from '../controllers/authController.js'
const routes = express.Router()

routes.post('/register', register)
routes.post('/', login)
routes.post('/logout', logout)

export default routes