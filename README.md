# Geolocation Utility: Carson Jardine Take Home Test

## Overview

This command-line utility fetches geolocation data (latitude, longitude, place name) using the [OpenWeather Geocoding API](https://openweathermap.org/api/geocoding-api). It supports input in the form of city/state combinations and ZIP codes for locations within the United States. The project is built using JavaScript and Node.js.

## Setup

1. Clone the repository:
   To get started, clone the repository to your local machine and navigate into the project directory:

   ```
    git clone <git@github.com:carson-jardine/geoloc-util.git>
    cd geoloc-util
   ```

2. Install dependencies:
   Install the required Node.js dependencies. This project uses:
   - Axios for making HTTP requests to the OpenWeather Geocoding API.
   - dotenv for securely managing environment variables.
   - jest for testing.

Run the following command to install dependencies:
`npm install`

3. Add your API Key
   You will need an OpenWeather API key to fetch geolocation data. If you do not already have one, sign up for a free API key [here](https://home.openweathermap.org/users/sign_up).

   After obtaining your API key:

   1. Create a `.env`file in the project root.
   2. Add the following line to your `.env` file, replacing `YOUR_API_KEY` with your actual key:

   ```
   OPENWEATHER_API_KEY="YOUR_API_KEY"
   ```

4. Run the tests:

   To ensure the project is working correctly, run the tests:

   `npm test`

   For coverage reports, use:

   `npm run coverage`

5. Run the utility:
   To run the utility from the command line, use the following format:
   `node lib/geoloc-util.js "{locationInfo}"`

   For example:

   `node lib/geoloc-util.js "Madison, WI" "90210" "New York, NY"`

   This should return an output log like the following:

   ```
   Location: Madison, Latitude: 43.074761, Longitude: -89.3837613
   Location: Beverly Hills, Latitude: 34.0901, Longitude: -118.4065
   Location: New York, Latitude: 40.712776, Longitude: -74.005974
   ```

## Project Structure

- `geoloc-util.js`: The main file for running the command-line utility.
- `geoloc-util-helper.js`: Contains helper functions for API requests and input validation.
- `geoloc-util.test.js`: Contains tests for validating the behavior of the utility and API integration.
- `geoloc-util-helper.test.js`: Contains tests for validating the behavior of the helper functions.

## Reflection

Thank you for reviewing my project! Overall, I found this task enjoyable and straightforward. The project covers a wide range of functionality, including command-line argument handling, API integration, and thorough testing.

One of the more challenging aspects was testing the `commandLineUtility()` when the script is executed directly (via `require.main === module` on line 25 of `geoloc-util.js`) After researching and experimenting, I hit my self-imposed timebox and have left my testing attempts commented out in the `geoloc-util.test.js`. Besides that one line, the code coverage shows everything else is tested properly.

Please feel free to reach out if you have any questions or need further clarification, I appreciate your time!

Thank you again for the opportunity!
