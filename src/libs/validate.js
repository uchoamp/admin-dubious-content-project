validate = {};

const User = require("../models/User")
const Game = require("../models/Game")

validate.validateURL = async (gameURL)=>{
    const re = /^[a-z0-9]{1}[\w-]*$/i
    if(re.test(gameURL)){
       const game = await Game.findOne({ gameURL });
       if(game){
            return "URL já existe"
       }
       return false
    }
    return "URL inválida"
}

module.exports = validate;