'use strict';

const {max} = require("pg/lib/defaults");
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

async function load_data(db) {
    return require("./initial_data.json");
}

function import_data(db, recipes) {
    let queries = [];

    const ingredients = recipes
        .map(r => r.ingredients
            .map(i => {
                return { name: i.name?.trim()?.toLocaleLowerCase(), type: i.type?.trim()?.toLocaleLowerCase() }
            })
        )
        .flat()
        .map(i => [
            `${i.name}-${i.type}`, // key
            i
        ]);

    // import ingredients
    let inserted_ingredients = {};
    for (let [key, ingredient] of ingredients) {
        if(inserted_ingredients[key]) {
            continue;
        }

        inserted_ingredients[key] = ingredient;

        queries.push(db.insert(
            "ingredients",
            ["name", "type"],
            [ingredient.name, ingredient.type]
        ));
    }

    // import recipes
    for(let recipe of recipes) {
        queries.push(db.insert(
            "recipes",
            ["name", "image_url", "original_url"],
            [recipe.name, recipe.imageURL||"", recipe.originalURL||""]
        ));

        // create steps
        for(let i = 0; i < recipe.steps.length; ++i) {
            queries.push(db.runSql(`
                INSERT INTO
                  recipe_steps(recipe_id, description, time)
                VALUES (
                  (SELECT id FROM recipes WHERE name = ? LIMIT 1),
                  ?,
                  ?
                )
            `, [recipe.name, recipe.steps[i], recipe.timers[i]]));
        }

        // create ingredients
        for(let {quantity, name, type} of recipe.ingredients) {
            queries.push(db.runSql(`
                INSERT INTO
                  recipe_ingredients(recipe_id, ingredient_id, quantity)
                VALUES (
                  (SELECT id FROM recipes WHERE name = ? LIMIT 1),
                  (SELECT id FROM ingredients WHERE name = ? AND type = ? LIMIT 1),
                  ?
                )
            `, [recipe.name, name?.trim()?.toLocaleLowerCase(), type?.trim()?.toLocaleLowerCase(), quantity]));
        }
    }

    return Promise.all(queries);
}

exports.up = function(db) {
    return load_data(db).then(data => import_data(db, data));
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
