/*
 * GOAL: RECONCILE DISPURSED TRANSACTIONS FROM REQUESTS w/ TRANSACTIONS PROVIDED BY PLAID
 * INPUTS
 *  1) plaid transactions [{amount: 0.00, transaction_id: ""}]
 *  2) requests [{},{},{}]
 * 
 * OUTPUT: MATCH TRANSACTION BY DATE, AND AMOUNT, APPEND PLAID TRANSACTION ID and CLOSE
 * */

// postive = debit = money out
// negative = credit = money in
const plaidData = [
  {
    "account_id": "abc",
    "amount": 89.4,
    "date": "2025-01-14",
    "transaction_id": "vnAz6ppA4bh3XAMJV3pbf47QApWBXDFqJpbd4"
  },
  {
    "account_id": "5m6ZXLL6rzF9lJDM49bpCWGdNNWrVWH5q7W9q",
    "amount": -4.22,
    "date": "2025-01-14",
    "transaction_id": "wmJB6ggJNDF3gxJMr3EAfyg5lVnRx6cPMGzak",
  },
]

const reqsData = [
  {
    "req_id": "qazqaz",
    "amount": 89.4,
    "date": "2025-01-14",
    "type": "reimbursement",
    "plaid_transaction": null
  },
  {
    "req_id" : "wsx",
    "amount": -4.22,
    "date": "2025-01-14",
    "type": "payment",
    "plaid_transaction": null
  },
]

// O(N * M) but constant space
const reconcileData = (plaidData, reqsData) => {
  // Iterate through each request
  reqsData.forEach(req => {
    // Find the matching transaction in plaidData
    const match = plaidData.find(
      transaction =>
        transaction.amount === req.amount && transaction.date === req.date
    );

    // If a match is found, append the transaction_id to the request
    if (match) {
      req.plaid_transaction = match;
      // req.plaid_transaction = match.transaction_id;
    }
  });

  return reqsData;
};

//O(N + N), takes space
const reconcileDataOptimized = (plaidData, reqsData) => {
  // Build a hash map for plaidData
  const plaidMap = new Map();
  plaidData.forEach(transaction => {
    const key = `${transaction.amount}-${transaction.date}`;
    plaidMap.set(key, transaction);
  });

  // Match requests to transactions
  reqsData.forEach(req => {
    const key = `${req.amount}-${req.date}`;
    if (plaidMap.has(key)) {
      req.plaid_transaction = plaidMap.get(key);
    }
  });

  return reqsData;
};


// Reconcile and print the updated reqsData
// const reconciledData = reconcileDataOptimized(plaidData, reqsData);
// console.log(reconciledData);



const reconcileByGroup = (plaidData, reqsData) => {
    // Helper function to group by date and amount
    const groupByDateAndAmount = (data) => {
        return data.reduce((acc, item) => {
            const key = `${item.date}-${item.amount}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    };

    // Group transactions and requests
    const plaidGrouped = groupByDateAndAmount(plaidData);
    const reqsGrouped = groupByDateAndAmount(reqsData);

    // Reconcile
    Object.keys(reqsGrouped).forEach((key) => {
        if (plaidGrouped[key] && plaidGrouped[key].length >= reqsGrouped[key].length) {
            // Mark all requests in this group as reconciled
            reqsGrouped[key].forEach((req) => {
                req.plaid_transaction = 'Reconciled'; // Generic reconciliation marker
            });

            // Optionally, remove used transactions if one-to-one is needed later
            plaidGrouped[key].splice(0, reqsGrouped[key].length);
        } else {
            // Mark as unreconciled if not enough transactions
            reqsGrouped[key].forEach((req) => {
                req.plaid_transaction = null; // Not reconciled
            });
        }
    });

    // Flatten the reconciled request groups back into an array
    return Object.values(reqsGrouped).flat();
};

// Example data
const plaidData2 = [
    { account_id: 'abc', amount: 10.0, date: '2025-01-14', transaction_id: 'txn1' },
    { account_id: 'abc', amount: 10.0, date: '2025-01-14', transaction_id: 'txn2' },
    { account_id: 'abc', amount: 89.4, date: '2025-01-14', transaction_id: 'txn3' },
];

const reqsData2 = [
    { req_id: 'r1', amount: 10.0, date: '2025-01-14', type: 'payment', plaid_transaction: null },
    { req_id: 'r2', amount: 10.0, date: '2025-01-14', type: 'payment', plaid_transaction: null },
    { req_id: 'r3', amount: 89.4, date: '2025-01-14', type: 'reimbursement', plaid_transaction: null },
];

const reconciledData2 = reconcileByGroup(plaidData2, reqsData2);
console.log(reconciledData2);

