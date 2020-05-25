"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = exports.resetPassword = exports.validateToken = exports.passwordReset = exports.login = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _expressValidator = require("express-validator");

var _user = _interopRequireDefault(require("../models/user"));

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await _user.default.findOne({
      email
    });

    if (!user) {
      const error = new Error('Email could not be found');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await _bcryptjs.default.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Incorrect credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = _jsonwebtoken.default.sign({
      email: user.email,
      userId: user._id.toString()
    }, process.env.SECRET_KEY, {
      expiresIn: '1h'
    });

    return res.status(200).json({
      token,
      userId: user._id.toString(),
      expiresIn: 3600
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
    return err;
  }
};

exports.login = login;

const passwordReset = async (req, res, next) => {
  _mail.default.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const email = req.body.email;
    const user = await _user.default.findOne({
      email
    });

    if (!user) {
      const error = new Error('No account with that email found');
      error.statusCode = 400;
      throw error;
    }

    let token;

    try {
      token = _jsonwebtoken.default.sign({
        userId: user._id.toString()
      }, process.env.SECRET_KEY, {
        expiresIn: '1h'
      });
    } catch (err) {
      const error = new Error('Could not create token');
      error.statusCode = 500;
      throw error;
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600 * 1000;
    await user.save();

    try {
      await _mail.default.send({
        to: email,
        from: 'info@njtldatabase.com',
        subject: 'Password Reset',
        html: `
            <p>Click the link below to reset your password</p>
            <a href="http://localhost:3000/auth/password_reset/${token}">Reset</a>
            `
      });
    } catch (err) {
      const error = new Error('Could not send the email');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({
      message: 'Token has been sent to the provided email'
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.passwordReset = passwordReset;

const validateToken = async (req, res, next) => {
  try {
    const token = req.body.token;

    if (!token) {
      const error = new Error('Token must be provided');
      error.statusCode = 400;
      throw error;
    }

    let decodedToken;

    try {
      decodedToken = _jsonwebtoken.default.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error('Not Authenticated');
      error.statusCode = 401;
      throw error;
    }

    const user = await _user.default.findOne({
      _id: decodedToken.userId.toString(),
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    });

    if (!user) {
      const error = new Error('This token is no longer valid');
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json('Valid Token');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.validateToken = validateToken;

const resetPassword = async (req, res, next) => {
  try {
    const errors = (0, _expressValidator.validationResult)(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      const error = new Error('Passwords must match');
      error.statusCode = 400;
      throw error;
    }

    if (!token) {
      const error = new Error('Token must be provided');
      error.statusCode = 400;
      throw error;
    }

    let decodedToken;

    try {
      decodedToken = _jsonwebtoken.default.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error('Not Authenticated');
      error.statusCode = 401;
      throw error;
    }

    const user = await _user.default.findOne({
      _id: decodedToken.userId.toString(),
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    });

    if (!user) {
      const error = new Error('This token is no longer valid');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await _bcryptjs.default.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.status(200).json({
      message: 'Password Updated'
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.resetPassword = resetPassword;

const signUp = async (req, res, next) => {
  try {
    const errors = (0, _expressValidator.validationResult)(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await _bcryptjs.default.hash(password, 12);
    const newUser = new _user.default({
      email,
      password: hashedPassword
    });
    const result = await newUser.save();

    const token = _jsonwebtoken.default.sign({
      email: result.email,
      userId: result._id.toString()
    }, process.env.SECRET_KEY, {
      expiresIn: '1h'
    });

    res.status(201).json({
      message: 'User created',
      token,
      userId: result._id.toString(),
      expiresIn: 3600
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.signUp = signUp;