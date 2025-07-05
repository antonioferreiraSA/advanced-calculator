import React, { useState, useEffect } from 'react';

const CurrencyConverter = ({ moduleData }) => {
  const {
    amount_label = 'Amount',
    from_currency_label = 'From',
    to_currency_label = 'To',
    convert_button_text = 'Convert'
  } = moduleData;

  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currencies, setCurrencies] = useState([]);

  // Fetch available currencies on component mount
  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Fetch available currencies from API
  const fetchCurrencies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      
      if (data.result === 'success') {
        const currencyList = Object.keys(data.rates).map(code => ({
          code,
          name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) || code
        }));
        
        setCurrencies(currencyList);
        setLastUpdated(new Date(data.time_last_update_utc));
      } else {
        setError('Failed to fetch currencies');
      }
    } catch (err) {
      setError('Error fetching currencies: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate amount input to allow only numbers
  const validateAmountInput = (value) => {
    return value === '' || /^\d*\.?\d*$/.test(value);
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (validateAmountInput(value)) {
      setAmount(value);
    }
  };

  // Convert currency using API
  const convertCurrency = async () => {
    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await response.json();
      
      if (data.result === 'success') {
        const rate = data.rates[toCurrency];
        if (rate) {
          const result = parseFloat(amount) * rate;
          setConvertedAmount(result);
          setExchangeRate(rate);
          setLastUpdated(new Date(data.time_last_update_utc));
        } else {
          setError(`Exchange rate not found for ${toCurrency}`);
        }
      } else {
        setError('Failed to fetch exchange rates');
      }
    } catch (err) {
      setError('Error converting currency: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="currency-converter">
      <div className="input-group">
        <label htmlFor="amount">{amount_label}</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className={error && !amount ? 'error' : ''}
        />
      </div>

      <div className="input-group">
        <label htmlFor="fromCurrency">{from_currency_label}</label>
        <select
          id="fromCurrency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="toCurrency">{to_currency_label}</label>
        <select
          id="toCurrency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-container">{error}</div>}

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={convertCurrency}
          disabled={!amount || isLoading}
        >
          {isLoading ? 'Converting...' : convert_button_text}
        </button>
      </div>

      {convertedAmount !== null && !error && (
        <div className="result-container">
          <div className="result-label">Converted Amount:</div>
          <div className="result-value">
            {convertedAmount.toFixed(2)} {toCurrency}
          </div>
          {exchangeRate && (
            <div className="exchange-rate">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </div>
          )}
          {lastUpdated && (
            <div className="timestamp">
              Last updated: {formatDate(lastUpdated)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
