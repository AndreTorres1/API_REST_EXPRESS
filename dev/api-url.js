const config = require("./config")

module.exports = (url) => `${config.baseUrl}/${url}`

/*
Código Equivalente
module.exports = function(url) {
    return `${config.baseUrl}/${url}`;
}
*/

