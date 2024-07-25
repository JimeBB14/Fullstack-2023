import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../services/anecdotes'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch(showNotification(`Anecdote '${newAnecdote.content}' created!`, 5))
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      alert('Anecdote content must be at least 5 characters long')
      return
    }
    newAnecdoteMutation.mutate({ content, votes: 0 })
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
