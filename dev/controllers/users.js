const services = require("../services");
const bcrypt = require("bcryptjs");
const db = require("../database");
const jwt = require("jsonwebtoken");
const secret = 'secret';
const verifyToken = require('../jwt/verifyJWT')
const {verify} = require("jsonwebtoken");

function jwtTokens({id, email, role}) {
    const user = {id, email, role};
    const accessToken = jwt.sign(user, secret, {expiresIn: '20m'});
    return ({accessToken});
}

module.exports = {

    getAll: async (req, res) => {
        return services.users
            .getAll()
            .then(users => res.status(200).send(users));
    },

    getById: async (req, res) => {
        try {
            let user = await services.users.getById(req.params.id);
            res.status(200).send(user);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },


    update: async (req, res) => {
        try {
            const {
                email,
                password,
                role
            } = req.body;
            const hash = await bcrypt.hashSync(password, 10)
            let user = await services.users.update({
                id: req.params.id,
                email: email,
                password: hash,
                role: role
            });
            res.status(200).send(user);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },

    insert: async (req, res) => {
        try {
            const {
                email,
                password,
                role
            } = req.body;
            const hash = await bcrypt.hashSync(password, 10)


            res.status(201).send(
                await services.users.insert({
                    email, password: hash, role: role
                })
            );
        } catch ({message}) {
            res.status(400).send({error: message});
        }
    },
    delete: async (req, res) => {
        try {
            let result = await services.users.delete(req.params.id);
            res.status(200).send(result);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },


    login: async (req, res) => {
        try {
            const {email, password} = req.body;
            const users = await db.query(`SELECT *
                                          FROM users
                                          WHERE email = $1`, [email]);

            if (users.rows.length === 0) return res.status(401).json({error: 'email incorrect'})
            const validPassword = await bcrypt.compare(password, users.rows[0].password);
            if (!validPassword) return res.status(401).json({error: 'password incorrect'});

            const tokens = jwtTokens(users.rows[0]);

            res.json(tokens)
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

}