"use strict";
process.env.NODE_ENV === "test";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app.js');
const Diagnosis = require('./diagnosis');
const {NotFoundError, BadRequestError} = require('../expressError')

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    u1Token,
    u2Token,
    u3Token
} = require('./_testCommon.js');
const { expect } = require("vitest");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**Diagnosis.create */
describe('Diagnosis.create', function (){
    test('works with correct info', async function(){
        const diagnosis = await Diagnosis.create({
            diagnosis: 'D4',
            synonyms: ['d4']
        });
        expect(diagnosis).toEqual({
            diagnosisId: expect.any(Number),
            diagnosis: 'D4', 
            synonyms: ['d4']
        });
        const found = await db.query(`SELECT * FROM diagnoses WHERE diagnosis = 'D4'`);
        expect(found.rows.length).toEqual(1);
    });
    test('bad request with duplicate diagnosis', async function(){
        try{
            await Diagnosis.create({
                diagnosis: 'D1', 
                synonyms: ['diagnosis1'], 
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        };
    });
    test('bad request with synonym diagnosis', async function(){
        try{
            await Diagnosis.create({
                diagnosis: 'disease', 
                synonyms: ['diagnosis1'], 
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }; 
    });
});

/**Diagnosis.getAll */
describe('Diagnosis.getAll', function(){
    test('works', async function(){
        const diagnoses = await Diagnosis.getAll();
        expect(diagnoses).toEqual([
            {
                diagnosisId: expect.any(Number),
                diagnosis: 'D1',
                synonyms: ['d1', 'disease']
            },
            {
                diagnosisId: expect.any(Number),
                diagnosis: 'D2',
                synonyms: []
            },
            {
                diagnosisId: expect.any(Number),
                diagnosis: 'D3',
                synonyms: ['d3']
            }
        ]);
    });
});

/**Diagnosis.getOne */
describe('Diagnosis.getOne', function(){
    test('works with valid diagnosis', async function(){
        const diagnosisId = await db.query(`SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D1'`);
        const diagnosis = await Diagnosis.getOne(diagnosisId);
        expect(diagnosis).toEqual({
            diagnosisId: diagnosisId,
            diagnosis: 'D1', 
            synonyms: ['d1', 'disease']
        });
    });
    test('NotFound error with invalid diagnosis', async function(){
        try {
            await Diagnosis.getOne('D19');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Diagnosis.edit */
describe('Diagnosis.edit', async function(){
    const diagnosisId = await db.query(`SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D2'`);
    test('works with valid data', async function(){
        const diagnosis = await Diagnosis.edit(diagnosisId, {
            synonyms: 'dissociate'
        });
        expect(diagnosis).toEqual({
            diagnosisId: diagnosisId,
            diagnosis: 'D2',
            synonyms: ['dissociate']
        });
    });
    test('BadRequest error with duplicate diagnosis', async function(){
        try {
            await Diagnosis.edit(diagnosisId, {
                diagnosis: 'D1'
            });
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test('BadRequest error with synonym diagnosis', async function(){
        try {
            await Diagnosis.edit(diagnosisId, {
                diagnosis: 'disease'
            });
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
    test('NotFound error with invalid diagnosis', async function(){
        try {
            await Diagnosis.edit(0, {
                diagnosis: 'D0'
            });
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Diagnosis.delete */
describe('Diagnosis.delete', function(){
    test('works with valid data', async function(){
        const diagnosisId = await db.query(`SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D3'`);
        await Diagnosis.delete(diagnosisId);
        const notFound = await db.query(`SELECT * FROM diagnoses WHERE diagnosis = 'D3'`);
        expect(notFound.rows.length).toEqual(0);
    });
    test('NotFound with invalid diagnosis', async function(){
        try {
            await Diagnosis.delete(0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Diagnosis.userConnect */
describe('Diagnosis.userConnect', async function(){
    const userId = await db.query(`SELECT user_id FROM users WHERE email = 'u2@test.com'`);
    const diagnosisId = await db.query(`SELECT diagnosis_id FROM diagnoses WHERE diagnosis = 'D1'`);
    test('works with valid data', async function(){
        const userDiagnosis = await Diagnosis.userConnect(userId, diagnosisId, {
            keywords: ['vertigo']
        });
        expect(userDiagnosis).toEqual({
            userId: userId,
            diagnosisId: diagnosisId,
            keywords: ['vertigo']
        });
        const found = await db.query(`SELECT * FROM users_diagnoses WHERE user_id = $1 AND diagnosis_id = $2`, [userId, diagnosisId]);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid diagnosis', async function(){
        try {
            await Diagnosis.userConnect(userId, 0, {
                keywords: ['pain']
            });
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error with invalid user', async function(){
        try {
            await Diagnosis.userConnect(0, diagnosisId, {
                keywords: ['pain']
            });
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Diagnosis.userUpdate */
describe('Diagnosis.userUpdate', async function(){
    const userId = await db.query(`SELECT user_id from users WHERE email = 'u1@test.com'`);
    const diagnosisId = await db.query(`SELECT diagnosis_id from diagnoses WHERE diagnosis = 'D1'`);
    test('works with valid data', async function(){
        const userDiagnosis = await Diagnosis.userUpdate(userId, diagnosisId, {
            keywords: ['fatigue']
        });
        expect(userDiagnosis).toEqual({
            userId: userId,
            diagnosisId: diagnosisId,
            keywords: ['pain', 'fatigue']
        });
    });
    test('NotFound with invalid diagnosis', async function(){
        try {
            await Diagnosis.userUpdate(userId, 0, {
                keywords: ['pain']
            });
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error with invalid user', async function (){
        try {
            await Diagnosis.userUpdate(0, diagnosisId, {
                keywords: ['pain']
            });
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Diagnosis.userDisconnect */
describe('Diagnosis.userDisconnect', async function(){
    const userId = await db.query(`SELECT user_id from users WHERE email = 'u1@test.com'`);
    const diagnosisId = await db.query(`SELECT diagnosis_id from diagnoses WHERE diagnosis = 'D1'`);
    test('works with valid data', async function(){
        await Diagnosis.userDelete(userId, diagnosisId);
        const notfound = await db.query(`SELECT * FROM users_diagnoses WHERE user_id = $1 AND diagnosis_id = $2`, [userId, diagnosisId]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound with invalid diagnosis', async function(){
        try {
            await Diagnosis.deleteUser(userId, 0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error with invalid user', async function(){
        try {
            await Diagnosis.deleteUser(0, diagnosisId);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});



