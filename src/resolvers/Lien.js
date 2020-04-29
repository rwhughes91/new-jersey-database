import { toTitleCase } from '../utils/formatters';

const Lien = {
  county: ({ county }, args, context, info) => {
    return toTitleCase(county);
  },
  address: ({ address }, args, context, info) => {
    return toTitleCase(address);
  },
};

export default Lien;
