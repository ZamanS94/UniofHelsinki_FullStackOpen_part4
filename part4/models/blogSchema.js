import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  id: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


export const Blog = mongoose.model('Blog', blogSchema)
