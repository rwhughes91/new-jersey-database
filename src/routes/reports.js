import express from 'express';
import multer from 'multer';
import * as reportsController from '../controllers/reports';
import mainPath from '../utils/path';
import path from 'path';

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(mainPath, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, 'lastLienUpload.xlsx');
  },
});

const upload = multer({ storage, fileFilter }).single('file');

const router = express.Router();

router.get('/upload', reportsController.getUpload);
router.post('/upload', upload, reportsController.postUpload);

export default router;
