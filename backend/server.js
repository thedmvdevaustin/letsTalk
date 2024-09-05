import express from 'express'
import { server, app } from './socket.js'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
connectDB()

//Middleware
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())
app.use(cors())

//Routes
app.use('/api', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
//Error Handlers
app.use(notFound)
app.use(errorHandler)

server.listen(process.env.PORT || 2121, console.log(`Server running on port ${process.env.PORT || 2121}...`))

export default app