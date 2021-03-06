const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const http = require("http");
const chalk = require("chalk");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const SocketIO = require("socket.io");
const db = require('./config/db')
const dotenv = require("dotenv");
const session = require("express-session")
const cookieParser = require("cookie-parser");

dotenv.config();
var whitelist = ["http://127.0.0.1:3000", "https://twitter-hd-anurag.herokuapp.com/"];
var corsOptions = {
  exposedHeaders: ["x-auth-token"],
  credentials: true
  //,
  // origin: function (origin, callback) {
  //   console.log(origin)
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // }
};


//create express application
const app = express();
app.use(session({
  name: 'twitter',
  secret: 'helpdesk',
  resave: true,
  saveUninitialized: true,
  cookie:
  {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: true
  }
}
))

app.use(cookieParser());

/**
 * MIDDLEWARES
 */

// set up cors to allow us to accept requests from our client
app.use(cors(corsOptions));
//passport authentication strategy for twitter
// initalize passport
app.use(passport.initialize());
require("./config/passport")(passport);

app.use(morgan("dev"));
// gzip compression
app.use(compression());

app.use(helmet());
//making body available to read in request object
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Redirect to api routes

app.use("/api", require("./routes"));
const server = http.createServer(app);
const io = SocketIO(server);

require("./services/twitterService")(io, app);


// setUserActivityWebhook(app);

// Redirect to client/build to serve html for any router other than /api
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3000;
console.log(process.env.NODE_ENV)
// Listen to PORT
server.listen(port, () =>
  console.log(chalk.magenta(`server started on port ${port}`))
);
