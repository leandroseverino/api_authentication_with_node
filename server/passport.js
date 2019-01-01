const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('./configuration');
const User = require('./models/user')

// All about JWT Strategy
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
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
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {

        // https://console.developers.google.com/apis/credentials?project=controlfsite
        // https://developers.google.com/oauthplayground

        /*
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
        */

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

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {

        // https://developers.facebook.com/apps/568805240211657/dashboard/
        // https://developers.facebook.com/tools/explorer/568805240211657

        /*
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        */
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));