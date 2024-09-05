import express from 'express'
const app = express()
import http from 'http'
import { Server } from 'socket.io'


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})
let users = {}
io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`)
    const userId = socket.handshake.query.userId
    users[userId] = socket.id

    socket.on("send_message", data => {
        if(data.isGroupChat){
            io.in(data.message.chat.toString()).emit("new_message", data.message)
        } else {
            /* the logic here is when you send data to a single socket,
            only that socket gets the data but we want the receiver
            socket and the sender to get the data so we send a seperate
            event to send the data to the sender and receiver; this is
            still more optimal than creating a room and sending data that
            way if you are only sending data to a single socket */ 
            console.log(data) 
            io.to(users[data.receiverId]).emit("new_message", data.message)
            socket.emit("messageForSender", data.message)
        }

    })
    /* 2 ways we have of doing this:
    1. including the extra overhead and overkill that comes with having
    a room for a single socket; Rooms involve managing membership and 
    handling broadcast logic, which is more complex than direct targeting
    2. figure out a logical system to get the receivers socket id in
    order to message them directly for the non group chats

    An idea would be to map each userId and socketId together and either:
    1. make a db call to the chat id then get the member that isn't the
    same as the sender from the message in order to get the receiver's 
    socket id
    2. attach a receiverId to either the chat or message if it isn't a
    group chat and pass that back in the send_message event in order to
    access the socket id from that */

    socket.on("join_room", chat => {
        if (!chat.isGroupChat){
            return
        }
        socket.join(chat.chatId.toString())
        console.log(`${socket.id} has joined room ${chat.chatId}`)
    })
})

export { server, app, io}