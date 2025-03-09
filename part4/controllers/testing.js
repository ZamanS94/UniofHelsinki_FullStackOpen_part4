import express from 'express'
import { Blog } from '../models/blogSchema.js'
import { User } from '../models/userSchema.js'

const testingRouter = express.Router()
testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

export default testingRouter;