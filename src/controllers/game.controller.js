const gameCtrl = {};

const cloudinary = require("cloudinary").v2

const {paginate} = require("../libs/paginate");
const Game = require("../models/Game");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Comment = require("../models/Comment");

const { validateURL } = require("../libs/validate")

const { removeImg } = require("../libs/removeFiles");

// Games json
gameCtrl.getGames = async (req, res) => {
    if(req.query.gameURL || req.query.gameURL === ''){
      const gameURLs = await Game.find({gameURL: {$ne: req.query.gameURL}}, {_id:0, gameURL:1});
  
      return res.json(gameURLs);
    }
  
    const games = await paginate(req.query.page, req.query.limit, req.query.query);
    
    res.json(games);
  }



// Adiciona, alterar e delete game
// Novo game
gameCtrl.newGame = async (req, res) => {
    const quantUser = await User.countDocuments();
    const quantGame = await Game.countDocuments();

    res.render("game", { quantUser, quantGame })
}

// MOSTRAR UM GAME JÁ CRIADO PARA EDITA //
gameCtrl.showGame = async (req, res) => {
    const show = await Game.findById(req.params.id);
    let release_date = show.release_date;
    show.release_date = `${release_date.slice(6, 10)}-${release_date.slice(3, 5)}-${release_date.slice(0, 2)}`

    const quantUser = await User.countDocuments();
    const quantGame = await Game.countDocuments();
    show.quantGame = quantGame;
    show.quantUser = quantUser

    res.render("game", show)
}
/////////////////////////////////////////

// CRIAR GAME //
gameCtrl.createGame = async (req, res) => {
    let { tittle, description, type, language,
        censorship, release_date, size, platform, tags, link_download, gameURL } = req.body;

    // URL é válida? //
    const URLVerify = await validateURL(gameURL);
    if (URLVerify) {
        req.flash("error_msg", URLVerify);
        return res.redirect("/new-game")
    }

    // Formatar data//
    release_date = `${release_date.slice(8, 10)}/${release_date.slice(5, 7)}/${release_date.slice(0, 4)}`

    let imgTags = [tittle, type];

    // Manipular IMGs //
    const toDestroy = []

    try {


        let coversFiles = req.files.cover,
            cover = undefined;
        if (coversFiles) {
            const resultCover = await cloudinary.uploader.upload(coversFiles[0].path, { folder: "games/covers", tags: imgTags });
            cover = { imgURL: resultCover.secure_url, public_id: resultCover.public_id };
            toDestroy.push(cover.public_id);
            await removeImg(coversFiles[0].path);
        }


        const screenshortsFiles = req.files.screenshort;
        const screenshorts = [{ imgURL: undefined, public_id: undefined }, { imgURL: undefined, public_id: undefined }, { imgURL: undefined, public_id: undefined }, { imgURL: undefined, public_id: undefined }]

        if (screenshortsFiles) {
            for (let i = 0; i < screenshortsFiles.length; i++) {
                let screenshortPath = screenshortsFiles[i].path;
                const resultScreenshort = await cloudinary.uploader.upload(screenshortPath, { folder: "games/screenshorts", tags: imgTags })
                screenshorts[i] = { imgURL: resultScreenshort.secure_url, public_id: resultScreenshort.public_id };
                toDestroy.push(screenshorts[i].public_id);

                await removeImg(screenshortPath)
            }
        }

        if (!URLVerify) {
            const game = new Game({
                tittle, description, type, size,
                platform, release_date, tags, language, censorship, link_download, gameURL,
                imgs: { cover, screenshorts }
            });

            const newGame = await game.save()
                .catch(err => console.error(err));

            if (newGame) {
                req.flash("success_msg", "Game adicionado com sucesso.");
                return res.redirect("/");
            } else {
                for (public_id of toDestroy) {
                    await cloudinary.uploader.destroy(public_id)
                }
                req.flash("error_msg", "O game não foi adicionado")
                return res.redirect("/new-game")
            }
        }

    } catch (error) {
        console.error(error);
    }

    for (public_id of toDestroy) {
        await cloudinary.uploader.destroy(public_id)
    }
    req.flash("error_msg", "O game não foi adicionado")
    return res.redirect("/admin/new-game")

}
///////////////////////


// EDTAR GAME //
gameCtrl.editGame = async (req, res) => {
    const { _id, gameURL } = req.body;
    let game = await Game.findById(_id);

    const URLVerify = await validateURL(gameURL);

    if (game) {

        const imgModified = (Array.isArray(req.body.imgModified)) ? new Array(req.body.imgModified) : req.body.imgModified;
        const newCoverPath = (req.files.cover) ? req.files.cover[0].path : undefined;
        const newScreenshorts = req.files.screenshort;
        const imgs = game.imgs;

        if (imgs && ((imgModified && newScreenshorts.length > 0) || newCoverPath)) {
            if (newCoverPath) {
                let result = await cloudinary.uploader.upload(newCoverPath, { public_id: imgs.cover.public_id });
                imgs.cover.imgURL = result.url
                await removeImg(newCoverPath);
            }

            if (imgModified) {
                let screenshorts = imgs.screenshorts;
                let indexMOD = null;
                for (let i = 0; i < newScreenshorts.length; i++) {
                    indexMOD = imgModified[i];
                    let result = (screenshorts[indexMOD].public_id) ? await cloudinary.uploader.upload(newScreenshorts[i].path, { public_id: screenshorts[indexMOD].public_id })
                        :
                        await cloudinary.uploader.upload(newScreenshorts[i].path);

                    imgs.screenshorts[indexMOD].imgURL = result.url;

                    await removeImg(newScreenshorts[i].path);
                }
            }

        }

        let { tittle, description, type, language,
            censorship, release_date, size, platform, tags,
            link_download } = req.body;
        release_date = `${release_date.slice(8, 10)}/${release_date.slice(5, 7)}/${release_date.slice(0, 4)}`


        let oldGame = await Game.findByIdAndUpdate(_id, {
            tittle, description, type, language,
            censorship, release_date, size, platform, tags,
            link_download, imgs, gameURL
        }).catch(err => console.error(err));


        if (oldGame) {
            req.flash("success_msg", "Game editado com sucesso;")
            return res.redirect("/")

        } else {
            await removeImgs(newCover, newScreenshorts);
            req.flash("error", "Não foi póssivel edita o game.");
            return res.redirect("/")
        }

    } else {
        req.flash("error_msg", URLVerify);
        res.redirect("/")
    }


}
//////////////////////

// APAGAR GAME //
gameCtrl.deleteGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ gameURL: game.gameURL });
        const screenshorts = game.imgs.screenshorts;

        if (game.imgs.cover.public_id) await cloudinary.uploader.destroy(game.imgs.cover.public_id);

        for (screenshort of screenshorts) {

            if (screenshort.public_id) await cloudinary.uploader.destroy(screenshort.public_id);

        }

        res.status(200).json({ deleted: true, message: "Game deletado com sucesso" })

    } catch (error) {
        console.error(error)
        res.status(200).json({ deleted: false, message: "Nenhum game foi apagado" })
    }

}

///////////////////////


module.exports = gameCtrl;