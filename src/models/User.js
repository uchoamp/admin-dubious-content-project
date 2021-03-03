const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  username: { type: String, required: true, unique:true, min: 4},
  email: { type: String, required:true, unique:true},
  password: { type: String, required: true, min: 6 },
  birthday: {type: Date, required: true},
  block: {type: Boolean, default: false}
},{
  timestamps: true
}
);


module.exports = model("User", userSchema);
