import { useState } from "react";
import "./DashboardPage.css";

const listViews = [
  "All Leads",
  "My Leads",
  "New Leads",
  "In Progress Leads",
  "Converted Leads",
  "Disqualified Leads",
];

const productOptions = [
  "Home Loan",
  "Loan Against Property",
  "Working Capital",
  "Business Loan",
  "Personal Loan",
];

const sourceOptions = [
  "Website",
  "Mobile App",
  "Digital Aggregator",
  "Branch Walk-in",
  "Outbound Call",
  "Inbound Call",
  "Referral",
];

const emptyLeadForm = {
  firstName: "",
  lastName: "",
  mobile: "",
  product: "",
  source: "",
};

function DashboardPage({ leads, onCreateLead, onLogout, onOpenLeadDetails }) {
  const [selectedListView, setSelectedListView] = useState("All Leads");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);

  const filteredLeads = leads.filter((lead) => {
    if (selectedListView === "All Leads") return true;
    if (selectedListView === "My Leads") return lead.owner !== "Contact Center";
    if (selectedListView === "New Leads") return lead.status === "New";
    if (selectedListView === "In Progress Leads") return lead.status === "In Progress";
    if (selectedListView === "Converted Leads") return lead.status === "Converted";
    if (selectedListView === "Disqualified Leads") return lead.status === "Disqualified";

    return true;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const inProgressLeads = leads.filter((lead) => lead.status === "In Progress").length;
  const convertedLeads = leads.filter((lead) => lead.status === "Converted").length;

  const handleOpenCreatePanel = () => {
    setIsCreatePanelOpen(true);
  };

  const handleCloseCreatePanel = () => {
    setIsCreatePanelOpen(false);
    setLeadForm(emptyLeadForm);
  };

  const handleLeadFormChange = (event) => {
    const { name, value } = event.target;

    setLeadForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCreateLead = (event) => {
  event.preventDefault();

  const newLead = {
    id: `LD-${10021 + leads.length}`,
    firstName: leadForm.firstName,
    lastName: leadForm.lastName,
    mobile: leadForm.mobile,
    product: leadForm.product,
    source: leadForm.source,
    status: "New",
    owner: "Sales User",
    createdDate: "04 May 2026",
  };

  setSelectedListView("All Leads");
  handleCloseCreatePanel();

  onCreateLead(newLead);
};

  return (
    <div className="dashboard-page">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">LOS</div>
          <div>
            <h2>LOS Portal</h2>
            <p>Loan Origination</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Leads</button>
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

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="page-eyebrow">Lead Management</span>
            <h1>Dashboard</h1>
            <p>Track leads, list views, and loan origination activity.</p>
          </div>

          <div className="topbar-actions">
            <button className="ghost-button" onClick={onLogout}>
              Logout
            </button>

            <button className="primary-action-button" onClick={handleOpenCreatePanel}>
              + Create New Lead
            </button>
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <div>
              <span>Total Leads</span>
              <strong>{totalLeads}</strong>
            </div>
            <div className="kpi-icon">TL</div>
          </div>

          <div className="kpi-card">
            <div>
              <span>New Leads</span>
              <strong>{newLeads}</strong>
            </div>
            <div className="kpi-icon blue">NW</div>
          </div>

          <div className="kpi-card">
            <div>
              <span>In Progress</span>
              <strong>{inProgressLeads}</strong>
            </div>
            <div className="kpi-icon orange">IP</div>
          </div>

          <div className="kpi-card">
            <div>
              <span>Converted</span>
              <strong>{convertedLeads}</strong>
            </div>
            <div className="kpi-icon green">CV</div>
          </div>
        </section>

        <section className="lead-panel">
          <div className="lead-panel-header">
            <div>
              <h2>Lead List View</h2>
              <p>Showing records based on the selected list view.</p>
            </div>

            <div className="list-view-control">
              <label htmlFor="listView">List View</label>
              <select
                id="listView"
                value={selectedListView}
                onChange={(event) => setSelectedListView(event.target.value)}
              >
                {listViews.map((listView) => (
                  <option key={listView} value={listView}>
                    {listView}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="lead-table">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Customer Name</th>
                  <th>Mobile</th>
                  <th>Product</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Created Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <button
                        type="button"
                        className="lead-link-button"
                        onClick={() => onOpenLeadDetails(lead)}
                      >
                        {lead.id}
                      </button>
                    </td>

                    <td>
                      {lead.firstName} {lead.lastName}
                    </td>

                    <td>{lead.mobile}</td>
                    <td>{lead.product}</td>
                    <td>{lead.source}</td>

                    <td>
                      <span
                        className={`status-pill ${lead.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td>{lead.owner}</td>
                    <td>{lead.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isCreatePanelOpen && (
        <div className="drawer-backdrop" onClick={handleCloseCreatePanel}>
          <aside className="create-lead-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="drawer-eyebrow">New Lead</span>
                <h2>Create Lead</h2>
                <p>Capture basic lead information to start the loan journey.</p>
              </div>

              <button className="drawer-close-button" onClick={handleCloseCreatePanel}>
                ×
              </button>
            </div>

            <form className="create-lead-form" onSubmit={handleCreateLead}>
              <div className="form-section">
                <h3>Customer Information</h3>

                <div className="form-grid two-column">
                  <div className="field-group">
                    <label htmlFor="firstName">First Name</label>
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
                    <label htmlFor="lastName">Last Name</label>
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

                <div className="field-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Enter 10 digit mobile number"
                    value={leadForm.mobile}
                    onChange={handleLeadFormChange}
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Lead Details</h3>

                <div className="form-grid two-column">
                  <div className="field-group">
                    <label htmlFor="product">Product</label>
                    <select
                      id="product"
                      name="product"
                      value={leadForm.product}
                      onChange={handleLeadFormChange}
                      required
                    >
                      <option value="">Select product</option>
                      {productOptions.map((product) => (
                        <option key={product} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label htmlFor="source">Lead Source</label>
                    <select
                      id="source"
                      name="source"
                      value={leadForm.source}
                      onChange={handleLeadFormChange}
                      required
                    >
                      <option value="">Select source</option>
                      {sourceOptions.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="drawer-info-card">
                <strong>Default Status</strong>
                <p>
                  Newly created leads will be saved with status <b>New</b> and assigned to
                  the logged-in user for now. After creation, the lead details page will open.
                </p>
              </div>

              <div className="drawer-actions">
                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={handleCloseCreatePanel}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-action-button">
                  Create Lead
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