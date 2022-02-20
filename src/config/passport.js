const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

const Admin = require("../models/Admin");


passport.use(new LocalStrategy(async (username, password, done) => {
        const admin = await Admin.findOne({ $or: [{ username }, { email: username }] });

        if (admin) {
            const match = await admin.matchPassword(password);
            if (match) {
                return done(null, admin);
            }
        }
        return done(null, false, { message: "Incorrect username, email or password." });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
        if (user) {
            done(null, user);
        }
        else {
            done(new Error('user not found', null));
        }
    });

});