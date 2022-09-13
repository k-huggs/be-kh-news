const { selectTopics, addTopic } = require("../models/topicsModel");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  try {
    const { slug, description } = req.body;
    console.log(req.body)
    const addedTopic = await addTopic(slug, description);
    res.status(201).send({ addedTopic });
  } catch (err) {
    next(err);
  }
};
