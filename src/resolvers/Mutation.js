import Lien from '../models/lien';

const Mutation = {
  updateLienStatus: async (parent, { lien_id, status }, context, info) => {
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
    const updatedLien = await Lien.findOneAndUpdate(
      { lien_id },
      { status },
      { new: true }
    );
    return updatedLien;
  },
  updateLien: async (parent, { lien_id, payload }, context, info) => {
    if (payload.status) {
      let { status } = payload;
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
      payload.status = status;
    }
    const updatedLien = await Lien.findOneAndUpdate(
      { lien_id },
      { ...payload },
      { new: true }
    );
    return updatedLien;
  },
  updateSubAmount: async (
    parent,
    { lien_id, sub_date, sub_type, amount },
    context,
    info
  ) => {
    const date = new Date(parseInt(sub_date));
    const type = sub_type.toLowerCase();
    const res = await Lien.findOneAndUpdate(
      {
        lien_id,
        'subs.sub_type': type,
        'subs.sub_date': date,
      },
      { $set: { 'subs.$.total': amount } },
      { new: true }
    );
    let updatedSub = null;
    if (res && res.subs) {
      updatedSub = res.subs.find((sub) => {
        return (
          sub.total === amount &&
          sub.sub_type === type &&
          sub.sub_date.getTime() === date.getTime()
        );
      });
    }
    return updatedSub;
  },
};

export default Mutation;
