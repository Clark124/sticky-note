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
    clientID: 'd7a08e2c53a97deab6e1',
    clientSecret: 'a55a6e36e768fbec745350b8a5372fa797d1e32c',
    callbackURL: "http://clark0123.leanapp.cn/auth/github/callback"
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
