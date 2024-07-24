import React, { useState, useEffect } from 'react';
import loginService from './services/login';
import blogService from './services/blogs';
import Blog from './components/Blog';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setNotification({ message: `Welcome ${user.name}`, type: 'success' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 'error' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    setNotification({ message: 'Logged out successfully', type: 'success' });
    setTimeout(() => setNotification({ message: null, type: '' }), 5000);
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      };
      const savedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedBlog));
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      setNotification({ message: `A new blog ${savedBlog.title} by ${savedBlog.author} added`, type: 'success' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    } catch (exception) {
      setNotification({ message: 'Failed to add blog', type: 'error' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    }
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title
        <input
          type="text"
          value={newTitle}
          name="Title"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={newAuthor}
          name="Author"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={newUrl}
          name="Url"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return (
    <div>
      <h1>Blog List</h1>
      <Notification message={notification.message} type={notification.type} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogList()}
        </div>
      }
    </div>
  );
};

export default App;
