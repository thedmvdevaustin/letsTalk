import Chat from '../models/chat.js'
import User from '../models/user.js'
import expressAsyncHandler from 'express-async-handler'

const getUserChats = expressAsyncHandler( async(req, res) => {
    //Logic: get all the chats were the user logged in is a member and 
    //sort them by the ones that was most recently updated

    //Error: if a user that you haven't looked up sends you 
    //a message then it will pop up in your chats as your name
    //when you want it to pop up as their name instead
    const chats = await Chat.find({
        members: { $all: [req.user._id]}
    }).sort({ updatedAt: -1}).populate("members").populate({
        path: 'messages',
        populate: {
            path: 'sender',
            model: 'User',
            select: "-password"
        }
    })
    if (!chats){
        return res.status(400).json("chats do not exist")
    }
    //logic: for error comment above; checks to see if user sent
    //you a message, in which they created a chat; so instead of 
    //you seeing your own name as a contact the chats will be 
    //called and you will replace that chatName with there chat 
    //name before you send all the chats as json
    let allChats = []
    chats.map(chat => {
        if (!chat.isGroupChat && chat.name===`${req.user.firstName} ${req.user.lastName}`) {
            if (chat.name!==`${chat.members[0].firstName} ${chat.members[0].lastName}`) {
                chat.name = `${chat.members[0].firstName} ${chat.members[0].lastName}`
            } else {
                chat.name = `${chat.members[1].firstName} ${chat.members[1].lastName}`
            }
        }
        allChats.push(chat)
    })
    return res.status(200).json(allChats)
})

const createChat = expressAsyncHandler( async(req, res) => {
    //Logic: get all members; if members>==3, it's a groupChat and set the 
    //admin to be req.user; 
    const { members, name } = req.body
    //remember members is being passed in as a string in out postman ex
    if (!members || !name){
        return res.status(400).json("bad request, missing information")
    }
    let chat = { members, name }
    if (members.length>2) {
        chat = { ...chat, admin: req.user._id, isGroupChat: true }
        await Chat.create(chat)
        return res.status(201).json(chat)
    } else if(members.length===2) {
        await Chat.create(chat)
        return res.status(201).json(chat)
    } else {
        return res.status(400).json("failed to create chat")
    }
})

const addMembersToChat = expressAsyncHandler( async(req, res) => {
    const { members } = req.body
    if (!members) {
        return res.status(400).json("bad request, missing information")
    } else {
        await Chat.findOneAndUpdate(
            {_id: req.params.id},
            { $push: { members: {$each: [...members]}}}
        )
        return res.status(200).json("member added")
    }
})

const changeNameOfChat = expressAsyncHandler( async(req, res) => {
    const { name } = req.body 
    if (!name){
        return res.status(400).json("bad request, missing information")
    } else {
        const chat = await Chat.findOneAndUpdate(
            {_id: req.params.id},
            { name }
        )
        return res.status(200).json({...chat, name })
    }
})

const removeMemberFromChat = expressAsyncHandler( async(req, res) => {
    const { member } = req.body
    if (!member){
        return res.status(400).json("bad request, missing information")
    }
    const user = await User.findById(member)
    if (!user){
        return res.status(400).json("User not found")
    } else {
        await Chat.findOneAndUpdate(
            {_id: req.params.id},
            { $pull: { members: { $in: [member] } } }
        )
        return res.status(200).json("member removed")
    }
})

const accessSpecificChat = expressAsyncHandler( async(req, res) => {
    const chat = await Chat.findOne({_id: req.params.id})
    if (!chat){
        return res.status(400).json("chat does not exist")
    }
    const chatMessages = await chat.populate('messages')
    return res.status(200).json(chatMessages)
    //Finish this once you create some messages for a chat
})


export { getUserChats, createChat, accessSpecificChat, addMembersToChat, changeNameOfChat, removeMemberFromChat}

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