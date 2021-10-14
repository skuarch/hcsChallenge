# HCS CHALLENGE

The goal is to build an integration tool that loads data from a CSV file, schedules some
email communications, and then executes automated tests to ensure all data and logic
was executed correctly.


## Installation

Use the package manager npm on the project's root.

```bash
npm install 
```
Edit src/env/environments.js with your mongodb, example:
```bash
local: {
  csvPathFile: './resources/data.csv',
  connectionUrl: 'mongodb://localhost:27017/hcs',
  databaseName: 'hcs'
}
```

## Usage

```node
npm start
```
## Optional
Create **hcs** database in your mongodb.

## Testing
When running test another database is created if you want to avoid this, edit environment.js 
```node
npm test
```

Please make sure to update environments as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)