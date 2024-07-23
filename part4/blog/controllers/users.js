const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
    res.json(users)
  })
  

  usersRouter.post('/', async (request, response, next) => {
    try {
      const { username, name, password } = request.body;
  
      if (!username || username.length < 3 || !password || password.length < 3) {
        return response.status(400).json({ error: 'username and password must be at least 3 characters long' });
      }
  
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      const user = new User({
        username,
        name,
        passwordHash,
      });
  
      const savedUser = await user.save();
      response.status(201).json(savedUser);
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: 'expected `username` to be unique' });
      }
      next(error);
    }
  });
  

module.exports = usersRouter;
