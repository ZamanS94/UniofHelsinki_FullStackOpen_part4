import express from 'express'
import { Blog } from '../models/blogSchema.js'
import { User } from '../models/userSchema.js'

const router = express.Router()

router.get('/', async (request, response) => {
  response.send('Hi there!')
})

router.get('/api/blogs', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user')

    const newBlogs = blogs.map(blog => {
      return {
        url: blog.url,
        title: blog.title,
        author: blog.author,
        user: {
          username: blog.user.username,
          name: blog.user.name,
          id: blog.user._id
        },
        likes: blog.likes,
        id: blog._id
      }
    })
    response.status(200).json(newBlogs)
  } catch (error) {
    console.log(error.body)
    response.status(500).json({ error: "Internal Server Error" })
  }
})

router.post('/api/blogs', async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const user = await User.findById(body.userId)

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author || '',
    user: user._id,
    likes: body.likes || 0, 
    id: body._id
  })

  try {
    const savedBlog = await blog.save()
    user.blog = user.blog.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(500).send('Internal Server Error')
  }
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
