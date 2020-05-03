import Lien from '../models/lien';
import { Promise } from 'bluebird';

const Query = {
  getLien: async (parent, { lien_id }, context, info) => {
    const lien = await Lien.findOne({ lien_id });
    return lien;
  },
  getLiens: async (
    parent,
    {
      block,
      lot,
      qualifier,
      certificate_number,
      sale_year,
      county,
      address,
      status,
      skip,
      limit,
      sort,
    },
    context,
    info
  ) => {
    const query = {};
    // Location
    if (block) query.block = { $regex: `^${block}`, $options: 'i' };
    if (lot) query.lot = { $regex: `^${lot}`, $options: 'i' };
    if (qualifier) query.qualifier = { $regex: `^${qualifier}`, $options: 'i' };
    if (address) query.address = { $regex: `.*${address}.*`, $options: 'i' };
    if (county) query.county = { $regex: `.*${county}.*`, $options: 'i' };
    if (status) {
      switch (status) {
        case 'BANKRUPTCYREDEEMED':
          status = 'BANKRUPTCY/REDEEMED';
          break;
        case 'FORECLOSUREREDEEMED':
          status = 'FORECLOSURE/REDEEMED';
          break;
        case 'NOSUBS':
          status = 'NO-SUBS';
          break;
        case 'OPEN':
          status = null;
          break;
      }
      query.status = status;
    }

    // Sale Information
    if (certificate_number) {
      query.certificate_number = {
        $regex: `.*${certificate_number}.*`,
        $options: 'i',
      };
    }
    if (sale_year) {
      query.sale_date = {
        $gte: new Date(sale_year, 1, 1),
        $lte: new Date(sale_year, 12, 31),
      };
    }
    const schema = Lien.find(query);
    const queryTemplate = schema.toConstructor();
    return Promise.join(
      schema.countDocuments().exec(),
      queryTemplate().sort(sort).skip(skip).limit(limit),
      (count, liens) => {
        return { count, liens };
      }
    );
  },
  getSubBatch: async (parent, { county }, context, info) => {
    const batchDates = await Lien.find({ county }).distinct('subs.sub_date');
    return batchDates;
  },
  getLiensFromSubDate: async (parent, { date, county }, context, info) => {
    const filterDate = new Date(parseInt(date));
    const response = await Lien.aggregate([
      { $match: { county, 'subs.sub_date': filterDate } },
      {
        $project: {
          _id: 0,
          lien_id: 1,
          block: 1,
          lot: 1,
          qualifier: 1,
          certificate_number: 1,
          sale_date: 1,
          county: 1,
          address: 1,
          subs: {
            $filter: {
              input: '$subs',
              as: 'subs',
              cond: { $eq: ['$$subs.sub_date', filterDate] },
            },
          },
        },
      },
    ]);
    return response;
  },
  getOpenLiens: async (parent, { county }, context, info) => {
    const liens = await Lien.find({
      county,
      status: { $in: [null, 'foreclosure', 'bankruptcy'] },
    });
    return liens;
  },
};

export default Query;
