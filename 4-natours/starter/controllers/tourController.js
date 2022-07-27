// const fs = require('fs');
const Tour = require(`.././models/tourModel`);

// All of this data is coming from an JSON file that should come from a database
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// Check ID middleware -> will allow to run after the check
// ? exports.checkID = (req, res, next, value) => {
//   console.log(`Tour id is ${value}`);

//   if (value * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   next();
// };

// This is checking if the user has inputed the tour name or price in the form
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }

//   next();
// };

exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);

  res.status(200).json({
    status: 'Success',
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }

  // // console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1;
  // // Allows us to create a new Object by combining another Object
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);

  // // Overwrites the existing JSON file with a new ID object
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
};

exports.updateTour = (req, res) => {
  console.log(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour: `<Updated tour here...>`,
    },
  });
};

exports.deleteTour = (req, res) => {
  // 204 means no content
  res.status(204).json({
    status: 'success',
    data: 'null',
  });
};
