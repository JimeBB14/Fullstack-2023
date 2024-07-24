const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id 
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = request.user;
  const blog = await Blog.findById(request.params.id).populate('user');

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  if (!blog.user || blog.user.id.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' });
  }

  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (exception) {
    response.status(500).json({ error: 'failed to delete blog' });
  }
});

module.exports = blogsRouter;
