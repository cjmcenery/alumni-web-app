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
    const brother = (await getBrotherByEmail(req.session.user)).pop()
    res.render('profile.ejs', { brother: brother})
  });


//We need to first get the user by id, and then use this brother


router.put('/edit/:email', async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const brother = (await getBrotherByEmail(req.params.email)).pop()
    brother.email = req.body.email
    brother.password = hashedPassword
    brother.first_name = req.body.first_name
    brother.last_name = req.body.last_name
    brother.year = req.body.year
    brother.address1 = req.body.address1
    brother.address2 = req.body.address2
    brother.city = req.body.city
    brother.state = req.body.state
    brother.zip = req.body.zip
    brother.account_type = "user"
    await brother.save()
    res.redirect('/')
})

module.exports = router