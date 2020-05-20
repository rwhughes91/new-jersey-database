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
      llc,
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
    if (llc) query.llc = llc;
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
        $gte: new Date(sale_year, 0, 1),
        $lte: new Date(sale_year, 11, 31),
      };
    }
    console.log(query);
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
      {
        $match: {
          county,
          $or: [
            { 'subs.sub_date': filterDate },
            { status: { $in: [null, 'foreclosure', 'bankruptcy'] } },
          ],
        },
      },
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
          status: 1,
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
  getUploadTemplate: async (parent, { county }, context, info) => {
    const liens = await Lien.find({ qualifier: { $ne: null } }).limit(5);
    const data = [];
    for (let lien of liens) {
      data.push({
        block: lien.block,
        lot: lien.lot,
        qualifier: lien.qualifier,
        county: lien.county,
        address: lien.address,
        year: lien.year,
        llc: lien.llc,
        advertisement_number: lien.advertisement_number,
        mua_number: lien.mua_number,
        certificate_number: lien.certificate_number,
        lien_type: lien.lien_type,
        list_item: lien.list_item,
        current_owner: lien.current_owner,
        longitude: lien.longitude,
        latitude: lien.latitude,
        assessed_value: lien.assessed_value,
        tax_amount: lien.tax_amount,
        certificate_face_value: lien.certificate_face_value,
        winning_bid_percentage: lien.winning_bid_percentage,
        premium: lien.premium,
        sale_date: lien.sale_date,
        recording_fee: lien.recording_fee,
        recording_date: lien.recording_date,
        search_fee: lien.search_fee,
      });
    }
    const fields = {
      block: 'String',
      lot: 'String',
      qualifier: 'String',
      county: 'String',
      address: 'String',
      year: 'Number',
      llc: 'String',
      advertisement_number: 'Number',
      mua_number: 'String',
      certificate_number: 'String',
      lien_type: 'String',
      list_item: 'String',
      current_owner: 'String',
      longitude: 'Number',
      latitude: 'Number',
      assessed_value: 'Number',
      tax_amount: 'Number',
      certificate_face_value: 'Number',
      winning_bid_percentage: 'Number',
      premium: 'Number',
      sale_date: 'String',
      recording_fee: 'Number',
      recording_date: 'String',
      search_fee: 'Number',
    };
    return { fields, data };
  },
  getTownships: () => {
    return Lien.distinct('county');
  },
  getVintages: () => {
    return Lien.distinct('year');
  },
  getLLCs: () => {
    return Lien.distinct('llc');
  },
  getMonthlyRedemptions: async (
    parent,
    { year, month, county },
    context,
    info
  ) => {
    const query = {
      redemption_date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    };
    if (county) {
      query.county = county;
    }
    return Lien.find(query);
  },
  getMonthlySubPayments: async (
    parent,
    { year, month, county },
    context,
    info
  ) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const query = {
      'subs.sub_date': { $gte: start, $lt: end },
    };
    if (county) {
      query.county = county;
    }
    const response = await Lien.aggregate([
      { $unwind: '$subs' },
      { $match: query },
      { $project: { _id: 0 } },
    ]);
    return response;
  },
};

export default Query;
