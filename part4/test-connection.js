import mongoose from 'mongoose'

// Replace '<password>' with your actual password
const uri = `mongodb+srv://sabina37:113037@cluster0.enthgpn.mongodb.net/`

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

  