import { useMemo, useState } from "react";
import "./CoApplicantsPage.css";

import CustomerIdentityPage from "./CustomerIdentityPage";
import ApplicantProfilePage from "./ApplicantProfilePage";
import IncomeEmploymentPage from "./IncomeEmploymentPage";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.63 4.35 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M3 13h18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const partyTypes = [
  "Co-Applicant",
  "Guarantor",
  "Borrower",
  "Power of Attorney",
  "Property Owner",
  "Financial Co-Borrower",
];

const relationOptions = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Business Partner",
  "Director",
  "Other",
];

const existingParties = [
  {
    id: "COAPP-001",
    partyType: "Co-Applicant",
    name: "Priya Sharma",
    relation: "Spouse",
    mobile: "9876509876",
    email: "priya.sharma@email.com",
    pan: "ABCDE1234F",
    employmentType: "Salaried",
    income: "₹68,000",
    status: "Completed",
    mobileVerified: true,
    emailVerified: true,
  },
  {
    id: "GUAR-001",
    partyType: "Guarantor",
    name: "Mahesh Sharma",
    relation: "Father",
    mobile: "9988776655",
    email: "mahesh.sharma@email.com",
    pan: "BCDEF2345G",
    employmentType: "Retired",
    income: "₹42,000",
    status: "Pending Verification",
    mobileVerified: true,
    emailVerified: false,
  },
];

const defaultForm = {
  partyType: "Co-Applicant",
  relationshipWithApplicant: "Spouse",
  firstName: "",
  middleName: "",
  lastName: "",
  mobile: "",
  email: "",
  mobileVerified: false,
  emailVerified: false,
};

function Field({ label, children, required }) {
  return (
    <label className="co-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      className="co-input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      className="co-input co-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function DetailTabButton({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`co-panel-tab ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function PartyCard({ party, onEdit }) {
  const statusClass = party.status === "Completed" ? "completed" : "pending";

  return (
    <article className="co-party-card editable" onClick={() => onEdit(party)}>
      <div className="co-party-card-top">
        <div className="co-avatar">
          {party.name
            .split(" ")
            .map((item) => item[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="co-party-title">
          <span>{party.partyType}</span>
          <h4>{party.name}</h4>
          <p>
            {party.relation} · {party.employmentType}
          </p>
        </div>

        <div className="co-card-actions">
          <span className={`co-status-pill ${statusClass}`}>{party.status}</span>
          <button
            type="button"
            className="co-card-edit-btn"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(party);
            }}
          >
            <EditIcon />
            Edit
          </button>
        </div>
      </div>

      <div className="co-party-grid">
        <div>
          <span>Mobile</span>
          <strong>{party.mobile}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{party.email}</strong>
        </div>
        <div>
          <span>PAN</span>
          <strong>{party.pan}</strong>
        </div>
        <div>
          <span>Income</span>
          <strong>{party.income}</strong>
        </div>
      </div>

      <div className="co-verification-row">
        <span className={party.mobileVerified ? "done" : ""}>
          <PhoneIcon />
          {party.mobileVerified ? "Mobile Verified" : "Mobile Pending"}
        </span>
        <span className={party.emailVerified ? "done" : ""}>
          <MailIcon />
          {party.emailVerified ? "Email Verified" : "Email Pending"}
        </span>
      </div>
    </article>
  );
}

function CoApplicantsPage() {
  const [parties, setParties] = useState(existingParties);
  const [selectedPartyType, setSelectedPartyType] = useState("Co-Applicant");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState("minimal");
  const [activeTab, setActiveTab] = useState("identity");
  const [form, setForm] = useState(defaultForm);
  const [editingPartyId, setEditingPartyId] = useState(null);

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const getFullName = () =>
    [form.firstName, form.middleName, form.lastName]
      .filter(Boolean)
      .join(" ");

  const canContinueFromMinimal = Boolean(
    form.partyType &&
      form.relationshipWithApplicant &&
      form.firstName &&
      form.lastName &&
      form.mobile
  );

  const openAddPanel = () => {
    setEditingPartyId(null);

    setForm({
      ...defaultForm,
      partyType: selectedPartyType,
    });

    setDrawerStep("minimal");
    setActiveTab("identity");
    setIsPanelOpen(true);
  };

  const handleEditParty = (party) => {
    const nameParts = party.name.split(" ");

    setEditingPartyId(party.id);

    setForm({
      ...defaultForm,
      partyType: party.partyType,
      relationshipWithApplicant: party.relation,
      firstName: nameParts[0] || "",
      middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
      lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
      mobile: party.mobile === "Not captured" ? "" : party.mobile,
      email: party.email === "Not captured" ? "" : party.email,
      mobileVerified: Boolean(party.mobileVerified),
      emailVerified: Boolean(party.emailVerified),
    });

    setDrawerStep("details");
    setActiveTab("identity");
    setIsPanelOpen(true);
  };

  const verifyField = (key) => {
    updateForm(key, true);
  };

  const handleSaveParty = () => {
    const fullName = getFullName();
    const existingParty = editingPartyId
      ? parties.find((party) => party.id === editingPartyId)
      : null;

    const savedParty = {
      id: editingPartyId || `${form.partyType.toUpperCase().replaceAll(" ", "-")}-${Date.now()}`,
      partyType: form.partyType,
      name: fullName || "New Party",
      relation: form.relationshipWithApplicant,
      mobile: form.mobile || "Not captured",
      email: form.email || "Not captured",
      pan: existingParty?.pan || "Pending",
      employmentType: existingParty?.employmentType || "Pending",
      income: existingParty?.income || "Pending",
      status: form.mobileVerified && form.emailVerified ? "Completed" : "Pending Verification",
      mobileVerified: form.mobileVerified,
      emailVerified: form.emailVerified,
    };

    if (editingPartyId) {
      setParties((previous) =>
        previous.map((party) =>
          party.id === editingPartyId ? savedParty : party
        )
      );
    } else {
      setParties((previous) => [savedParty, ...previous]);
    }

    setEditingPartyId(null);
    setIsPanelOpen(false);
  };

  const handleCloseDrawer = () => {
    setEditingPartyId(null);
    setIsPanelOpen(false);
  };

  const completionStats = useMemo(() => {
    const completed = parties.filter((party) => party.status === "Completed").length;
    const pending = parties.length - completed;

    return {
      total: parties.length,
      completed,
      pending,
    };
  }, [parties]);

  return (
    <div className="co-applicants-page">
      <section className="co-hero-card">
        <div className="co-hero-left">
          <div className="co-icon-wrap">
            <UsersIcon />
          </div>
          <div>
            <span className="co-eyebrow">Step 04</span>
            <h3>Co-Applicants & Related Parties</h3>
            <p>
              Add co-applicants, guarantors, borrowers, POA holders and property owners linked to this loan application.
            </p>
          </div>
        </div>

        <div className="co-summary-strip">
          <div>
            <strong>{completionStats.total}</strong>
            <span>Total Parties</span>
          </div>
          <div>
            <strong>{completionStats.completed}</strong>
            <span>Completed</span>
          </div>
          <div>
            <strong>{completionStats.pending}</strong>
            <span>Pending</span>
          </div>
        </div>
      </section>

      <section className="co-toolbar-card">
        <div>
          <span className="co-eyebrow">Add New Party</span>
          <h4>Select the role to be added to this application</h4>
        </div>

        <div className="co-add-control">
          <select
            value={selectedPartyType}
            onChange={(event) => setSelectedPartyType(event.target.value)}
          >
            {partyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button type="button" onClick={openAddPanel}>
            <PlusIcon />
            Add {selectedPartyType}
          </button>
        </div>
      </section>

      <section className="co-content-layout">
        <main className="co-main">
          <section className="co-card">
            <div className="co-section-header">
              <div>
                <span className="co-eyebrow">Existing Records</span>
                <h4>Linked Parties</h4>
              </div>
            </div>

            <div className="co-party-list">
              {parties.map((party) => (
                <PartyCard
                  key={party.id}
                  party={party}
                  onEdit={handleEditParty}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className="co-side">
          <section className="co-side-card">
            <h4>Readiness Checklist</h4>
            <div className="co-checklist">
              <div className="done">
                <span>
                  <CheckIcon />
                </span>
                <strong>Primary applicant available</strong>
              </div>

              <div className={parties.length > 0 ? "done" : ""}>
                <span>{parties.length > 0 ? <CheckIcon /> : "•"}</span>
                <strong>At least one linked party added</strong>
              </div>

              <div className={completionStats.pending === 0 ? "done" : ""}>
                <span>{completionStats.pending === 0 ? <CheckIcon /> : "•"}</span>
                <strong>No pending verification</strong>
              </div>
            </div>
          </section>

          <section className="co-side-card soft">
            <h4>Party Type Guidance</h4>
            <div className="co-guidance-list">
              <p>
                <strong>Co-Applicant:</strong> Income or ownership linked applicant.
              </p>
              <p>
                <strong>Guarantor:</strong> Provides repayment support but may not be borrower.
              </p>
              <p>
                <strong>Borrower:</strong> Financially liable party on the loan.
              </p>
              <p>
                <strong>POA:</strong> Authorized representative for execution or documentation.
              </p>
            </div>
          </section>
        </aside>
      </section>

      {isPanelOpen && (
        <div className="co-drawer-overlay">
          <aside className="co-drawer wide">
            <header className="co-drawer-header">
              <div>
                <span className="co-eyebrow">
                  {editingPartyId ? "Edit Linked Party" : "New Linked Party"}
                </span>
                <h3>
                  {drawerStep === "minimal"
                    ? `${editingPartyId ? "Edit" : "Add"} ${form.partyType}`
                    : getFullName() || `${editingPartyId ? "Edit" : "Add"} ${form.partyType}`}
                </h3>
                <p>
                  {drawerStep === "minimal"
                    ? "Capture minimum required details first. Continue to identity, profile and income once the party is created."
                    : `${form.partyType} · ${form.relationshipWithApplicant} · ${form.mobile || "Mobile pending"}`}
                </p>
              </div>

              <button
                type="button"
                className="co-drawer-close"
                onClick={handleCloseDrawer}
              >
                <XIcon />
              </button>
            </header>

            <div className="co-drawer-body">
              {drawerStep === "minimal" && (
                <section className="co-minimal-screen">
                  <div className="co-minimal-left">
                    <div className="co-panel-section minimal">
                      <div className="co-panel-section-header">
                        <div>
                          <span className="co-eyebrow">Minimum Details</span>
                          <h4>Basic Party Information</h4>
                        </div>
                        <span className="co-muted-pill">Required First</span>
                      </div>

                      <div className="co-field-grid two">
                        <Field label="Party Type" required>
                          <SelectInput
                            value={form.partyType}
                            onChange={(value) => updateForm("partyType", value)}
                          >
                            {partyTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </SelectInput>
                        </Field>

                        <Field label="Relationship with Applicant" required>
                          <SelectInput
                            value={form.relationshipWithApplicant}
                            onChange={(value) => updateForm("relationshipWithApplicant", value)}
                          >
                            {relationOptions.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </SelectInput>
                        </Field>

                        <Field label="First Name" required>
                          <TextInput
                            value={form.firstName}
                            placeholder="First name"
                            onChange={(value) => updateForm("firstName", value)}
                          />
                        </Field>

                        <Field label="Middle Name">
                          <TextInput
                            value={form.middleName}
                            placeholder="Middle name"
                            onChange={(value) => updateForm("middleName", value)}
                          />
                        </Field>

                        <Field label="Last Name" required>
                          <TextInput
                            value={form.lastName}
                            placeholder="Last name"
                            onChange={(value) => updateForm("lastName", value)}
                          />
                        </Field>

                        <Field label="Mobile Number" required>
                          <div className="co-verify-input-row">
                            <TextInput
                              value={form.mobile}
                              placeholder="10-digit mobile"
                              onChange={(value) => updateForm("mobile", value)}
                            />
                            <button
                              type="button"
                              className={form.mobileVerified ? "verified" : ""}
                              onClick={() => verifyField("mobileVerified")}
                            >
                              {form.mobileVerified ? "Verified" : "Verify"}
                            </button>
                          </div>
                        </Field>

                        <Field label="Email Address">
                          <div className="co-verify-input-row">
                            <TextInput
                              type="email"
                              value={form.email}
                              placeholder="Email address"
                              onChange={(value) => updateForm("email", value)}
                            />
                            <button
                              type="button"
                              className={form.emailVerified ? "verified" : ""}
                              onClick={() => verifyField("emailVerified")}
                            >
                              {form.emailVerified ? "Verified" : "Verify"}
                            </button>
                          </div>
                        </Field>
                      </div>
                    </div>
                  </div>

                  <aside className="co-minimal-summary">
                    <div className="co-mini-profile-card">
                      <div className="co-avatar large">
                        {form.firstName || form.lastName
                          ? `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`
                          : "NA"}
                      </div>

                      <span>{form.partyType}</span>
                      <h4>{getFullName() || "New Linked Party"}</h4>
                      <p>{form.relationshipWithApplicant}</p>

                      <div className="co-mini-checks">
                        <div className={form.firstName && form.lastName ? "done" : ""}>
                          <span>{form.firstName && form.lastName ? <CheckIcon /> : "•"}</span>
                          Name captured
                        </div>
                        <div className={form.mobile ? "done" : ""}>
                          <span>{form.mobile ? <CheckIcon /> : "•"}</span>
                          Mobile captured
                        </div>
                        <div className={form.mobileVerified ? "done" : ""}>
                          <span>{form.mobileVerified ? <CheckIcon /> : "•"}</span>
                          Mobile verified
                        </div>
                        <div className={form.emailVerified ? "done" : ""}>
                          <span>{form.emailVerified ? <CheckIcon /> : "•"}</span>
                          Email verified
                        </div>
                      </div>
                    </div>
                  </aside>
                </section>
              )}

              {drawerStep === "details" && (
                <>
                  <div className="co-selected-party-strip">
                    <div>
                      <span className="co-eyebrow">Linked Party</span>
                      <strong>{getFullName() || "New Linked Party"}</strong>
                      <p>
                        {form.partyType} · {form.relationshipWithApplicant} ·{" "}
                        {form.mobile || "Mobile pending"}
                      </p>
                    </div>
                  </div>

                  <div className="co-panel-tabs embedded">
                    <DetailTabButton
                      active={activeTab === "identity"}
                      icon={<ShieldIcon />}
                      label="Customer Identity"
                      onClick={() => setActiveTab("identity")}
                    />
                    <DetailTabButton
                      active={activeTab === "profile"}
                      icon={<UserIcon />}
                      label="Applicant Profile"
                      onClick={() => setActiveTab("profile")}
                    />
                    <DetailTabButton
                      active={activeTab === "employment"}
                      icon={<BriefcaseIcon />}
                      label="Income & Employment"
                      onClick={() => setActiveTab("employment")}
                    />
                  </div>

                  <div className="co-embedded-step">
                    {activeTab === "identity" && <CustomerIdentityPage />}
                    {activeTab === "profile" && <ApplicantProfilePage />}
                    {activeTab === "employment" && <IncomeEmploymentPage />}
                  </div>
                </>
              )}
            </div>

            <footer className="co-drawer-footer">
              {drawerStep === "minimal" ? (
                <>
                  <button
                    type="button"
                    className="co-secondary-btn"
                    onClick={handleCloseDrawer}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="co-primary-btn"
                    disabled={!canContinueFromMinimal}
                    onClick={() => setDrawerStep("details")}
                  >
                    Continue to Details
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="co-secondary-btn"
                    onClick={handleCloseDrawer}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    className="co-primary-btn"
                    onClick={handleSaveParty}
                  >
                    {editingPartyId ? "Update" : "Save"} {form.partyType}
                  </button>
                </>
              )}
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CoApplicantsPage;