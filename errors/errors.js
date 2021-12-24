exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Invalid Server Request Made, Expected Number Not String" });
  } else {
    next(err);
  }
};

exports.handleRouteNotFoundErrors = (req, res, next) => {
  res.status(404).send({ msg: "URL Route Has Not Been Found" });
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
