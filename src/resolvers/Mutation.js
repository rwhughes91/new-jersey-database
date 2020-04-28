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
    console.log(payload);
    const updatedLien = await Lien.findOneAndUpdate(
      { lien_id },
      { ...payload },
      { new: true }
    );
    return updatedLien;
  },
};

export default Mutation;
