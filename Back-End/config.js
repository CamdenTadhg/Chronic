"use strict"

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "chronic-secret";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "chronic_test"
        : process.env.DATABASE_URL || "chronic";
};

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT, 
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};