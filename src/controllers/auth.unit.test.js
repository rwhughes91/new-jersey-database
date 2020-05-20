import sinon from 'sinon';
import mongoose from 'mongoose';
import User from '../models/user';
import * as authController from '../controllers/auth';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Response from '../tests/setup';

dotenv.config();

const fakeData = {
  email: 'testEmail@test.com',
  password: 'fakePassword',
};

describe('Auth Controller', () => {
  let req;
  beforeAll((done) => {
    req = {
      body: fakeData,
    };
    mongoose
      .connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        const user = new User(fakeData);
        return user.save();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  afterAll((done) => {
    User.deleteMany({}).then(() => {
      return mongoose.disconnect().then(() => {
        done();
      });
    });
  });
  describe('Login', () => {
    it('should throw an error with a 500 status code if accessing the db fails', (done) => {
      sinon.stub(User, 'findOne');
      User.findOne.throws();
      authController
        .login(req, {}, () => {})
        .then((result) => {
          expect(result instanceof Error).toEqual(true);
          expect(result.statusCode).toEqual(500);
          done();
        });
      User.findOne.restore();
    });
    it('should throw an error with a 401 status code if email could not be found', (done) => {
      const req = {
        body: {
          email: 'someOtheremail@email.com',
          password: 'fakePassword',
        },
      };
      authController
        .login(req, {}, () => {})
        .then((result) => {
          expect(result instanceof Error).toEqual(true);
          expect(result.message).toEqual('Email could not be found');
          expect(result.statusCode).toEqual(401);
          done();
        });
    });
    it('should throw an error with a 401 status code if passwords do not match', (done) => {
      authController
        .login(req, {}, () => {})
        .then((result) => {
          expect(result instanceof Error).toEqual(true);
          expect(result.message).toEqual('Incorrect credentials');
          expect(result.statusCode).toEqual(401);
          done();
        });
    });
    it('return a jwt token with email and id properties and a status code of 200', (done) => {
      sinon.stub(bcrypt, 'compare').returns(true);
      const res = new Response();
      authController
        .login(req, res, () => {})
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(result.message).toMatchObject({
            expiresIn: expect.any(Number),
            userId: expect.any(String),
            token: expect.any(String),
          });
          bcrypt.compare.restore();
          done();
        });
    });
  });
});
