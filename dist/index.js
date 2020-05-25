"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _apolloServerExpress = require("apollo-server-express");

var _graphqlImport = require("graphql-import");

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _cors = _interopRequireDefault(require("cors"));

var _socket = _interopRequireDefault(require("./socket"));

var _auth = _interopRequireDefault(require("./routes/auth"));

var _reports = _interopRequireDefault(require("./routes/reports"));

var _isAuth = _interopRequireDefault(require("./middleware/isAuth"));

var _is = _interopRequireDefault(require("./middleware/is404"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _s = _interopRequireDefault(require("./middleware/s3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const typeDefs = (0, _graphqlImport.importSchema)('./src/schema.graphql');
const server = new _apolloServerExpress.ApolloServer({
  typeDefs,
  resolvers: _resolvers.default,
  playground: true
});
const s3 = new _awsSdk.default.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = (0, _multer.default)({
  storage: (0, _multerS.default)({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: (req, file, cb) => {
      cb(null, 'lastLienUpload.xlsx');
    }
  }),
  fileFilter
});
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_bodyParser.default.json());
app.use(_auth.default);
app.use((0, _s.default)(s3), upload.single('file'), _reports.default);
app.use(_is.default, _isAuth.default);
app.use((error, req, res, next) => {
  const {
    data,
    message
  } = error;
  const status = error.statusCode || 500;
  res.status(status).json({
    message,
    data
  });
});
server.applyMiddleware({
  app
});

if (process.env.NODE_ENV !== 'test') {
  _mongoose.default.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    const server = app.listen({
      port: 4000
    });

    const serverIO = _socket.default.init(server);

    serverIO.on('connection', socket => {
      console.log('Client has been connected');
      socket.on('getUploadState', () => {
        const {
          uploading
        } = _socket.default.getIO();

        socket.emit('uploadingState', {
          uploading
        });
      });
      socket.on('disconnect', () => {
        console.log('Client has been disconnected');
      });
    });
  }).catch(err => {
    console.log(err);
  });
}

var _default = app;
exports.default = _default;