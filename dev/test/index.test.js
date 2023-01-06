const request = require('supertest');
const app = require('../index');

describe('API REST', () => {
    it('should get all users', (done) => {
        request(app)
            .get('/api/v1/users')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                done();
            });
    });
});
