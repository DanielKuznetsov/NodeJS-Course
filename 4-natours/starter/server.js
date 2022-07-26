// It is good practice to have one separate file for express all alone and another file for server side
// 3. START THE SERVER

const dotenv = require('dotenv');
const app = require(`./app.js`);

const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

// replacing password in the mongodb string with the password environment variable
const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

// code to connnect to the database
mongoose.connect(DB, { useUnifiedTopology: true }).then((connection) => {
  // console.log(connection.connections);
  console.log('DB connection is established');
});

// console.log(app.get('env'));
// console.log(process.env);

// ! THIS IS BASIC SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    // describing the type of data we want to pass in
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// ! THIS IS BASIC MODEL TO THE SCHEMA RIGHT ABOVE
const Tour = mongoose.model('Tour', tourSchema); // use uppercase on names and variables in mongoose models

// Save the variable into the database
const testTour = new Tour({
  name: 'The Park Camper',
  price: 125,
});

testTour
  .save()
  .then((document) => {
    console.log(document);
  })
  .catch((err) => {
    console.error(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
