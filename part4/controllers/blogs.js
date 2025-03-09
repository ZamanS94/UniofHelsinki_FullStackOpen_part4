import express from 'express'
import errorHandler from '../middleware/errorHandler.js'
import { authenticateToken, userExtractor }from '../middleware/tokenAuthorization.js'
import { Blog } from '../models/blogSchema.js'
import { User } from '../models/userSchema.js'
import mongoose from 'mongoose'
import { log } from 'console'

const router = express.Router()

router.use(errorHandler)
router.use(authenticateToken)
router.use(userExtractor)

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

    if (!body.title || !body.url) {
      throw new Error('title or url missing')
    }
    const user = await User.findById(request.user._id)

    let likes = 0
    if (body.hasOwnProperty('likes')) {
      likes = body.likes
    }
    else{
      likes=0
    }

    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      user: user._id,
      likes: likes,
      id: body.id
    })

    const savedBlog = await blog.save()
    user.blog = user.blog.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

router.delete('/api/blogs/:id', authenticateToken, async (request, response) => {
  try {
    const userId = request.user._id
    const blogId = request.params.id

    if (!mongoose.isValidObjectId(blogId)) {
      return response.status(400).json({ error: "invalid id" })
    }

    const blog = await Blog.findById(blogId)

    if (!blog) {
      return response.status(404).json({ error: "blog not found" })
    }
    if (blog.user.equals(userId)) {
      await Blog.findOneAndDelete({ _id: blogId })
      response.status(204).json({ message: "blog deleted" })
    }
    else{
      return response.status(403).json({ error: "can't delete the blog" })
    } 
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})


router.put('/api/blogs/:id', async (request, response) => {
  try {
    const userId = request.body.user && request.body.user.id ? request.body.user.id : request.body.user;
    const blogId = request.body.id
    const body = request.body

    if (!mongoose.isValidObjectId(blogId)) {
      return response.status(400).json({ error: "invalid id" })
    }

    const blog = await Blog.findById(blogId)

    if (!blog) {
      return response.status(404).json({ error: "Blog not found" })
    }

    if (!blog.user.equals(userId)) {
      return response.status(403).json({ error: "can't edit the blog" })
    }

    delete body.id

    if (body.user) {
      delete body.user
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, body, {
      new: true,
      runValidators: true
    })

    if (!updatedBlog) {
      return response.status(404).send("Blog not found")
    }

    response.status(200).json(updatedBlog)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})


export const setupRoutes = (app) => {
  app.use(router)
}
