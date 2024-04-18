import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
})

export const User = mongoose.model('User', userSchema)