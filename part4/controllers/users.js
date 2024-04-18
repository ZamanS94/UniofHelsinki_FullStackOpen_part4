import bcrypt from 'bcrypt'
import express from 'express'
import { Blog } from '../models/blogSchema.js'
import { User } from '../models/userSchema.js'


const router = express.Router()
router.get('/api/users', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blog')

    const newUsers = users.map(user => {
      return {
        blog: user.blog.map(blog_ => {
          return {
            url: blog_.url,
            title: blog_.title,
            author: blog_.author,
            id: blog_._id
          }
        }),
        id: user._id,
        name: user.name,
        username: user.username
      }
    })
    response.json(newUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    response.status(500).json({ error: "Internal Server Error" })
  }
})



router.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body
  console.log('Request Body:', request.body)

  if (!username || !name || !password) {
    return response.status(400).json({ error: 'Missing required fields' })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password length must be 3' })
  }


  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    hashedPassword
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    return response.status(500).json({ error: 'duplicate username error' })
  }

})

export const usersRouter = (app) => {
  app.use(router)
}
