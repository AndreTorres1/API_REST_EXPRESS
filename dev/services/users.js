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

        if (users.rowCount === 0) {
            return new message(`User with id='${id}' not found!`);
        }
        return users;
    },

    delete: async (id) => {
        const {rowCount} = await db.query(`
            DELETE
            FROM users
            WHERE id = $1
        `, [id]);

        if (rowCount === 0) {
            throw new Error(`User with id '${id}' not found`);
        }

        return {message: `User with ID '${id}' deleted`};
    },
    update: async ({id, email, password, role}) => {
        return db.query(`
            UPDATE users
            SET email    = $2,
                password = $3,
                role     = $4
            WHERE id = $1 RETURNING *
        `, [id, email, password, role]).then(q => q.rows);
    },

    insert: async ({id = uuidv4(), email = "", password = "hash", role = ""}, res) => {
        const validRoles = ["admin", "edit", "view"];
        if (!validRoles.includes(role)) {

            return {message: `use a valid role like: "admin" "edit" "view"`}
        }
        const result = await db.query(`
            SELECT *
            FROM users
            WHERE email = $1
        `, [email]);


        if (result.rows.length === 0) {
            return db.query(`
                INSERT INTO users(id, email, password, role)
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [id, email, password, role]).then(q => q.rows);
        } else {

            throw new Error('Email already exists');
        }
    }


}