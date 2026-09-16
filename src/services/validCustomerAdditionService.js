const VALID_CUSTOMER_ADDITION_API_URL = "https://10.89.202.203:7012/FCAPIService/ValidCustomerAddition/processRequest";

export async function addValidCustomer({
  individualCustomer,
  customerContactDetails,
  misClass = "",
  misCode = "0",
  form60OrForm61 = "97"
}) {
  const response = await fetch(VALID_CUSTOMER_ADDITION_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      args0: {
        serviceCode: "514",
        channel: "API",
        transactionBranch: "9999",
        bankCode: "999",
        userId: "TKP",
        externalReferenceNo: Date.now()
      },
      args1: {
        individualCustomerDTO: individualCustomer,
        customerContactDetailsDTO: customerContactDetails,
        misClass,
        misCode,
        form60OrForm61
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to add customer");
  }

  return data;
}
