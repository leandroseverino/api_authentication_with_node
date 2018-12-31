const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const { JWT_SECRET } = require('./configuration');
const User = require('./models/user')

// All about JWT Strategy
passport.use( new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // Find the user specified in token
        const user = await User.findById(payload.sub);
        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }
        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
         // Find the user specified in token
         const user = await User.findOne({ email });
         // If user doesn't exists, handle it
         if (!user) {
             return done(null, false);
         }
         // Check if the password is correct 
         const isMatch = await user.isValidPassword(password);
         if (!isMatch) {
            return done(null, false);
         }
         // Otherwise, return the user
         done(null, user);
    } catch (error) {
        done(error, false);
    }
}));