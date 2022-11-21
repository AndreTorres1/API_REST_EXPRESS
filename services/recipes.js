const database = require("../database-json");

module.exports = {

    getByName: (name) => {

        let recipes = database.filter(r => r.name === name);
        if(recipes.length > 0) {
            return recipes[0];
        }

        throw new Error(`Recipe with name='${name}' not found!`);
    }

}