import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './blogDatabaseConnection.js'
import { setupRoutes } from './blogRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

connectToDatabase()
setupRoutes(app)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
