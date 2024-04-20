import { test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'
import { initialBlogs, nonExistingId, blogsInDb } from './test_helper.test.js'
import mongoose from 'mongoose'
import { Blog } from '../models/blogSchema.js'
import bcrypt from 'bcrypt'
import { usersInDb } from './test_helper.test.js'
import { User } from '../models/userSchema.js'
import jwt from 'jsonwebtoken'

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const existingUser = await User.findOne({ username: 'root' })

  if (!existingUser) {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'root', passwordHash })
    await user.save()
  }

  const usersAtStart = await usersInDb()

  for (const blog of initialBlogs) {
    const blogObject = new Blog({
      ...blog,
      user: usersAtStart[0]._id 
    })
    await blogObject.save()
  }

  const userForToken = {
    username: usersAtStart[0].username,
    id: usersAtStart[0]._id,
  }

  token = jwt.sign(userForToken, process.env.SECRET)
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Include token in request header
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have unique identifiers', async () => {
  const singleID = await nonExistingId()
  const blogsDB = await blogsInDb()
  const nonEqual = blogsDB.every(blog => blog.id !== singleID)
  assert.strictEqual(nonEqual, true)
})

test('posting a new blog', async () => {
  const newBlog = {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    url: "https://en.wikipedia.org/wiki/Sherlock_Holmes",
    likes: 3000
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('posting a new blog without likes', async () => {
  const newBlog = {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    url: "https://en.wikipedia.org/wiki/Sherlock_Holmes"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('rejecting bad requests', async () => {
  const usersAtStart = await usersInDb()
  const noTitle = {
    author: "Arthur Conan Doyle",
    url: "https://sherlockholmes.com",
    likes: 100
  }

  const noUrl = {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    likes: 100
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noUrl)
    .expect(400)
})

test('deleting a blog', async () => {
  let response = await api.get('/api/blogs')
  const initialBlogs = response.body
  const blogToDelete = initialBlogs[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
})

test('updating a blog', async () => {
  let response = await api.get('/api/blogs')
  const initialBlogs = response.body

  const blogToUpdate = initialBlogs[0]
  const updatedData = {
    likes: 901
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedData)
    .expect(200)

  response = await api.get('/api/blogs')
  const updatedBlogs = response.body
  const updatedBlog = updatedBlogs.find(blog => blog.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, updatedData.likes)
})

after(async () => {
  await mongoose.connection.close()
})
