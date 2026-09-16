const LOAN_ACCOUNT_OPENING_API_URL = "https://10.89.202.203:7012/FCAPIService/LoanAccountOpeningService/processRequest";

export async function openLoanAccount({
  productCode,
  flgJointHolderString = "N",
  assetValue,
  loanTerm,
  repaymentMode = 0,
  scheduleCode,
  datAgrmntSign,
  codAgrmntNo,
  accountDateBasis,
  rateChartCode,
  ltvRatio,
  customerId,
  codAppId,
  letterOfOfferDate,
  loanPurpose,
  sanctionDate,
  sanctionAuthority,
  takeoverLoan = false,
  amtContribution = 0,
  fixedTermInMonths = 0,
  codDiscount = 0,
  codMargin = 0,
  morOrIoi = 0,
  loanPapersDate
}) {
  const response = await fetch(LOAN_ACCOUNT_OPENING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      args0: {
        serviceCode: "216",
        channel: "API",
        transactionBranch: 9999,
        bankCode: 999,
        userId: "TKP",
        externalReferenceNo: Date.now()
      },
      args1: {
        productCode,
        flgJointHolderString,
        assetValue,
        loanTerm,
        repaymentMode,
        scheduleCode,
        datAgrmntSign,
        codAgrmntNo,
        accountDateBasis,
        rateChartCode,
        ltvRatio,
        customerId,
        codAppId,
        letterOfOfferDate,
        loanPurpose,
        sanctionDate,
        sanctionAuthority,
        takeoverLoan,
        amtContribution,
        fixedTermInMonths,
        codDiscount,
        codMargin,
        morOrIoi,
        loanPapersDate
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to open loan account");
  }

  return data;
}
