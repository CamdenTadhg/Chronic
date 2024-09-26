"use strict"
process.env.NODE_ENV === "test";

const {
    NotFoundError,
    BadRequestError,
} = require('../expressError');
const db = require('../db.js');
const Symptom = require("./symptom.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require('./_testCommon.js');
const { expect } = require('vitest');


let s1, u1, s3, s2, u2;
beforeAll(commonBeforeAll);
beforeEach(async () => {
    commonBeforeEach();
    s1 = await db.query(`SELECT symptom_id FROM symptoms WHERE symptom = 'S1'`);
    u1 = await db.query(`SELECT user_id FROM users WHERE email = 'u1@test.com'`);
    s3 = await db.query(`SELECT symptom_id FROM symptoms WHERE symptom = 'S3'`);
    s2 = await db.query(`SELECT symptom_id FROM symptoms WHERE symptom = 'S2'`);
    u2 = await db.query(`SELECT user_id FROM users WHERE email = 'u2@test.com'`);
});
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
            {
                symptomId: expect.any(Number),
                symptom: 'S1'
            },
            {
                symptomId: expect.any(Number),
                symptom: 'S2'
            },
            {
                symptomId: expect.any(Number),
                symptom: 'S3'
            }
        ]);
    });

/**Symptom.getOne */
describe('Symptom.getOne', async function(){
    test('works for valid symptom', async function(){
        const symptom = await Symptom.getOne(s1);
        expect(symptom).toEqual(
            {
                symptomId: expect.any(Number),
                symptom: 'S1'
            });
    });
    test('Notfound error for invalid symptom', async function(){
        try{
            await Symptom.getOne(0);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});


/**Symptom.edit */
describe('Symptom.edit', async function(){
    test('works for valid symptom', async function(){
        const symptom = await Symptom.edit(s1, {symptom: 'S1 pain'});
        expect(symptom).toEqual(
            {
                symptomId: s1,
                symptom: 'S1 pain'
            });
    });
    test('Notfound error for invalid symptom', async function(){
        try {
            await Symptom.edit(0, {symptom: 'S0 pain'});
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Bad Request with duplicate symptom', async function(){
        try{
            await Symptom.edit(s1, {symptom: 'S3'});
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.delete */
describe('Symptom.delete', async function(){
    test('works for valid symptom', async function(){
        const symptom = await Symptom.delete(s1);
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
describe('Symptom.userConnect', async function(){
    test('works for valid user & symptom', async function(){
        const userSymptom = await Symptom.userConnect(u1, s3);
        expect(userSymptom).toEqual({
            userId: u1,
            symptomId: s3
        });
        const found = await db.query(`SELECT * FROM users_symptoms WHERE user_id = $1 AND symptom_id = $2`, [u1, s3]);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid user', async function(){
        try{
            Symptom.userConnect(0, s1);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error with invalid symptom', async function(){
        try{
            Symptom.userConnect(u1, 0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest error with existing userSymptom', async function(){
        try{
            Symptom.userConnect(u1, s1);
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.userGet */
describe('Symptom.userGet', function(){
    test('works with valid connection', async function(){
        const userSymptom = await Symptom.userGet(u1, s1);
        expect(userSymptom).toEqual({
            userId: u1,
            symptomId: s1,
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
            await Symptom.userGet(u1, s3);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
})

/**Symptom.userChange */
describe('Symptom.userChange', async function(){
    test('works for valid user & symptom', async function(){
        const userSymptom = await Symptom.userChange(u1, s1, {symptomId: s3});
        expect(userSymptom).toEqual({
            userId: u1,
            symptomId: s3
        });
    });
    test('NotFound error with invalid userSymptom', async function(){
        try{

            Symptom.userChange(0, s1, {symptomId: s2});
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest error with existing userSymptom', async function(){
        try{
            Symptom.userChange(u1, s1, {symptomId: s2});
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.userDisconnect */
describe('Symptom.userDisconnect', async function(){
    test('works for valid user & symptom', async function(){
        await Symptom.userDisconnect(u1, s1);
        const notfound = await db.query(`SELECT * FROM users_symptoms WHERE user_id = $1 AND symptom_id = $2`, [u1, s1]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid userSymptom', async function(){
        try{
            Symptom.userDisconnect(u1, s3);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.track */
describe('Symptom.track', async function(){
    test('works with valid user & symptom', async function(){
        const symptomTracking = Symptom.track({
            userId: u1,
            symptomId: s1,
            trackDate: '2024-09-23',
            timespan: '8 AM-12 PM',
            severity: 3
        });
        expect(symptomTracking).toEqual({
            medtrackId: expect.any(Number),
            userId: u1,
            symptomId: s1,
            trackDate: '2024-09-23', 
            timespan: '8 AM-12 PM',
            severity: 3,
            trackedAt: expect.any(Date)
        });
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - symptomTracking.trackedAt);
        expect(timeDifference).toBeLessThan(5000);
        const found = await db.query(`SELECT * FROM symptom_tracking WHERE user_id = $1 AND symptom_id = $2 AND date = '2024-09-23' AND timespan = '8 AM-12 PM'`, [u1, s1]);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid userSymptom', async function(){
        try{
            Symptom.track({
                userId: u1,
                symptomId: s3,
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
                userId: u1,
                symptomId: s1,
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
describe('Symptom.getAllTracking', async function(){
    test('works with valid user & symptom', async function(){
        const userRecords = await Symptom.getAllTracking(u1);
        expect(userRecords).toEqual([
            {
                symtrackId: expect.any(Number),
                userId: expect.any(Number),
                symptomId: expect.any(Number), 
                trackDate: '2024-09-21',
                timespan: '12-8 AM', 
                severity: 3,
                trackedAt: expect.any(Date)
            },
            {
                symtrackId: expect.any(Number),
                userId: expect.any(Number),
                symptomId: expect.any(Number), 
                trackDate: '2024-09-21',
                timespan: '8 AM-12 PM', 
                severity: 2,
                trackedAt: expect.any(Date) 
            },
            {
                symtrackId: expect.any(Number),
                userId: expect.any(Number),
                symptomId: expect.any(Number), 
                trackDate: '2024-09-21',
                timespan: '12-4 PM', 
                severity: 1,
                trackedAt: expect.any(Date)
            }
        ])
    });
    test('Returns empty array if no tracking information', async function(){
        const userRecords = await Symptom.getAllTracking(u2);
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
            userId: u1,
            symptomId: s1,
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
        const dayTrackingRecords = await Symptom.getDayTracking(u1, '2024-09-21');
        expect(dayTrackingRecords).toEqual([
            {
                symtrackId: expect.any(Number),
                userId: u1,
                symptomId: s1, 
                trackDate: '2024-09-21',
                timespan: '12-8 AM', 
                severity: 3,
                trackedAt: expect.any(Date)
            },
            {
                symtrackId: expect.any(Number),
                userId: u1,
                symptomId: s1, 
                trackDate: '2024-09-21',
                timespan: '8 AM-12 PM', 
                severity: 2,
                trackedAt: expect.any(Date) 
            },
            {
                symtrackId: expect.any(Number),
                userId: u1,
                symptomId: s1, 
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
        const dayTrackingRecords = await Symptom.getDayTracking(u1, '2024-09-22');
        expect(dayTrackingRecords).toEqual([]); 
    });
});

/**Symptom.editTracking */
describe('Symptom.editTracking', function(){
    test('works with valid tracking record', async function(){
        const symtrackRecord = await Symptom.editTracking(u1, s1, '2024-09-21', '12-8 AM', {severity: 5});
        expect(symtrackRecord).toEqual({
            symtrackId: expect.any(Number),
            userId: u1,
            symptomId: s1, 
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
            await Symptom.editTracking(u1, s1, '2024-09-22', '12-8 AM', {severity: 3});
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.deleteTracking */
describe('Symptom.deleteTracking', function(){
    test('works with valid tracking record', async function(){
        await Symptom.deleteTracking(u1, s1, '2024-09-21', '12-8 AM');
        const notfound = await db.query(`SELECT * FROM symptom_tracking WHERE user_id = $1 AND symptom_id = $2 AND date = '2024-09-21' AND timespan = '12-8 AM'`, [u1, s1]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid tracking record', async function(){
        try {
            await Symptom.deleteTracking(u1, s1, '2024-09-21', '4-8 PM');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Symptom.deleteDayTracking */
describe('Symptom.deleteDayTracking', function(){
    test('works with valid date', async function(){
        await Symptom.deleteDayTracking(u1, '2024-09-21');
        const notfound = await db.query(`SELECT * FROM symptom_tracking WHERE user_id = $1 AND date = '2024-09-21'`, [u1]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid date', async function(){
        try {
            await Symptom.deleteDayTracking(u1, s1, '2024-09-23');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
