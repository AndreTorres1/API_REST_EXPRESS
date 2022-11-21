const database = require("../database-json");

const services = require("../services");

module.exports = {

    getAll: async (req, res) => {
        res.send(database);
    },

    getByName: async(req, res) => {
        try {
            res.send(
                services.recipes.getByName(req.params.name)
            );
        } catch (err) {
            res.status(404).send(err);
        }
    },

    getIngredientsByRecipeName: async(req, res) => {
        try {
            res.send(
                services.recipes.getByName(req.params.name)?.ingredients||[]
            );
        } catch (err) {
            res.status(404).send(err);
        }
    },

    getCondimentsByRecipeName: async(req, res) => {
        try {
            res.send(
                services.recipes.getByName(req.params.name)
                    ?.ingredients
                    ?.filter(ing => ing.type === "Condiments")
                    ?.map(ing => ing.name)
                ||[]
            );
        } catch (err) {
            res.status(404).send(err);
        }
    }

}