const express = require("express");
const connectMongo = require("./config/mongoDB");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");

const app = express();

// connect to MongoDB
connectMongo();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(cors(corsOptions));

//routes
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

app.use("/", (req, res) => {
  res.send("server is running");
});

module.exports = app;
