import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import AutoComplete from './components/AutoComplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({ rates: [] });
  const [addCoin, setAddCoin] = useState(false);
  const [trackedRates, setTrackedRates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const isMounted = useRef(null);

  useEffect(() => {
    isMounted.current = true;

    function fetchData() {
      axios.get(
        'https://api.coinbase.com/v2/currencies',
      ).then(result => {
        const options = result.data.data.map((item) => {
          return {label: item.name, id: item.id};
        });
        setCurrencies(options);
      }).catch(err => {
        console.log(err);
        setIsError(true);
      }).finally(() => {
        if (isMounted.current) {
          setIsLoading(false)
        }
      });
    }
    fetchData();

    return () => {
      // cancel subscription to useEffect
      isMounted.current = false;   // clean up function
    };
  }, []);

  useEffect(() => {
    function getRates() {
      axios.get(
        'https://api.coinbase.com/v2/exchange-rates',
      ).then(result => {
        setRates(result.data.data.rates);
      }).catch(err => {
        console.log(err);
        setIsError(true);
      });
    }
    getRates();
  }, ['currencies']);

  if (isLoading || isError) {
    return <div className="App"><CircularProgress /></div>
  }

  return (
    <div className="App">
      <div className="App-header">
        <p>
          Crypto Tracker
        </p>
      </div>
      <section className="App-body">
        <form className="coin-search">
          <AutoComplete
            options={ currencies }
            trackedRates={ trackedRates }
            setAddCoin={ setAddCoin } />
          <Button
            variant="contained"
            className="coin-search-btn"
            color="primary" size="large"
            disabled={ !addCoin }
            type={"submit"}
            onClick={ async () => {
              addCoin.price = rates[addCoin.id];
              addCoin.time = new Date(Date.now())
              trackedRates.push(addCoin);
              setTrackedRates(trackedRates);
              setAddCoin('');
            }}>
            Add Tracking
          </Button>
        </form>

        <div className="row header">
          <div className="coin-identification">Currency</div>
          <div className="coin-price">Price</div>
          <div className="coin-price-date">Last Updated</div>
        </div>
        { trackedRates.map((item, index) => (
          <div className="row" key={ item.id + index }>
            <div className="coin-identification">
              <span className="coin-count">{ (index+1) }</span>
              <span>{ item.label + ' (' + item.id + ')' }</span>
            </div>
            <div className="coin-price">{ '$' + parseFloat(item.price).toFixed(2) }</div>
            <div className="coin-price-date">{ `${item.time.toDateString()} ${item.time.toLocaleTimeString()}` }</div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
