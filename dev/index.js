const express = require("express");
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const config = require('./config');
const swaggerConfig = {
    ...require("./doc/swagger.json"),
    host:       `${config.hostname}:${config.port}`,
    basePath:   `${config.baseUrl}`
};


const apiUrl = require("./api-url");
const controllers = require("./controllers");
const swaggerDocument = require("./doc/swagger.json");
const swaggerUi = require("swagger-ui-express");


const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerConfig));


[
    { method: "get",    url: "version",                             cb: controllers.version.get    },

    { method: "get",    url: "recipes",                             cb: controllers.recipes.getAll },
    { method: "post",   url: "recipes",                             cb: controllers.recipes.insert },

    { method: "get",    url: "recipes/:id",                         cb: controllers.recipes.getById },
    { method: "get",    url: "recipes/:id/ingredients",             cb: controllers.recipes.getIngredientsByRecipeId},
    { method: "get",    url: "recipes/:id/ingredients/condiments",  cb: controllers.recipes.getCondimentsByRecipeId}

].forEach(({method, url, cb}) => {
    app[method](apiUrl(url), cb);
});

app.listen(config.port, () => {
    console.log(`api is listening on port ${config.port}!`)
});
