import { useMemo, useState } from "react";
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

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const RupeeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13h7a5 5 0 0 0 0-10" />
    <path d="m6 13 8 8" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M3 13h18" />
  </svg>
);

const steps = [
  {
    id: "customer-identity",
    number: "01",
    title: "Customer Identity",
    description: "PAN, mobile, email and KYC verification",
    status: "Completed",
    icon: ShieldIcon,
    component: CustomerIdentityPage,
  },
  {
    id: "applicant-profile",
    number: "02",
    title: "Applicant Profile",
    description: "Personal, residential and demographic details",
    status: "In Progress",
    icon: UserIcon,
    component: ApplicantProfilePage,
  },
  {
    id: "income-employment",
    number: "03",
    title: "Income & Employment",
    description: "Salary, business income and obligation details",
    status: "Not Started",
    icon: BriefcaseIcon,
    component: IncomeEmploymentPage,
  },
  {
    id: "co-applicants",
    number: "04",
    title: "Co-Applicants",
    description: "Add co-applicants, guarantors and relationships",
    status: "Not Started",
    icon: UserIcon,
    component: CoApplicantsPage,
  },
  {
    id: "documents",
    number: "05",
    title: "Documents",
    description: "Document checklist, upload and OCR status",
    status: "Pending Validation",
    icon: FileIcon,
    component: DocumentsPage,
  },
  {
    id: "collateral",
    number: "06",
    title: "Collateral",
    description: "Property, project and security information",
    status: "Not Started",
    icon: HomeIcon,
    component: CollateralPage,
  },
  {
    id: "loan-requirement",
    number: "07",
    title: "Loan Requirement",
    description: "Product, loan type, purpose, amount and tenure",
    status: "Not Started",
    icon: RupeeIcon,
    component: LoanRequirementPage,
  },
  {
    id: "eligibility-offer",
    number: "08",
    title: "Eligibility & Offer",
    description: "Eligibility, FOIR, LTV and recommended offer",
    status: "Blocked",
    icon: CheckIcon,
    component: EligibilityOfferPage,
  },
  {
    id: "application-package",
    number: "09",
    title: "Application Package",
    description: "Generate, review and sign application form",
    status: "Not Started",
    icon: FileIcon,
    component: ApplicationPackagePage,
  },
  {
    id: "fees-submission",
    number: "10",
    title: "Fees & Submission",
    description: "Payment, final review and submit to credit",
    status: "Not Started",
    icon: RupeeIcon,
    component: FeesSubmissionPage,
  },
];

const statusClassMap = {
  Completed: "completed",
  "In Progress": "in-progress",
  "Pending Validation": "pending",
  "Not Started": "not-started",
  "Needs Rework": "needs-rework",
  Blocked: "blocked",
};

function ApplicationOnboardingPage({ leads, onLogout }) {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [activeStepId, setActiveStepId] = useState("customer-identity");

  const lead = leads.find((l) => l.id === leadId);

  const application = lead
    ? {
        id: `APP-${lead.id.replace("LD-", "")}`,
        leadId: lead.id,
        applicantName: `${lead.firstName} ${lead.lastName}`,
        mobile: lead.mobile,
        product: lead.product,
        source: lead.source,
        owner: lead.owner,
        requestedAmount: "₹42,00,000",
        status: "Application In Progress",
        createdDate: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }
    : null;

  const activeStepIndex = steps.findIndex((step) => step.id === activeStepId);
  const activeStep = steps[activeStepIndex] || steps[0];
  const ActiveStepComponent = activeStep.component;

  const completedCount = steps.filter((step) => step.status === "Completed").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const nextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepId(steps[activeStepIndex + 1].id);
    }
  };

  const previousStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepId(steps[activeStepIndex - 1].id);
    }
  };

  const handleBack = () => {
    navigate(`/leads/${leadId}`);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login", { replace: true });
  };

  const stepStats = useMemo(
    () => [
      { label: "Application No.", value: application?.id || "APP-2026-000184" },
      { label: "Lead No.", value: application?.leadId || "LD-2026-00491" },
      { label: "Applicant", value: application?.applicantName || "Aarav Mehta" },
      { label: "Product", value: application?.product || "Home Loan" },
      { label: "Requested Amount", value: application?.requestedAmount || "₹42,00,000" },
      { label: "Stage", value: application?.status || "Application In Progress" },
    ],
    [application]
  );

  if (!lead) {
    return (
      <div className="app-onboarding-page">
        <header className="app-onboarding-topbar">
          <div className="app-topbar-left">
            <button className="back-button" type="button" onClick={handleBack}>
              <BackIcon />
            </button>
            <div>
              <div className="eyebrow">Post Conversion Journey</div>
              <h1>Application Onboarding</h1>
            </div>
          </div>
        </header>
        <main className="app-onboarding-shell">
          <p style={{ padding: "2rem" }}>Lead not found. The lead with ID &quot;{leadId}&quot; does not exist.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-onboarding-page">
      <header className="app-onboarding-topbar">
        <div className="app-topbar-left">
          <button className="back-button" type="button" onClick={handleBack}>
            <BackIcon />
          </button>

          <div>
            <div className="eyebrow">Post Conversion Journey</div>
            <h1>Application Onboarding</h1>
            <p>
              Complete the application file, verify required details and prepare the case for review.
            </p>
          </div>
        </div>

        <div className="app-topbar-actions">
          <button className="secondary-button" type="button">
            <SaveIcon />
            Save Draft
          </button>
          <button className="primary-button" type="button" onClick={nextStep}>
            Continue
          </button>
          <button className="secondary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-onboarding-shell">
        <section className="application-summary-card">
          {stepStats.map((item) => (
            <div className="summary-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}

          <div className="summary-progress">
            <div className="summary-progress-top">
              <span>Completion</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </section>

        <section className="app-workspace">
          <aside className="app-stepper-panel">
            <div className="stepper-heading">
              <div>
                <span className="eyebrow">Journey Steps</span>
                <h2>Application Flow</h2>
              </div>
              <span className="step-count">
                {completedCount}/{steps.length}
              </span>
            </div>

            <div className="stepper-list">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === activeStepId;
                const statusClass = statusClassMap[step.status] || "not-started";

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={`stepper-item ${isActive ? "active" : ""}`}
                    onClick={() => setActiveStepId(step.id)}
                  >
                    <span className="stepper-icon">
                      <Icon />
                    </span>

                    <span className="stepper-content">
                      <span className="stepper-title-row">
                        <span className="step-number">{step.number}</span>
                        <strong>{step.title}</strong>
                      </span>
                      <span className="step-description">{step.description}</span>
                      <span className={`status-pill ${statusClass}`}>{step.status}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="app-step-content">
            <div className="step-content-header">
              <div>
                <span className="eyebrow">Current Step</span>
                <h2>{activeStep.title}</h2>
                <p>{activeStep.description}</p>
              </div>

              <span className={`status-pill large ${statusClassMap[activeStep.status]}`}>
                {activeStep.status}
              </span>
            </div>

            <div className="step-body-card">
              <ActiveStepComponent />
            </div>
          </section>

          <aside className="validation-panel">
            <div className="validation-card">
              <div className="validation-card-header">
                <span className="validation-icon success">
                  <CheckIcon />
                </span>
                <div>
                  <h3>Ready Checks</h3>
                  <p>3 validations completed</p>
                </div>
              </div>

              <ul className="validation-list">
                <li>
                  <CheckIcon />
                  Mobile number verified
                </li>
                <li>
                  <CheckIcon />
                  Primary applicant captured
                </li>
                <li>
                  <CheckIcon />
                  Product selected
                </li>
              </ul>
            </div>

            <div className="validation-card warning">
              <div className="validation-card-header">
                <span className="validation-icon warning">
                  <AlertIcon />
                </span>
                <div>
                  <h3>Pending Items</h3>
                  <p>Required before final submission</p>
                </div>
              </div>

              <ul className="validation-list warning">
                <li>
                  <AlertIcon />
                  PAN verification pending
                </li>
                <li>
                  <AlertIcon />
                  Income documents missing
                </li>
                <li>
                  <AlertIcon />
                  Eligibility not calculated
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <footer className="application-action-bar">
        <div>
          <span className="eyebrow">Application Status</span>
          <strong>Draft saved locally. Complete all mandatory steps before submission.</strong>
        </div>

        <div className="footer-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={previousStep}
            disabled={activeStepIndex === 0}
          >
            Previous
          </button>

          <button className="secondary-button" type="button">
            Save Draft
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={nextStep}
            disabled={activeStepIndex === steps.length - 1}
          >
            {activeStepIndex === steps.length - 1 ? "Final Step" : "Save & Continue"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ApplicationOnboardingPage;
