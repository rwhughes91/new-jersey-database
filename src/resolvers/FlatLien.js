import { toTitleCase } from '../utils/formatters';

const FlatLien = {
  county: ({ county }) => {
    return toTitleCase(county);
  },
  address: ({ address }) => {
    return toTitleCase(address);
  },
  sale_date: ({ sale_date }) => {
    return sale_date ? sale_date.toLocaleDateString() : sale_date;
  },
  subs: ({ subs }) => {
    if (!(subs instanceof Array)) {
      return [subs];
    }
    return subs;
  },
};

export default FlatLien;
