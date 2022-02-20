const indexCtrl = {};

const User = require("../models/User");
const Game = require("../models/Game");

// Painel admin
indexCtrl.showIndex = async (req, res) => {
    const quantUser = await User.countDocuments();
    const quantGame = await Game.countDocuments()

    res.render("", { quantUser, quantGame})
}


module.exports = indexCtrl;