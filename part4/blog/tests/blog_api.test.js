const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const api = supertest(app);

jest.setTimeout(300000); 

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);

  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log('GET /api/blogs response:', response.body);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`);
    const titles = response.body.map(r => r.title);
    expect(titles).toContain('React patterns');
  });
});

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    console.log('Blogs in DB at Start:', blogsAtStart);
    console.log('Blog ID to View:', blogToView.id);

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log('Result Blog:', resultBlog.body);

    expect(resultBlog.body).toEqual(JSON.parse(JSON.stringify(blogToView)));
  });

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 'thisisinvalidid12345';

    await api
      .get(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

describe('addition of a new blog', () => {
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    console.log('POST /api/blogs response:', response.body);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(n => n.title);
    expect(titles).toContain('async/await simplifies making async calls');
  });

  test('fails with status code 400 if data is invalid', async () => {
    const newBlog = {
      author: 'John Doe',
      likes: 5,
    };

    console.log('New Blog Data:', newBlog);

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    console.log('Blogs at End:', blogsAtEnd);
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and user is creator', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('updating a blog', () => {
  test('succeeds in updating likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const updatedBlogFromDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
    expect(updatedBlogFromDb.likes).toBe(blogToUpdate.likes + 1);
  });

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
