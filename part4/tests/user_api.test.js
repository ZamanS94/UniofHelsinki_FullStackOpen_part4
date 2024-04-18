import bcrypt from 'bcrypt'
import { test, after, beforeEach } from 'node:test'
import supertest from 'supertest'
import app from '../app.js'
import { usersInDb } from './test_helper.test.js'
import mongoose from 'mongoose'
import assert from 'assert'

import { User } from '../models/userSchema.js'

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'root', passwordHash })

    await user.save()
})

test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
})


test('testing username less than 3 characters', async () => {
    const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect(res => {
            assert.strictEqual(res.body.error, 'Username and password length must be 3')
        })
})

test('testing password less than 3 characters', async () => {
    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect(res => {
            assert.strictEqual(res.body.error, 'Username and password length must be 3')
        })
})

test('creation fails with existing username', async () => {
    const users = await usersInDb()

    const user0 = users[0]

    const newUser = {
        username: user0 .username,
        name: user0.name,
        password: 'password123',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(500)
        .expect('Content-Type', /application\/json/)
        .expect(res => {
            assert.strictEqual(res.body.error,'duplicate username error')
        })
})

after(async () => {
    await mongoose.connection.close()
})
