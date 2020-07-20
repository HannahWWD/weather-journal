// express to run server and routes
projectData = {}

const express = require('express');

const connectLiveReload = require('connect-livereload');
  

// start up an instance of app
const app = express();

app.use(connectLiveReload());
// dependencies
const bodyParser = require('body-parser');

// middleware

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

const livereload = require('livereload');
const lserver = livereload.createServer();
lserver.watch('website');

lserver.server.once("connection", () => {
    setTimeout(() => {
      lserver.refresh("/");
    }, 100);
  });




// const data = []

// app.post('/animal', addAnimal);

// function addAnimal (req,res){
//     data.push(req.body);
//     console.log(data);
//     res.send(data);
// };

// app.get("/test",function(req,res){
//     res.send(data);
// }) 
