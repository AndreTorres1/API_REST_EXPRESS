'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('movie_cast', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    movie_id: { type: 'int', notNull: true, foreignKey: {
        name: 'movie_cast_movie_id_fk',
        table: 'movies',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'show_id'
      }},
    cast_id: { type: 'int', notNull: true, foreignKey: {
        name: 'movie_cast_cast_id_fk',
        table: 'cast',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }}
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('movie_cast', callback);
};


exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
