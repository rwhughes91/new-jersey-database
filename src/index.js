import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import resolvers from './resolvers';
import cors from 'cors';
import io from './socket';
import authRoutes from './routes/auth';
import reportRoutes from './routes/reports';
import isAuth from './middleware/isAuth';
import is404 from './middleware/is404';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import S3 from './middleware/s3';

dotenv.config();

const typeDefs = importSchema('./src/schema.graphql');
const server = new ApolloServer({ typeDefs, resolvers, playground: true });

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, 'lastLienUpload.xlsx');
    },
  }),
  fileFilter,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(authRoutes);
app.use(S3(s3), upload.single('file'), reportRoutes);
app.use(is404, isAuth);
app.use((error, req, res, next) => {
  const { data, message } = error;
  const status = error.statusCode || 500;
  res.status(status).json({ message, data });
});

server.applyMiddleware({ app });

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen({ port: 4000 });
    const serverIO = io.init(server);
    serverIO.on('connection', (socket) => {
      console.log('Client has been connected');
      socket.on('getUploadState', () => {
        const { uploading } = io.getIO();
        socket.emit('uploadingState', { uploading });
      });
      socket.on('disconnect', () => {
        console.log('Client has been disconnected');
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
