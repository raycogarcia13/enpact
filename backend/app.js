const express = require("express")
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require("path")

app.set('port',process.env.PORT || 3000)
//middlewares
const cookieParser = require('cookie-parser');
const corsOption = require('./config/cors');
app.use(cors(corsOption))
app.use(bodyParser.json({limit:'50mb'}));
app.use(cookieParser())

// // routes import
// User and auth
app.use('/api/v1',require("./routes/auth"));
// projector
app.use('/api/v1',require("./routes/projector"));
// department
app.use('/api/v1',require("./routes/department"));
// activity
app.use('/api/v1',require("./routes/activity"));
// projects
app.use('/api/v1',require("./routes/project"));
// services
app.use('/api/v1',require("./routes/services"));
// ct
app.use('/api/v1',require("./routes/ct"));

// error middleware
const errorMiddleware = require('./middlewares/errors')
app.use(errorMiddleware)


module.exports =  app;




