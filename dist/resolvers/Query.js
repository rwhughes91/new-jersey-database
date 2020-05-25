"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lien = _interopRequireDefault(require("../models/lien"));

var _bluebird = require("bluebird");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Query = {
  getLien: async (parent, {
    lien_id
  }, context, info) => {
    const lien = await _lien.default.findOne({
      lien_id
    });
    return lien;
  },
  getLiens: async (parent, {
    block,
    lot,
    qualifier,
    certificate_number,
    sale_year,
    county,
    address,
    status,
    llc,
    skip,
    limit,
    sort
  }, context, info) => {
    const query = {}; // Location

    if (block) query.block = {
      $regex: `^${block}`,
      $options: 'i'
    };
    if (lot) query.lot = {
      $regex: `^${lot}`,
      $options: 'i'
    };
    if (qualifier) query.qualifier = {
      $regex: `^${qualifier}`,
      $options: 'i'
    };
    if (address) query.address = {
      $regex: `.*${address}.*`,
      $options: 'i'
    };
    if (county) query.county = {
      $regex: `.*${county}.*`,
      $options: 'i'
    };
    if (llc) query.llc = llc;

    if (status) {
      switch (status) {
        case 'BANKRUPTCYREDEEMED':
          status = 'BANKRUPTCY/REDEEMED';
          break;

        case 'FORECLOSUREREDEEMED':
          status = 'FORECLOSURE/REDEEMED';
          break;

        case 'NOSUBS':
          status = 'NO-SUBS';
          break;

        case 'OPEN':
          status = null;
          break;
      }

      query.status = status;
    } // Sale Information


    if (certificate_number) {
      query.certificate_number = {
        $regex: `.*${certificate_number}.*`,
        $options: 'i'
      };
    }

    if (sale_year) {
      query.sale_date = {
        $gte: new Date(sale_year, 0, 1),
        $lte: new Date(sale_year, 11, 31)
      };
    }

    const schema = _lien.default.find(query);

    const queryTemplate = schema.toConstructor();
    return _bluebird.Promise.join(schema.countDocuments().exec(), queryTemplate().sort(sort).skip(skip).limit(limit), (count, liens) => {
      return {
        count,
        liens
      };
    });
  },
  getSubBatch: async (parent, {
    county
  }, context, info) => {
    const batchDates = await _lien.default.find({
      county
    }).distinct('subs.sub_date');
    return batchDates;
  },
  getLiensFromSubDate: async (parent, {
    date,
    county
  }, context, info) => {
    const filterDate = new Date(parseInt(date));
    const response = await _lien.default.aggregate([{
      $match: {
        county,
        $or: [{
          'subs.sub_date': filterDate
        }, {
          status: {
            $in: [null, 'foreclosure', 'bankruptcy']
          }
        }]
      }
    }, {
      $project: {
        _id: 0,
        lien_id: 1,
        block: 1,
        lot: 1,
        qualifier: 1,
        certificate_number: 1,
        sale_date: 1,
        county: 1,
        address: 1,
        status: 1,
        subs: {
          $filter: {
            input: '$subs',
            as: 'subs',
            cond: {
              $eq: ['$$subs.sub_date', filterDate]
            }
          }
        }
      }
    }]);
    return response;
  },
  getOpenLiens: async (parent, {
    county
  }, context, info) => {
    const liens = await _lien.default.find({
      county,
      status: {
        $in: [null, 'foreclosure', 'bankruptcy']
      }
    });
    return liens;
  },
  getUploadTemplate: async (parent, {
    county
  }, context, info) => {
    const liens = await _lien.default.find({
      qualifier: {
        $ne: null
      }
    }).limit(5);
    const data = [];

    for (let lien of liens) {
      data.push({
        block: lien.block,
        lot: lien.lot,
        qualifier: lien.qualifier,
        county: lien.county,
        address: lien.address,
        year: lien.year,
        llc: lien.llc,
        advertisement_number: lien.advertisement_number,
        mua_number: lien.mua_number,
        certificate_number: lien.certificate_number,
        lien_type: lien.lien_type,
        list_item: lien.list_item,
        current_owner: lien.current_owner,
        longitude: lien.longitude,
        latitude: lien.latitude,
        assessed_value: lien.assessed_value,
        tax_amount: lien.tax_amount,
        certificate_face_value: lien.certificate_face_value,
        winning_bid_percentage: lien.winning_bid_percentage,
        premium: lien.premium,
        sale_date: lien.sale_date,
        recording_fee: lien.recording_fee,
        recording_date: lien.recording_date,
        search_fee: lien.search_fee
      });
    }

    const fields = {
      block: 'String',
      lot: 'String',
      qualifier: 'String',
      county: 'String',
      address: 'String',
      year: 'Number',
      llc: 'String',
      advertisement_number: 'Number',
      mua_number: 'String',
      certificate_number: 'String',
      lien_type: 'String',
      list_item: 'String',
      current_owner: 'String',
      longitude: 'Number',
      latitude: 'Number',
      assessed_value: 'Number',
      tax_amount: 'Number',
      certificate_face_value: 'Number',
      winning_bid_percentage: 'Number',
      premium: 'Number',
      sale_date: 'String',
      recording_fee: 'Number',
      recording_date: 'String',
      search_fee: 'Number'
    };
    return {
      fields,
      data
    };
  },
  getTownships: () => {
    return _lien.default.distinct('county');
  },
  getVintages: () => {
    return _lien.default.distinct('year');
  },
  getLLCs: () => {
    return _lien.default.distinct('llc');
  },
  getMonthlyRedemptions: async (parent, {
    year,
    month,
    county
  }, context, info) => {
    const query = {
      redemption_date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    };

    if (county) {
      query.county = county;
    }

    return _lien.default.find(query);
  },
  getMonthlySubPayments: async (parent, {
    year,
    month,
    county
  }, context, info) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const query = {
      'subs.sub_date': {
        $gte: start,
        $lt: end
      }
    };

    if (county) {
      query.county = county;
    }

    const response = await _lien.default.aggregate([{
      $unwind: '$subs'
    }, {
      $match: query
    }, {
      $project: {
        _id: 0
      }
    }]);
    return response;
  },
  getDashboardData: async (parent, {
    county
  }, context, info) => {
    const query = {};
    if (county) query.county = county;

    const summaryData = _lien.default.aggregate([{
      $match: query
    }, {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        totalCashOut: {
          $sum: '$total_cash_out'
        },
        totalCashIn: {
          $sum: '$total_cash_received'
        }
      }
    }]);

    const typeAggregationData = _lien.default.aggregate([{
      $match: query
    }, {
      $group: {
        _id: {
          year: '$year',
          status: '$status',
          type: '$lien_type'
        },
        year: {
          $first: '$year'
        },
        status: {
          $first: '$status'
        },
        type: {
          $first: '$lien_type'
        },
        sum: {
          $sum: '$tax_amount'
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $facet: {
        aggByYearStatusType: [{
          $sort: {
            year: 1
          }
        }],
        aggByStatus: [{
          $group: {
            _id: '$status',
            status: {
              $first: '$status'
            },
            sum: {
              $sum: '$sum'
            },
            count: {
              $sum: '$count'
            }
          }
        }, {
          $sort: {
            status: 1
          }
        }],
        aggByType: [{
          $group: {
            _id: '$type',
            type: {
              $first: '$type'
            },
            sum: {
              $sum: '$sum'
            },
            count: {
              $sum: '$count'
            }
          }
        }, {
          $sort: {
            type: 1
          }
        }],
        aggByYear: [{
          $group: {
            _id: '$year',
            year: {
              $first: '$year'
            },
            sum: {
              $sum: '$sum'
            },
            count: {
              $sum: '$count'
            }
          }
        }, {
          $sort: {
            year: 1
          }
        }]
      }
    }]);

    const monthlyRedemptionData = _lien.default.aggregate([{
      $match: query
    }, {
      $facet: {
        redemptionsAndCashFlow: [{
          $group: {
            _id: {
              $dateToString: {
                format: '%Y',
                date: '$redemption_date'
              }
            },
            date: {
              $first: {
                $dateToString: {
                  format: '%Y',
                  date: '$redemption_date'
                }
              }
            },
            count: {
              $sum: 1
            },
            redemptionAmount: {
              $sum: '$tax_amount'
            },
            totalCashOut: {
              $sum: '$total_cash_out'
            },
            totalCashIn: {
              $sum: '$total_cash_received'
            }
          }
        }, {
          $sort: {
            date: 1
          }
        }],
        monthlySubData: [{
          $unwind: '$subs'
        }, {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y',
                date: '$subs.sub_date'
              }
            },
            date: {
              $first: {
                $dateToString: {
                  format: '%Y',
                  date: '$subs.sub_date'
                }
              }
            },
            count: {
              $sum: 1
            },
            subAmount: {
              $sum: '$subs.total'
            }
          }
        }, {
          $sort: {
            date: 1
          }
        }]
      }
    }]);

    return _bluebird.Promise.join(summaryData.exec(), typeAggregationData.exec(), monthlyRedemptionData.exec(), (summaryData, typeAggregationData, monthlyRedemptionData) => {
      return {
        county: county ? county : null,
        summaryData: summaryData[0],
        typeAggregationData: typeAggregationData[0],
        monthlyRedemptionData: monthlyRedemptionData[0]
      };
    });
  }
};
var _default = Query;
exports.default = _default;