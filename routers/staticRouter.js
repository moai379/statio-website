const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.user) return res.redirect("/home");
    return res.render("index");
});

router.get("/home", (req, res) => {
    return res.render("index");
});

router.get("/register", (req, res) => {
    return res.render("signup");
});

router.get("/signin", (req, res) => {
    return res.render("signin");
});

module.exports = router;