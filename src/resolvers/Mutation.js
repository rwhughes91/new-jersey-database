import Lien from '../models/lien';

const Mutation = {
  updateLienStatus: async (parent, { lien_id, status }, context, info) => {
    const lien = await Lien.findOne({ lien_id });
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
    lien.status = status;
    const newLien = await lien.save();
    return newLien;
  }
};

export default Mutation;
