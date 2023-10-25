# Data Retrieval and Storage Project

This project involves writing code to fetch data from a product API (URL) and save it into a local SQL database. It also addresses several additional requirements for a more advanced solution. The key features and tech stack for this project are as follows:

- Tech Stack:
  - MySQL 5.7 and above
  - Node.js 18 and above

## Installation

1. Clone the project from the repository.
2. Install the required Node modules:

   ```bash
   npm install
    ```

### Run the server

   ```bash
node server.js
```

## Key Features
### Data Retrieval and Storage

* The project fetches data from a product API using Axios.
* It also retrieves data from a local SQL database using MySQL.
### Handling Hierarchical Data
* The project figures out a way to handle hierarchical data, such as product variations and categories.
### Schemaless Data Handling
* It addresses schemaless data handling, specifically for variations. Variations may have dynamic key-value pairs.
### Translations Support
* The database schema supports translations, even though the API doesn't provide them.
* It uses ISO 639-1 language keys for translations.
### Support for Extra Currencies
* The project includes support for multiple currencies in the database.
* It uses 'EUR' as the default currency.
### Incremental Data Update
* The project ensures that it only updates parts of the product data that have changed, avoiding the need to re-save everything.
### Handling Objects without IDs
* The solution gracefully handles cases where not every object has an ID.
Usage
The project is designed to run automatically at specific intervals, ensuring that your local database stays up to date with the data from the API. The data update interval is set to 8 seconds.

Feel free to explore and experiment with the code to understand how it retrieves and stores data, handles schemaless variations, and supports translations and multiple currencies.

Enjoy working with the Data Retrieval and Storage Project!