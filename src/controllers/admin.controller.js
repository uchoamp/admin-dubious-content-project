const adminCtrl = {};
const passport = require("passport");


// Admin login
adminCtrl.showLogin = (req, res) => {
    res.render("login")
}
adminCtrl.login = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome!",
});


//logout 
adminCtrl.logout = (req, res) => {
    req.logout();
    res.redirect('/login')
}


module.exports = adminCtrl;