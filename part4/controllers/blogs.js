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
        response.status(404).send("blog was not found" )
      }
      else{
        response.status(204).send("blog deleted")
      }
})

router.put('/api/blogs/:id', async (request, response) => {
    const id_ = request.params.id
    const body = request.body
        const updatedPerson = await Blog.findOneAndUpdate(
            { id: id_ }, body, { new: true,runValidators: true } 
        )
        if (!updatedPerson) {
            response.status(404).send("blog was not found" )
        }
        else{
            response.status(201).send("blog updated" )
        }
})

export const setupRoutes = (app) => {
  app.use(router)
}
