import Lien from '../models/lien';
import { startSession } from 'mongoose';

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
      skip,
      limit,
      sort
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
    // Sale Information
    if (certificate_number) {
      query.certificate_number = {
        $regex: `.*${certificate_number}.*`,
        $options: 'i'
      };
    }
    if (sale_year) {
      query.sale_date = {
        $gte: new Date(sale_year, 1, 1),
        $lte: new Date(sale_year, 12, 31)
      };
    }
    const liens = await Lien.find(query, null, { skip, limit, sort });
    return liens;
  }
};

export default Query;
