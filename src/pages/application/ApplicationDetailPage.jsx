import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ApplicationDetailPage.css";

const BackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const JewelleryIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    aria-hidden="true"
  >
    <path d="m4 8 4-5h8l4 5-8 13Z" />
    <path d="M4 8h16M8 3l4 5 4-5M8 8l4 13 4-13" />
  </svg>
);

const APPLICATION_STAGES = [
  {
    id: "application-created",
    title: "Application Created",
    description: "Customer and loan information captured",
    status: "Completed",
  },
  {
    id: "gold-appraisal",
    title: "Gold Appraisal",
    description: "Jewellery valuation by assigned appraiser",
    status: "In Progress",
  },
  {
    id: "checker-review",
    title: "Checker Review",
    description: "Application verification and sanction",
    status: "Not Started",
  },
  {
    id: "documentation",
    title: "Documentation",
    description: "Loan agreement and e-signing",
    status: "Not Started",
  },
  {
    id: "disbursement",
    title: "Disbursement",
    description: "Final loan disbursement",
    status: "Not Started",
  },
];

function ApplicationDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationNumber } = useParams();

  const leadId = location.state?.leadId;
  const customerName =
    location.state?.customerName || "Gold Loan Customer";

  const handleBack = () => {
    if (leadId) {
      navigate(`/leads/${leadId}`);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="application-detail-page">
      <header className="application-detail-topbar">
        <div className="application-detail-topbar-left">
          <button
            type="button"
            className="application-detail-back"
            onClick={handleBack}
            aria-label="Back"
          >
            <BackIcon />
          </button>

          <img
            className="application-detail-logo"
            src="/images/yes-bank-logo-dark-bg.png"
            alt="YES BANK"
          />

          <span className="application-detail-divider" />

          <div>
            <h1>Gold Loan Application</h1>
            <p>Application detail workspace</p>
          </div>
        </div>

        <span className="application-detail-product">
          <JewelleryIcon />
          Gold Loan
        </span>
      </header>

      <main className="application-detail-shell">
        <section className="application-detail-hero">
          <div>
            <span className="application-detail-eyebrow">
              GOLD LOAN APPLICATION
            </span>

            <h2>{applicationNumber}</h2>

            <p>
              Track appraisal, approval, documentation and
              disbursement from this page.
            </p>
          </div>

          <div className="application-detail-status">
            <span className="application-detail-status-dot" />

            <div>
              <span>CURRENT STATUS</span>
              <strong>Awaiting Gold Appraisal</strong>
            </div>
          </div>
        </section>

        <section className="application-detail-summary">
          <div>
            <span>Application number</span>
            <strong>{applicationNumber}</strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>{customerName}</strong>
          </div>

          <div>
            <span>Product</span>
            <strong>YES BANK Gold Loan</strong>
          </div>

          <div>
            <span>Lead number</span>
            <strong>{leadId || "—"}</strong>
          </div>

          <div>
            <span>Application status</span>
            <strong className="application-detail-status-text">
              Awaiting Gold Appraisal
            </strong>
          </div>
        </section>

        <section className="application-detail-card">
          <div className="application-detail-section-heading">
            <div>
              <span>APPLICATION JOURNEY</span>
              <h3>Processing stages</h3>
              <p>
                The detailed workflow and stage actions will be
                added later.
              </p>
            </div>
          </div>

          <div className="application-stage-list">
            {APPLICATION_STAGES.map((stage, index) => {
              const completed = stage.status === "Completed";
              const active = stage.status === "In Progress";

              return (
                <div
                  className={`application-stage ${
                    completed
                      ? "completed"
                      : active
                        ? "active"
                        : ""
                  }`}
                  key={stage.id}
                >
                  <span className="application-stage-number">
                    {completed ? <CheckIcon /> : index + 1}
                  </span>

                  <div>
                    <strong>{stage.title}</strong>
                    <p>{stage.description}</p>
                  </div>

                  <span className="application-stage-status">
                    {stage.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="application-detail-placeholder-grid">
          <div className="application-detail-placeholder">
            <span>APPLICATION INFORMATION</span>
            <h3>Application summary</h3>
            <p>
              Customer, facility, eligibility and account
              information will be shown here.
            </p>
          </div>

          <div className="application-detail-placeholder">
            <span>GOLD APPRAISAL</span>
            <h3>Jewellery appraisal</h3>
            <p>
              Appraiser assignment, jewellery valuation and
              eligible amount will be shown here.
            </p>
          </div>

          <div className="application-detail-placeholder">
            <span>ACTIVITY</span>
            <h3>Application timeline</h3>
            <p>
              Status changes, tasks, documents and communication
              history will be shown here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ApplicationDetailPage;