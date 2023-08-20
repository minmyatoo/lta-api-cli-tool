🚗📊 **LTA API Project**

This remarkable project introduces a command-line interface (CLI) designed for seamless access to the Singapore Land Transport Authority (LTA) DataMall APIs. Uncover bus arrival details, parking availability, nearest bus stops, and even estimated travel time between two bus stops.

## Installation 📦

1. Clone the repository or download the project files.
2. Use npm to install the required dependencies:

```bash
npm install
```

## Usage 🛠️

Explore these commands at your fingertips:

1. Fetch bus arrival information:

```bash
npm run arr
```

2. Access parking availability data:

```bash
npm run parking
```

3. Discover the nearest bus stops with latitude and longitude:

```bash
npm run nearest
```

4. Estimate travel time between two bus stops:

```bash
npm run traveltime
```

### Configuration ⚙️

To dive into the LTA DataMall API, secure an API key. Create a `.env` file in the project's root directory and set the `LTA_API_KEY` environment variable:

```bash
LTA_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your real LTA DataMall API key.

## Dependencies 📦

- [axios](https://www.npmjs.com/package/axios) - A promise-based HTTP client for Node.js
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a `.env` file
- [yargs](https://www.npmjs.com/package/yargs) - A Node.js command-line argument parser
