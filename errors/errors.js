exports.handleCustomErrors = (err,_, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err,_, res, next) => {
// USE LOOKUP OBJECT 

  const notFoundError = ["23503"];
  if (err.code === "23502") {
    res
    .status(400)
    .send({ msg: "Missing slug or description" });
  }
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Invalid Server Request Made, Expected Number Not String" });
  } else if (notFoundError.includes(err.code)) {
    console.log(err);
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

exports.handleRouteNotFoundErrors = (req, res) => {
  res.status(404).send({ msg: "URL Route Has Not Been Found" });
};

exports.handleServerErrors = (err,_, res) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
