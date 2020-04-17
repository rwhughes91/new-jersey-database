const Lien = {
  address(parent, args, context, info) {
    const toTitleCase = (str) => {
      if (typeof str !== 'string') {
        return str;
      }
      str = str.toLowerCase().split(' ');
      let newStr = [];
      for (let word of str) {
        newStr.push(word.charAt(0).toUpperCase() + word.slice(1));
      }
      return newStr.join(' ');
    };
    const { address } = parent;
    return toTitleCase(address);
  },
};

export default Lien;
