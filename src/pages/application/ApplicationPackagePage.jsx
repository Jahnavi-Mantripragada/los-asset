import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import "./ApplicationPackagePage.css";
import ApplicationFormPdf, { mockApplicationFormData } from "./ApplicationFormPdf";

/* ── Icons ───────────────────────────────────────────────────────── */
const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" /><path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" /><path d="M6 22v-4H2" />
  </svg>
);
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ── Summary data — 3 logical groups ────────────────────────────── */
const summaryGroups = [
  {
    id: "applicant",
    title: "Applicant Details",
    sub: "Identity, profile and contact information",
    rows: [
      ["Full Name",             mockApplicationFormData.applicant.fullName],
      ["PAN",                   mockApplicationFormData.applicant.pan],
      ["Mobile",                mockApplicationFormData.applicant.mobile],
      ["Email",                 mockApplicationFormData.applicant.email],
      ["Date of Birth",         mockApplicationFormData.applicant.dateOfBirth],
      ["Gender",                mockApplicationFormData.applicant.gender],
      ["Residential Status",    mockApplicationFormData.applicant.residentialStatus],
      ["Communication Address", mockApplicationFormData.address.communication],
    ],
  },
  {
    id: "loan",
    title: "Loan & Collateral",
    sub: "Loan requirement and property details",
    rows: [
      ["Product",          mockApplicationFormData.loan.product],
      ["Loan Type",        mockApplicationFormData.loan.loanType],
      ["Purpose",          mockApplicationFormData.loan.purpose],
      ["Requested Amount", mockApplicationFormData.loan.requestedAmount],
      ["Tenure",           mockApplicationFormData.loan.tenure],
      ["Property Type",    mockApplicationFormData.collateral.propertyType],
      ["Property Name",    mockApplicationFormData.collateral.propertyName],
      ["Unit Number",      mockApplicationFormData.collateral.unitNumber],
      ["Estimated Value",  mockApplicationFormData.collateral.estimatedValue],
    ],
  },
  {
    id: "income",
    title: "Income & Eligibility",
    sub: "Employment details and preliminary offer",
    rows: [
      ["Employment Type",    mockApplicationFormData.employment.employmentType],
      ["Employer",           mockApplicationFormData.employment.employerName],
      ["Designation",        mockApplicationFormData.employment.designation],
      ["Monthly Income",     mockApplicationFormData.employment.monthlyIncome],
      ["BRE Result",         mockApplicationFormData.eligibility.breResult],
      ["Decision",           mockApplicationFormData.eligibility.decision],
      ["Preliminary Amount", mockApplicationFormData.eligibility.preliminaryAmount],
      ["ROI",                mockApplicationFormData.eligibility.roi],
      ["EMI",                mockApplicationFormData.eligibility.emi],
    ],
  },
];

/* ── Generation steps ────────────────────────────────────────────── */
const genSteps = [
  { id: 1, label: "Collecting applicant data" },
  { id: 2, label: "Compiling loan & collateral" },
  { id: 3, label: "Applying declaration" },
  { id: 4, label: "Generating PDF" },
];

/* ── Component ───────────────────────────────────────────────────── */
function ApplicationPackagePage() {
  const [openSections, setOpenSections] = useState([]);           // all collapsed
  const [genStage, setGenStage]         = useState("idle");       // "idle" | "generating" | "done"
  const [completedSteps, setCompletedSteps] = useState([]);
  const [pdfUrl, setPdfUrl]             = useState("");
  const [esignStatus, setEsignStatus]   = useState("Not Sent");
  const [esignRequestId, setEsignRequestId] = useState("");

  const toggleSection = (id) =>
    setOpenSections((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const generatePdf = async () => {
    setGenStage("generating");
    setCompletedSteps([]);

    // Start real PDF gen
    const pdfPromise = pdf(<ApplicationFormPdf data={mockApplicationFormData} />).toBlob();

    // Animate steps
    genSteps.forEach((_, idx) => {
      setTimeout(() => setCompletedSteps((p) => [...p, idx + 1]), (idx + 1) * 380);
    });

    // Wait for PDF + min animation time
    const [blob] = await Promise.all([pdfPromise, new Promise((r) => setTimeout(r, 1700))]);

    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setGenStage("done");

    // Auto-open
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const viewPdf     = () => pdfUrl && window.open(pdfUrl, "_blank", "noopener,noreferrer");
  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${mockApplicationFormData.applicationNumber}_Application_Form.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sendForEsign = () => {
    if (!pdfUrl) return;
    setEsignStatus("Sending…");
    setTimeout(() => {
      const id = `ESIGN-${Math.floor(100000 + Math.random() * 900000)}`;
      setEsignStatus("Sent for eSign");
      setEsignRequestId(id);
      setTimeout(() => setEsignStatus("Signed / Received"), 3500);
    }, 1300);
  };

  const activeStep = completedSteps.length < genSteps.length ? completedSteps.length + 1 : null;

  return (
    <div className="pkg-page">
      <div className="pkg-panel">

        {/* ── Application Summary ── */}
        <div className="pkg-section">
          <div className="pkg-section-head no-btn">
            <span className="pkg-section-title">Application Summary</span>
            <span className="pkg-section-sub">Review details before generating the application form</span>
          </div>

          <div className="pkg-accordion-list">
            {summaryGroups.map((group) => {
              const isOpen = openSections.includes(group.id);
              return (
                <div className={`pkg-accordion${isOpen ? " open" : ""}`} key={group.id}>
                  <button type="button" className="pkg-acc-head" onClick={() => toggleSection(group.id)}>
                    <div className="pkg-acc-left">
                      <span className={`pkg-acc-chevron${isOpen ? " open" : ""}`}><ChevronIcon /></span>
                      <div>
                        <span className="pkg-acc-title">{group.title}</span>
                        <span className="pkg-acc-sub">{group.sub}</span>
                      </div>
                    </div>
                    <span className="pkg-acc-count">{group.rows.length} fields</span>
                  </button>

                  {isOpen && (
                    <div className="pkg-acc-body">
                      <div className="pkg-field-grid-3">
                        {group.rows.map(([label, value]) => (
                          <div className="pkg-field" key={label}>
                            <span className="pkg-field-label">{label}</span>
                            <div className="pkg-field-ro">{value || "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pkg-divider" />

        {/* ── Application Form ── */}
        <div className="pkg-section">
          <div className="pkg-section-head no-btn">
            <span className="pkg-section-title">Application Form</span>
            <span className="pkg-section-sub">Generate, review and send for eSign</span>
          </div>

          {/* ── Idle ── */}
          {genStage === "idle" && (
            <div className="pkg-form-idle">
              <div className="pkg-form-idle-info">
                <div className="pkg-form-idle-icon"><FileIcon /></div>
                <div>
                  <span className="pkg-form-idle-title">Application form not yet generated</span>
                  <p>Generates a professional PDF with applicant, loan, collateral and eligibility details, along with declaration.</p>
                </div>
              </div>
              <button type="button" className="pkg-gen-btn" onClick={generatePdf}>
                <FileIcon /> Generate Application Form
              </button>
            </div>
          )}

          {/* ── Generating ── */}
          {genStage === "generating" && (
            <div className="pkg-gen-progress">
              <div className="pkg-gen-steps">
                {genSteps.map((step, idx) => {
                  const done   = completedSteps.includes(step.id);
                  const active = !done && activeStep === step.id;
                  return (
                    <div key={step.id} className={`pkg-gen-step${done ? " done" : active ? " active" : ""}`}>
                      <div className="pkg-gen-indicator">
                        {done   ? <CheckIcon />              : null}
                        {active ? <span className="pkg-spinner" /> : null}
                      </div>
                      {idx < genSteps.length - 1 && (
                        <div className={`pkg-gen-line${done ? " done" : ""}`} />
                      )}
                      <span className="pkg-gen-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="pkg-gen-hint">Building your application form…</p>
            </div>
          )}

          {/* ── Done ── */}
          {genStage === "done" && (
            <div className="pkg-form-done">
              {/* Success row */}
              <div className="pkg-form-success">
                <div className="pkg-form-success-icon"><CheckIcon /></div>
                <div>
                  <span className="pkg-form-filename">
                    {mockApplicationFormData.applicationNumber}_Application_Form.pdf
                  </span>
                  <span className="pkg-form-success-meta">Generated · opened in new tab</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pkg-form-actions">
                <button type="button" className="pkg-action-btn" onClick={viewPdf}>
                  <EyeIcon /> View Form
                </button>
                <button type="button" className="pkg-action-btn" onClick={downloadPdf}>
                  <DownloadIcon /> Download
                </button>
                <button type="button" className="pkg-action-btn ghost" onClick={generatePdf}>
                  <RefreshIcon /> Regenerate
                </button>
              </div>

              {/* eSign row */}
              <div className="pkg-esign-row">
                <div className="pkg-esign-info">
                  <span className="pkg-esign-label">eSign</span>
                  <span className={`pkg-esign-status${esignStatus === "Signed / Received" ? " signed" : esignStatus.includes("Sent") ? " sent" : ""}`}>
                    {esignStatus}
                  </span>
                  {esignRequestId && (
                    <span className="pkg-esign-id">Request ID: {esignRequestId}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="pkg-esign-btn"
                  onClick={sendForEsign}
                  disabled={esignStatus === "Sending…" || esignStatus === "Signed / Received"}
                >
                  <SendIcon />
                  {esignStatus === "Sending…" ? "Sending…" : "Send for eSign"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ApplicationPackagePage;
