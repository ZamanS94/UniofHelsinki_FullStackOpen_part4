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

after(async () => {
  await mongoose.connection.close()
})
