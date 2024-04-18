import { Router } from 'express'
import {Blog,User} from '../models/combineSchema.js'

const router = Router()

// Get all users with their blogs
router.get('/i/users', async (request, response) => {
    try {
        const users = await User.find({}).populate('blogs')
        response.json(users)
    } catch (error) {
        console.error(error.message)
        response.status(500).send('Internal Server Error')
    }
})

// Create a new user
router.post('/i/users', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !name || !password) {
        return response.status(400).json({ error: 'Missing required fields' })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'Username and password length must be at least 3 characters' })
    }

    const user = new User({
        username,
        name,
        hashedPassword: await bcrypt.hash(password, 10)
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        return response.status(500).json({ error: 'Duplicate username error' })
    }
})

// Get all blogs with their users
router.get('/i/blogs', async (request, response) => {
    try {
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    } catch (error) {
        console.error(error.message)
        response.status(500).send('Internal Server Error')
    }
})

// Create a new blog
router.post('/i/blogs', async (request, response) => {
    const { title, author, url, likes, user } = request.body

    if (!title || !author || !url || !likes || !user) {
        return response.status(400).json({ error: "One or more required fields are missing" })
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user
    })

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch (error) {
        console.error(error.message)
        response.status(500).send('Internal Server Error')
    }
})

export const setupRoutes = (app) => {
    app.use(router)
}
