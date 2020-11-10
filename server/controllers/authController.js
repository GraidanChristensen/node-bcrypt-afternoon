const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        //deconstruct from body and get data base
        const {username, password, isAdmin} = req.body;
        const db = req.app.get('db');  

        //call db function get user set result of the array to existing user
        const result = await db.get_user([username]);
        const existingUser = result[0];

        // if user already exists send 409 and taken 
        if(existingUser){
           return res.status(409).send("Username taken");
        }
        // if its not taken create user
        else {
            // create hash password with salt on it
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            // call db register user file
            const registeredUser = await db.register_user([isAdmin, username, hash]); //returns array
            const user = registeredUser[0]; // this is new user object

            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username,
            }
           return res.status(201).send(req.session.user);
        }
    }
}