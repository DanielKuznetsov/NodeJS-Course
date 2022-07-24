const express = require('express');

const app = express();

app.get('/', (req, res) => {
  // sending string to the client
  // res.status(200).send('Hello from the server side!');

  // sending json to the client
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('Youc can post to this endpoint');
});

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ' + port);
});
