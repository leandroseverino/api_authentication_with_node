const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routerHelpers');
const UsersController = require('../controllers/users');

const passportSigIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogleOAuth = passport.authenticate('googleToken', { session: false });
const passportFacebookOAuth = passport.authenticate('facebookToken', { session: false });

router.route('/signup')
    .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.authSchema), passportSigIn, UsersController.signIn);

router.route('/secret')
    .get(passportJWT, UsersController.secret);

router.route('/oauth/google')
    .post(passportGoogleOAuth, UsersController.googleOAuth);

router.route('/oauth/facebook')
    .post(passportFacebookOAuth, UsersController.facebookOAuth);

    module.exports = router;