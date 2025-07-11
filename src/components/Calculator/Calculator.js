import React, { useState, useEffect, useRef } from 'react';
import './Calculator.scss';
import { formatDate } from '../../utils/helpers';

// Import components
import CalculatorCard from './components/CalculatorCard';
import ResultCard from './components/ResultCard';
import HistoryCard from './components/HistoryCard';

// Import utilities
import { getCurrencyFlag, fetchExchangeRate, fetchAvailableCurrencies } from '../../utils/currencyUtils';
import { validateCalculatorInputs } from '../../utils/validationUtils';

const API_KEY = process.env.REACT_APP_EXCHANGE_RATE_API_KEY; // ExchangeRate-API key from environment variables

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
    first_number_tooltip = 'Please insert the first number',
    second_number_tooltip = 'Please insert the second number',
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

  // References to DOM elements for click outside handling
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
    const fetchCurrencies = async () => {
      const currencies = await fetchAvailableCurrencies(API_KEY);
      if (currencies) {
        setAvailableCurrencies(currencies);
        setLastUpdated(new Date());
      }
    };
    
    fetchCurrencies();
  }, []);

  // Fetch exchange rates when currencies change
  useEffect(() => {
    const getExchangeRate = async () => {
      if (showConversion && fromCurrency && toCurrency) {
        setIsLoadingRates(true);
        const rate = await fetchExchangeRate(fromCurrency, toCurrency, API_KEY);
        if (rate !== null) {
          setExchangeRate(rate);
          
          // Store the exchange rate in the exchangeRates object
          setExchangeRates(prevRates => ({
            ...prevRates,
            [fromCurrency]: {
              ...(prevRates[fromCurrency] || {}),
              [toCurrency]: rate
            }
          }));
        }
        setIsLoadingRates(false);
      }
    };
    
    getExchangeRate();
  }, [fromCurrency, toCurrency, showConversion]);

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
    const operationText = operation === '+' ? 'ADDITION' : 
                        operation === '-' ? 'SUBTRACTION' : 
                        operation === '*' ? 'MULTIPLICATION' : 
                        operation === '/' ? 'DIVISION' : '';

    return (
      <div className="operation-container">
        <div className="operation-icon"
          onClick={() => setShowOperationsDropdown(!showOperationsDropdown)}
          ref={operationsDropdownRef}
        >
          {operation === '+' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="36" viewBox="0 0 35 36" fill="none">
              <rect x="15" y="1.125" width="5" height="33.75" rx="2.5" fill="#000000"/>
              <rect x="34.375" y="15.5" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15.5)" fill="#000000"/>
            </svg>
          ) : operation === '-' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
              <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#000000"/>
            </svg>
          ) : operation === '*' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
              <rect x="30.9197" y="0.544739" width="5" height="42.9567" rx="2.5" transform="rotate(45 30.9197 0.544739)" fill="#000000"/>
              <rect x="34.4553" y="30.9197" width="5" height="42.9567" rx="2.5" transform="rotate(135 34.4553 30.9197)" fill="#000000"/>
            </svg>
          ) : operation === '/' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
              <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#000000"/>
              <rect x="20" y="4" width="5" height="5" rx="2.5" transform="rotate(90 20 4)" fill="#000000"/>
              <rect x="20" y="26" width="5" height="5" rx="2.5" transform="rotate(90 20 26)" fill="#000000"/>
            </svg>
          ) : null}
          {showOperationsDropdown && (
            <div className="operations-dropdown">
              <div
                className="operation-item"
                onClick={() => {
                  setOperation('+');
                  setShowOperationsDropdown(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 36" fill="none">
                  <rect x="15" y="1.125" width="5" height="33.75" rx="2.5" fill="#545353"/>
                  <rect x="34.375" y="15.5" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15.5)" fill="#545353"/>
                </svg>
              </div>
              <div
                className="operation-item"
                onClick={() => {
                  setOperation('-');
                  setShowOperationsDropdown(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
                  <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#545353"/>
                </svg>
              </div>
              <div
                className="operation-item"
                onClick={() => {
                  setOperation('*');
                  setShowOperationsDropdown(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
                  <rect x="30.9197" y="0.544739" width="5" height="42.9567" rx="2.5" transform="rotate(45 30.9197 0.544739)" fill="#545353"/>
                  <rect x="34.4553" y="30.9197" width="5" height="42.9567" rx="2.5" transform="rotate(135 34.4553 30.9197)" fill="#545353"/>
                </svg>
              </div>
              <div
                className="operation-item"
                onClick={() => {
                  setOperation('/');
                  setShowOperationsDropdown(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
                  <rect x="34.375" y="15" width="5" height="33.75" rx="2.5" transform="rotate(90 34.375 15)" fill="#545353"/>
                  <rect x="20" y="4" width="5" height="5" rx="2.5" transform="rotate(90 20 4)" fill="#545353"/>
                  <rect x="20" y="26" width="5" height="5" rx="2.5" transform="rotate(90 20 26)" fill="#545353"/>
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
    const validationErrors = validateCalculatorInputs(
      firstNumber,
      secondNumber,
      operation,
      showConversion,
      fromCurrency,
      toCurrency
    );
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
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
        <div className="header-left">
          <h1 className="calculator-main-title">Advanced Calculator</h1>
          <p className="calculator-subtitle">
            Lorem ipsum sit dolor amet nunquam consequitur azarat mithrion zinthos raxacorico
          </p>
        </div>
        <div className="header-right">
          <p className="last-updated">Last Updated: {formatDate(lastUpdated)}</p>
        </div>
      </div>

      <div className="calculator-container">
        <div className="calculator-left">
          <CalculatorCard 
            moduleData={moduleData}
            firstNumber={firstNumber}
            secondNumber={secondNumber}
            operation={operation}
            errors={errors}
            showConversion={showConversion}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            isLoadingRates={isLoadingRates}
            availableCurrencies={availableCurrencies}
            showFromCurrencyDropdown={showFromCurrencyDropdown}
            showToCurrencyDropdown={showToCurrencyDropdown}
            handleFirstNumberChange={handleFirstNumberChange}
            handleSecondNumberChange={handleSecondNumberChange}
            setShowConversion={setShowConversion}
            setFromCurrency={setFromCurrency}
            setToCurrency={setToCurrency}
            setShowFromCurrencyDropdown={setShowFromCurrencyDropdown}
            setShowToCurrencyDropdown={setShowToCurrencyDropdown}
            calculateResult={calculateResult}
            handleReset={handleReset}
            getCurrencyFlag={getCurrencyFlag}
            renderOperationIcon={renderOperationIcon}
            fromCurrencyDropdownRef={fromCurrencyDropdownRef}
            toCurrencyDropdownRef={toCurrencyDropdownRef}
          />
        </div>

        <div className="calculator-right">
          <ResultCard 
            firstNumber={firstNumber}
            secondNumber={secondNumber}
            operation={operation}
            result={result}
            showConversion={showConversion}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            exchangeRate={exchangeRate}
            getCurrencyFlag={getCurrencyFlag}
          />

          <HistoryCard 
            calculationHistory={calculationHistory}
            clearHistory={clearHistory}
            deleteHistoryItem={deleteHistoryItem}
            copyCalculation={copyCalculation}
            getCurrencyFlag={getCurrencyFlag}
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;