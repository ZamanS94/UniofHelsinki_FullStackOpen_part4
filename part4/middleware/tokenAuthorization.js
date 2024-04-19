import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../models/userSchema.js'

dotenv.config()

const authenticateToken = async (request, response, next) => {
  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    request.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'invalid token signature' })
    }
    next(error)
  }
}

export default authenticateToken
