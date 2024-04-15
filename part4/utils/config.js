import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

let PORT

if (MONGODB_URI.includes('2uiq8du')) {
    PORT = process.env.PORT_TEST
  } else {
    PORT = process.env.PORT
  }

console.log(PORT)

export {
  MONGODB_URI,
  PORT
}


