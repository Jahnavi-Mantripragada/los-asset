const CASA_TD_RD_ACCOUNT_OPENING_API_URL = "https://10.89.202.203:7012/FCAPIService/CASATDRDAccountOpeningService/processRequest";

export async function openCasaTdRdAccount({
  customerID,
  branchCode = 9999,
  flgRestrictAcct = "N",
  productCode,
  minorAcctStatus = "N",
  flgSCWaive = "N",
  flgJointHolder = "N",
  customerAndRelation,
  flgTransactionType = "A",
  accountTitle,
  xfaceRDAccountPayinRequest = {
    providerAccountNo: "",
    referenceNoGL: "",
    branchCodeGL: 0,
    installmentAmount: 0,
    termMonths: 0,
    payoutAccountNo: "",
    flexiAmount: 0
  }
}) {
  const response = await fetch(CASA_TD_RD_ACCOUNT_OPENING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      args0: {
        serviceCode: "217",
        channel: "API",
        transactionBranch: 9999,
        bankCode: 999,
        userId: "TKP",
        externalReferenceNo: Date.now()
      },
      args1: {
        customerIDString: customerID,
        branchCode,
        flgRestrictAcctString: flgRestrictAcct,
        productCodeString: productCode,
        minorAcctStatusString: minorAcctStatus,
        flgSCWaiveString: flgSCWaive,
        flgJointHolderString: flgJointHolder,
        customerAndRelationString: customerAndRelation,
        flgTransactionType,
        accountTitle,
        xfaceRDAccountPayinRequestDTOString: xfaceRDAccountPayinRequest
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to open CASA/TD/RD account");
  }

  return data;
}
