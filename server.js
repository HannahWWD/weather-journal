// express to run server and routes
projectData = {}

const express = require('express');

// start up an instance of app
const app = express();

// dependencies
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

// this is to connect the browser to the website folder
app.use(express.static('website'))

const port = 3000;
const server = app.listen(port, listening);


// since it is node.js, you have to write with plain js format. or you can also "convert to es6"
function listening() {
  console.log('server running');
  console.log(`running on localhost:${port}`)
}

/* GET ROUTE */

app.get("/get-data", function (req, res) {
  res.send(projectData);
})

/* POST ROUTE */

app.post('/save-data', addData);

function addData(req, res) {
  const dataFromApp = req.body;
  const newEntry = {
    currentDate: dataFromApp.currentDate,
    currentTemp: dataFromApp.currentTemp,
    userInput: dataFromApp.userInput
  }
  Object.assign(projectData, newEntry);
  console.log(projectData);
};


