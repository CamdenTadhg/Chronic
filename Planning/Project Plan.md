## Design User Flows (9/10)
## Design Basic Interface (9/13)
## Design Database Schema (9/15)
## Plan API Use (9/15)

## Write Back End (9/19-9/30)

    ## Medication Routes & Models (9/27)
        - write routes
            - update mediation tracking schema
            - POST /meds/
            - GET /meds/
            - GET /meds/:medId
            - PATCH meds/:medId
            - DELETE /meds/:medId
            - POST /meds/:medId/users/:userId
            - GET /meds/:medId/users/:userId
            - PATCH /meds/:medId/users/:userId
                - tricky
            - DELETE /meds/:medId/user/:userId
            - POST /meds/users/:userId/tracking
            - GET /meds/users/:userId/tracking
            - GET /meds/users/:userId/tracking/:medtrackId
            - GET /meds/users/:userId/tracking/date
            - PATCH /meds/users/:userId/tracking/:medtrackId
            - DELETE /meds/users/:userId/tracking/:medtrackId
            - DELETE /meds/users/:userId/tracking/date
            - COMMIT
    ## Data Routes & Models (9/27)
        - write model tests
            - get data points on certain factors for a certain period of time
            - COMMIT
        - write models
            - get data points on certain factors for a certain period of time
            - COMMIT
        - write route tests
            - get data points on certain factors for a certain period of time
            - COMMIT
        - write routes
            - get data points on certain factors for a certain period of time
            - COMMIT
    ## Testing (9/28-9/30)
        - get all tests working
            - general
            - helpers
            - middleware
            - models
            - routes
        - COMMIT
        - spot test with Insomnia
        - COMMIT

## Write Front End (10/1-10/15)
    ## Set Up React Site
    ## Plan Out Components
    ## Home Page
    ## Signed In Home Page
    ## The Latest Sidebar & Page
    ## Profile Page
    ## Tracking Page
    ## Data Page
    ## About Page

## Style Site (10/15-10/25)
    ## Home Page
    ## Signed In Home Page
    ## The Lastest Page
    ## Profile Page
    ## Tracking Page
    ## Data Page
    ## About Page

## Documentation & Deployment (10/25-10/31)
    ## Add comments
    ## Write ReadMe
    ## Deploy back end
    ## Deploy front end
    ## Hand in Assignment


## Future Work 
    ## Add a help section with directions
    ## Fill existing database with records
        - 50 diagnoses
        - 100 symptoms
        - 100 medications
        - 15 users
        - one month of tracking data for each user
    ## Add analytics
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
        ## Add Trend Lines
    ## Reminders
    ## Admin Interface
    ## Diagnosis Message Boards