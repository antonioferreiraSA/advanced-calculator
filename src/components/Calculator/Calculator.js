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
const [errors, setErrors] = useState({
  firstNumber: '',
  secondNumber: '',
  general: ''
});
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
  'CZK': 'cz', 'RON': 'ro', 'BGN': 'bg', 'ISK': 'is', 'HRK': 'hr',
  
  // Asian currencies
  'KRW': 'kr', 'SGD': 'sg', 'TWD': 'tw', 'THB': 'th', 'IDR': 'id',
  'PHP': 'ph', 'MYR': 'my', 'INR': 'in', 'VND': 'vn', 'BDT': 'bd',
  'PKR': 'pk', 'NPR': 'np', 'LKR': 'lk', 'MMK': 'mm',
  
  // Middle Eastern & African currencies
  'ILS': 'il', 'AED': 'ae', 'SAR': 'sa', 'QAR': 'qa', 'OMR': 'om',
  'KWD': 'kw', 'BHD': 'bh', 'JOD': 'jo', 'EGP': 'eg', 'MAD': 'ma',
  'TND': 'tn', 'NGN': 'ng', 'KES': 'ke', 'GHS': 'gh', 'ZAR': 'za',
  
  // American currencies
  'MXN': 'mx', 'BRL': 'br', 'CLP': 'cl', 'COP': 'co', 'ARS': 'ar',
  'PEN': 'pe', 'UYU': 'uy', 'BOB': 'bo', 'VES': 've', 'PYG': 'py',
  'GTQ': 'gt', 'DOP': 'do', 'CRC': 'cr', 'PAB': 'pa', 'JMD': 'jm',
  'TTD': 'tt', 'BBD': 'bb', 'BSD': 'bs', 'AWG': 'aw',
  
  // Other currencies
  'RUB': 'ru', 'TRY': 'tr', 'UAH': 'ua', 'KZT': 'kz', 'GEL': 'ge',
  'AMD': 'am', 'AZN': 'az', 'UZS': 'uz', 'FJD': 'fj', 'XCD': 'ag',
  'MUR': 'mu', 'SCR': 'sc', 'MGA': 'mg', 'MZN': 'mz', 'SZL': 'sz',
  'MWK': 'mw', 'GMD': 'gm', 'CVE': 'cv', 'SLL': 'sl', 'HTG': 'ht'
};

/**
 * Gets the flag URL for a given currency code
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns {string} URL to the flag image
 */
const getCurrencyFlag = (currencyCode) => {
  // Special cases for currencies that need specific handling
  if (currencyCode === 'XAF') return 'https://flagcdn.com/w40/cm.png'; // Central African CFA franc - using Cameroon
  if (currencyCode === 'XOF') return 'https://flagcdn.com/w40/sn.png'; // West African CFA franc - using Senegal
  if (currencyCode === 'XPF') return 'https://flagcdn.com/w40/pf.png'; // CFP franc - using French Polynesia
  if (currencyCode === 'XCD') return 'https://flagcdn.com/w40/ag.png'; // East Caribbean dollar - using Antigua and Barbuda
  
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
      
      // Store the exchange rate in the exchangeRates object
      setExchangeRates(prevRates => ({
        ...prevRates,
        [baseCurrency]: {
          ...(prevRates[baseCurrency] || {}),
          [targetCurrency]: data.conversion_rate
        }
      }));
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
    <div className="operation-container">
      <div className="operation-text-container">
        <span className="operation-text">
          {operation === '+' ? 'ADDITION' : 
           operation === '-' ? 'SUBTRACTION' : 
           operation === '*' ? 'MULTIPLICATION' : 
           operation === '/' ? 'DIVISION' : ''}
        </span>
      </div>
      <div className="operation-icon"
        onClick={() => setShowOperationsDropdown(!showOperationsDropdown)}
        ref={operationsDropdownRef}
      >
      {operation === '+' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="36" viewBox="0 0 35 36" fill="none">
          <rect x="15" y="1.125" width="5" height="33.75" rx="2.5" fill="#544DB4"/>
          <rect x="34.375" y="15.5" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15.5)" fill="#544DB4"/>
        </svg>
      ) : operation === '-' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
          <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#544DB4"/>
        </svg>
      ) : operation === '*' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
          <rect x="30.9197" y="0.544739" width="5" height="42.9567" rx="2.5" transform="rotate(45 30.9197 0.544739)" fill="#544DB4"/>
          <rect x="34.4553" y="30.9197" width="5" height="42.9567" rx="2.5" transform="rotate(135 34.4553 30.9197)" fill="#544DB4"/>
        </svg>
      ) : operation === '/' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
          <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#544DB4"/>
          <rect x="20" y="4" width="5" height="5" rx="2.5" transform="rotate(90 20 4)" fill="#544DB4"/>
          <rect x="20" y="26" width="5" height="5" rx="2.5" transform="rotate(90 20 26)" fill="#544DB4"/>
        </svg>
      ) : operation}
      {showOperationsDropdown && (
        <div className="operations-dropdown">
          <div
            className="operation-item"
            onClick={() => {
              setOperation('+');
              setShowOperationsDropdown(false);
            }}
          >
            <span className="operation-text">ADDITION</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 36" fill="none">
              <rect x="15" y="1.125" width="5" height="33.75" rx="2.5" fill="#544DB4"/>
              <rect x="34.375" y="15.5" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15.5)" fill="#544DB4"/>
            </svg>
          </div>
          <div
            className="operation-item"
            onClick={() => {
              setOperation('-');
              setShowOperationsDropdown(false);
            }}
          >
            <span className="operation-text">SUBTRACTION</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
              <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#544DB4"/>
            </svg>
          </div>
          <div
            className="operation-item"
            onClick={() => {
              setOperation('*');
              setShowOperationsDropdown(false);
            }}
          >
            <span className="operation-text">MULTIPLICATION</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
              <rect x="30.9197" y="0.544739" width="5" height="42.9567" rx="2.5" transform="rotate(45 30.9197 0.544739)" fill="#544DB4"/>
              <rect x="34.4553" y="30.9197" width="5" height="42.9567" rx="2.5" transform="rotate(135 34.4553 30.9197)" fill="#544DB4"/>
            </svg>
          </div>
          <div
            className="operation-item"
            onClick={() => {
              setOperation('/');
              setShowOperationsDropdown(false);
            }}
          >
            <span className="operation-text">DIVISION</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
              <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#544DB4"/>
              <rect x="20" y="4" width="5" height="5" rx="2.5" transform="rotate(90 20 4)" fill="#544DB4"/>
              <rect x="20" y="26" width="5" height="5" rx="2.5" transform="rotate(90 20 26)" fill="#544DB4"/>
            </svg>
          </div>
        </div>
      )}
      </div>
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

// Validate form inputs
const validateInputs = () => {
  const newErrors = {
    firstNumber: '',
    secondNumber: '',
    general: '',
    fromCurrency: '',
    toCurrency: ''
  };
  
  let isValid = true;
  
  if (!firstNumber.trim()) {
    newErrors.firstNumber = 'First number is required';
    isValid = false;
  } else if (isNaN(parseFloat(firstNumber))) {
    newErrors.firstNumber = 'Please enter a valid number';
    isValid = false;
  }
  
  if (!secondNumber.trim()) {
    newErrors.secondNumber = 'Second number is required';
    isValid = false;
  } else if (isNaN(parseFloat(secondNumber))) {
    newErrors.secondNumber = 'Please enter a valid number';
    isValid = false;
  }
  
  if (operation === '/' && parseFloat(secondNumber) === 0) {
    newErrors.secondNumber = 'Cannot divide by zero';
    isValid = false;
  }
  
  if (showConversion) {
    if (!fromCurrency) {
      newErrors.fromCurrency = 'Start currency is required';
      isValid = false;
    }
    
    if (!toCurrency) {
      newErrors.toCurrency = 'Destination currency is required';
      isValid = false;
    }
    
    if (fromCurrency === toCurrency && fromCurrency) {
      newErrors.general = 'Start and destination currencies must be different';
      isValid = false;
    }
    
    // We don't need to check for exchange rates availability here
    // The fetchExchangeRate function will handle any API errors
    // and the exchange rate is set directly in the state
  }
  
  setErrors(newErrors);
  return isValid;
};

// Calculate result based on operation
const calculateResult = () => {
  setError('');
  setErrors({
    firstNumber: '',
    secondNumber: '',
    general: '',
    fromCurrency: '',
    toCurrency: ''
  });
  
  if (!validateInputs()) {
    return;
  }
  
  const num1 = parseFloat(firstNumber);
  const num2 = parseFloat(secondNumber);
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
      calculatedResult = num1 / num2;
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
  setErrors({
    firstNumber: '',
    secondNumber: '',
    general: '',
    fromCurrency: '',
    toCurrency: ''
  });
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

          <div className="inputs-operation-container">
            <div className="inputs-column">
              <div className="input-group">
                <div className="label-with-icon">
                  <label htmlFor="firstNumber">{first_number_label}</label>
                  <span className="info-icon" title="please typing in a number">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none" title="please typing in a number">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0 9.89154C0 4.70474 4.20474 0.5 9.39154 0.5C14.5783 0.5 18.7831 4.70474 18.7831 9.89154C18.7831 15.0783 14.5783 19.2831 9.39154 19.2831C4.20474 19.2831 0 15.0783 0 9.89154ZM9.39638 13.4764C8.99882 13.4764 8.67654 13.1541 8.67654 12.7566V9.78121C8.67654 9.38365 8.99882 9.06137 9.39638 9.06137C9.79394 9.06137 10.1162 9.38365 10.1162 9.78121V12.7758C10.1009 13.1636 9.78453 13.4716 9.39638 13.4764ZM8.67654 7.45845C8.67654 7.85601 8.99882 8.17829 9.39638 8.17829C9.78453 8.17349 10.1009 7.86553 10.1162 7.47765V7.12252C10.1162 6.72497 9.79394 6.40268 9.39638 6.40268C8.99882 6.40268 8.67654 6.72497 8.67654 7.12252V7.45845Z" fill="#DEDCFF"/>
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  id="firstNumber"
                  value={firstNumber}
                  onChange={handleFirstNumberChange}
                  placeholder="First number..."
                  className={errors.firstNumber ? 'error' : ''}
                />
                {errors.firstNumber && (
                  <div className="error-message">{errors.firstNumber}</div>
                )}
              </div>

              <div className="input-group">
                <div className="label-with-icon">
                  <label htmlFor="secondNumber">{second_number_label}</label>
                  <span className="info-icon" title="please typing in a number">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none" title="please typing in a number">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0 9.89154C0 4.70474 4.20474 0.5 9.39154 0.5C14.5783 0.5 18.7831 4.70474 18.7831 9.89154C18.7831 15.0783 14.5783 19.2831 9.39154 19.2831C4.20474 19.2831 0 15.0783 0 9.89154ZM9.39638 13.4764C8.99882 13.4764 8.67654 13.1541 8.67654 12.7566V9.78121C8.67654 9.38365 8.99882 9.06137 9.39638 9.06137C9.79394 9.06137 10.1162 9.38365 10.1162 9.78121V12.7758C10.1009 13.1636 9.78453 13.4716 9.39638 13.4764ZM8.67654 7.45845C8.67654 7.85601 8.99882 8.17829 9.39638 8.17829C9.78453 8.17349 10.1009 7.86553 10.1162 7.47765V7.12252C10.1162 6.72497 9.79394 6.40268 9.39638 6.40268C8.99882 6.40268 8.67654 6.72497 8.67654 7.12252V7.45845Z" fill="#DEDCFF"/>
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  id="secondNumber"
                  value={secondNumber}
                  onChange={handleSecondNumberChange}
                  placeholder="Second number..."
                  className={errors.secondNumber ? 'error' : ''}
                />
                {errors.secondNumber && (
                  <div className="error-message">{errors.secondNumber}</div>
                )}
              </div>
            </div>
            
            <div className="operation-column">
              {renderOperationIcon()}
            </div>
          </div>

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
                  {errors.fromCurrency && (
                    <div className="error-message">{errors.fromCurrency}</div>
                  )}
                  <div
                    className="currency-selector"
                    ref={fromCurrencyDropdownRef}
                  >
                    <div
                      className={`currency-selected ${errors.fromCurrency ? 'error' : ''}`}
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

                <div className="currency-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="49" height="25" viewBox="0 0 49 25" fill="none">
<path d="M0.5 12.5H46.5M46.5 12.5L35.25 1.25M46.5 12.5L35.25 23.75" stroke="#544DB4" stroke-width="3"/>
</svg>
                </div>

                <div className="currency-column">
                  <label>Destination Currency</label>
                  {errors.toCurrency && (
                    <div className="error-message">{errors.toCurrency}</div>
                  )}
                  <div
                    className="currency-selector"
                    ref={toCurrencyDropdownRef}
                  >
                    <div
                      className={`currency-selected ${errors.toCurrency ? 'error' : ''}`}
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
          
          {errors.general && (
            <div className="error-container">{errors.general}</div>
          )}
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
              <div className="result-final-primary">
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
                <div style={{ display: 'flex', alignItems: 'end', marginLeft: '60px' }}>
                  <div className="result-final-secondary">
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
            <h3>
              Calculation History
              <button className="clear-history" onClick={clearHistory}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                  <path d="M7.48033 3.85444C8.92505 3.43479 10.4684 3.50845 11.8666 4.06381C13.2648 4.61916 14.4381 5.62454 15.2012 6.92112C15.9642 8.2177 16.2735 9.73155 16.0802 11.2235C15.8869 12.7155 15.202 14.1005 14.1337 15.1598C13.0654 16.2191 11.6746 16.8923 10.181 17.0729C8.68749 17.2536 7.17631 16.9315 5.88624 16.1575C4.59617 15.3835 3.60075 14.2018 3.05726 12.7989C2.51376 11.3961 2.45315 9.85213 2.88502 8.41101" stroke="#544DB4"/>
                  <path d="M9.86399 6.72842L6.89627 3.51333L10.1114 0.545619" stroke="#544DB4"/>
                </svg>
              </button>
            </h3>
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

