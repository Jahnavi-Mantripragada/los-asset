// The LMS team's mock gold-loan data, keyed by the phone number + name a demo
// operator enters when starting an NTB application. When an application's
// mobile (or, failing that, its name) matches an entry here, the numbers the
// app "creates" along the way - customer id, loan account and packet id -
// are the LMS team's, instead of random/placeholder ones. Anything that
// doesn't match keeps the app's normal generated values.
//
// Edit `mobile` to change which number triggers an entry. Values below the
// mobile/name are the LMS rows verbatim (BRANCH_CODE 9999 is their test
// branch; our own branch list is unchanged).
//
// The LMS data has no CASA account numbers, so casaNumber is left blank
// (the app falls back to a generated one). Fill it in to pin it.

export const LMS_MOCK_CUSTOMERS = [
  {
    // LMS customer 605284, whose CUSTOMER_SHORT_NAME is "Shivanjali" - in LOS
    // this is the app's new-to-bank demo person, Shivanjali Gaikwad, with her
    // own demo details (mobile 8712700209, PAN CIJPG1213N as in
    // docs/demo-data/ntb-scenario.csv).
    mobile: "8712700209",
    fullName: "Shivanjali Gaikwad",
    lmsShortName: "Shivanjali",
    customerId: "605284",
    pan: "CIJPG1213N", // her NTB demo PAN - not in the LMS data; used by the mock PAN-card scan
    casaNumber: "50100000000481", // given for 605284
    loanAccountNumber: "51000000321211",
    packetId: "110000122",
    collateralId: "GOLDCOLL1",
    loan: {
      branchCode: "9999",
      productCode: "6615",
      productName: "Retail Gold Loan Quaterly - Medical",
      sanctionAmount: 230000,
      collateralValue: 300000,
      disbursedAmount: 230000,
      tenorMonths: 12,
    },
    appraiser: { code: "1234", name: "Valuator 1" },
    ornaments: [
      { code: "1", description: "Necklace", units: 1, otherDetails: "No Stones", karat: 22, marketValue: 13000, grossWeight: 10, netWeight: 10, valuationAmount: 150000 },
      { code: "13", description: "Bracelet", units: 1, otherDetails: "No Stones", karat: 22, marketValue: 13000, grossWeight: 8, netWeight: 8, valuationAmount: 50000 },
      { code: "6", description: "Bangles", units: 2, otherDetails: "No Stones", karat: 22, marketValue: 13000, grossWeight: 10, netWeight: 10, valuationAmount: 100000 },
    ],
  },
  {
    mobile: "9000605269",
    fullName: "Ashish Mashal",
    customerId: "605269",
    pan: "AMSPM5566H", // fabricated - not in the LMS data; used by the mock PAN-card scan
    casaNumber: "",
    loanAccountNumber: "51000000321221",
    packetId: "110000124",
    collateralId: "GOLDCOLL3",
    loan: {
      branchCode: "9999",
      productCode: "6600",
      productName: "Agri Gold Loan Bullet - Agriculture allied activities",
      sanctionAmount: 400000,
      collateralValue: 400000,
      disbursedAmount: 400000,
      tenorMonths: 12,
    },
    appraiser: { code: "1234", name: "Valuator 1" },
    ornaments: [
      { code: "1", description: "Necklace", units: 1, otherDetails: "With Stones", karat: 22, marketValue: 450000, grossWeight: 60, netWeight: 40, valuationAmount: 400000 },
    ],
  },
];

const normaliseName = (value) => String(value || "").toLowerCase().replace(/[^a-z]/g, "");

const normaliseMobile = (value) => String(value || "").replace(/\D/g, "").slice(-10);

// Finds the LMS entry for an application: by mobile first, then by name
// (spaces/case ignored, so "Shivanjali  Gaikwad" and "shivanjaligaikwad" both match).
export const findLmsMockCustomer = ({ mobile, firstName, lastName, fullName } = {}) => {
  const mobileKey = normaliseMobile(mobile);
  const byMobile = mobileKey
    ? LMS_MOCK_CUSTOMERS.find((entry) => entry.mobile === mobileKey)
    : null;
  if (byMobile) return byMobile;

  const nameKey = normaliseName(fullName || `${firstName || ""}${lastName || ""}`);
  return nameKey
    ? LMS_MOCK_CUSTOMERS.find((entry) => normaliseName(entry.fullName) === nameKey) || null
    : null;
};

// "Retail Gold Loan Quaterly - Medical" -> product, repayment type, purpose.
// The LMS names encode all three; anything that doesn't parse yields null.
const REPAYMENT_LABELS = { emi: "EMI", quaterly: "Quarterly", quarterly: "Quarterly", bullet: "Bullet" };

export const parseLmsProductName = (productName) => {
  const match = /^(Retail|Agri|MSME)\s+Gold Loan\s+(\w+)\s+-\s+(.+)$/i.exec(
    String(productName || "").replace(/^\d+-/, "").trim(),
  );
  if (!match) return null;
  const repaymentType = REPAYMENT_LABELS[match[2].toLowerCase()];
  if (!repaymentType) return null;
  const productKey = { retail: "Retail", agri: "Agri", msme: "MSME" }[match[1].toLowerCase()];
  return { productType: productKey, repaymentType, purpose: match[3].trim() };
};

// The customer id LOS shows for an LMS customer is exactly the id LMS holds
// (605284) - no prefix - so what is typed into a sheet matches theirs.
export const toAppCustomerId = (lmsCustomer) => lmsCustomer.customerId;

// Demo bridge, no real LOS -> LMS integration yet: each ornament of an LMS
// applicant shows the LMS lending rate (MARKET_VALUE) verbatim and is valued
// at the LMS VALUATION_AMOUNT. Their figures don't multiply out (13000 x 10g
// is not 1,50,000), so the value is carried separately, as a per-gram figure
// = LMS valuation / LMS net weight, which lands exactly on their valuation
// when the LMS net weight is what the appraiser enters. Items are matched by
// ornament type ("Gold Necklace" <-> "Necklace").
export const applyLmsValuation = (items, lmsApplicant) => {
  if (!lmsApplicant) return items;
  return items.map((item) => {
    const key = String(item.description || item.jewelleryType || "")
      .toLowerCase()
      .replace(/^gold\s+/, "")
      .trim();
    const ornament = lmsApplicant.ornaments.find((entry) => entry.description.toLowerCase() === key);
    return ornament
      ? {
          ...item,
          lendingRateOverride: ornament.marketValue,
          valuationPerGramOverride: ornament.valuationAmount / ornament.netWeight,
        }
      : item;
  });
};

// LMS sanctions Ashish's 4,00,000 against 4,00,000 of collateral (100%), above
// the app's normal LTV tiers; the applicant's own ratio is a floor on the LTV.
export const lmsRequiredLtv = (lmsApplicant) =>
  lmsApplicant
    ? Math.ceil((lmsApplicant.loan.sanctionAmount / lmsApplicant.loan.collateralValue) * 100)
    : 0;
