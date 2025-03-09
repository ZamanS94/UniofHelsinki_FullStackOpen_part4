import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { MONGODB_URI } from './utils/config.js'
import { setupRoutes } from './controllers/blogs.js'
import { usersRouter } from './controllers/users.js'
import { loginRouter } from './controllers/login.js'
import testingRouter from './controllers/testing.js';

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error)
})

setupRoutes(app)
usersRouter(app)
loginRouter(app)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

export default app
