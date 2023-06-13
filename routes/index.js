var express = require('express');
var router = express.Router();
const { user_game, user_history, admin, sequelize, Sequelize } = require('../models');
const { MainController} = require('../controller/MainController')

/* GET home page. */
router.get('/', MainController.showLandingPage);

/* GET SIGNUP */
router.get('/sign-up', function(req,res, next){
  res.render('signup')
})

//GET LOGIN
router.get('/login', function(req,res, next){
  res.render('login')
})

//LOGIN USER
router.get('/login-user', function(req,res, next){
  res.render('loginUser')
})

//LOGIN ADMIN
router.get('/login-admin', function(req,res, next){
  res.render('loginAdmin')
})

//USER PROFILE
router.get('/profile', function(req,res, next){
  res.render('profile')
})

//GAMES
router.get('/rock-scissors-paper', function(req,res, next){
  res.render('Games')
})


//REGISTER PAGE
router.get('/signup-user', MainController.getRegisterUser);
router.get('/signup-admin', MainController.getRegisterAdmin);

router.post('/signup-admin', MainController.postRegisterAdmin);
router.post('/signup-user', MainController.postRegisterUser);

//LOGIN PAGE
router.get('/login-user', MainController.getLoginUser);
router.get('/login-admin', MainController.getLoginAdmin);

router.post('/login-user', MainController.postLoginUser);
router.post('/login-admin', MainController.postLoginAdmin);

//DASHBOARD ADMIN
router.get('/dashboard', MainController.getDashboard);

//USER PROFILE
router.get('/profile/:userId', MainController.getProfile);

//LOGOUT USER
router.get('/profile/logout', MainController.logoutUser)


module.exports = router;