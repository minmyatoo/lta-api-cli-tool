

# LTA API Project

This project is a command-line interface (CLI) for accessing the Singapore Land Transport Authority (LTA) DataMall APIs. It allows users to fetch bus arrival information, parking availability, nearest bus stops, and estimated travel time between two bus stops.

## Installation

1. Clone the repository or download the project files.

2. Install the required dependencies using npm:

```bash
npm install
```

## Usage

The following commands are available:

1. Get bus arrival information:

```bash
npm run arr
```

2. Get parking availability information:

```bash
npm run parking
```

3. Find the nearest bus stops based on latitude and longitude:

```bash
npm run nearest
```

4. Estimate the travel time between two bus stops:

```bash
npm run traveltime
```

### Configuration

To use the LTA DataMall API, you need an API key. Create a `.env` file in the root directory of the project and set the `LTA_API_KEY` environment variable:

```bash
LTA_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual LTA DataMall API key.

## Dependencies

- [axios](https://www.npmjs.com/package/axios) - Promise-based HTTP client for Node.js
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a `.env` file
- [yargs](https://www.npmjs.com/package/yargs) - A command-line argument parser for Node.js




