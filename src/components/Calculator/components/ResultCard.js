import React from 'react';

const ResultCard = ({
  firstNumber,
  secondNumber,
  operation,
  result,
  showConversion,
  fromCurrency,
  toCurrency,
  exchangeRate,
  getCurrencyFlag
}) => {
  return (
    <div className="result-card">
      <div className="result-row">
        <div className="result-value">{firstNumber || '0'}</div>
        <div className="result-operation">{operation}</div>
        <div className="result-value">{secondNumber || '0'}</div>
      </div>

      <div className="result-row">
        <div className="result-final-primary">
          {result !== null 
            ? (typeof result === 'number' && result > 999999
              ? result.toLocaleString()
              : result)
            : '0'}
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
              {result !== null && typeof result === 'number'
                ? (result * exchangeRate).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : '0'}
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
  );
};

export default ResultCard;
