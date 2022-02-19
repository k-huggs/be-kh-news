const express = require("express");
const apiRouter = require("./routers/apiRouter");
const app = express();
app.use(express.json());
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleRouteNotFoundErrors,
  handleServerErrors,
} = require("./errors/errors");

app.use("/api", apiRouter);


app.use("*", handleCustomErrors);
app.use(handlePSQLErrors);
app.use("/*", handleRouteNotFoundErrors);
app.use(handleServerErrors);

module.exports = app;
