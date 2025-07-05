# Advanced Calculator with Currency Conversion - HubSpot Module

A React-based HubSpot module featuring an advanced calculator with currency conversion capabilities, built for the SpotDev technical assessment.

## Features

### Mathematical Calculator
- Basic operations: Addition (+), Subtraction (-), Multiplication (*), Division (/)
- Live result display that updates as the user types
- Form validation to prevent invalid inputs
- Graceful handling of division by zero errors

### Currency Converter
- Select source and target currencies
- Real-time exchange rates from Open Exchange Rates API
- Display of conversion result and current exchange rate
- Timestamp showing when rates were last updated
- Error handling with user-friendly messages

### Customization Options
- Modify input field labels
- Change button text
- Select a primary color for styling
- Responsive design for desktop, tablet, and mobile devices

## Getting Started

For more information on local development tools, see [Local Development Tooling: Getting Started](https://designers.hubspot.com/docs/tools/local-development)

### Configuration

#### Set up HubSpot CMS CLI ([`@hubspot/cli`](https://www.npmjs.com/package/@hubspot/cli))
- A config file named `hubspot.config.yml` will also be needed.  The config can be at the project level or higher up in the directory tree.
- Be sure to set a `defaultPortal` in your `hubspot.config.yml` to which you'd like the built app files to sync.

### Install
- Run `npm install` or `yarn install` to install needed dependencies.

### Running
- Run `npm start` or `yarn start` to automatically upload your project to `defaultPortal`.
- Create a page from default theme, or any drag-and-drop (`dnd_area`) enabled template in your portal.
- Add the `Advanced Calculator` module to your page.
- Customize the module settings as needed through the HubSpot editor.

### package.json scripts
- `start` : Builds project with webpack, uploads to your `defaultPortal` specified in `hubspot.config.yml` and watches for changes via [`@hubspot/webpack-cms-plugins/HubSpotAutoUploadPlugin`](https://www.npmjs.com/package/@hubspot/webpack-cms-plugins).
- `build` : Clears `/dist` contents and builds project into `/dist`.
- `deploy` : Clears `/dist` contents, builds project into `/dist`, and uploads to via [`@hubspot/cli`](https://www.npmjs.com/package/@hubspot/cli).
- `lint` : Lints CSS, JS, and JSON files via `eslint` ([documentation](https://eslint.org/docs/user-guide/configuring)) and checks for formatting via `prettier`([documentation](https://prettier.io/docs/en/configuration.html)) in `src`.
  - For configs, see `prettier.config.js` and `eslintrc.js`.
- `prettier:write` : Formats JS and JSON files in `src`.
  - For configs, see `prettier.config.js`.
