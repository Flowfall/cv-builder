/*jshint loopfunc: true */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var pdf = require('html-pdf');
//var html = fs.readFileSync('./test/businesscard.html', 'utf8');

var cvSchema            = require('../models/cv');
var aboutSchema         = require('../models/about');
var qualificationSchema = require('../models/qualification');
var experienceSchema    = require('../models/experience');
var projectSchema       = require('../models/project');
var referenceSchema     = require('../models/reference');
var profileSchema      = require('../models/profile');
/** *** *** ***
 * Get
 * *** *** ***/

// --- Index
router.get('/', function(req, res, next) { 
  res.render('index', { title: 'Index', user: req.user });
});

// --- Login
router.get('/login', function(req, res) {
  res.render('login', { title: 'Log', message: req.flash('loginMessage') });
});

// --- Register
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', message: req.flash('registerMessage') });
});

// --- Profile
router.get('/profile', isLoggedIn, function(req, res) {
  profileSchema.findOne({owner: req.user._id}, function(err, profile) {
    if (err)
      console.log(err);

    if (profile)
      res.render('profile', { title: 'Profile', user: req.user, profile: profile });
    else {
      var newProfile = new profileSchema();
      res.render('profile', { title: 'Profile', user: req.user, profile: newProfile });
    }
  });
});

// --- logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/cv', isLoggedIn, function(req, res, next) {
  buildCV(req.user, res);
});
/** *** *** ***
 * Post
 * *** *** ***/

// --- register
router.post('/register', passport.authenticate('local-register', {
  successRedirect: '/profile',
  failureRedirect: '/register',
  failureFlash: true
}));

// --- login
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));

router.post('/profile', isLoggedIn, function(req, res, next) {
  var profile = {};
  profile.forename = req.body.forename;
  profile.surname = req.body.surname;
  profile.email = req.body.email;
  profile.phone = req.body.phone;
  profile.address = req.body.address;
  profile.country = req.body.country;
  profile.owner = req.user._id;

  profileSchema.findOneAndUpdate({owner: req.user._id}, profile, {upsert: true}, function(err, profile) {
    if (err)
      console.log(err);
    res.redirect('/profile'); 
  });
});

router.post('/downloadpdf', isLoggedIn, function(req, res, next) {
  cvSchema.find({owner: user._id}, function(err, cv) {
    if (cv.length === 0) {
      res.render('cv', {user: user, cv: false });

    } else {
      var completeCV = [];
      profileSchema.find({owner: user._id}, function(err, profile) {
        aboutSchema.find({cvid: cv[0]._id}, function(err, about) {
          qualificationSchema.find({cvid: cv[0]._id}, function(err, qualification) {
            experienceSchema.find({cvid: cv[0]._id}, function(err, experience) {
              projectSchema.find({cvid: cv[0]._id}, function(err, project) {
                referenceSchema.find({cvid: cv[0]._id}, function(err, reference) {
                  completeCV.about          = about;
                  completeCV.qualification  = qualification;
                  completeCV.experience     = experience;
                  completeCV.project        = project;
                  completeCV.reference      = reference;
                  completeCV.profile        = profile;
                  
                });
              });
            });
          });
        });
      });
    }
  });
});

/** *** *** ***
 * Authorization
 * *** *** ***/

// --- locally
router.get('/connect/local', function(req, res) {
  res.render('connect-local', { message: req.flash('loginMessage') });
});
router.post('/connect/local', passport.authenticate('local-register', {
  successRedirect : '/profile',
  failureRedirect : '/connect/local',
  failureFlash    : true
}));

// --- unlink local
router.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

/** *** *** ***
 * Middleware
 * *** *** ***/
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
}

function buildCV(user, res) {
  cvSchema.find({owner: user._id}, function(err, cv) {
    if (cv.length === 0) {
      res.render('cv', {user: user, cv: false });

    } else {
      var completeCV = [];
      profileSchema.find({owner: user._id}, function(err, profile) {
        aboutSchema.find({cvid: cv[0]._id}, function(err, about) {
          qualificationSchema.find({cvid: cv[0]._id}, function(err, qualification) {
            experienceSchema.find({cvid: cv[0]._id}, function(err, experience) {
              projectSchema.find({cvid: cv[0]._id}, function(err, project) {
                referenceSchema.find({cvid: cv[0]._id}, function(err, reference) {
                  completeCV.about          = about;
                  completeCV.qualification  = qualification;
                  completeCV.experience     = experience;
                  completeCV.project        = project;
                  completeCV.reference      = reference;
                  completeCV.profile        = profile;
                  res.render('cv', {user: user, cv: completeCV });
                });
              });
            });
          });
        });
      });
    }
  });
}

module.exports = router;