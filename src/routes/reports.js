import express from 'express';
import * as reportsController from '../controllers/reports';
import isAuth from '../middleware/isAuth';

const router = express.Router();

router.get('/upload', isAuth, reportsController.getUpload);
router.put('/upload', isAuth, reportsController.putUpload);

export default router;
