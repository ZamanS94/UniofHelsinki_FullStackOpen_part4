export const dummy = (blogs) => {
    return 1
}

export const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
      }, 0)
  }