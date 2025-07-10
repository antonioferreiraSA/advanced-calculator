import React from 'react';
import OperationSelector from './OperationSelector';
import CurrencyConverter from './CurrencyConverter';

const CalculatorCard = ({
  moduleData,
  firstNumber,
  secondNumber,
  operation,
  errors,
  showConversion,
  fromCurrency,
  toCurrency,
  isLoadingRates,
  availableCurrencies,
  showFromCurrencyDropdown,
  showToCurrencyDropdown,
  handleFirstNumberChange,
  handleSecondNumberChange,
  setShowConversion,
  setFromCurrency,
  setToCurrency,
  setShowFromCurrencyDropdown,
  setShowToCurrencyDropdown,
  calculateResult,
  handleReset,
  getCurrencyFlag,
  renderOperationIcon,
  fromCurrencyDropdownRef,
  toCurrencyDropdownRef
}) => {
  const {
    calculator_title = 'Calculation title',
    first_number_label = 'First Number',
    second_number_label = 'Second Number',
    calculate_button_text = 'CALCULATE',
    clear_button_text = 'RESET VALUES',
  } = moduleData;

  return (
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
        <CurrencyConverter 
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          errors={errors}
          isLoadingRates={isLoadingRates}
          availableCurrencies={availableCurrencies}
          showFromCurrencyDropdown={showFromCurrencyDropdown}
          showToCurrencyDropdown={showToCurrencyDropdown}
          setFromCurrency={setFromCurrency}
          setToCurrency={setToCurrency}
          setShowFromCurrencyDropdown={setShowFromCurrencyDropdown}
          setShowToCurrencyDropdown={setShowToCurrencyDropdown}
          getCurrencyFlag={getCurrencyFlag}
          fromCurrencyDropdownRef={fromCurrencyDropdownRef}
          toCurrencyDropdownRef={toCurrencyDropdownRef}
        />
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
  );
};

export default CalculatorCard;
