const reconcileData = require('../api/requests/requests.controller') 

// SAVE THIS DATA FOR TESTCASES
const reqsData = [
  {
    req_id: "r1",
    date: "2025-01-14",
    amount: 89.40, // Matches exactly with Plaid data
    type: "reimbursement",
    plaid_transaction: null,
    status: null,
  },
  {
    req_id: "r2",
    date: "2025-01-14",
    amount: 10.0, // Matches exactly with Plaid data
    type: "payment",
    plaid_transaction: null,
    status: null,
  },
  {
    req_id: "r3",
    date: "2025-01-15",
    amount: 50.0, // Near match (Plaid has 50.25)
    type: "payment",
    plaid_transaction: null,
    status: null,
  },
  {
    req_id: "r4",
    date: "2025-01-16",
    amount: 25.0, // Missing in Plaid data
    type: "reimbursement",
    plaid_transaction: null,
    status: null,
  },
  {
    req_id: "r5",
    date: "2025-01-14",
    amount: -200.0, // User error: marked as negative instead of positive
    type: "payment",
    plaid_transaction: null,
    status: null,
  },
];


const plaidData = [
  {
    transaction_id: "txn1",
    date: "2025-01-14",
    amount: 89.40, // Matches exactly with a reimbursement
    account_id: "acct1",
    category: ["Office Supplies"],
    pending: false,
  },
  {
    transaction_id: "txn2",
    date: "2025-01-14",
    amount: 10.0, // Matches exactly with a payment
    account_id: "acct2",
    category: ["Miscellaneous"],
    pending: false,
  },
  {
    transaction_id: "txn3",
    date: "2025-01-15",
    amount: 50.25, // Near match (slightly higher than the request)
    account_id: "acct1",
    category: ["Food and Drink"],
    pending: false,
  },
  {
    transaction_id: "txn4",
    date: "2025-01-14",
    amount: 200.0, // Matches the absolute value of a request but with opposite sign
    account_id: "acct2",
    category: ["Payroll"],
    pending: false,
  },
  {
    transaction_id: "txn5",
    date: "2025-01-17",
    amount: 300.0, // Exists in Plaid but not in requests
    account_id: "acct3",
    category: ["Travel"],
    pending: false,
  },
];

test('test', () => {
  expect(true).toBe(true)
})
