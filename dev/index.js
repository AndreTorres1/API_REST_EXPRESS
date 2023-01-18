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
const checkUserRole = require('./jwt/checkRole');

const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerConfig));


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
    app[method](apiUrl(url), checkUserRole('admin'), cb);
});
[
    {method: "get", url: "version", cb: controllers.version.get},

    {method: "get", url: "edit/movies", cb: controllers.movies.getAll},
    {method: "post", url: "edit/movies", cb: controllers.movies.insert},
    {method: "delete", url: "edit/movies/:show_id", cb: controllers.movies.delete},
    {method: "put", url: "edit/movies/:show_id", cb: controllers.movies.update},
    {method: "get", url: "edit/movies/:show_id", cb: controllers.movies.getMovieById},
    {method: "get", url: "edit/movies/:title/cast", cb: controllers.movies.getCastByTitle}

].forEach(({method, url, cb}) => {
    app[method](apiUrl(url), checkUserRole('edit'), cb);
});

[
    {method: "get", url: "version", cb: controllers.version.get},

    {method: "get", url: "view/movies", cb: controllers.movies.getAll}

].forEach(({method, url, cb}) => {
    app[method](apiUrl(url), checkUserRole('view'), cb);
});

app.post(apiUrl("login"), controllers.users.login);

app.listen(config.port, () => {
    console.log(`api is listening on port ${config.port}!`)
});
