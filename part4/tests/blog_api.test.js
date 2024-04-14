import { test,after } from 'node:test'

import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'

const api = supertest(app)


test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
