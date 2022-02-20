const {Router} = require("express");

const {showIndex} = require("../controllers/index.controller");
const {isAdmin} = require("../helpers/auth");

const router = Router();

router.get("/", isAdmin, showIndex);


module.exports = router;

