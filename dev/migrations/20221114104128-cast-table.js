'use strict';

const fs = require("fs");
const parser = require("csv-parser");
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
    return db.createTable('title', {
        id: {type: 'int', primaryKey: true, autoIncrement: true}, title: {type: 'string', notNull: true}

    }, function (err) {
        if (err) throw err;

        // Create the 'cast' table
        db.createTable('cast', {
            id: {type: 'int', primaryKey: true, autoIncrement: true}, cast: {type: 'string', notNull: true}

        }, function (err) {
            if (err) throw err;
            callback();
        });
    });
};

exports.down = function (db, callback) {
    db.dropTable('cast', {cascade: true}, (error) => {
        if (error) throw error;
        db.dropTable('movies', {cascade: true}, (error) => {
            if (error) throw error;
            db.dropTable('title_cast', {cascade: true}, (error) => {
                if (error) throw error;
                db.dropTable('title', {cascade: true}, (error) => {
                    if (error) throw error;

                });
            });

        });

    });
};

exports._meta = {
    "version": 1
};
