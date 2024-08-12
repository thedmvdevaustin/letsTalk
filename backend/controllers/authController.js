import expressAsyncHandler from 'express-async-handler'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'

const register = expressAsyncHandler( async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const userExists = await User.findOne({email: email})
    if (userExists){
        res.status(400).json({error: "User already exists"})
    } else {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            profilePic: `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`
        })
        res.status(201).json({_id: user._id, firstName, lastName, email, profilePic: user.profilePic })
    }
})

const login = expressAsyncHandler( async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({email: email})
    if (!user){
        res.status(400).json({error: "User does not exits"})
    } else {
        if (await user.matchPasswords(password)) {
            generateToken(user._id, res)
            res.status(200).json({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, profilePic: user.profilePic})
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