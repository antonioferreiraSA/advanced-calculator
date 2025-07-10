import React from 'react';

const HistoryCard = ({
  calculationHistory,
  clearHistory,
  deleteHistoryItem,
  copyCalculation,
  getCurrencyFlag
}) => {
  return (
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
  );
};

export default HistoryCard;
