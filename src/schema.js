const schema = {
  Transaction: {
    id: { type: "PK" }
  },
  Commission: {
    id: { type: "PK" }
  },
  TransactionDetail: {
    id: { type: "PK" }
  },
  CommissionDetail: {
    id: { type: "PK" }
  },
  Package: {
    id: { type: "PK" }
  },
  Topup: {
    id: { type: "PK" }
  },
  Meta: {
    serializedId: { type: "PK" }
  },
  Sales: {
    id: { type: "PK" }
  }
};

export default schema;
