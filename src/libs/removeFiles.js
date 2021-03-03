const fse = require("fs-extra");
const path = require("path");

const removeFiles = {};


removeFiles.removeImg = async (imgPath) => {

    await fse.remove(imgPath)

}




module.exports = removeFiles;