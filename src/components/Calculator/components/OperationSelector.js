import React from 'react';

const OperationSelector = ({ 
  operation, 
  setOperation, 
  showOperationsDropdown, 
  setShowOperationsDropdown,
  operationsDropdownRef 
}) => {
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

export default OperationSelector;
