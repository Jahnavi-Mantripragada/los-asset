import { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import "./ApplicationPackagePage.css";
import ApplicationFormPdf, { mockApplicationFormData } from "./ApplicationFormPdf";

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" />
    <path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" />
    <path d="M6 22v-4H2" />
  </svg>
);

const accordions = [
  {
    id: "identity",
    title: "Customer Identity",
    rows: [
      ["Applicant Name", mockApplicationFormData.applicant.fullName],
      ["PAN", mockApplicationFormData.applicant.pan],
      ["Mobile", mockApplicationFormData.applicant.mobile],
      ["Email", mockApplicationFormData.applicant.email],
      ["PAN Status", "Verified"],
    ],
  },
  {
    id: "profile",
    title: "Applicant Profile",
    rows: [
      ["Gender", mockApplicationFormData.applicant.gender],
      ["Date of Birth", mockApplicationFormData.applicant.dateOfBirth],
      ["Father's Name", mockApplicationFormData.applicant.fatherName],
      ["Residential Status", mockApplicationFormData.applicant.residentialStatus],
      ["Communication Address", mockApplicationFormData.address.communication],
    ],
  },
  {
    id: "employment",
    title: "Income & Employment",
    rows: [
      ["Employment Type", mockApplicationFormData.employment.employmentType],
      ["Employer", mockApplicationFormData.employment.employerName],
      ["Designation", mockApplicationFormData.employment.designation],
      ["Monthly Income", mockApplicationFormData.employment.monthlyIncome],
      ["Office Address", mockApplicationFormData.employment.officeAddress],
    ],
  },
  {
    id: "loan",
    title: "Loan Requirement",
    rows: [
      ["Product", mockApplicationFormData.loan.product],
      ["Loan Type", mockApplicationFormData.loan.loanType],
      ["Purpose", mockApplicationFormData.loan.purpose],
      ["Requested Amount", mockApplicationFormData.loan.requestedAmount],
      ["Tenure", mockApplicationFormData.loan.tenure],
    ],
  },
  {
    id: "collateral",
    title: "Collateral Details",
    rows: [
      ["Property Type", mockApplicationFormData.collateral.propertyType],
      ["Property Name", mockApplicationFormData.collateral.propertyName],
      ["Unit Number", mockApplicationFormData.collateral.unitNumber],
      ["Estimated Value", mockApplicationFormData.collateral.estimatedValue],
      ["Legal / Technical", `${mockApplicationFormData.collateral.legalStatus} / ${mockApplicationFormData.collateral.technicalStatus}`],
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & Preliminary Offer",
    rows: [
      ["BRE Result", mockApplicationFormData.eligibility.breResult],
      ["Decision", mockApplicationFormData.eligibility.decision],
      ["Preliminary Amount", mockApplicationFormData.eligibility.preliminaryAmount],
      ["ROI", mockApplicationFormData.eligibility.roi],
      ["EMI", mockApplicationFormData.eligibility.emi],
    ],
  },
];

function getTimestamp() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApplicationPackagePage() {
  const [openSections, setOpenSections] = useState(["identity", "loan", "eligibility"]);
  const [formStatus, setFormStatus] = useState("Not Generated");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [esignStatus, setEsignStatus] = useState("Not Sent");
  const [esignRequestId, setEsignRequestId] = useState("");
  const [timeline, setTimeline] = useState([
    {
      id: 1,
      title: "Application package opened",
      desc: "Review application details and generate application form.",
      time: "Today, 11:10 AM",
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

  const toggleSection = (sectionId) => {
    setOpenSections((previous) =>
      previous.includes(sectionId)
        ? previous.filter((id) => id !== sectionId)
        : [...previous, sectionId]
    );
  };

  const generatePdf = async () => {
    setIsGenerating(true);

    const blob = await pdf(
      <ApplicationFormPdf data={mockApplicationFormData} />
    ).toBlob();

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    const nextUrl = URL.createObjectURL(blob);

    setPdfUrl(nextUrl);
    setFormStatus("Generated");
    setIsGenerating(false);

    addTimeline(
      "Application form generated",
      "Professional application form PDF generated using mock application data.",
      "success"
    );
  };

  const viewPdf = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${mockApplicationFormData.applicationNumber}_Application_Form.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendForEsign = () => {
    if (!pdfUrl) return;

    setEsignStatus("Sending...");

    window.setTimeout(() => {
      const requestId = `ESIGN-${Math.floor(100000 + Math.random() * 900000)}`;

      setEsignStatus("Sent for eSign");
      setEsignRequestId(requestId);

      addTimeline(
        "Sent for eSign",
        `Application form sent to customer for eSign. Request ID: ${requestId}`,
        "success"
      );

      window.setTimeout(() => {
        setEsignStatus("Signed / Received");

        addTimeline(
          "Signed application received",
          "Mock eSign completed and signed application form received.",
          "success"
        );
      }, 3500);
    }, 1300);
  };

  const packageStats = useMemo(() => {
    return {
      sections: accordions.length,
      generated: formStatus === "Generated" ? 1 : 0,
      documents: mockApplicationFormData.documents.length,
      uploadedDocs: mockApplicationFormData.documents.filter((doc) => doc.status === "Uploaded").length,
    };
  }, [formStatus]);

  return (
    <div className="application-package-page">
      <section className="pkg-hero-card">
        <div className="pkg-hero-left">
          <div className="pkg-icon-wrap">
            <FileIcon />
          </div>
          <div>
            <span className="pkg-eyebrow">Step 09</span>
            <h3>Application Package & eSign</h3>
            <p>
              Review application details, generate a professional PDF application form, view/download it and send for eSign.
            </p>
          </div>
        </div>

        <div className="pkg-completion-box">
          <strong>{formStatus}</strong>
          <span>Application Form</span>
        </div>
      </section>

      <section className="pkg-kpi-grid">
        <div className="pkg-kpi-card">
          <span>Review Sections</span>
          <strong>{packageStats.sections}</strong>
        </div>

        <div className="pkg-kpi-card success">
          <span>Form Generated</span>
          <strong>{packageStats.generated ? "Yes" : "No"}</strong>
        </div>

        <div className="pkg-kpi-card">
          <span>Documents</span>
          <strong>{packageStats.uploadedDocs}/{packageStats.documents}</strong>
        </div>

        <div className={`pkg-kpi-card ${esignStatus.includes("Signed") ? "success" : esignStatus.includes("Sent") ? "warning" : ""}`}>
          <span>eSign Status</span>
          <strong>{esignStatus}</strong>
        </div>
      </section>

      <section className="pkg-layout">
        <main className="pkg-main">
          <section className="pkg-card">
            <div className="pkg-section-header">
              <div>
                <span className="pkg-eyebrow">Read-only Review</span>
                <h4>Application Summary</h4>
              </div>
              <span className="pkg-status-pill blue">Mock Data</span>
            </div>

            <div className="pkg-accordion-list">
              {accordions.map((section) => {
                const isOpen = openSections.includes(section.id);

                return (
                  <article className="pkg-accordion" key={section.id}>
                    <button
                      type="button"
                      className="pkg-accordion-head"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div>
                        <span>{isOpen ? "−" : "+"}</span>
                        <strong>{section.title}</strong>
                      </div>
                      <small>{section.rows.length} fields</small>
                    </button>

                    {isOpen && (
                      <div className="pkg-accordion-body">
                        {section.rows.map(([label, value]) => (
                          <div className="pkg-review-field" key={label}>
                            <span>{label}</span>
                            <strong>{value || "—"}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pkg-card">
            <div className="pkg-section-header">
              <div>
                <span className="pkg-eyebrow">Generated Form</span>
                <h4>Application Form PDF</h4>
              </div>

              <span className={`pkg-status-pill ${formStatus === "Generated" ? "green" : "gray"}`}>
                {formStatus}
              </span>
            </div>

            <div className="pkg-form-panel">
              <div className="pkg-form-preview">
                <FileIcon />
                <strong>
                  {formStatus === "Generated"
                    ? `${mockApplicationFormData.applicationNumber}_Application_Form.pdf`
                    : "Application form not generated"}
                </strong>
                <p>
                  Generate a professional read-only application form with applicant details,
                  loan requirement, collateral, preliminary offer and declaration.
                </p>
              </div>

              <div className="pkg-form-actions">
                <button
                  type="button"
                  className="pkg-primary-btn"
                  onClick={generatePdf}
                  disabled={isGenerating}
                >
                  {isGenerating ? <RefreshIcon /> : <FileIcon />}
                  {isGenerating ? "Generating..." : formStatus === "Generated" ? "Regenerate Form" : "Generate Application Form"}
                </button>

                <button
                  type="button"
                  className="pkg-secondary-btn"
                  onClick={viewPdf}
                  disabled={!pdfUrl}
                >
                  <EyeIcon />
                  View Form
                </button>

                <button
                  type="button"
                  className="pkg-secondary-btn"
                  onClick={downloadPdf}
                  disabled={!pdfUrl}
                >
                  <DownloadIcon />
                  Download
                </button>

                <button
                  type="button"
                  className="pkg-esign-btn"
                  onClick={sendForEsign}
                  disabled={!pdfUrl || esignStatus === "Sending..." || esignStatus === "Signed / Received"}
                >
                  <SendIcon />
                  {esignStatus === "Sending..." ? "Sending..." : "Send for eSign"}
                </button>
              </div>
            </div>
          </section>
        </main>

        <aside className="pkg-side">
          <section className="pkg-side-card">
            <h4>Package Readiness</h4>

            <div className="pkg-checklist">
              <div className="done">
                <span><CheckIcon /></span>
                <strong>Application data available</strong>
              </div>

              <div className={formStatus === "Generated" ? "done" : ""}>
                <span>{formStatus === "Generated" ? <CheckIcon /> : "•"}</span>
                <strong>Application form generated</strong>
              </div>

              <div className={esignStatus === "Sent for eSign" || esignStatus === "Signed / Received" ? "done" : ""}>
                <span>{esignStatus === "Sent for eSign" || esignStatus === "Signed / Received" ? <CheckIcon /> : "•"}</span>
                <strong>Sent for eSign</strong>
              </div>

              <div className={esignStatus === "Signed / Received" ? "done" : ""}>
                <span>{esignStatus === "Signed / Received" ? <CheckIcon /> : "•"}</span>
                <strong>Signed form received</strong>
              </div>
            </div>
          </section>

          <section className="pkg-side-card soft">
            <h4>eSign Details</h4>

            <div className="pkg-summary-list">
              <div>
                <span>Status</span>
                <strong>{esignStatus}</strong>
              </div>
              <div>
                <span>Request ID</span>
                <strong>{esignRequestId || "Not generated"}</strong>
              </div>
              <div>
                <span>Recipient</span>
                <strong>{mockApplicationFormData.applicant.mobile}</strong>
              </div>
              <div>
                <span>Mode</span>
                <strong>Mock eSign</strong>
              </div>
            </div>
          </section>

          <section className="pkg-side-card soft">
            <h4>Activity</h4>

            <div className="pkg-timeline">
              {timeline.map((item) => (
                <div key={item.id} className={`pkg-timeline-item ${item.type}`}>
                  <span>{item.type === "success" ? <CheckIcon /> : <FileIcon />}</span>
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

export default ApplicationPackagePage;