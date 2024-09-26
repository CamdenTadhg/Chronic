"use strict";

const db = require('../db');
const {
    NotFoundError,
    BadRequestError} = require('../expressError');

class Medication {
    /**Create
     * inputs: {medication}
     * outputs: {medId, medication}
     * BadRequest error on duplicate medication
     */
    static async create({medication}){
        const duplicateCheck = await db.query(
            `SELECT med_id
            FROM medications
            WHERE medication = $1`,
            [medication]
        );
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`${medication} already exists.`)
        };

        const result = await db.query(
            `INSERT INTO medications
            (medication)
            VALUES ($1)
            RETURNING med_id AS 'medId', medication`,
            [medication]
        );
        const medication = result.rows[0];
        return medication;
    };

    /**GetAll
     * inputs: none
     * outputs: [{medId, medication}, ...]
     */

    static async getAll(){
        const result = await db.query(
            `SELECT med_id AS 'medId',
                    medication
            FROM medications
            ORDER BY medication`
        );
        return result.rows;
    };

    /**GetOne
     * inputs: medId
     * outputs: {medId, medication}
     * NotFound error on medication not found
     */

    static async getOne(medId) {
        const result = await db.query(
            `SELECT med_id AS 'medId',
                    medication
            FROM medications
            WHERE med_id = $1`,
            [medId]
        );
        const medication = result.rows[0];
        if (!medication) throw new NotFoundError('No such medication exists');
        return medication;
    };

    /**Edit
     * inputs: medId, {medication}
     * outputs: {medId, medication}
     * NotFound error on medication not found
     */

    static async edit(medId, data){
        const duplicateCheck = await db.query(
            `SELECT med_id
            FROM medications
            WHERE medication = $1`,
            [data.medication]
        );
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`${data.medication} already exists.`)
        };

        const result = await db.query(
            `UPDATE medications
            SET medication = $1
            WHERE med_id = $2
            RETURNING   med_id AS 'medId',
                        medication`,
            [data.medication, medId]);
        const medication = result.rows[0];

        if (!medication) throw new NotFoundError('No such medication exists');
        return medication;
    };

    /**Delete
     * inputs: medId
     * outputs: medId
     * NotFound error on medication not found
     */

    static async delete(medId){
        let result = await db.query(
            `DELETE
            FROM medications
            WHERE med_id = $1
            RETURNING med_id AS 'medId'`,
            [medId]);
        const medication = result.rows[0]
        if (!medication) throw new NotFoundError('No such medication exists');
        return medication;
    };

    /**UserConnect
     * inputs: userId, medId
     * outputs: {userId, medId, medication}
     * NotFound error if medication or user is not found
     * BadRequest error if medication connection already exists
     */

    static async userConnect(userId, medId){
        const duplicateCheck = await db.query(
            `SELECT * 
            FROM users_medications
            WHERE user_id = $1 AND med_id = $2`,
            [userId, medId]
        );
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`This medication has already been assigned to this user`);
        };

        const user = await db.query(
            `SELECT * 
            FROM users
            WHERE user_id = $1`,
            [userId]);
        if (!user) throw new NotFoundError('No such user exists');
        const medication = await db.query(
            `SELECT * 
            FROM medications
            WHERE med_id = $1`,
            [medId]);
        if (!medication) throw new NotFoundError('No such medication exists');

        const result = await db.query(
            `INSERT INTO users_medications
            (user_id, med_id)
            VALUES ($1, $2)
            RETURNING user_id AS 'userId', med_id AS 'medId'`,
            [userId, medId]);
        const userMedication = result.rows[0];
        return userMedication;
    };

    /**UserGet
     * inputs: userId, medId
     * outputs: {userId, medId}
     * NotFound error if userMedication is not found
     */

    static async userGet(userId, medId){
        const result = await db.query(
            `SELECT user_id AS 'userId',
                    med_id AS 'medId'
            FROM users_medications
            WHERE user_id = $1 AND med_id = $2`,
            [userId, medId]
        );
        const userMedication = result.rows[0];
        if (!userMedication) throw new NotFoundError('No such userMedication exists');
        return userMedication;
    }

    /**UserChange
     * inputs: userId, medId, {medId, medication}
     * outputs: {userId, medId, medication}
     * Replaces the existing med_id in the table with a new medication id, 
     * with cascading change to all associated tracking records. 
     * NotFound error if userMedication not found
     * BadRequest error if medication connection already exists
     */

    static async userChange(userId, medId, data){
        const duplicateCheck = await db.query(
            `SELECT * FROM users_medications
            WHERE user_id = $1 AND med_id = $2`,
            [userId, data.newMedicationId]);
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError('This medication has already been assigned to this user');
        }
        const user = await db.query(
            `SELECT * FROM users WHERE user_id = $1`, [userId]);
        if (!user) throw new NotFoundError('No such user exists');
        const medication = await db.query(
            `SELECT * FROM medications WHERE med_id = $1`, [data.newMedicationId]);
        if (!medication) throw new NotFoundError('No such medication exists');

        const result = await db.query(
            `UPDATE users_medications
            SET med_id = $1
            WHERE user_id = $2 AND med_id = $3
            RETURNING   user_id AS 'userId',
                        med_id AS 'medId'`, 
            [data.newMedicationId, userId, medId]);
        const userMedication = result.rows[0];

        if (!userMedication) throw new NotFoundError('No such userMedication exists');
        return userMedication;
    };

    /**UserDisconnect 
     * inputs: userId, medId
     * outputs: {userId, medId}
     * NotFound error if userMedication not found
    */

    static async userDisconnect(userId, medId){
        let result = await db.query(
            `DELETE
            FROM users_medications
            WHERE user_id = $1 AND med_id = $2
            RETURNING   user_id AS 'userId',
                        med_id AS 'medId`, [userId, medId]);
        const userMedication = result.rows[0];
        if (!userMedication) throw new NotFoundError('No such userMedication exists');
        return userMedication;
    };

    /*Track
     * inputs: {userId, medId, date, timeOfDay, number}
     * outputs: {userId, medId, date, timeOfDay, number}
     * NotFound error if userMedication connection not found
     * BadRequest error with existing tracking record
    */
    
    static async track({userId, medId, trackDate, timeOfDay, number}){
        const duplicateCheck = await db.query(
            `SELECT * 
            FROM medication_tracking
            WHERE user_id = $1 AND med_id = $2
            AND track_date = $3 AND time_of_day = $4`, 
            [userId, medId, trackDate, timeOfDay]);
        if (duplicateCheck.rows[0]) throw new BadRequestError('That tracking record already exists');

        const userMedicationCheck = await db.query(
            `SELECT * 
            FROM users_medications
            WHERE user_id = $1 AND med_id = $2`,
            [userId, medId]);
        if (userMedicationCheck.rows[0]) throw new NotFoundError('That medication is not associated with that user');

        const result = await db.query(
            `INSERT INTO medication_tracking
            (user_id, med_id, date, time_of_day, number)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING   user_id AS 'userId',
                        med_id AS 'medId',
                        track_date AS 'trackDate',
                        time_of_day,
                        number,
                        tracked_at AS 'trackedAt`,
            [userId, medId, trackDate, timeOfDay, number]);
        const trackingRecord = result.rows[0];
        return trackingRecord;
    };


    /**GetAllTracking
     * inputs: userId
     * outputs: [{userId, medId, date, timeOfDay, number}, ...]
     * NotFound error with invalid user
     */
    
    static async getAllTracking(userId){
        const user = await db.query(
            `SELECT user_id 
            FROM users
            WHERE user_id = $1`,[userId]);
        if (!user) throw new NotFoundError('No such user exists');
        const result = await db.query(
            `SELECT st.medtrack_id AS 'medtrackId',
                    st.user_id AS 'userId',
                    s.medication,
                    st.track_date AS 'trackDate',
                    st.time_of_day,
                    st.number
            FROM medication_tracking AS st
            INNER JOIN users_medications as us ON us.med_id = st.medId
            INNER JOIN medications AS s ON st.med_id = s.med_id
            WHERE st.user_id = $1
            ORDER BY st.trackDate, st.time_of_day CASE
                WHEN st.time_of_day = 'AM' THEN 1
                WHEN st.time_of_day = 'Midday' THEN 2
                WHEN st.time_of_day = 'PM' THEN 3
                WHEN st.time_of_day = 'Evening' THEN 4
                END`,
                [userId]);
        if(!result.rows[0]) return [];
        return result.rows;
    };

    /**GetOneTracking
     * inputs: medtrackId
     * outputs: {userId, medId, date, timeOfDay, number}
     * NotFound error if tracking record not found
     */

    static async getOneTracking(medtrackId, userId){
        const result = await db.query(
            `SELECT medtrack_id AS 'medtrackId',
                    user_id AS 'userId',
                    med_id AS 'medId', 
                    track_date AS 'trackDate', 
                    time_of_day AS 'timeOfDay',
                    number
            FROM medication_tracking
            WHERE medtrack_id = $1 AND user_id = $2`,
            [medtrackId, userId]);
        const trackingRecord = result.rows[0];
        if (!trackingRecord) throw new NotFoundError('No such tracking record exists');
        return trackingRecord;
    };

    /**GetDayTracking 
     * inputs: userId, date
     * outputs: [{userId, medId, date, timeOfDay, number}, ...]
     * Returns empty array for a day with no tracking records
     * NotFound error with invalid user
    */

    static async getDayTracking(userId, trackDate){
        const userCheck = await db.query(
            `SELECT user_id FROM users
            WHERE user_id = $1`,
            [userId]
        );
        if (!userCheck) throw new NotFoundError('No such user exists');
        const result = await db.query(
            `SELECT st.medtrack_id AS 'medtrackId',
                    st.user_id AS 'userId',
                    s.medication,
                    st.track_date AS 'trackDate',
                    st.time_of_day AS 'timeOfDay',
                    st.number
            FROM medication_tracking AS st
            INNER JOIN users_medications as us ON us.med_id = st.medId
            INNER JOIN medications AS s ON st.med_id = s.med_id
            WHERE st.user_id = $1 AND st.date = $2
            ORDER BY st.time_of_day CASE
                WHEN st.time_of_day = 'AM' THEN 1
                WHEN st.time_of_day = 'Midday' THEN 2
                WHEN st.time_of_day = 'PM' THEN 3
                WHEN st.time_of_day = 'Evening' THEN 4
                END`,
                [userId, trackDate]);
        if (!result.rows[0]) return []
        return result.rows;
    };

    /**EditTracking
     * inputs: userId, medId, date, timeOfDay, {number}
     * outputs: {medtrackId, userId, medId, date, timeOfDay, number}
     * NotFound error with invalid tracking record
     */

    static async editTracking(userId, medId, trackDate, timeOfDay, number){
        const result = await db.query(
            `UPDATE medication_tracking
            SET number = $1, tracked_at = CURRENT_TIMESTAMP
            WHERE user_id = $2 AND med_id = $3
            AND track_date = $4 AND time_of_day = $5
            RETURNING   medtrack_id AS 'medtrackId',
                        user_id AS 'userId', 
                        med_id AS 'medId',
                        track_date AS 'trackDate',
                        time_of_day AS 'timeOfDay',
                        number`,
            [number, userId, medId, trackDate, timeOfDay]);
        const trackingRecord = result.rows[0];
        if (!trackingRecord) throw new NotFoundError('No such tracking record exists');
        return trackingRecord;
    };

    /**DeleteTracking
     * inputs: userId, medId, date, timeOfDay
     * outputs: none
     * NotFound error with invalid tracking record
     */

    static async deleteTracking(userId, medId, trackDate, timeOfDay){
        let result = await db.query(
            `DELETE 
            FROM medication_tracking
            WHERE user_id = $1 AND med_id = $2
            AND track_date = $3 AND time_of_day = $4
            RETURNING medtrack_id AS 'medtrackId'`,
            [userId, medId, trackDate, timeOfDay]);
        const trackingRecord = result.rows[0];
        if (!trackingRecord) throw new NotFoundError('No such tracking record exists');
        return trackingRecord;
    };

    /**DeleteDayTracking
     * inputs: userId, date
     * outputs: [{medtrack_id}, ...]
     * NotFound error with invalid date
     */

    static async deleteDayTracking(userId, trackDate){
        let result = await db.query(
            `DELETE
            FROM medication_tracking
            WHERE user_id = $1 AND track_date = $2
            RETURNING medtrack_id AS 'medtrackId'`,
            [userId, trackDate]);
        const trackingRecords = result.rows;
        if (!trackingRecords) throw new NotFoundError('No such tracking records exist');
        return trackingRecords;
    };
};

module.exports = Medication;