const assert = require('assert');

describe('[controller] recipes', () => {

    describe('/api/v1/recipes', () => {
        it('should return all the recipes', async () => {
            const response = await fetch('http://localhost:4000/api/v1/recipes');
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('content-type'), 'application/json; charset=utf-8');
            const recipes = await response.json();
            assert.equal(recipes.length, 5);
        });
    });

});
