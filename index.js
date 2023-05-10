const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ msg: 'server up' });
});

app.get('/about', (req, res) => {
  res.json({ msg: 'this is about endpoint' });
});

app.listen(5000, () => {
  console.log('Listening at port 5000')
});

module.exports = app;