const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const dotenv = require("dotenv");

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const model = jwt_payload.role === "admin" ? Admin : Employee;
        const user = await model.findById(jwt_payload.id);

        if (user) {
          return done(null, { ...user.toObject(), role: jwt_payload.role });
        } else {
          return done(null, false);
        }
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    })
  );
};
