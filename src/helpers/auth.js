const helpers = {};
const Admin = require("../models/Admin");

helpers.isAdmin = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const admin = await Admin.findOne({$and:[{_id:req.user.id}, {secret:req.user.secret}, {password:req.user.password}]});
        if (admin) {
            return next();
        }
    }
    res.status(401).redirect("/login")
}

module.exports = helpers;