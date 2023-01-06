'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports._meta = {
  version: 1
}
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  return db.createTable('movies', {
    show_id: { type: 'string', primaryKey: true, autoIncrement: true },
    type: 'string',
    title: 'string',
    director: 'string',
    cast: 'string',
    country: 'string',
    date_added: 'string',
    release_year: 'integer',
    rating: 'string',
    duration: 'string',
    listed_in: 'string',
    description: 'string'

  }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
