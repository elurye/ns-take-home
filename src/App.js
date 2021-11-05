import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

function App() {
  const [data, setData] = useState({ rates: [] });
  const [addCoin, setAddCoin] = useState(false);
  const [trackedRates, setTrackedRates] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api.coinbase.com/v2/exchange-rates',
      );

      setData(result.data.data);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Crypto Tracker
        </p>
      </header>
      <section className="App-body">
        <Autocomplete
          options={ Object.keys(data?.rates).filter(rate => !Object.keys(trackedRates).includes(rate)) }
          className="coin-search"
          onChange={(event, newValue) => {
            setAddCoin(newValue);
          }}
          inputValue={(addCoin && !trackedRates[addCoin]) ? addCoin : ''}
          renderInput={(params) =>
            <div>
              <TextField {...params} className="coin-search-input" label="Search crypto coins" variant="outlined" />
              <Button
                variant="contained"
                className="coin-search-btn"
                color="primary" size="large"
                disabled={ !addCoin }
                onClick={ () => {
                  console.log(addCoin);
                  trackedRates[addCoin] = data.rates[addCoin];
                  setTrackedRates(trackedRates);
                  setAddCoin('');
                } } >
                Add Coin Tracking
              </Button>
            </div>
          }
        />
        <div className="row header">
          <div className="coin-identification">Coin</div>
          <div className="coin-price">Price</div>
        </div>
        { Object.entries(trackedRates).map(([key, value], index) => (
          <div className="row" key={ value + index }>
            <div className="coin-identification">
              <span className="count-count">{ (index+1) }</span>
              <span>{ key }</span>
            </div>
            <div className="coin-price">{ '$' + parseFloat(value).toFixed(2) }</div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
