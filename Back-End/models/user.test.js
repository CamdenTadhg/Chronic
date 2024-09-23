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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**User.authenticate  */

describe('User.authenticate', function () {
    test('works with correct info', async function () {
        const user = await User.authenticate('u1@test.com', 'password');
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u1@test.com',
            name: 'U1', 
            isAdmin: false,
            lastLogin: expect.any(Date)
        });
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - user.lastLogin);
        expect(timeDifference).toBeLessThan(5000);
    });
    test('unauthorized if email is wrong', async function() {
        try {
            await User.authenticate('u4@test.com', 'password');
            fail();
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
    });
    test('unauthorized if password is wrong', async function () {
        try  {
            await User.authenticate('u1@test.com', 'wrong');
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
            password: 'password'
        });
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u4@test.com', 
            name: 'U4', 
            isAdmin: false,
            lastLogin: expect.any(Date)
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'U4'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - found.rows[0].registration_date);
        expect(timeDifference).toBeLessThan(5000);
        const loginTimeDifference = Math.abs(currentTime - found.rows[0].last_login);
        expect(loginTimeDifference).toBeLessThan(5000);
    });
    test('bad request with duplicate email', async function(){
        try{
            await User.register({
                email: 'u1@test.com', 
                name: 'U5', 
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
            isAdmin: true,
            password: 'password'
        });
        expect(user).toEqual({
            userId: expect.any(Number),
            email: 'u5@test.com',
            name: 'U5',
            isAdmin: true
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'U5'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
        expect(found.rows[0].last_login).toBe(null);
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - found.rows[0].registration_date);
        expect(timeDifference).toBeLessThan(5000);
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
                isAdmin: false,
                registrationDate: expect.any(Date),
                lastLogin: expect.any(Date)
            },
            {
                userId: expect.any(Number),
                email: 'u2@test.com', 
                name: 'U2',
                isAdmin: false,
                registrationDate: expect.any(Date),
                lastLogin: expect.any(Date)
            },
            {
                userId: expect.any(Number),
                email: 'u3@test.com',
                name: 'U3',
                isAdmin: false,
                registrationDate: expect.any(Date),
                lastLogin: expect.any(Date)
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
            lastLogin: expect.any(Date),
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

describe('User.edit', async function(){
    const userId = await db.query(`SELECT user_id FROM users WHERE email = 'u1@test.com'`);
    test('works for valid user', async function(){
        const user = await User.edit(userId, {
            email: 'u1@gmail.com'
        });
        expect(user).toEqual({
            userId: userId,
            email: 'u1@gmail.com',
            name: 'U1',
            isAdmin: false
        });
    });
    test('works to change a password', async function(){
        const user = await User.edit(userId, {
            password: 'new'
        });
        expect(user).toEqual({
            userId: userId,
            email: 'u1@gmail.com',
            name: 'U1', 
            isAdmin: false
        });
        const found = await db.query("SELECT * FROM users WHERE userId = $1", [userId]);
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
    });
    test('NotFound error if invalid user', async function(){
        try {
            await User.edit(0, {
                name: 'U0'
            });
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest if duplicate data', async function (){
        try {
            await User.edit(userId, {
                email: 'u3@test.com'
            });
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**User.delete */

describe('User.delete', function(){

    test('works for valid user', async function(){
        const userId = await db.query(`SELECT user_id FROM users WHERE email = 'u1@test.com'`);
        await User.delete(userId);
        const notfound = await db.query("SELECT * FROM users WHERE email = 'u1@test.com'");
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error for invalid user', async function(){
        try {
            await User.delete(0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**User.assignDiag */

describe('User.assignDiag', function(){
    test('works with valid data', async function(){
        const userId = await db.query("SELECT user_id FROM users WHERE email = 'u3@test.com");
        const diagId = await db.query("SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D2'");
        await User.assignDiag(userId, diagId, ['fatigue']);
        const found = await db.query("SELECT * FROM users_diagnoses WHERE user_id = $1 AND diagnosis_id = $2", [userId, diagId]);
        expect(found.rows.length).toEqual(1);
    });
    test('BadRequest for diagnosis already assigned', async function(){
        try {
            const userId = await db.query("SELECT user_id FROM users WHERE email = 'u3@test.com");
            const diagId = await db.query("SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D3'");
            await User.assignDiag(userId, diagId, ['fatigue']);
            fail();
        } catch (err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test('NotFound error for invalid user', async function(){
        try {
            const diagId = await db.query("SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D2'");
            await User.assignDiag(0, diagId, ['fatigue']);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error for invalid diagnosis', async function(){
        try {
            const userId = await db.query("SELECT user_id FROM users WHERE email = 'u3@test.com");
            await User.assignDiag(userId, 0, []);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**User.assignSymp */

describe('User.assignSymp', function(){
    test('works with valid data', async function(){
        const userId = await db.query("SELECT user_id FROM users WHERE email = 'u2@test.com");
        const sympId = await db.query("SELECT symptom_id FROM symptoms WHERE symptom = 'S1'");
        await User.assignSymp(userId, sympId);
        const found = await db.query("SELECT * FROM users_symptoms WHERE user_id = $1 AND symptom_id = $2", [userId, symptomId]);
        expect(found.rows.length).toEqual(1);
    });
    test('BadRequest error for symptom already assigned', async function(){
        try {
            const userId = await db.query("SELECT user_id FROM users WHERE email = 'u2@test.com");
            const sympId = await db.query("SELECT symptom_id FROM symptoms WHERE symptom = 'S2'");
            await User.assignSymp(userId, sympId);
            fail();
        } catch (err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test('NotFound error for invalid user', async function(){
        try {
            const sympId = await db.query("SELECT symptom_id FROM symptoms WHERE symptom = 'S2'");
            await User.assignSymp(0, sympId);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error for invalid symptom', async function(){
        try {
            const userId = await db.query("SELECT user_id FROM users WHERE email = 'u3@test.com");
            await User.assignSymp(userId, 0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**User.assignMed */

describe('User.assignMed', function(){
    test('works with valid data', async function(){
        const userId = await db.query("SELECT user_id FROM users WHERE email = 'u2@test.com");
        const medId = await db.query("SELECT med_id FROM medications WHERE medication = 'M1'");
        await User.assignMed(userId, medId, 10, 'mg', ['AM', 'PM']);
        const found = await db.query("SELECT * FROM users_medications WHERE user_id = $1 AND med_id = $2", [userId, medId]);
        expect(found.rows.length).toEqual(1);
    });
    test('BadRequst error for med already assigned', async function() {
        try {
            const userId = await db.query("SELECT user_id FROM users WHERE email = 'u1@test.com");
            const medId = await db.query("SELECT med_id FROM medications WHERE medication = 'M1'");
            await User.assignMed(userId, medId);
            fail();
        } catch (err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test('NotFound error for invalid user', async function(){
        try {
            const medId = await db.query("SELECT med_id FROM medications WHERE medication = 'M2'");
            await User.assignMed(0, medId);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error for invalid med', async function(){
        try {
            const userId = await db.query("SELECT user_id FROM users WHERE email = 'u3@test.com");
            await User.assignMed(userId, 0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});