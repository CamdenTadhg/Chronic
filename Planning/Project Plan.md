## Design User Flows (9/10)
## Design Basic Interface (9/13)
## Design Database Schema (9/15)
## Plan API Use (9/15)

## Write Back End (9/19-9/26)
    ## Construct Database
        - schema (what needs to cascade)
        - seed
            - 25 diagnoses
            - 25 medications
            - 25 symptoms
            - 3 users
            - 2 diagnoses per user
            - 5 medications per user
            - 5 symptoms per user
            - 25 symptom tracking records
            - 25 medication tracking records
    ## Set Up Backend
        - install all necessary regular packages
        - install all necessary dev packages
        - create app.js
        - create routes folder, models folder, helpers folder, middleware folder
    ## Auth Routes
        - write tests
        - json web token setup 
        - authorization middleware
        - login token route
        - registration route
    ## User Routes & Models
        - write model tests
        - write models
            - authentication
            - registration
            - get individual user
            - update user record
            - delete user record
        - write route tests
        - write routes
            - create new user
            - get individual user
            - patch user
            - delete user
    ## Diagnosis Routes
        - write model tests
        - write models
            - create diagnosis 
            - get list of all diagnoses
            - get individual diagnosis
            - update diagnosis
            - delete diagnosis
        - write route tests
        - write routes
            - create diagnosis
            - get list of all diagnoses
            - get individual diagnosis
            - update diagnosis
            - delete diagnosis
    ## Symptom Routes
        - write model tests
        - write models
            - create symptom
            - get list of all symptoms
            - get individual symptom
            - update symptom
            - delete symptom
            - create symptom tracking record
            - get list of all symptom tracking records
            - get individual symptom tracking record
            - get all symptom tracking record for a single day
            - update symptom tracking record
            - delete symptom tracking record
            - delete symptom tracking records for a single day
        - write route tests
        - write routes
            - create symptom 
            - get list of all symptoms
            - get individual symptom
            - update symptom
            - delete symptom
            - create symptom tracking record
            - get list of all symptom tracking records
            - get individual symptom tracking record
            - get all symptom tracking records for as single day
            - update symptom tracking record
            - delete symptom tracking record
            - delete symptom tracking records for a single day
    ## Medication Routes
        - write model tests
        - write models
            - create medication
            - get list of all medications
            - get individual medication
            - update medication
            - delete medication
            - create medication tracking record
            - get list of all medication tracking records
            - get individual medication tracking record
            - get all medication tracking records for a single day
            - update medication tracking record
            - delete medication tracking record
            - delete medication tracking records for a single day
    ## Data Routes
        - write model tests
        - write models
            - get data points on certain factors for a certain period of time
        - write route tests
        - write routes
            - get data points on certain factors for a certain period of time

## Write Front End
    ## Set Up React Site
    ## Home Page
    ## Signed In Home Page
    ## The Latest Sidebar & Page
    ## Profile Page
    ## Tracking Page
    ## Data Page
    ## About Page

## Style Site
    ## Home Page
    ## Signed In Home Page
    ## The Lastest Page
    ## Profile Page
    ## Tracking Page
    ## Data Page
    ## About Page

## Documentation & Deployment
    ## Add comments
    ## Write ReadMe
    ## Deploy back end
    ## Deploy front end

## Future Work 
    ## Add a help section with directions
    ## Fill existing database with records
        - 50 diagnoses
        - 100 symptoms
        - 100 medications
        - 15 users
        - one month of tracking data for each user
    ## Track Bowel Movements
    ## Track Menstrual Cycle
    ## Track Doctor Visits
    ## Set and Track Goals
    ## Track Mood
    ## Track Factors
    ## Track Energy Levels
    ## Track Health Measurements
    ## Track Sleep
    ## Track Nutrition
    ## Statistical Insights
    ## Reminders
    ## Admin Interface