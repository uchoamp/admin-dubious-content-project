const mongoose = require("mongoose");

const { DATABASE_HOST, DATABASE_USER, DATABASE, DATABASE_PORT, DATABASE_PASSWORD} = process.env;

const mongodb_URI =
  (!DATABASE_PORT) ? `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE}?retryWrites=true&w=majority` :
   (DATABASE_USER && DATABASE_PASSWORD) ?
  `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE}` :
  `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE}`;

mongoose.connect(mongodb_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).
then(db => {console.log(DATABASE, 'is conected.')}).
catch(err => {console.log(err)});



module.exports = mongoose;
