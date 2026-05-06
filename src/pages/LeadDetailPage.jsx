import "./LeadDetailPage.css";

const buildLeadDetails = (lead) => ({
  alternateMobile: lead.alternateMobile || "—",
  applicantCategory: lead.applicantCategory || "Salaried",
  applicantType: lead.applicantType || "Individual",
  apsNumber: lead.apsNumber || "—",
  assignedTo: lead.assignedTo || "USR-1024",
  assignedToName: lead.assignedToName || lead.owner || "Sales User",
  balanceTransferBank: lead.balanceTransferBank || "—",
  balanceTransferBankName: lead.balanceTransferBankName || "—",
  branchName: lead.branchName || "Mumbai Andheri Branch",
  btBankFunnel: lead.btBankFunnel || "—",
  constitutionType: lead.constitutionType || "Individual",
  consumerSystemName: lead.consumerSystemName || "LOS Web",
  countryCode: lead.countryCode || "+91",
  daysSinceLastActivity: lead.daysSinceLastActivity || "0",
  emailVerified: lead.emailVerified || "No",
  generationMode: lead.generationMode || "Manual",
  leadAge: lead.leadAge || "0 Days",
  leadNumber: lead.id,
  leadOrigin: lead.leadOrigin || "Direct",
  leadStage: lead.leadStage || lead.status || "New",
  leadSubDisposition: lead.leadSubDisposition || "—",
  leadSubSource: lead.leadSubSource || "—",
  leadSubSubSource: lead.leadSubSubSource || "—",
  loanFileStatus: lead.loanFileStatus || "Lead Draft",
  loanPurpose: lead.loanPurpose || "Purchase",
  loanTenureYears: lead.loanTenureYears || "20",
  loanType: lead.loanType || lead.product || "Home Loan",
  losOwnerTeam: lead.losOwnerTeam || "Sales Team",
  losVerificationUser: lead.losVerificationUser || "—",
  mobileVerified: lead.mobileVerified || "No",
  monthlyGrossSalary: lead.monthlyGrossSalary || "₹85,000",
  ownerName: lead.ownerName || lead.owner || "Sales User",
  product: lead.product || "—",
  projectPropertyName: lead.projectPropertyName || "—",
  propertyIdentified: lead.propertyIdentified || "No",
  requestedLoanAmount: lead.requestedLoanAmount || "₹45,00,000",
  residentialStatus: lead.residentialStatus || "Resident Indian",
  typeOfProperty: lead.typeOfProperty || "Flat / Apartment",
});

function EditableField({ label, value }) {
  return (
    <div className="record-field">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <button className="field-edit-button" title={`Edit ${label}`}>
        ✎
      </button>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="record-section">
      <div className="record-section-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        <button className="section-edit-button">
          ✎ Edit
        </button>
      </div>

      <div className="record-field-grid">{children}</div>
    </section>
  );
}

function LeadDetailPage({ lead, onBack, onLogout }) {
  const details = buildLeadDetails(lead);

  return (
    <div className="lead-detail-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">LOS</div>
          <div>
            <h2>LOS Portal</h2>
            <p>Loan Origination</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={onBack}>Dashboard</button>
          <button className="nav-item active">Leads</button>
          <button className="nav-item">Applications</button>
          <button className="nav-item">Applicants</button>
          <button className="nav-item">Documents</button>
          <button className="nav-item">Approvals</button>
        </nav>

        <div className="sidebar-footer">
          <p>Logged in as</p>
          <strong>Sales User</strong>
        </div>
      </aside>

      <main className="lead-detail-main">
        <header className="record-topbar">
          <div>
            <button className="back-button" onClick={onBack}>
              ← Back to Dashboard
            </button>

            <div className="record-title-wrap">
              <div className="record-avatar">
                {lead.firstName.charAt(0)}
                {lead.lastName.charAt(0)}
              </div>

              <div>
                <span className="page-eyebrow">Lead Details</span>

                <div className="record-title-line">
                  <h1>
                    {lead.firstName} {lead.lastName}
                  </h1>

                  <button className="title-edit-button" title="Edit lead name">
                    ✎
                  </button>
                </div>

                <p>
                  {details.leadNumber} · {details.product} · {details.branchName}
                </p>
              </div>
            </div>
          </div>

          <div className="record-actions">
            <button className="ghost-button" onClick={onLogout}>
              Logout
            </button>

            <button className="verify-button">
              Verify Mobile
            </button>

            <button className="verify-button">
              Verify Email
            </button>

            <button className="primary-action-button">
              Convert Lead
            </button>
          </div>
        </header>

        <section className="record-summary-strip">
          <div className="summary-item">
            <span>Lead Stage</span>
            <strong>{details.leadStage}</strong>
          </div>

          <div className="summary-item">
            <span>Loan File Status</span>
            <strong>{details.loanFileStatus}</strong>
          </div>

          <div className="summary-item">
            <span>Requested Amount</span>
            <strong>{details.requestedLoanAmount}</strong>
          </div>

          <div className="summary-item">
            <span>Assigned To</span>
            <strong>{details.assignedToName}</strong>
          </div>

          <div className="summary-item">
            <span>Mobile Verified?</span>
            <strong className={details.mobileVerified === "Yes" ? "positive-text" : "pending-text"}>
              {details.mobileVerified}
            </strong>
          </div>
        </section>

        <div className="record-page-grid">
          <div className="record-main-column">
            <Section
              title="Primary Lead Information"
              subtitle="Core details captured for this lead."
            >
              <EditableField label="Lead Number" value={details.leadNumber} />
              <EditableField label="Product" value={details.product} />
              <EditableField label="Lead Stage" value={details.leadStage} />
              <EditableField label="Lead Origin" value={details.leadOrigin} />
              <EditableField label="Lead Sub Source" value={details.leadSubSource} />
              <EditableField label="Lead Sub Sub Source" value={details.leadSubSubSource} />
              <EditableField label="Lead Sub Disposition" value={details.leadSubDisposition} />
              <EditableField label="Generation Mode" value={details.generationMode} />
              <EditableField label="Consumer System Name" value={details.consumerSystemName} />
              <EditableField label="Lead Age" value={details.leadAge} />
              <EditableField label="Days Since Last Activity" value={details.daysSinceLastActivity} />
            </Section>

            <Section
              title="Customer & Contact Information"
              subtitle="Applicant identity and contact details."
            >
              <EditableField label="First Name" value={lead.firstName} />
              <EditableField label="Last Name" value={lead.lastName} />
              <EditableField label="Country Code" value={details.countryCode} />
              <EditableField label="Mobile" value={lead.mobile} />
              <EditableField label="Alternate Mobile" value={details.alternateMobile} />
              <EditableField label="Mobile Verified?" value={details.mobileVerified} />
              <EditableField label="Email Verified?" value={details.emailVerified} />
              <EditableField label="Residential Status" value={details.residentialStatus} />
            </Section>

            <Section
              title="Applicant Details"
              subtitle="Applicant profile and employment category."
            >
              <EditableField label="Applicant Type" value={details.applicantType} />
              <EditableField label="Applicant Category" value={details.applicantCategory} />
              <EditableField label="Constitution Type" value={details.constitutionType} />
              <EditableField label="Monthly Gross Salary" value={details.monthlyGrossSalary} />
            </Section>

            <Section
              title="Loan Details"
              subtitle="Loan requirement, purpose, tenure, and property details."
            >
              <EditableField label="Loan Type" value={details.loanType} />
              <EditableField label="Loan Purpose" value={details.loanPurpose} />
              <EditableField label="Requested Loan Amount" value={details.requestedLoanAmount} />
              <EditableField label="Loan Tenure (Years)" value={details.loanTenureYears} />
              <EditableField label="Property Identified" value={details.propertyIdentified} />
              <EditableField label="Project/Property Name" value={details.projectPropertyName} />
              <EditableField label="Type of Property" value={details.typeOfProperty} />
            </Section>

            <Section
              title="Balance Transfer Details"
              subtitle="Balance transfer bank information, if applicable."
            >
              <EditableField label="Balance Transfer Bank" value={details.balanceTransferBank} />
              <EditableField label="Balance Transfer Bank Name" value={details.balanceTransferBankName} />
              <EditableField label="BT Bank (Funnel)" value={details.btBankFunnel} />
            </Section>

            <Section
              title="Ownership & Assignment"
              subtitle="Team, owner, branch, and verification assignment."
            >
              <EditableField label="Owner Name" value={details.ownerName} />
              <EditableField label="LOS Owner Team" value={details.losOwnerTeam} />
              <EditableField label="Assigned To" value={details.assignedTo} />
              <EditableField label="Assigned To Name" value={details.assignedToName} />
              <EditableField label="Branch Name" value={details.branchName} />
              <EditableField label="LOS Verification User" value={details.losVerificationUser} />
            </Section>

            <Section
              title="Application & APS Information"
              subtitle="Application linkage and APS details."
            >
              <EditableField label="APS Number" value={details.apsNumber} />
              <EditableField label="Loan File Status" value={details.loanFileStatus} />
            </Section>
          </div>

          <aside className="record-side-column">
            <section className="side-panel-card">
              <h3>Verification</h3>

              <div className="verification-row">
                <div>
                  <span>Mobile</span>
                  <strong>{lead.mobile}</strong>
                  <p>Status: {details.mobileVerified}</p>
                </div>

                <button className="small-verify-button">
                  Verify
                </button>
              </div>

              <div className="verification-row">
                <div>
                  <span>Email</span>
                  <strong>Not captured</strong>
                  <p>Status: {details.emailVerified}</p>
                </div>

                <button className="small-verify-button">
                  Verify
                </button>
              </div>
            </section>

            <section className="side-panel-card">
              <h3>Lead Journey</h3>

              <div className="journey-list">
                <div className="journey-step active">
                  <div className="journey-number">1</div>
                  <div>
                    <strong>Lead Created</strong>
                    <p>Basic lead details are available.</p>
                  </div>
                </div>

                <div className="journey-step">
                  <div className="journey-number">2</div>
                  <div>
                    <strong>Verification</strong>
                    <p>Mobile, email, and applicant checks can be completed.</p>
                  </div>
                </div>

                <div className="journey-step">
                  <div className="journey-number">3</div>
                  <div>
                    <strong>Application</strong>
                    <p>Convert lead and create loan application.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="side-panel-card">
              <h3>Quick Actions</h3>

              <button className="quick-action-button">
                Add Activity
              </button>

              <button className="quick-action-button">
                Assign Lead
              </button>

              <button className="quick-action-button">
                Upload Document
              </button>

              <button className="quick-action-button primary">
                Convert Lead
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default LeadDetailPage;