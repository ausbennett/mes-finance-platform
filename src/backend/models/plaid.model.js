const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for counterparties
const CounterpartySchema = new Schema({
  confidence_level: String,
  entity_id: String,
  logo_url: String,
  name: String,
  phone_number: { type: String, default: null },
  type: String,
  website: { type: String, default: null }
});

// Sub-schema for location
const LocationSchema = new Schema({
  address: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  lat: { type: Number, default: null },
  lon: { type: Number, default: null },
  postal_code: { type: String, default: null },
  region: { type: String, default: null },
  store_number: { type: String, default: null }
});

// Sub-schema for payment metadata
const PaymentMetaSchema = new Schema({
  by_order_of: { type: String, default: null },
  payee: { type: String, default: null },
  payer: { type: String, default: null },
  payment_method: { type: String, default: null },
  payment_processor: { type: String, default: null },
  ppd_id: { type: String, default: null },
  reason: { type: String, default: null },
  reference_number: { type: String, default: null }
});

// Sub-schema for personal finance category
const PersonalFinanceCategorySchema = new Schema({
  confidence_level: String,
  detailed: String,
  primary: String
});

// Main transaction schema
const TransactionSchema = new Schema({
  account_id: String,
  account_owner: { type: String, default: null },
  transaction_code: { type: String, default: null },
  transaction_id: {type: String, unique: true},
  transaction_type: String,
  amount: Number,
  authorized_date: String,
  authorized_datetime: { type: String, default: null },
  category: [String],
  category_id: String,
  check_number: { type: String, default: null },
  counterparties: [CounterpartySchema],
  date: String,
  datetime: { type: String, default: null },
  iso_currency_code: String,
  location: LocationSchema,
  logo_url: { type: String, default: null },
  merchant_entity_id: { type: String, default: null },
  merchant_name: { type: String, default: null },
  name: String,
  payment_channel: String,
  payment_meta: PaymentMetaSchema,
  pending: Boolean,
  pending_transaction_id: { type: String, default: null },
  personal_finance_category: PersonalFinanceCategorySchema,
  personal_finance_category_icon_url: String,
  unofficial_currency_code: { type: String, default: null },
  website: { type: String, default: null }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
const Transaction = mongoose.model('Transaction', TransactionSchema);

TransactionSchema.index(
  { 
    account_id: 1,
    date: 1,
    amount: 1,
    merchant_name: 1,
    name: 1
  },
  { 
    unique: false, // Not unique, but helps quickly find potential duplicates
    name: "duplicate_prevention_index" 
  }
);

module.exports = Transaction;
