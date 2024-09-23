"use strict";

/** DIAGNOSIS ROUTES */

const jsonschema = require('jsonschema');
const express = require('express');
const {ensureLoggedIn, ensureAdminOrSelf, ensureAdmin} = require('../middleware/auth');
const {BadRequestError} = require('../expressError');
const Diagnosis = require('../models/diagnosis');
const diagnosisNewSchema = require('../schemas/diagnosisNew.json');
const diagnosisUpdateSchema = require('../schemas/diagnosisUpdate.json');
const userDiagnosisNewSchema = require('../schemas/userDianosisNew.json');
const userDiagnosisUpdateSchema = require('../shemas/userDiagnosisUpdate.json');

const router = express.Router();

/** POST /diagnoses/ {diagnosis, synonyms} => {diagnosis}
 * 
 * Returns new diagnosis with diagnosisId, diagnosis, synonyms
 * 
 * Authorization required: admin
*/

router.post('/', ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, diagnosisNewSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const diagnosis = await Diagnosis.create(req.body);
        return res.status(201).json({diagnosis});
    } catch(err) {
        return next(err);
    }
})

/** GET /diagnoses/ => {diagnoses: [{diagnosisId, diagnosis, synonyms}, ...]
 * 
 * Returns list of all diagnoses
 * 
 * Authorization required: logged in
*/

router.get('/', ensureLoggedIn, async function (req, res, next){
    try {
        const diagnoses = await Diagnosis.getAll();
        return res.json({diagnoses});
    } catch (err) {
        return next(err);
    }
});

/** GET /diagnoses/:diagnosisId  => {diagnosis: {diagnosisId, diagnosis, synoynms}
 * 
 * Returns details of a single diagnosis
 * 
 * Authorization required: admin
*/

router.get('/:diagnosisId', ensureLoggedIn, ensureAdmin, async function (req, res, next){
    try {
        const diagnosis = await Diagnosis.getOne(req.params.diagnosisId);
        return res.json({diagnosis});
    } catch (err) {
        return next(err);
    }
});

/** PATCH /diagnoses/:diagnosisId {diagnosis, synonyms} =>  {diagnosis: {diagnosisId, diagnosis, synonyms}
 * 
 * Edits a single diagnosis's details
 * 
 * Authorization required: admin
*/

router.patch('/:diagnosisId', ensureLoggedIn, ensureAdmin, async function (req, res, next){
    try {
        const validator = jsonschema.validate(req.body, diagnosisUpdateSchema);
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const diagnosis = await Diagnosis.edit(req.params.diagnosisId, req.body);
        return res.json({diagnosis});
    } catch (err) {
        return next(err);
    }
});

/** DELETE /diagnoses/:diagnosisId => {deleted: diagnosisId}
 * 
 * Deletes a single diagnosis
 * 
 * Authorization required: admin
*/

router.delete('/:diagnosisId', ensureLoggedIn, ensureAdmin, async function (req, res, next){
    try {
        await Diagnosis.delete(req.params.diagnosisId);
        return res.json({deleted: req.params.diagnosisId});
    } catch (err) {
        return next(err);
    }
});

/** POST /diagnoses/:diagnosisId/users/:userId {keywords} = {userDiagnosis: {userId, diagnosisId, keywords}} 
 * 
 * Connects a user to a diagnosis and adds search keywords
 * 
 * Authorization required: admin or self
*/

router.post('/diagnoses/:diagnosisId/users/:userId', ensureLoggedIn, ensureAdminOrSelf, async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userDiagnosisNewSchema);
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const userDiagnosis = await Diagnosis.userConnect(req.params.userId, req.params.diagnosisId, req.body);
        return res.status(201).json({userDiagnosis});
    } catch(err) {
        return next(err);
    }
});

/** PATCH /diagnoses/:diagnosisId/users/:userId {keywords} => {userDiagnosis: {userId, diagnosisId, keywords
 * 
 * Edits the keywords on a user's diagnosis
 * 
 * Authorization required: admin or self
*/

router.patch('/diagnoses/:diagnosisId/users/:userId', ensureLoggedIn, ensureAdminOrSelf, async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userDiagnosisUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const userDiagnosis = await Diagnosis.userUpdate(req.params.userId, req.params.diagnosisId, req.body);
        return res.json({userDiagnosis});
    } catch(err){
        return next(err);
    }
});

/** DELETE /diagnoses/:diagnosisId/users/:userId => {deleted: [diagnosisId, userId]} 
 * 
 * Disconnects a user from a diagnosis, deleting the search keywords
 * 
 * Authorization required: admin or self
*/

router.delete('/diagnoses/:diagnosisId/users/:userId', ensureLoggedIn, ensureAdminOrSelf, async function (req, res, next){
    try {
        const userDiagnosis = await Diagnosis.userDisconnect(req.params.userId, req.params.diagnosisId);
        return res.json({deleted: [`User ${req.params.userId}`, `Diagnosis ${req.params.diagnosisId}`]})

    } catch(err) {
        return next(err);
    }
});