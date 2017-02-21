// Arguments: <VerticalOrientation-*.txt> <DerivedGeneralCategory-*.txt>
'use strict';

const assert = require('assert');
const fs = require("fs");
const path = require("path");
const unicodeData = require("./unicode-data.js");

let argv = process.argv.slice(2);
console.log(argv);
Promise.all([
  unicodeData.get(argv[0]),
  unicodeData.get(argv[1]),
]).then(dataList => {
  const voByCodepoint = dataList[0];
  const gcByCodepoint = dataList[1];
  let output = new UcdFormatter;
  for (let codepoint = 0; codepoint <= 0x10FFFF; codepoint++) {
    let gc = gcByCodepoint[codepoint];
    let vo = voByCodepoint[codepoint];
    if ((!gc || gc === "Cn") && (vo && vo !== "R"))
      output.write(codepoint, (gc ? gc : "--") + " " + (vo ? vo : "-"));
  }
  output.close();
});

class UcdFormatter {
  constructor() {
    this.value = null;
    this.codepoint = 0;
    this.startCodepoint = 0;
  }

  write(codepoint, value) {
    if (value === this.value && codepoint === this.codepoint + 1) {
      this.codepoint = codepoint;
      return;
    }
    if (this.value) {
      let range = unicodeData.toHex(this.startCodepoint);
      if (this.startCodepoint != this.codepoint)
        range += ".." + unicodeData.toHex(this.codepoint);
      range = padEnd(range, 12);
      console.log(range + " " + this.value);
    }
    this.value = value;
    this.startCodepoint = codepoint;
    this.codepoint = codepoint;
  }

  close() {
    this.write(0, null);
  }
}

function padEnd(str, length) {
  str = str + new Array(length + 1).join(" ");
  return str.slice(0, length);
}
