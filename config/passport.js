var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var cvSchema = require('../models/cv');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            cvSchema.findOne({owner: user._id}, function(err, cvresult) {
                if (cvresult !== null) {
                     user.local.started = cvresult.step;
                     done(err, user);
                } else {
                    done(err, user);
                }
            });
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();
        process.nextTick(function() {
            User.findOne({ 'local.email' : email }, function(err, user) {
                if (err)
                    return done(err);
                
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No User found.'));
                    
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
                
                else
                    return done(null, user);
            });
        });
    }));

    passport.use('local-register', new LocalStrategy({
        usernameField : 'email',
        passwordField: 'password',
        passReqToCallback : true,      
    }, function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();

        process.nextTick(function() {
            if (!req.user) {
                User.findOne({ 'local.email' : email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();

                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });
            } else if ( !req.user.local.email ) {
                User.findOne({ 'local.email' : email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);

                        user.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });
                    }
                });
            }
        });
    }));
};