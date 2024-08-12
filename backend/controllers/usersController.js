import User from '../models/user.js'
import expressAsyncHandler from 'express-async-handler'


// GET; /api/users/search?name
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
        ],
    }
    : {}
    console.log(name)
    const results = await User.find(name).find({ _id: { $ne: req.user._id}})

    res.status(200).json(results)
})

export { searchUsers }

/*
1. search functionality for searching a chat/search functionality to add 
a user to a chat; GOOD
*/
