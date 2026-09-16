const CUSTOMER_SEARCH_API_URL = "https://10.89.202.203:7012/FCAPIService/AdvanceCustomerSearchService/processRequest";

async function postCustomerSearch(args1) {
  const response = await fetch(CUSTOMER_SEARCH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      args0: {
        serviceCode: "264",
        channel: "API",
        transactionBranch: 9999,
        bankCode: 999,
        userId: "TKP",
        externalReferenceNo: Date.now()
      },
      args1
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to search customer");
  }

  return data;
}

export async function searchCustomer({ customerID }) {
  return postCustomerSearch({ customerID });
}

export async function searchCustomerByMobile({ mobileNumber, shortName }) {
  return postCustomerSearch({ mobileNumber, shortName });
}
