import { useMemo, useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ApplicationOnboardingPage.css";
import CustomerIdentityPage from "./CustomerIdentityPage";
import ApplicantProfilePage from "./ApplicantProfilePage";
import IncomeEmploymentPage from "./IncomeEmploymentPage";
import CoApplicantsPage from "./CoApplicantsPage";
import DocumentsPage from "./DocumentsPage";
import CollateralPage from "./CollateralPage";
import LoanRequirementPage from "./LoanRequirementPage";
import EligibilityOfferPage from "./EligibilityOfferPage";
import ApplicationPackagePage from "./ApplicationPackagePage";
import FeesSubmissionPage from "./FeesSubmissionPage";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8" /><path d="M7 3v5h8" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.8">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" />
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" />
  </svg>
);
const RupeeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12" /><path d="M6 8h12" /><path d="M6 13h7a5 5 0 0 0 0-10" /><path d="m6 13 8 8" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M3 13h18" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: "customer-identity",  number: "01", title: "Customer Identity",   description: "PAN, mobile, email and KYC verification",          icon: ShieldIcon,    component: CustomerIdentityPage,   dataKey: "customerIdentity"  },
  { id: "applicant-profile",  number: "02", title: "Applicant Profile",   description: "Personal, residential and demographic details",    icon: UserIcon,      component: ApplicantProfilePage,   dataKey: "applicantProfile"  },
  { id: "income-employment",  number: "03", title: "Income & Employment", description: "Salary, business income and obligation details",   icon: BriefcaseIcon, component: IncomeEmploymentPage,   dataKey: "incomeEmployment"  },
  { id: "co-applicants",      number: "04", title: "Co-Applicants",       description: "Add co-applicants, guarantors and relationships",  icon: UserIcon,      component: CoApplicantsPage,       dataKey: "coApplicants"      },
  { id: "documents",          number: "05", title: "Documents",           description: "Document checklist, upload and OCR status",        icon: FileIcon,      component: DocumentsPage,          dataKey: "documents"         },
  { id: "collateral",         number: "06", title: "Collateral",          description: "Property, project and security information",       icon: HomeIcon,      component: CollateralPage,         dataKey: "collateral"        },
  { id: "loan-requirement",   number: "07", title: "Loan Requirement",    description: "Product, loan type, purpose, amount and tenure",   icon: RupeeIcon,     component: LoanRequirementPage,    dataKey: "loanRequirement"   },
  { id: "eligibility-offer",  number: "08", title: "Eligibility & Offer", description: "Eligibility, FOIR, LTV and recommended offer",    icon: CheckIcon,     component: EligibilityOfferPage,   dataKey: "eligibilityOffer"  },
  { id: "application-package",number: "09", title: "Application Package", description: "Generate, review and sign application form",       icon: FileIcon,      component: ApplicationPackagePage, dataKey: "applicationPackage"},
  { id: "fees-submission",    number: "10", title: "Fees & Submission",   description: "Payment, final review and submit to credit",       icon: RupeeIcon,     component: FeesSubmissionPage,     dataKey: "feesSubmission"    },
];

const INITIAL_STATUSES = STEPS.reduce((acc, step, i) => {
  acc[step.id] = i === 0 ? "In Progress" : "Not Started";
  return acc;
}, {});

const INITIAL_APPLICATION_DATA = {
  customerIdentity:   { panNumber: "", mobileNumber: "", email: "", dateOfBirth: "", mobileVerified: false, emailVerified: false, panVerified: false },
  applicantProfile:   { firstName: "", lastName: "", applicantType: "", applicantCategory: "", residentialStatus: "", addressLine1: "", city: "", state: "", pincode: "" },
  incomeEmployment:   { employmentType: "", employerName: "", monthlyGrossSalary: "", monthlyObligations: "", businessName: "", annualIncome: "" },
  coApplicants:       [],
  documents:          [],
  collateral:         { propertyIdentified: "", propertyType: "", projectName: "", propertyValue: "", collateralAddress: "" },
  loanRequirement:    { product: "", loanType: "", loanPurpose: "", requestedLoanAmount: "", loanTenureYears: "", balanceTransferBank: "" },
  eligibilityOffer:   { eligibilityStatus: "", eligibleAmount: "", foir: "", ltv: "", recommendedOffer: "" },
  applicationPackage: { applicationFormGenerated: false, signedFormUploaded: false, eSignStatus: "" },
  feesSubmission:     { processingFeeAmount: "", paymentStatus: "", submissionStatus: "" },
};

const STATUS_CLASS = {
  Completed: "completed",
  "In Progress": "in-progress",
  "Pending Validation": "pending",
  "Not Started": "not-started",
  "Needs Rework": "needs-rework",
  Blocked: "blocked",
};

// ─── Component ───────────────────────────────────────────────────────────────
function ApplicationOnboardingPage({ leads = [], onLogout }) {
  const navigate  = useNavigate();
  const { leadId } = useParams();

  const [activeStepId, setActiveStepId] = useState(STEPS[0].id);
  const [stepStatuses, setStepStatuses] = useState(INITIAL_STATUSES);
  const [applicationData, setApplicationData] = useState(INITIAL_APPLICATION_DATA);

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  fetchLead();
}, [leadId]);

const fetchLead = async () => {
  try {
    const response = await fetch(
      `https://xx8ep3p2ue.execute-api.ap-south-1.amazonaws.com/prod/leads/${leadId}`
    );

    const data = await response.json();

    if (data.success) {
      setLead({
        id: data.data.leadnumber,
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        mobile: data.data.mobile,
        email: data.data.email,
        product: data.data.product,
        source: data.data.source || "Direct",
        owner: data.data.owner || "Sales User",
        status: data.data.stage || "New",
      });
    }
  } catch (error) {
    console.error("Fetch Lead Error:", error);
  } finally {
    setLoading(false);
  }
  };

  const activeStepIndex    = STEPS.findIndex((s) => s.id === activeStepId);
  const activeStep         = STEPS[activeStepIndex] ?? STEPS[0];
  const ActiveStepComponent = activeStep.component;
  const activeStatus       = stepStatuses[activeStep.id];
  const completedCount     = Object.values(stepStatuses).filter((s) => s === "Completed").length;
  const progressPercent    = Math.round((completedCount / STEPS.length) * 100);
  const isLastStep         = activeStepIndex === STEPS.length - 1;

  const application = lead
  ? {
      id: `APP-${lead.id.replace("LD-", "")}`,
      leadId: lead.id,
      applicantName: `${lead.firstName || ""} ${lead.lastName || ""}`,
      product: lead.product || "Home Loan",
      source: lead.source || "Direct",
      owner: lead.owner || "Sales User",
      requestedAmount:
        applicationData.loanRequirement.requestedLoanAmount || "₹42,00,000",
      createdDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }
  : null;

  const updateApplicationData = (section, values) => {
    setApplicationData((prev) => {
      const existing = prev[section];
      if (Array.isArray(existing)) return { ...prev, [section]: values };
      return { ...prev, [section]: { ...existing, ...values } };
    });
  };

  const replaceApplicationDataSection = (section, values) => {
    setApplicationData((prev) => ({ ...prev, [section]: values }));
  };

  const updateStepStatus = (stepId, status) => {
    setStepStatuses((prev) => ({ ...prev, [stepId]: status }));
  };

  const getCurrentStepData = () => applicationData[activeStep.dataKey];

  const stepStats = useMemo(
    () => [
      { label: "Application No.", value: application?.id           || "APP-2026-000184"           },
      { label: "Lead No.",        value: application?.leadId       || "LD-2026-00491"              },
      { label: "Applicant",       value: application?.applicantName || "Aarav Mehta"              },
      { label: "Product",         value: applicationData.loanRequirement.product || application?.product || "Home Loan" },
      { label: "Loan Amount",     value: applicationData.loanRequirement.requestedLoanAmount || application?.requestedAmount || "₹42,00,000" },
      { label: "Stage",           value: completedCount === STEPS.length ? "Submitted" : "In Progress" },
    ],
    [application, applicationData.loanRequirement.product, applicationData.loanRequirement.requestedLoanAmount, completedCount]
  );

  const handleSaveDraft = () => {
    console.log("Draft saved:", { lead, application, applicationData, stepStatuses });
  };

  const saveAndContinue = () => {
    setStepStatuses((prev) => {
      const next = { ...prev, [activeStep.id]: "Completed" };
      if (!isLastStep) {
        const nextId = STEPS[activeStepIndex + 1].id;
        if (next[nextId] === "Not Started") next[nextId] = "In Progress";
      }
      return next;
    });
    if (!isLastStep) setActiveStepId(STEPS[activeStepIndex + 1].id);
  };

  const previousStep = () => {
    if (activeStepIndex > 0) setActiveStepId(STEPS[activeStepIndex - 1].id);
  };

  const goToStep    = (stepId) => setActiveStepId(stepId);
  const handleBack  = () => navigate(`/leads/${leadId}`);
  const handleLogout = async () => {
    if (onLogout) await onLogout();
    navigate("/login", { replace: true });
  };

  if (loading) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
      }}
    >
      Loading application...
    </div>
  );
  }
  // ── Not-found fallback ─────────────────────────────────────────────────────
  if (!lead) {
    return (
      <div className="app-onboarding-page">
        <div className="app-header-zone">
          <header className="app-onboarding-topbar">
            <div className="app-topbar-left">
              <button className="back-button" type="button" onClick={handleBack}><BackIcon /></button>
              <h1 className="topbar-title">Application Onboarding</h1>
            </div>
          </header>
        </div>
        <main className="app-onboarding-shell">
          <p style={{ padding: "2rem", color: "var(--los-muted)" }}>
            Lead not found. The lead with ID &quot;{leadId}&quot; does not exist.
          </p>
        </main>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="app-onboarding-page">

      {/* ── Unified sticky header zone ── */}
      <div className="app-header-zone">

        {/* Primary bar — blue gradient */}
        <header className="app-onboarding-topbar">
          <div className="app-topbar-left">
            <button className="back-button" type="button" onClick={handleBack}>
              <BackIcon />
            </button>
            <h1 className="topbar-title">Application Onboarding</h1>
          </div>
          <div className="app-topbar-right">
            <button className="record-action-logout" type="button" onClick={handleLogout}>
              <LogoutIcon /> Sign Out
            </button>
          </div>
        </header>

        {/* Info strip — white, directly below */}
        <div className="application-summary-strip">
          {stepStats.map((item) => (
            <div className="summary-item" key={item.label}>
              <span className="summary-label">{item.label}</span>
              <strong className="summary-value">{item.value}</strong>
            </div>
          ))}
          <div className="summary-item summary-progress-item">
            <div className="summary-progress-header">
              <span className="summary-label">Completion</span>
              <strong className="summary-value">{progressPercent}% &nbsp;·&nbsp; {completedCount}/{STEPS.length}</strong>
            </div>
            <div className="progress-track-thin">
              <div className="progress-fill-thin" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* ── Main content ── */}
      <main className="app-onboarding-shell">
        <section className="app-workspace">

          {/* Left: stepper panel */}
          <aside className="app-stepper-panel">
            <div className="stepper-panel-header">
              <h2 className="stepper-panel-title">Application Steps</h2>
              <span className="stepper-panel-count">{completedCount}/{STEPS.length} done</span>
            </div>
            <div className="stepper-timeline">
              {STEPS.map((step, index) => {
                const status      = stepStatuses[step.id];
                const isActive    = step.id === activeStepId;
                const isCompleted = status === "Completed";
                const isLast      = index === STEPS.length - 1;
                const statusClass = STATUS_CLASS[status] ?? "not-started";
                const connClass   = !isLast && isCompleted ? "filled" : "";
                return (
                  <div key={step.id} className={`stepper-row ${isActive ? "active" : ""}`}>
                    <div className="stepper-track-col">
                      <button
                        type="button"
                        className={`step-node ${statusClass} ${isActive ? "active" : ""}`}
                        onClick={() => goToStep(step.id)}
                        aria-label={`Go to ${step.title}`}
                      >
                        {isActive && !isCompleted && <span className="step-node-pulse" />}
                        {isCompleted
                          ? <span className="step-node-check"><CheckIcon /></span>
                          : <span className="step-node-number">{step.number}</span>
                        }
                      </button>
                      {!isLast && <div className={`step-connector ${connClass}`} />}
                    </div>
                    <button
                      type="button"
                      className={`stepper-info-btn ${isActive ? "active" : ""} ${statusClass}`}
                      onClick={() => goToStep(step.id)}
                    >
                      <div className="stepper-info-top">
                        <strong className="stepper-step-title">{step.title}</strong>
                        {isActive && <span className="stepper-active-arrow"><ChevronRightIcon /></span>}
                      </div>
                      <span className="stepper-step-desc">{step.description}</span>
                      {["In Progress", "Pending Validation", "Blocked", "Needs Rework"].includes(status) && (
                        <span className={`status-pill ${statusClass}`}>{status}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Center: step content */}
          <section className="app-step-content">
            <div className="step-body-card">
              <div className="step-card-header">
                <div className="step-card-header-left">
                  <span className="step-card-breadcrumb">
                    Step {activeStep.number}
                    <span className="step-card-breadcrumb-sep">/</span>
                    {STEPS.length}
                  </span>
                  <h2 className="step-card-title">{activeStep.title}</h2>
                  <p className="step-card-desc">{activeStep.description}</p>
                </div>
                <span className={`status-pill ${STATUS_CLASS[activeStatus] ?? "not-started"}`}>
                  {activeStatus}
                </span>
              </div>
              <div className="step-card-divider" />
              <div className="step-card-body">
                <ActiveStepComponent
                  lead={lead}
                  application={application}
                  applicationData={applicationData}
                  stepData={getCurrentStepData()}
                  sectionKey={activeStep.dataKey}
                  updateApplicationData={updateApplicationData}
                  replaceApplicationDataSection={replaceApplicationDataSection}
                  stepStatuses={stepStatuses}
                  updateStepStatus={updateStepStatus}
                />
              </div>
            </div>
          </section>

          {/* Right: validation / info panel */}
          <aside className="validation-panel">
            <div className="validation-card">
              <div className="validation-card-header">
                <span className="validation-icon success"><CheckIcon /></span>
                <div>
                  <h3>Ready Checks</h3>
                  <p>{completedCount} step{completedCount !== 1 ? "s" : ""} completed</p>
                </div>
              </div>
              <ul className="validation-list">
                <li><span className="val-icon success"><CheckIcon /></span>Mobile number verified</li>
                <li><span className="val-icon success"><CheckIcon /></span>Primary applicant captured</li>
                <li><span className="val-icon success"><CheckIcon /></span>Product selected</li>
              </ul>
            </div>

            <div className="validation-card warning">
              <div className="validation-card-header">
                <span className="validation-icon warning"><AlertIcon /></span>
                <div>
                  <h3>Pending Items</h3>
                  <p>Required before final submission</p>
                </div>
              </div>
              <ul className="validation-list">
                <li><span className="val-icon warning"><AlertIcon /></span>PAN verification pending</li>
                <li><span className="val-icon warning"><AlertIcon /></span>Income documents missing</li>
                <li><span className="val-icon warning"><AlertIcon /></span>Eligibility not calculated</li>
              </ul>
            </div>

            <div className="validation-card info">
              <div className="validation-card-header">
                <span className="validation-icon info">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                </span>
                <div>
                  <h3>Application Info</h3>
                  <p>Current session details</p>
                </div>
              </div>
              <div className="info-grid">
                <div className="info-grid-item"><span>Branch</span><strong>Mumbai Central</strong></div>
                <div className="info-grid-item"><span>RM</span><strong>{application?.owner || "Priya Sharma"}</strong></div>
                <div className="info-grid-item"><span>Created</span><strong>{application?.createdDate || "07 May 2026"}</strong></div>
                <div className="info-grid-item"><span>Source</span><strong>{application?.source || "Direct"}</strong></div>
              </div>
            </div>
          </aside>

        </section>
      </main>

      {/* ── Footer action bar ── */}
      <footer className="application-action-bar">
        <div className="footer-step-info">
          <span className="footer-step-pos">Step {activeStepIndex + 1} of {STEPS.length}</span>
          <span className="footer-step-name">{activeStep.title}</span>
        </div>
        <div className="footer-actions">
          <button className="btn-prev" type="button" onClick={previousStep} disabled={activeStepIndex === 0}>
            <ChevronLeftIcon /> Previous
          </button>
          <button className="secondary-button" type="button" onClick={handleSaveDraft}>
            <SaveIcon /> Save Draft
          </button>
          <span className="footer-action-sep" />
          <button
            className="primary-button"
            type="button"
            onClick={saveAndContinue}
            disabled={isLastStep && activeStatus === "Completed"}
          >
            {isLastStep ? "Mark Complete" : "Save & Continue"} {!isLastStep && <ChevronRightIcon />}
          </button>
        </div>
      </footer>

    </div>
  );
}

export default ApplicationOnboardingPage;
