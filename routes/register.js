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

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const brother = new Brother({
            id: Date.now().toString(),
            email: req.body.email,
            password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            year: req.body.year,
            number: req.body.number,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        })
        const newBrother = await brother.save()
        res.status(201).redirect('/',)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

module.exports = router