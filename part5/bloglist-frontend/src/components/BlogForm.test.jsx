import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText(/title:/i)
  const authorInput = screen.getByLabelText(/author:/i)
  const urlInput = screen.getByLabelText(/url:/i)
  const createButton = screen.getByText('create')

  await userEvent.type(titleInput, 'Testing Title')
  await userEvent.type(authorInput, 'Testing Author')
  await userEvent.type(urlInput, 'http://testing.com')
  await userEvent.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing Title',
    author: 'Testing Author',
    url: 'http://testing.com'
  })
})
