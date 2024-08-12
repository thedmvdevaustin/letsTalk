import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const protect = async (req, res, next) => {
    const token = req.cookies.jwt
    if (token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select("-password")
            next()
        } catch(err){
            res.status(401).json({error: "Not Authorized, invalid token"})
        }
    } else {
        res.status(401).json({error: "Not Authorized, No token"})
    }
}

export default protect