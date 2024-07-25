import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (!filter) return anecdotes
    return anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(showNotification(`You voted '${anecdote.content}'`, 5))
  }

  const sortedAnecdotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList