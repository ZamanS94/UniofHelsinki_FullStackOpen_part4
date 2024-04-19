import express from 'express'
import errorHandler from '../middleware/errorHandler.js'
import authenticateToken from '../middleware/tokenAuthorization.js'
import { Blog } from '../models/blogSchema.js'
import { User } from '../models/userSchema.js'

const router = express.Router()

router.use(errorHandler)

router.get('/', async (request, response) => {
  response.send('Hi there!')
})

router.get('/api/blogs', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user')

    const newBlogs = blogs.map(blog => ({
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
    }))
    response.status(200).json(newBlogs)
  } catch (error) {
    console.log(error.body)
    response.status(500).json({ error: "Internal Server Error" })
  }
})

router.post('/api/blogs', authenticateToken, async (request, response) => {
  try {
    const body = request.body
    const user = await User.findById(request.user._id)

    if (!body.title || !body.url) {
      throw new Error('title or url missing')
    }

    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      user: user._id,
      likes: body.likes,
      id: body._id
    })

    const savedBlog = await blog.save()
    user.blog = user.blog.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

router.delete('/api/blogs/:id', async (request, response) => {
  const id = Number(request.params.id)
  const deletedBlog = await Blog.findOneAndDelete({ id })
  if (!deletedBlog) {
    response.status(404).send("blog was not found")
  } else {
    response.status(204).send("blog deleted")
  }
})

router.put('/api/blogs/:id', async (request, response) => {
  const id_ = request.params.id
  const body = request.body
  const updatedPerson = await Blog.findOneAndUpdate(
    { id: id_ }, body, { new: true, runValidators: true }
  )
  if (!updatedPerson) {
    response.status(404).send("blog was not found")
  } else {
    response.status(201).send("blog updated")
  }
})

export const setupRoutes = (app) => {
  app.use(router)
}
