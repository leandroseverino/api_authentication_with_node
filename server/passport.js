const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');

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
         const user = await User.findOne({ "local.email": email });
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

// Google Token Strategy
passport.use("googleToken", new GooglePlusTokenStrategy({
    clientID: '232024416450-k91ij4gcs1t5src7jjoejfd7fq0ls18p.apps.googleusercontent.com',
    clientSecret: 'sR8_K4JUCjQfDhZ26UOtRLix'
}, async (accessToken, refreshToken, profile, done) => {
    try {

        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        // Check wheter this current user exists in our DB
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
            console.log('existingUser', existingUser);
            return done(null, existingUser);
        }

        // If the user not exists
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        })

        console.log('newUser', newUser);

        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false);
    }
}));