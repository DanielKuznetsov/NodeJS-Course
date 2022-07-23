//////////////////////////////////////////////////////
// FILES
const fs = require("fs");

// Read from files
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// Write from files in Node
const textOut = `This is what we know about avocado: ${textIn}. \n Created on ${Date.now()}`;
fs.writeFileSync("./txt/output.text", textOut);

// Reading files in an asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
  if (error) return console.log("ERROR!");

  fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
    // console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (error, data3) => {
      // console.log(data3);

      fs.writeFile(
        "./txt/final.txt",
        `${data3} \n ${data2}`,
        "utf-8",
        (err) => {
          console.log("Your file has been written :)");
        }
      );
    });
  });
});

//////////////////////////////////////////////////////
// SERVER, BASIC ROUTING, AND SUPER BASIC API
const http = require("http");
const url = require("url");

// This operation does not get executed each time on a request
// THis is top level code is executed only once
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

// This operation gets executed each time on a request
const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW section!");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT section!");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      // because of this header, the browser is expecting this html there
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

//////////////////////////////////////////////////////
//
