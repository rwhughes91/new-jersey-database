"use strict";

const fs = require('fs');

const XLSX = require('xlsx');

const uuid = require('uuid').v4;

const file = fs.readFileSync('uploadLiensTemplate.xlsx');
const workbook = XLSX.read(file, {
  type: 'buffer'
});
const worksheet = workbook.Sheets.data;
const arrayData = XLSX.utils.sheet_to_json(worksheet);
const headersFile = XLSX.read(file, {
  sheetRows: 1
});
const headers = XLSX.utils.sheet_to_json(headersFile.Sheets.data, {
  header: 1
});
console.log(headers[0]);