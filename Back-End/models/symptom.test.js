"use strict"
process.env.NODE_ENV === "test";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');
const db = require('../db.js');
const Symptom = require("./user.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require('./_testCommon.js');
const { describe, default: test } = require('node:test');
const { expect } = require('vitest');
const { fail } = require('assert');
const { L } = require('vitest/dist/chunks/reporters.C_zwCd4j.js');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**Symptom.create */
describe('Symptom.create', function(){
    test('works with correct info', async function(){
        const symptom = await Symptom.create({
            symptom: 'lethargy'
        });
        expect(symptom).toEqual({
            symptomId: expect.any(Number),
            symptom: 'lethargy'
        });
        const found = await db.query(`SELECT * FROM symptoms WHERE symptom = 'lethargy'`);
        expect(found.rows.length).toEqual(1);
    });
    test('Bad request with duplicate symptom', async function(){
        try{
            await Symptom.create({
                symptom: 'S1'
            });
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.getAll */
describe('Symptom.getAll', function(){});
    test('works', async function(){
        const symptoms = await Symptom.getAll();
        expect(symptoms).toEqual([
            {symptom: 'S1'},
            {symptom: 'S2'},
            {symptom: 'S3'}
        ]);
    });

/**Symptom.getOne */
describe('Symptom.getOne', function(){});
    test('works for valid symptom', async function(){
        const symptom = await Symptom.getOne(1);
        expect(symptom).toEqual({symptom: 'S1'});
    });
    test('Notfound error for invalid symptom', async function(){
        try{
            await Symptom.getOne(0);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

/**Symptom.edit */
describe('Symptom.edit', function(){
    test('works for valid symptom', async function(){
        const symptom = await Symptom.edit(1, {symptom: 'D1 disorder'});
        expect(symptom).toEqual({symptom: 'D1 disorder'});
    });
    test('Notfound error for invalid symptom', async function(){
        try {
            await Symptom.edit(0, {symptom: 'D0 Disorder'});
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Bad Request with duplicate symptom', async function(){
        try{
            await Symptom.edit(2, {symptom: 'D3'});
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.delete */
describe('Symptom.delete', function(){
    test('works for valid symptom', async function(){
        const symptom = await Symptom.delete(1);
        const notFound = await db.query(`SELECT * FROM symptoms WHERE symptom = 'S1'`);
        expect(notFound.rows.length).toEqual(0);
    });
    test('Notfound error for invalid symptom', async function(){
        try{
            await Symptom.delete(0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.userConnect */
describe('Symptom.userConnect', function(){
    test('works for valid user & symptom', async function(){
        const userSymptom = await Symptom.userConnect(1, 3);
        expect(userSymptom).toEqual({
            userId: 1,
            symptomId: 3
        });
        const found = await db.query(`SELECT * FROM users_symptoms WHERE user_id = 1 AND diagnosis_id = 3`);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid user', async function(){
        try{
            Symptom.userConnect(1, 0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error with invalid symptom', async function(){
        try{
            Symptom.userConnect(0, 1);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest error with existing userSymptom', async function(){
        try{
            Symptom.userConnect(1, 1);
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.userGet */
describe('Symptom.userGet', function(){
    test('works with valid connection', async function(){
        const userSymptom = await Symptom.userGet(1, 1);
        expect(userSymptom).toEqual({
            userId: 1,
            symptomId: 1,
        });
    });
    test('NotFound with invalid symptom', async function(){
        try {
            await Symptom.userGet(1, 0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound with invalid user', async function(){
        try {
            await Symptom.userGet(0, 1);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound with invalid userSymptom', async function(){
        try {
            await Symptom.userGet(1, 3);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
})

/**Symptom.userChange */
describe('Symptom.userChange', function(){
    test('works for valid user & symptom', async function(){
        const userSymptom = await Symptom.userChange(1, 1, {symptomId: 3});
        expect(userSymptom).toEqual({
            userId: 1,
            symptomId: 2
        });
    });
    test('NotFound error with invalid userSymptom', async function(){
        try{
            Symptom.userChange(0, 1, {symptomId: 2});
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest error with existing userSymptom', async function(){
        try{
            Symptom.userChange(1, 1, {symptomId: 2});
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.userDisconnect */
describe('Symptom.userDisconnect', function(){
    test('works for valid user & symptom', async function(){
        await Symptom.userDisconnect(1, 1);
        const notfound = await db.query(`SELECT * FROM users_symptoms WHERE user_id = 1 AND diagnosis_id = 1`);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid userSymptom', async function(){
        try{
            Symptom.userDisconnect(1, 3);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.track */
describe('Symptom.track', function(){
    test('works with valid user & symptom', async function(){
        const symptomTracking = Symptom.track({
            userId: 1,
            symptomId: 1,
            trackDate: '2024-09-23',
            timespan: '8 AM-12 PM',
            severity: 3
        });
        expect(symptomTracking).toEqual({
            symtrack_id: expect.any(Number),
            userId: 1,
            symptomId: 1,
            trackDate: '2024-09-23', 
            timespan: '8 AM-12 PM',
            severity: 3,
            trackedAt: expect.any(Date)
        });
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - symptomTracking.trackedAt);
        expect(timeDifference).toBeLessThan(5000);
        const found = await db.query(`SELECT * FROM symptom_tracking WHERE user_id = 1 AND symptom_id = 1 AND date = '2024-09-23' AND timespan = '8 AM-12 PM'`);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid userSymptom', async function(){
        try{
            Symptom.track({
                userId: 1,
                symptomId: 3,
                trackDate: '2024-09-23', 
                timespan: '12-8 AM',
                severity: 1
            });
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Bad request error with existing tracking record', async function(){
        try{
            Symptom.track({
                userId: 1,
                symptomId: 1,
                trackDate: '2024-09-21', 
                timespan: '12-8 AM',
                severity: 1
            });
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.getAllTracking */
describe('Symptom.getAllTracking', function(){
    test('works with valid user & symptom', async function(){
        const userRecords = await Symptom.getAllTracking(1);
        expect(userRecords).toEqual([
            {
                symtrackId: expect.any(Number),
                userId: 1,
                symptomId: 1, 
                trackDate: '2024-09-21',
                timespan: '12-8 AM', 
                severity: 3,
                trackedAt: expect.any(Date)
            },
            {
                symtrackId: expect.any(Number),
                userId: 1,
                symptomId: 1, 
                trackDate: '2024-09-21',
                timespan: '8 AM-12 PM', 
                severity: 2,
                trackedAt: expect.any(Date) 
            },
            {
                symtrackId: expect.any(Number),
                userId: 1,
                symptomId: 1, 
                trackDate: '2024-09-21',
                timespan: '12-4 PM', 
                severity: 1,
                trackedAt: expect.any(Date)
            }
        ])
    });
    test('Returns empty array if no tracking information', async function(){
        const userRecords = await Symptom.getAllTracking(2);
        expect(userRecords).toEqual([])
    })
    test('NotFound error with invalid user', async function(){
        try{
            await Symptom.getAllTracking(0)
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.getOneTracking */
describe('Symptom.getOneTracking', function(){
    test('works with valid tracking record', async function(){
        const symtrackId = await db.query(`SELECT symtrack_id FROM symptom_tracking WHERE timespan = '12-4 PM'`);
        const trackingRecord = await Symptom.getOneTracking(symtrackId);
        expect(trackingRecord).toEqual({
            symtrackId: symtrackId,
            userId: 1,
            symptomId: 1,
            trackDate: '2024-09-21', 
            timespan: '12-4 PM',
            severity: 1,
            trackedAt: expect.any(Date)
        });
    });
    test('NotFound error with invalid tracking record', async function(){
        try{
            await Symptom.getOneTracking(0)
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.getDayTracking */
describe('Symptom.getDayTracking', function(){
    test('works with valid date', async function(){
        const dayTrackingRecords = await Symptom.getDayTracking(1, '2024-09-21');
        expect(dayTrackingRecords).toEqual([
            {
                symtrackId: expect.any(Number),
                userId: 1,
                symptomId: 1, 
                trackDate: '2024-09-21',
                timespan: '12-8 AM', 
                severity: 3,
                trackedAt: expect.any(Date)
            },
            {
                symtrackId: expect.any(Number),
                userId: 1,
                symptomId: 1, 
                trackDate: '2024-09-21',
                timespan: '8 AM-12 PM', 
                severity: 2,
                trackedAt: expect.any(Date) 
            },
            {
                symtrackId: expect.any(Number),
                userId: 1,
                symptomId: 1, 
                trackDate: '2024-09-21',
                timespan: '12-4 PM', 
                severity: 1,
                trackedAt: expect.any(Date)
            }
        ]);
    });
    test('NotFound error with invalid user', async function(){
        try{
            await Symptom.getDayTracking(0, '2024-09-21');
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Returns empty array for day with no tracking', async function(){
        const dayTrackingRecords = await Symptom.getDayTracking(1, '2024-09-22');
        expect(dayTrackingRecords).toEqual([]); 
    });
});

/**Symptom.editTracking */
describe('Symptom.editTracking', function(){
    test('works with valid tracking record', async function(){
        const symtrackRecord = await Symptom.editTracking(1, 1, '2024-09-21', '12-8 AM', {severity: 5});
        expect(symtrackRecord).toEqual({
            symtrack_id: expect.any(Number),
            userId: 1,
            symptomId: 1, 
            trackDate: '2024-09-21', 
            timespan: '12-8 AM',
            severity: 5,
            trackedAt: expect.any(Number)
        });
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - symtrackRecord.trackedAt);
        expect(timeDifference).toBeLessThan(5000);
    });
    test('NotFound error with invalid tracking record', async function(){
        try{
            await Symptom.editTracking(1, 1, '2024-09-22', '12-8 AM', {severity: 3});
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.deleteTracking */
describe('Symptom.deleteTracking', function(){
    test('works with valid tracking record', async function(){
        await Symptom.deleteTracking(1, 1, '2024-09-21', '12-8 AM');
        const notfound = await db.query(`SELECT * FROM symptom_tracking WHERE user_id = 1 AND symptom_id = 1 AND date = '2024-09-21' AND timespan = '12-8 AM'`);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid tracking record', async function(){
        try {
            await Symptom.deleteTracking(1, 1, '2024-09-21', '4-8 PM');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.deleteDayTracking */
describe('Symptom.deleteDayTracking', function(){
    test('works with valid date', async function(){
        await Symptom.deleteDayTracking(1, 1, '2024-09-21');
        const notfound = await db.query(`SELECT * FROM symptom_tracking WHERE user_id = 1 AND symptom_id = 1 AND date = '2024-09-21'`);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid date', async function(){
        try {
            await Symptom.deleteDayTracking(1, 1, '2024-09-23');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
