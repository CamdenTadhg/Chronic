"use strict";

const db = require('../db');
const bcrypt = require('bcrypt');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');
const {sqlForPartialUpdate} = require('../helpers/sql');
const {BCRYPT_WORK_FACTOR} = require('../config.js');

class User {
    /**Authenticate
     * inputs: email, password
     * output: {userId, email, name, isAdmin, lastLogin}
     * Unauthorized error if user is not found or password is wrong
     */

    static async authenticate(email, password) {
        //does the user exist?
        const result = await db.query(
            `SELECT user_id AS "userId", 
                    email, 
                    password, 
                    name, 
                    is_admin AS "isAdmin"
            FROM users
            WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];

        if (user) {
            //compare hashed password to a new hash from provided password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true){
                await db.query(`UPDATE users SET last_login = CURRENT_TIMESTAMP 
                    WHERE email = $1 RETURNING user_id AS 'userId', email, name, is_admin AS 'isAdmin', last_login AS 'lastLogin`, [user.email]);
                return user;
            } else {
                throw new UnauthorizedError('Invalid password');
            }
        } else {
            throw new UnauthorizedError('Invalid email');
        }
    }

    /**Register 
     * inputs: {email, password, name, isAdmin}
     * output: {userId, email, name, isAdmin, lastLogin}
     * BadRequest error on duplicate email
    */

    static async register({email, password, name}){
        const duplicateCheck = await db.query(
            `SELECT email 
            FROM users
            WHERE email = $1`,
            [email]
        );
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`There is already an account for ${email}`);
        };

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (password, name, email)
            VALUES ($1, $2, $3)
            RETURNING user_id AS 'userId', email, name, is_admin AS 'isAdmin', last_login AS 'lastLogin'`, 
            [hashedPassword, name, email]
        );
        const user = result.rows[0];
        return user;
    }

    /**Create
     * inputs: {email, password, name, isAdmin}
     * output: {userId, email, name, isAdmin, lastLogin}
     * BadRequest error on duplicate email
     */

    static async create({email, password, name, isAdmin}){
        const duplicateCheck = await db.query(
            `SELECT email 
            FROM users
            WHERE email = $1`,
            [email]
        );
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`There is already an account for ${email}`);
        };

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (password, name, email, isAdmin, lastLogin)
            VALUES ($1, $2, $3, $4, NULL)
            RETURNING user_id AS 'userId', email, name, is_admin AS 'isAdmin', last_login AS 'lastLogin'`, 
            [hashedPassword, name, email, isAdmin]
        );
        const user = result.rows[0];
        return user;
    }

    /**GetAll
     * inputs: none
     * outputs: [{userId, email, name, isAdmin, registrationDate, lastLogin}, ...]
     */

    static async getAll(){
        const result = await db.query(
            `SELECT user_id AS "userId",
                    email,
                    name, 
                    is_admin AS "isAdmin",
                    registration_date AS "registrationDate",
                    last_login AS "lastLogin"
            FROM users
            ORDER BY email`
        );
        return result.rows;
    }

    /**GetOne
     * inputs: userId
     * outpus: {userId, email, name, isAdmin, lastLogin, diagnoses[{diagnosis, keywords}, ...], symptoms[], medications[{medication, dosageNum, dosageUnit, timeOfDay}, ...]}
     */
    
    static async getOne(userId) {
        const userRes = await db.query(
            `SELECT user_id AS "userId",
                    email, 
                    name, 
                    is_admin AS "isAdmin",
                    last_login AS "lastLogin"
            FROM users
            WHERE user_id = $1`,
            [userId]
        );
        const user = userRes.rows[0];
        if (!user) throw new NotFoundError('No such user exists');

        const diagRes = await db.query(
            `SELECT d.diagnosis,
                    ud.keywords
            FROM diagnoses AS d
            INNER JOIN users_diagnoses AS ud ON d.diagnosis_id = ud.diagnosis_id
            WHERE ud.user_id = $1`,
            [userId]);
        user.diagnoses = diagRes.rows;

        const sympRes = await db.query(
            `SELECT s.symptom
            FROM symptoms AS s
            INNER JOIN users_symptoms AS us ON s.symptom_id = us.symptom_id
            WHERE us.user_id = $1`,
            [userId]);
        user.symptoms = sympRes.rows;

        const medRes = await db.query(
            `SELECT m.medication,
                    um.dosage_num AS "dosageNum",
                    um.dosage_unit AS "dosageUnit",
                    um.time_of_day AS "timeOfDay"
            FROM medications AS m
            INNER JOIN users_mediations AS um ON m.med_id = um.med_id
            WHERE um.user_id = $1`,
            [userId]);
        user.medications = medRes.rows;

        return user;
    }

    /**Edit
     * inputs: userId, data: {email, name, password}
     * partial updates allowed
     * outputs: {email, name, password}
     * NotFound error if user is not found
     */

    static async edit(userId, data){
        const duplicateCheck = await db.query(
            `SELECT email
            FROM users
            WHERE email = $1`,
            [data.email]
        )
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`There is already an account for ${data.email}`)
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const {setCols, values} = sqlForPartialUpdate(
            data,{});
        const idVarIdx = "$" + (values.length + 1);
        const userQuery =   `UPDATE users
                            SET ${setCols}
                            WHERE user_id = ${idVarIdx}
                            RETURNING   user_id AS "userId",
                                        email,
                                        name,
                                        is_admin AS "isAdmin"`;
        const result = await db.query(userQuery, [...values, userId]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError('No such user exists');
        return user;
    }

    /**Delete
     * inputs: userId
     * outputs: userId
     * NotFound error if user is not found
     */

    static async delete(userId) {
        let result = await db.query(
            `DELETE 
            FROM users
            WHERE user_id = $1
            RETURNING user_id`,
            [userId]);
        const user = result.rows[0];
        if (!user) throw new NotFoundError('No such user exists');
    }

    /**AssignDiag (Assign Diagnosis)
     * inputs: userId, diagnosisId, keywords
     * output: userId, diagnosisId, keywords
     * BadRequest error if diagnosis already assign
     * NotFound error if either user or diagnosis not found
     */

    static async assignDiag(userId, diagnosisId, keywords ){
        const user = await db.query(`SELECT user_id FROM users WHERE user_id = $1`, [userId]);
        if (!user) {
            throw new NotFoundError('No such user exists');
        };
        const diagnosis = await db.query(`SELECT diagnosis_id FROM diagnoses WHERE diagnosis_id = $1`, [diagnosisId]);
        if (!diagnosis) {
            throw new NotFoundError('No such diagnosis');
        }
        const duplicateCheck = await db.query(`SELECT u.email AS "email", d.diagnosis AS "diagnosis"
            FROM users_diagnoses AS ud
            INNER JOIN users AS u ON u.user_id = ud.user_id
            INNER JOIN diagnoses AS d ON d.diagnosis_id = ud.diagnosis_id
            WHERE user_id = $1 AND diagnosis_id = $2`, [userId, diagnosisId]);
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`Diagnosis ${duplicateCheck.rows[0].diagnosis} has already been assigned to ${duplicateCheck.rows[0].email}`);
        };

        const result = await db.query(
            `INSERT INTO users_diagnoses(user_id, diagnosis_id, keywords) 
            VALUES ($1, $2, $3) 
            RETURNING user_id AS "userId", diagnosis_id AS "diagnosisId", keywords`,
            [userId, diagnosisId, keywords]
        )
        return result.rows[0];
    }

    /**AssignSymp (Assign Symptom)
     * inputs: userId, symptomId
     * output: userId, symptomId
     * BadRequest error if symptom already assign
     * NotFound error if either user or symptom not found
     */

    static async assignSymp(userId, symptomId){
        const user = await db.query(`SELECT user_id FROM users WHERE user_id = $1`, [userId]);
        if (!user) {
            throw new NotFoundError('No such user exists');
        };
        const symptom = await db.query(`SELECT symptom_id FROM symptoms WHERE symptom_id = $1`, [symptomId]);
        if (!symptom) {
            throw new NotFoundError('No such symptom');
        }
        const duplicateCheck = await db.query(`SELECT u.email AS "email", s.symptom AS "symptom"
            FROM users_symptoms AS us
            INNER JOIN users AS u ON u.user_id = us.user_id
            INNER JOIN symptoms AS s ON s.symptom_id = us.symptom_id
            WHERE user_id = $1 AND symptom_id = $2`, [userId, symptomId]);
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`Symptom ${duplicateCheck.rows[0].symptom} has already been assigned to ${duplicateCheck.rows[0].email}`);
        };

        const result = await db.query(
            `INSERT INTO users_symptoms(user_id, symptom_id) 
            VALUES ($1, $2) 
            RETURNING user_id AS "userId", symptom_id AS "symptomId"`,
            [userId, symptomId]
        )
        return result.rows[0];
    }
    
    /**AssignMed (Assign Medication)
     * inputs: userId, medId, dosageNum, dosageUnit, timeOfDay
     * output: userId, medId, dosageNum, dosageUnit, timeOfDay
     * BadRequest error if medication already assign
     * NotFound error if either user or medication not found
     */

    static async assignMed(userId, medId, dosageNum, dosageUnit, timeOfDay){
        const user = await db.query(`SELECT user_id FROM users WHERE user_id = $1`, [userId]);
        if (!user) {
            throw new NotFoundError('No such user exists');
        };
        const medication = await db.query(`SELECT med_id FROM medications WHERE med_id = $1`, [medId]);
        if (!medication) {
            throw new NotFoundError('No such medication');
        }
        const duplicateCheck = await db.query(`SELECT u.email AS "email", m.medication AS "medication"
            FROM users_medications AS um
            INNER JOIN users AS u ON u.user_id = um.user_id
            INNER JOIN medications AS m ON m.med_id = um.med_id
            WHERE user_id = $1 AND med_id = $2`, [userId, medId]);
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`Symptom ${duplicateCheck.rows[0].medication} has already been assigned to ${duplicateCheck.rows[0].email}`);
        };

        const result = await db.query(
            `INSERT INTO users_medications(user_id, med_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING   user_id AS "userId", 
                        med_id AS "medId",
                        dosage_num AS "dosageNum",
                        dosage_unit AS "dosageUnit,
                        time_of_day AS "timeOfDay"`,
            [userId, medId, dosageNum, dosageUnit, timeOfDay]
        );
        return result.rows[0];
    }
}

module.exports = User;