// It is good practice to have one separate file for express all alone and another file for server side
// 3. START THE SERVER

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require(`./app.js`);

// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
