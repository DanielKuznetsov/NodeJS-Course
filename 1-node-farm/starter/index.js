const fs = require("fs");

// Read from files
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// Write from and in files in Node
const textOut = `This is what we know about avocado: ${textIn}. \n Created on ${Date.now()}`;
fs.writeFileSync("./txt/output.text", textOut);
console.log("File was written");
