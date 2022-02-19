const endpoints = require("../endpoints.json");

exports.getEndpoints = async (req, res, next) => {
    try {
        const allEndpoints = await Promise.resolve(endpoints)
        res.status(200).send({endpoints: allEndpoints})
    } catch (err) {
        next(err)
    }
}