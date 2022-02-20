const express = require("express");
const path = require("path");
const expSession = require("express-session");
const exphbs =  require("express-handlebars");
const flash = require("connect-flash");
const passport = require("passport");


require('./config/passport')


const app = express();


// SETTINGS
app.set("PORT", process.env.PORT||3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
    "hbs",
    exphbs({
      layoutsDir: path.join(app.get("views"), "layouts"),
      partialsDir: path.join(app.get("views"), "partials"),
      extname: "hbs",
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: false,
      },
    })
  );
app.set("view engine", "hbs");



//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(expSession({
    secret: 'hetai',
    resave: true,
    saveUninitialized: true
  }))
  

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// VARIABLES GLOBALS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.user = req.user || null;
    next();
})

// ROUTES
app.use(require("./routes/index.routes"))
app.use(require("./routes/admin.routes"))
app.use(require("./routes/game.routes"))



// STATICS FILES
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
