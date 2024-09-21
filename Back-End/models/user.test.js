"use strict"
process.env.NODE_ENV === "test";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');
const db = require('../db.js');
const User = require("./user.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require('./_testCommon.js');
const { describe, default: test } = require('node:test');
const { expect } = require('vitest');
const { fail } = require('assert');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**User.authenticate  */

describe('User.authenticate', function () {
    test('works with correct info', async function () {
        const user = await User.authenticate('u1', 'password');
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u1@test.com',
            name: 'U1', 
            isAdmin: false
        });
    });
    test('unauthorized if email is wrong', async function() {
        try {
            await User.authenticate('u4', 'password');
            fail();
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
    });
    test('unauthorized if password is wrong', async function () {
        try  {
            await User.authenticate('u1', 'wrong');
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
    });
});

/**User.register */

describe('User.register', function () {
    test('works with full info', async function () {
        const user = await User.register({
            email: 'u4@test.com', 
            name: 'U4',
            isAdmin: false,
            password: 'password'
        });
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u4@test.com', 
            name: 'U4', 
            isAdmin: false,
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'U4'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password).startsWith('$2b$').toEqual(true);
    });
    test('bad request with duplicate email', async function(){
        try{
            await User.register({
                email: 'u1@test.com', 
                name: 'U5', 
                isAdmin: false,
                password: 'password'
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        };
    });
});

/**User.create */

describe('User.create', function(){
    test('works with full info', async function(){
        const user = await User.create({
            email: 'u5@test.com',
            name: 'U5', 
            isAdmin: false,
            password: 'password'
        });
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u5@test.com',
            name: 'U5',
            isAdmin: false
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'U5'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password).startsWith('$2b$').toEqual(true);
    });
    test('bad request with duplicate email', async function(){
        try {
            await User.register({
                email: 'u1@test.com',
                name: 'U5',
                isAdmin: false,
                password: 'password'
            });
            fail()
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        };
    });
})

/**User.getAll */

describe('User.getAll', function(){
    test('works', async function(){
        const users = await User.getAll();
        expect(users).toEqual([
            {
                userId: expect.any(Number),
                email: 'u1@test.com', 
                name: 'U1', 
                isAdmin: false
            },
            {
                userId: expect.any(Number),
                email: 'u2@test.com', 
                name: 'U2',
                isAdmin: false
            },
            {
                userId: expect.any(Number),
                email: 'u3@test.com',
                name: 'U3',
                isAdmin: false
            }
        ]);
    });
});

/**User.getOne */

describe('User.getOne', function(){
    test('works for valid user', async function(){
        const user = await User.getOne('u1@test.com');
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u1@test.com', 
            name: 'U1', 
            isAdmin: false,
            diagnoses: [
                {
                    diagnosis: 'D1',
                    keywords: ['pain']
                }
            ],
            symptoms: ['S1'],
            medications: [
                {
                    medication: 'M1',
                    dosageNum: 200,
                    dosageUnit: 'mg', 
                    timeOfDay: ['AM', 'PM'] 
                },
                {
                    medication: 'M2',
                    dosageNum: 150,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM']
                },
                {
                    medication: 'M3', 
                    dosageNum: 1,
                    dosageUnit: 'pill', 
                    timeOfDay: ['AM', 'Midday', 'PM', 'Evening']
                }
            ]
        });
    });
    test('Notfound error for invalid user', async function(){
        try {
            await User.getOne('U6');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**User.edit */

describe('User.edit', function(){
    test('works for valid user', async function(){
        const userId = await db.query(`SELECT user_id FROM users WHERE email = 'u1@test.com'`)
    });
    test('works to change a password', function(){});
    test('NotFound error if invalid user', function(){});
});

/**User.delete */

describe('User.delete', function(){
    test('works for valid user', function(){});
    test('NotFound error for invalid user', function(){});
});

/**User.assignDiag */

describe('User.assignDiag', function(){
    test('works with valid data', function(){});
    test('NotFound error for invalid user', function(){});
    test('NotFound error for invalid diagnosis', function(){});
});

/**User.assignSymp */

describe('User.assignSymp', function(){
    test('works with valid data', function(){});
    test('NotFound error for invalid user', function(){});
    test('NotFound error for invalid symptom', function(){});
});

/**User.assignMed */

describe('User.assignMed', function(){
    test('works with valid data', function(){});
    test('NotFound error for invalid user', function(){});
    test('NotFound error for invalid med', function(){});
});