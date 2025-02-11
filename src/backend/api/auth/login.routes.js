const express = require('express');
const router = express.Router();
const loginController = require('./login.service')
const jwt = require('jsonwebtoken')
const secret = 'secret'
const auth = require('../../services/testAuth')

router.get('/login/authorize', async (req, res) =>{
    await auth(req,res)
})