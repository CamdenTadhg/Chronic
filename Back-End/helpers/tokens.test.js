process.env.NODE_ENV === "test";

const jwt = require('jsonwebtoken');
const {createToken } = require('./tokens');
const {SECRET_KEY} = require('../config');


describe('createToken', function () {
    test('works for non-admin', function () {
        const token = createToken({user_id: 1, email: 'test@test.com', is_admin: false});
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            userId: 1,
            email: 'test@test.com',
            isAdmin: false,
        });
    });

    test('works for admin', function () {
        const token = createToken({user_id: 2, email: 'camdent@gmail.com', is_admin: true});
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            userId: 2,
            email: 'camdent@gmail.com',
            isAdmin: true,
        });
    });

    test('works for default non-admin', function () {
        const token = createToken({user_id: 3, email: 'test@test.com'});
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            userId: 3,
            email: 'test@test.com',
            isAdmin: false,
        });
    });
});