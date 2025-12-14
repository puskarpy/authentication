import mongoose from "mongoose";

export const db = async() => {

    try {
        const res = await mongoose.connect(`${process.env.MONGO_URL}/auth`)
        console.log("MongoDB connected. Host:", res.connection.host)
    } catch (error) {
     console.error(error)   
    }
}