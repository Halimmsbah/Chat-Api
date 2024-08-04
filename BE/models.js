import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true, 
    },
    socketId: { 
        type: String,},
})


const messageSchema = new mongoose.Schema({
    text: { type: String, trim: true, required: true },
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',    
        required: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',    
        required: true
    }   
})


export const postModel = mongoose.model('post', postSchema)
export const userModel = mongoose.model('user', userSchema)
export const messageModel = mongoose.model('message', messageSchema)

