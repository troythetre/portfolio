// Constants used in generating a price quote

// Form Values/Generation
export const EMPLOYEES = [
  {
    role: "Project Manager",
    key: "pm",
    discovery: 20,
    implementation: 20,
    rate: 120,
  },
  {
    role: "Account Manager",
    key: "am",
    discovery: 20,
    implementation: 20,
    rate: 120,
  },
  {
    role: "Technical Lead",
    key: "tl",
    discovery: 20,
    implementation: 20,
    rate: 80,
  },
  {
    role: "Fleet Analyst",
    key: "fa",
    discovery: 20,
    implementation: 20,
    rate: 80,
  },
  {
    role: "Business Analyst",
    key: "ba",
    discovery: 20,
    implementation: 20,
    rate: 80,
  },
  {
    role: "Data Specialist",
    key: "ds",
    discovery: 20,
    implementation: 20,
    rate: 50,
  },
];

export const SUPPORT_TIERS = [
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "p3", label: "P3" },
  { value: "p4", label: "P4" },
];

export const CUSTOMER_TYPES = [
  { value: "v1", label: "V1" },
  { value: "v2", label: "V2" },
  { value: "v3", label: "V3" },
];

export const HIDDEN_VALUES = {
  discovery: {
    rowIndex: 0,
    tableIndex: 0,
  },
  implementation: {
    rowIndex: 1,
    tableIndex: 0,
  },
  software: {
    rowIndex: 2,
    tableIndex: 0,
  },
  systemAssets: {
    rowIndex: 0,
    tableIndex: 1,
  },
  systemUsers: {
    rowIndex: 1,
    tableIndex: 1,
  },
  vendorMonthlyFee: {
    rowIndex: 2,
    tableIndex: 1,
  },
  vendorTransactionFee: {
    rowIndex: 3,
    tableIndex: 1,
  },
  supportCost: {
    rowIndex: 4,
    tableIndex: 1,
  },
};
