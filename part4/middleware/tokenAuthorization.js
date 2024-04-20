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
      let token
      if (request.method !== 'GET' && request.method !== 'POST') {
        token = getTokenFrom(request)
        if (!token) {
          return response.status(401).json({ error: 'token missing' })
        }
      }

      if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!decodedToken.id) {
          return response.status(401).json({ error: 'token invalid' })
        }
        
        const user = await User.findById(decodedToken.id)
        request.user = user
      }
      next()
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token signature' })
      }
      next(error)
    }
}

const userExtractor = async (request, response, next) => {
  const token = request.get('authorization')?.replace('Bearer ', '')
  if (request.method !== 'GET' && !token &&request.method !== 'POST') {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
      const user = await User.findById(decodedToken.id)
      request.user = user
    }
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'invalid token signature' })
    }
    next(error)
  }
}

export { authenticateToken, userExtractor }
