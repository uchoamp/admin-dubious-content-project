const {Router} = require("express");

const {showLogin, login, logout} = require("../controllers/admin.controller")
const {isAdmin} = require("../helpers/auth");


const router = Router();



// Login
router.get("/login", showLogin);
router.post("/login", login);

//logout
router.get('/logout', isAdmin,logout);


module.exports = router;