import React, { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, blogs, setBlogs }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id || blog.user : null, // Ensure the user ID is maintained
    };

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map(b => (b.id !== blog.id ? b : returnedBlog)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user ? blog.user.name : 'unknown user'}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
