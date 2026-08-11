import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

/* ── Inline SVG Icons ───────────────────────────────────────── */

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CollapseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ExpandIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ── Static Data ────────────────────────────────────────────── */

const listViews = [
  "Leads Created Today",
  "All Leads",
  "My Leads",
  "New Leads",
  "In Progress Leads",
  "Converted Leads",
  "Disqualified Leads",
];

const sourceOptions = [
  { value: "Branch Walk-in", icon: "⌂", description: "Customer at branch" },
  {
    value: "Relationship Manager",
    icon: "◎",
    description: "RM-generated enquiry",
  },
  {
    value: "Customer Referral",
    icon: "↗",
    description: "Existing customer referral",
  },
  { value: "Gold Loan Campaign", icon: "◆", description: "Campaign response" },
  { value: "Website", icon: "⌁", description: "Digital enquiry" },
  {
    value: "Contact Centre",
    icon: "◉",
    description: "Inbound or outbound call",
  },
];

const emptyLeadForm = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  product: "Gold Loan",
  source: "",
};

const channelData = [
  { label: "Branch Walk-in", value: "38%", width: "82%", icon: "⌂" },
  { label: "RM Referral", value: "24%", width: "58%", icon: "↗" },
  { label: "Campaign", value: "16%", width: "42%", icon: "◆" },
  { label: "Contact Centre", value: "12%", width: "31%", icon: "◉" },
  { label: "Website", value: "10%", width: "26%", icon: "⌁" },
];

const funnelData = [
  { label: "Lead Captured", value: 186, icon: "01" },
  { label: "Lead Converted", value: 124, icon: "02" },
  { label: "Application Created", value: 108, icon: "03" },
  { label: "Jewellery Appraised", value: 82, icon: "04" },
  { label: "Checker Approved", value: 66, icon: "05" },
  { label: "Documentation Complete", value: 54, icon: "06" },
  { label: "Disbursed", value: 47, icon: "07" },
];

const conversionQueue = [
  {
    applicant: "Aarav Sharma",
    lead: "LD-10017",
    check: "Residential proof",
    status: "Pending",
  },
  {
    applicant: "Neha Mehta",
    lead: "LD-10012",
    check: "Customer consent",
    status: "Completed",
  },
  {
    applicant: "Rohan Iyer",
    lead: "LD-10008",
    check: "CBS customer match",
    status: "Review",
  },
];

const appraisalQueue = [
  {
    application: "GL-2026-01842",
    customer: "Karan Malhotra",
    stage: "Awaiting Appraiser",
    aging: "2 Hrs",
  },
  {
    application: "GL-2026-01837",
    customer: "Priya Nair",
    stage: "Appraisal In Progress",
    aging: "4 Hrs",
  },
  {
    application: "GL-2026-01829",
    customer: "Vivek Rao",
    stage: "Maker Clarification",
    aging: "1 Day",
  },
];

const documentExceptions = [
  {
    lead: "GL-2026-01834",
    document: "Ownership Proof",
    issue: "Document missing",
    severity: "High",
  },
  {
    lead: "GL-2026-01822",
    document: "Land Record",
    issue: "Survey number mismatch",
    severity: "Medium",
  },
  {
    lead: "GL-2026-01811",
    document: "Jewellery Photo",
    issue: "Re-upload required",
    severity: "Low",
  },
];

const activityData = [
  {
    title: "Lead marked ready for conversion",
    subtitle: "Required customer details completed for LD-10018.",
    time: "12 min ago",
    icon: "✓",
  },
  {
    title: "Jewellery appraisal completed",
    subtitle: "Net eligible weight recorded for GL-2026-01842.",
    time: "38 min ago",
    icon: "◆",
  },
  {
    title: "Customer document request sent",
    subtitle: "Secure email sent for missing land ownership proof.",
    time: "1 hr ago",
    icon: "✉",
  },
  {
    title: "Application approved by checker",
    subtitle: "GL-2026-01829 moved to documentation.",
    time: "2 hrs ago",
    icon: "✓",
  },
];

const navItems = [
  { icon: "▦", label: "Dashboard", active: true },
  { icon: "◎", label: "Leads", active: false },
  { icon: "▣", label: "Applications", active: false },
  { icon: "◆", label: "Appraisals", active: false },
  { icon: "□", label: "Documents", active: false },
  { icon: "◇", label: "Approvals", active: false },
];

/* ── Component ──────────────────────────────────────────────── */

function DashboardPage({ leads = [], onCreateLead, onLogout }) {
  const navigate = useNavigate();

  const [selectedListView, setSelectedListView] = useState(
    "Leads Created Today",
  );
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [apiLeads, setApiLeads] = useState([]);
  const [isTodayLeadsLoading, setIsTodayLeadsLoading] = useState(true);
  const [todayLeadsError, setTodayLeadsError] = useState("");
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [createLeadError, setCreateLeadError] = useState("");

  useEffect(() => {
    const fetchTodayLeads = async () => {
      try {
        setIsTodayLeadsLoading(true);
        setTodayLeadsError("");

        const response = await fetch(
          "https://xx8ep3p2ue.execute-api.ap-south-1.amazonaws.com/prod/leads/today",
        );

        if (!response.ok) {
          throw new Error("Unable to load today's leads.");
        }

        const data = await response.json();

        if (data.success) {
          const formattedLeads = data.data.map((lead) => ({
            id: lead.leadnumber,
            firstName: lead.first_name,
            lastName: lead.last_name,
            mobile: lead.mobile,
            email: lead.email,
            product: lead.product || "Gold Loan",
            status: lead.stage || "New",
            owner: lead.owner || "Sales User",
            createdDate: new Date(lead.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }));

          setApiLeads(formattedLeads);
        } else {
          throw new Error(data.message || "Unable to load today's leads.");
        }
      } catch (error) {
        console.error("Fetch Today Leads Error:", error);
        setTodayLeadsError(error.message || "Unable to load today's leads.");
      } finally {
        setIsTodayLeadsLoading(false);
      }
    };

    fetchTodayLeads();
  }, []);

  const displayLeads =
    selectedListView === "Leads Created Today" ? apiLeads : leads;

  const filteredLeads = displayLeads.filter((lead) => {
    if (selectedListView === "All Leads") return true;

    if (selectedListView === "My Leads") return lead.owner !== "Contact Center";

    if (selectedListView === "New Leads") return lead.status === "New";

    if (selectedListView === "In Progress Leads")
      return lead.status === "In Progress";

    if (selectedListView === "Converted Leads")
      return lead.status === "Converted";

    if (selectedListView === "Disqualified Leads")
      return lead.status === "Disqualified";

    if (selectedListView === "Leads Created Today") return true;

    return true;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const inProgressLeads = leads.filter(
    (l) => l.status === "In Progress",
  ).length;
  const convertedLeads = leads.filter((l) => l.status === "Converted").length;
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const currentDateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const handleSignOut = async () => {
    try {
      await onLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleOpenCreatePanel = () => {
    setLeadForm(emptyLeadForm);
    setCreateLeadError("");
    setIsCreatePanelOpen(true);
  };

  const handleCloseCreatePanel = () => {
    setIsCreatePanelOpen(false);
    setLeadForm(emptyLeadForm);
    setCreateLeadError("");
  };

  const handleLeadFormChange = (e) => {
    const { name, value } = e.target;
    setLeadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceSelect = (source) => {
    setLeadForm((previousForm) => ({ ...previousForm, source }));
    if (createLeadError) setCreateLeadError("");
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();

    if (!leadForm.source) {
      setCreateLeadError(
        "Please select how the customer enquiry was received.",
      );
      return;
    }

    try {
      setIsCreatingLead(true);
      setCreateLeadError("");
      const res = await fetch(
        "https://weaq9mioy2.execute-api.ap-south-1.amazonaws.com/create-lead",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadForm),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create lead");
      }

      const newLead = {
        id: data.leadnumber,
        firstName: leadForm.firstName,
        lastName: leadForm.lastName,
        mobile: leadForm.mobile,
        email: leadForm.email,
        product: leadForm.product,
        source: leadForm.source,
        status: "New",
        owner: "Sales User",
        createdDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        ...data,
      };

      setApiLeads((currentLeads) => [newLead, ...currentLeads]);
      handleCloseCreatePanel();

      const newLeadId = onCreateLead ? onCreateLead(newLead) : newLead.id;
      navigate(`/leads/${newLeadId}`);
    } catch (err) {
      alert(err)
      setCreateLeadError(
        err.message || "An error occurred while creating the lead.",
      );
    } finally {
      setIsCreatingLead(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* ── SIDEBAR ───────────────────────────────────────── */}
      <aside className={`app-sidebar${isSidebarCollapsed ? " collapsed" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img
              src={
                isSidebarCollapsed
                  ? "/images/yes-bank-logo-icon.png"
                  : "/images/yes-bank-logo-dark-bg.png"
              }
              alt="YES BANK"
              className="sidebar-logo-img"
            />
          </div>
          <div className="sidebar-brand-text">
            <h2>Gold Loan Portal</h2>
            <p>Origination &amp; Appraisal</p>
          </div>
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={() => setIsSidebarCollapsed((c) => !c)}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="sidebar-collapse-icon">
            {isSidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </span>
          <span className="nav-label">Collapse</span>
        </button>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item${item.active ? " active" : ""}`}
              title={item.label}
              data-label={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-insight-card">
          <span>Today's Gold Loan Focus</span>
          <strong>12 applications need attention</strong>
          <p>Conversion readiness, appraisal hand-offs, and checker actions.</p>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar" title="Sales User">
            SU
          </div>
          <div className="sidebar-footer-info">
            <p>Logged in as</p>
            <strong>Sales User</strong>
          </div>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────────── */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-title-block">
            <span className="page-eyebrow">Branch Lending Workspace</span>
            <h1>Gold Loan Operations</h1>
            <p>Pune Camp Branch · {currentDateLabel}</p>
          </div>

          <div className="topbar-actions">
            <button
              className="logout-button"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogoutIcon />
              <span className="logout-label">Sign Out</span>
            </button>

            <button
              className="create-lead-button"
              onClick={handleOpenCreatePanel}
            >
              <span className="create-lead-plus">+</span>
              Create Gold Loan Lead
            </button>
          </div>
        </header>

        <section className="gold-dashboard-hero">
          <div className="gold-hero-copy">
            <span className="gold-hero-kicker">
              <i aria-hidden="true" />
              Sales User Work Queue
            </span>
            <h2>
              Prioritize today's leads and move{" "}
              <em>eligible customers to application.</em>
            </h2>
            <p>
              Start with new enquiries, complete missing customer details, and
              follow up on leads ready for conversion. Appraisal and checker
              queues remain visible for timely coordination.
            </p>

            <div className="gold-journey-strip" aria-label="Gold loan stages">
              <span className="active">
                <b>01</b>Lead
              </span>
              <i aria-hidden="true" />
              <span>
                <b>02</b>Application
              </span>
              <i aria-hidden="true" />
              <span>
                <b>03</b>Appraisal
              </span>
              <i aria-hidden="true" />
              <span>
                <b>04</b>Sanction
              </span>
              <i aria-hidden="true" />
              <span>
                <b>05</b>Disbursement
              </span>
            </div>
          </div>

          <div className="gold-hero-snapshot">
            <div className="snapshot-title">
              <span>Branch snapshot</span>
              <small>Live operational focus</small>
            </div>
            <div className="snapshot-metric appraisal">
              <strong>14</strong>
              <span>Awaiting appraisal</span>
            </div>
            <div className="snapshot-metric checker">
              <strong>06</strong>
              <span>Checker actions due</span>
            </div>
            <div className="snapshot-metric disbursed">
              <strong>47</strong>
              <span>Disbursed this week</span>
            </div>
          </div>

          <div className="gold-hero-art" aria-hidden="true">
            <span className="hero-gold-ring hero-ring-large" />
            <span className="hero-gold-ring hero-ring-small" />
            <span className="hero-gold-coin hero-coin-one">916</span>
            <span className="hero-gold-coin hero-coin-two">24K</span>
            <img src="/images/yes-bank-logo-icon.png" alt="" />
            <b>✦</b>
          </div>
        </section>

        <section className="kpi-grid">
          <div className="kpi-card primary-kpi">
            <div className="kpi-content">
              <span>Leads Created Today</span>
              <strong>{isTodayLeadsLoading ? "—" : apiLeads.length}</strong>
              <p>Gold loan enquiries received today</p>
              <div className="kpi-trend up">Live from lead service</div>
            </div>
            <div className="kpi-icon">＋</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-content">
              <span>Total Gold Loan Leads</span>
              <strong>{totalLeads}</strong>
              <p>Across active lead sources</p>
              <div className="kpi-trend neutral">Current portfolio</div>
            </div>
            <div className="kpi-icon">◎</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-content">
              <span>New Leads</span>
              <strong>{newLeads}</strong>
              <p>Awaiting customer contact</p>
              <div className="kpi-trend neutral">Action required</div>
            </div>
            <div className="kpi-icon">◌</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-content">
              <span>In Progress</span>
              <strong>{inProgressLeads}</strong>
              <p>Details or documents being completed</p>
              <div className="kpi-trend neutral">Follow-up active</div>
            </div>
            <div className="kpi-icon">▣</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-content">
              <span>Converted</span>
              <strong>{convertedLeads}</strong>
              <p>Moved to gold loan application</p>
              <div className="kpi-trend up">Application created</div>
            </div>
            <div className="kpi-icon">✓</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-content">
              <span>Conversion Rate</span>
              <strong>{conversionRate}%</strong>
              <p>Lead-to-application conversion</p>
              <div className="kpi-trend up">Portfolio performance</div>
            </div>
            <div className="kpi-icon">↗</div>
          </div>
        </section>

        <section className="dashboard-first-row">
          <section className="lead-panel compact-lead-panel">
            <div className="lead-panel-header">
              <div>
                <span className="section-eyebrow">Gold Loan Leads</span>
                <h2>{selectedListView}</h2>
                <p>
                  {selectedListView === "Leads Created Today"
                    ? "Live enquiries created through today's lead service."
                    : "Gold loan enquiries based on the selected view."}
                </p>
                {todayLeadsError &&
                  selectedListView === "Leads Created Today" && (
                    <span className="table-inline-error" role="status">
                      {todayLeadsError}
                    </span>
                  )}
              </div>

              <div className="table-actions">
                <div className="list-view-control">
                  <label htmlFor="listView">List View</label>
                  <select
                    id="listView"
                    value={selectedListView}
                    onChange={(e) => setSelectedListView(e.target.value)}
                  >
                    {listViews.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="small-action-button">
                  <span>↓</span>
                  Export
                </button>
              </div>
            </div>

            <div className="table-wrapper compact-table-wrapper">
              <table className="lead-table">
                <thead>
                  <tr>
                    <th>Lead ID</th>
                    <th>Applicant</th>
                    <th>Product</th>
                    <th>Stage</th>
                    <th>Owner</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {isTodayLeadsLoading &&
                  selectedListView === "Leads Created Today" ? (
                    <tr>
                      <td colSpan="6">
                        <div className="table-empty-state">
                          Loading today's leads…
                        </div>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="table-empty-state">
                          No gold loan leads found for this view.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <button
                            type="button"
                            className="lead-link-button"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                          >
                            {lead.id}
                          </button>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <span>
                              {lead.firstName?.charAt(0)}
                              {lead.lastName?.charAt(0)}
                            </span>
                            <div>
                              <strong>
                                {lead.firstName} {lead.lastName}
                              </strong>
                              <p>{lead.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="gold-product-chip">
                            <i aria-hidden="true">◆</i>
                            {lead.product || "Gold Loan"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${String(
                              lead.status || "New",
                            )
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {lead.status || "New"}
                          </span>
                        </td>
                        <td>{lead.owner}</td>
                        <td>{lead.createdDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="insight-panel source-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">Lead Intake</span>
                <h2>Source Mix</h2>
                <p>Gold loan enquiries by source this week.</p>
              </div>
            </div>

            <div className="channel-list">
              {channelData.map((ch) => (
                <div className="channel-row" key={ch.label}>
                  <div className="channel-label">
                    <span>
                      <i>{ch.icon}</i>
                      {ch.label}
                    </span>
                    <strong>{ch.value}</strong>
                  </div>
                  <div className="channel-track">
                    <div className="channel-fill" style={{ width: ch.width }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="insight-panel verification-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">Lead Conversion</span>
                <h2>Conversion Readiness</h2>
                <p>Customer details, consent, and document health.</p>
              </div>
            </div>

            <div className="donut-card">
              <div className="donut-chart">
                <span>78%</span>
              </div>
              <div className="donut-legend">
                <div>
                  <i className="legend-dot completed" />
                  Ready<strong>78%</strong>
                </div>
                <div>
                  <i className="legend-dot pending" />
                  Details Pending<strong>16%</strong>
                </div>
                <div>
                  <i className="legend-dot failed" />
                  Attention Needed<strong>6%</strong>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="dashboard-second-row">
          <section className="insight-panel funnel-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">Gold Loan Movement</span>
                <h2>Journey Funnel</h2>
                <p>Lead capture through final disbursement.</p>
              </div>
              <span className="panel-pill">Current Week</span>
            </div>

            <div className="funnel-list">
              {funnelData.map((item) => (
                <div className="funnel-row" key={item.label}>
                  <div>
                    <span className="funnel-step">{item.icon}</span>
                    <strong>{item.label}</strong>
                  </div>
                  <div className="funnel-bar-wrap">
                    <div
                      className="funnel-bar"
                      style={{ width: `${Math.max(item.value / 2.2, 12)}%` }}
                    />
                  </div>
                  <span className="funnel-value">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="insight-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">Today's Attention</span>
                <h2>Action Watchlist</h2>
                <p>Gold loan cases requiring follow-up.</p>
              </div>
            </div>

            <div className="watchlist">
              <div>
                <span>Leads Awaiting First Contact</span>
                <strong>09</strong>
              </div>
              <div>
                <span>Applications Awaiting Appraisal</span>
                <strong>14</strong>
              </div>
              <div>
                <span>Checker Decisions Pending</span>
                <strong>06</strong>
              </div>
              <div>
                <span>Customer Documents Pending</span>
                <strong>11</strong>
              </div>
            </div>
          </section>

          <section className="insight-panel">
            <div className="panel-header">
              <div>
                <span className="section-eyebrow">Activity Trail</span>
                <h2>Recent Activity</h2>
                <p>Latest gold loan journey updates.</p>
              </div>
            </div>

            <div className="activity-list">
              {activityData.map((activity) => (
                <div className="activity-item" key={activity.title}>
                  <div className="activity-icon">{activity.icon}</div>
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.subtitle}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="static-table-grid">
          <div className="mini-table-panel">
            <div className="mini-table-header">
              <div>
                <span className="mini-table-icon">✓</span>
                <div>
                  <h3>Conversion Readiness</h3>
                  <p>Lead requirements pending before conversion</p>
                </div>
              </div>
              <button>View All</button>
            </div>

            <table className="mini-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Check</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {conversionQueue.map((row) => (
                  <tr key={`${row.lead}-${row.check}`}>
                    <td>
                      <strong>{row.applicant}</strong>
                      <span>{row.lead}</span>
                    </td>
                    <td>{row.check}</td>
                    <td>
                      <span className={`mini-pill ${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mini-table-panel">
            <div className="mini-table-header">
              <div>
                <span className="mini-table-icon">◇</span>
                <div>
                  <h3>Jewellery Appraisal Queue</h3>
                  <p>Applications awaiting appraiser action</p>
                </div>
              </div>
              <button>View All</button>
            </div>

            <table className="mini-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Stage</th>
                  <th>Aging</th>
                </tr>
              </thead>
              <tbody>
                {appraisalQueue.map((row) => (
                  <tr key={row.application}>
                    <td>
                      <strong>{row.application}</strong>
                      <span>{row.customer}</span>
                    </td>
                    <td>{row.stage}</td>
                    <td>{row.aging}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mini-table-panel">
            <div className="mini-table-header">
              <div>
                <span className="mini-table-icon">!</span>
                <div>
                  <h3>Document Exceptions</h3>
                  <p>Gold loan records requiring correction</p>
                </div>
              </div>
              <button>View All</button>
            </div>

            <table className="mini-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Issue</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {documentExceptions.map((row) => (
                  <tr key={`${row.lead}-${row.document}`}>
                    <td>
                      <strong>{row.lead}</strong>
                      <span>{row.document}</span>
                    </td>
                    <td>{row.issue}</td>
                    <td>
                      <span
                        className={`severity-pill ${row.severity.toLowerCase()}`}
                      >
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── CREATE LEAD DRAWER ─────────────────────────────── */}
      {isCreatePanelOpen && (
        <div className="drawer-backdrop" onClick={handleCloseCreatePanel}>
          <aside
            className="create-lead-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="drawer-eyebrow">Gold Loan Enquiry</span>
                <h2>Create Gold Loan Lead</h2>
                <p>
                  Capture the customer's contact details and enquiry source to
                  begin the gold loan journey.
                </p>
              </div>
              <button
                type="button"
                className="drawer-close-button"
                onClick={handleCloseCreatePanel}
                aria-label="Close create lead panel"
              >
                ×
              </button>
            </div>

            <form className="create-lead-form" onSubmit={handleCreateLead}>
              <div className="drawer-product-card">
                <div className="drawer-product-icon" aria-hidden="true">
                  <span>◆</span>
                  <small>916</small>
                </div>
                <div className="drawer-product-copy">
                  <span>Selected product</span>
                  <strong>YES BANK Gold Loan</strong>
                  <p>Quick enquiry capture · Branch-assisted journey</p>
                </div>
                <span className="drawer-stage-pill">
                  <i aria-hidden="true" /> New Lead
                </span>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>01</span>
                  <div>
                    <h3>Customer details</h3>
                    <p>
                      Capture the minimum information required to register the
                      enquiry.
                    </p>
                  </div>
                </div>

                <div className="form-grid two-column">
                  <div className="field-group">
                    <label htmlFor="firstName">
                      First Name <b aria-hidden="true">*</b>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={leadForm.firstName}
                      onChange={handleLeadFormChange}
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="lastName">
                      Last Name <b aria-hidden="true">*</b>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={leadForm.lastName}
                      onChange={handleLeadFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid two-column">
                  <div className="field-group">
                    <label htmlFor="mobile">
                      Mobile Number <b aria-hidden="true">*</b>
                    </label>
                    <div className="lead-input-with-prefix">
                      <span>+91</span>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        placeholder="10-digit mobile number"
                        value={leadForm.mobile}
                        onChange={handleLeadFormChange}
                        pattern="[6-9][0-9]{9}"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="email">
                      Email Address
                      <span className="optional-label">Optional</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="customer@example.com"
                      value={leadForm.email}
                      onChange={handleLeadFormChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>02</span>
                  <div>
                    <h3>Enquiry source</h3>
                    <p>Select how this gold loan opportunity was received.</p>
                  </div>
                </div>

                <div
                  className="source-choice-grid"
                  role="radiogroup"
                  aria-label="Lead source"
                >
                  {sourceOptions.map((source) => (
                    <button
                      key={source.value}
                      type="button"
                      role="radio"
                      aria-checked={leadForm.source === source.value}
                      className={`source-choice${
                        leadForm.source === source.value ? " selected" : ""
                      }`}
                      onClick={() => handleSourceSelect(source.value)}
                    >
                      <span className="source-choice-icon" aria-hidden="true">
                        {source.icon}
                      </span>
                      <span>
                        <strong>{source.value}</strong>
                        <small>{source.description}</small>
                      </span>
                      <i aria-hidden="true">✓</i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="drawer-info-heading">
                  <span aria-hidden="true">✓</span>
                  <div>
                    <strong>After the lead is created</strong>
                    <p>It will be assigned to you with status New.</p>
                  </div>
                </div>
                <div className="drawer-next-steps">
                  <span>
                    <b>1</b>Open Lead Detail
                  </span>
                  <i aria-hidden="true" />
                  <span>
                    <b>2</b>Complete address &amp; OVD
                  </span>
                  <i aria-hidden="true" />
                  <span>
                    <b>3</b>Convert eligible lead
                  </span>
                </div>
              </div>

              {createLeadError && (
                <div className="drawer-error-message" role="alert">
                  {createLeadError}
                </div>
              )}

              <div className="drawer-actions">
                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={handleCloseCreatePanel}
                  disabled={isCreatingLead}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="header-action-button create-action"
                  disabled={isCreatingLead}
                >
                  <span className="header-action-icon">＋</span>
                  {isCreatingLead ? "Creating Lead…" : "Create Gold Loan Lead"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
