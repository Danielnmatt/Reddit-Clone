const request = require('supertest');
const {app} = require('./server');

describe('Express server Test', () => {
    test("Server is listening on port 8000", async () => {
        const res = await request(app).get('/port');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("8000")
    });
});
