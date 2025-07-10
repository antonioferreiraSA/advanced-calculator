/**
 * Maps currency codes to their corresponding country codes for flag display
 * Most currencies use the ISO country code, with some exceptions (like EUR)
 */
export const CURRENCY_TO_COUNTRY_MAP = {
  // Major currencies
  'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CHF': 'ch',
  'AUD': 'au', 'CAD': 'ca', 'CNY': 'cn', 'HKD': 'hk', 'NZD': 'nz',

  // European currencies
  'SEK': 'se', 'NOK': 'no', 'DKK': 'dk', 'PLN': 'pl', 'HUF': 'hu',
  'CZK': 'cz', 'RON': 'ro', 'BGN': 'bg', 'ISK': 'is', 'HRK': 'hr',

  // Asian currencies
  'KRW': 'kr', 'SGD': 'sg', 'TWD': 'tw', 'THB': 'th', 'IDR': 'id',
  'PHP': 'ph', 'MYR': 'my', 'INR': 'in', 'VND': 'vn', 'BDT': 'bd',
  'PKR': 'pk', 'NPR': 'np', 'LKR': 'lk', 'MMK': 'mm',

  // Middle Eastern & African currencies
  'ILS': 'il', 'AED': 'ae', 'SAR': 'sa', 'QAR': 'qa', 'OMR': 'om',
  'KWD': 'kw', 'BHD': 'bh', 'JOD': 'jo', 'EGP': 'eg', 'MAD': 'ma',
  'TND': 'tn', 'NGN': 'ng', 'KES': 'ke', 'GHS': 'gh', 'ZAR': 'za',

  // American currencies
  'MXN': 'mx', 'BRL': 'br', 'CLP': 'cl', 'COP': 'co', 'ARS': 'ar',
  'PEN': 'pe', 'UYU': 'uy', 'BOB': 'bo', 'VES': 've', 'PYG': 'py',
  'GTQ': 'gt', 'DOP': 'do', 'CRC': 'cr', 'PAB': 'pa', 'JMD': 'jm',
  'TTD': 'tt', 'BBD': 'bb', 'BSD': 'bs', 'AWG': 'aw',

  // Other currencies
  'RUB': 'ru', 'TRY': 'tr', 'UAH': 'ua', 'KZT': 'kz', 'GEL': 'ge',
  'AMD': 'am', 'AZN': 'az', 'UZS': 'uz', 'FJD': 'fj', 'XCD': 'ag',
  'MUR': 'mu', 'SCR': 'sc', 'MGA': 'mg', 'MZN': 'mz', 'SZL': 'sz',
  'MWK': 'mw', 'GMD': 'gm', 'CVE': 'cv', 'SLL': 'sl', 'HTG': 'ht'
};

/**
 * Gets the flag URL for a given currency code
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns {string} URL to the flag image
 */
export const getCurrencyFlag = (currencyCode) => {
  // Special cases for currencies that need specific handling
  if (currencyCode === 'XAF') return 'https://flagcdn.com/w40/cm.png'; // Central African CFA franc - using Cameroon
  if (currencyCode === 'XOF') return 'https://flagcdn.com/w40/sn.png'; // West African CFA franc - using Senegal
  if (currencyCode === 'XPF') return 'https://flagcdn.com/w40/pf.png'; // CFP franc - using French Polynesia
  if (currencyCode === 'XCD') return 'https://flagcdn.com/w40/ag.png'; // East Caribbean dollar - using Antigua and Barbuda

  const countryCode = CURRENCY_TO_COUNTRY_MAP[currencyCode] || 'un';
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

/**
 * Fetches the exchange rate between two currencies
 * @param {string} baseCurrency - The source currency code
 * @param {string} targetCurrency - The target currency code
 * @param {string} apiKey - API key for the exchange rate service
 * @returns {Promise<number|null>} The exchange rate or null if error
 */
export const fetchExchangeRate = async (baseCurrency, targetCurrency, apiKey) => {
  // Same currency conversion is always 1:1
  if (baseCurrency === targetCurrency) {
    return 1;
  }

  try {
    const endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();

    if (data.result === 'success') {
      return data.conversion_rate;
    } else {
      console.error(`Exchange rate API error: ${data.error_type}`);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error.message);
    return null;
  }
};

/**
 * Fetches available currencies from the Exchange Rate API
 * @param {string} apiKey - API key for the exchange rate service
 * @returns {Promise<string[]|null>} Array of currency codes or null if error
 */
export const fetchAvailableCurrencies = async (apiKey) => {
  try {
    const endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();

    if (data.result === 'success') {
      // Extract available currencies from the response
      return Object.keys(data.conversion_rates);
    } else {
      console.error(`Failed to fetch currencies: ${data.error_type}`);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch available currencies:', error.message);
    return null;
  }
};
