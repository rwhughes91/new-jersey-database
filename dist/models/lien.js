"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const lienSchema = new _mongoose.Schema({
  lien_id: {
    type: Number,
    index: true,
    unique: true,
    required: true
  },
  county: String,
  year: Number,
  llc: String,
  block: String,
  lot: String,
  qualifier: String,
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
  status: {
    type: String,
    lowercase: true,
    enum: ['bankruptcy', 'bankruptcy/redeemed', 'foreclosure', 'foreclosure/redeemed', 'no-subs', 'own', 'redeemed', null]
  },
  address: String,
  certificate_face_value: Number,
  winning_bid_percentage: Number,
  premium: Number,
  sale_date: Date,
  recording_fee: Number,
  recording_date: Date,
  search_fee: Number,
  year_end_penalty: Number,
  flat_rate: Number,
  cert_int: Number,
  total_subs_paid: Number,
  total_cash_out: Number,
  total_cash_received: Number,
  total_principal_paid: Number,
  total_actual_interest: Number,
  total_legal_fees: Number,
  total_principal_balance: Number,
  notes: String,
  redemption_date: Date,
  redemption_amount: Number,
  subs: [{
    sub_type: String,
    sub_date: Date,
    total: Number
  }]
});

var _default = (0, _mongoose.model)('Lien', lienSchema);

exports.default = _default;