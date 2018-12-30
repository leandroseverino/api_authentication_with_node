const User = require('../models/user');

module.exports = {
    signUp: async (req, res, next) => {
        const { email, password } = req.value.body;

        // Check if there is a user with the same email
        const foundedUser = await User.findOne({ email });

        if (foundedUser) {
            return res.status(409).json({ 'error': 'Email is already in use !.'});
        }

        // Save a new User
        const newUser = new User({
            email,
            password
        });

        await newUser.save();

        // Respond with the token
        res.json({ user: 'Created !'});

    },
    signIn: async (req, res, next) => {
        // Generate token
        console.log('UsersController.signIn() called !');
    },
    secret: async (req, res, next) => {
        console.log('UsersController.secret) called !');
    }
}