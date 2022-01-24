if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:AlphaKappa@cluster0.iues4.mongodb.net/Cluster0?retryWrites=true&w=majority')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const initializePassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const Brother = require('./models/brother')
const LocalStrategy = require('passport-local').Strategy
const passportLocalMongoose = require('passport-local-mongoose');
const brother = require('./models/brother')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')

//connecting database
const brothers = mongoose.connection
brothers.on('error', (error) => console.error(error))
brothers.once('open', ()=>console.log('Connected to database'))


//Get brother by email




app.use(bodyParser.urlencoded({ extended: true }))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

async function getBrotherByEmail(email) {
    try {
        const brothers = await Brother.find( { email:email})
        return brothers
    }catch (err) {
        
    }
}

async function getBrotherById(id) {
    try {
        const brothers = await Brother.find( {id:id})
        return brothers[0]
    }catch (err) {
        
    }
}

passport.use(new LocalStrategy({usernameField: 'email'}, async (email,password,done) => {
    const brother = await (await getBrotherByEmail(email)).pop()
    if (brother==null) {
        return done(null, false, {message: 'No brother with that email'})
    }

    try {
        if (await bcrypt.compare(password, brother.password)) {
            return done(null, brother)
        } else {
            return done(null, false, { message: 'Password incorrect'})
        }
    } catch (e) {
        console.log(e)
        return done(e)
    }
}))


passport.serializeUser((brother, done) => { 
    return done(null, brother._id) 
})

passport.deserializeUser((_id, done) => { 
    return done(null, getBrotherById(_id))
})


const last_name = "Hello"

// app.get('/', (req, res) => {
//     res.render("index.ejs", { last_name: last_name} )
// })

app.get('/', checkAuthenticated, async (req, res) => {
    console.log(req.session.user)
    res.render('index.ejs', { last_name: last_name})
})

app.get('/brothers', async (req, res) => {
    try {
        const brothers = await Brother.find( {email:'test@test'})
        res.send(brothers)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})


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



app.use('/login', loginRouter)
app.use('/register', registerRouter)

app.listen(5500)

module.exports = { checkAuthenticated, checkNotAuthenticated}