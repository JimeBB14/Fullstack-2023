import React, { useState, useEffect } from 'react';
import personService from './services/persons';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const handleAddOrUpdatePerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      personService
        .update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
          setNotificationMessage(`Updated ${returnedPerson.name}`);
        })
        .catch(error => {
          setErrorMessage(`Error updating ${personObject.name}: ${error.response.data.error}`);
        });
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotificationMessage(`Added ${returnedPerson.name}`);
        })
        .catch(error => {
          setErrorMessage(`Error adding ${personObject.name}: ${error.response.data.error}`);
        });
    }
  };

  const handleDeletePerson = id => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setNotificationMessage(`Deleted ${person.name}`);
        })
        .catch(error => {
          setErrorMessage(`Error deleting ${person.name}`);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      {notificationMessage && <Notification message={notificationMessage} />}
      {errorMessage && <Notification message={errorMessage} type="error" />}
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleAddOrUpdatePerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
