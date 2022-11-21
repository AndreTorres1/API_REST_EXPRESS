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

exports.up = function(db, callback) {
  return db.createTable('recipe_ingredients', {
    recipe_id: {
      primaryKey: true,
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'fk_recipe_ingredients__recipes__id',
        table: 'recipes',
        rules: {
          onDelete: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    ingredient_id: {
      primaryKey: true,
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'fk_recipe_ingredients__ingredients__id',
        table: 'ingredients',
        rules: {
          onDelete: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    quantity: "string"
  }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
