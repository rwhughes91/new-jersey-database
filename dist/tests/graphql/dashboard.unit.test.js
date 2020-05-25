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
  describe('getDashboardData', () => {
    it('dash', async () => {
      const dashBoardData = await _Query.default.getDashboardData(null, {});
      expect(dashBoardData.county).toEqual(null);
      expect(dashBoardData.summaryData.count).toEqual(10);
      expect(dashBoardData.typeAggregationData.aggByYear[0].year).toEqual(2013);
      expect(dashBoardData.monthlyRedemptionData.redemptionsAndCashFlow[0].date).toEqual('2013');
    });
  });
  afterAll(async () => {
    await _lien.default.deleteMany({});
    return _mongoose.default.disconnect();
  });
});