const uuid = require("uuid").v4;
const multer = require("multer");
const path = require("path");

const middlewares = {};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../public/img/uploads"))

    },
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    },

});

middlewares.multer = multer({
    storage, fileFilter: (req, file, cb) => {
        const filestypes = /png|jpeg|jpg/;
        const extname = filestypes.test(path.extname(file.originalname));
        const mimetype = filestypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true)
        }
        cb(`A imagem ${file.originalname} não é válida.`)

    }, limits: { fileSize: 1000000 }
}).fields([{ name: "cover", maxCount: 1 }, { name: "screenshort", maxCount: 4 }]);

middlewares.upload = function (req, res, next) {

    middlewares.multer(req, res, function (err) {

        if (err) {
            console.log(err)
            req.flash("error_msg", "Imagen ou imagens inválidas")
            return res.redirect("/admin/new-game");
        }

        return next();
    })
}



module.exports = middlewares;