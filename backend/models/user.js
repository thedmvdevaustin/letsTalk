import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profilePic: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function (next){
    if (!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.matchPasswords = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', UserSchema)

export default User