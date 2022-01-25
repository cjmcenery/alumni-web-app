const express = require('express')
const router = express.Router()
const Brother = require('../models/brother')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const server = require('../server')


router.post('/', function(req, res){
    req.logout();
    res.redirect('/');
  });


module.exports = router