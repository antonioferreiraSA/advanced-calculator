import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Calculator from './components/Calculator/Calculator';
import ErrorBoundary from './components/ErrorBoundary';

// Handle boilerplate module
const targetModulesData = document.querySelectorAll(
  '.cms-react-boilerplate > script[type="application/json"]',
);
targetModulesData.forEach(({ dataset, textContent }) => {
  const root = document.getElementById(`App--${dataset.moduleInstance}`);
  return ReactDOM.render(
    <ErrorBoundary>
      <App
        portalId={dataset.portalId}
        moduleData={JSON.parse(textContent)}
        moduleInstance={dataset.moduleInstance}
      />
    </ErrorBoundary>,
    root,
  );
});

// Handle calculator module
const calculatorModulesData = document.querySelectorAll(
  '.calculator-module > script[type="application/json"]',
);
calculatorModulesData.forEach(({ dataset, textContent }) => {
  const root = document.getElementById(`Calculator--${dataset.moduleInstance}`);
  return ReactDOM.render(
    <ErrorBoundary>
      <Calculator
        portalId={dataset.portalId}
        moduleData={JSON.parse(textContent)}
        moduleInstance={dataset.moduleInstance}
      />
    </ErrorBoundary>,
    root,
  );
});
