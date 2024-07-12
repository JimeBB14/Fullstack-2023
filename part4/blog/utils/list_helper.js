const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav))
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const authorCounts = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1
      return counts
    }, {})
    const maxBlogs = Math.max(...Object.values(authorCounts))
    const author = Object.keys(authorCounts).find(author => authorCounts[author] === maxBlogs)
    return { author, blogs: maxBlogs }
  }
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    const authorLikes = blogs.reduce((likes, blog) => {
      likes[blog.author] = (likes[blog.author] || 0) + blog.likes
      return likes
    }, {})
    const maxLikes = Math.max(...Object.values(authorLikes))
    const author = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes)
    return { author, likes: maxLikes }
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  