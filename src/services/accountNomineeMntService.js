const ACCOUNT_NOMINEE_MNT_API_URL = "https://10.89.202.203:7012/FCAPIService/AccountNomineeMntService/processRequest";

export async function maintainAccountNominee({
  accountID,
  depositID = 0,
  flgMnt,
  nominationType,
  nomineeDetails
}) {
  const response = await fetch(ACCOUNT_NOMINEE_MNT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      args0: {
        serviceCode: "256",
        channel: "API",
        transactionBranch: 9999,
        bankCode: 999,
        userId: "TKP",
        externalReferenceNo: Date.now()
      },
      args1: {
        accountID,
        depositID,
        flgMnt,
        nominationType,
        xfaceAccountNomineeDetailsDTO: nomineeDetails
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to maintain account nominee");
  }

  return data;
}
