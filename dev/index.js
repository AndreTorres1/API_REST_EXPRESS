const express = require("express");
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const config = require('./config');
const swaggerConfig = {
    ...require("./doc/swagger.json"),
    host: `${config.hostname}:${config.port}`,
    basePath: `${config.baseUrl}`
};


const apiUrl = require("./api-url");
const controllers = require("./controllers");
const swaggerDocument = require("./doc/swagger.json");
const swaggerUi = require("swagger-ui-express");
const verifyToken = require('./jwt/verifyJWT')

const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
const protectPaths = (req, res, next) => {
    if (req.path !== '/login') {
        return verifyToken(req, res, next);
    }
    return next();
};

[
    {method: "get", url: "version", cb: controllers.version.get},

    {method: "get", url: "users", cb: controllers.users.getAll},
    {method: "post", url: "users", cb: controllers.users.insert},
    {method: "get", url: "users/:id", cb: controllers.users.getById},
    {method: "delete", url: "users/:id", cb: controllers.users.delete},
    {method: "put", url: "users/:id", cb: controllers.users.update},

    {method: "get", url: "movies", cb: controllers.movies.getAll},
    {method: "post", url: "movies", cb: controllers.movies.insert},
    {method: "delete", url: "movies/:show_id", cb: controllers.movies.delete},
    {method: "put", url: "movies/:show_id", cb: controllers.movies.update},
    {method: "get", url: "movies/:show_id", cb: controllers.movies.getMovieById},
    {method: "get", url: "movies/:title/cast", cb: controllers.movies.getCastByTitle}


].forEach(({method, url, cb}) => {
    app[method](apiUrl(url), protectPaths, cb);
});

app.post(apiUrl("login"), controllers.users.login);

app.listen(config.port, () => {
    console.log(`api is listening on port ${config.port}!`)
});
