import { toTitleCase } from '../utils/formatters';

const Sub = {
  sub_type: ({ sub_type }, args, context, info) => {
    return toTitleCase(sub_type);
  },
  sub_date: ({ sub_date }, args, context, info) => {
    return sub_date.toLocaleDateString();
  },
};

export default Sub;
