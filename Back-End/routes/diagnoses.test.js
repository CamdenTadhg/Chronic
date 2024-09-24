"use strict";
process.env.NODE_ENV === "test";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app');
const Diagnosis = require('../models/diagnosis');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    u1Token,
    u2Token,
    u3Token
} = require('./_testCommon');
const { default: test } = require("node:test");
const { expect } = require("vitest");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /diagnoses/ */

describe('POST /diagnoses/', function(){
    test('works for admin to create diagnosis', async function(){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D4',
                synonyms: ['D4 disorder']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            diagnosis: {
                diagnosisId: expect.any(Number),
                diagnosis: 'D4',
                synonyms: ['D4 disorder']
            }
        });
    });
    test('forbidden for user', async function(){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D4',
                synonyms: ['D4 disorder']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D4',
                synonyms: ['D4 disorder']
            });
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function (){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D4'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "synonyms"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D4',
                synonyms: 'D4 disorder'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.synonyms');
    });
    test('bad request with duplicate diagnosis', async function(){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D1', 
                synonyms: ['D1 disorder']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('Did you mean D1?');
    });
    test('bad request with existing synonym', async function(){
        const resp = await request(app)
            .post('/diagnoses/')
            .send({
                diagnosis: 'D5', 
                synonyms: ['d3']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('Did you mean D3?');
    });
});

/**GET /diagnoses/ */

describe('GET /diagnoses/', function(){
    test('works for admin to get diagnoses list', async function(){
        const resp = await request(app)
            .get('/diagnoses/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1',
                    synonyms: ['d1', 'disease']
                },
                {
                    diagnosisId: 2,
                    diagnosis: 'D2',
                    synonyms: []
                },
                {
                    diagnosisId: 3,
                    diagnosis: 'D3',
                    synonyms: ['d3']
                }
            ]
        });
    });
    test('works for user to get diagnoses list', async function(){
        const resp = await request(app)
            .get('/diagnoses/')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1',
                    synonyms: ['d1', 'disease']
                },
                {
                    diagnosisId: 2,
                    diagnosis: 'D2',
                    synonyms: []
                },
                {
                    diagnosisId: 3,
                    diagnosis: 'D3',
                    synonyms: ['d3']
                }
            ]
        });
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/diagnoses/');
        expect(resp.statusCode).toEqual(401);
    });
    test('fails: test next() handler', async function(){
        //does this route work with the error handler?
        await db.query("DROP TABLE diagnoses CASCADE");
        const resp = await request(app)
            .get("/diagnoses")
            .set("authorization", u2Token);
        expect(resp.statusCode).toEqual(500);
    });
});

/**GET /diagnoses/:diagnosisId */

describe('GET /diagnoses/:diagnosisId', function(){
    test('works for admin to get diagnosis record', async function(){
        const resp = await request(app)
            .get('/diagnoses/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            diagnosis: {
                diagnosisId: 1,
                diagnosis: 'D1',
                synonyms: ['d1', 'disease']
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .get('/diagnoses/1')
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/diagnoses/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid diagnosis', async function(){
        const resp = await request(app)
            .get('/diagnoses/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such diagnosis exists');
    });
});

/**PATCH diagnoses/:diagnosisId */

describe('PATCH /diagnoses/:diagnosisId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1')
            .send({
                diagnosis: 'D1 disorder',
                synonyms: ['D1 syndrome']
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
            diagnosis: {
                diagnosisId: 1,
                diagnosis: 'D1 disorder',
                synonyms: ['d1', 'disease', 'D1 sydrome']
            }
        });
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1')
            .send({
                synonyms: ['D1 syndrome']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1')
            .send({
                synonyms: ['D1 syndrome']
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1')
            .send({
                synonyms: 'D1 disorder'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.synonyms')
    })
    test('not found for invalid diagnosis', async function(){
        const resp = await request(app)
            .patch('/diagnoses/0')
            .send({
                synonyms: ['D1 syndrome']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such diagnosis exists');
    });
});

/**DELETE diagnoses/:diagnosisId */

describe('DELETE /diagnoses/:diagnosisId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .delete('/diagnoses/1')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: 1});
    });
    test('forbidden for users', async function(){
        const resp = await request(app)
            .delete('/diagnoses/1')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete('/diagnoses/1')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid diagnosis', async function(){
        const resp = await request(app)
            .delete('/diagnoses/0')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
    });
});

/**POST diagnoses/:diagnosisId/users/:userId
 * use a 0 for the diagnosisId when creating a new diagnosis
*/

describe('POST /diagnoses/:diagnosisId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .post('/diagnoses/2/users/1/')
            .send({
                keywords: ['pain', 'fatigue']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userDiagnosis: {
                userId: 1,
                diagnosisId: 2,
                keywords: ['pain', 'fatigue']
            }
        });
    });
    test('works for matching user with existing diagnosis', async function(){
        const resp = await request(app)
            .post('/diagnoses/3/users/1/')
            .send({
                keywords: ['pain', 'fatigue']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userDiagnosis: {
                userId: 1,
                diagnosisId: 3,
                keywords: ['pain', 'fatigue']
            }
        });
    });
    test('works for matching user with new diagnosis', async function(){
        const resp = await request(app)
            .post('/diagnoses/0/users/1/')
            .send({
                diagnosis: 'Mast Cell Activation Syndrome',
                keywords: ['allergy']
            })
            .set('authorization', u1Token);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            userDiagnosis: {
                userId: 1,
                diagnosisId: expect.any(Number),
                keywords: ['allergy']
            }
        });
        const found = await request(app)
            .get(`/diagnoses/${resp.body.userDiagnosis.diagnosisId}`)
            .set('authorization', u2Token)
        expect(found).toBeTruthy();
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .post('/diagnoses/3/users/1/')
            .send({
                keywords: ['allergy']
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .post('/diagnoses/3/users/1/')
            .send({
                keywords: ['allergy']
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .post('/diagnoses/3/users/1/')
            .send({})
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "keywords"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .post('/diagnoses/3/users/1/')
            .send({
                keywords: 'lethargy'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.keywords');
    });
    test('bad request with duplicate connection', async function(){
        const resp = await request(app)
            .post('/diagnoses/1/users/1/')
            .send({
                keywords: ['lethargy']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('This diagnosis has already been assigned to this user');
    });
    test('not found for invalid diagnosis', async function(){
        const resp = await request(app)
            .post('/diagnoses/0/users/1/')
            .send({
                keywords: ['lethargy']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such diagnosis exists');
    });
    test('not found for invalid user', async function(){
        const resp = await request(app)
            .post('/diagnoses/1/users/0/')
            .send({
                keywords: ['lethargy']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such user exists');
    });
});

/**GET diagnoses/:diagnosisId/users/:userId */
describe('GET diagnoses/:diagnosisId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .get('/diagnoses/1/users/1/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
                userId: 1,
                diagnosisId: 1,
                keywords: ['pain']
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .get('/diagnoses/1/users/1/')
            .set('authorization', u1Token);
        expect(resp.body).toEqual({
                userId: 1,
                diagnosisId: 1,
                keywords: ['pain']
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .get('/diagnoses/1/users/1/')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .get('/diagnoses/1/users/1/')
        expect(resp.statusCode).toEqual(401);
    });
    test('notfound for invalid userDiagnosis', async function(){
        const resp = await request(app)
            .get('/diagnoses/1/users/2')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userDiagnosis exists');
    });
});

/**PATCH diagnoses/:diagnosisId/users/:userId */

describe('PATCH /diagnosis/:diagnosisId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1/users/1/')
            .send({
                keywords: ['lethargy']
            })
            .set('authorization', u2Token);
        expect(resp.body).toEqual({
                userId: 1,
                diagnosisId: 1,
                keywords: ['pain', 'lethargy']
        });
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .post('/diagnoses/3/users/3/')
            .send({
                keywords: ['lethargy']
            })
            .set('authorization', u3Token);
        expect(resp.body).toEqual({
                userId: 3,
                diagnosisId: 3,
                keywords: ['fatigue', 'long covid', 'lethargy']
        });
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1/users/1/')
            .send({
                keywords: ['allergy']
            })
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1/users/1/')
            .send({
                keywords: ['allergy']
            })
        expect(resp.statusCode).toEqual(401);
    });
    test('bad request with missing data', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1/users/1/')
            .send({})
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance requires property "keywords"');
    });
    test('bad request with invalid data', async function(){
        const resp = await request(app)
            .patch('/diagnoses/1/users/1/')
            .send({
                keywords: 'lethargy'
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toContain('instance.keywords');
    });
    test('not found for invalid user diagnosis', async function(){
        const resp = await request(app)
            .post('/diagnoses/0/users/1/')
            .send({
                keywords: ['lethargy']
            })
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userDiagnosis exists');
    });
});

/**DELETE diagnoses/:diagnosisId/users/:userId */

describe('DELETE /diagnosis/:diagnosisId/users/:userId', function(){
    test('works for admin', async function(){
        const resp = await request(app)
            .delete('/diagnoses/1/users/1/')
            .set('authorization', u2Token);
        expect(resp.body).toEqual({deleted: [`User 1`, `Diagnosis 1`]});
    });
    test('works for matching user', async function(){
        const resp = await request(app)
            .delete('/diagnoses/3/users/3/')
            .set('authorization', u3Token);
        expect(resp.body).toEqual({deleted: [3, 3]});
    });
    test('forbidden for non-matching user', async function(){
        const resp = await request(app)
            .delete('/diagnoses/1/users/1/')
            .set('authorization', u3Token);
        expect(resp.statusCode).toEqual(403);
    });
    test('unauthorized for anonymous', async function(){
        const resp = await request(app)
            .delete('/diagnoses/1/users/1/')
        expect(resp.statusCode).toEqual(401);
    });
    test('not found for invalid user diagnosis', async function(){
        const resp = await request(app)
            .delete('/diagnoses/0/users/1/')
            .set('authorization', u2Token);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toContain('No such userDiagnosis exists');
    });
});