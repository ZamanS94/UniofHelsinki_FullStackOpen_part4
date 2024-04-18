import bcrypt from 'bcrypt'
import express from 'express'
import { User } from '../models/userSchema.js'

const router = express.Router()

router.get('/api/users', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

router.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body
  console.log('Request Body:', request.body)

  if (!username || !name || !password) {
    return response.status(400).json({ error: 'Missing required fields' })
  }

  const saltRounds = 10
  const passwordH = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordH
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

export const usersRouter = (app) => {
  app.use(router)
}