import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let user
  let mockHandler

  beforeEach(() => {
    blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      user: {
        username: 'testuser',
        name: 'Test User',
      },
    }

    user = {
      username: 'testuser',
      name: 'Test User',
    }

    mockHandler = vi.fn()
  })

  test('renders title and author, but does not render URL or likes by default', () => {
    const { container } = render(<Blog blog={blog} blogs={[]} setBlogs={() => {}} user={user} />)

    const titleAuthorElement = screen.getByText('Test Blog Title Test Author')
    expect(titleAuthorElement).toBeDefined()

    const urlElement = container.querySelector('.blogDetails')
    expect(urlElement).toBeNull()

    const likesElement = container.querySelector('.blogDetails')
    expect(likesElement).toBeNull()
  })

  test('renders URL and number of likes when the view button is clicked', async () => {
    const { container } = render(<Blog blog={blog} blogs={[]} setBlogs={() => {}} user={user} />)

    const userEventInstance = userEvent.setup()
    const button = screen.getByText('view')
    await userEventInstance.click(button)

    const urlElement = screen.getByText('http://testblog.com')
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText('likes 5')
    expect(likesElement).toBeDefined()
  })

  test('calls event handler twice if like button is clicked twice', async () => {
    render(<Blog blog={blog} blogs={[]} setBlogs={() => {}} user={user} onLike={mockHandler} />)

    const userEventInstance = userEvent.setup()
    const viewButton = screen.getByText('view')
    await userEventInstance.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEventInstance.click(likeButton)
    await userEventInstance.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
