import mongoose from "mongoose"

const connectDB = async() => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected to ${conn.connection.host}`)
    } catch(err) {
        console.error(`Error ${err.message}`)
        process.exit(1)
    }
}

export default connectDB