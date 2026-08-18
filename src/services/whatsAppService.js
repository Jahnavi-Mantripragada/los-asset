const SEND_WHATSAPP_API_URL =
  "https://j0e80xdyw4.execute-api.ap-south-1.amazonaws.com/InitiatePropertyTypeWhatsAppChat";

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

export const normaliseIndianWhatsAppNumber = (value) => {
  const digits = digitsOnly(value).slice(-10);
  return digits ? `+91${digits}` : "";
};

export async function sendWhatsAppMessage({
  targetPhoneNumber,
  messageBody,
}) {
  const response = await fetch(SEND_WHATSAPP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetPhoneNumber,
      messageBody,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message ||
        data.error ||
        "Unable to send WhatsApp message.",
    );
  }

  return data;
}
