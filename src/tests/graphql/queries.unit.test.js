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
  describe('getLiens', () => {
    it('should return a count of 10 when querying all the liens', async () => {
      const liens = await Query.getLiens(null, {});
      expect(liens.count).toEqual(10);
    });
    it('should return plainfield data when plainfield is query', async () => {
      const liens = await Query.getLiens(null, { county: 'Plainfield' });
      expect(liens.count).toEqual(2);
    });
  });
  describe('getLien', () => {
    it('should return the lien that is queried', async () => {
      const lien = await Query.getLien(null, { lien_id: 42927 });
      expect(lien.lien_id).toEqual(42927);
    });
  });
  describe('get Open Liens', () => {
    it('should return all open liens by county', async () => {
      const liens = await Query.getOpenLiens(null, { county: 'Plainfield' });
      expect(liens).toEqual([]);
    });
  });
  describe('get Townships', () => {
    it('should return all open liens by county', async () => {
      const townships = await Query.getTownships(null, {});
      expect(townships.length).toEqual(7);
    });
  });
  describe('get Vintages', () => {
    it('should return all vintages in db', async () => {
      const vintages = await Query.getVintages(null, {});
      expect(vintages).toEqual([2013, 2014, 2015]);
    });
  });
  describe('get LLC', () => {
    it('should return all LLCs in db', async () => {
      const llcs = await Query.getLLCs(null, {});
      expect(llcs).toEqual(['Mally', 'TTLBL']);
    });
  });
  afterAll(async () => {
    await Lien.deleteMany({});
    return mongoose.disconnect();
  });
});
