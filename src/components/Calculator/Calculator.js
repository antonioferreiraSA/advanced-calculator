import React, { useState, useEffect, useRef } from 'react';
import './Calculator.scss';
import { formatDate } from '../../utils/helpers';

const Calculator = ({ moduleData }) => {
  const {
    calculator_title = 'Calculation title',
    first_number_label = 'First Number',
    second_number_label = 'Second Number',
    calculate_button_text = 'CALCULATE',
    clear_button_text = 'RESET VALUES',
    primary_color = { color: '#6B5DE3' },
    top_background_color = { color: '#544DB4' },
    bottom_background_color = { color: '#DEDCFF' },
  } = moduleData;

  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showConversion, setShowConversion] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [calculationHistory, setCalculationHistory] = useState(() => {
    // Load history from localStorage on component initialization
    const savedHistory = localStorage.getItem('calculatorHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [exchangeRate, setExchangeRate] = useState(1.25); // Default exchange rate
  const [exchangeRates, setExchangeRates] = useState({});
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [showOperationsDropdown, setShowOperationsDropdown] = useState(false);
  const [showFromCurrencyDropdown, setShowFromCurrencyDropdown] = useState(false);
  const [showToCurrencyDropdown, setShowToCurrencyDropdown] = useState(false);

  // API key for exchange rate API
  const API_KEY = '854e48c42aabb1638d766061';

  /**
   * Maps currency codes to their corresponding country codes for flag display
   * Most currencies use the ISO country code, with some exceptions (like EUR)
   */
  const CURRENCY_TO_COUNTRY_MAP = {
    // Major currencies
    'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CHF': 'ch',
    'AUD': 'au', 'CAD': 'ca', 'CNY': 'cn', 'HKD': 'hk', 'NZD': 'nz',
    
    // European currencies
    'SEK': 'se', 'NOK': 'no', 'DKK': 'dk', 'PLN': 'pl', 'HUF': 'hu',
    'CZK': 'cz', 'RON': 'ro',
    
    // Asian currencies
    'KRW': 'kr', 'SGD': 'sg', 'TWD': 'tw', 'THB': 'th', 'IDR': 'id',
    'PHP': 'ph', 'MYR': 'my', 'INR': 'in',
    
    // Middle Eastern currencies
    'ILS': 'il', 'AED': 'ae', 'SAR': 'sa',
    
    // American currencies
    'MXN': 'mx', 'BRL': 'br', 'CLP': 'cl', 'COP': 'co',
    
    // Other currencies
    'RUB': 'ru', 'ZAR': 'za', 'TRY': 'tr'
  };
  
  /**
   * Gets the flag URL for a given currency code
   * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR')
   * @returns {string} URL to the flag image
   */
  const getCurrencyFlag = (currencyCode) => {
    const countryCode = CURRENCY_TO_COUNTRY_MAP[currencyCode] || 'un';
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  // Reference for the operations dropdown
  const operationsDropdownRef = useRef(null);
  const fromCurrencyDropdownRef = useRef(null);
  const toCurrencyDropdownRef = useRef(null);

  // Set CSS variables for colors
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primary_color.color);
    document.documentElement.style.setProperty('--top-background-color', top_background_color.color);
    document.documentElement.style.setProperty('--bottom-background-color', bottom_background_color.color);
  }, [primary_color, top_background_color, bottom_background_color]);

  // Save calculation history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
  }, [calculationHistory]);

  // Fetch available currencies when component mounts
  useEffect(() => {
    fetchAvailableCurrencies();
  }, []);

  // Fetch exchange rates when currencies change
  useEffect(() => {
    if (showConversion && fromCurrency && toCurrency) {
      fetchExchangeRate(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency, showConversion]);

  /**
   * Fetches the exchange rate between two currencies
   * @param {string} baseCurrency - The source currency code
   * @param {string} targetCurrency - The target currency code
   * @returns {Promise<void>}
   */
  const fetchExchangeRate = async (baseCurrency, targetCurrency) => {
    // Same currency conversion is always 1:1
    if (baseCurrency === targetCurrency) {
      setExchangeRate(1);
      return;
    }

    setIsLoadingRates(true);
    
    try {
      const endpoint = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${baseCurrency}/${targetCurrency}`;
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();

      if (data.result === 'success') {
        setExchangeRate(data.conversion_rate);
      } else {
        console.error(`Exchange rate API error: ${data.error_type}`);
        setExchangeRate(null);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error.message);
      setExchangeRate(null);
    } finally {
      setIsLoadingRates(false);
    }
  };
  
  /**
   * Fetches available currencies from the Exchange Rate API
   * @returns {Promise<void>}
   */
  const fetchAvailableCurrencies = async () => {
    try {
      const endpoint = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();

      if (data.result === 'success') {
        // Extract available currencies from the response
        const currencies = Object.keys(data.conversion_rates);
        setAvailableCurrencies(currencies);
        setLastUpdated(new Date());
      } else {
        console.error(`Failed to fetch currencies: ${data.error_type}`);
      }
    } catch (error) {
      console.error('Failed to fetch available currencies:', error.message);
    }
  };

  // Handle clicking outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        operationsDropdownRef.current &&
        !operationsDropdownRef.current.contains(event.target)
      ) {
        setShowOperationsDropdown(false);
      }
      if (
        fromCurrencyDropdownRef.current &&
        !fromCurrencyDropdownRef.current.contains(event.target)
      ) {
        setShowFromCurrencyDropdown(false);
      }
      if (
        toCurrencyDropdownRef.current &&
        !toCurrencyDropdownRef.current.contains(event.target)
      ) {
        setShowToCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render operation icon with dropdown
  const renderOperationIcon = () => {
    return (
      <div
        className="operation-icon"
        onClick={() => setShowOperationsDropdown(!showOperationsDropdown)}
        ref={operationsDropdownRef}
      >
        {operation === '+'
          ? '+'
          : operation === '-'
          ? '−'
          : operation === '*'
          ? '×'
          : operation === '/'
          ? '÷'
          : operation}
        {showOperationsDropdown && (
          <div className="operations-dropdown">
            <div
              className="operation-item"
              onClick={() => {
                setOperation('+');
                setShowOperationsDropdown(false);
              }}
            >
              +
            </div>
            <div
              className="operation-item"
              onClick={() => {
                setOperation('-');
                setShowOperationsDropdown(false);
              }}
            >
              −
            </div>
            <div
              className="operation-item"
              onClick={() => {
                setOperation('*');
                setShowOperationsDropdown(false);
              }}
            >
              ×
            </div>
            <div
              className="operation-item"
              onClick={() => {
                setOperation('/');
                setShowOperationsDropdown(false);
              }}
            >
              ÷
            </div>
          </div>
        )}
      </div>
    );
  };

  // Validate input to allow only numbers
  const validateNumberInput = (value) => {
    return value === '' || /^-?\d*\.?\d*$/.test(value);
  };

  // Handle first number input change
  const handleFirstNumberChange = (e) => {
    const value = e.target.value;
    if (validateNumberInput(value)) {
      setFirstNumber(value);
    }
  };

  // Handle second number input change
  const handleSecondNumberChange = (e) => {
    const value = e.target.value;
    if (validateNumberInput(value)) {
      setSecondNumber(value);
    }
  };

  // Calculate result based on operation
  const calculateResult = () => {
    setError('');
    const num1 = parseFloat(firstNumber) || 0;
    const num2 = parseFloat(secondNumber) || 0;
    let calculatedResult;

    switch (operation) {
      case '+':
        calculatedResult = num1 + num2;
        break;
      case '-':
        calculatedResult = num1 - num2;
        break;
      case '*':
        calculatedResult = num1 * num2;
        break;
      case '/':
        if (num2 === 0) {
          setError('Cannot divide by zero');
          return;
        } else {
          calculatedResult = num1 / num2;
        }
        break;
      default:
        return;
    }

    setResult(calculatedResult);

    // Add to calculation history
    const newHistoryItem = {
      firstNumber: num1,
      secondNumber: num2,
      operation,
      result: calculatedResult,
      fromCurrency: showConversion ? fromCurrency : null,
      toCurrency: showConversion ? toCurrency : null,
      convertedResult: showConversion ? calculatedResult * exchangeRate : null,
      timestamp: new Date(),
    };

    setCalculationHistory([newHistoryItem, ...calculationHistory]);
  };

  // Reset all values
  const handleReset = () => {
    setFirstNumber('');
    setSecondNumber('');
    setOperation('+');
    setResult(null);
    setError('');
  };

  // Clear history
  const clearHistory = () => {
    setCalculationHistory([]);
  };

  // Copy calculation to clipboard
  const copyCalculation = (item) => {
    const calculationText = `${item.firstNumber} ${item.operation} ${item.secondNumber} = ${item.result}`;
    const conversionText = item.convertedResult 
      ? ` (${item.result} ${item.fromCurrency} = ${item.convertedResult.toFixed(2)} ${item.toCurrency})`
      : '';
    const fullText = calculationText + conversionText;
    
    navigator.clipboard.writeText(fullText).then(() => {
      // You could add a toast notification here if needed
      console.log('Calculation copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Delete individual history item
  const deleteHistoryItem = (indexToDelete) => {
    setCalculationHistory(calculationHistory.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-header">
        <h1 className="calculator-main-title">Advanced Calculator</h1>
        <p className="calculator-subtitle">
          Last Updated: {formatDate(lastUpdated)}
        </p>
      </div>

      <div className="calculator-container">
        <div className="calculator-left">
          <div className="calculator-card">
            <h2 className="calculator-title">{calculator_title}</h2>

            <div className="input-group">
              <label htmlFor="firstNumber">{first_number_label}</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="firstNumber"
                  value={firstNumber}
                  onChange={handleFirstNumberChange}
                  placeholder="First number..."
                  className={error && !firstNumber ? 'error' : ''}
                />
                <span className="info-icon">i</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="secondNumber">{second_number_label}</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="secondNumber"
                  value={secondNumber}
                  onChange={handleSecondNumberChange}
                  placeholder="Second number..."
                  className={error && !secondNumber ? 'error' : ''}
                />
                <span className="info-icon">i</span>
              </div>
            </div>

            {renderOperationIcon()}

            <hr className="divider" />

            <div className="toggle-group">
              <span className="toggle-label">Add conversion?</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showConversion}
                  onChange={() => setShowConversion(!showConversion)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {showConversion && (
              <div className="currency-section">
                <div className="currency-row">
                  <div className="currency-column">
                    <label>Start Currency</label>
                    <div
                      className="currency-selector"
                      ref={fromCurrencyDropdownRef}
                    >
                      <div
                        className="currency-selected"
                        onClick={() =>
                          !isLoadingRates &&
                          setShowFromCurrencyDropdown(!showFromCurrencyDropdown)
                        }
                      >
                        <div className="currency-flag">
                          <img
                            src={getCurrencyFlag(fromCurrency)}
                            alt={fromCurrency}
                          />
                        </div>
                        <div className="currency-name">{fromCurrency}</div>
                        <div className="dropdown-arrow">
                          {showFromCurrencyDropdown ? '▲' : '▼'}
                        </div>
                      </div>

                      {showFromCurrencyDropdown && (
                        <div className="currency-dropdown">
                          {availableCurrencies.length > 0
                            ? availableCurrencies.map((currency) => (
                                <div
                                  key={currency}
                                  className={`currency-option ${
                                    currency === fromCurrency ? 'selected' : ''
                                  }`}
                                  onClick={() => {
                                    setFromCurrency(currency);
                                    setShowFromCurrencyDropdown(false);
                                  }}
                                >
                                  <div className="currency-flag">
                                    <img src={getCurrencyFlag(currency)} alt={currency} />
                                  </div>
                                  <div className="currency-name">
                                    {currency}
                                  </div>
                                </div>
                              ))
                            : // Fallback options if API hasn't loaded yet
                              ['GBP', 'USD', 'EUR', 'JPY'].map((currency) => (
                                <div
                                  key={currency}
                                  className={`currency-option ${
                                    currency === fromCurrency ? 'selected' : ''
                                  }`}
                                  onClick={() => {
                                    setFromCurrency(currency);
                                    setShowFromCurrencyDropdown(false);
                                  }}
                                >
                                  <div className="currency-flag">
                                    <img src={getCurrencyFlag(currency)} alt={currency} />
                                  </div>
                                  <div className="currency-name">
                                    {currency}
                                  </div>
                                </div>
                              ))}
                        </div>
                      )}
                      {isLoadingRates && (
                        <span className="loading-indicator">⟳</span>
                      )}
                    </div>
                  </div>

                  <div className="currency-arrow">→</div>

                  <div className="currency-column">
                    <label>Destination Currency</label>
                    <div
                      className="currency-selector"
                      ref={toCurrencyDropdownRef}
                    >
                      <div
                        className="currency-selected"
                        onClick={() =>
                          !isLoadingRates &&
                          setShowToCurrencyDropdown(!showToCurrencyDropdown)
                        }
                      >
                        <div className="currency-flag">
                          <img
                            src={getCurrencyFlag(toCurrency)}
                            alt={toCurrency}
                          />
                        </div>
                        <div className="currency-name">{toCurrency}</div>
                        <div className="dropdown-arrow">
                          {showToCurrencyDropdown ? '▲' : '▼'}
                        </div>
                      </div>

                      {showToCurrencyDropdown && (
                        <div className="currency-dropdown">
                          {availableCurrencies.length > 0
                            ? availableCurrencies.map((currency) => (
                                <div
                                  key={currency}
                                  className={`currency-option ${
                                    currency === toCurrency ? 'selected' : ''
                                  }`}
                                  onClick={() => {
                                    setToCurrency(currency);
                                    setShowToCurrencyDropdown(false);
                                  }}
                                >
                                  <div className="currency-flag">
                                    <img src={getCurrencyFlag(currency)} alt={currency} />
                                  </div>
                                  <div className="currency-name">
                                    {currency}
                                  </div>
                                </div>
                              ))
                            : // Fallback options if API hasn't loaded yet
                              ['USD', 'GBP', 'EUR', 'JPY'].map((currency) => (
                                <div
                                  key={currency}
                                  className={`currency-option ${
                                    currency === toCurrency ? 'selected' : ''
                                  }`}
                                  onClick={() => {
                                    setToCurrency(currency);
                                    setShowToCurrencyDropdown(false);
                                  }}
                                >
                                  <div className="currency-flag">
                                    <img src={getCurrencyFlag(currency)} alt={currency} />
                                  </div>
                                  <div className="currency-name">
                                    {currency}
                                  </div>
                                </div>
                              ))}
                        </div>
                      )}
                      {isLoadingRates && (
                        <span className="loading-indicator">⟳</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="button-group">
              <button className="btn btn-primary" onClick={calculateResult}>
                {calculate_button_text}
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                {clear_button_text}
              </button>
            </div>
          </div>
        </div>

        <div className="calculator-right">
          {result !== null && (
            <div className="result-card">
              <div className="result-row">
                <div className="result-value">{firstNumber}</div>
                <div className="result-operation">{operation}</div>
                <div className="result-value">{secondNumber}</div>
              </div>

              <div className="result-row">
                <div className="result-final">
                  {typeof result === 'number' && result > 999999
                    ? result.toLocaleString()
                    : result}
                </div>
                <div className="result-currency">
                  <div className="currency-flag result-flag">
                    <img src={getCurrencyFlag(fromCurrency)} alt={fromCurrency} />
                  </div>
                  <span className="currency-code">{fromCurrency}</span>
                </div>

                {showConversion && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="result-final">
                      {typeof result === 'number'
                        ? (result * exchangeRate).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : 0}
                    </div>
                    <div className="result-currency">
                      <div className="currency-flag result-flag">
                        <img src={getCurrencyFlag(toCurrency)} alt={toCurrency} />
                      </div>
                      <span className="currency-code">{toCurrency}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="history-card">
            <div className="history-header">
              <h3>Calculation History</h3>
              <button className="clear-history" onClick={clearHistory}>
                CLEAR HISTORY
              </button>
            </div>

            {calculationHistory.length === 0 ? (
              <p className="history-empty">
                Press CALCULATE to start saving your results
              </p>
            ) : (
              <div className="history-list">
                {calculationHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-calculation">
                      {item.firstNumber} {item.operation} {item.secondNumber} ={' '}
                      {item.result}
                    </div>
                    {item.convertedResult && (
                      <div className="history-conversion">
                        <span className="from-amount">{item.result}</span>
                        <img 
                          src={getCurrencyFlag(item.fromCurrency)} 
                          alt={item.fromCurrency}
                          className="currency-flag"
                        />
                        <span>{item.fromCurrency}</span>
                        <span>=</span>
                        <span className="to-amount">{item.convertedResult.toFixed(2)}</span>
                        <img 
                          src={getCurrencyFlag(item.toCurrency)} 
                          alt={item.toCurrency}
                          className="currency-flag"
                        />
                        <span>{item.toCurrency}</span>
                      </div>
                    )}
                    <div className="history-actions">
                      <button 
                        className="history-action-btn delete-btn"
                        onClick={() => deleteHistoryItem(index)}
                        title="Delete this calculation"
                      >
                        ✕ DELETE
                      </button>
                      <button 
                        className="history-action-btn copy-btn"
                        onClick={() => copyCalculation(item)}
                        title="Copy calculation to clipboard"
                      >
                        📋 COPY
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

