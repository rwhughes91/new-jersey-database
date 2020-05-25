"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lien = _interopRequireDefault(require("../lien"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const addData = () => {
  let liens = _fs.default.readFileSync(_path.default.join(__dirname, 'liens_to_import.json'));

  liens = JSON.parse(liens);
  const idCount = [];

  for (let lien of liens) {
    const index = idCount.findIndex(id => id.lien_id === lien.lien_id);

    if (index < 0) {
      idCount.push({
        lien_id: lien.lien_id,
        count: 1
      });
    } else {
      idCount[index].count++;
    }
  }

  if (idCount.filter(obj => obj.count > 1).length > 0) {
    throw new Error('IDs are not unique');
  }

  let subs = _fs.default.readFileSync(_path.default.join(__dirname, 'subs_to_import.json'));

  subs = JSON.parse(subs);

  for (let lien of liens) {
    const subsForLien = subs.filter(sub => sub.lien_id === lien.lien_id);
    lien.subs = [];

    for (let sub of subsForLien) {
      lien.subs.push({
        sub_type: sub.sub_type,
        sub_date: new Date(sub.sub_date),
        total: sub.total
      });
    }

    lien.sale_date = new Date(lien.sale_date);
    lien.recording_date = new Date(lien.recording_date);
    lien.redemption_date = new Date(lien.redemption_date);
  }

  _mongoose.default.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    _lien.default.create(liens).then(result => {
      console.log(result);
    });
  }).catch(err => {
    console.log(err);
  });
};

const updateLienType = () => {
  const updateLienType = lienType => {
    if (lienType === null) return lienType;else if (typeof lienType === 'string') {
      const lowerType = lienType.toLowerCase();

      if (lowerType.search('single family residential') !== -1) {
        return 'Single Family Residential';
      } else if (lowerType.search('residential') !== -1 || lowerType.search('apartment') !== -1 || lowerType.search('condominium') !== -1 || lowerType.search('duplex') !== -1) {
        return 'Other Residential';
      } else if (lowerType.search('vacant') !== -1) {
        return 'Vacant';
      } else {
        return 'Commercial';
      }
    } else {
      throw Error(`${lienType} needs special attention`);
    }
  };

  _mongoose.default.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    // return Lien.distinct('lien_type');
    return _lien.default.find();
  }).then(res => {
    const saves = [];

    for (let lien of res) {
      lien.lien_type = updateLienType(lien.lien_type);
      saves.push(lien.save());
    }

    return Promise.all(saves); //   const summary = {
    //     null: 0,
    //     'Single Family Residential': 0,
    //     'Other Residential': 0,
    //     Vacant: 0,
    //     Commercial: 0,
    //   };
    //   for (let lien of res) {
    //     summary[updateLienType(lien.lien_type)]++;
    //   }
    //   console.log(summary);
    //   mongoose.disconnect();
  }).then(res => {
    console.log('all done');
  }).catch(err => {
    console.log(err);
  });
};

const clearData = () => {
  _mongoose.default.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    _lien.default.deleteMany({}, err => {
      if (err) throw err;
      console.log('all deleted');
    });
  }).catch(err => {
    console.log(err);
  });
};

const inputTestData = () => {
  _mongoose.default.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    return _lien.default.aggregate([{
      $sample: {
        size: 10
      }
    }]);
  }).then(res => {
    console.log(res); // fs.writeFileSync('testData.json', JSON.stringify(res));

    _mongoose.default.disconnect();
  }).catch(err => {
    throw err;
  });
};

inputTestData();