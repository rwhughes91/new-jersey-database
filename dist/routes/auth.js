"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _user = _interopRequireDefault(require("../models/user"));

var authController = _interopRequireWildcard(require("../controllers/auth"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.put('/signup', [(0, _expressValidator.body)('email').isEmail().withMessage('Needs to be a valid email').custom(async (value, {
  req
}) => {
  return _user.default.findOne({
    email: value
  }).then(user => {
    if (user) {
      return Promise.reject('Email already exists');
    }
  });
}).normalizeEmail(), (0, _expressValidator.body)('password').trim().isLength({
  min: 5
})], authController.signUp);
router.post('/login', authController.login);
router.post('/reset', authController.passwordReset);
router.post('/reset/validate_token', authController.validateToken);
router.post('/reset_password', (0, _expressValidator.body)('password').trim().isLength({
  min: 5
}), authController.resetPassword);
var _default = router;
exports.default = _default;