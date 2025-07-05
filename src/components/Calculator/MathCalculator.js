import React, { useState, useEffect } from 'react';

const MathCalculator = ({ moduleData }) => {
  const {
    first_number_label = 'First Number',
    second_number_label = 'Second Number',
    calculate_button_text = 'Calculate',
    clear_button_text = 'Clear'
  } = moduleData;

  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [liveResult, setLiveResult] = useState(null);

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

    switch (operation) {
      case '+':
        setResult(num1 + num2);
        break;
      case '-':
        setResult(num1 - num2);
        break;
      case '*':
        setResult(num1 * num2);
        break;
      case '/':
        if (num2 === 0) {
          setError('Cannot divide by zero');
          setResult(null);
        } else {
          setResult(num1 / num2);
        }
        break;
      default:
        setResult(null);
    }
  };

  // Clear inputs and result
  const handleClear = () => {
    setFirstNumber('');
    setSecondNumber('');
    setOperation('+');
    setResult(null);
    setError('');
    setLiveResult(null);
  };

  // Update live result whenever inputs change
  useEffect(() => {
    if (firstNumber === '' || secondNumber === '') {
      setLiveResult(null);
      return;
    }

    const num1 = parseFloat(firstNumber) || 0;
    const num2 = parseFloat(secondNumber) || 0;

    setError('');
    
    switch (operation) {
      case '+':
        setLiveResult(num1 + num2);
        break;
      case '-':
        setLiveResult(num1 - num2);
        break;
      case '*':
        setLiveResult(num1 * num2);
        break;
      case '/':
        if (num2 === 0) {
          setError('Cannot divide by zero');
          setLiveResult(null);
        } else {
          setLiveResult(num1 / num2);
        }
        break;
      default:
        setLiveResult(null);
    }
  }, [firstNumber, secondNumber, operation]);

  return (
    <div className="math-calculator">
      <div className="input-group">
        <label htmlFor="firstNumber">{first_number_label}</label>
        <input
          type="text"
          id="firstNumber"
          value={firstNumber}
          onChange={handleFirstNumberChange}
          placeholder="Enter first number"
          className={error && !firstNumber ? 'error' : ''}
        />
      </div>

      <div className="input-group">
        <label htmlFor="operation">Operation</label>
        <select
          id="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="+">Addition (+)</option>
          <option value="-">Subtraction (-)</option>
          <option value="*">Multiplication (×)</option>
          <option value="/">Division (÷)</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="secondNumber">{second_number_label}</label>
        <input
          type="text"
          id="secondNumber"
          value={secondNumber}
          onChange={handleSecondNumberChange}
          placeholder="Enter second number"
          className={error && !secondNumber ? 'error' : ''}
        />
      </div>

      {liveResult !== null && (
        <div className="result-container">
          <div className="result-label">Live Result:</div>
          <div className="result-value">{liveResult}</div>
        </div>
      )}

      {error && <div className="error-container">{error}</div>}

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={calculateResult}
          disabled={!firstNumber || !secondNumber}
        >
          {calculate_button_text}
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          {clear_button_text}
        </button>
      </div>

      {result !== null && !error && (
        <div className="result-container">
          <div className="result-label">Result:</div>
          <div className="result-value">{result}</div>
        </div>
      )}
    </div>
  );
};

export default MathCalculator;
