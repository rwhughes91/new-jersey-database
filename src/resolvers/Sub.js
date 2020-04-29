import { toTitleCase } from '../utils/formatters';

const Sub = {
  sub_type: ({ sub_type }, args, context, info) => {
    return toTitleCase(sub_type);
  },
};

export default Sub;
