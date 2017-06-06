var express = require('express');
var router = express.Router();

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
})


passport.use(new GitHubStrategy({
    clientID: '70786e5bebe72594ad57',
    clientSecret: '7197d9196be1ac5fa4b5a94c855082297cd8a2a4',
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        done(null, profile)
    }))

router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),

    function (req, res) {
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        }
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.session.destroy()
    res.redirect('/')

})


module.exports = router;
