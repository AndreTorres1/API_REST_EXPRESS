const db = require('../database');

module.exports = {

    getAll: async() => {
        return db.query(`
          SELECT
            *
          FROM 
            recipes
        `).then(q => q.rows);
    },

    getById: async (id) => {

        const recipes = await db.query(`
            SELECT 
              * 
            FROM
              recipes
            WHERE
              id = $1
        `, [id]).then(q => q.rows);

        if(recipes.length > 0) {
            return recipes[0];
        }

        throw new Error(`Recipe with id='${id}' not found!`);
    },

    getIngredients: async(id) => {
        return await db.query(`
            SELECT 
              i.name,
              i.type,
              ri.quantity
            FROM
              recipe_ingredients ri JOIN ingredients i ON
                ri.ingredient_id = i.id
            WHERE
              ri.recipe_id = $1
        `, [id]).then(q => q.rows);
    },

    getIngredientsByType: async(id, type) => {
        return await db.query(`
            SELECT 
              i.name,
              i.type,
              ri.quantity
            FROM
              recipe_ingredients ri JOIN ingredients i ON
                ri.ingredient_id = i.id
            WHERE
              ri.recipe_id = $1 AND 
              i.type = $2
        `, [id, type]).then(q => q.rows);
    },

    insert: async({name, imageUrl = "", originalUrl = ""}) => {
        return db.query(`
            INSERT INTO
              recipes(name, image_url, original_url)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [name, imageUrl, originalUrl]).then(q => q.rows);
    }

}