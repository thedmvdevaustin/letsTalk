import expressAsyncHandler from 'express-async-handler'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'

const register = expressAsyncHandler( async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const userExists = await User.findOne({email: email})
    if (userExists){
        return res.status(400).json({error: "User already exists"})
    } else {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            profilePic: `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`
        })
        if (user){
            generateToken(user._id, res)
            return res.status(201).json({_id: user._id, firstName, lastName, email, profilePic: user.profilePic })
        } else {
            return res.status(400).json({error: "user not created in db"})
        }
    }
})

const login = expressAsyncHandler( async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({email: email})
    if (!user){
        return res.status(400).json({error: "User does not exits"})
    } else {
        if (await user.matchPasswords(password)) {
            generateToken(user._id, res)
            return res.status(200).json({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, profilePic: user.profilePic})
        }
    }
    
})

const logout = expressAsyncHandler( async(req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    })
    res.json({message: "Logged out"})
})

export { register, login, logout }