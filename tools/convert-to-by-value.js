// Convert  VerticalOrientation.txt to a text file grouped by value.
// Copy the data file to "../data" directory and run this script.
'use strict';

const assert = require('assert');
const fs = require("fs");
const path = require("path");
const unicodeData = require("./unicode-data.js");

const dataDir = "../data";
const dataFileNames = fs.readdirSync(dataDir);
Promise.all(dataFileNames.map(dataFileName => {
  dataFileName = path.resolve(dataDir, dataFileName);
  console.log(`Reading ${dataFileName}`);
  return unicodeData.get(dataFileName, unicodeData.formatAsRangesByValue);
})).then(rangesByVOList => {
  assert.equal(rangesByVOList.length, dataFileNames.length);
  for (let i = 0; i < dataFileNames.length; i++) {
    const dataFileName = dataFileNames[i];
    const rangesByVO = rangesByVOList[i];
    const outputFileName = "by-value-" + dataFileName;
    console.log(`Writing ${outputFileName}`);
    const output = fs.createWriteStream(outputFileName);
    output.write(`# This file is generated from ${dataFileName}\n`);
    for (let vo in rangesByVO) {
      const ranges = rangesByVO[vo];
      assert.equal(ranges.length % 2, 0);
      for (let i = 0; i < ranges.length; i += 2) {
        output.write(vo + " " + unicodeData.toHex(ranges[i]) + "-" + unicodeData.toHex(ranges[i + 1]) + "\n");
      }
    }
    output.end();
  }
})
