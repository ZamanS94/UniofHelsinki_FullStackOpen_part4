import { Blog } from '../models/blogSchema.js'

const initialBlogs = [
  {
    title: 'Harry Potter',
    author: 'J.K Rowling',
    url: 'https://en.wikipedia.org/wiki/Harry_Potter_and_the_Philosopher%27s_Stone',
    likes: 1000
  },
  {
    title: 'Game of Thrones',
    author: 'R.R. Martin',
    url: 'https://en.wikipedia.org/wiki/Game_of_Thrones',
    likes: 5000
  },
  {
    "title": "The Great Gatsby",
    "author": " F. Scott Fitzgerald",
    "url": "https://en.wikipedia.org/wiki/The_Great_Gatsby",
    "likes": 3000
}
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Temporary Author',likes: 0 })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => {
    const nesBlogs = blog.toJSON()
    nesBlogs.id = nesBlogs._id.toString()
    delete nesBlogs._id
    delete nesBlogs.__v
    return nesBlogs
  })
}

export {
  initialBlogs,
  nonExistingId,
  blogsInDb
}
