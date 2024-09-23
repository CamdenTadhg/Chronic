const bcrypt = require("bcrypt")

const db = require('../db.js');
const {BCRYPT_WORK_FACTOR} = require('../config');

async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM diagnoses");
    await db.query("DELETE FROM symptoms");
    await db.query("DELETE FROM medications");

    await db.query(`
        INSERT INTO users(email,
                        password,
                        name)
        VALUES  ('u1@test.com', $1, 'U1'),
                ('u2@test.com', $2, 'U2'),
                ('u3@test.com', $3, 'U3')`,
        [
            await bcrypt.hash('password', BCRYPT_WORK_FACTOR),
            await bcrypt.hash('password', BCRYPT_WORK_FACTOR),
            await bcrypt.hash('password', BCRYPT_WORK_FACTOR)
        ]);
    
    await db.query(`
        INSERT INTO diagnoses(diagnosis, synonyms)
        VALUES  ('D1', '{"d1", "disease"}'),
                ('D2', '{}'),
                ('D3', '{"d3"}')`);
    
    const u1 = await db.query(`SELECT user_id FROM users 
        WHERE email = 'u1@test.com'`);
    const u1Id = u1.rows[0].user_id;
    const u2 = await db.query(`SELECT user_id FROM users
        WHERE email = 'u2@test.com'`);
    const u2Id = u2.rows[0].user_id;
    const u3 = await db.query(`SELECT user_id FROM users
        WHERE email = 'u3@test.com'`);
    const u3Id = u3.rows[0].user_id;

    const d1 = await db.query(`SELECT diagnosis_id FROM diagnoses
            WHERE diagnosis = 'D1`);
    const d1Id = d1.rows[0].diagnosis_id;
    const d2 = await db.query(`SELECT diagnosis_id FROM diagnoses
        WHERE diagnosis = 'D2'`);
    const d2Id = d2.rows[0].diagnosis_id;
    const d3 = await db.query(`SElECT diagnosis_id FROM diagnoses
        WHERE diagnosis = 'D3'`);
    const d3Id = d3.rows[0].diagnosis_id;

    await db.query(`
        INSERT INTO users_diagnoses(user_id, diagnosis_id, keywords)
        VALUES  (${u1Id}, $${d1Id}, '{"pain"}), 
                (${u2Id}, ${d2Id}, '{}'), 
                (${u3Id}, ${d3Id}, '{"fatigue", "long covid"}')`);

    await db.query(`
        INSERT INTO symptoms(symptom)
        VALUES ('S1'), ('S2'), ('S3')`);
    
    const s1 = await db.query(`SELECT symptom_id FROM symptoms
        WHERE symptom = 'S1'`);
    const s1Id = s1.rows[0].symptom_id;
    const s2 = await db.query(`SELECT symptom_id FROM symptoms
        WHERE symptom = 'S2'`);
    const s2Id = s2.rows[0].symptom_id;
    const s3 = await db.query(`SELECT symptom_id FROM symptoms
        WHERE symptom = 'S3'`);
    const s3Id = s3.rows[0].symptom_id;

    await db.query(`
        INSERT INTO users_symptoms(user_id, symptom_id)
        VALUES (${u1Id}, ${s1Id}), (${u1Id}, ${s2Id}), (${u3Id}, ${s3Id})`);

    await db.query(`
        INSERT INTO symptom_tracking (user_id, symptom_id, track_date, timespan, severity)
        VALUES  (${u1Id}, ${s1Id}, '2024-09-21', '12-8 AM', 3),
                (${u1Id}, ${s1Id}, '2024-09-21', '8 AM-12 PM', 2),
                (${u1Id}, ${s1Id}, '2024-09-21', '12-4 PM', 1)`);

    await db.query(`
        INSERT INTO medications(medication)
        VALUES ('M1'), ('M2'), ('M3')`);

    const m1 = await db.query(`SELECT med_id FROM medications
        WHERE medication = 'M1'`);
    const m1Id = m1.rows[0].med_id;
    const m2 = await db.query(`SELECT med_id FROM medications
        WHERE medication = 'M2'`);
    const m2Id = m2.rows[0].med_id;
    const m3 = await db.query(`SELECT med_id FROM medications
        WHERE medication = 'M3'`);
    const m3Id = m3.rows[0].med_id;

    await db.query(`
        INSERT INTO users_medications(  user_id, 
                                        med_id, 
                                        dosage_num, 
                                        dosage_unit, 
                                        time_of_day
        VALUES  (${u1Id}, ${m1Id}, 200, 'mg', '{"AM", "PM"}),
                (${u1Id}, ${m2Id}, 150, 'mg', '{"AM"}'),
                (${u1Id}, ${m3Id}, 1, 'pill', '{"AM", "Midday", "PM", "Evening"}')`);

    await db.query(`
        INSERT INTO medication_tracking (user_id, med_id, track_date, time_of_day, number)
        VALUES  (${u1Id}, ${m1Id}, '2024-09-21', 'AM', 2),
                (${u1Id}, ${m1Id}, '2024-09-21', 'PM', 1),
                (${u1Id}, ${m3Id}, '2024-09-21', 'Midday', 1)`);
};

async function commonBeforeEach() {
    await db.query("BEGIN");
};

async function commonAfterEach() {
    await db.query("ROLLBACK");
};

async function commonAfterAll(){
    await db.end();
};

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach, 
    commonAfterAll
};