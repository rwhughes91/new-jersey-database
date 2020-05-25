"use strict";

var _sinon = _interopRequireDefault(require("sinon"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("../models/user"));

var authController = _interopRequireWildcard(require("../controllers/auth"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _setup = _interopRequireDefault(require("../tests/setup"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const fakeData = {
  email: 'testEmail@test.com',
  password: 'fakePassword'
};
describe('Auth Controller', () => {
  let req;
  beforeAll(done => {
    req = {
      body: fakeData
    };

    _mongoose.default.connect(process.env.TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(res => {
      const user = new _user.default(fakeData);
      return user.save();
    }).then(() => {
      done();
    }).catch(err => {
      throw err;
    });
  });
  afterAll(done => {
    _user.default.deleteMany({}).then(() => {
      return _mongoose.default.disconnect().then(() => {
        done();
      });
    });
  });
  describe('Login', () => {
    it('should throw an error with a 500 status code if accessing the db fails', done => {
      _sinon.default.stub(_user.default, 'findOne');

      _user.default.findOne.throws();

      authController.login(req, {}, () => {}).then(result => {
        expect(result instanceof Error).toEqual(true);
        expect(result.statusCode).toEqual(500);
        done();
      });

      _user.default.findOne.restore();
    });
    it('should throw an error with a 401 status code if email could not be found', done => {
      const req = {
        body: {
          email: 'someOtheremail@email.com',
          password: 'fakePassword'
        }
      };
      authController.login(req, {}, () => {}).then(result => {
        expect(result instanceof Error).toEqual(true);
        expect(result.message).toEqual('Email could not be found');
        expect(result.statusCode).toEqual(401);
        done();
      });
    });
    it('should throw an error with a 401 status code if passwords do not match', done => {
      authController.login(req, {}, () => {}).then(result => {
        expect(result instanceof Error).toEqual(true);
        expect(result.message).toEqual('Incorrect credentials');
        expect(result.statusCode).toEqual(401);
        done();
      });
    });
    it('return a jwt token with email and id properties and a status code of 200', done => {
      _sinon.default.stub(_bcryptjs.default, 'compare').returns(true);

      const res = new _setup.default();
      authController.login(req, res, () => {}).then(result => {
        expect(result.statusCode).toEqual(200);
        expect(result.message).toMatchObject({
          expiresIn: expect.any(Number),
          userId: expect.any(String),
          token: expect.any(String)
        });

        _bcryptjs.default.compare.restore();

        done();
      });
    });
  });
});