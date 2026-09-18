// Mock Account360 service (real API: service A226).
//
// There is no real integration yet. getAccountCollateral() simulates one:
// it returns the same shape a real call would, after a short delay.
//
// The only real Account360 sample we were given (service A226) is for a
// different, unrelated customer (Soniya Roy, account 1015100322933) - not
// one of our own mock ETB customers. This service reuses that sample's
// *shape* (accountDetails / collateralDetails / packetDetails /
// xfaceOrnamentDetailsDTO), populated with values for our own customers'
// own accounts instead of copying her data onto them.
//
// To connect the real service later, replace the body of
// getAccountCollateral() with the actual API call (plain fetch(), same
// pattern as src/services/customerSearchService.js) and keep the function
// signature and return shape the same.

const MOCK_REQUEST_DELAY_MS = 700;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ACCOUNT_360_BY_ACCOUNT_ID = {
  // Shivanjali's gold loan (ACCOUNT OPEN REGULAR) - active collateral,
  // consistent with her Customer360 record: same packetId (P0418G0007),
  // same net weight/value (18g / Rs 2,50,000) as her
  // xfaceExtGoldAllCaratWiseDTO summary there. Ornament split (chain +
  // ring) is fabricated - the summary gives a total, not a per-piece
  // breakdown.
  "1018100428531": {
    collateralDetails: [
      {
        alternativeId: "0418.GLNETCR10.1.6745",
        collateralAmount: 250000,
        collateralId: "670000GL04180001",
        facilityId: 40182,
        limitId: 0,
        lineNo: "GOLDLINE0418",
        packetDetails: [
          {
            packetId: "P0418G0007",
            packetSize: "S",
            pledgeRate: 14224,
            totalDeductions: 2,
            totalGrossWeight: 20,
            totalNetWeight: 18,
            totalNoOfOrnaments: 2,
            totalSecurityAmount: 250000,
            xfaceOrnamentDetailsDTO: [
              {
                carat: "22",
                deduction: 1,
                grossWeight: 12,
                netWeight: 11,
                noOfUnit: 1,
                ornamentType: "Gold Chain",
                pledgeRate: 14224,
                securityAmount: 156464,
              },
              {
                carat: "22",
                deduction: 1,
                grossWeight: 8,
                netWeight: 7,
                noOfUnit: 1,
                ornamentType: "Gold Ring",
                pledgeRate: 14224,
                securityAmount: 99568,
              },
            ],
          },
        ],
      },
    ],
  },

  // Deepak's gold loan (ACCOUNT CLOSED) - deliberately empty. A closed
  // loan's pledged ornaments would already have been released back to
  // the customer, so there's no active collateral to show - this isn't
  // a gap, it's the realistic answer for a closed account.
  "1015100318762": {
    collateralDetails: [],
  },
};

export async function getAccountCollateral(accountId) {
  await delay(MOCK_REQUEST_DELAY_MS);

  // TODO(real API): replace this lookup with the actual A226 call, e.g.
  // POST /FCAPIService/AccountInquiryService/processRequest
  // { args0: {...}, args1: { codAcctNo: accountId } }
  const record = ACCOUNT_360_BY_ACCOUNT_ID[accountId];
  return record ? record.collateralDetails : [];
}
