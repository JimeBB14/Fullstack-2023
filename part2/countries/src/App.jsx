import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetail from './components/CountryDetail';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (search) {
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
          );
          setCountries(filteredCountries);
        });
    } else {
      setCountries([]);
    }
  }, [search]);

  return (
    <div>
      <h3>Find countries</h3>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find countries"
      />
      {countries.length > 10 && <p>Too many matches, specify another filter</p>}
      {countries.length <= 10 && countries.length > 1 &&
        countries.map(country => (
          <div key={country.cca3}>
            {country.name.common}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </div>
        ))
      }
      {countries.length === 1 && <CountryDetail country={countries[0]} />}
      {selectedCountry && <CountryDetail country={selectedCountry} />}
    </div>
  );
};

export default App;
