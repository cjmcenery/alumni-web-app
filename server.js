if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO)
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const logoutRouter = require('./routes/logout')
const profileRouter = require('./routes/profile')
const directoryRouter = require('./routes/directory')
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
const connectEnsureLogin = require('connect-ensure-login')

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




// app.get('/', (req, res) => {
//     res.render("index.ejs", { last_name: last_name} )
// })


app.get('/', checkAuthenticated, async (req, res) => {
    const brother = (await getBrotherByEmail(req.session.user)).pop()
    res.render('index.ejs', { last_name: brother.last_name})
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
app.use('/logout', logoutRouter)
app.use('/profile', profileRouter)
app.use('/directory', directoryRouter)

app.listen(5500)

module.exports = { checkAuthenticated, checkNotAuthenticated}