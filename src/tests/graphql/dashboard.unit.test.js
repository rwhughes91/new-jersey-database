import mongoose from 'mongoose';
import Query from '../../resolvers/Query';
import dotenv from 'dotenv';

dotenv.config();

describe('graphql queries', () => {
  beforeAll(() => {
    return mongoose.connect(process.env.TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 30000);
  describe('getDashboardData', () => {
    it('dash', async () => {
      const dashBoardData = await Query.getDashboardData(null, {});
      expect(dashBoardData.county).toEqual(null);
      expect(dashBoardData.summaryData.count).toEqual(10);
      expect(dashBoardData.typeAggregationData.aggByYear[0].year).toEqual(2013);
      expect(
        dashBoardData.monthlyRedemptionData.redemptionsAndCashFlow[0].date
      ).toEqual('2013');
    });
  });
  afterAll(async () => {
    return mongoose.disconnect();
  });
});
