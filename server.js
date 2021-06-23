const path = require('path');
const express = require('express');
const app = express();
	
app.use(express.static(path.join(__dirname, '/dist/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/build/index.html'));
});

app.listen(process.env.PORT || 4200, () => {
  console.log('Connected to Port'); //Listening on port 4200
});

//Change