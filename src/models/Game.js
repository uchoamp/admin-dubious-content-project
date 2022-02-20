const { Schema, model } = require("mongoose");
const mogoosePaginate = require("mongoose-paginate-v2");

const gameSchema = new Schema(
  {
    tittle: String,
    description: String,
    type: String,
    language: String,
    tags: String,
    imgs: {cover:{imgURL: String, public_id: String}, screenshorts:[{imgURL: String, public_id: String}]},
    censorship: String,
    platform: String,
    release_date: String, 
    link_download: String, 
    size: String, 
    gameURL: {type: String, required:true, unique: true}
  },
  {
    timestamps: true,
  }
);

gameSchema.plugin(mogoosePaginate)

const game = model("Game", gameSchema);
module.exports = game;


// db.games.createIndexes([ {tittle:1},{description: 1}, {type:1}, {language:1}, {tags:1}, {censorship:1}, {platform:1}])
// db.games.createIndex({tittle:"text", description:"text", type:"text", tags:"text", language:"text", censorship:"text", pletform:"text"}, {language_override: "pt"})