"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toTitleCase = void 0;

const toTitleCase = str => {
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

exports.toTitleCase = toTitleCase;