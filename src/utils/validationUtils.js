/**
 * Validates calculator input fields
 * @param {string} firstNumber - First number input value
 * @param {string} secondNumber - Second number input value
 * @param {string} operation - Selected operation (+, -, *, /)
 * @param {boolean} showConversion - Whether currency conversion is enabled
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Object} Object containing error messages for each field
 */
export const validateCalculatorInputs = (
  firstNumber,
  secondNumber,
  operation,
  showConversion,
  fromCurrency,
  toCurrency
) => {
  const errors = {};

  // Validate first number
  if (!firstNumber.trim()) {
    errors.firstNumber = 'Please enter the first number';
  } else if (isNaN(parseFloat(firstNumber))) {
    errors.firstNumber = 'Please enter a valid number';
  }

  // Validate second number
  if (!secondNumber.trim()) {
    errors.secondNumber = 'Please enter the second number';
  } else if (isNaN(parseFloat(secondNumber))) {
    errors.secondNumber = 'Please enter a valid number';
  }

  // Validate division by zero
  if (
    operation === '/' &&
    secondNumber.trim() &&
    parseFloat(secondNumber) === 0
  ) {
    errors.secondNumber = 'Cannot divide by zero';
  }

  // Validate currency selection if conversion is enabled
  if (showConversion) {
    if (!fromCurrency) {
      errors.fromCurrency = 'Please select a currency';
    }
    if (!toCurrency) {
      errors.toCurrency = 'Please select a currency';
    }
  }

  return errors;
};

/**
 * Formats a number for display, handling large numbers and decimals
 * @param {number} value - The number to format
 * @param {number} [maxDecimals=2] - Maximum decimal places to show
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, maxDecimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  // Handle large numbers
  if (Math.abs(value) >= 1000000) {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: maxDecimals
    });
  }
  
  // Handle regular numbers
  if (Number.isInteger(value)) {
    return value.toString();
  }
  
  return value.toFixed(
    Math.min(
      maxDecimals,
      // Get actual decimal places but limit to maxDecimals
      (value.toString().split('.')[1] || '').length
    )
  );
};
