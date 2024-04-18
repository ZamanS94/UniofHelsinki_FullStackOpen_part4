import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        unique: true
    },
    name: String,
    hashedPassword: String, // Only store hashed password
    blogs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
        }
      ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.hashedPassword // Correct field name
    }
  })

const User = mongoose.model("User", userSchema)
const Blog = mongoose.model("Blog", blogSchema)

export { User, Blog }
