const checkLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

const isAdmin = (req, res, next) => {
  // Check if the user is logged in and has the 'admin' role
  if (req.session.user && req.session.user.RoleType === "Admin User") {
    return next(); // Allow access to the next middleware or route handler
  } else {
    return res.status(403).json({ error: "Access forbidden" });
  }
};

module.exports = {
  checkLoggedIn,
  isAdmin,
};
