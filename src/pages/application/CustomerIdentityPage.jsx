import { useEffect, useRef, useState } from "react";
import "./CustomerIdentityPage.css";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.7">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8 12 3 7 8" />
    <path d="M12 3v12" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 12a9 9 0 0 1-15.2 6.5" />
    <path d="M3 12A9 9 0 0 1 18.2 5.5" />
    <path d="M18 3v5h-5" />
    <path d="M6 21v-5h5" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-5" />
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M4 7V5a1 1 0 0 1 1-1h2" />
    <path d="M17 4h2a1 1 0 0 1 1 1v2" />
    <path d="M20 17v2a1 1 0 0 1-1 1h-2" />
    <path d="M7 20H5a1 1 0 0 1-1-1v-2" />
    <path d="M7 12h10" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
);

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

  const syncParent = (updates) => {
    updateApplicationData?.(sectionKey, updates);
  };

  const setValues = (updates) => {
    setFormData((previous) => {
      const updated = { ...previous, ...updates };
      syncParent(updates);
      return updated;
    });
  };

  const setField = (fieldName, value) => {
    setValues({ [fieldName]: value });
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const getTimestamp = () =>
    new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

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

    const timer = window.setTimeout(() => {
      setValues({
        consentStatus: "Captured",
        consentCapturedAt: getTimestamp(),
      });

      setIsConsentWaiting(false);
      showNotice("Customer consent captured.");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [isConsentWaiting]);

  useEffect(() => {
    if (consentCaptured && panVerified) {
      updateStepStatus?.("customer-identity", "Completed");
      return;
    }

    if (consentCaptured || panUploaded || ocrCompleted) {
      updateStepStatus?.("customer-identity", "In Progress");
    }
  }, [consentCaptured, panUploaded, ocrCompleted, panVerified, updateStepStatus]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      setValues({
        panDocumentName: selectedFile.name,
        panDocumentPreview: reader.result,
        panOcrStatus: "Ready",
        panVerificationStatus: "Pending",
        panVerified: false,
        nsdlReferenceNumber: "",
        nsdlVerifiedAt: "",
      });

      showNotice("PAN document uploaded.");
    };

    reader.readAsDataURL(selectedFile);
  };

  const extractPanDetails = () => {
    if (!panUploaded) {
      showNotice("Upload PAN document before reading details.");
      return;
    }

    setIsReadingDocument(true);

    window.setTimeout(() => {
      setValues({
        ...OCR_RESULT,
        panOcrStatus: "Completed",
        panVerificationStatus: "Pending",
        panVerified: false,
      });

      setIsReadingDocument(false);
      showNotice("PAN details populated.");
    }, 1000);
  };

  const verifyPan = () => {
    if (!formData.panNumber || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      showNotice("Enter PAN number, name and date of birth before verification.");
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

  const removePan = () => {
    setValues({
      panDocumentName: "",
      panDocumentPreview: "",
      panOcrStatus: "Pending",
      panVerificationStatus: "Pending",
      panNumber: "",
      firstName: lead?.firstName || "",
      lastName: lead?.lastName || "",
      fatherName: "",
      dateOfBirth: "",
      panVerified: false,
      nsdlReferenceNumber: "",
      nsdlVerifiedAt: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    showNotice("PAN details cleared.");
  };

  return (
    <div className="identity-clean-page">
      {notice && (
        <div className="identity-toast">
          <CheckIcon />
          {notice}
        </div>
      )}

      <header className="identity-clean-header">
        <div>
          <span>Customer Identity</span>
          <h3>Consent and PAN Verification</h3>
          <p>Complete consent capture and PAN validation before proceeding with the application.</p>
        </div>
      </header>

      <section className="identity-clean-section">
        <div className="identity-section-title-row">
          <div>
            <span className="identity-step-label">01</span>
            <h4>Consent Capture</h4>
          </div>

          <span className={`identity-status-pill ${consentCaptured ? "success" : consentSent ? "warning" : "neutral"}`}>
            {consentCaptured ? <CheckIcon /> : <ClockIcon />}
            {consentCaptured ? "Captured" : consentSent ? "Sent" : "Pending"}
          </span>
        </div>

        <div className="consent-clean-row">
          <div className="consent-copy">
            <strong>Send consent request to customer</strong>
            <p>
              The customer will receive a secure link on{" "}
              <b>{formData.mobileNumber || "registered mobile"}</b>.
            </p>
          </div>

          <button type="button" className="identity-primary-btn" onClick={sendConsent}>
            {consentSent || consentCaptured ? <RefreshIcon /> : null}
            {consentSent || consentCaptured ? "Resend Link" : "Send Link"}
          </button>
        </div>

        {(formData.consentLinkSentAt || formData.consentCapturedAt) && (
          <div className="consent-clean-meta">
            {formData.consentLinkSentAt && (
              <span>
                Link sent <strong>{formData.consentLinkSentAt}</strong>
              </span>
            )}

            {formData.consentCapturedAt && (
              <span>
                Consent captured <strong>{formData.consentCapturedAt}</strong>
              </span>
            )}
          </div>
        )}

        {consentSent && !consentCaptured && (
          <div className="identity-note warning">
            <ClockIcon />
            Awaiting customer confirmation. Consent will be captured shortly.
          </div>
        )}

        {consentCaptured && (
          <div className="identity-note success">
            <CheckIcon />
            Consent captured. PAN processing is enabled.
          </div>
        )}
      </section>

      <section className={`identity-clean-section ${!consentCaptured ? "section-muted" : ""}`}>
        <div className="identity-section-title-row">
          <div>
            <span className="identity-step-label">02</span>
            <h4>PAN Capture and Verification</h4>
          </div>

          <span className={`identity-status-pill ${panVerified ? "success" : panUploaded ? "warning" : "neutral"}`}>
            {panVerified ? <CheckIcon /> : <ClockIcon />}
            {panVerified ? "Verified" : panUploaded ? "In Progress" : "Pending"}
          </span>
        </div>

        {!consentCaptured && (
          <div className="identity-note warning compact">
            Capture consent to enable PAN upload and verification.
          </div>
        )}

        <div className="pan-clean-layout">
          <div className="pan-clean-upload">
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              disabled={!consentCaptured}
            />

            <div className="pan-clean-preview">
              {!panUploaded ? (
                <button
                  type="button"
                  className="pan-upload-button"
                  onClick={openFilePicker}
                  disabled={!consentCaptured}
                >
                  <UploadIcon />
                  <strong>Upload PAN</strong>
                  <span>Image or PDF</span>
                </button>
              ) : String(formData.panDocumentPreview).startsWith("data:image") ? (
                <img src={formData.panDocumentPreview} alt="PAN document preview" />
              ) : (
                <div className="pan-file-state">
                  <FileIcon />
                  <strong>PDF uploaded</strong>
                  <span>{formData.panDocumentName}</span>
                </div>
              )}
            </div>

            <div className="pan-clean-actions">
              <button
                type="button"
                className="identity-secondary-btn"
                onClick={openFilePicker}
                disabled={!consentCaptured}
              >
                <UploadIcon />
                {panUploaded ? "Replace" : "Upload"}
              </button>

              <button
                type="button"
                className="identity-secondary-btn"
                onClick={extractPanDetails}
                disabled={!consentCaptured || !panUploaded || isReadingDocument}
              >
                <ScanIcon />
                {isReadingDocument ? "Reading..." : "Read Details"}
              </button>

              {panUploaded && (
                <button type="button" className="identity-link-btn danger" onClick={removePan}>
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="pan-clean-form">
            <div className="identity-form-grid">
              <label>
                <span>PAN Number</span>
                <input
                  value={formData.panNumber}
                  placeholder="ABCDE1234F"
                  onChange={(event) => setField("panNumber", event.target.value.toUpperCase())}
                  disabled={!consentCaptured}
                />
              </label>

              <label>
                <span>Date of Birth</span>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(event) => setField("dateOfBirth", event.target.value)}
                  disabled={!consentCaptured}
                />
              </label>

              <label>
                <span>First Name</span>
                <input
                  value={formData.firstName}
                  placeholder="First name"
                  onChange={(event) => setField("firstName", event.target.value)}
                  disabled={!consentCaptured}
                />
              </label>

              <label>
                <span>Last Name</span>
                <input
                  value={formData.lastName}
                  placeholder="Last name"
                  onChange={(event) => setField("lastName", event.target.value)}
                  disabled={!consentCaptured}
                />
              </label>

              <label className="wide">
                <span>Father / Spouse Name</span>
                <input
                  value={formData.fatherName}
                  placeholder="As printed on PAN"
                  onChange={(event) => setField("fatherName", event.target.value)}
                  disabled={!consentCaptured}
                />
              </label>

              <label>
                <span>Mobile</span>
                <input
                  value={formData.mobileNumber}
                  placeholder="Mobile number"
                  onChange={(event) => setField("mobileNumber", event.target.value)}
                  disabled={!consentCaptured}
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  value={formData.email}
                  placeholder="Email address"
                  onChange={(event) => setField("email", event.target.value)}
                  disabled={!consentCaptured}
                />
              </label>
            </div>

            <div className="pan-verification-row">
              <div>
                <strong>{panVerified ? "PAN verified successfully" : "PAN verification pending"}</strong>
                <p>
                  {panVerified
                    ? `Reference ${formData.nsdlReferenceNumber} · ${formData.nsdlVerifiedAt}`
                    : "Verify PAN after confirming the captured details."}
                </p>
              </div>

              <button
                type="button"
                className="identity-primary-btn"
                onClick={verifyPan}
                disabled={!consentCaptured || isVerifyingPan}
              >
                <ShieldIcon />
                {isVerifyingPan ? "Verifying..." : panVerified ? "Re-Verify PAN" : "Verify PAN"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerIdentityPage;