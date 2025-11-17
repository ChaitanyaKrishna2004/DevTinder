const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked !!");
  const token = "XYZ";
  const isAdminAuthorized = token === "XYZ";
  if (!isAdminAuthorized) {
    res.status(404).send("Admin is not authorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting checked !!");
  const token = "ABC";
  const isUserauth = token === "ABC";
  if (!isUserauth) {
    res.status(404).send("User is not authorized");
  } else {
    next();
  }
};


module.exports = {
  adminAuth,
  userAuth,
};
