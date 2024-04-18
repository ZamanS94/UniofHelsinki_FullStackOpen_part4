import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        unique: true
    },
    name: String,
    password: {
        type: String,
        minLength: 3,
    },
    hashedPassword: String
})

export const User = mongoose.model('User', userSchema)