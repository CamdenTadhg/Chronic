"use strict";
process.env.NODE_ENV === "test";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app');
const Symptom = require('../models/symptom');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    u1Token,
    u2Token,
    u3Token
} = require('./_testCommon');
const { default: test, describe } = require("node:test");
const { expect } = require("vitest");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /symptoms/ */
describe('POST /symptoms/', function(){
    test('works for admin to create a symptom', async function(){
        const resp = await request(app)
            .post('/symptoms/')
            .send({
                symptom: 'S4',
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            symptom: {
                symptomId: expect.any(Number),
                symptom: 'S4',
            }
        });
    });
    test('forbidden for user', async function(){
        const resp = await request(app)
            .post('/symptoms/')
            .send({
                symptom: 'S4',
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/symptoms/')
            .send({
                symptom: 'S4',
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/symptoms/')
            .send({})
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "symptom"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/symptoms/')
            .send({
                symptom: 1
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.symptom');
    });
    test('bad request with duplicate symptom', async function(){
        const resp = await request(app)
            .post('/symptoms/')
            .send({
                symptom: 'S1'
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('S1 already exists');
    });
});

/** GET /symptoms */
describe('GET /symptoms/', function(){
    test('works for admin to get symptom list', async function(){
        const resp = await request(app)
            .get('/symptoms/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            symptoms: [
                {
                    symptomId: 1,
                    symptom: 'S1',
                },
                {
                    symptomId: 2,
                    symptom: 'S2',
                },
                {
                    symptomId: 3,
                    symptom: 'S3',
                }
            ]
        });
    });
    test('works for user to get symptom list', async function(){
        const resp = await request(app)
            .get('/symptoms/')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            symptoms: [
                {
                    symptomId: 1,
                    symptom: 'S1',
                },
                {
                    symptomId: 2,
                    symptom: 'S2',
                },
                {
                    symptomId: 3,
                    symptom: 'S3',
                }
            ]
        });
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/symptoms/');
        expect(resp.statusCode).toEqual(401);
    });
    test('fails: test next() handler', async function(){
        //does this route work with the error handler?
        await db.query('DROP TABLE symptoms CASCADE');
        const resp = await request(app)
            .get('/symptoms/')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(500);
    });
});

/** GET symptoms/:symptomId */
describe('GET /symptoms/:symptomId', function(){
    test('works for admni to get symptom record', async function(){
        const resp = await request(app)
            .get('/symptoms/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            symptom: {
                symptomId: 1,
                symptom: 'D1',
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .get('/symptoms/1')
            .set('authoriztaion', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/symptoms/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid symptom', async function(){
        const resp = await request(app)
            .get('/symptoms/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such symptom exists');
    });
});

/** PATCH symptoms/:symptomId */
describe('PATCH /symptoms/:symptomId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .patch('/symptoms/1')
            .send({
                symptom: 'naseau'
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            symptom: {
                symptomId: 1,
                symptom: 'naseau'
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .patch('/symptoms/1')
            .send({
                symptom: 'naseau'
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .patch('/symptoms/1')
            .send({
                symptom: 'naseau'
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .patch('/symptoms/1')
            .send({
                symptom: 1
            })
            .set('authorization', u2Token)
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.symptom');
    });
    test('not found for invalid symptom', async function(){
        const resp = await request(app)
            .patch('/symptoms/0')
            .send({
                symptom: 'naseau'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such symptom exists');
    });
});

/** DELETE symptoms/:symptomId */
describe('DELETE /symptoms/:symptomId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .delete('/symptoms/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: 1});
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .delete('/symptoms/1')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete('/symptoms/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid symptom', async function(){
        const resp = await request(app)
            .delete('/symptoms/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
    });
});


/** POST /symptoms/:symptomId/users/:userId 
 * use a 0 for the diagnosisId when creating a new diagnosis
*/
describe('POST /symptoms/:symptomId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .post('/symptoms/2/users/1/')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userSymptom: {
                userId: 1,
                symptomId: 2
            }
        });
    });
    test('works for matching user with existing symptom', async function(){
        const resp = await request(app)
            .post('/symptoms/2/users/1/')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userSymptom: {
                userId: 1,
                symptomId: 2
            }
        });
    });
    test('works for matching user with new symptom', async function(){
        const resp = await request(app)
            .post('/symptoms/0/users/1/')
            .send({
                symptom: 'lethargy'
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userSymptom: {
                userId: 1,
                symptomId: expect.any(Number)
            }
        });
        const found = await request(app)
            .get(`/symptoms/${resp.body.userSymptom.symptomId}`)
            .set('authorization', u2Token)
        expect(found).toBeTruthy();
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .post('/symptoms/2/users/1/')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/symptoms/0/users/1/')
            .send({
                symptom: 'lethargy'
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/symptoms/0/users/1/')
            .send({})
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "symptom"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/symptoms/0/users/1/')
            .send({
                symptom: 1
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.symptom');
    });
    test('bad request with duplicate connection', async function(){
        const resp = await request(app)
            .post('/symptoms/1/users/1/')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('This symptom has already been assigned');
    });
    test('not found for invalid symptom', async function(){
        const resp = await request(app)
            .post('/symptoms/25/users/1/')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such symptom exists');
    });
    test('not found for invalid user', async function(){
        const resp = await request(app)
            .post('/symptoms/1/users/0/')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such user exists');
    });
});

/**GET /symptoms/:symptomId/users/:userId */
describe('GET /symptoms/:symptomId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .get('/symptoms/1/users/1/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
                userId: 1,
                symptomId: 1
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .get('/symptoms/1/users/1/')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
                userId: 1,
                symptomId: 1
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .get('/symptoms/1/users/1/')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/symptoms/1/users/1/')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid userSymptom', async function(){
        const resp = await request(app)
            .get('/symptoms/1/users/3/')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userSymptom exists');
    });
});

/** PATCH /symptoms/:symptomId/users/:userId */
describe('PATCH /symptoms/:symptomId/users/:userId', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('bad request with missing data', async function(){});
    test('bad request with invalid data', async function(){});
    test('not found for invalid userSymptom', async function(){});
});

/**DELETE /symptoms/:symptomId/users/:userId */
describe('DELETE /symptoms/:symptomId/users/:userId', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('not found for invalid userSymptom', async function(){});
});

/** POST /symptoms/users/:userId/tracking */
describe('POST /symptoms/users/:userId/tracking', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('bad request with missing data', async function(){});
    test('bad request with invalid data', async function(){});
    test('not found for invalid userSymptom', async function(){});
});

/** GET /symptoms/users/:userId/tracking */
describe('GET /symptoms/users/:userId/tracking', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('returns empty array if no tracking data', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
});

/** GET /symptoms/users/:userId/tracking/:symtrackId */
describe('GET /symptoms/users/:userId/tracking/:symtrackId', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('not found for invalid tracking record', async function(){});
});

/** GET /symptoms/users/:userId/tracking/date */
describe('GET /symptoms/users/:userId/tracking/date', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('returns empty array if no tracking data', async function(){});
});

/** PATCH /symptoms/users/:userId/tracking/:symtrackId */
describe('PATCH /symptoms/users/:userId/tracking/:symtrackId', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('bad request with missing data', async function(){});
    test('bad request with invalid data', async function(){});
    test('not found for invalid tracking record', async function(){});
})

/** DELETE /symptoms/users/:userId/tracking/:symtrackId */
describe('DELETE /symptoms/users/:userId/tracking/:symtrackId', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('not found for invalid tracking record', async function(){});
});

/** DELETE /symptoms/users/:userId/tracking/date */
describe('DELETE /symptoms/users/:userId/tracking/date', function(){
    test('works for admin', async function(){});
    test('works for matching user', async function(){});
    test('forbidden for non-matching user', async function(){});
    test('unauthorized for anonymous', async function(){});
    test('not found for invalid tracking records', async function(){});
});
