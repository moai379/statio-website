const express = require('express');
const { handleUserRegistration, handleUserSignin } = require('../controllers/user');
const router = express.Router();

console.log('userRoute middleware executed');

router.post('/register', handleUserRegistration);
router.post('/signin', handleUserSignin);

module.exports = router;