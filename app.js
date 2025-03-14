const express = require('express');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local');
const {connectToMongoDB} = require('./connect');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');

const app = express();
const port = 8001;

connectToMongoDB(process.env.MONGODB ?? "mongodb://localhost:27017/statio-website").then(() =>
    console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/resources'));
app.use(express.static(__dirname + '/gallery'));

app.use(session({
    secret: 'somethingsomething',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================
// Routes
//========================

app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post("/signup", async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });


    return res.redirect("/signin");
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordGenerateToken(email, password);
        const user = await User.findOne({ email: email });
        req.session.user = { id: user._id, username: user.username, email: user.email };
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/signin");
    }

});

app.get("/logout", function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.redirect("/");
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

app.listen(port, () => console.log(`Server Started at PORT:${port}`));