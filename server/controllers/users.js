const JWT = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'api-authentication',
        sub: user.id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        const { email, password } = req.value.body;

        // Check if there is a user with the same email
        const foundedUser = await User.findOne({ "local.email": email });

        if (foundedUser) {
            return res.status(409).json({ 'error': 'Email is already in use !.'});
        }

        // Save a new User
        const newUser = new User({
            method: 'local',
            local: {
                email: email,
                password: password
            }            
        });

        await newUser.save();

        // Respond with the token
        const token = signToken(newUser);

        res.status(201).json({ token });
    },
    signIn: async (req, res, next) => {
        // Generate the new token and return it to the user.
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    googleOAuth: async (req, res, next) => {
        // Generate token
        console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    secret: async (req, res, next) => {
        console.log('UsersController.secret) called !');
        res.json({ secret: "resource"});
    }
}