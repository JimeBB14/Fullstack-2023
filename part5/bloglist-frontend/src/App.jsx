import React, { useState, useEffect, useRef } from 'react';
import loginService from './services/login';
import blogService from './services/blogs';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: '' });

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    });
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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then(returnedBlog => {
      const newBlogs = blogs.concat(returnedBlog);
      const sortedBlogs = newBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
      setNotification({ message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    }).catch(exception => {
      setNotification({ message: 'Failed to add blog', type: 'error' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    });
  };

  return (
    <div>
      <h1>Blog List</h1>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <div>
            <h2>blogs</h2>
            {blogs.map(blog => (
              <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
