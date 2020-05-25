import mongoose from 'mongoose';
import Lien from '../../models/lien';
import Query from '../../resolvers/Query';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

describe('graphql queries', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let testData = await fs.readFile(path.join(__dirname, 'testData.json'));
    testData = JSON.parse(testData);
    return Lien.create(testData);
  });
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
    await Lien.deleteMany({});
    return mongoose.disconnect();
  });
});
