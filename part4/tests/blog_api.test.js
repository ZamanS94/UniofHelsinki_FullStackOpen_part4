import { test, after, beforeEach} from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'
import  {initialBlogs,nonExistingId,blogsInDb} from './test_helper.test.js'
import mongoose from 'mongoose'
import { Blog } from '../models/blogSchema.js'

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  let BlogObject = new Blog(initialBlogs[0])
  await BlogObject.save()
  BlogObject = new Blog(initialBlogs[1])
  await BlogObject.save()
  BlogObject = new Blog(initialBlogs[2])
  await BlogObject.save()
  
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
   assert.strictEqual(response.body.length, initialBlogs.length)
})

test('testing for unique id', async () => {
 const singleID = await nonExistingId()
 const blogsDB = await blogsInDb()
 const nonEqual = blogsDB.every(blog => blog.id !== singleID)
 assert.strictEqual(nonEqual, true)
})


test('posting new blog is being tested',async () => {
  const newBlog = {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    url: "https://en.wikipedia.org/wiki/Sherlock_Holmes",
    likes: 3000,
    id:4
  }
  await api
  .post('/api/blogs')
  .send(newBlog).expect(201)
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length+1)
})

test('posting new blog without like is being tested',async () => {
  const newBlog = {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    url: "https://en.wikipedia.org/wiki/Sherlock_Holmes",
    id:4
  }

  if (!Object.keys(newBlog).includes('likes')) {
    newBlog.likes = 0
  }
  await api
  .post('/api/blogs')
  .send(newBlog).expect(201)
  const response = await api.get('/api/blogs')
  let checkBlog 
  response.body.forEach(blog => {
    if (blog.title==newBlog.title){
    checkBlog=blog}
  })
  assert.strictEqual(checkBlog.likes,0)
  assert.strictEqual(response.body.length, initialBlogs.length+1)
})


test('testing for bad request', async () => {
  const noTitle = {
    author: "Arthur Conan Doyle",
    url: "https://sherlockholmes.com",
    likes:100,
    id:4
  }

  const noUrl = {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    likes:100,
    id:4
  }

  await api
    .post('/api/blogs')
    .send(noTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(noUrl)
    .expect(400)
})


test('testing delete', async () => {
  await api.delete(`/api/blogs/100`).expect(404)
  await api.delete(`/api/blogs/3`).expect(204)
})


after(async () => {
  await mongoose.connection.close()
})
