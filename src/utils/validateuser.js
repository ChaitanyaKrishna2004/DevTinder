const validator = require("validator");

const validateSignUpdata = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("The firstName Should be in the range 4-50");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter the correct email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter the strong password");
  }
};

module.exports = {
  validateSignUpdata,
};
