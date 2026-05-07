import { useEffect, useRef, useState } from "react";
import "./CustomerIdentityPage.css";

/* ── Icons ───────────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.7">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8 12 3 7 8" />
    <path d="M12 3v12" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 12a9 9 0 0 1-15.2 6.5" />
    <path d="M3 12A9 9 0 0 1 18.2 5.5" />
    <path d="M18 3v5h-5" />
    <path d="M6 21v-5h5" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-5" />
  </svg>
);
const ScanIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M4 7V5a1 1 0 0 1 1-1h2" />
    <path d="M17 4h2a1 1 0 0 1 1 1v2" />
    <path d="M20 17v2a1 1 0 0 1-1 1h-2" />
    <path d="M7 20H5a1 1 0 0 1-1-1v-2" />
    <path d="M7 12h10" />
  </svg>
);
const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8M16 17H8M10 9H8" />
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────────────────── */
const OCR_RESULT = {
  panNumber: "ABCDE1234F",
  firstName: "Rahul",
  lastName: "Sharma",
  fatherName: "Mahesh Sharma",
  dateOfBirth: "1992-08-14",
};

const buildInitialData = (stepData = {}, lead = {}) => ({
  consentStatus: stepData.consentStatus || "Not Sent",
  consentLinkSentAt: stepData.consentLinkSentAt || "",
  consentCapturedAt: stepData.consentCapturedAt || "",
  panDocumentName: stepData.panDocumentName || "",
  panDocumentPreview: stepData.panDocumentPreview || "",
  panOcrStatus: stepData.panOcrStatus || "Pending",
  panVerificationStatus: stepData.panVerificationStatus || "Pending",
  panNumber: stepData.panNumber || "",
  firstName: stepData.firstName || lead.firstName || "",
  lastName: stepData.lastName || lead.lastName || "",
  fatherName: stepData.fatherName || "",
  dateOfBirth: stepData.dateOfBirth || "",
  mobileNumber: stepData.mobileNumber || lead.mobile || "",
  email: stepData.email || "",
  mobileVerified: stepData.mobileVerified || false,
  emailVerified: stepData.emailVerified || false,
  panVerified: stepData.panVerified || false,
  nsdlReferenceNumber: stepData.nsdlReferenceNumber || "",
  nsdlVerifiedAt: stepData.nsdlVerifiedAt || "",
});

/**
 * Field — shows as plain text when readOnly, proper input when editable.
 * readOnly = consent not yet captured (locked state)
 */
const Field = ({ label, value, placeholder, type = "text", onChange, readOnly, wide }) => (
  <div className={`cid-field${wide ? " wide" : ""}`}>
    <span className="cid-field-label">{label}</span>
    {readOnly ? (
      <div className="cid-field-value">
        {value || <span className="cid-field-empty">—</span>}
      </div>
    ) : (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="cid-field-input"
      />
    )}
  </div>
);

/* ── Component ───────────────────────────────────────────────────────── */
function CustomerIdentityPage({
  lead,
  stepData = {},
  sectionKey = "customerIdentity",
  updateApplicationData,
  updateStepStatus,
}) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(() => buildInitialData(stepData, lead));
  const [notice, setNotice] = useState("");
  const [isConsentWaiting, setIsConsentWaiting] = useState(false);
  const [isReadingDocument, setIsReadingDocument] = useState(false);
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);

  const consentCaptured = formData.consentStatus === "Captured";
  const consentSent = formData.consentStatus === "Sent";
  const panUploaded = Boolean(formData.panDocumentPreview);
  const ocrCompleted = formData.panOcrStatus === "Completed";
  const panVerified = formData.panVerificationStatus === "Verified";

  // Detect uploaded file type
  const isPdf =
    formData.panDocumentName?.toLowerCase().endsWith(".pdf") ||
    String(formData.panDocumentPreview).startsWith("data:application/pdf");
  const isImage = String(formData.panDocumentPreview).startsWith("data:image");

  /* state helpers */
  const syncParent = (updates) => updateApplicationData?.(sectionKey, updates);

  const setValues = (updates) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      syncParent(updates);
      return next;
    });
  };

  const setField = (name, value) => setValues({ [name]: value });

  const showNotice = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const getTimestamp = () =>
    new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* consent */
  const sendConsent = () => {
    setValues({
      consentStatus: "Sent",
      consentLinkSentAt: getTimestamp(),
      consentCapturedAt: "",
    });
    setIsConsentWaiting(true);
    showNotice("Consent link sent successfully.");
  };

  useEffect(() => {
    if (!isConsentWaiting) return undefined;
    const t = window.setTimeout(() => {
      setValues({ consentStatus: "Captured", consentCapturedAt: getTimestamp() });
      setIsConsentWaiting(false);
      showNotice("Customer consent captured.");
    }, 5000);
    return () => window.clearTimeout(t);
  }, [isConsentWaiting]);

  /* step status */
  useEffect(() => {
    if (consentCaptured && panVerified) {
      updateStepStatus?.("customer-identity", "Completed");
      return;
    }
    if (consentCaptured || panUploaded || ocrCompleted) {
      updateStepStatus?.("customer-identity", "In Progress");
    }
  }, [consentCaptured, panUploaded, ocrCompleted, panVerified, updateStepStatus]);

  /* file upload */
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValues({
        panDocumentName: file.name,
        panDocumentPreview: reader.result,
        panOcrStatus: "Ready",
        panVerificationStatus: "Pending",
        panVerified: false,
        nsdlReferenceNumber: "",
        nsdlVerifiedAt: "",
      });
      showNotice("PAN document uploaded.");
    };
    reader.readAsDataURL(file);
  };

  /* OCR */
  const extractPanDetails = () => {
    if (!panUploaded) { showNotice("Upload a PAN document first."); return; }
    setIsReadingDocument(true);
    window.setTimeout(() => {
      setValues({ ...OCR_RESULT, panOcrStatus: "Completed", panVerificationStatus: "Pending", panVerified: false });
      setIsReadingDocument(false);
      showNotice("PAN details extracted.");
    }, 1000);
  };

  /* verify */
  const verifyPan = () => {
    if (!formData.panNumber || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      showNotice("Fill in PAN number, name, and date of birth first.");
      return;
    }
    setIsVerifyingPan(true);
    window.setTimeout(() => {
      setValues({
        panVerificationStatus: "Verified",
        panVerified: true,
        nsdlReferenceNumber: `NSDL-${Math.floor(100000 + Math.random() * 900000)}`,
        nsdlVerifiedAt: getTimestamp(),
      });
      setIsVerifyingPan(false);
      showNotice("PAN verified successfully.");
    }, 1000);
  };

  /* remove */
  const removePan = () => {
    setValues({
      panDocumentName: "", panDocumentPreview: "",
      panOcrStatus: "Pending", panVerificationStatus: "Pending",
      panNumber: "", firstName: lead?.firstName || "", lastName: lead?.lastName || "",
      fatherName: "", dateOfBirth: "", panVerified: false,
      nsdlReferenceNumber: "", nsdlVerifiedAt: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    showNotice("PAN details cleared.");
  };

  /* ── Render ── */
  return (
    <div className="cid-page">

      {/* Toast */}
      {notice && (
        <div className="cid-toast">
          <CheckIcon />
          {notice}
        </div>
      )}

      {/* Page header */}
      <div className="cid-page-header">
        <h2 className="cid-page-title">Customer Identity</h2>
        <p className="cid-page-sub">
          Complete consent capture and PAN validation before proceeding with the application.
        </p>
      </div>

      {/* ── Step 01: Consent ── */}
      <div className="cid-section">
        <div className="cid-section-head">
          <div className="cid-step-info">
            <span className="cid-step-num">01</span>
            <div>
              <div className="cid-step-title">Consent Capture</div>
              <div className="cid-step-sub">Obtain customer consent before processing identity documents</div>
            </div>
          </div>
          <span className={`cid-badge ${consentCaptured ? "green" : consentSent ? "amber" : "gray"}`}>
            {consentCaptured ? <CheckIcon /> : <ClockIcon />}
            {consentCaptured ? "Captured" : consentSent ? "Awaiting" : "Pending"}
          </span>
        </div>

        <div className="cid-consent-body">
          <div className="cid-consent-copy">
            <div className="cid-eyebrow">Consent Request</div>
            <div className="cid-copy-main">Send a secure consent link to the customer</div>
            <div className="cid-copy-sub">
              A link will be delivered to{" "}
              <strong>{formData.mobileNumber || "the registered mobile number"}</strong>
            </div>
          </div>
          <button className="cid-btn-primary" onClick={sendConsent}>
            {(consentSent || consentCaptured) && <RefreshIcon />}
            {consentSent || consentCaptured ? "Resend Link" : "Send Link"}
          </button>
        </div>

        {(formData.consentLinkSentAt || formData.consentCapturedAt) && (
          <div className="cid-timeline">
            {formData.consentLinkSentAt && (
              <div className="cid-tl-row">
                <span className="cid-tl-dot amber" />
                <span>Link sent at <b>{formData.consentLinkSentAt}</b></span>
              </div>
            )}
            {formData.consentCapturedAt && (
              <div className="cid-tl-row">
                <span className="cid-tl-dot green" />
                <span>Consent captured at <b>{formData.consentCapturedAt}</b></span>
              </div>
            )}
          </div>
        )}

        {consentSent && !consentCaptured && (
          <div className="cid-note amber">
            <ClockIcon />
            Awaiting customer confirmation on their device
          </div>
        )}
        {consentCaptured && (
          <div className="cid-note green">
            <CheckIcon />
            Consent received — PAN capture and verification is now enabled
          </div>
        )}
      </div>

      {/* ── Step 02: PAN ── */}
      <div className={`cid-section${!consentCaptured ? " cid-section--locked" : ""}`}>
        <div className="cid-section-head">
          <div className="cid-step-info">
            <span className="cid-step-num">02</span>
            <div>
              <div className="cid-step-title">PAN Capture &amp; Verification</div>
              <div className="cid-step-sub">Upload the PAN document, extract details, and verify with NSDL</div>
            </div>
          </div>
          <span className={`cid-badge ${panVerified ? "green" : panUploaded ? "amber" : "gray"}`}>
            {panVerified ? <CheckIcon /> : <ClockIcon />}
            {panVerified ? "Verified" : panUploaded ? "In Progress" : "Pending"}
          </span>
        </div>

        {!consentCaptured && (
          <div className="cid-note amber compact">
            Complete consent capture above to enable PAN upload and verification.
          </div>
        )}

        <div className="cid-pan-layout">

          {/* Upload column */}
          <div className="cid-upload-col">
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              disabled={!consentCaptured}
            />

            {/* Preview / drop zone */}
            <div
              className={`cid-upload-zone${!panUploaded && consentCaptured ? " clickable" : ""}`}
              onClick={!panUploaded && consentCaptured ? () => fileInputRef.current?.click() : undefined}
            >
              {!panUploaded ? (
                <div className="cid-upload-placeholder">
                  <div className="cid-upload-icon">
                    <UploadIcon />
                  </div>
                  <span className="cid-upload-primary">Upload PAN Document</span>
                  <span className="cid-upload-hint">JPG, PNG or PDF · click to browse</span>
                </div>
              ) : isImage ? (
                <img src={formData.panDocumentPreview} alt="PAN preview" className="cid-preview-img" />
              ) : isPdf ? (
                <iframe
                  src={formData.panDocumentPreview}
                  title="PAN Document Preview"
                  className="cid-preview-pdf"
                />
              ) : (
                <div className="cid-upload-placeholder">
                  <DocumentIcon />
                  <span className="cid-upload-primary">{formData.panDocumentName}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="cid-upload-actions">
              <button
                className="cid-btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={!consentCaptured}
              >
                <UploadIcon />
                {panUploaded ? "Replace" : "Upload"}
              </button>
              <button
                className="cid-btn-secondary"
                onClick={extractPanDetails}
                disabled={!consentCaptured || !panUploaded || isReadingDocument}
              >
                <ScanIcon />
                {isReadingDocument ? "Reading…" : "Read Details"}
              </button>
              {panUploaded && (
                <button className="cid-btn-ghost danger" onClick={removePan}>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Form column */}
          <div className="cid-form-col">
            <div className="cid-form-grid">
              <Field
                label="PAN Number"
                value={formData.panNumber}
                placeholder="ABCDE1234F"
                readOnly={!consentCaptured}
                onChange={(e) => setField("panNumber", e.target.value.toUpperCase())}
              />
              <Field
                label="Date of Birth"
                value={formData.dateOfBirth}
                type="date"
                readOnly={!consentCaptured}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
              />
              <Field
                label="First Name"
                value={formData.firstName}
                placeholder="First name"
                readOnly={!consentCaptured}
                onChange={(e) => setField("firstName", e.target.value)}
              />
              <Field
                label="Last Name"
                value={formData.lastName}
                placeholder="Last name"
                readOnly={!consentCaptured}
                onChange={(e) => setField("lastName", e.target.value)}
              />
              <Field
                label="Father / Spouse Name"
                value={formData.fatherName}
                placeholder="As printed on PAN card"
                readOnly={!consentCaptured}
                wide
                onChange={(e) => setField("fatherName", e.target.value)}
              />
              <Field
                label="Mobile Number"
                value={formData.mobileNumber}
                placeholder="Mobile number"
                readOnly={!consentCaptured}
                onChange={(e) => setField("mobileNumber", e.target.value)}
              />
              <Field
                label="Email Address"
                value={formData.email}
                placeholder="Email address"
                readOnly={!consentCaptured}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>

            {/* Verify row */}
            <div className="cid-verify-row">
              <div>
                <div className="cid-copy-main">
                  {panVerified ? "PAN verified successfully" : "PAN verification pending"}
                </div>
                <div className="cid-copy-sub">
                  {panVerified
                    ? `Ref: ${formData.nsdlReferenceNumber} · ${formData.nsdlVerifiedAt}`
                    : "Confirm the extracted details above before verifying"}
                </div>
              </div>
              <button
                className={`cid-btn-primary${panVerified ? " verified" : ""}`}
                onClick={verifyPan}
                disabled={!consentCaptured || isVerifyingPan}
              >
                <ShieldIcon />
                {isVerifyingPan ? "Verifying…" : panVerified ? "Re-Verify" : "Verify PAN"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerIdentityPage;
