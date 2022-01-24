const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

async function getBrotherByEmail(email) {
    try {
        const brothers = await Brother.find( { email:email})
        console.log(brothers)
        return brothers
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getBrotherById(id) {
    try {
        const brothers = await Brother.find( {id:id})
        return brothers
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
}

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const brother = await getBrotherByEmail(email)
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
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((brother, done) => { return done(null, brother.id) })
    passport.deserializeUser((id, done) => { 
        return done(null, getBrotherById(id))

    })
}

module.exports = initialize