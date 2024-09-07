const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://api.openweathermap.org/geo/1.0';

function checkApiKey() {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
        throw new Error('API key is missing. Please set the OPENWEATHER_API_KEY in the environment variables.');
    }
    return API_KEY;
}

function isValidStateAbbreviation(input) {
  const stateAbbreviations = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return stateAbbreviations.includes(input.toUpperCase());
}

async function getLocationByCity(city, state) {
    const API_KEY = checkApiKey();

    try {
        const response = await axios.get(`${BASE_URL}/direct`, {
            params: {
                q: `${city},${state},US`,
                limit: 1,
                appid: API_KEY,
            }
        });

        if (response.data.length === 0) {
            throw new Error(`No location found for city/state: ${city}, ${state}`);
        }

        return response.data[0]; 
    } catch (err) {
        console.error(`Error fetching data for city/state input: ${city}, ${state} - ${err.message}`);
    }
}

async function getLocationByZipcode(zipcode) {
    const API_KEY = checkApiKey();

    try {
        const response = await axios.get(`${BASE_URL}/zip`, {
         params: {
            zip: `${zipcode},US`,
            appid: API_KEY,
        }
        });

        return response.data;
        
    } catch (err) {
        console.error(`Error fetching data for zipcode: ${zipcode} - ${err.message}`);
    }
}

async function multipleLocationSearch(locations) {
    const locationPromises = locations.map(async (location) => {
        const zipcodeRegexCheck = /^\d{5}$/
        
        if (zipcodeRegexCheck.test(location)) {
            return await getLocationByZipcode(location)
        } else {
            const [city, state] = location.split(',').map(str => str.trim());
            if (city && state && isValidStateAbbreviation(state)) {
                return await getLocationByCity(city, state)
            } else {
                console.error(`Invalid location format: ${location}`);
            }
        }
    });

    const results = await Promise.all(locationPromises);
    return results.filter(result => result !== undefined);
}

module.exports = { checkApiKey, getLocationByCity, getLocationByZipcode, multipleLocationSearch }
