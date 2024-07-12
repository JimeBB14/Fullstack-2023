const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const mongoose = require('mongoose');

// GET all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// POST a new blog
blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (exception) {
    res.status(400).json({ error: exception.message });
  }
});

// PUT to update a blog
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    res.json(updatedBlog);
  } catch (exception) {
    res.status(400).json({ error: exception.message });
  }
});

// GET a specific blog by ID
blogsRouter.get('/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).end();
      }
    } catch (exception) {
      if (exception.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
      }
      res.status(500).json({ error: 'Failed to fetch blog' });
    }
  });
  
  // DELETE a blog
  blogsRouter.delete('/:id', async (req, res) => {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (exception) {
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  });
  
  module.exports = blogsRouter;
