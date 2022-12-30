'use strict';

const csvParser = require('csv-parser');
const migrate = require('db-migrate');
const fs = require('fs');
const {set} = require("express/lib/application");
const {callback} = require("pg/lib/native/query");

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};


exports.up = function (db, callback) {
    const parser = require('csv-parser');
    const fs = require('fs');

    fs.createReadStream('netflix_titles.csv')
        .pipe(parser())
        .on('data', row => {
            // Insert data into the 'movies' table
            const values = [
                row.type,
                row.title,
                row.director,
                row.cast,
                row.country,
                row.date_added,
                row.release_year,
                row.rating,
                row.duration,
                row.listed_in,
                row.description
            ];
            const sql =
                'INSERT INTO movies(type, title, director,"cast",country,date_added,release_year,rating,duration,listed_in,description) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11)';
            db.runSql(sql, values, function (err) {
                if (err) throw err;
                console.log(sql);
            });
        })
        .on('end', () => {
            // Insert data into the 'cast' table
            fs.createReadStream('netflix_titles.csv')
                .pipe(parser())
                .on('data', row => {
                    const cast = [row.cast];
                    const sqlcast = 'INSERT INTO "cast"( "cast" ) VALUES ($1)';
                    db.runSql(sqlcast, cast, function (err) {
                        if (err) throw err;
                        console.log(sqlcast);
                    });
                })
                .on('end', () => {
                    // Insert data into the 'title' table
                    fs.createReadStream('netflix_titles.csv')
                        .pipe(parser())
                        .on('data', row => {
                            const title = [row.title];
                            const sqltitle = 'INSERT INTO title(title) VALUES ($1)';
                            db.runSql(sqltitle, title, function (err) {
                                if (err) throw err;
                                console.log(sqltitle);
                            });
                        })
                        .on('end', () => {
                            // Call the callback function to signal that the migration is complete
                            callback();
                        });
                });
        });

};

exports.down = function (db, callback) {
    db.runSql('TRUNCATE TABLE movies;', function (err) {
        if (err) throw err;
        callback();
    });
};

exports._meta = {
    "version": 1
};
