import { Router } from 'express'
import { Blog } from '../models/blogSchema.js'

const router = Router()

router.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

router.get('/', async (request, response) => {
    response.send('Hi there!')
  })
  
router.post('/api/blogs', (request, response) => {
    const { title, url } = request.body
    if (!title || !url) {
      return response.status(400).json({ error: "Title or URL is missing" })
    }
    const blog = new Blog(request.body)
    blog.save()
      .then(result => {
        response.status(201).json(result)
      })
})
  
export const setupRoutes = (app) => {
  app.use(router)
}
