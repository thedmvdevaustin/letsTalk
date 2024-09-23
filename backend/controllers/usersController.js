import User from '../models/user.js'
import expressAsyncHandler from 'express-async-handler'
import Chat from '../models/chat.js'


//@description  Search all users
//@route        GET; /api/users/search?name
//@access       Protected
const searchUsers = expressAsyncHandler( async(req, res) => {
    // Logic: see if there is a query named "name"; if there is store an
    //object that serves as an or statement taking in 2 expressions that
    //perform a regex string match against the first name and email with
    //case insensitive options; call this object in the user.find in our db
    //exclude the user that's logged in and return the results
    const name = req.query.name 
    ? {
        $or: [
            { firstName: { $regex: req.query.name, $options: "i"} },
            { email: {$regex: req.query.name, $options: "i"} },
            // { name: {$regex: req.query.name, $options: "i"} }
        ],
    }
    : {}
    const results = await User.find(name).find({ _id: { $ne: req.user._id}}).select("-password")
    // logic: if req.query.name is a chatName, results 
    // should give us a falsy val; putting us inside the if 
    // statement and getting the chat name info from the chat
    // db then we return the results of that 

    // if (!results){
    //     const chat = await Chat.find(name)
    // }
    return res.status(200).json(results)
})

//@description  Get one user
//@route        GET; /api/users/:id
//@access       Protected
const accessOneUser = expressAsyncHandler( async(req, res) => {
    if (!req.params.id){
        return res.status(400).json("invalid parameter")
    }
    const user = await User.findById(req.params.id).select("-password")
    if (!user){
        return res.status(400).json("User does not exist")
    }
    return res.status(200).json(user)
})


export { searchUsers, accessOneUser }

/*
1. search functionality for searching a chat/search functionality to add 
a user to a chat; GOOD
*/
