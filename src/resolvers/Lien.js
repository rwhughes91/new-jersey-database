import { toTitleCase } from '../utils/formatters';

const Lien = {
  county: ({ county }) => {
    return toTitleCase(county);
  },
  address: ({ address }) => {
    return toTitleCase(address);
  },
  sale_date: ({ sale_date }) => {
    return sale_date ? sale_date.toLocaleDateString() : sale_date;
  },
  redemption_date: ({ redemption_date }) => {
    return redemption_date
      ? redemption_date.toLocaleDateString()
      : redemption_date;
  },
  subs: ({ subs }) => {
    if (!(subs instanceof Array)) {
      return [subs];
    }
    return subs;
  },
};

export default Lien;
