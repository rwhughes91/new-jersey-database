import { toTitleCase } from '../utils/formatters';

const Lien = {
  county: ({ county }) => {
    return toTitleCase(county);
  },
  address: ({ address }) => {
    return toTitleCase(address);
  },
};

export default Lien;
