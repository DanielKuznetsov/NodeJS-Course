// It is good practice to have one separate file for express all alone and another file for server side
// 3. START THE SERVER

const app = require(`./app.js`);

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
