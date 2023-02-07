const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const request = require("request");

// Ask user for a date
readline.question(
  `Enter Date? \n for BTC date must be before 2009,for ETH\n`,
  (date) => {
    // Parse the date input into an Epoch timestamp
    let parse = Date.parse(date);
    // Remove additional 000 in end of parsed date

    console.log(`Date in Epoch: ${parse / 1000}`);

    // Ask user for a token
    readline.question(`Enter Token:\n`, (token) => {
      // Create the URL to fetch data from CryptoCompare API
      const url = `https://min-api.cryptocompare.com/data/blockchain/histo/day?fsym=${token}&toTs=${parse}&api_key=bea66d2297af44dec394597b938dfa3f08c3f3b72b232da36e9366bebb9d79e6`;

      // Send a request to the API and handle the response
      request({ url: url }, (error, res, body) => {
        if (!error && res.statusCode === 200) {
          const visible = JSON.parse(body);
          console.log(visible["Data"]);
        }
      });
      readline.close();
    });
  }
);
