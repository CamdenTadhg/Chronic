"use strict";
process.env.NODE_ENV === "test";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app');
const User = require('../models/user');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    u1Token,
    u2Token,
    u3Token
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**POST  /users/ */

describe('POST /users/', function() {
    test('works for admin to create user', async function(){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'new@test.com',
                password: 'password',
                name: 'New User', 
                isAdmin: false
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            user: {
                userId: expect.any(Number),
                email: 'new@test.com', 
                name: 'New User', 
                isAdmin: false
            }
        });
    });
    test('works for admin to create admin', async function(){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'new2@test.com',
                password: 'password',
                name: 'Second New User', 
                isAdmin: true
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            user: {
                userId: expect.any(Number),
                email: 'new2@test.com', 
                name: 'Second New User', 
                isAdmin: true
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'new3@test.com',
                password: 'password',
                name: 'New User', 
                isAdmin: false
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function (){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'new4@test.com',
                password: 'password',
                name: 'New User', 
                isAdmin: false
            });
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'new5@test.com',
                name: 'New User',
                isAdmin: false
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "password"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'new6test.com',
                password: 'password',
                name: 'New User',
                isAdmin: false
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.email');        
    });
    test('bad request with duplicate email', async function(){
        const resp = await request(app)
            .post('/users/')
            .send({
                email: 'u1@test.com',
                password: 'password',
                name: 'New User',
                isAdmin: false
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('There is already an account for u1@test.com'); 
    });
});

/**GET /users/ */

describe('GET /users/', function(){
    test('works for admin to get user list', async function(){
        const resp = await request(app)
            .get('/users/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            users: [
                {
                    userId: 1,
                    email: 'u1@test.com', 
                    name: 'U1',
                    isAdmin: false,
                    registrationDate: expect.any(Date), 
                    lastLogin: expect.any(Date)
                },
                {
                    userId: 2,
                    email: 'u2@test.com', 
                    name: 'U2',
                    isAdmin: false,
                    registrationDate: expect.any(Date), 
                    lastLogin: expect.any(Date)
                },
                {
                    userId: 3,
                    email: 'u3@test.com', 
                    name: 'U3',
                    isAdmin: false,
                    registrationDate: expect.any(Date), 
                    lastLogin: expect.any(Date)
                }
            ]
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .get('/users/')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/users/');
        expect(resp.statusCode).toEqual(401);
    });
    test('fails: test next() handler', async function(){
        //does this route work with the error handler?
        await db.query("DROP TABLE users CASCADE");
        const resp = await request(app)
            .get("/users")
            .set("authorization", u2Token);
        expect(resp.statusCode).toEqual(500);
    });
});

/**GET /users/:userId */

describe('GET /users/:userId', function() {
    test('works for matching user', async function(){
        const resp = await request(app)
            .get('/users/1')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            user: {
                userId: 1,
                email: 'u1@test.com', 
                name: 'U1', 
                isAdmin: false,
                lastLogin: expect.any(Date),
                diagnoses: [
                    {
                        diagnosis: 'D1', 
                        keywords: ["pain"]
                    }
                ],
                symptoms: ['S1'],
                medications: [
                    {
                        medication: 'M1', 
                        dosageNum:300,
                        dosageUnit: 'mg',
                        timeOfDay: ['AM', 'PM']
                    }
                ]
            }
        });
    });
    test('works for admin', async function(){
        const resp = await request(app)
            .get('/users/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            user: {
                userId: 1,
                email: 'u1@test.com', 
                name: 'U1', 
                isAdmin: false,
                lastLogin: expect.any(Date),
                diagnoses: [
                    {
                        diagnosis: 'D1', 
                        keywords: ["pain"]
                    }
                ],
                symptoms: ['S1'],
                medications: [
                    {
                        medication: 'M1', 
                        dosageNum:300,
                        dosageUnit: 'mg',
                        timeOfDay: ['AM', 'PM']
                    }
                ]
            }
        });
    });
    test('forbidden for other users', async function(){
        const resp = await request(app)
            .get('/users/1')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymouse', async function(){
        const resp = await request(app)
            .get('/users/1');
        expect(resp.statusCode).toEqual(401);
    });
    test('not found if user not found', async function(){
        const resp = await request(app)
            .get('/users/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such user exists');
    });
});

/**PATCH /users/:userId */

describe('PATCH /users/:userId', function(){
    test('works for matching user', async function(){
        const resp = await request(app)
            .patch('/users/1')
            .send({
                name: 'New Name'
            })
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            user: {
                userId: 1,
                email: 'u1@test.com',
                name: 'New Name', 
                isAdmin: false
            }
        });
    });
    test('works to change password', async function(){
        const resp = await request(app)
            .patch('/users/1')
            .send({
                password: 'newpassword'
            })
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            user: {
                userId: 1,
                email: 'u1@test.com',
                name: 'New Name', 
                isAdmin: false
            }
        });
        const isSuccessful = await User.authenticate('u1@test.com', 'newpassword');
        expect(isSuccessful).toBeTruthy();
    });
    test('works for admin', async function(){
        const resp = await request(app)
            .patch('/users/1')
            .send({
                name: 'Newer Name'
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            user: {
                userId: 1,
                email: 'u1@test.com',
                name: 'Newer Name', 
                isAdmin: false
            }
        });
    });
    test('forbidden for other users', async function(){
        const resp = await request(app)
            .patch('/users/1')
            send({
                name: 'New Name'
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymouse', async function(){
        const resp = await request(app)
            .patch('/users/1')
            send({
                name: 'New Name'
            });
        expect(resp.statusCode).toEqual(401);
    });
    test('not found if user not found', async function(){
        const resp = await request(app)
            .patch('/users/0')
            send({
                name: 'New Name'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such user exists');
    });
    test('bad request if invalid data', async function(){
        const resp = await request(app)
            .patch('/users/1')
            .send({
                email: 'u1test.com'
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.email');
    });
    test('bad request if duplicate email', async function(){
        const resp = await request(app)
            .post('/users/3')
            .send({
                email: 'u1@test.com'
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('There is already an account');
    });
});

/**DELETE /users/:userId */

describe('DELETE /users/:userId', function(){
    test('works for matching user', async function(){
        const resp = await request(app)
            .delete('/users/1')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({deleted: 1});
    });
    test('works for admin', async function(){
        const resp = await request(app)
            .delete('/users/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: 1});
    });
    test('forbidden for other users', async function(){
        const resp = await request(app)
            .delete('/users/1')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete('/users/1');
        expect(resp.statusCode).toEqual(401);
    });
    test('not found if user not found', async function(){
        const resp = await request(app)
            .delete('/users/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
    });
});