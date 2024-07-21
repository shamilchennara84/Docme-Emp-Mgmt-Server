const passport = require("passport");
require("../config/passport");

const protect = passport.authenticate("jwt", { session: false });

module.exports = { protect };
