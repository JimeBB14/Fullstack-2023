import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const dispatch = useDispatch()

  const { data: anecdotes, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: () => fetch('http://localhost:3001/anecdotes').then(res => res.json()),
    onSuccess: (data) => {
      dispatch(initializeAnecdotes(data))
    },
    retry: 1
  })

  useEffect(() => {
    if (anecdotes) {
      dispatch(initializeAnecdotes(anecdotes))
    }
  }, [anecdotes, dispatch])

  if (isLoading) {
    return <div>Loading data...</div>
  }

  if (error) {
    return <div>Anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App