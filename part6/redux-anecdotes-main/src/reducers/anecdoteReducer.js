import { createSlice } from '@reduxjs/toolkit'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../services/anecdotes'
import { showNotification } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    modifyAnecdote(state, action) {
      const changedAnecdote = action.payload
      return state.map(anecdote => 
        anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote
      )
    }
  }
})

export const { setAnecdotes, appendAnecdote, modifyAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = anecdotes => {
  return async dispatch => {
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createNewAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await createAnecdote(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(showNotification(`Anecdote '${content}' created!`, 5))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await updateAnecdote({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch(modifyAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer