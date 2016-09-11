var express = require('express');
var router  = express.Router();

var aboutSchema         = require('../models/about');
var qualificationSchema = require('../models/qualification');
var experienceSchema    = require('../models/experience');
var projectSchema       = require('../models/project');
var referenceSchema     = require('../models/reference');
var cvSchema            = require('../models/cv');

/** *** *** ***
 * Get
 * *** *** ***/
router.get('/', function(req, res, next) {
  res.render('cv/view', { user: req.user });
});

router.get('/new', isLoggedIn, resumeCV, function(req, res, next) {
  res.render("cv/about", { step: '1', user: req.user });
});

router.get('/about', isLoggedIn, resumeCV, function(req, res, next) {
  res.render('cv/about', { step: '1', user: req.user });
});

router.get('/qualification', isLoggedIn, resumeCV, function(req, res, next) {
  res.render('cv/qualification', { step: '2',user: req.user });
});

router.get('/experience', isLoggedIn, resumeCV, function(req, res, next) {
  res.render('cv/experience', { step: '3',user: req.user });
});

router.get('/project',isLoggedIn, resumeCV, function(req, res, next) {
  res.render('cv/project', { step: '4',user: req.user });
});

router.get('/reference',isLoggedIn, resumeCV, function(req, res, next) {
  res.render('cv/reference', { step: '5', user: req.user });
});

/** *** *** ***
 * Post
 * *** *** ***/
router.post('/about', isLoggedIn, function(req, res, next) {
  var about = new aboutSchema();
  
  var cv = new cvSchema();

  cv.owner = req.user._id;
  cv.step = 1;
  about.aboutContent    = req.body.content;
  about.driversLicense  = req.body.driver;
  about.workLicense     = req.body.permit;
  about.owner           = req.user._id;

  cv.save(function(err, cv) {
    if (err)
      console.log(err);
    
    about.cvid = cv._id;
    about.save(function(err, result) {
      if (err)
        console.log(err);

      res.redirect('qualification');
    });
  });
});

router.post('/qualification', isLoggedIn, function(req, res, next) {
  var qualification = new qualificationSchema();
  var cv = cvSchema;
  qualification.qualifications = req.body.qualifications;
  qualification.owner = req.user._id;

   cv.findOne({owner: req.user._id}, function(err, cvresult) {
      if (!cvresult)
        return next(new Error('Could not load Document'));
      else {
        qualification.cvid = cvresult._id;
        qualification.save(function(err, result) {
          if (err)
            console.log(err);
          // update step
          cvSchema.update({owner: req.user._id}, {
            step: 2
          }, function(err, numberAffected, rawResponse) {
            if (err)
              console.log(err);
            res.redirect('experience');
          });
        });
      }
   });
});

router.post('/experience', isLoggedIn, function(req, res, next) {
  var experience = new experienceSchema();
  var cv = cvSchema;
  
  experience.owner      = req.user._id;
  experience.title      = req.body.title;
  experience.content    = req.body.content;
  experience.dateStart  = req.body.dateStart;
  experience.dateEnd    = req.body.dateEnd;
  experience.voluntary  = req.body.voluntary;

   cv.findOne({owner: req.user._id}, function(err, cvresult) {
      if (!cvresult)
        return next(new Error('Could not load Document'));
      
      experience.cvid = cvresult._id;
      experience.save(function(err, result) {
        if (err)
          console.log(err);

        cvSchema.update({owner: req.user._id}, {
          step: 3
        }, function(err, numberAffected, rawResponse) {
          if (err)
            console.log(err);
          res.redirect('project');
        });
      });
   });
});

router.post('/project', isLoggedIn, function(req, res, next) {
  var project = new projectSchema();
  var cv = cvSchema;
  project.owner       = req.user._id;
  project.title       = req.body.title;
  project.description = req.body.description;
  project.dateEnd     = req.body.date;

  cv.findOne({owner: req.user._id}, function(err, cvresult) {
    if (!cvresult)
      return next(new Error('Could not load Document'));
        
    project.cvid = cvresult._id;
    project.save(function(err, result) {
      if (err)
        console.log(err);
        
      cvSchema.update({owner: req.user._id}, {
        step: 4
      }, function(err, numberAffected, rawResponse) {
        if (err)
          console.log(err);
        res.redirect('reference');
      });
    });
  });
});

router.post('/reference', isLoggedIn, function(req, res, next) {
  var reference = new referenceSchema();
  var cv = cvSchema;
  
  reference.owner         = req.user._id;
  reference.firstName     = req.body.name;
  reference.firstContact  = req.body.contact;
  reference.firstWait     = req.body.wait;
  reference.secondName     = req.body.secondname;
  reference.secondContact  = req.body.secondcontact;
  reference.secondWait     = req.body.secondwait;

  cv.findOne({owner: req.user._id}, function(err, cvresult) {
    if (!cvresult)
        return next(new Error('Could not load Document'));
    
    reference.cvid = cvresult._id;
    reference.save(function(err, result) {
      if (err)
        console.log(err);
      cvSchema.update({owner: req.user._id}, {
        step: 5
      }, function(err, numberAffected, rawResponse) {
        if (err)
          console.log(err);
        res.redirect('/cv');
      });
    });
  });
});

module.exports = router;

/** *** *** ***
 * Middleware
 * *** *** ***/
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}

function resumeCV(req, res, next) {

  cvSchema.findOne({owner: req.user._id}, function(err, cvresult) {
    switch(cvresult.step) {
      case 1:
        res.render('cv/qualification', { step: '2',user: req.user });
      break;
      case 2:
        res.render('cv/experience', { step: '3',user: req.user });
      break;
      case 3:
        res.render('cv/project', { step: '4',user: req.user });
      break;
      case 4:
        res.render('cv/reference', { step: '5',user: req.user });
      break;
      case 5:
        res.redirect('/cv');
      break;
      default:
        res.render('cv/qualification', { step: '1',user: req.user });
    }
  });
}