const asyncHandler = require("express-async-handler");
const Auth = require("../models/authModel");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// const constantFile = require('../constants')

const createData = asyncHandler(async (req, res) => {
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
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Auth.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await Auth.create({
      email,
      password: hashedPassword,
    });

    // Create JWT token
    const token = JWT.sign({ email }, "kbhbkjh897ghbguig9898b", {
      expiresIn: 3600,
    }); // Replace 'your-secret-key' with your actual secret key

    res.json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

// const getOne = asyncHandler(async (req, res) => {
//     const findData = await Auth.findById(req.params.id)
//     if (!findData) {
//         res.status(404)
//         throw new Error('Auth not found')
//     }
//     res.status(200).json(findData)
// })

// const updateData = asyncHandler(async (req, res) => {
//     const findData = await Auth.findById(req.params.id)
//     if (!findData) {
//         res.status(404)
//         throw new Error('Auth not found')
//     }

//     if (Object.keys(req.body).length === 0) {
//         res.status(400)
//         throw new Error('Request body is empty')
//     }

//     const updatedAuth = Object.assign(findData, req.body)

//     await updatedAuth.save()

//     res.status(200).json({ message: 'Successfully Updated' })
// })

// const deleteData = asyncHandler(async (req, res) => {
//     const findData = await Auth.findById(req.params.id)
//     if (!findData) {
//         res.status(404)
//         throw new Error('Auth not found')
//     }
//     await Auth.findByIdAndDelete(req.params.id)
//     res.status(200).json({ message: 'Successfully Deleted' })
// })

module.exports = {
  createData,
  getAll,
  // getOne,
  // updateData,
  // deleteData,
};
