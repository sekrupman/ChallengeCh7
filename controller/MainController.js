const CryptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');
const { User_game, user_history, admin, sequelize, Sequelize } = require('../models');

class MainController {
    static showLandingPage(req, res) {
        res.render('Homepage');
    }

    static getRegisterAdmin(req, res) {
        res.render('signUpAdmin')
    }
    static getRegisterUser(req, res) {
        res.render('signUpUser')
    }    
    
    static getLoginUser(req, res) {
        res.render('loginUser')
    }

    static getLoginAdmin(req, res) {
        res.render('loginAdmin')
    }

    static getDashboard(req, res) {
      res.render('dashboard')
    }

    static getProfile(req, res){
      res.render('profile')
    }

    //REGISTER ADMIN
    static async postRegisterAdmin (req, res) {
        try{
        const data = req.body;
        const username = data.username;
        const email = data.email;
        const password = data.password;

        const hashedPassword = CryptoJS.HmacSHA256(password, process.env.SECRET_LOGIN).toString();

        // Check ketersediaan email/username
        const existingAdminByUsername = await admin.findOne({ where:{username:username} });
        const existingAdminByEmail = await admin.findOne({ where:{email:email} });
        
        if (existingAdminByUsername || existingAdminByEmail) {
            return res.send('<script>alert("Username/email already taken"); window.location.href = "/signup-admin";</script>');
        }        
        // Add admin
        const adminData = await admin.create({ email, username, password: hashedPassword });
            res.redirect('login-admin');
          
        }catch (error) {
        console.log('Internal Server Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    //REGISTER USER
    static async postRegisterUser (req, res) {
        try{
        const data = req.body;
        const username = data.username;
        const email = data.email;
        const password = data.password;

        //HASH PASSWORD
       const hashedPassword = CryptoJS.HmacSHA256(password, process.env.SECRET_LOGIN).toString();

       // cek ketersediaan email/username
       const existingUserByUsername = await User_game.findOne({ where:{username:username} });
       const existingUserByEmail = await User_game.findOne({ where:{email:email} });
       
       if (existingUserByUsername || existingUserByEmail) {
         return res.send('<script>alert("Username/email already taken"); window.location.href = "/signup-user";</script>');
       }        
           // Add user
           const userData = await User_game.create({ email, username, password: hashedPassword });
           res.redirect('login-user');
         
       }catch (error) {
         console.log('Internal Server Error:', error);
         res.status(500).send('Internal Server Error');
       }
   }

   // LOGIN USER
   static async postLoginUser(req, res) {
    try {
      const { email, password } = req.body;
  
      const userData = await User_game.findOne({
        where: { email },
      });
  
      if (!userData) {
        return res.send('<script>setTimeout(function() { alert("Invalid email/password"); window.location.href = "/login-user"; }, 100);</script>');
      }
  
      const hashedPassword = CryptoJS.HmacSHA256(password, process.env.SECRET_LOGIN).toString();
  
      if (hashedPassword !== userData.password) {
        return res.send('<script>setTimeout(function() { alert("Invalid email/password"); window.location.href = "/login-user"; }, 100);</script>');
      }
      const token = JWT.sign({ email, id:userData.id }, process.env.JWT_SECRET, {expiresIn:300});
      res.cookie('token', token, { maxAge:10000 })

      res.redirect(`/profile/${userData.id}`);
    } catch (error) {
      console.log('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  //LOGIN ADMIN
  static async postLoginAdmin(req, res) {
    try {
      const data = req.body;
      const username = data.username;
      const email = data.email;
      const password = data.password;
  
      const adminData = await admin.findOne({
        where: {
          email: email,
        },
        attributes: ['email', 'password'],
      });
  
      if (!adminData) {
        return res.send('<script>setTimeout(function() { alert("Invalid email/password"); window.location.href = "/login-admin"; }, 100);</script>');
      }
  
      const hashedPassword = CryptoJS.HmacSHA256(password, process.env.SECRET_LOGIN).toString();

      if (hashedPassword !== adminData.password) {
        return res.send('<script>setTimeout(function() { alert("Invalid email/password"); window.location.href = "/login-admin"; }, 100);</script>');
      }
      const token = JWT.sign({ username, id:adminData.id }, process.env.JWT_SECRET, {expiresIn:300});
      res.cookie('token', token, { maxAge:10000 })

      res.redirect('dashboard');
    } catch (error) {
      console.log('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // DASHBOARD
static async getDashboard(req, res) {
  try {
    const userData = await User_game.findAll({});
    res.render('dashboard', { userData: userData });
  } catch (error) {
    console.log('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

//PROFIL
static async getProfile(req, res) {
  try {
    const { userId } = req.params;
    const user = await User_game.findOne({ where: { 
      id: userId,
    }, attributes: ['email', 'username'],
  });
    res.render('profile', { user: user });
    console.log(user)
  } catch (error) {
    console.log('Internal Server error:', error);
    res.status(500).send('Internal server error');
  }
}

//LOGOUT USER
static async logoutUser(req, res) {
  try {
    res.clearCookie('token');
    res.redirect('/login');
  } catch (error) {
    console.log('Internal Server error:', error);
    res.status(500).send('Internal server error');
  }
}

}


module.exports = { MainController };