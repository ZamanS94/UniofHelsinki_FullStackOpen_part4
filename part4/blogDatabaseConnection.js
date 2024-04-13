import mongoose from 'mongoose'

export const connectToDatabase = () => {
  const password = process.argv[2]
  const mongoUrl = `mongodb+srv://sabina37:${password}@cluster0.enthgpn.mongodb.net/`
  mongoose.connect(mongoUrl)
}