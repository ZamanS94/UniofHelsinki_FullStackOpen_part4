import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import {MONGODB_URI,PORT} from './utils/config.js'
import { setupRoutes } from './controllers/blogs.js'
import {usersRouter} from './controllers/users.js'

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error)
})

setupRoutes(app)
usersRouter(app)

export default app
