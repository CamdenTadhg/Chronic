"use strict"
process.env.NODE_ENV === "test";

const {
    NotFoundError,
    BadRequestError,
} = require('../expressError');
const db = require('../db.js');
const Medication = require("./medication.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require('./_testCommon.js');
const { describe, default: test } = require('node:test');

let m1, u1, m3, m2, u2;
beforeAll(commonBeforeAll);
beforeEach(async () => {
    commonBeforeEach();
    m1 = await db.query(`SELECT med_id FROM medications WHERE medication = 'M1'`);
    u1 = await db.query(`SELECT user_id FROM users WHERE email = 'u1@test.com'`);
    m3 = await db.query(`SELECT med_id FROM medications WHERE medication = 'M3'`);
    m2 = await db.query(`SELECT med_id FROM medications WHERE medication = 'M2'`);
    u2 = await db.query(`SELECT user_id FROM users WHERE email = 'u2@test.com'`);
});
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**Medication.create */
describe('Medication.create', function(){
    test('works with correct info', async function(){
        const medication = await Medication.create({
            medication: 'M4'
        });
        expect(medication).toEqual({
            medId: expect.any(Number),
            medication: 'M4'
        });
        const found = await db.query(`SELECT * FROM medications WHERE medication = 'M4'`);
        expect(found.rows.length).toEqual(1);
    });
    test('Bad request with duplicate medication', async function(){
        try{
            await Medication.create({
                medication: 'M1'
            });
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Medication.getAll */
describe('Medication.getAll', function(){});
    test('works', async function(){
        const medications = await Medication.getAll();
        expect(medications).toEqual([
            {
                medId: expect.any(Number),
                medication: 'M1'
            },
            {
                medId: expect.any(Number),
                medication: 'M2'
            },
            {
                medId: expect.any(Number),
                medication: 'M3'
            }
        ]);
    });

/**Medication.getOne */
describe('Medication.getOne', async function(){
    test('works for valid medication', async function(){
        const medication = await Medication.getOne(m1);
        expect(medication).toEqual(
            {
                medId: expect.any(Number),
                medication: 'M1'
            });
    });
    test('Notfound error for invalid medication', async function(){
        try{
            await Medication.getOne(0);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});


/**Medication.edit */
describe('Medication.edit', async function(){
    test('works for valid medication', async function(){
        const medication = await Medication.edit(m1, {medication: 'M1 capsule'});
        expect(medication).toEqual(
            {
                medId: m1,
                medication: 'M1 capsule'
            });
    });
    test('Notfound error for invalid medication', async function(){
        try {
            await Medication.edit(0, {medication: 'M0 capsule'});
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Bad Request with duplicate medication', async function(){
        try{
            await Medication.edit(m1, {medication: 'M3'});
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Medication.delete */
describe('Medication.delete', async function(){
    test('works for valid medication', async function(){
        const medication = await Medication.delete(m1);
        const notFound = await db.query(`SELECT * FROM medications WHERE medication = 'M1'`);
        expect(notFound.rows.length).toEqual(0);
    });
    test('Notfound error for invalid medication', async function(){
        try{
            await Medication.delete(0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Medication.userConnect */
describe('Medication.userConnect', async function(){
    test('works for valid user & medication', async function(){
        const userMedication = await Medication.userConnect(u1, m3);
        expect(userMedication).toEqual({
            userId: u1,
            medId: m3
        });
        const found = await db.query(`SELECT * FROM users_medications WHERE user_id = $1 AND med_id = $2`, [u1, m3]);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid user', async function(){
        try{
            Medication.userConnect(0, m3);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound error with invalid medication', async function(){
        try{
            Medication.userConnect(u1, 0);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest error with existing userMedication', async function(){
        try{
            Medication.userConnect(u1, m1);
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Medication.userGet */
describe('Medication.userGet', function(){
    test('works with valid connection', async function(){
        const userMedication = await Medication.userGet(u1, m1);
        expect(userMedication).toEqual({
            userId: u1,
            medId: m1,
        });
    });
    test('NotFound with invalid medication', async function(){
        try {
            await Medication.userGet(u1, 0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound with invalid user', async function(){
        try {
            await Medication.userGet(0, m1);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('NotFound with invalid userMedication', async function(){
        try {
            await Medication.userGet(u1, m3);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
})

/**Medication.userChange */
describe('Medication.userChange', async function(){
    test('works for valid user & medication', async function(){
        const userMedication = await Medication.userChange(u1, m1, {medId: m3});
        expect(userMedication).toEqual({
            userId: u1,
            medId: m3
        });
    });
    test('NotFound error with invalid userMedication', async function(){
        try{

            Medication.userChange(u1, 0, {medId: m2});
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('BadRequest error with existing userMedication', async function(){
        try{
            Medication.userChange(u1, m1, {medId: m2});
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Medication.userDisconnect */
describe('Medication.userDisconnect', async function(){
    test('works for valid user & medication', async function(){
        await Medication.userDisconnect(u1, m1);
        const notfound = await db.query(`SELECT * FROM users_medications WHERE user_id = $1 AND med_id = $2`, [u1, m1]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid userMedication', async function(){
        try{
            Symptom.userDisconnect(u1, m3);
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Medication.track */
describe('Medication.track', async function(){
    test('works with valid user & medicatoin', async function(){
        const medTracking = Medication.track({
            userId: u1,
            medId: m1,
            trackDate: '2024-09-23',
            timeOfDay: 'AM',
            number: 1
        });
        expect(medTracking).toEqual({
            medtrack_id: expect.any(Number),
            userId: u1,
            medId: m1,
            trackDate: '2024-09-23', 
            timeOfDay: 'AM',
            number: 1,
            trackedAt: expect.any(Date)
        });
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - medTracking.trackedAt);
        expect(timeDifference).toBeLessThan(5000);
        const found = await db.query(`SELECT * FROM medication_tracking WHERE user_id = $1 AND med_id = $2 AND date = '2024-09-23' AND time_of_day = 'AM'`, [u1, m1]);
        expect(found.rows.length).toEqual(1);
    });
    test('NotFound error with invalid userMedication', async function(){
        try{
            Symptom.track({
                userId: u1,
                medId: m3,
                trackDate: '2024-09-23', 
                timeOfDay: 'PM',
                number: 1
            });
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Bad request error with existing tracking record', async function(){
        try{
            Medication.track({
                userId: u1,
                medId: m1,
                trackDate: '2024-09-21', 
                timeOfDay: 'AM',
                number: 3
            });
            fail();
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/**Symptom.getAllTracking */
describe('Medication.getAllTracking', async function(){
    test('works with valid user & medication', async function(){
        const userRecords = await Medication.getAllTracking(u1);
        expect(userRecords).toEqual([
            {
                medtrackId: expect.any(Number),
                userId: expect.any(Number),
                medId: expect.any(Number), 
                trackDate: '2024-09-21',
                timeOfDay: 'AM', 
                number: 2,
                trackedAt: expect.any(Date)
            },
            {
                medtrackId: expect.any(Number),
                userId: expect.any(Number),
                medId: expect.any(Number), 
                trackDate: '2024-09-21',
                timeOfDay: 'PM', 
                number: 1,
                trackedAt: expect.any(Date) 
            },
            {
                medtrackId: expect.any(Number),
                userId: expect.any(Number),
                medId: expect.any(Number), 
                trackDate: '2024-09-21',
                timeOfDay: 'Midday', 
                number: 1,
                trackedAt: expect.any(Date)
            }
        ])
    });
    test('Returns empty array if no tracking information', async function(){
        const userRecords = await Medication.getAllTracking(u3);
        expect(userRecords).toEqual([])
    })
    test('NotFound error with invalid user', async function(){
        try{
            await Medication.getAllTracking(0)
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Medication.getOneTracking */
describe('Medication.getOneTracking', function(){
    test('works with valid tracking record', async function(){
        const medtrackId = await db.query(`SELECT medtrack_id FROM medication_tracking WHERE time_of_day = 'PM'`);
        const trackingRecord = await Medication.getOneTracking(medtrackId);
        expect(trackingRecord).toEqual({
            medtrackId: medtrackId,
            userId: u1,
            medId: m1,
            trackDate: '2024-09-21', 
            timeOfDay: 'PM',
            number: 1,
            trackedAt: expect.any(Date)
        });
    });
    test('NotFound error with invalid tracking record', async function(){
        try{
            await Medication.getOneTracking(0)
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Medication.getDayTracking */
describe('Medication.getDayTracking', function(){
    test('works with valid date', async function(){
        const dayTrackingRecords = await Medication.getDayTracking(u1, '2024-09-21');
        expect(dayTrackingRecords).toEqual([
            {
                medtrackId: expect.any(Number),
                userId: u1,
                medId: m1, 
                trackDate: '2024-09-21',
                timeOfDay: 'AM', 
                number: 2,
                trackedAt: expect.any(Date)
            },
            {
                medtrackId: expect.any(Number),
                userId: u1,
                medId: m1, 
                trackDate: '2024-09-21',
                timeOfDay: 'PM', 
                number: 2,
                trackedAt: expect.any(Date) 
            },
            {
                medtrackId: expect.any(Number),
                userId: u2,
                medId: m3, 
                trackDate: '2024-09-21',
                timeOfDay: 'Midday', 
                number: 1,
                trackedAt: expect.any(Date)
            }
        ]);
    });
    test('NotFound error with invalid user', async function(){
        try{
            await Medication.getDayTracking(0, '2024-09-21');
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Returns empty array for day with no tracking', async function(){
        const dayTrackingRecords = await Medication.getDayTracking(u1, '2024-09-22');
        expect(dayTrackingRecords).toEqual([]); 
    });
});

/**Medication.editTracking */
describe('Medication.editTracking', function(){
    test('works with valid tracking record', async function(){
        const medtrackRecord = await Medication.editTracking(u1, m1, '2024-09-21', 'AM', {number: 5});
        expect(medtrackRecord).toEqual({
            medtrackId: expect.any(Number),
            userId: u1,
            medId: m1, 
            trackDate: '2024-09-21', 
            timespan: 'AM',
            severity: 5,
            trackedAt: expect.any(Number)
        });
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - medtrackRecord.trackedAt);
        expect(timeDifference).toBeLessThan(5000);
    });
    test('NotFound error with invalid tracking record', async function(){
        try{
            await Medication.editTracking(u1, m1, '2024-09-22', 'AM', {number: 3});
            fail();
        } catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Medication.deleteTracking */
describe('Medication.deleteTracking', function(){
    test('works with valid tracking record', async function(){
        await Medication.deleteTracking(u1, m1, '2024-09-21', 'AM');
        const notfound = await db.query(`SELECT * FROM medication_tracking WHERE user_id = $1 AND med_id = $2 AND date = '2024-09-21' AND time_of_day = 'AM'`, [u1, m1]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid tracking record', async function(){
        try {
            await Medication.deleteTracking(u1, m1, '2024-09-23', 'PM');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**Medication.deleteDayTracking */
describe('Medication.deleteDayTracking', function(){
    test('works with valid date', async function(){
        await Medication.deleteDayTracking(u1, '2024-09-21');
        const notfound = await db.query(`SELECT * FROM medication_tracking WHERE user_id = $1 AND date = '2024-09-21'`, [u1]);
        expect(notfound.rows.length).toEqual(0);
    });
    test('NotFound error with invalid date', async function(){
        try {
            await Medication.deleteDayTracking(u1, '2024-09-23');
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
