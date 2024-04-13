import _ from 'lodash'

export const dummy = (blogs) => {
    return 1
}

export const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
      }, 0)
  }

export const favoriteBlog = (blogs) => {

    let maxLikes = blogs[0].likes
    let favoriteBlog = blogs[0]

    for (let i = 1; i < blogs.length; i++) {
      const currentLikes = blogs[i].likes
      if (currentLikes > maxLikes) {
        maxLikes = currentLikes
        favoriteBlog = blogs[i]
      }
    }
  
    return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
  }

export const mostBlogs = (blogs) => {
    const groupAuthors = _.groupBy(blogs, 'author')
    const blogsByAuthor = _.mapValues(groupAuthors, blogs => {
        return blogs.length
    })

    const maxBlogs = _.max(_.values(blogsByAuthor))
    const maxAuthor = _.findKey(blogsByAuthor, author => author === maxBlogs)

    return {
        author: maxAuthor,
        blogs: maxBlogs
}
}

export const mostLikes = (blogs) => {
    const groupAuthors = _.groupBy(blogs, 'author')
    const likesAuthors = _.mapValues(groupAuthors, blogs => {
        return _.sumBy(blogs, 'likes')
    })

    const maxLikes = _.max(_.values(likesAuthors))
    const maxAuthor = _.findKey(likesAuthors, author => author === maxLikes)

    return {
        author: maxAuthor,
        likes: maxLikes
    }
}




