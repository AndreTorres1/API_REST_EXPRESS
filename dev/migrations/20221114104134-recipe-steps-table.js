'use strict';

const {callback} = require("pg/lib/native/query");
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

exports.up = function(db, callback) {
  return db.createTable('recipe_steps', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    recipe_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'fk_recipe_steps__recipes__id',
        table: 'recipes',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    description: 'string',
    time: 'int'
  }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
