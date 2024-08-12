import Message from '../models/message.js'
import Chat from '../models/chat.js'
import expressAsyncHandler from 'express-async-handler'

const sendMessage = expressAsyncHandler( async(req, res) => {
    const { message } = req.body
    //Logic: validate the message from the form, create a message in the db
    //we don't have to validate chat since it already was in access chat;
    //update the chat that we are sending a message to by appending the
    //new message we created 
    if (!message) res.status(400).json("bad request, missing information")
    const newMessage = await Message.create({ message, sender: req.user._id, chat: req.params.id})
    if (!newMessage){
        res.status(400).json("failed to store message in db")
    }
    await Chat.updateOne(
        { _id: req.params.id},
        { $push: { messages: newMessage}}
    )
    res.status(200).json("message sent")
})

export { sendMessage }