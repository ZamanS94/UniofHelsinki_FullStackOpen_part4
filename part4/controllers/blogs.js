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


router.delete('/api/blogs/:id', async (request, response, next) => {
    const id = Number(request.params.id)
    console.log(id)
      const deletedBlog= await Blog.findOneAndDelete({ id })
      if (!deletedBlog) {
        response.status(404).json({ error: "blog was not found" })
      }
      else{
        response.status(204).json({ error: "blog deleted" })
      }
})

  
export const setupRoutes = (app) => {
  app.use(router)
}
