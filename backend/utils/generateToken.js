import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '2d'
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 1000*60*60*24*2 // 2 days in milliseconds
    })
    
}

export default generateToken