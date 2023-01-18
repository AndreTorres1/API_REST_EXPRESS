const services = require("../services");
const bcrypt = require("bcryptjs");
module.exports = {

    getAll: async (req, res) => {
        return services.movies
            .getAll()
            .then(movies => res.status(200).send(movies));
    },

    getMovieById: async (req, res) => {
        try {
            let movie = await services.movies.getMovieById(req.params.show_id);
            res.status(200).send(movie);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },

    getCastByTitle: async (req, res) => {
        try {
            console.log(req.params.title);
            let movie = await services.movies.getCastByTitle(req.params.title);
            res.status(200).send(movie);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },

    delete: async (req, res) => {
        try {
            const show_id = req.params.show_id;
            await services.movies.delete(show_id);
            res.sendStatus(204);
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    },
    update: async (req, res) => {
        try {
            const {
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
            } = req.body;
            const id = req.params.show_id
            let user = await services.movies.update({
                id: id,
                type: type,
                title: title,
                director: director,
                cast: cast,
                country: country,
                date_added: date_added,
                release_year: release_year,
                rating: rating,
                duration: duration,
                listed_in: listed_in,
                description: description
            });
            res.status(200).send(user);
        } catch ({message}) {
            res.status(404).send({error: message});
        }
    },
    insert: async (req, res) => {

        try {
            const {
                type,
                title,
                director,
                cast,
                country,
                date_added,
                rating,
                duration,
                listed_in,
                description,
                release_year
            } = req.body;

            res.status(201).send(
                await services.movies.insert({
                    type,
                    title,
                    director,
                    cast,
                    country,
                    date_added,
                    rating,
                    duration,
                    listed_in,
                    description,
                    release_year,
                })
            );
        } catch ({message}) {
            res.status(400).send({error: message});
        }
    }

}
