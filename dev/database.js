const config = require('./config');
const Pool = require('pg-pool');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = new Pool({
    user: config.pg.username,
    password: config.pg.password,
    host: config.pg.hostname,
    port: config.pg.port,
    database: config.pg.database,
    strictSSL: false,
    max: 1
});