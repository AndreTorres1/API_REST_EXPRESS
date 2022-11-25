const config = require("../config");

module.exports = {
    get: async (req, res) => {
        res.status(200).send({ version: config.version });
    }

}