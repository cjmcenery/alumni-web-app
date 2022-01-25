const express = require('express')
const router = express.Router()
const Brother = require('../models/brother')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const server = require('../server')

//Remove this and import a module with it
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

async function getBrotherByEmail(email) {
    try {
        const brothers = await Brother.find( { email:email})
        return brothers
    }catch (err) {
        
    }
}

router.get('/', checkAuthenticated, async function(req, res){
    const brothers = (await Brother.find())
    res.render('directory.ejs', { brothers: brothers})
  });


module.exports = router