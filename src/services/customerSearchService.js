const CUSTOMER_SEARCH_API_URL = "/fcapi/AdvanceCustomerSearchService/processRequest";

export async function searchCustomer({ customerID }) {
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
        externalReferenceNo: `CustomerSearch${Date.now()}`
      },
      arg1: {
        customerID
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to search customer");
  }

  return data;
}
