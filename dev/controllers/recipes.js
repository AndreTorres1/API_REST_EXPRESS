const services = require("../services");

module.exports = {

    getAll: async (req, res) => {
        return services.recipes
            .getAll()
            .then(recipes => res.status(200).send(recipes));
    },

    getById: async(req, res) => {
        try {
            let recipe = await services.recipes.getById(req.params.id);
            res.status(200).send(recipe);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },

    getIngredientsByRecipeId: async(req, res) => {
        try {
            res.status(200).send(
                await services.recipes.getIngredients(req.params.id)
            );
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },

    getCondimentsByRecipeId: async(req, res) => {
        try {
            res.status(200).send(
                await services.recipes.getIngredientsByType(req.params.id,"condiments")
            );
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    }

}