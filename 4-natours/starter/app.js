// https://www.natours.dev/api/v1/tours
const express = require('express');
const fs = require('fs');

const app = express();

// Middleware - function that modifies the incoming information
app.use(express.json());

// app.get('/', (req, res) => {
//   // sending string to the client
//   // res.status(200).send('Hello from the server side!');

//   // sending json to the client
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('Youc can post to this endpoint');
// });

// All of this data is coming from an JSON file that should come from a database
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Reqest object that holds the information about the post request that was done by the users
app.post(`/api/v1/tours`, (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  // Allows us to create a new Object by combining another Object
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // Overwrites the existing JSON file with a new ID object
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
