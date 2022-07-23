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
// SERVER
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello from the server!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
