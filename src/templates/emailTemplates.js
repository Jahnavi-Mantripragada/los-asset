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
  },

  GOLD_LOAN_APPLICATION_CREATED: {
    key: "GOLD_LOAN_APPLICATION_CREATED",
    subject:
      "Your YES BANK Gold Loan application {{applicationNumber}} has been created",
    bodyHtml: `
      <div style="margin:0;padding:24px;background:#f4f7f9;font-family:Arial,Helvetica,sans-serif;color:#14212b;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d4e0e7;border-radius:16px;overflow:hidden;">
          <div style="background:#00518f;padding:22px 28px;border-bottom:5px solid #c4261d;">
            <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.2px;">YES BANK</div>
            <div style="margin-top:5px;color:#dceef8;font-size:13px;">Gold Loan Application</div>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Dear {{customerName}},</p>

            <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#445764;">
              Thank you for choosing YES BANK for your Gold Loan requirement. Your application has been created successfully and our branch team will guide you through verification, jewellery appraisal and the remaining documentation.
            </p>

            <div style="margin:20px 0;padding:18px;background:#f1f7fa;border-left:4px solid #00518f;border-radius:10px;">
              <div style="margin-bottom:12px;font-size:12px;font-weight:700;color:#00518f;text-transform:uppercase;letter-spacing:.6px;">Application summary</div>
              <table role="presentation" style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr>
                  <td style="padding:7px 0;color:#667985;">Application number</td>
                  <td style="padding:7px 0;text-align:right;font-weight:700;color:#14212b;">{{applicationNumber}}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#667985;">Facility preference</td>
                  <td style="padding:7px 0;text-align:right;font-weight:700;color:#14212b;">{{facilityInterest}}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#667985;">Indicative requirement</td>
                  <td style="padding:7px 0;text-align:right;font-weight:700;color:#14212b;">{{requestedLoanAmount}}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#667985;">Servicing branch</td>
                  <td style="padding:7px 0;text-align:right;font-weight:700;color:#14212b;">{{branchName}}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#667985;">Appointment</td>
                  <td style="padding:7px 0;text-align:right;font-weight:700;color:#14212b;">{{appointmentDate}}</td>
                </tr>
              </table>
            </div>

            <div style="margin:22px 0;">
              <div style="margin-bottom:10px;font-size:14px;font-weight:700;color:#14212b;">What happens next</div>
              <ol style="margin:0;padding-left:20px;color:#445764;font-size:13px;line-height:1.75;">
                <li>Our branch team will confirm your customer details and required consents.</li>
                <li>Please bring the gold jewellery and original supporting documents to the branch.</li>
                <li>Eligibility and the final loan amount will be confirmed after jewellery appraisal and policy checks.</li>
              </ol>
            </div>

            <div style="margin-top:20px;padding:13px 15px;background:#fff8df;border:1px solid #edd58c;border-radius:9px;color:#74540c;font-size:12px;line-height:1.55;">
              The amount shown above is the customer’s indicative requirement. Final eligibility, pricing and sanction are subject to jewellery appraisal and YES BANK policy.
            </div>

            <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#445764;">
              For assistance, please contact {{branchName}} and quote application number <strong>{{applicationNumber}}</strong>.
            </p>

            <p style="margin:20px 0 0;font-size:13px;line-height:1.6;">
              Regards,<br />
              <strong>YES BANK Gold Loan Team</strong>
            </p>
          </div>

          <div style="padding:16px 28px;background:#f7fafc;border-top:1px solid #e5edf1;color:#71838e;font-size:10.5px;line-height:1.55;">
            For your security, never share your OTP, PIN, password or card details with anyone. This is an automated service communication related to your Gold Loan application.
          </div>
        </div>
      </div>
    `
  }
};