import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './utils/config.js'
import { setupRoutes } from './blogRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI, {
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

const PORT = config.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
