"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _lien = _interopRequireDefault(require("../../models/lien"));

var _Query = _interopRequireDefault(require("../../resolvers/Query"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

describe('graphql queries', () => {
  beforeAll(async () => {
    await _mongoose.default.connect(process.env.TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    let testData = await _fs.promises.readFile(_path.default.join(__dirname, 'testData.json'));
    testData = JSON.parse(testData);
    return _lien.default.create(testData);
  });
  describe('getLiens', () => {
    it('should return a count of 10 when querying all the liens', async () => {
      const liens = await _Query.default.getLiens(null, {});
      expect(liens.count).toEqual(10);
    });
    it('should return plainfield data when plainfield is query', async () => {
      const liens = await _Query.default.getLiens(null, {
        county: 'Plainfield'
      });
      expect(liens.count).toEqual(2);
    });
  });
  describe('getLien', () => {
    it('should return the lien that is queried', async () => {
      const lien = await _Query.default.getLien(null, {
        lien_id: 42927
      });
      expect(lien.lien_id).toEqual(42927);
    });
  });
  describe('get Open Liens', () => {
    it('should return all open liens by county', async () => {
      const liens = await _Query.default.getOpenLiens(null, {
        county: 'Plainfield'
      });
      expect(liens).toEqual([]);
    });
  });
  describe('get Townships', () => {
    it('should return all open liens by county', async () => {
      const townships = await _Query.default.getTownships(null, {});
      expect(townships.length).toEqual(7);
    });
  });
  describe('get Vintages', () => {
    it('should return all vintages in db', async () => {
      const vintages = await _Query.default.getVintages(null, {});
      expect(vintages).toEqual([2013, 2014, 2015]);
    });
  });
  describe('get LLC', () => {
    it('should return all LLCs in db', async () => {
      const llcs = await _Query.default.getLLCs(null, {});
      expect(llcs).toEqual(['Mally', 'TTLBL']);
    });
  });
  afterAll(async () => {
    await _lien.default.deleteMany({});
    return _mongoose.default.disconnect();
  });
});