const db = require('../database');
const {v4: uuidv4} = require('uuid');
const {message} = require("db-migrate/lib/transitions/1");


module.exports = {

    getAll: async () => {
        return db.query(`
            SELECT *
            FROM users
        `).then(q => q.rows);
    },

    getById: async (id) => {

        const users = await db.query(`
            SELECT *
            FROM users
            WHERE id = $1
        `, [id]).then(q => q.rows);

        if (users.rowCount > 0) {
            return new message(`User with id='${id}' not found!`);
            ;
        }
    },


    // getIngredients: async(id) => {
    //     return await db.query(`
    //         SELECT
    //           i.name,
    //           i.type,
    //           ri.quantity
    //         FROM
    //           recipe_ingredients ri JOIN ingredients i ON
    //             ri.ingredient_id = i.id
    //         WHERE
    //           ri.recipe_id = $1
    //     `, [id]).then(q => q.rows);
    // },

    delete: async (show_id) => {
        const {rowCount} = await db.query(`
            DELETE
            FROM movies
            WHERE show_id = $1
        `, [show_id]);

        if (rowCount === 0) {
            throw new Error(`Movie with show_id '${show_id}' not found`);
        }

        return {message: `Movie with show_id '${show_id}' deleted`};
    },
    update: async ({id, email, password, permissao}) => {
        return db.query(`
            UPDATE users
            SET email     = $2,
                password  = $3,
                permissao = $4
            WHERE id = $1 RETURNING *
        `, [id, email, password, permissao]).then(q => q.rows);
    },

    insert: async ({id = uuidv4(), email = "", password = "hash", permissao = ""}) => {

        const result = await db.query(`
            SELECT *
            FROM users
            WHERE email = $1
        `, [email]);


        if (result.rows.length === 0) {
            return db.query(`
                INSERT INTO users(id, email, password, permissao)
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [id, email, password, permissao]).then(q => q.rows);
        } else {

            throw new Error('Email already exists');
        }
    }


}