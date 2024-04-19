import express from 'express'
import { Blog } from '../models/blogSchema.js'
import { User } from '../models/userSchema.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}



router.use(errorHandler)

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


router.post('/api/blogs', async (request, response, next) => { 
  try {
    const getTokenFrom = request => {
      const authorization = request.get('authorization')
      if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
      }
      return null
    }

    const body = request.body
    let decodedToken
    try {
      decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token signature' })
      }
      throw error 
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    try {
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
  } catch (error) {
    next(error)
  }
})


router.delete('/api/blogs/:id', async (request, response) => {
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
