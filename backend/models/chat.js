import mongoose from 'mongoose'

const ChatSchema = mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ]
    
}, {
    timestamps: true
})

const Chat = mongoose.model('Chat', ChatSchema)

export default Chat

/*
1. would need a reference to all messages in order to get the messages
that are in a specific chat
2. would need all the users that are in a chat at once
3. an admin to add and remove people from the chat
4. if it is a group chat or not(group chat would be something with atleast
3 users)
5. the name of the groupChat
OPTIONAL
6. picture for the groupChat
*/