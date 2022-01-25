const express = require('express')
const router = express.Router()
const Brother = require('../models/brother')
const bodyParser = require('body-parser')
const passport = require('passport')

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


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

router.get('/', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs')
})

router.post('/', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
}), async (req, res) => {
    req.session.user = req.body.email

    res.redirect('/')

})




module.exports = router