"use strict"
process.env.NODE_ENV === "test"

const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
} = require('./_testCommon');
const { default: test } = require("node:test");
const { expect } = require("vitest");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**POST /auth/signin */

describe("POST /auth/signin", function () {
    test('works with correct data', async function () {
        const resp = await request(app)
            .post("/auth/signin")
            .send({
                email: 'u1@test.com',
                password: "password"
            });
        expect(resp.body).toEqual({
            "token": expect.any(String)
        });
    });

    test('unauth with unfound user', async function () {
        const resp = await request(app)
            .post('/auth/signin')
            .send({
                email: "u5@test.com",
                password: 'password'
            });
        expect(resp.statusCode).toEqual(401);
    });

    test('unauth with wrong password', async function () {
        const resp = await request(app)
            .post('/auth/signin')
            .send({
                email: 'u1@test.com',
                password: 'fakepassword'
            });
        expect(resp.statusCode).toEqual(401);
    });

    test('bad request with missing data', async function () {
        const resp = await request(app)
            .post('/auth/signin')
            .send({
                password: 'password'
            });
        expect(resp.statusCode).toEqual(400);
    });

    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/auth/signin')
            .send({
                email: 'iamnotanemail',
                password: 'password'
            });
        expect(resp.statusCode).toEqual(400);
    });
});

/**POST /auth/register */

describe('POST /auth/register', function () {
    test('works to register', async function () {
        const resp = await request(app)
            .post('/auth/register')
            .send({
                password: 'password',
                name: 'New User',
                email: 'new@test.com'
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "token": expect.any(String)
        });
    });

    test('bad request with missing data', async function () {
        const resp = await request(app)
            .post('/auth/register')
            .send({
                password: 'password', 
                name: 'Incomplete User'
            });
        expect(resp.statusCode).toEqual(400);
    });

    test('bad request with invalid data', async function () {
        const resp = await request(app)
            .post('/auth/register')
            .send({
                password: 'password',
                name: 'Invalid User',
                email: 'iamnotanemail'
            });
        expect(resp.statusCode).toEqual(400);
    });
});
