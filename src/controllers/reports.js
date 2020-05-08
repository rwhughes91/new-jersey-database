import * as XLSX from 'xlsx';
import io from '../socket';
import Lien from '../models/lien';
import mainPath from '../utils/path';
import path from 'path';
import fs from 'fs';

export const getUpload = (req, res, next) => {
  const filePath = path.join(mainPath, 'uploads', 'lastUploadLienErrors.xlsx');
  try {
    if (fs.existsSync(filePath)) {
      return res.download(filePath, 'errorLogs.xlsx');
    }
  } catch (err) {
    const error = new Error('Could not download file');
    error.statusCode = 500;
    throw error;
  }
  return res.json('No lien error log file saved');
};

export const postUpload = (req, res, next) => {
  if (!req.file) {
    const error = new Error('Xlsx file is required');
    error.statusCode = 400;
    throw error;
  }
  const filePath = path.join(mainPath, 'uploads', 'lastLienUpload.xlsx');
  const headersWorkbook = XLSX.readFile(filePath, { sheetRows: 1 });
  if (!headersWorkbook.SheetNames.find((sheetName) => sheetName === 'data')) {
    const error = new Error(`The liens data must have a sheet name of 'data'`);
    error.statusCode = 400;
    throw error;
  }
  const headersArray = XLSX.utils.sheet_to_json(headersWorkbook.Sheets.data, {
    header: 1,
  })[0];
  for (let header of headersArray) {
    if (!typeDefs.hasOwnProperty(header)) {
      const error = new Error(`Incorrect headers. ${header} is missing`);
      error.statusCode = 400;
      throw error;
    }
  }
  const ioServer = io.getIO();
  ioServer.uploading = true;
  ioServer.io.emit('uploadBegin');
  validateData(filePath)
    .then(() => {
      ioServer.uploading = false;
      ioServer.io.emit('uploadDone', { success: true, errorMessage: null });
    })
    .catch(() => {
      ioServer.uploading = false;
      ioServer.io.emit('uploadDone', {
        success: false,
        errorMessage: 'Could not read file',
      });
    });
  return res.status(200).json('uploading');
};

const typeDefs = {
  block: String,
  lot: String,
  qualifier: String,
  county: String,
  address: String,
  year: Number,
  llc: String,
  advertisement_number: Number,
  mua_number: String,
  certificate_number: String,
  lien_type: String,
  list_item: String,
  current_owner: String,
  longitude: Number,
  latitude: Number,
  assessed_value: Number,
  tax_amount: Number,
  certificate_face_value: Number,
  winning_bid_percentage: Number,
  premium: Number,
  sale_date: String,
  recording_fee: Number,
  recording_date: String,
  search_fee: Number,
};

const validateData = async (file) => {
  const workbook = XLSX.readFile(file);
  const maxLienId = await Lien.aggregate([
    {
      $group: { _id: null, max: { $max: '$lien_id' } },
    },
  ]);
  let lienIdInc = maxLienId[0].max + 1;
  // iterating through the new liens
  const errors = [];
  const newLiens = XLSX.utils.sheet_to_json(workbook.Sheets.data);
  for (let i = 0; i < newLiens.length; i++) {
    const lienData = { ...newLiens[i] };
    try {
      // validating lien is unique
      const existingLien = await Lien.exists({
        block: lienData.block,
        lot: lienData.lot,
        qualifier: lienData.qualifier,
        county: lienData.county,
        address: lienData.address,
        year: lienData.year,
      });
      if (existingLien) throw new Error(`Lien already exists`);
      // converting & validating dates
      const datesToFormat = ['sale_date', 'recording_date'];
      for (let dateName of datesToFormat) {
        const date = new Date(lienData[dateName]);
        if (date.toString() === 'Invalid Date') {
          throw new Error(`${dateName} must be a valid date`);
        }
        lienData[dateName] = date;
      }
      lienData.lien_id = lienIdInc;
      const lien = new Lien(lienData);
      await lien.save();
      lienIdInc++;
    } catch (err) {
      lienData.errorMessage = err.message;
      delete lienData.lien_id;
      errors.push(lienData);
    }
  }
  if (errors.length > 0) {
    const errorsWorksheet = XLSX.utils.json_to_sheet(errors);
    const errorsWorkbook = {
      Sheets: { errors: errorsWorksheet },
      SheetNames: ['errors'],
    };
    XLSX.writeFile(
      errorsWorkbook,
      path.join(mainPath, 'uploads', 'lastUploadLienErrors.xlsx')
    );
  }
};
