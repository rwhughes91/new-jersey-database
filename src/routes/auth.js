import express from 'express';
import { body } from 'express-validator';
import User from '../models/user';
import * as authController from '../controllers/auth';

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Needs to be a valid email')
      .custom(async (value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email already exists');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
  ],
  authController.signUp
);

router.post('/login', authController.login);

router.post('/reset', authController.passwordReset);
router.post('/reset/validate_token', authController.validateToken);
router.post(
  '/reset_password',
  body('password').trim().isLength({ min: 5 }),
  authController.resetPassword
);

export default router;
