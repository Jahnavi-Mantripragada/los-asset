import { useEffect, useRef, useState } from "react";
import "./CustomerIdentityPage.css";
import { removeUploadedDocument, saveUploadedDocument } from "../../utils/documentStore";

/* ── Icons ───────────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.7">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const BigCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8 12 3 7 8" /><path d="M12 3v12" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 12a9 9 0 0 1-15.2 6.5" />
    <path d="M3 12A9 9 0 0 1 18.2 5.5" />
    <path d="M18 3v5h-5" /><path d="M6 21v-5h5" />
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
    <path d="M4 7V5a1 1 0 0 1 1-1h2" /><path d="M17 4h2a1 1 0 0 1 1 1v2" />
    <path d="M20 17v2a1 1 0 0 1-1 1h-2" /><path d="M7 20H5a1 1 0 0 1-1-1v-2" />
    <path d="M7 12h10" />
  </svg>
);
const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="cid-spin-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/* ── Constants ───────────────────────────────────────────────────────── */
const OCR_RESULT = {
  panNumber:  "ABCDE1234F",
  firstName:  "Rahul",
  lastName:   "Sharma",
  fatherName: "Mahesh Sharma",
  dateOfBirth: "1992-08-14",
};

// Cycles through scenarios on repeated re-verify to let UI states be visible
const VERIFY_SCENARIOS = [
  {
    status:   "Verified",
    variant:  "success",
    headline: "Identity confirmed",
    subline:  "Name, date of birth and PAN number match NSDL records.",
  },
  {
    status:   "Mismatch",
    variant:  "warning",
    headline: "Name on PAN differs",
    subline:  `NSDL records show "Rahul Sharma" — the application name does not match. Please review and correct before proceeding.`,
  },
  {
    status:   "Mismatch",
    variant:  "warning",
    headline: "Date of birth mismatch",
    subline:  "The date of birth on record does not match NSDL data. Confirm with the customer and update before re-submitting.",
  },
  {
    status:   "NotFound",
    variant:  "error",
    headline: "PAN not found in database",
    subline:  "No records were returned for the entered PAN number. Verify the PAN and ensure the document is legible.",
  },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
const buildInitialData = (stepData = {}, lead = {}) => ({
  consentStatus:        stepData.consentStatus        || "Not Sent",
  consentLinkSentAt:    stepData.consentLinkSentAt    || "",
  consentCapturedAt:    stepData.consentCapturedAt    || "",
  panDocumentName:      stepData.panDocumentName      || "",
  panDocumentPreview:   stepData.panDocumentPreview   || "",
  panOcrStatus:         stepData.panOcrStatus         || "Pending",
  panVerificationStatus:stepData.panVerificationStatus|| "Pending",
  panNumber:            stepData.panNumber            || "",
  firstName:            stepData.firstName            || lead.firstName || "",
  lastName:             stepData.lastName             || lead.lastName  || "",
  fatherName:           stepData.fatherName           || "",
  dateOfBirth:          stepData.dateOfBirth          || "",
  mobileNumber:         stepData.mobileNumber         || lead.mobile   || "",
  email:                stepData.email               || "",
  mobileVerified:       stepData.mobileVerified       || false,
  emailVerified:        stepData.emailVerified        || false,
  panVerified:          stepData.panVerified          || false,
  nsdlReferenceNumber:  stepData.nsdlReferenceNumber  || "",
  nsdlVerifiedAt:       stepData.nsdlVerifiedAt       || "",
});

/* ── Field component ─────────────────────────────────────────────────── */
const Field = ({ label, value, placeholder, type = "text", onChange, editing, wide }) => (
  <div className={`cid-field${wide ? " wide" : ""}`}>
    <span className="cid-field-label">{label}</span>
    {editing ? (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="cid-field-input"
      />
    ) : (
      <div className="cid-field-readonly">
        {value || <span className="cid-field-empty">—</span>}
      </div>
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
  const [formData,         setFormData]         = useState(() => buildInitialData(stepData, lead));
  const [notice,           setNotice]           = useState("");
  const [isConsentWaiting, setIsConsentWaiting] = useState(false);
  const [isReadingDocument,setIsReadingDocument]= useState(false);
  const [isVerifyingPan,   setIsVerifyingPan]   = useState(false);
  const [isEditing,        setIsEditing]        = useState(false);
  const [ocrDone,          setOcrDone]          = useState(false);
  const [verifyResult,     setVerifyResult]     = useState(null);
  const [verifyAttempts,   setVerifyAttempts]   = useState(0);

  const consentCaptured = formData.consentStatus === "Captured";
  const consentSent     = formData.consentStatus === "Sent";
  const panUploaded     = Boolean(formData.panDocumentPreview);
  const panVerified     = formData.panVerificationStatus === "Verified";
  const isPdf           = formData.panDocumentName?.toLowerCase().endsWith(".pdf") ||
                          String(formData.panDocumentPreview).startsWith("data:application/pdf");
  const isImage         = String(formData.panDocumentPreview).startsWith("data:image");

  const syncParent = (updates) => updateApplicationData?.(sectionKey, updates);
  const setValues  = (updates) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      syncParent(updates);
      return next;
    });
  };
  const setField = (name, value) => setValues({ [name]: value });

  const showNotice = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const getTimestamp = () =>
    new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  /* ── Consent flow ── */
  const sendConsent = () => {
    setValues({ consentStatus: "Sent", consentLinkSentAt: getTimestamp(), consentCapturedAt: "" });
    setIsConsentWaiting(true);
  };

  useEffect(() => {
    if (!isConsentWaiting) return undefined;
    const t = window.setTimeout(() => {
      setValues({ consentStatus: "Captured", consentCapturedAt: getTimestamp() });
      setIsConsentWaiting(false);
      showNotice("Customer consent received.");
    }, 5000);
    return () => window.clearTimeout(t);
  }, [isConsentWaiting]); // eslint-disable-line

  /* ── Step status sync ── */
  useEffect(() => {
    if (consentCaptured && panVerified) {
      updateStepStatus?.("customer-identity", "Completed");
      return;
    }
    if (consentCaptured || panUploaded || ocrDone) {
      updateStepStatus?.("customer-identity", "In Progress");
    }
  }, [consentCaptured, panUploaded, ocrDone, panVerified, updateStepStatus]); // eslint-disable-line

  /* ── File upload ── */
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValues({
        panDocumentName:      file.name,
        panDocumentPreview:   reader.result,
        panOcrStatus:         "Ready",
        panVerificationStatus:"Pending",
        panVerified:          false,
        nsdlReferenceNumber:  "",
        nsdlVerifiedAt:       "",
      });
      setOcrDone(false);
      setVerifyResult(null);
      setIsEditing(false);
      saveUploadedDocument({
        applicant: "Primary Applicant", type: "Identity Proof", subtype: "PAN Card",
        source: "Customer Identity", fileName: file.name,
        fileType: file.type.startsWith("image/") ? "Image" : "PDF / Document",
        previewUrl: reader.result, ocrStatus: "Ready", verificationStatus: "Pending Review",
      });
    };
    reader.readAsDataURL(file);
  };

  /* ── OCR extraction ── */
  const extractPanDetails = () => {
    if (!panUploaded) return;
    setIsReadingDocument(true);
    window.setTimeout(() => {
      setValues({
        ...OCR_RESULT,
        panOcrStatus:         "Completed",
        panVerificationStatus:"Pending",
        panVerified:          false,
      });
      saveUploadedDocument({
        applicant: "Primary Applicant", type: "Identity Proof", subtype: "PAN Card",
        source: "Customer Identity", fileName: formData.panDocumentName,
        fileType: isImage ? "Image" : "PDF / Document",
        previewUrl: formData.panDocumentPreview, ocrStatus: "Completed", verificationStatus: "Pending Review",
      });
      setIsReadingDocument(false);
      setOcrDone(true);
      setIsEditing(true); // open for review after extraction
    }, 2800);
  };

  /* ── PAN verification ── */
  const verifyPan = () => {
    setIsVerifyingPan(true);
    setVerifyResult(null);
    window.setTimeout(() => {
      const scenarioIdx = verifyAttempts % VERIFY_SCENARIOS.length;
      const scenario    = VERIFY_SCENARIOS[scenarioIdx];
      setVerifyAttempts((n) => n + 1);

      const nsdlRef    = `NSDL-${Math.floor(100000 + Math.random() * 900000)}`;
      const verifiedAt = getTimestamp();
      const isVerified = scenario.status === "Verified";

      setValues({
        panVerificationStatus: isVerified ? "Verified" : "Mismatch",
        panVerified:           isVerified,
        nsdlReferenceNumber:   nsdlRef,
        nsdlVerifiedAt:        verifiedAt,
      });
      saveUploadedDocument({
        applicant: "Primary Applicant", type: "Identity Proof", subtype: "PAN Card",
        source: "Customer Identity", fileName: formData.panDocumentName,
        fileType: isImage ? "Image" : "PDF / Document",
        previewUrl: formData.panDocumentPreview,
        ocrStatus: "Completed",
        verificationStatus: isVerified ? "Verified" : "Mismatch",
      });
      setVerifyResult({ ...scenario, nsdlRef, verifiedAt });
      setIsVerifyingPan(false);
    }, 3000);
  };

  /* ── Remove PAN ── */
  const removePan = () => {
    setValues({
      panDocumentName: "", panDocumentPreview: "",
      panOcrStatus: "Pending", panVerificationStatus: "Pending",
      panNumber: "", firstName: lead?.firstName || "", lastName: lead?.lastName || "",
      fatherName: "", dateOfBirth: "", panVerified: false,
      nsdlReferenceNumber: "", nsdlVerifiedAt: "",
    });
    removeUploadedDocument({ applicant: "Primary Applicant", type: "Identity Proof", subtype: "PAN Card" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setOcrDone(false);
    setVerifyResult(null);
    setIsEditing(false);
  };

  /* ── Render ── */
  return (
    <div className="cid-page">

      {/* Toast */}
      {notice && (
        <div className="cid-toast">
          <CheckIcon /> {notice}
        </div>
      )}

      {/* ── Section 1: Consent ─────────────────────────────────────────── */}
      <div className="cid-section">
        <div className="cid-section-head">
          <div className="cid-step-tag">01</div>
          <div className="cid-step-meta">
            <span className="cid-step-title">Customer Consent</span>
            <span className="cid-step-sub">
              Obtain customer authorization before processing identity documents
            </span>
          </div>
          <span className={`cid-badge ${consentCaptured ? "green" : consentSent ? "amber" : "gray"}`}>
            {consentCaptured ? <CheckIcon /> : <ClockIcon />}
            {consentCaptured ? "Captured" : consentSent ? "Awaiting" : "Pending"}
          </span>
        </div>

        {/* Captured — highlighted confirmation */}
        {consentCaptured ? (
          <div className="cid-consent-confirmed">
            <div className="cid-consent-confirmed-icon">
              <BigCheckIcon />
            </div>
            <div className="cid-consent-confirmed-body">
              <div className="cid-consent-confirmed-title">Consent received</div>
              <div className="cid-consent-confirmed-sub">
                Customer authorized processing of identity documents
              </div>
              <div className="cid-consent-confirmed-meta">
                Captured {formData.consentCapturedAt}
                {formData.mobileNumber && <> &nbsp;·&nbsp; {formData.mobileNumber}</>}
              </div>
            </div>
            <button className="cid-btn-ghost small" type="button" onClick={sendConsent}>
              <RefreshIcon /> Resend
            </button>
          </div>
        ) : (
          <div className="cid-consent-send-area">
            <div>
              <div className="cid-copy-main">Send a secure consent link to the customer</div>
              <div className="cid-copy-sub">
                Delivered to{" "}
                <strong>{formData.mobileNumber || "the registered mobile number"}</strong>
              </div>
            </div>
            <button
              className="cid-btn-primary"
              type="button"
              onClick={sendConsent}
              disabled={isConsentWaiting}
            >
              {isConsentWaiting
                ? <><SpinnerIcon /> Sending…</>
                : consentSent
                  ? <><RefreshIcon /> Resend Link</>
                  : "Send Link"
              }
            </button>
          </div>
        )}

        {/* Timeline */}
        {(formData.consentLinkSentAt || formData.consentCapturedAt) && !consentCaptured && (
          <div className="cid-timeline">
            {formData.consentLinkSentAt && (
              <div className="cid-tl-item">
                <span className="cid-tl-dot amber" />
                Link sent at <b>{formData.consentLinkSentAt}</b>
              </div>
            )}
          </div>
        )}

        {/* Awaiting pulse notice */}
        {consentSent && !consentCaptured && (
          <div className="cid-alert amber">
            <SpinnerIcon />
            Awaiting customer response on their registered device
          </div>
        )}
      </div>

      {/* ── Section 2: PAN ─────────────────────────────────────────────── */}
      <div className={`cid-section${!consentCaptured ? " cid-section--locked" : ""}`}>
        <div className="cid-section-head">
          <div className="cid-step-tag">02</div>
          <div className="cid-step-meta">
            <span className="cid-step-title">PAN Verification</span>
            <span className="cid-step-sub">
              Upload PAN document, extract details, and verify with NSDL
            </span>
          </div>
          <span className={`cid-badge ${panVerified ? "green" : panUploaded ? "amber" : "gray"}`}>
            {panVerified ? <CheckIcon /> : <ClockIcon />}
            {panVerified ? "Verified" : panUploaded ? "In progress" : "Pending"}
          </span>
        </div>

        {/* Lock notice */}
        {!consentCaptured && (
          <div className="cid-alert amber compact">
            Complete consent capture above to unlock PAN verification
          </div>
        )}

        {/* Two-col layout */}
        <div className="cid-pan-layout">

          {/* ── Left: upload zone ── */}
          <div className="cid-upload-col">
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              disabled={!consentCaptured}
            />

            <div
              className={`cid-upload-zone${!panUploaded && consentCaptured ? " clickable" : ""}`}
              onClick={!panUploaded && consentCaptured ? () => fileInputRef.current?.click() : undefined}
            >
              {/* OCR scanning overlay */}
              {isReadingDocument && (
                <div className="cid-ocr-overlay">
                  <div className="cid-scan-beam" />
                  <div className="cid-scan-status">
                    <SpinnerIcon /> Reading document
                  </div>
                </div>
              )}

              {!panUploaded ? (
                <div className="cid-upload-placeholder">
                  <div className="cid-upload-icon-wrap"><UploadIcon /></div>
                  <span className="cid-upload-label">Upload PAN document</span>
                  <span className="cid-upload-hint">JPG, PNG or PDF · click to browse</span>
                </div>
              ) : isImage ? (
                <img src={formData.panDocumentPreview} alt="PAN preview" className="cid-preview-img" />
              ) : isPdf ? (
                <iframe src={formData.panDocumentPreview} title="PAN Document" className="cid-preview-pdf" />
              ) : (
                <div className="cid-upload-placeholder">
                  <DocumentIcon />
                  <span className="cid-upload-label">{formData.panDocumentName}</span>
                </div>
              )}
            </div>

            <div className="cid-upload-actions">
              <button
                className="cid-btn-secondary small"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!consentCaptured}
              >
                <UploadIcon /> {panUploaded ? "Replace" : "Upload"}
              </button>
              <button
                className="cid-btn-secondary small"
                type="button"
                onClick={extractPanDetails}
                disabled={!consentCaptured || !panUploaded || isReadingDocument}
              >
                {isReadingDocument
                  ? <><SpinnerIcon /> Reading…</>
                  : <><ScanIcon /> Extract Details</>
                }
              </button>
              {panUploaded && (
                <button className="cid-btn-ghost danger" type="button" onClick={removePan}>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="cid-form-col">
            {/* Toolbar */}
            <div className="cid-fields-toolbar">
              <span className="cid-fields-label">PAN Details</span>
              {consentCaptured && (
                <button
                  className={`cid-edit-toggle${isEditing ? " active" : ""}`}
                  type="button"
                  onClick={() => setIsEditing((v) => !v)}
                >
                  {isEditing ? <><CheckIcon /> Done</> : <><PencilIcon /> Edit</>}
                </button>
              )}
            </div>

            {/* OCR result banner */}
            {ocrDone && !isReadingDocument && (
              <div className="cid-banner info">
                <ScanIcon />
                <span>Details extracted from document — review and confirm before verifying</span>
              </div>
            )}

            {/* Verification processing banner */}
            {isVerifyingPan && (
              <div className="cid-banner info">
                <SpinnerIcon />
                <span>Verifying with NSDL database…</span>
              </div>
            )}

            {/* Verification result banner */}
            {verifyResult && !isVerifyingPan && (
              <div className={`cid-banner ${verifyResult.variant}`}>
                {verifyResult.variant === "success" ? <CheckIcon /> : <AlertIcon />}
                <div className="cid-banner-body">
                  <strong>{verifyResult.headline}</strong>
                  {verifyResult.subline && <p>{verifyResult.subline}</p>}
                  <span className="cid-banner-meta">
                    Ref {verifyResult.nsdlRef} &nbsp;·&nbsp; {verifyResult.verifiedAt}
                  </span>
                </div>
              </div>
            )}

            {/* Fields grid */}
            <div className="cid-form-grid">
              <Field label="PAN Number"           value={formData.panNumber}    placeholder="ABCDE1234F" editing={isEditing}
                onChange={(e) => setField("panNumber", e.target.value.toUpperCase())} />
              <Field label="Date of Birth"        value={formData.dateOfBirth}  type="date"             editing={isEditing}
                onChange={(e) => setField("dateOfBirth", e.target.value)} />
              <Field label="First Name"           value={formData.firstName}    placeholder="First name" editing={isEditing}
                onChange={(e) => setField("firstName", e.target.value)} />
              <Field label="Last Name"            value={formData.lastName}     placeholder="Last name"  editing={isEditing}
                onChange={(e) => setField("lastName", e.target.value)} />
              <Field label="Father / Spouse Name" value={formData.fatherName}   placeholder="As on PAN card" editing={isEditing} wide
                onChange={(e) => setField("fatherName", e.target.value)} />
              <Field label="Mobile"               value={formData.mobileNumber} placeholder="Mobile number" editing={isEditing}
                onChange={(e) => setField("mobileNumber", e.target.value)} />
              <Field label="Email"                value={formData.email}        placeholder="Email address"  editing={isEditing}
                onChange={(e) => setField("email", e.target.value)} />
            </div>

            {/* Verify row */}
            <div className="cid-verify-row">
              {panVerified ? (
                <div className="cid-verified-status">
                  <span className="cid-verified-dot" />
                  PAN verified &nbsp;·&nbsp; {formData.nsdlReferenceNumber}
                </div>
              ) : (
                <span className="cid-copy-sub">
                  {ocrDone ? "Confirm the details above, then verify" : "Extract details to proceed"}
                </span>
              )}
              <button
                className={`cid-btn-primary${panVerified ? " verified" : ""}`}
                type="button"
                onClick={verifyPan}
                disabled={!consentCaptured || isVerifyingPan || !ocrDone}
              >
                {isVerifyingPan
                  ? <><SpinnerIcon /> Verifying…</>
                  : panVerified
                    ? <><RefreshIcon /> Re-verify</>
                    : <><ShieldIcon /> Verify PAN</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CustomerIdentityPage;
