"use strict"

const db = require('../db.js');
const User = require('../models/user');
const Diagnosis = require('../models/diagnosis');
const Symptom = require('../models/symptom');
const Medication = require('../models/med');
const {createToken} = require('../helpers/tokens');

async function commonBeforeAll() {
    await db.query("DELETE from users");
    await db.query("DELETE from diagnoses");
    await db.query("DELETE from symptoms");
    await db.query("DELETE from medications");

    await User.register({
            user_id: 1,
            password: "password",
            name: "U1",
            email: "u1@test.com"
    });
    await User.register({
        user_id: 2,
        password: 'password', 
        name: 'U2', 
        email: 'u2@test.com'
    });
    await User.register({
        user_id: 3,
        password: 'password', 
        name: 'U3', 
        email: 'u3@test.com'
    });

    await Diagnosis.create({
        diagnosis_id: 1,
        diagnosis: 'D1',
        synonyms: ['d1', 'disease']
    });
    await Diagnosis.create({
        diagnosis_id: 2,
        diagnosis: 'D2', 
        synonyms: []
    });
    await Diagnosis.create({
        diagnosis_id: 3,
        diagnosis: 'D3', 
        synonyms: ['d3']
    });

    await User.assignDiag(1, 1, ["pain"]);
    await User.assignDiag(2, 2, []);
    await User.assignDiag(3, 3, ["fatigue", "long covid"]);

    await Symptom.create({
        symptom_id: 1,
        symptom: 'S1'
    });
    await Symptom.create({
        symptom_id: 2,
        symptom: 'S2'
    });
    await Symptom.create({
        symptom_id: 3,
        symptom: 'S3'
    });

    await User.assignSymp(1, 1);
    await User.assignSymp(2, 2);
    await User.assignSymp(3, 3);

    await Symptom.track({
        user_id: 1,
        symptom_id: 1, 
        track_date: '2024-09-21',
        timespan: '12-4 AM',
        severity: 3
    });
    await Symptom.track({
        user_id: 1,
        symptom_id: 1,
        track_date: '2024-09-21',
        timespan: '8 AM-12 PM',
        severity: 2
    });
    await Symptom.track({
        user_id: 1,
        symptom_id: 1,
        track_date: '2024-09-21',
        timespan: '12-4 PM',
        severity: 1
    });

    await Medication.create({
        med_id: 1,
        medication: 'M1'
    });
    await Medication.create({
        med_id: 2,
        medication: 'M2'
    });
    await Medication.create({
        med_id: 3,
        medication: 'M3'
    });

    await User.assignMed(1, 1, 300, 'mg', ['AM', 'PM']);
    await User.assignMed(2, 2, 150, 'mg', ['AM']);
    await User.assignMed(3, 3, 1, 'pill', ['AM', 'Midday', 'PM', 'Evening']);

    await Medication.track({
        user_id: 1, 
        med_id: 1, 
        track_date: '2024-09-21',
        time_of_day: 'AM', 
        number: 2
    });
    await Medication.track({
        user_id: 1, 
        med_id: 1, 
        track_date: '2024-09-21',
        time_of_day: 'PM', 
        number: 1
    });
    await Medication.track({
        user_id: 3, 
        med_id: 3, 
        track_date: '2024-09-21',
        time_of_day: 'Midday', 
        number: 1
    });
};

async function commonBeforeEach() {
    await db.query("BEGIN");
};

async function commonAfterEach() {
    await db.query("ROLLBACK");
};

async function commonAfterAll() {
    await db.end();
}

const u1Token = createToken({user_id: 1, email: 'u1@test.com', isAdmin: false});
const u2Token = createToken({user_id: 2, email: 'u2@test.com', isAdmin: true});
const u3Token = createToken({user_id: 3, email: 'u3@test.com', isAdmin: false});

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token, 
    u3Token
}