const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
    secret: String
})

adminSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = model("admin", adminSchema);

module.exports = Admin;
