export const EMAIL_TEMPLATES = {
  EMAIL_VERIFICATION: {
    key: "EMAIL_VERIFICATION",
    subject: "Please verify your email address",
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>Dear {{customerName}},</p>

        <p>
          Thank you for starting your loan application journey with us.
          To continue processing your application, please verify your email address.
        </p>

        <p>
          <a 
            href="{{verificationLink}}" 
            style="
              display: inline-block;
              padding: 10px 18px;
              background-color: #1e5fa5;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            "
          >
            Verify Email Address
          </a>
        </p>

        <p>
          If the button does not work, please copy and paste the below link into your browser:
        </p>

        <p style="word-break: break-all; color: #1e5fa5;">
          {{verificationLink}}
        </p>

        <p>
          This verification link is valid for a limited time. If you did not request this verification,
          you can ignore this email.
        </p>

        <p>
          Regards,<br/>
          LOS Team
        </p>
      </div>
    `
  },

  DOCUMENT_REQUEST: {
    key: "DOCUMENT_REQUEST",
    subject: "Documents required for your loan application",
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>Dear {{customerName}},</p>

        <p>
          We need a few additional documents to continue processing your loan application
          <strong>{{leadNumber}}</strong>.
        </p>

        <p>
          Please upload the pending documents from your application portal.
        </p>

        <p>Regards,<br/>LOS Team</p>
      </div>
    `
  }
};