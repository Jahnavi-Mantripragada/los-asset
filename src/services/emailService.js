const SEND_EMAIL_API_URL = "https://j0e80xdyw4.execute-api.ap-south-1.amazonaws.com/los-send-email";

export async function sendEmail({ toEmail, subject, bodyHtml, cc, bcc }) {
  const response = await fetch(SEND_EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      toEmail,
      subject,
      bodyHtml,
      message: bodyHtml,
      cc,
      bcc
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.error || "Failed to send email");
  }

  return data;
}