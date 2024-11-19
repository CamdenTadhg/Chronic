import axios from 'axios';
import { start } from 'repl';


const BASE_URL = "http://localhost:3001";

/** API Class.
 * 
 * Ties together all methods used to get/send to the back-end api. 
 */

class ChronicAPI {
    // token for interaction with the API
    static token;

    static async request(endpoint, data= {}, method = "get"){
        // console.log("API Call:", endpoint, method, data);
        const url = `${BASE_URL}/${endpoint}`;
        const headers = {authorization: ChronicAPI.token};
        try {
            return (await axios({url, method, data, headers})).data;
        } catch(err){
            let message = err.response.data.error.message;
            let textMessage;
            if (Array.isArray(message)){
                for (let item of message){
                    textMessage = textMessage + item;
                }
            } else {
                textMessage = message;
            }
            throw textMessage;
        }
    }

    //Individual API routes

    /**Checks the server's readiness */
    static async ready(){
        try{
            let response = await this.request('auth/ready');
            if (response.ok) {
                const delay = Date.now() - start;
                return {status: "ok", delay};
            }
            return {status: "error"};
        } catch(error) {
            return {status: "error"};
        }
    }

    /** Login a user and receive back a token. LoginData = {username, password} */
    static async signin(signinData){
        try {
            let response = await this.request('auth/signin', signinData, 'post');
            this.token = response.token;
            return response;
        } catch(error) {
            throw error;
        }
    };

    /** Signup a user and receive back a token. SignupData = {email, password, name} */
    static async register(registerData){
        try{
            let response = await this.request('auth/register', registerData, 'post');
            this.token = response.token;
            return response;
        } catch(error){
            throw error;
        }
    };

    /**Gets a user profile which includes connected diagnoses, symptoms, and medications. userId included as a url parameter*/
    static async getUser(userId){
        try {
            let response = await this.request(`users/${userId}`);
            return response.user;
        } catch(error){
            throw error;
        }
    }

    /**Edits a user profile's email, name, or password. userId included as a url parameter. Data to be changed in the request body.*/
    static async editUser(userId, editData){
        try {
            let response = await this.request(`users/${userId}`, editData, 'patch');
            return response.user;
        } catch(error) {
            throw error;
        }
    }

    /**Deletes a user profile. userId included as a url parameter */
    static async deleteUser(userId){
        try{
            let response = await this.request(`users/${userId}`, {},  'delete');
            return response;
        } catch(error) {
            throw error;
        }
    }

    /**Gets a list of all diagnoses in the database */
    static async getAllDiagnoses(){
        try {
            let response = await this.request(`diagnoses`);
            return response.diagnoses;
        } catch(error){
            throw error;
        }
    }

    /**Connects a user to a diagnosis and saves associated keywords. If diagnosis does not yet exist, creates diagnosis. diagnosisId and userId included as url parameters; for new diagnosis, diagnosisId = 0 and new diagnosis is included in request body. userDiagnosisData = {keywords, diagnosisName (optional)}*/
    static async connectUserDiagnosis(diagnosisId, userId, userDiagnosisData){
        try {
            let response = await this.request(`diagnoses/${diagnosisId}/users/${userId}`, userDiagnosisData, 'post');
            return response.userDiagnosis;
        } catch(error){
            throw error;
        }
    }

    /**Updates a user-diagnosis connection with new keywords. diagnosisId and userId included as url parameter. userDiagnosisData = {keywords} */
    static async updateUserDiagnosis(diagnosisId, userId, userDiagnosisData){
        try {
            let response = await this.request(`diagnoses/${diagnosisId}/users/${userId}`, userDiagnosisData, 'patch');
            return response.userDiagnosis;
        } catch(error){
            throw error;
        }
    }

    /**Disconnects a user from a diagnosis and deletes associated keywords. diagnosisId and userId included as url parameters */
    static async disconnectUserDiagnosis(diagnosisId, userId){
        try {
            let response = await this.request(`diagnoses/${diagnosisId}/users/${userId}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Gets a list of all symptoms in the database */
    static async getAllSymptoms(){
        try {
            let response = await this.request(`symptoms/`);
            return response.symptoms;
        } catch(error){
            throw error;
        }
    }

    /** Connects a user to a symptom. If symptom does not yet exist, creates symptom. symptomId and userId included as url parameters; for new symptom, symptom name included in request body*/
    static async connectUserSymptom(symptomId, userId, userSymptomData){
        try {
            let response = await this.request(`symptoms/${symptomId}/users/${userId}`, userSymptomData, 'post');
            return response.userSymptom;
        } catch(error){
            throw error;
        }
    }

    /** Changes the connection between a user and a symptom to a different symptom. If symptom does not yet exist, creates symptom. symptomId and userId included as url parameters; different symptom id or new symptom name included in request body */
    static async changeUserSymptom(symptomId, userId, userSymptomData){
        try {
            let response = await this.request(`symptoms/${symptomId}/users/${userId}`, userSymptomData, 'patch');
            return response.userSymptom;
        } catch(error){
            throw error;
        }
    }

    /**Disconnects a user from a symptom. symptomId and userId included as url parameters */
    static async disconnectUserSymptom(symptomId, userId){
        try {
            let response = await this.request(`symptoms/${symptomId}/users/${userId}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Creates a new symptom tracking record. userId included as url parameter. symptomTrackingData = {symptomId, trackDate, timespan, severity}. */
    static async createSymptomTrackingRecord(userId, symptomTrackingData){
        try {
            let response = await this.request(`symptoms/users/${userId}/tracking`, symptomTrackingData, 'post');
            return response.trackingRecord;
        } catch(error){
            throw error;
        }
    }

    /**Returns all symptom tracking records for a specific date formatted for display. userId included as url parameter. symptomTrackingParameters = {date}. */
    static async getSymptomTrackingRecords(userId, date){
        try {
            let response = await this.request(`symptoms/users/${userId}/trackingbydate/${date}`, {}, 'get');
            return response.trackingRecords;
        } catch(error){
            throw error;
        }
    }

    /**Changes the severity in a single symptom tracking record. userId and symtrackId (tracking record Id) included as url parameters. New severity included in request body. */
    static async updateSeverityLevel(userId, symtrackId, severityData){
        try {
            let response = await this.request(`symptoms/users/${userId}/tracking/${symtrackId}`, severityData, 'patch');
            return response.trackingRecord;
        } catch(error){
            throw error;
        }
    }

    /**Deletes a symptom tracking record. UserId and symtrackId included as url parameters */
    static async deleteSymptomTrackingRecord(userId, symtrackId){
        try {
            let response = await this.request(`symptoms/users/${userId}/tracking/${symtrackId}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Deletes an entire day of symptom tracking records. UserId inclueded as url parameter. Date included in request body.  */
    static async deleteSymptomTrackingDate(userId, date){
        try {
            let response = await this.request(`symptoms/users/${userId}/trackingbydate/${date}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Gets a list of all medications in the database */
    static async getAllMeds(){
        try {
            let response = await this.request(`meds/`);
            return response.medications;
        } catch(error){
            throw error;
        }
    }

    /** Connects a user to a medication and saves protocol (dosage & time of day). If medication does not yet exist, creates medication. medId and userId included as url parameters; for new medication, medId = 0 and new med is included in request body*/
    static async connectUserMedication(medId, userId, userMedData){
        try {
            let response = await this.request(`meds/${medId}/users/${userId}`, userMedData, 'post');
            return response.userMedication;
        } catch(error){
            throw error;
        }
    }

    /** Changes the connection between a user and a medication to a different medication or updates the medication protocol. medId and userId included as url parameters; all other data included in request body */
    static async changeUserMedication(medId, userId, medData){
        try {
            let response = await this.request(`meds/${medId}/users/${userId}`, medData, 'patch');
            return response.userMedication;
        } catch(error){
            throw error;
        }
    }

    /**Disconnects a user from a medication. medId and userId included as url parameters */
    static async disconnectUserMedication(medId, userId){
        try {
            let response = await this.request(`meds/${medId}/users/${userId}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Creates a new medication tracking record. userId included as url parameter. All other data included in request body. */
    static async createMedTrackingRecord(userId, medTrackingData){
        try {
            let response = await this.request(`meds/users/${userId}/tracking`, medTrackingData, 'post');
            return response.trackingRecord;
        } catch(error){
            throw error;
        } 
    }

    /**Returns all medication tracking records for a specific date formatted for display. userId included as url parameter. Date included in request body. */
    static async getMedTrackingRecords(userId, date){
        try {
            let response = await this.request(`meds/users/${userId}/trackingbydate/${date}`, {}, 'get');
            return response.trackingRecords;
        } catch(error){
            throw error;
        }
    }

    /**Changes the number in a single medication tracking record. userId and medtrackId (tracking record Id) included as url parameters. New number included in request body. */
    static async updateNumber(userId, medtrackId, numberData){
        try {
            let response = await this.request(`meds/users/${userId}/tracking/${medtrackId}`, numberData, 'patch');
            return response.trackingRecord;
        } catch(error){
            throw error;
        }
    }

    /**Deletes a medication tracking record. UserId and medtrackId included as url parameters */
    static async deleteMedTrackingRecord(userId, medtrackId){
        try {
            let response = await this.request(`meds/users/${userId}/tracking/${medtrackId}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Deletes an entire day of medication tracking records. UserId included as url parameter. Date included in request body.  */
    static async deleteMedTrackingDate(userId, date){
        try {
            let response = await this.request(`meds/users/${userId}/trackingbydate/${date}`, {}, 'delete');
            return response;
        } catch(error){
            throw error;
        }
    }

    /**Gets tracking data based on the selected symptoms*/
    static async getSymptomData(symptomData){
        try {
            const {userId, startDate, endDate, symptoms} = symptomData;
            let response = await axios.get(`${BASE_URL}/data/symptoms`, {
                params: {
                    userId,
                    startDate,
                    endDate,
                    symptoms
                }});
            return response.data.dataset;
        } catch(error) {
            throw error;
        }
    }

    /**Gets tracking data based on the selected medications */
    static async getMedData(medData){
        try {
            const {userId, startDate, endDate, meds} = medData;
            let response = await axios.get(`${BASE_URL}/data/meds`, {
                params: {
                    userId,
                    startDate,
                    endDate,
                    meds
                }});
            return response.data.dataset;
        } catch(error) {
            throw error;
        }
    }

    /**Gets a list of article ids based on a set of keywords */
    static async getArticleIds(keywords){
        try{
            let response = await axios.get(`${BASE_URL}/latest/articleIds`, {
                params: {keywords}
            });
            return response.data.articleIds;
        } catch(error) {
            throw error;
        }
    }

    /**Gets a list of article details based on a set of article ids */
    static async getArticles(articleIds){
        try{
            let response = await axios.get(`${BASE_URL}/latest/articles`, {
                params: {articleIds}
            });
            return response.data.articles
        } catch(error) {
            throw error;
        }
    }
}

export default ChronicAPI;