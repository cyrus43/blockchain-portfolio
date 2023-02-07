<h1>Portfolio Value Calculator</h1>

A simple application that helps to calculate the portfolio value for a user based on the cryptocurrency data in a CSV file. The portfolio value can be calculated for different cases like, for a specific date or a specific token or for a combination of both.

<h1>Working Process</h1>
<h3>For Condition 1</h3>
The process starts with initial reading of the stream data and solving any questions that arise. The first step is to calculate the total sum of all the token information from the data given. This is done using a simple if statement that sorts the data based on its token and either adds to the token's respective variable if it's a type of "Deposit" or subtracts from the said variable if it's a transaction type of "Withdrawal". This operation takes approximately 90 seconds to go through all 30 million data points.
The code for this operation is encapsulated in a function called "checker":

const checker = function(data) {
    if (data.token === 'BTC' && data.transaction_type === 'DEPOSIT') {
        BTCsum += +data.amount; // BTCsum for BTC coin total
    } else if (data.token === 'BTC' && data.transaction_type === 'WITHDRAWAL') {
        BTCsum -= +data.amount;
    } else if (data.token === 'XRP' && data.transaction_type === 'DEPOSIT') {
        Xsum += +data.amount; // Xsum for XRP coin total
    } else if (data.token === 'XRP' && data.transaction_type === 'WITHDRAWAL') {
        Xsum -= +data.amount;
    } else if (data.token === 'ETH' && data.transaction_type === 'DEPOSIT') {
        Esum += +data.amount; // Esum for Ethereum coin total
    } else if (data.token === 'ETH' && data.transaction_type === 'WITHDRAWAL') {
        Esum -= +data.amount;
    }
}

The values obtained are then multiplied with the current value of the token obtained from CryptoCompare. This allows users to get the total value of all the coins in their possession in real-time with careful word combination.

<h3>For Condition 2</h3>
The readline function is used to collect the user-specified token in a variable called "token", and the program will add data to a variable called "sum" if the token is of type "DEPOSIT" and subtract from the "sum" variable if the data transaction type is "WITHDRAWAL". Finally, after collecting the total token in the portfolio, the CryptoCompare API is used to show the actual value of the token in USD in real-time.

if (data.token === token && data.transaction_type === 'DEPOSIT') {
    sum += +data.amount;
    validDataUnderInputdate++;
} else if (data.token === token && data.transaction_type === 'WITHDRAWAL') {
    sum -= +data.amount;
    validDataUnderInputdate++;
}

<h3>For Condition 3</h3>
A similar set of code is used for a specific date. The date in the CSV data is in Epoch format, but the user may not be familiar with it. The user can enter the date in GMT format (06 Jan 2021 15:16:08 GMT), which is then parsed and stored in a variable called "ParsedDate". If the epoch time in the data is equal to or less than the entered date, the total coin value is calculated. The Cryptocompare API's historical data, which also uses Epoch dates, is used to show the actual value. 
Multiple API calls were required to retrieve historical data for multiple tokens for a single date, so nested API calls were used to ensure that the "TotalValue" variable was correct.

<h1>Requirements</h1>

To run this application, you need the following:

Node.js
npm
csv-parser
fs
request
readline
Usage

<h2>Clone the repository and run the following command in your terminal to install the required modules:</h2>

npm install

Once the modules are installed, run the following command in your terminal to start the application:

node main


Follow the prompts in the terminal to enter the desired input.

API Key

You need an API key from CryptoCompare to fetch the latest worth of each coin in USD. You can get the API key from the following link: https://min-api.cryptocompare.com/

License

This application is licensed under the MIT license.