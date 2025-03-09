import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import { User } from '../models/userSchema.js'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

router.post('/api/login', async (request, response) => {
    const { username, password } = request.body
    console.log(password)
    const user = await User.findOne({ username })
    if (!user) {
        return response.status(401).json({
            error: 'invalid username'
        })
    }

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.hashedPassword)
    console.log(passwordCorrect)
    if (!passwordCorrect) {
        return response.status(401).json({
            error: 'invalid password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({ token, username: user.username, name: user.name })
})

export const loginRouter = (app) => {
    app.use(router)
}
