const csv = require('csv-parser');
const fs = require('fs');

const results = [];
const csvFileName = process.argv[2];
const jsonFileName = process.argv[2].split('.')[0] + '.json';

fs.createReadStream(csvFileName)
  .pipe(csv({}))
  .on('data', data => results.push(data))
  .on('end', () => {
    console.log("Data Preview: \n\n");
    console.log(results[0]);
    console.log(results[1]);
    console.log("    ...");
    console.log(results[results.length - 2]);
    console.log(results[results.length - 1]);
    console.log("Done. Find your file named: ", jsonFileName);
    fs.writeFileSync(
      jsonFileName,
      JSON.stringify(results)
    );
  });

