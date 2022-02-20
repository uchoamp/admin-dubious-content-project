const {Router} = require("express");

const router = Router();


const {getGames, newGame, showGame, createGame, editGame, deleteGame} = require("../controllers/game.controller");
const {upload} = require("../middlewares/middlewares");
const {isAdmin} = require("../helpers/auth");

// Games para a tabela
router.get("/getGamesJSON", getGames);


// Adiciona, alterar e delete game
router.get("/new-game", isAdmin, newGame);
router.get("/game/:id", isAdmin, showGame);
router.post("/game", isAdmin, upload, createGame);
router.post("/game/:id/edit", isAdmin, upload, editGame);
router.delete("/game/:id", isAdmin, deleteGame);


module.exports = router;