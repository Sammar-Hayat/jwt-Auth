const asyncHandler = require("express-async-handler");
const Auth = require("../models/authModel");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
// const constantFile = require('../constants')

const signUp = asyncHandler(async (req, res) => {
  // Validation middleware for email and password
  const emailValidation = check(
    "email",
    "Please provide a valid email"
  ).isEmail();
  const passwordValidation = check(
    "password",
    "Please provide a password with a min length of 6"
  ).isLength({ min: 6 });

  // Run the validation middlewares
  await Promise.all([
    emailValidation(req, res, () => {}),
    passwordValidation(req, res, () => {}),
  ]);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure email and password after validation
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Auth.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // Create a new user in the database
    const newUser = await Auth.create({
      email,
      password: hashedPassword,
      role,
    });
    // Create JWT token
    const key = process.env.SECRET_KEY;
    const token = JWT.sign({ email }, key, {
      expiresIn: 3600,
    });

    res.json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// const signIn = asyncHandler(async (req, res) => {
//   const { password, email } = req.body;

//   const user = await Auth.findOne({ email: email }).exec();

//   if (!user) {
//     return res.status(400).json({ message: "Invalid Credentials" });
//   }

//  let isMatch=await bcrypt.compare(password,user.password);
//  if (!isMatch) {
//     return res.status(400).json({ message: "Invalid Credentials" });
//   }
// // Create JWT token
// const key = process.env.SECRET_KEY;
// const token = JWT.sign({ email }, key, {
//   expiresIn: 600000,
// });

// res.json({
//   token,
// });

// });

const signIn = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  // Fetch user details including the role from the database
  const user = await Auth.findOne({ email }).exec();

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  // Log the fetched role to debug
  console.log("Fetched Role:", user.role);

  // Fetch the role from the database
  const role = user.role;

  // Create JWT token with user's email and role
  const key = process.env.SECRET_KEY;
  const token = JWT.sign({ email: user.email, role }, key, {
    expiresIn: 3600,
  });

  res.json({
    token,
  });
});

const getAll = asyncHandler(async (req, res) => {
  const perPage = req.query.perpage || process.env.PERPAGE;
  // constantFile.constants.PERPAGE
  const pageNo = req.query.pageno || 1;
  const count = await Auth.countDocuments();
  const totalPage = Math.ceil(count / perPage);
  const findedData = await Auth.find();

  res.status(200).json({ data: findedData, count, totalPage });
});

const getOne = asyncHandler(async (req, res) => {
    const findData = await Auth.findById(req.params.id)
    if (!findData) {
        res.status(404)
        throw new Error('Auth not found')
    }
    res.status(200).json(findData)
})

const updateData = asyncHandler(async (req, res) => {
    const findData = await Auth.findById(req.params.id)
    if (!findData) {
        res.status(404)
        throw new Error('Auth not found')
    }

    if (Object.keys(req.body).length === 0) {
        res.status(400)
        throw new Error('Request body is empty')
    }

    const updatedAuth = Object.assign(findData, req.body)

    await updatedAuth.save()

    res.status(200).json({ message: 'Successfully Updated' })
})

const deleteData = asyncHandler(async (req, res) => {
    const findData = await Auth.findById(req.params.id)
    if (!findData) {
        res.status(404)
        throw new Error('Auth not found')
    }
    await Auth.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Successfully Deleted' })
})

module.exports = {
  signUp,
  signIn,
  getAll,
  getOne,
  updateData,
  deleteData,
};
