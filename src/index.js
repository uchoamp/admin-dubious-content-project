if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

require("./database");

const app = require('./app');

app.listen(app.get("PORT"),()=>{
    console.log("Working in port "+app.get("PORT"))
} );