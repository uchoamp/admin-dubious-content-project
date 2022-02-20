const mongoose = require("mongoose");

const {DATABASE_HOST, DATABASE, DATABASE_USER, DATABASE_PASSWORD} = process.env;

const mongodb_URI = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE}?retryWrites=true&w=majority`;


mongoose.connect(mongodb_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
.then((db)=>{
    console.log(DATABASE, "is connected.");
}).catch((err)=>{
    console.error(err);
});

