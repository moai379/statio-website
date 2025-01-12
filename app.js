const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./connect');

const userRoute = require('./routers/user');
const staticRoute = require("./routers/staticRouter");

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", staticRoute);
app.use("/user", userRoute);


app.listen(port, () => console.log(`Server Started at PORT:${port}`));