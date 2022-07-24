// https://www.natours.dev/api/v1/tours
const express = require('express');
const fs = require('fs');

const app = express();

// Middleware - function that modifies the incoming information
app.use(express.json());

// All of this data is coming from an JSON file that should come from a database
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: `<Updated tour here...>`,
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // 204 means no content
  res.status(204).json({
    status: 'success',
    data: 'null',
  });
};

// ? app.get('/api/v1/tours', getAllTours);
// Single tour endpoint
// ? app.get('/api/v1/tours/:id', getTour);
// Reqest object that holds the information about the post request that was done by the users
// ? app.post(`/api/v1/tours`, createTour);
// Patch request - update the existing tour and JSON file
// PUT - expects that we are going to modify the entire object
// PATCH - expecting that we are going to modify a part of the object
// ? app.patch(`/api/v1/tours/:id`, updateTour);
// ? app.delete(`/api/v1/tours/:id`, deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
