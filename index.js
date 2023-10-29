const express = require("express");
const dotenv = require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const swaggerJsdoc = require("swagger-jsdoc");
const role = require("./role")
const auth = require('./auth')
const community = require('./community')
const member = require('./member')
const app = express();


var cors = require('cors')
app.use(cors (
  // {origin:`http://13.40.31.32:${process.env.PORT_FRONTEND}`,
  {origin:process.env.React_ORIGIN,
  credentials:true,
  }
))

// app.use(`${process.env.NginxRoute}`, appRoute);
// app.use("/",role)
app.use("/v1/role",role)
app.use('/v1/auth',auth)
app.use('/v1/community',community)
app.use('/v1/member',member)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin',`${process.env.React_ORIGIN}`);
  res.header('Access-Control-Allow-Headers', '*');

  next();
});

app.listen(
  process.env.PORT,
  "0.0.0.0",
  console.log(`server running on port ${process.env.PORT}`)
);
