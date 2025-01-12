const { v4: uuidv4 } = require("uuid");
const User = require('../models/user');
const { setUser } = require("../services/auth");
const bcrypt = require('bcrypt');


async function handleUserRegistration(req, res) {
    try {
        const { name, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, username, email, hashedPassword });
        return res.redirect('/signin');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error creating user');
    }
}

async function handleUserSignin(req, res) {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.hashedPassword)))
        return res.render("signin", {
            error: "Invalid Username or Password",
        });

        const sessionId = uuidv4();
        setUser(sessionId, User);
        res.cookie("uid", sessionId);
        return res.redirect("/home");
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error signing in:', error.message);
    }
} 


module.exports = {
    handleUserRegistration,
    handleUserSignin
}