import React, { useState } from 'react'
import { useField } from './hooks/useField'
import useResource from './hooks/useResource'
import useCountry from './hooks/useCountry'

const Country = ({ country }) => {
  if (!country) {
    return <div>not found...</div>
  }

  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} height="100" />
    </div>
  )
}

const App = () => {
  const [name, setName] = useState('')
  const { country, found } = useCountry(name)
  const content = useField('text')
  const personName = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: personName.value, number: number.value })
  }

  const fetchCountry = (e) => {
    e.preventDefault()
    setName(e.target.name.value)
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...personName} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}

      <h2>Find Country</h2>
      <form onSubmit={fetchCountry}>
        <input name="name" />
        <button>find</button>
      </form>
      <Country country={found ? country : null} />
    </div>
  )
}

export default App
