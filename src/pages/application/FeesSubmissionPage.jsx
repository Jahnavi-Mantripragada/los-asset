import { useMemo, useState } from "react";
import "./FeesSubmissionPage.css";

/* ── Icons ───────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" /><path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" /><path d="M6 22v-4H2" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);

/* ── Data ────────────────────────────────────────────────────────── */
const feeItemsSeed = [
  { id: "FEE-001", feeName: "Login Fee",               feeType: "Application", amount: 2500,  tax: 450,  waiverAllowed: true,  waiverStatus: "Not Requested", waiverAmount: 0 },
  { id: "FEE-002", feeName: "Processing Fee",           feeType: "Processing",  amount: 12500, tax: 2250, waiverAllowed: true,  waiverStatus: "Not Requested", waiverAmount: 0 },
  { id: "FEE-003", feeName: "Technical Valuation Fee",  feeType: "Collateral",  amount: 3500,  tax: 630,  waiverAllowed: false, waiverStatus: "Not Applicable", waiverAmount: 0 },
  { id: "FEE-004", feeName: "Legal Report Fee",          feeType: "Collateral",  amount: 3000,  tax: 540,  waiverAllowed: false, waiverStatus: "Not Applicable", waiverAmount: 0 },
];

const offlineModes = ["Cheque", "Demand Draft", "Cash", "NEFT / RTGS", "UPI at Branch"];
const bankOptions  = ["HDFC Bank", "ICICI Bank", "Axis Bank", "State Bank of India", "Kotak Mahindra Bank", "Bank of Baroda", "Other"];
const waiverReasons = ["Customer Negotiation", "Campaign Offer", "Preferred Customer", "Manager Discretion", "Service Recovery"];

/* ── Helpers ─────────────────────────────────────────────────────── */
function fmt(v) {
  return `₹ ${Number(v || 0).toLocaleString("en-IN")}`;
}
function ts() {
  return new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ── Component ───────────────────────────────────────────────────── */
function FeesSubmissionPage() {
  /* Fee state */
  const [feeItems, setFeeItems]           = useState(feeItemsSeed);
  const [showWaiverForm, setShowWaiverForm] = useState(false);
  const [waiverForm, setWaiverForm]         = useState({ feeId: "", amount: "", reason: "" });

  /* Payment state */
  const [payMethod, setPayMethod]           = useState("Online");
  const [onlineStage, setOnlineStage]       = useState("idle"); // idle|sending|sent|verifying|paid
  const [payLink, setPayLink]               = useState("");
  const [payRef, setPayRef]                 = useState("");
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [offlineCaptured, setOfflineCaptured] = useState(false);
  const [offlineForm, setOfflineForm]         = useState({ mode: "Cheque", chequeNumber: "", chequeDate: "", receiptNumber: "", dealingBank: "", amountReceived: "" });
  const [receiptFile, setReceiptFile]         = useState("");

  /* Submission state */
  const [appStatus, setAppStatus]           = useState("Draft");
  const [submittedId, setSubmittedId]       = useState("");
  const [submittedAt, setSubmittedAt]       = useState("");
  const [isSubmitting, setIsSubmitting]     = useState(false);

  /* Timeline */
  const [timeline, setTimeline] = useState([
    { id: 1, title: "Step opened", desc: "Review fees, collect payment and submit application.", time: "Today, 11:45 AM", type: "info" },
  ]);
  const addTl = (title, desc, type = "info") =>
    setTimeline((p) => [{ id: Date.now(), title, desc, time: ts(), type }, ...p]);

  /* Computed */
  const totals = useMemo(() => {
    const base   = feeItems.reduce((s, i) => s + Number(i.amount), 0);
    const tax    = feeItems.reduce((s, i) => s + Number(i.tax), 0);
    const waiver = feeItems.reduce((s, i) => s + Number(i.waiverAmount || 0), 0);
    return { base, tax, waiver, payable: Math.max(base + tax - waiver, 0) };
  }, [feeItems]);

  const isPaid     = onlineStage === "paid" || offlineCaptured;
  const canSubmit  = isPaid || totals.payable === 0;
  const hasWaiverPending = feeItems.some((i) => i.waiverStatus === "Pending Approval");

  /* Waiver actions */
  const submitWaiver = () => {
    if (!waiverForm.feeId || !waiverForm.amount || !waiverForm.reason) return;
    setFeeItems((p) => p.map((i) => i.id === waiverForm.feeId
      ? { ...i, waiverStatus: "Pending Approval", waiverAmount: Number(waiverForm.amount) } : i));
    addTl("Waiver requested", `Waiver of ${fmt(waiverForm.amount)} requested for selected fee.`, "warning");
    setWaiverForm({ feeId: "", amount: "", reason: "" });
    setShowWaiverForm(false);
  };

  const approveWaivers = () => {
    setFeeItems((p) => p.map((i) => i.waiverStatus === "Pending Approval" ? { ...i, waiverStatus: "Approved" } : i));
    addTl("Waivers approved", "All pending waiver requests approved.", "success");
  };

  /* Online payment */
  const sendLink = () => {
    setOnlineStage("sending");
    setTimeout(() => {
      const id = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setPayRef(id);
      setPayLink(`https://payments.los.demo/pay/${id}`);
      setOnlineStage("sent");
      addTl("Payment link sent", `Secure link sent for ${fmt(totals.payable)}. Ref: ${id}`, "success");
    }, 1000);
  };

  const verifyPayment = () => {
    setOnlineStage("verifying");
    setTimeout(() => {
      setOnlineStage("paid");
      addTl("Payment received", `Payment confirmed. Ref: ${payRef}`, "success");
    }, 1300);
  };

  /* Offline payment */
  const captureOffline = () => {
    const ref = offlineForm.receiptNumber || offlineForm.chequeNumber || `OFF-${Math.floor(100000 + Math.random() * 900000)}`;
    setPayRef(ref);
    setOfflineCaptured(true);
    setShowOfflineForm(false);
    addTl("Offline payment captured", `${offlineForm.mode} · Ref: ${ref}`, "success");
  };

  /* Change method */
  const changeMethod = (m) => {
    setPayMethod(m);
    setOnlineStage("idle");
    setPayLink(""); setPayRef("");
    setShowOfflineForm(false); setOfflineCaptured(false); setReceiptFile("");
    addTl("Payment method changed", `Switched to ${m} payment.`);
  };

  /* Submission */
  const submitApp = () => {
    setIsSubmitting(true); setAppStatus("Submitting");
    setTimeout(() => {
      const id = `APS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedId(id); setSubmittedAt(ts());
      setAppStatus("Submitted"); setIsSubmitting(false);
      addTl("Application submitted", `Application ID: ${id}`, "success");
    }, 1300);
  };

  return (
    <div className="fs-page">
      <div className="fs-panel">

        {/* ── 1. Fee Breakdown ── */}
        <div className="fs-section">
          <div className="fs-section-head">
            <div>
              <span className="fs-section-title">Fee Breakdown</span>
              <span className="fs-section-sub">Applicable fees for this application</span>
            </div>
            <div className="fs-head-actions">
              {hasWaiverPending && (
                <button type="button" className="fs-text-btn" onClick={approveWaivers}>
                  Approve Waivers
                </button>
              )}
              <button type="button" className="fs-edit-btn" onClick={() => setShowWaiverForm((p) => !p)}>
                {showWaiverForm ? "Cancel" : "+ Request Waiver"}
              </button>
            </div>
          </div>

          {/* Fee list */}
          <div className="fs-fee-list">
            <div className="fs-fee-row header">
              <span>Fee</span>
              <span>Base</span>
              <span>GST</span>
              <span>Waiver</span>
              <span>Payable</span>
              <span>Status</span>
            </div>
            {feeItems.map((item) => {
              const payable = Number(item.amount) + Number(item.tax) - Number(item.waiverAmount || 0);
              return (
                <div className="fs-fee-row" key={item.id}>
                  <div className="fs-fee-name-cell">
                    <span className="fs-fee-name">{item.feeName}</span>
                    <span className="fs-fee-type">{item.feeType}</span>
                  </div>
                  <span>{fmt(item.amount)}</span>
                  <span>{fmt(item.tax)}</span>
                  <span>{item.waiverAmount ? fmt(item.waiverAmount) : "—"}</span>
                  <span className="fs-fee-payable-cell">{fmt(payable)}</span>
                  <span>
                    <span className={`fs-badge ${item.waiverStatus === "Approved" ? "green" : item.waiverStatus === "Pending Approval" ? "amber" : "muted"}`}>
                      {item.waiverStatus}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals strip */}
          <div className="fs-totals-strip">
            <div><span>Base</span><strong>{fmt(totals.base)}</strong></div>
            <div><span>GST</span><strong>{fmt(totals.tax)}</strong></div>
            {totals.waiver > 0 && <div className="waiver"><span>Waiver</span><strong>− {fmt(totals.waiver)}</strong></div>}
            <div className="payable"><span>Net Payable</span><strong>{fmt(totals.payable)}</strong></div>
          </div>

          {/* Waiver form — revealed on demand */}
          {showWaiverForm && (
            <div className="fs-waiver-panel">
              <span className="fs-wf-title">Waiver Request</span>
              <div className="fs-field-grid-3">
                <div className="fs-field">
                  <span className="fs-field-label">Fee Item</span>
                  <select className="fs-input fs-select" value={waiverForm.feeId}
                    onChange={(e) => setWaiverForm((p) => ({ ...p, feeId: e.target.value }))}>
                    <option value="">Select fee</option>
                    {feeItems.filter((i) => i.waiverAllowed).map((i) => (
                      <option key={i.id} value={i.id}>{i.feeName}</option>
                    ))}
                  </select>
                </div>
                <div className="fs-field">
                  <span className="fs-field-label">Waiver Amount</span>
                  <div className="fs-currency-wrap">
                    <span>₹</span>
                    <input className="fs-currency-inner" type="number" value={waiverForm.amount}
                      placeholder="Amount"
                      onChange={(e) => setWaiverForm((p) => ({ ...p, amount: e.target.value }))} />
                  </div>
                </div>
                <div className="fs-field">
                  <span className="fs-field-label">Reason</span>
                  <select className="fs-input fs-select" value={waiverForm.reason}
                    onChange={(e) => setWaiverForm((p) => ({ ...p, reason: e.target.value }))}>
                    <option value="">Select reason</option>
                    {waiverReasons.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="fs-wf-footer">
                <button type="button" className="fs-btn-ghost" onClick={() => setShowWaiverForm(false)}>Cancel</button>
                <button type="button" className="fs-btn-primary"
                  disabled={!waiverForm.feeId || !waiverForm.amount || !waiverForm.reason}
                  onClick={submitWaiver}>
                  <SendIcon /> Submit Waiver Request
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="fs-divider" />

        {/* ── 2. Payment ── */}
        <div className="fs-section">
          <div className="fs-section-head">
            <div>
              <span className="fs-section-title">Payment Collection</span>
              <span className="fs-section-sub">Collect {fmt(totals.payable)} from the applicant</span>
            </div>
            {isPaid && (
              <span className="fs-paid-badge"><CheckIcon /> Collected</span>
            )}
          </div>

          {/* Method tabs */}
          {!isPaid && (
            <div className="fs-method-tabs">
              {["Online", "Offline"].map((m) => (
                <button key={m} type="button"
                  className={`fs-method-tab${payMethod === m ? " active" : ""}`}
                  onClick={() => changeMethod(m)}>
                  {m === "Online" ? "Online Payment Link" : "Offline / Manual Payment"}
                </button>
              ))}
            </div>
          )}

          {/* Online flow */}
          {payMethod === "Online" && !isPaid && (
            <div className="fs-pay-area">
              {(onlineStage === "idle" || onlineStage === "sending") && (
                <div className="fs-pay-prompt">
                  <div className="fs-pay-prompt-text">
                    <span className="fs-pay-amount">{fmt(totals.payable)}</span>
                    <p>A secure link will be sent to the customer's registered mobile and email.</p>
                  </div>
                  <button type="button" className="fs-btn-primary" onClick={sendLink} disabled={onlineStage === "sending"}>
                    {onlineStage === "sending" ? <><RefreshIcon /> Sending…</> : <><SendIcon /> Send Payment Link</>}
                  </button>
                </div>
              )}

              {onlineStage === "sent" && (
                <div className="fs-pay-sent-area">
                  <div className="fs-pay-link-strip">
                    <div>
                      <span className="fs-pay-link-label">Payment Link Generated</span>
                      <span className="fs-pay-link-url">{payLink}</span>
                      <span className="fs-pay-ref">Ref: {payRef}</span>
                    </div>
                    <button type="button" className="fs-btn-ghost" onClick={sendLink}>Resend</button>
                  </div>
                  <div className="fs-pay-verify-row">
                    <p>Waiting for customer to complete payment.</p>
                    <button type="button" className="fs-btn-primary" onClick={verifyPayment}>
                      <CheckIcon /> Confirm Payment Received
                    </button>
                  </div>
                </div>
              )}

              {onlineStage === "verifying" && (
                <div className="fs-pay-prompt">
                  <p className="fs-pay-verifying"><RefreshIcon /> Verifying payment…</p>
                </div>
              )}
            </div>
          )}

          {/* Offline flow */}
          {payMethod === "Offline" && !isPaid && (
            <div className="fs-pay-area">
              {!showOfflineForm && (
                <div className="fs-pay-prompt">
                  <div className="fs-pay-prompt-text">
                    <span className="fs-pay-amount">{fmt(totals.payable)}</span>
                    <p>Capture cheque, demand draft or other offline payment details manually.</p>
                  </div>
                  <button type="button" className="fs-btn-primary" onClick={() => setShowOfflineForm(true)}>
                    Enter Payment Details
                  </button>
                </div>
              )}

              {showOfflineForm && (
                <div className="fs-offline-form">
                  <div className="fs-field-grid-3">
                    <div className="fs-field">
                      <span className="fs-field-label">Payment Mode</span>
                      <select className="fs-input fs-select" value={offlineForm.mode}
                        onChange={(e) => setOfflineForm((p) => ({ ...p, mode: e.target.value }))}>
                        {offlineModes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    {(offlineForm.mode === "Cheque" || offlineForm.mode === "Demand Draft") && (
                      <>
                        <div className="fs-field">
                          <span className="fs-field-label">Cheque / DD Number</span>
                          <input className="fs-input" value={offlineForm.chequeNumber} placeholder="Number"
                            onChange={(e) => setOfflineForm((p) => ({ ...p, chequeNumber: e.target.value }))} />
                        </div>
                        <div className="fs-field">
                          <span className="fs-field-label">Date</span>
                          <input className="fs-input" type="date" value={offlineForm.chequeDate}
                            onChange={(e) => setOfflineForm((p) => ({ ...p, chequeDate: e.target.value }))} />
                        </div>
                      </>
                    )}
                    <div className="fs-field">
                      <span className="fs-field-label">Dealing Bank</span>
                      <select className="fs-input fs-select" value={offlineForm.dealingBank}
                        onChange={(e) => setOfflineForm((p) => ({ ...p, dealingBank: e.target.value }))}>
                        <option value="">Select bank</option>
                        {bankOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="fs-field">
                      <span className="fs-field-label">Receipt Number</span>
                      <input className="fs-input" value={offlineForm.receiptNumber} placeholder="Receipt / transaction no."
                        onChange={(e) => setOfflineForm((p) => ({ ...p, receiptNumber: e.target.value }))} />
                    </div>
                    <div className="fs-field">
                      <span className="fs-field-label">Amount Received</span>
                      <div className="fs-currency-wrap">
                        <span>₹</span>
                        <input className="fs-currency-inner" type="number" value={offlineForm.amountReceived}
                          placeholder={String(totals.payable)}
                          onChange={(e) => setOfflineForm((p) => ({ ...p, amountReceived: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="fs-offline-footer">
                    <label className="fs-upload-label">
                      <UploadIcon />
                      {receiptFile || "Upload Receipt / Cheque Copy"}
                      <input type="file" accept="image/*,.pdf" style={{ display: "none" }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) setReceiptFile(f.name); }} />
                    </label>
                    <div className="fs-offline-btns">
                      <button type="button" className="fs-btn-ghost" onClick={() => setShowOfflineForm(false)}>Cancel</button>
                      <button type="button" className="fs-btn-primary" onClick={captureOffline} disabled={!offlineForm.dealingBank}>
                        <CheckIcon /> Capture Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paid confirmation */}
          {isPaid && (
            <div className="fs-pay-confirmed">
              <div className="fs-pay-confirmed-icon"><CheckIcon /></div>
              <div>
                <span className="fs-pay-confirmed-label">
                  {onlineStage === "paid" ? "Online Payment Confirmed" : "Offline Payment Captured"}
                </span>
                <span className="fs-pay-confirmed-ref">
                  {payMethod} · Ref: {payRef} · {fmt(totals.payable)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="fs-divider" />

        {/* ── 3. Final Submission ── */}
        <div className="fs-section">
          <div className="fs-section-head">
            <div>
              <span className="fs-section-title">Final Submission</span>
              <span className="fs-section-sub">Submit the application to the credit review queue</span>
            </div>
          </div>

          {appStatus === "Submitted" ? (
            <div className="fs-submitted-state">
              <div className="fs-submitted-icon"><CheckIcon /></div>
              <div>
                <span className="fs-submitted-label">Application Submitted Successfully</span>
                <span className="fs-submitted-id">{submittedId}</span>
                <span className="fs-submitted-time">Submitted at {submittedAt}</span>
              </div>
            </div>
          ) : (
            <div className="fs-submit-area">
              {!canSubmit && (
                <div className="fs-blocker-msg">
                  <AlertIcon /> Payment must be collected before submitting the application.
                </div>
              )}
              <div className="fs-submit-row">
                <p>Once submitted, the application moves to the review queue and an Application ID is generated.</p>
                <button type="button" className="fs-submit-btn" onClick={submitApp}
                  disabled={!canSubmit || isSubmitting}>
                  {isSubmitting
                    ? <><RefreshIcon /> Submitting…</>
                    : <><CheckIcon /> Submit Application</>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="fs-divider" />

        {/* ── 4. Activity Timeline ── */}
        <div className="fs-section">
          <div className="fs-section-head">
            <div>
              <span className="fs-section-title">Activity</span>
              <span className="fs-section-sub">Live log of actions on this step</span>
            </div>
          </div>

          <div className="fs-timeline">
            {timeline.map((item, idx) => (
              <div key={item.id} className="fs-tl-item">
                <div className="fs-tl-track">
                  <div className={`fs-tl-dot ${item.type}`} />
                  {idx < timeline.length - 1 && <div className="fs-tl-line" />}
                </div>
                <div className="fs-tl-body">
                  <span className="fs-tl-title">{item.title}</span>
                  <span className="fs-tl-desc">{item.desc}</span>
                  <span className="fs-tl-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FeesSubmissionPage;
