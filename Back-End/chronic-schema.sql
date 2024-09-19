CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE diagnoses (
    diagnosis_id SERIAL PRIMARY KEY,
    diagnosis CITEXT NOT NULL UNIQUE,
    synonyms TEXT[]
)

CREATE TABLE users_diagnoses (
    user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
    diagnosis_id INTEGER REFERENCES diagnoses (diagnosis_id),
    keywords TEXT[],
    PRIMARY KEY (user_id, diagnosis_id)
)

CREATE TABLE symptoms (
    symptom_id SERIAL PRIMARY KEY,
    symptom TEXT NOT NULL UNIQUE
)

CREATE TABLE users_symptoms (
    user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
    symptom_id INTEGER REFERENCES symptoms (symptom_id),
    PRIMARY KEY (user_id, symptom_id)
)

CREATE TYPE timespan AS ENUM ('12-4 AM', '4-8 AM', '8 AM-12 PM', '12-4 PM', '4-8 PM', '8 PM-12 AM')

CREATE TABLE symptom_tracking (
    symtrack_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    symptom_id INTEGER NOT NULL,
    tracked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    timespan timespan NOT NULL,
    severity INTEGER NOT NULL CHECK (severity >= 0 AND severity <= 5),
    FOREIGN KEY (user_id, symptom_id) REFERENCES users_symptoms (user_id, symptom_id) ON DELETE CASCADE
)

CREATE TABLE medications (
    med_id SERIAL PRIMARY KEY,
    medication TEXT NOT NULL UNIQUE
)

CREATE TABLE users_medications (
    user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
    med_id INTEGER REFERENCES medications (med_id),
    PRIMARY KEY (user_id, med_id)
)

CREATE TYPE time_of_day AS ENUM('AM', 'Midday', 'PM', 'Evening')

CREATE TABLE medication_tracking (
    medtrack_id SERIAL PRIMARY KEY, 
    user_id INTEGER NOT NULL,
    med_id INTEGER NOT NULL,
    tracked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    time_of_day time_of_day NOT NULL,
    number INTEGER CHECK (number >= 1),
    FOREIGN KEY (user_id, med_id) REFERENCES users_medications (user_id, med_id) ON DELETE CASCADE
)