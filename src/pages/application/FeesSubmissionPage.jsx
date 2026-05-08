import { useMemo, useState } from "react";
import "./FeesSubmissionPage.css";

const RupeeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13h7a5 5 0 0 0 0-10" />
    <path d="m6 13 8 8" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" />
    <path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" />
    <path d="M6 22v-4H2" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 10h18" />
    <path d="m12 3 9 7H3Z" />
    <path d="M5 10v9" />
    <path d="M9 10v9" />
    <path d="M15 10v9" />
    <path d="M19 10v9" />
    <path d="M3 19h18" />
  </svg>
);

const feeItemsSeed = [
  {
    id: "FEE-001",
    feeName: "Login Fee",
    feeType: "Application",
    amount: 2500,
    tax: 450,
    waiverAllowed: true,
    waiverStatus: "Not Requested",
    waiverAmount: 0,
  },
  {
    id: "FEE-002",
    feeName: "Processing Fee",
    feeType: "Processing",
    amount: 12500,
    tax: 2250,
    waiverAllowed: true,
    waiverStatus: "Not Requested",
    waiverAmount: 0,
  },
  {
    id: "FEE-003",
    feeName: "Technical Valuation Fee",
    feeType: "Collateral",
    amount: 3500,
    tax: 630,
    waiverAllowed: false,
    waiverStatus: "Not Applicable",
    waiverAmount: 0,
  },
  {
    id: "FEE-004",
    feeName: "Legal Report Fee",
    feeType: "Collateral",
    amount: 3000,
    tax: 540,
    waiverAllowed: false,
    waiverStatus: "Not Applicable",
    waiverAmount: 0,
  },
];

const paymentMethods = [
  {
    id: "Online",
    title: "Online Payment Link",
    desc: "Send secure payment link to customer via SMS / email.",
  },
  {
    id: "Offline",
    title: "Offline Payment",
    desc: "Capture cheque / DD / branch payment details manually.",
  },
];

const offlineModes = ["Cheque", "Demand Draft", "Cash", "NEFT / RTGS", "UPI at Branch"];
const banks = ["HDFC Bank", "ICICI Bank", "Axis Bank", "State Bank of India", "Kotak Mahindra Bank", "Bank of Baroda", "Other"];

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getTimestamp() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, children, required }) {
  return (
    <label className="fs-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      className="fs-input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select className="fs-input fs-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  );
}

function CurrencyInput({ value, onChange, placeholder }) {
  return (
    <div className="fs-currency-input">
      <span>₹</span>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function FeesSubmissionPage() {
  const [feeItems, setFeeItems] = useState(feeItemsSeed);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [paymentStatus, setPaymentStatus] = useState("Not Initiated");
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("Draft");
  const [submittedApplicationId, setSubmittedApplicationId] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");

  const [waiverForm, setWaiverForm] = useState({
    feeId: "",
    requestedAmount: "",
    reason: "",
  });

  const [offlinePayment, setOfflinePayment] = useState({
    mode: "Cheque",
    chequeNumber: "",
    chequeDate: "",
    receiptNumber: "",
    dealingBank: "",
    branchName: "Mumbai Andheri Branch",
    amountReceived: "",
    remarks: "",
  });

  const [timeline, setTimeline] = useState([
    {
      id: 1,
      title: "Fees & Submission step opened",
      desc: "Review payable fees, collect payment and submit application.",
      time: "Today, 11:45 AM",
      type: "info",
    },
  ]);

  const addTimeline = (title, desc, type = "info") => {
    setTimeline((previous) => [
      {
        id: Date.now(),
        title,
        desc,
        time: getTimestamp(),
        type,
      },
      ...previous,
    ]);
  };

  const totals = useMemo(() => {
    const base = feeItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const tax = feeItems.reduce((sum, item) => sum + Number(item.tax || 0), 0);
    const waiver = feeItems.reduce((sum, item) => sum + Number(item.waiverAmount || 0), 0);
    const payable = Math.max(base + tax - waiver, 0);

    return {
      base,
      tax,
      waiver,
      payable,
      totalBeforeWaiver: base + tax,
    };
  }, [feeItems]);

  const updateWaiverForm = (key, value) => {
    setWaiverForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateOfflinePayment = (key, value) => {
    setOfflinePayment((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const requestWaiver = () => {
    if (!waiverForm.feeId || !waiverForm.requestedAmount || !waiverForm.reason) return;

    setFeeItems((previous) =>
      previous.map((item) =>
        item.id === waiverForm.feeId
          ? {
              ...item,
              waiverStatus: "Pending Approval",
              waiverAmount: Number(waiverForm.requestedAmount),
              waiverReason: waiverForm.reason,
            }
          : item
      )
    );

    addTimeline(
      "Waiver requested",
      `Waiver of ${formatCurrency(waiverForm.requestedAmount)} requested for selected fee.`,
      "warning"
    );

    setWaiverForm({
      feeId: "",
      requestedAmount: "",
      reason: "",
    });
  };

  const approveAllWaivers = () => {
    setFeeItems((previous) =>
      previous.map((item) =>
        item.waiverStatus === "Pending Approval"
          ? {
              ...item,
              waiverStatus: "Approved",
            }
          : item
      )
    );

    addTimeline("Waiver approved", "Pending waiver requests approved for demo.", "success");
  };

  const sendPaymentLink = () => {
    setIsSendingLink(true);
    setPaymentStatus("Link Sending");

    window.setTimeout(() => {
      const linkId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      const link = `https://payments.demo-los.com/pay/${linkId}`;

      setPaymentLink(link);
      setPaymentReference(linkId);
      setPaymentStatus("Link Sent");
      setIsSendingLink(false);

      addTimeline(
        "Payment link sent",
        `Payment link sent to customer for ${formatCurrency(totals.payable)}. Ref: ${linkId}`,
        "success"
      );
    }, 1000);
  };

  const verifyOnlinePayment = () => {
    if (!paymentLink) return;

    setIsVerifyingPayment(true);
    setPaymentStatus("Payment Verification Pending");

    window.setTimeout(() => {
      setPaymentStatus("Paid");
      setIsVerifyingPayment(false);

      addTimeline(
        "Online payment received",
        `Payment confirmed against reference ${paymentReference}.`,
        "success"
      );
    }, 1300);
  };

  const handleReceiptUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setReceiptFileName(file.name);

    addTimeline(
      "Offline receipt uploaded",
      `${file.name} uploaded as offline payment proof.`,
      "success"
    );
  };

  const captureOfflinePayment = () => {
    const ref =
      offlinePayment.receiptNumber ||
      offlinePayment.chequeNumber ||
      `OFF-${Math.floor(100000 + Math.random() * 900000)}`;

    setPaymentReference(ref);
    setPaymentStatus("Payment Captured");

    addTimeline(
      "Offline payment captured",
      `${offlinePayment.mode} payment captured for ${formatCurrency(offlinePayment.amountReceived || totals.payable)}. Ref: ${ref}`,
      "success"
    );
  };

  const changePaymentMethod = (nextMethod) => {
    setPaymentMethod(nextMethod);
    setPaymentStatus("Not Initiated");
    setPaymentLink("");
    setPaymentReference("");
    setReceiptFileName("");

    addTimeline(
      "Payment method changed",
      `Payment method changed to ${nextMethod}.`,
      "info"
    );
  };

  const canSubmitApplication =
    paymentStatus === "Paid" ||
    paymentStatus === "Payment Captured" ||
    totals.payable === 0;

  const submitApplication = () => {
    if (!canSubmitApplication) return;

    setIsSubmitting(true);
    setApplicationStatus("Submitting");

    window.setTimeout(() => {
      const appId = `APS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      setSubmittedApplicationId(appId);
      setSubmittedAt(getTimestamp());
      setApplicationStatus("Submitted for Review");
      setIsSubmitting(false);

      addTimeline(
        "Application submitted",
        `Application submitted successfully. Application ID: ${appId}`,
        "success"
      );
    }, 1300);
  };

  const readinessItems = [
    {
      label: "Fees calculated",
      complete: feeItems.length > 0,
    },
    {
      label: "Payment method selected",
      complete: Boolean(paymentMethod),
    },
    {
      label: "Payment collected",
      complete: canSubmitApplication,
    },
    {
      label: "Application submitted",
      complete: applicationStatus === "Submitted for Review",
    },
  ];

  return (
    <div className="fees-submission-page">
      <section className="fs-hero-card">
        <div className="fs-hero-left">
          <div className="fs-icon-wrap">
            <RupeeIcon />
          </div>
          <div>
            <span className="fs-eyebrow">Final Step</span>
            <h3>Fees, Payment & Submission</h3>
            <p>
              Review fees, request waiver, collect payment online or offline, and submit the application for review.
            </p>
          </div>
        </div>

        <div className="fs-completion-box">
          <strong>{applicationStatus}</strong>
          <span>Application Status</span>
        </div>
      </section>

      <section className="fs-kpi-grid">
        <div className="fs-kpi-card">
          <span>Total Fees</span>
          <strong>{formatCurrency(totals.totalBeforeWaiver)}</strong>
        </div>

        <div className="fs-kpi-card warning">
          <span>Waiver</span>
          <strong>{formatCurrency(totals.waiver)}</strong>
        </div>

        <div className="fs-kpi-card success">
          <span>Payable</span>
          <strong>{formatCurrency(totals.payable)}</strong>
        </div>

        <div className={`fs-kpi-card ${canSubmitApplication ? "success" : "warning"}`}>
          <span>Payment</span>
          <strong>{paymentStatus}</strong>
        </div>
      </section>

      <section className="fs-layout">
        <main className="fs-main">
          <section className="fs-card">
            <div className="fs-section-header">
              <div>
                <span className="fs-eyebrow">Fee Assessment</span>
                <h4>Applicable Fee Details</h4>
              </div>

              <button type="button" className="fs-outline-btn" onClick={approveAllWaivers}>
                Approve Waivers
              </button>
            </div>

            <div className="fs-fee-table">
              <div className="fs-fee-row header">
                <span>Fee Name</span>
                <span>Type</span>
                <span>Amount</span>
                <span>GST</span>
                <span>Waiver</span>
                <span>Status</span>
                <span>Payable</span>
              </div>

              {feeItems.map((item) => {
                const payable = Number(item.amount) + Number(item.tax) - Number(item.waiverAmount || 0);

                return (
                  <div className="fs-fee-row" key={item.id}>
                    <span>
                      <strong>{item.feeName}</strong>
                      <small>{item.waiverAllowed ? "Waiver allowed" : "Waiver not allowed"}</small>
                    </span>
                    <span>{item.feeType}</span>
                    <span>{formatCurrency(item.amount)}</span>
                    <span>{formatCurrency(item.tax)}</span>
                    <span>{formatCurrency(item.waiverAmount)}</span>
                    <span>
                      <b className={`fs-mini-pill ${item.waiverStatus === "Approved" ? "green" : item.waiverStatus === "Pending Approval" ? "amber" : "gray"}`}>
                        {item.waiverStatus}
                      </b>
                    </span>
                    <span>{formatCurrency(payable)}</span>
                  </div>
                );
              })}
            </div>

            <div className="fs-total-panel">
              <div>
                <span>Base Fees</span>
                <strong>{formatCurrency(totals.base)}</strong>
              </div>
              <div>
                <span>GST</span>
                <strong>{formatCurrency(totals.tax)}</strong>
              </div>
              <div>
                <span>Waiver</span>
                <strong>- {formatCurrency(totals.waiver)}</strong>
              </div>
              <div className="payable">
                <span>Net Payable</span>
                <strong>{formatCurrency(totals.payable)}</strong>
              </div>
            </div>
          </section>

          <section className="fs-card">
            <div className="fs-section-header">
              <div>
                <span className="fs-eyebrow">Waiver Request</span>
                <h4>Request Fee Waiver</h4>
              </div>
            </div>

            <div className="fs-field-grid three">
              <Field label="Fee Item" required>
                <SelectInput value={waiverForm.feeId} onChange={(value) => updateWaiverForm("feeId", value)}>
                  <option value="">Select fee item</option>
                  {feeItems
                    .filter((item) => item.waiverAllowed)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.feeName}
                      </option>
                    ))}
                </SelectInput>
              </Field>

              <Field label="Waiver Amount" required>
                <CurrencyInput
                  value={waiverForm.requestedAmount}
                  placeholder="Waiver amount"
                  onChange={(value) => updateWaiverForm("requestedAmount", value)}
                />
              </Field>

              <Field label="Waiver Reason" required>
                <SelectInput value={waiverForm.reason} onChange={(value) => updateWaiverForm("reason", value)}>
                  <option value="">Select reason</option>
                  <option value="Customer Negotiation">Customer Negotiation</option>
                  <option value="Campaign Offer">Campaign Offer</option>
                  <option value="Preferred Customer">Preferred Customer</option>
                  <option value="Manager Discretion">Manager Discretion</option>
                  <option value="Service Recovery">Service Recovery</option>
                </SelectInput>
              </Field>
            </div>

            <div className="fs-action-footer">
              <button
                type="button"
                className="fs-primary-btn"
                onClick={requestWaiver}
                disabled={!waiverForm.feeId || !waiverForm.requestedAmount || !waiverForm.reason}
              >
                <SendIcon />
                Request Waiver
              </button>
            </div>
          </section>

          <section className="fs-card">
            <div className="fs-section-header">
              <div>
                <span className="fs-eyebrow">Payment Method</span>
                <h4>Collect Application Fees</h4>
              </div>

              <span className={`fs-status-pill ${canSubmitApplication ? "green" : paymentStatus !== "Not Initiated" ? "amber" : "gray"}`}>
                {paymentStatus}
              </span>
            </div>

            <div className="fs-method-grid">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`fs-method-card ${paymentMethod === method.id ? "active" : ""}`}
                  onClick={() => changePaymentMethod(method.id)}
                >
                  <span>{method.id === "Online" ? <SendIcon /> : <BankIcon />}</span>
                  <strong>{method.title}</strong>
                  <p>{method.desc}</p>
                </button>
              ))}
            </div>

            {paymentMethod === "Online" && (
              <div className="fs-payment-panel">
                <div className="fs-online-box">
                  <div>
                    <span className="fs-eyebrow">Online Collection</span>
                    <h4>Send Payment Link</h4>
                    <p>
                      A secure link will be sent to the customer's registered mobile number and email.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="fs-primary-btn"
                    onClick={sendPaymentLink}
                    disabled={isSendingLink || paymentStatus === "Paid"}
                  >
                    {isSendingLink ? <RefreshIcon /> : <SendIcon />}
                    {isSendingLink ? "Sending..." : paymentLink ? "Resend Link" : "Send Payment Link"}
                  </button>
                </div>

                {paymentLink && (
                  <div className="fs-link-card">
                    <div>
                      <span>Payment Link</span>
                      <strong>{paymentLink}</strong>
                      <p>Reference: {paymentReference}</p>
                    </div>

                    <button
                      type="button"
                      className="fs-secondary-btn"
                      onClick={verifyOnlinePayment}
                      disabled={isVerifyingPayment || paymentStatus === "Paid"}
                    >
                      {isVerifyingPayment ? <RefreshIcon /> : <CheckIcon />}
                      {isVerifyingPayment ? "Checking..." : paymentStatus === "Paid" ? "Paid" : "Mock Verify Payment"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "Offline" && (
              <div className="fs-payment-panel">
                <div className="fs-field-grid three">
                  <Field label="Offline Mode" required>
                    <SelectInput value={offlinePayment.mode} onChange={(value) => updateOfflinePayment("mode", value)}>
                      {offlineModes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  {(offlinePayment.mode === "Cheque" || offlinePayment.mode === "Demand Draft") && (
                    <>
                      <Field label="Cheque / DD Number" required>
                        <TextInput
                          value={offlinePayment.chequeNumber}
                          placeholder="Cheque / DD number"
                          onChange={(value) => updateOfflinePayment("chequeNumber", value)}
                        />
                      </Field>

                      <Field label="Cheque / DD Date" required>
                        <TextInput
                          type="date"
                          value={offlinePayment.chequeDate}
                          onChange={(value) => updateOfflinePayment("chequeDate", value)}
                        />
                      </Field>
                    </>
                  )}

                  <Field label="Dealing Bank" required>
                    <SelectInput value={offlinePayment.dealingBank} onChange={(value) => updateOfflinePayment("dealingBank", value)}>
                      <option value="">Select bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Branch Name">
                    <TextInput
                      value={offlinePayment.branchName}
                      placeholder="Branch name"
                      onChange={(value) => updateOfflinePayment("branchName", value)}
                    />
                  </Field>

                  <Field label="Receipt Number">
                    <TextInput
                      value={offlinePayment.receiptNumber}
                      placeholder="Receipt / transaction number"
                      onChange={(value) => updateOfflinePayment("receiptNumber", value)}
                    />
                  </Field>

                  <Field label="Amount Received" required>
                    <CurrencyInput
                      value={offlinePayment.amountReceived}
                      placeholder={String(totals.payable)}
                      onChange={(value) => updateOfflinePayment("amountReceived", value)}
                    />
                  </Field>
                </div>

                <div className="fs-offline-actions">
                  <label className="fs-upload-btn">
                    <UploadIcon />
                    Upload Receipt / Cheque Copy
                    <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} />
                  </label>

                  {receiptFileName && (
                    <div className="fs-file-note">
                      <FileIcon />
                      <span>{receiptFileName}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="fs-primary-btn"
                    onClick={captureOfflinePayment}
                    disabled={!offlinePayment.dealingBank || !(offlinePayment.amountReceived || totals.payable)}
                  >
                    <CheckIcon />
                    Capture Offline Payment
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="fs-card">
            <div className="fs-section-header">
              <div>
                <span className="fs-eyebrow">Payment Status</span>
                <h4>Payment Confirmation</h4>
              </div>
            </div>

            <div className="fs-status-table">
              <div className="fs-status-row header">
                <span>Method</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Reference</span>
                <span>Captured By</span>
                <span>Updated On</span>
              </div>

              <div className="fs-status-row">
                <span>{paymentMethod}</span>
                <span>{formatCurrency(totals.payable)}</span>
                <span>
                  <b className={`fs-mini-pill ${canSubmitApplication ? "green" : paymentStatus !== "Not Initiated" ? "amber" : "gray"}`}>
                    {paymentStatus}
                  </b>
                </span>
                <span>{paymentReference || "—"}</span>
                <span>Sales User</span>
                <span>{paymentStatus === "Not Initiated" ? "—" : getTimestamp()}</span>
              </div>
            </div>

            {!canSubmitApplication && (
              <div className="fs-note amber">
                <AlertIcon />
                Payment must be collected before final application submission.
              </div>
            )}
          </section>

          <section className="fs-card fs-submit-card">
            <div className="fs-submit-content">
              <div className="fs-submit-icon">
                <FileIcon />
              </div>

              <div>
                <span className="fs-eyebrow">Final Submission</span>
                <h4>Submit Application for Review</h4>
                <p>
                  Once submitted, the application will move from draft to review queue and an application ID will be generated.
                </p>

                {submittedApplicationId && (
                  <div className="fs-submitted-box">
                    <span>Application ID</span>
                    <strong>{submittedApplicationId}</strong>
                    <p>Submitted at {submittedAt}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="fs-submit-btn"
              onClick={submitApplication}
              disabled={!canSubmitApplication || isSubmitting || applicationStatus === "Submitted for Review"}
            >
              {isSubmitting ? <RefreshIcon /> : <CheckIcon />}
              {isSubmitting
                ? "Submitting..."
                : applicationStatus === "Submitted for Review"
                  ? "Submitted"
                  : "Submit Application"}
            </button>
          </section>
        </main>

        <aside className="fs-side">
          <section className="fs-side-card">
            <h4>Submission Readiness</h4>

            <div className="fs-checklist">
              {readinessItems.map((item) => (
                <div key={item.label} className={item.complete ? "done" : ""}>
                  <span>{item.complete ? <CheckIcon /> : "•"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="fs-side-card payable-card">
            <div className="fs-payable-icon">
              <RupeeIcon />
            </div>
            <h4>Net Payable</h4>
            <strong>{formatCurrency(totals.payable)}</strong>
            <p>
              {paymentMethod} · {paymentStatus}
            </p>
          </section>

          <section className="fs-side-card soft">
            <h4>Application Summary</h4>

            <div className="fs-summary-list">
              <div>
                <span>Status</span>
                <strong>{applicationStatus}</strong>
              </div>
              <div>
                <span>Application ID</span>
                <strong>{submittedApplicationId || "Not generated"}</strong>
              </div>
              <div>
                <span>Payment Method</span>
                <strong>{paymentMethod}</strong>
              </div>
              <div>
                <span>Payment Ref</span>
                <strong>{paymentReference || "Pending"}</strong>
              </div>
            </div>
          </section>

          <section className="fs-side-card soft">
            <h4>Activity</h4>

            <div className="fs-timeline">
              {timeline.map((item) => (
                <div key={item.id} className={`fs-timeline-item ${item.type}`}>
                  <span>{item.type === "success" ? <CheckIcon /> : item.type === "warning" ? <AlertIcon /> : <FileIcon />}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                    <time>{item.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default FeesSubmissionPage;