const csv = require('csv-parser');
const fs = require('fs');

const results = [];
const csvFileName = process.argv[2];
const jsonFileName = Math.random().toString().slice(2, 6) + process.argv[2].split('.')[0] + '.json';

fs.createReadStream(csvFileName)
  .pipe(csv({}))
  .on('data', data => results.push(data))
  .on('end', () => {

    const newData = results.map((row) => {
      return {
        date: row.Date,
        price: row.SP500,
        yr2000Price: row['Real Price']
      };
    });



    console.log("Data Preview: \n\n");
    console.log(newData[0]);
    console.log(newData[1]);
    console.log("    ...");
    console.log(newData[newData.length - 2]);
    console.log(newData[newData.length - 1]);
    console.log("Done. Find your file named: ", jsonFileName);




    fs.writeFileSync(
      jsonFileName,
      JSON.stringify(newData)
    );
  });


// {
//   Date: '1879-04-01',
//   SP500: '3.77',
//   Dividend: '0.19',
//   Earnings: '0.33',
//   'Consumer Price Index': '8.18',
//   'Long Interest Rate': '4.17',
//   'Real Price': '115.11',
//   'Real Dividend': '5.7',
//   'Real Earnings': '10.18',
//   PE10: ''
// },