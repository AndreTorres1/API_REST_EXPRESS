const assert = require('assert');

describe('[controller] version', () => {

    describe('/api/v1/version', () => {
        it('should return the current version of the application', async () => {
            const response = await fetch('http://localhost:4000/api/v1/version');
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('content-type'), 'application/json; charset=utf-8');
            const {version} = await response.json();
            assert.equal(version, "0.2");
        });
    });

});
