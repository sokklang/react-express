function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); // Include allowed methods

  // Check if it's an OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end(); // Respond with a 200 status for preflight requests
  } else {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  }
}

module.exports = corsMiddleware;
