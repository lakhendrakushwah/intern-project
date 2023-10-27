const express = require("express");
const dotenv = require("dotenv").config();
const appRoute = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const swaggerJsdoc = require("swagger-jsdoc");
const role = require("./role")
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
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin',`${process.env.React_ORIGIN}`);
  res.header('Access-Control-Allow-Headers', '*');

  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(
  process.env.PORT,
  "0.0.0.0",
  console.log(`server running on port ${process.env.PORT}`)
);
