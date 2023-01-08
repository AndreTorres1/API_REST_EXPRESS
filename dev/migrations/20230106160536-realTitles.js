'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
const fs = require('fs');
const parser = require('csv-parser');
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    const uniqueTitles = new Set();
    const uniqueCast = new Set();

    fs.createReadStream('netflix_titles.csv')
        .pipe(parser())
        .on('data', row => {
            uniqueTitles.add(row.title);
            uniqueCast.add(row.cast);
        })
        .on('end', () => {
            const uniqueRows = [];

            fs.createReadStream('netflix_titles.csv')
                .pipe(parser())
                .on('data', row => {
                    if (uniqueTitles.has(row.title) && uniqueCast.has(row.cast)) {
                        uniqueRows.push(row);
                        uniqueTitles.delete(row.title);
                        uniqueCast.delete(row.cast);
                    }
                })
                .on('end', () => {
                    const csvColumns = ['show_id','type', 'title', 'director', 'cast', 'country', 'date_added', 'release_year', 'rating', 'duration', 'listed_in', 'description'];
                    fs.writeFile('C:\\Users\\mcpan\\WebstormProjects\\newprojectsd\\sd\\dev\\netflix_real_titles.csv', csvColumns.join(',') + '\n' + uniqueRows.map(row => Object.values(row).join(',')).join('\n'), () => {
                        callback();
                    });
                });
        });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
