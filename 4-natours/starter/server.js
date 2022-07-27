// It is good practice to have one separate file for express all alone and another file for server side
// 3. START THE SERVER

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require(`./app.js`);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
