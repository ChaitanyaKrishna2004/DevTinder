const validator = require("validator");
const { default: isURL } = require("validator/lib/isURL");

const validateSignUpdata = (req) => {
  const { firstName, emailId, password } = req.body;
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

const validteProfileEdit = (req, res) => {
  const { age, gender, about, skills } = req.body;

  if (age && age < 18) {
    throw new Error("Age should be 18+");
  }
  if (gender && !["male", "female", "other"].includes(gender)) {
    throw new Error("Invalid gender");
  }
  // if (validator.isURL(photoUrl)) {
  //   throw new Error("Invalid photo");
  // }
  if (about && (about.length < 5 || about.length > 500)) {
    throw new Error("About length should be 10 to 50");
  }
  if (skills && (skills.length < 5 || skills.length > 50)) {
    throw new Error("Skills length should be 10 to 50");
  }
};

module.exports = {
  validateSignUpdata,
  validteProfileEdit,
};
