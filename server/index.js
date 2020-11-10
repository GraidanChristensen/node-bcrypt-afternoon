require('dotenv').config();
const authControl = require("./controllers/authController");
const express = require('express');
const session = require('express-session');
const massive = require('massive');

const PORT = 4000;

const app = express();

app.use(express.json());

const {CONNECTION_STRING, SESSION_SECRET} = process.env;

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db);
    console.log("connected to database");
}).catch(err => console.log(err));

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
})
);


//ENDPOINTS
app.post('/auth/register', authControl.register);


app.listen(PORT, ()=>console.log(`Listening on port: ${PORT}`));