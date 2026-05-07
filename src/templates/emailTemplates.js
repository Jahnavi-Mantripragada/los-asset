export const EMAIL_TEMPLATES = {
  EMAIL_VERIFICATION: {
    key: "EMAIL_VERIFICATION",
    subject: "Verify your email address | Deloitte Digital Lending",
    bodyHtml: `
      <div style="margin:0; padding:0; background:#f4f7fb; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f7fb; padding:32px 12px;">
          <tr>
            <td align="center">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5edf6;">
                
                <tr>
                  <td style="background:#155ca7; padding:28px 32px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <div style="font-size:12px; letter-spacing:1.8px; text-transform:uppercase; color:#dbeafe; font-weight:700;">
                            Deloitte Digital Lending
                          </div>
                          <div style="font-size:24px; line-height:1.25; color:#ffffff; font-weight:700; margin-top:10px;">
                            Confirm your email address
                          </div>
                          <div style="font-size:14px; line-height:1.6; color:#e0f2fe; margin-top:8px;">
                            Secure verification for your digital lending journey
                          </div>
                        </td>
                        <td align="right" style="width:72px;">
                          <div style="width:58px; height:58px; border-radius:16px; background:#2b74ba; border:1px solid #6ba9df; text-align:center; line-height:58px; font-size:28px;">
                            ✉️
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="height:5px; background:#86c8ff; font-size:0; line-height:0;">
                    &nbsp;
                  </td>
                </tr>

                <tr>
                  <td style="padding:34px 34px 8px 34px;">
                    <p style="margin:0; font-size:16px; line-height:1.7; color:#111827;">
                      Dear <strong>{{customerName}}</strong>,
                    </p>

                    <p style="margin:16px 0 0 0; font-size:15px; line-height:1.75; color:#4b5563;">
                      Thank you for starting your loan application journey with
                      <strong style="color:#111827;">Deloitte Digital Lending</strong>.
                      To keep your application secure and enable important updates, please verify your email address.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 34px 8px 34px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fbff; border:1px solid #dbeafe; border-radius:14px;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="font-size:13px; color:#64748b; padding-bottom:6px;">
                                Application Reference
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size:17px; color:#0f172a; font-weight:700;">
                                {{leadNumber}}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top:14px;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="font-size:13px; color:#64748b;">
                                      Product
                                    </td>
                                    <td align="right" style="font-size:13px; color:#64748b;">
                                      Branch
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size:14px; color:#111827; font-weight:600; padding-top:4px;">
                                      {{product}}
                                    </td>
                                    <td align="right" style="font-size:14px; color:#111827; font-weight:600; padding-top:4px;">
                                      {{branchName}}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:26px 34px 18px 34px;">
                    <a
                      href="{{verificationLink}}"
                      style="display:inline-block; background:#155ca7; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:999px; font-size:15px; font-weight:700; letter-spacing:0.2px;"
                    >
                      Verify Email Address
                    </a>

                    <p style="margin:18px 0 0 0; font-size:13px; line-height:1.6; color:#64748b;">
                      This link is valid for a limited time for your security.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 34px 24px 34px;">
                    <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:14px; padding:14px 16px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="font-size:18px; padding-right:10px; vertical-align:top;">
                            🔐
                          </td>
                          <td>
                            <div style="font-size:14px; font-weight:700; color:#9a3412;">
                              Security note
                            </div>
                            <div style="font-size:13px; line-height:1.6; color:#7c2d12; margin-top:3px;">
                              Deloitte Digital Lending will never ask you to share passwords, OTPs, or confidential banking credentials over email.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 34px 30px 34px;">
                    <p style="margin:0; font-size:13px; line-height:1.7; color:#64748b;">
                      If the button does not work, copy and paste this link into your browser:
                    </p>

                    <p style="margin:8px 0 0 0; font-size:12px; line-height:1.7; color:#155ca7; word-break:break-all; background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px; padding:12px;">
                      {{verificationLink}}
                    </p>

                    <p style="margin:18px 0 0 0; font-size:13px; line-height:1.7; color:#64748b;">
                      If you did not request this verification, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f8fafc; border-top:1px solid #e5e7eb; padding:22px 34px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <div style="font-size:13px; color:#111827; font-weight:700;">
                            Deloitte Digital Lending
                          </div>
                          <div style="font-size:12px; color:#6b7280; margin-top:4px;">
                            Digital Loan Origination Workspace
                          </div>
                        </td>
                        <td align="right" style="font-size:12px; color:#94a3b8;">
                          Automated verification email
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <p style="max-width:640px; margin:16px auto 0 auto; font-size:11px; line-height:1.6; color:#94a3b8; text-align:center;">
                This is a system-generated email from Deloitte Digital Lending. Please do not reply to this message.
              </p>

            </td>
          </tr>
        </table>
      </div>
    `
  },

  DOCUMENT_REQUEST: {
    key: "DOCUMENT_REQUEST",
    subject: "Documents required for your loan application | Deloitte Digital Lending",
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

        <p>
          Regards,<br/>
          Deloitte Digital Lending
        </p>
      </div>
    `
  }
};