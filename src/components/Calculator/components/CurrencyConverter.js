import React from 'react';

const CurrencyConverter = ({
  fromCurrency,
  toCurrency,
  errors,
  isLoadingRates,
  availableCurrencies,
  showFromCurrencyDropdown,
  showToCurrencyDropdown,
  setFromCurrency,
  setToCurrency,
  setShowFromCurrencyDropdown,
  setShowToCurrencyDropdown,
  getCurrencyFlag,
  fromCurrencyDropdownRef,
  toCurrencyDropdownRef
}) => {
  return (
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
                {showFromCurrencyDropdown ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="11" viewBox="0 0 19 11" fill="none">
                    <path d="M18 9.875L9.25 1.125L0.500001 9.875" stroke="black"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="11" viewBox="0 0 19 11" fill="none">
                    <path d="M0.5 1.125L9.25 9.875L18 1.125" stroke="black"/>
                  </svg>
                )}
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
            <path d="M0.5 12.5H46.5M46.5 12.5L35.25 1.25M46.5 12.5L35.25 23.75" stroke="#544DB4" strokeWidth="3"/>
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
                {showToCurrencyDropdown ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="11" viewBox="0 0 19 11" fill="none">
                    <path d="M18 9.875L9.25 1.125L0.500001 9.875" stroke="black"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="11" viewBox="0 0 19 11" fill="none">
                    <path d="M0.5 1.125L9.25 9.875L18 1.125" stroke="black"/>
                  </svg>
                )}
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
  );
};

export default CurrencyConverter;
