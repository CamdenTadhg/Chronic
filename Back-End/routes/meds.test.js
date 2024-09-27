"use strict";
process.env.NODE_ENV === "test";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app');
const Medication = require('../models/medication');

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

/** POST /meds/ */
describe('POST /meds/', function(){
    test('works for admin to create a medication', async function(){
        const resp = await request(app)
            .post('/meds/')
            .send({
                medication: 'M4',
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            medication: {
                medId: expect.any(Number),
                medication: 'M4',
            }
        });
    });
    test('forbidden for user', async function(){
        const resp = await request(app)
            .post('/meds/')
            .send({
                medication: 'M4',
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/meds/')
            .send({
                medication: 'M4',
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/meds/')
            .send({})
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "medication"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/meds/')
            .send({
                medication: 1
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.medication');
    });
    test('bad request with duplicate medication', async function(){
        const resp = await request(app)
            .post('/meds/')
            .send({
                medication: 'M1'
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('M1 already exists');
    });
});

/** GET /meds */
describe('GET /meds/', function(){
    test('works for admin to get medication list', async function(){
        const resp = await request(app)
            .get('/meds/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            medications: [
                {
                    medId: 1,
                    medication: 'M1',
                },
                {
                    medId: 2,
                    medication: 'M2',
                },
                {
                    medId: 3,
                    medication: 'M3',
                }
            ]
        });
    });
    test('works for user to get medication list', async function(){
        const resp = await request(app)
            .get('/meds/')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            medications: [
                {
                    medId: 1,
                    medication: 'M1',
                },
                {
                    medId: 2,
                    medication: 'M2',
                },
                {
                    medId: 3,
                    medication: 'M3',
                }
            ]
        });
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/meds/');
        expect(resp.statusCode).toEqual(401);
    });
    test('fails: test next() handler', async function(){
        //does this route work with the error handler?
        await db.query('DROP TABLE medications CASCADE');
        const resp = await request(app)
            .get('/medications/')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(500);
    });
});

/** GET meds/:medId */
describe('GET /meds/:medId', function(){
    test('works for admin to get medication record', async function(){
        const resp = await request(app)
            .get('/meds/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            medication: {
                medId: 1,
                medication: 'M1',
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .get('/meds/1')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/meds/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid medication', async function(){
        const resp = await request(app)
            .get('/meds/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such medication exists');
    });
});

/** PATCH meds/:medId */
describe('PATCH /meds/:medId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .patch('/meds/1')
            .send({
                medication: 'propanalol'
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            medication: {
                medId: 1,
                medication: 'propanalol'
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .patch('/meds/1')
            .send({
                medication: 'propanalol'
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .patch('/meds/1')
            .send({
                medication: 'propanalol'
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .patch('/medications/1')
            .send({
                medication: 1
            })
            .set('authorization', u2Token)
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.medication');
    });
    test('not found for invalid medication', async function(){
        const resp = await request(app)
            .patch('/meds/0')
            .send({
                medication: 'propanalol'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such medication exists');
    });
});

/** DELETE meds/:medId */
describe('DELETE /meds/:medId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .delete('/meds/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: 1});
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .delete('/meds/1')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete('/meds/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid medication', async function(){
        const resp = await request(app)
            .delete('/meds/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
    });
});


/** POST /meds/:medId/users/:userId 
 * use a 0 for the medId when creating a new medication
*/
describe('POST /meds/:medId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .post('/meds/2/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: 2,
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            }
        });
    });
    test('works for matching user with existing medication', async function(){
        const resp = await request(app)
            .post('/meds/2/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: 2, 
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            }
        });
    });
    test('works for matching user with new medication', async function(){
        const resp = await request(app)
            .post('/meds/0/users/1/')
            .send({
                medication: 'propanalol',
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['Midday']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: expect.any(Number),
                dosageNum: 200,
                dosageUnit: 'mg',
                timeOfDay: ['Midday']
            }
        });
        const found = await request(app)
            .get(`/meds/${resp.body.userMedication.medId}`)
            .set('authorization', u2Token)
        expect(found).toBeTruthy();
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .post('/meds/2/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/meds/0/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/meds/3/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 'mg', 
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "timeOfDay"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/meds/0/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 3, 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.dosageUnit');
    });
    test('bad request with duplicate connection', async function(){
        const resp = await request(app)
            .post('/meds/1/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 3, 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('This medication has already been assigned');
    });
    test('not found for invalid medication', async function(){
        const resp = await request(app)
            .post('/meds/25/users/1/')
            .send({
                dosageNum: 200,
                dosageUnit: 3, 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such medication exists');
    });
    test('not found for invalid user', async function(){
        const resp = await request(app)
            .post('/meds/1/users/0/')
            .send({
                dosageNum: 200,
                dosageUnit: 3, 
                timeOfDay: ['AM', 'PM']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such user exists');
    });
});

/**GET /meds/:medId/users/:userId */
describe('GET /meds/:medId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .get('/meds/1/users/1/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: 1,
                dosageNum: 300,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            }
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .get('/meds/1/users/1/')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: 1,
                dosageNum: 300,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            }
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .get('/meds/1/users/1/')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/meds/1/users/1/')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid userMedication', async function(){
        const resp = await request(app)
            .get('/meds/1/users/3/')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userMedication exists');
    });
});

/** PATCH /meds/:medId/users/:userId */
describe('PATCH /meds/:medId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .patch('/meds/1/users/1')
            .send({
                medId: 2
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: 2,
                dosageNum: 300,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'PM']
            }
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .patch('/meds/1/users/1')
            .send({
                medId: 1,
                dosageNum: 200,
                dosageUnit: 'UI', 
                timeOfDay: ['Midday']
            })
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            userMedication: {
                userId: 1,
                medId: 1,
                dosageNum: 200,
                dosageUnit: 'UI',
                timeOfDay: ['Midday']
            }
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .patch('/meds/1/users/1')
            .send({
                medId: 1,
                dosageNum: 200,
                dosageUnit: 'UI', 
                timeOfDay: ['Midday']
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .patch('/meds/1/users/1')
            .send({
                medId: 1,
                dosageNum: 200,
                dosageUnit: 'UI', 
                timeOfDay: ['Midday']
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .patch('/meds/2/users/2')
            .send({
                medId: 1,
                dosageNum: 200,
                dosageUnit: 'UI', 
                timeOfDay: ['Midday']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "medId"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .patch('/meds/2/users/2')
            .send({
                medId: 'lethargy'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.medId');
    });
    test('not found for invalid userMedication', async function(){
        const resp = await request(app)
            .patch('/meds/1/users/3')
            .send({
                medId: 1,
                dosageNum: 200,
                dosageUnit: 'UI', 
                timeOfDay: ['Midday']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userMedication exists');
    });
});

/**DELETE /meds/:medId/users/:userId */
describe('DELETE /meds/:medId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .delete('/meds/1/users/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: [`User 1`, `Medication 1`]});
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .delete('/meds/1/users/1')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({deleted: [`User 1`, `Medication 1`]});
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .delete('/meds/1/users/1')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete('/meds/1/users/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid userMedication', async function(){
        const resp = await request(app)
            .delete('/meds/1/users/3')
            .set('authorization', u2Token)
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userMedication exists');
    });
});

/** POST /meds/users/:userId/tracking */
describe('POST /meds/users/:userId/tracking', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                timeOfDay: 'AM',
                number: 3
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            trackingRecord: {
                medtrackId: expect.any(Number),
                userId: 1,
                medId: 1,
                trackDate: '2024-09-24', 
                timeOfDay: 'AM', 
                number: 3,
                trackedAt: expect.any(Date)
            }
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                timeOfDay: 'PM',
                number: 1
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            trackingRecord: {
                medtrackId: expect.any(Number),
                userId: 1,
                medId: 1,
                trackDate: '2024-09-24', 
                timeOfDay: 'PM', 
                number: 1,
                trackedAt: expect.any(Date)
            }
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                timeOfDay: 'PM',
                number: 1
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                timeOfDay: 'PM',
                number: 1
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                number: 1
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "timeOfDay"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                timeOfDay: 'Morning',
                number: 1
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.timeOfDay');
    });
    test('bad request with duplicate tracking record', async function(){
        const resp = await request(app)
            .post('/meds/users/1/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-21',
                timeOfDay: 'AM',
                number: 4
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('That tracking record already exists');
    });
    test('not found for invalid userMedication', async function(){
        const resp = await request(app)
            .post('/meds/users/3/tracking')
            .send({
                medId: 1,
                trackDate: '2024-09-24',
                timeOfDay: 'PM',
                number: 1
            })
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userMedication exists');
    });
});

/** GET /meds/users/:userId/tracking */
describe('GET /meds/users/:userId/tracking', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            trackingRecords: [
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'AM',
                    number: 2,
                    trackedAt: expect.any(Date)
                },
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'PM',
                    number: 1,
                    trackedAt: expect.any(Date)
                }
            ]      
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            trackingRecords: [
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'AM',
                    number: 2,
                    trackedAt: expect.any(Date)
                },
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'PM',
                    number: 1,
                    trackedAt: expect.any(Date)
                }
            ] 
        });
    });
    test('returns empty array if no tracking data', async function(){
        const resp = await request(app)
            .get('/meds/users/2/tracking')
            .set('authorization', u2Token);
        expect(resp.body).toEqual([]);
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking')
        expect(resp.statusCode).toEqual(401);
    });
});

/** GET /meds/users/:userId/tracking/:medtrackId */
describe('GET /meds/users/:userId/tracking/:medtrackId', async function(){
    const medtrackId = await db.query(
        `SELECT medtrack_id
        FROM medication_tracking
        WHERE track_date = '2024-09-21 AND time_of_day = 'AM'`
    );
    test('works for admin', async function(){
        const resp = await request(app)
            .get(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u2Token)
        expect(resp.body).toEqual({
            trackingRecord: {
                medtrackId: medtrackId,
                userId: 1,
                medId: 1,
                trackDate: '2024-09-21', 
                timeOfDay: 'AM', 
                number: 2,
                trackedAt: expect.any(Date)
            }
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .get(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u1Token)
        expect(resp.body).toEqual({
            trackingRecord: {
                medtrackId: medtrackId,
                userId: 1,
                medId: 1,
                trackDate: '2024-09-21', 
                timeOfDay: 'AM', 
                number: 2,
                trackedAt: expect.any(Date)
            }
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .get(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u3Token)
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get(`/meds/users/1/tracking/${medtrackId}`)
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid tracking record', async function(){
        const resp = await request(app)
            .get(`/medications/users/1/tracking/0`)
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such tracking record exists');
    });
});

/** GET /meds/users/:userId/tracking/date */
describe('GET /meds/users/:userId/tracking/date', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking/date')
            .send({
                trackDate: '2024-09-21'
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            trackingRecords: [
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'AM',
                    number: 2,
                    trackedAt: expect.any(Date)
                },
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'PM',
                    number: 1,
                    trackedAt: expect.any(Date)
                }
            ]
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking/date')
            .send({
                trackDate: '2024-09-21'
            })
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            trackingRecords: [
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'AM',
                    number: 2,
                    trackedAt: expect.any(Date)
                },
                {
                    medtrackId: expect.any(Number),
                    userId: 1,
                    medId: 1, 
                    trackDate: '2024-09-21',
                    timeOfDay: 'PM',
                    number: 1,
                    trackedAt: expect.any(Date)
                }
            ]
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking/date')
            .send({
                trackDate: '2024-09-21'
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking/date')
            .send({
                trackDate: '2024-09-21'
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('returns empty array if no tracking data', async function(){
        const resp = await request(app)
            .get('/meds/users/1/tracking/date')
            .send({
                trackDate: '2024-09-22'
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual([]);
    });
});

/** PATCH /meds/users/:userId/tracking/:medtrackId */
describe('PATCH /meds/users/:userId/tracking/:medtrackId', async function(){
    const medtrackId = await db.query(
        `SELECT medtrack_id
        FROM medication_tracking
        WHERE track_date = '2024-09-21 AND timeOfDay = 'AM'`
    );
    test('works for admin', async function(){
        const resp = await request(app)
            .patch(`/medications/users/1/tracking/${medtrackId}`)
            .send({
                number: 5
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            trackingRecord: {
                medtrackId: medtrackId,
                userId: 1,
                medId: 1,
                trackDate: '2024-09-21',
                timeOfDay: 'AM', 
                number: 5,
                trackedAt: expect.any(Date)
            }
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .patch(`/meds/users/1/tracking/${medtrackId}`)
            .send({
                number: 4
            })
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            trackingRecord: {
                medtrackId: medtrackId,
                userId: 1,
                medId: 1,
                trackDate: '2024-09-21',
                timeOfDay: 'AM', 
                number: 4,
                trackedAt: expect.any(Date)
            }
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .patch(`/meds/users/1/tracking/${medtrackId}`)
            .send({
                number: 4
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .patch(`/meds/users/1/tracking/${medtrackId}`)
            .send({
                number: 4
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .patch(`/meds/users/1/tracking/${medtrackId}`)
            .send({})
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "number"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .patch(`/meds/users/1/tracking/${medtrackId}`)
            .send({
                number: '2024-09-22'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.number');
    });
    test('not found for invalid tracking record', async function(){
        const resp = await request(app)
            .patch(`/meds/users/1/tracking/0`)
            .send({
                number: 5
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such tracking record exists');
    });
});

/** DELETE /meds/users/:userId/tracking/:medtrackId */
describe('DELETE /meds/users/:userId/tracking/:medtrackId', async function(){
    const medtrackId = await db.query(
        `SELECT medtrack_id
        FROM medication_tracking
        WHERE track_date = '2024-09-21 AND timeOfDay = 'AM'`
    );
    test('works for admin', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: medtrackId});
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u1Token);
        expect(resp.body).toEqual({deleted: medtrackId});
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/${medtrackId}`)
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid tracking record', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/0`)
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such tracking record exists');
    });
});

/** DELETE /meds/users/:userId/tracking/date */
describe('DELETE /meds/users/:userId/tracking/date', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/date`)
            .send({
                trackDate: '2024-09-21'
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: '2024-09-21'});
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/date`)
            .send({
                trackDate: '2024-09-21'
            })
            .set('authorization', u1Token);
        expect(resp.body).toEqual({deleted: '2024-09-21'});
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/date`)
            .send({
                trackDate: '2024-09-21'
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/date`)
            .send({
                trackDate: '2024-09-21'
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid tracking records', async function(){
        const resp = await request(app)
            .delete(`/meds/users/1/tracking/date`)
            .send({
                trackDate: '2024-09-25'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such tracking records exist');
    });
});
