const db = require('../database');

const {v4: uuidv4} = require('uuid');
module.exports = {

    getAll: async () => {
        return db.query(`
            SELECT *
            FROM movies
        `).then(q => q.rows);
    },

    getMovieById: async (show_id) => {
        const user = await db.query(`
            SELECT *
            FROM movies
            WHERE show_id = $1
        `, [show_id]).then(q => q.rows);

        if (user.length > 0) {
            return user[0];
        }
    },
    getCastByTitle: async (title) => {
        const movie = await db.query(`
            SELECT cast_id
            FROM title_cast
            WHERE title_id = $1
        `, [title]).then(q => q.rows);

        if (movie.length > 0) {
            return movie[0];
        }
    },


    // getIngredientsByType: async(id, type) => {
    //     return await db.query(`
    //         SELECT
    //           i.name,
    //           i.type,
    //           ri.quantity
    //         FROM
    //           recipe_ingredients ri JOIN ingredients i ON
    //             ri.ingredient_id = i.id
    //         WHERE
    //           ri.recipe_id = $1 AND
    //           i.type = $2
    //     `, [id, type]).then(q => q.rows);
    // },
    delete: async (show_id) => {

        const result = await db.query(
            `DELETE
             FROM movies
             WHERE show_id = $1`,
            [show_id]
        );

        if (result.rowCount === 0) {
            throw new Error(`Movie with show_id '${show_id}' not found`);
        }

    },
    update: async ({
                       id,
                       type,
                       title,
                       director,
                       cast,
                       country,
                       date_added,
                       release_year,
                       rating,
                       duration,
                       listed_in,
                       description
                   }) => {
        return db.query(`
            UPDATE movies
            SET type         = $2,
                title        = $3,
                director     = $4,
                "cast"       = $5,
                country      = $6,
                date_added   = $7,
                release_year = $8,
                rating       = $9,
                duration     = $10,
                listed_in    = $11,
                description  = $12
            WHERE show_id = $1 RETURNING *
        `, [id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description]).then(q => q.rows);
    },

    insert: async ({
                       type = "",
                       title = "",
                       director = "",
                       cast = "",
                       country = "",
                       date_added = "",
                       rating = "",
                       duration = "",
                       listed_in = "",
                       description = "",
                       release_year
                   }) => {

        const moviesWithSameTitle = await db.query(`
            SELECT *
            FROM movies
            WHERE title = $1
        `, [title]).then(q => q.rows);

        if (moviesWithSameTitle.length > 0) {
            throw new Error(`A movie with the title '${title}' already exists`);
        }
        return db.query(`
            INSERT INTO movies(type, title, director, "cast", country, date_added, rating, duration,
                               listed_in, description, release_year)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `, [type, title, director, cast, country, date_added, rating, duration, listed_in, description, release_year]).then(q => q.rows);
    }
}