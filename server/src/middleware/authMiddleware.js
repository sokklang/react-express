function checkLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ loggedIn: false });
  }
}

module.exports = {
  checkLoggedIn,
};
