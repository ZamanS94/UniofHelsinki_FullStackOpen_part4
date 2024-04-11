import { Router } from 'express'
import { Blog } from './models/blogSchema.js'

const router = Router()

router.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

router.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
export const setupRoutes = (app) => {
  app.use(router)
}
