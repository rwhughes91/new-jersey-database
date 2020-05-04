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
    const date = parseInt(sub_date);
    const type = sub_type.toLowerCase();
    const lien = await Lien.findOne({ lien_id });
    let message;
    if (amount === 0) {
      lien.subs = lien.subs.filter(
        (sub) => sub.sub_type !== type || sub.sub_date.getTime() !== date
      );
      message = 'Deleted';
    } else {
      const subIndex = lien.subs.findIndex(
        (sub) => sub.sub_type === type && sub.sub_date.getTime() === date
      );
      if (subIndex !== -1) {
        lien.subs[subIndex].total = amount;
        message = 'Edited';
      } else {
        const sub = {
          sub_type: type,
          sub_date: new Date(date),
          total: amount,
        };
        lien.subs.push(sub);
        message = 'Created';
      }
    }
    try {
      const res = await lien.save();
      if (res) return message;
    } catch (err) {
      return 'Could not save';
    }
  },
};

export default Mutation;
