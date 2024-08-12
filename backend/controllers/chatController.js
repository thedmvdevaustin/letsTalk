import Chat from '../models/chat.js'
import User from '../models/user.js'
import expressAsyncHandler from 'express-async-handler'

const getUserChats = expressAsyncHandler( async(req, res) => {
    //Logic: get all the chats were the user logged in is a member and 
    //sort them by the ones that was most recently updated
    let chats = await Chat.find({
        members: { $all: [req.user._id]}
    }).sort({ updatedAt: -1})
    console.log(chats)
    res.status(200).json(chats)
})

const createChat = expressAsyncHandler( async(req, res) => {
    //Logic: get all members; if members>==3, it's a groupChat and set the 
    //admin to be req.user; 
    const { members, name } = req.body
    //remember members is being passed in as a string in out postman ex
    if (!members || !name){
        res.status(400).json("bad request, missing information")
    }
    let chat = { members, name }
    if (members.length>2) {
        chat = { ...chat, admin: req.user._id, isGroupChat: true }
        await Chat.create(chat)
        res.status(201).json(chat)
    } else if(members.length===2) {
        await Chat.create(chat)
        res.status(201).json(chat)
    } else {
        res.status(400).json("failed to create chat")
    }
})

const accessSpecificChat = expressAsyncHandler( async(req, res) => {
    const chat = await Chat.findOne({_id: req.params.id})
    if (!chat){
        res.status(400).json("chat does not exist")
    }
    const chatMessages = await chat.populate('messages')
    console.log(chatMessages)
    
    res.status(200).json(chatMessages)
    //Finish this once you create some messages for a chat
})

export { getUserChats, createChat, accessSpecificChat}

/*
1. create a chat; WORKS
2. access chat(when we click a chat show the messages in the chat)
3. get all the chats of the logged in user; WORKS 
4. 
*/

/*
2. notifications
3. read receipts
4. show another person is typing 
5. sending a message
6. get all chats; sort by last messge sent or received
7. delete a chat
8. allow send emojis, pictures, and videos
9. 
*/