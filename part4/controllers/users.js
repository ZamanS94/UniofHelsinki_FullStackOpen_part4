import bcrypt from 'bcrypt'
import express from 'express'
import { User } from '../models/userSchema.js'

const router = express.Router()

router.get('/api/users', async (request, response) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    console.error(error.message)
    response.status(500).send('Internal Server Error')
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
