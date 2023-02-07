// Importing required modules
const csv = require('csv-parser');
const fs = require('fs');
const request = require('request');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Reading the transactions.csv file and creating a readable stream
const readable = fs.createReadStream('transactions.csv');

// Parsing the csv file data
const parsestream = readable.pipe(csv());

// Variables to store the sum of each coin, parse the date, and check if the data is valid under the input date
let BTCsum = 0;
let ETHsum = 0;
let XRPsum = 0;
let parseDate = 0;
let validDataUnderInputdate = 0;
let sum = 0;

// Variables to store the actual worth of each coin in USD
let BTCvalue = 0;
let ETHvalue = 0;
let XRPvalue = 0;

// API Key for accessing data
const secretKey = 'bea66d2297af44dec394597b938dfa3f08c3f3b72b232da36e9366bebb9d79e6';

// Function to check the token type and update the sum of each coin
const checker = function (data) {
    if (data.token === 'BTC' && data.transaction_type === 'DEPOSIT') {
        BTCsum += +data.amount;
    }
    else if (data.token === 'BTC' && data.transaction_type === 'WITHDRAWAL') {
        BTCsum -= +data.amount;
    }
    else if (data.token === 'XRP' && data.transaction_type === 'DEPOSIT') {
        XRPsum += +data.amount;
    }
    else if (data.token === 'XRP' && data.transaction_type === 'WITHDRAWAL') {
        XRPsum -= +data.amount;
    }
    else if (data.token === 'ETH' && data.transaction_type === 'DEPOSIT') {
        ETHsum += +data.amount;
    }
    else if (data.token === 'ETH' && data.transaction_type === 'WITHDRAWAL') {
        ETHsum -= +data.amount;
    }
}


const mainFunction = function () {
    readline.question(`\n
    Enter 1:,for no parameters, returns the latest portfolio value per token in USD.\n
    Enter 2:,for a token, returns the latest portfolio value for that token in USD.\n
    Enter 3:,for a date, returns the portfolio value per token in USD on that date.\n
    Enter 4:,for a date and a token, returns the portfolio value of that token in USD on that date.\n
    
 `, (inp) => {
        switch (inp) {
            case '1':
                console.log('You have Entered 1');
                parsestream.on('data', (data) => {
                    validDataUnderInputdate++;
                    checker(data);
                })
                    .on('end', () => {

                        console.log({ BTCsum, ETHsum, XRPsum })
                        const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=${secretKey}`;
                        request({ url: url }, (error, res, body) => {
                            if (!error && res.statusCode == 200) {
                                const parseData = JSON.parse(body);
                                const BTCvalue = parseData['BTC']['USD'] * BTCsum;
                                const ETHvalue = parseData['ETH']['USD'] * ETHsum;
                                const XRPvalue = parseData['XRP']['USD'] * XRPsum;

                                console.log('Total BTC USD: $' + BTCvalue.toLocaleString(), 'Total ETH in USD: $' + ETHvalue.toLocaleString(), 'Total XRP USD: $' + XRPvalue.toLocaleString());

                                const Totalvalue = BTCvalue + ETHvalue + XRPvalue;

                                console.log('TotalValue:USD ' + Totalvalue.toLocaleString(), { validDataUnderInputdate });
                            }

                            readline.close();
                        })

                    });


                break;
            case '2':
                console.log('You have Entered 2');
                readline.question('Enter Token:', (input2) => {
                    const token = input2;
                    parsestream.on('data', (data) => {
                        if (data.token === token && data.transaction_type === 'DEPOSIT') {
                            sum += +data.amount;
                            validDataUnderInputdate++;
                        }
                        else if (data.token === token && data.transaction_type === 'WITHDRAWAL') {
                            sum -= +data.amount;
                            validDataUnderInputdate++;
                        }

                    }).on('end', () => {
                        const url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${secretKey}`;
                        request({ url: url }, (error, res, body) => {
                            if (!error && res.statusCode == 200) {
                                const parseData = JSON.parse(body);

                                const Totalvalue = parseData['USD'] * sum;
                                console.log('Total value of ' + input2 + ': $' + Totalvalue.toLocaleString(), `, Total num token ,${validDataUnderInputdate}`);
                            }
                        })
                    });

                    readline.close();
                })

                break;
            case '3':
                console.log('You have Entered 3');
                readline.question(`Enter Date? \n date must be of valid format in GMT,i.e:01 Jan 1970 00:00:00 GMT\n`, (date => {
                    parseDate = Date.parse(date);
                    console.log(`Date in Epoch ${parseDate / 1000}`)
                    parsestream.on('data', (data) => {
                        if (parseDate / 1000 >= data.timestamp) {
                            validDataUnderInputdate++;
                            checker(data);
                        }
                    }).on('end', () => {
                        //This code creates an array of URLs for retrieving historical data for various cryptocurrencies (BTC, ETH, and XRP) from the Cryptocompare API.

                        const cryptoList = ["BTC", "ETH", "XRP"];
                        const baseUrl =
                            "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
                        const tsym = "&tsym=USD&limit=1&toTs=";
                        const urls = cryptoList.map((fsym) => {
                            return `${baseUrl}${fsym}${tsym}${parseDate / 1000
                                }&api_key=${secretKey}`;
                        });

                        request({ url: url }, (error, res, body) => {
                            if (!error && res.statusCode == 200) {
                                const parseData = JSON.parse(body);
                                BTCvalue = parseData["Data"]["Data"][0]["close"] * BTCsum;
                                console.log(parseData["Data"]["Data"][0]["close"]);
                                console.log(
                                    `Total value of BTC $${BTCvalue.toLocaleString()}`
                                );

                                request({ url: url2 }, (error, res, body2) => {
                                    if (!error && res.statusCode == 200) {
                                        const parseData2 = JSON.parse(body2);
                                        ETHvalue =
                                            parseData2["Data"]["Data"][0]["close"] * ETHsum;
                                        console.log(parseData2["Data"]["Data"][0]["close"]);
                                        console.log(
                                            `Total value of ETH $${ETHvalue.toLocaleString()}`
                                        );

                                        request({ url: url3 }, (error, res, body) => {
                                            if (!error && res.statusCode == 200) {
                                                const parseData = JSON.parse(body);
                                                XRPvalue =
                                                    parseData["Data"]["Data"][0]["close"] * Xsum;
                                                console.log(
                                                    parseData["Data"]["Data"][0]["close"]
                                                );
                                                console.log(
                                                    `Total value of XRP $${XRPvalue.toLocaleString()}`
                                                );

                                                const Totalvalue = XRPvalue + BTCvalue + ETHvalue;
                                                console.log(
                                                    `Total value of all the token in date: ${date} is $:${Totalvalue.toLocaleString()}`
                                                );
                                                console.log(
                                                    `Valid number of data under input date ${validDataUnderInputdate}`
                                                );
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    })

                    readline.close();
                }));

                break;
            case '4':
                console.log('You have Entered 4');
                readline.question(`Enter Date? \n date must be of valid type in GMT,i.e:01 Jan 1970 00:00:00 GMT\n
                                note:For BTC enter date after 2009,For ETH enter date after 2015,for XRP enter date after 2012.
            `, (date => {
                    sum = 0;
                    parseDate = Date.parse(date);

                    readline.question(`Enter Token:\n`, (input3 => {
                        const token = input3;
                        parsestream.on('data', (data) => {
                            if (parseDate / 1000 >= data.timestamp) {

                                validDataUnderInputdate++;
                                if (data.token === token && data.transaction_type === 'DEPOSIT') {
                                    sum += +data.amount;
                                }
                                else if (data.token === token && data.transaction_type === 'WITHDRAWAL') {
                                    sum -= +data.amount;
                                }

                            }
                        }).on('end', () => {
                            const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${token}&tsym=USD&limit=1&toTs=${parseDate / 1000}&api_key=${secretKey}`;
                            request({ url: url }, (error, res, body) => {
                                if (!error && res.statusCode == 200) {
                                    const parseData = JSON.parse(body);



                                    const BTCvalue = parseData['Data']['Data'][0]['close'] * sum;
                                    console.log('Total coin:', { sum });
                                    console.log('In date ' + date + token + ' value was:' + parseData['Data']['Data'][1]['close']);
                                    console.log('Total value of ' + input3 + ': $' + BTCvalue.toLocaleString() + ` for ${date}`);

                                }
                            })
                        });

                        readline.close();
                    }))

                }));

                break;

            default:
                console.log('Only enter num 1-4');
                mainFunction();
        }


    });
}
mainFunction();
