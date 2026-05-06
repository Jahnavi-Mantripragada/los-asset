import { useState } from "react";
import "./LeadDetailPage.css";

/* ══════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════ */
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const CollapseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ExpandIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.63 4.35 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const TaskIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const NoteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BanIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

/* ══════════════════════════════════════════
   DATA HELPERS
══════════════════════════════════════════ */
const buildLeadDetails = (lead) => ({
  firstName:              lead.firstName,
  lastName:               lead.lastName,
  mobile:                 lead.mobile           || "Not captured",
  email:                  lead.email            || "Not captured",
  alternateMobile:        lead.alternateMobile  || "—",
  applicantCategory:      lead.applicantCategory|| "Salaried",
  applicantType:          lead.applicantType    || "Individual",
  apsNumber:              lead.apsNumber        || "—",
  assignedTo:             lead.assignedTo       || "USR-1024",
  assignedToName:         lead.assignedToName   || lead.owner || "Sales User",
  balanceTransferBank:    lead.balanceTransferBank    || "—",
  balanceTransferBankName:lead.balanceTransferBankName|| "—",
  branchName:             lead.branchName       || "Mumbai Andheri Branch",
  btBankFunnel:           lead.btBankFunnel     || "—",
  constitutionType:       lead.constitutionType || "Individual",
  consumerSystemName:     lead.consumerSystemName|| "LOS Web",
  countryCode:            lead.countryCode      || "+91",
  daysSinceLastActivity:  lead.daysSinceLastActivity || "0",
  emailVerified:          lead.emailVerified    || "No",
  generationMode:         lead.generationMode   || "Manual",
  leadAge:                lead.leadAge          || "0 Days",
  leadNumber:             lead.id,
  leadOrigin:             lead.leadOrigin       || "Direct",
  leadStage:              lead.leadStage        || lead.status || "New",
  leadSubDisposition:     lead.leadSubDisposition || "—",
  leadSubSource:          lead.leadSubSource    || "—",
  leadSubSubSource:       lead.leadSubSubSource || "—",
  loanFileStatus:         lead.loanFileStatus   || "Lead Draft",
  loanPurpose:            lead.loanPurpose      || "Purchase",
  loanTenureYears:        lead.loanTenureYears  || "20",
  loanType:               lead.loanType         || lead.product || "Home Loan",
  losOwnerTeam:           lead.losOwnerTeam     || "Sales Team",
  losVerificationUser:    lead.losVerificationUser || "—",
  mobileVerified:         lead.mobileVerified   || "No",
  monthlyGrossSalary:     lead.monthlyGrossSalary || "₹85,000",
  ownerName:              lead.ownerName        || lead.owner || "Sales User",
  product:                lead.product          || "Home Loan",
  projectPropertyName:    lead.projectPropertyName || "—",
  propertyIdentified:     lead.propertyIdentified  || "No",
  requestedLoanAmount:    lead.requestedLoanAmount  || "₹45,00,000",
  residentialStatus:      lead.residentialStatus    || "Resident Indian",
  typeOfProperty:         lead.typeOfProperty       || "Flat / Apartment",
});

const STATUS_STEPS = ["New", "In Progress", "Converted"];

const formatTime = () =>
  new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const navItems = [
  { icon: "▦", label: "Dashboard", active: false, isBack: true  },
  { icon: "◎", label: "Leads",     active: true,  isBack: false },
  { icon: "▣", label: "Loan Files",active: false, isBack: false },
  { icon: "◌", label: "Applicants",active: false, isBack: false },
  { icon: "□", label: "Documents", active: false, isBack: false },
  { icon: "◇", label: "Approvals", active: false, isBack: false },
];

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

/* ── Editable Field ── */
function EditableField({ label, fieldKey, value, editingField, onEdit, onChange, onSave, onCancel }) {
  const isEditing = editingField?.key === fieldKey;
  return (
    <div className={`record-field${isEditing ? " editing" : ""}`}>
      <div className="record-field-content">
        <span>{label}</span>
        {isEditing ? (
          <>
            <input
              className="field-inline-input"
              value={editingField.value}
              onChange={(e) => onChange(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
            />
            <div className="field-inline-actions">
              <button className="field-save-btn" onClick={onSave}>✓ Save</button>
              <button className="field-cancel-btn" onClick={onCancel}>✕</button>
            </div>
          </>
        ) : (
          <strong>{value || "—"}</strong>
        )}
      </div>
      {!isEditing && (
        <button
          className="field-edit-btn"
          title={`Edit ${label}`}
          onClick={() => onEdit(fieldKey, value)}
        >
          <EditIcon />
        </button>
      )}
    </div>
  );
}

/* ── Section Wrapper ── */
function Section({ title, subtitle, children }) {
  return (
    <section className="record-section">
      <div className="record-section-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="record-field-grid">{children}</div>
    </section>
  );
}

/* ── Modal Base ── */
function Modal({ title, onClose, children, footer }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Log Call Modal ── */
function LogCallModal({ form, onChange, onSubmit, onClose }) {
  return (
    <Modal
      title="Log a Call"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-primary" onClick={onSubmit}>
            <PhoneIcon /> Log Call
          </button>
        </>
      }
    >
      <div className="form-row">
        <div className="form-group">
          <label>Call Type</label>
          <select
            className="form-select"
            value={form.callType || ""}
            onChange={(e) => onChange("callType", e.target.value)}
          >
            <option value="">Select…</option>
            <option value="Outbound">Outbound</option>
            <option value="Inbound">Inbound</option>
          </select>
        </div>
        <div className="form-group">
          <label>Duration (mins)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            placeholder="e.g. 5"
            value={form.duration || ""}
            onChange={(e) => onChange("duration", e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Outcome</label>
        <select
          className="form-select"
          value={form.outcome || ""}
          onChange={(e) => onChange("outcome", e.target.value)}
        >
          <option value="">Select outcome…</option>
          <option value="Interested">Interested</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Callback Requested">Callback Requested</option>
          <option value="No Answer">No Answer</option>
          <option value="Busy / Call Later">Busy / Call Later</option>
          <option value="Wrong Number">Wrong Number</option>
        </select>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea
          className="form-textarea"
          placeholder="Add call notes…"
          value={form.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </Modal>
  );
}

/* ── Create Task Modal ── */
function CreateTaskModal({ form, onChange, onSubmit, onClose }) {
  return (
    <Modal
      title="Create Task"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-primary" onClick={onSubmit}>
            <TaskIcon /> Create Task
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Task Title</label>
        <input
          className="form-input"
          placeholder="e.g. Follow up with applicant"
          value={form.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            className="form-input"
            type="date"
            value={form.dueDate || ""}
            onChange={(e) => onChange("dueDate", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            className="form-select"
            value={form.priority || "Medium"}
            onChange={(e) => onChange("priority", e.target.value)}
          >
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🔵 Low</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Assigned To</label>
        <input
          className="form-input"
          placeholder="e.g. Sales User"
          value={form.assignedTo || ""}
          onChange={(e) => onChange("assignedTo", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-textarea"
          placeholder="Task description…"
          value={form.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
    </Modal>
  );
}

/* ── Send Email Modal ── */
function SendEmailModal({ form, onChange, onSubmit, onClose, leadEmail }) {
  return (
    <Modal
      title="Send Email"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-primary" onClick={onSubmit}>
            <MailIcon /> Open in Mail App
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>To</label>
        <input
          className="form-input"
          type="email"
          placeholder="recipient@example.com"
          value={form.to !== undefined ? form.to : (leadEmail !== "Not captured" ? leadEmail : "")}
          onChange={(e) => onChange("to", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Subject</label>
        <input
          className="form-input"
          placeholder="Email subject"
          value={form.subject || ""}
          onChange={(e) => onChange("subject", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Body</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: 140 }}
          placeholder="Write your email…"
          value={form.body || ""}
          onChange={(e) => onChange("body", e.target.value)}
        />
      </div>
    </Modal>
  );
}

/* ── Disqualify Modal ── */
function DisqualifyModal({ form, onChange, onSubmit, onClose }) {
  return (
    <Modal
      title="Disqualify Lead"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-danger" onClick={onSubmit}>
            <BanIcon /> Disqualify Lead
          </button>
        </>
      }
    >
      <div className="modal-alert warning">
        <span className="modal-alert-icon">⚠️</span>
        <div>
          <strong>Confirm Disqualification</strong>
          <p>This lead will be marked as Disqualified. The action can be reversed by resetting the status.</p>
        </div>
      </div>
      <div className="form-group">
        <label>Reason for Disqualification</label>
        <select
          className="form-select"
          value={form.reason || ""}
          onChange={(e) => onChange("reason", e.target.value)}
        >
          <option value="">Select reason…</option>
          <option value="Not Eligible">Not Eligible</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Income Insufficient">Income Insufficient</option>
          <option value="Credit Score Low">Credit Score Low</option>
          <option value="Duplicate Lead">Duplicate Lead</option>
          <option value="No Response">No Response — Multiple Attempts</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Additional Notes</label>
        <textarea
          className="form-textarea"
          placeholder="Any additional context…"
          value={form.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </Modal>
  );
}

/* ── Convert Modal ── */
function ConvertModal({ onSubmit, onClose }) {
  return (
    <Modal
      title="Convert Lead"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-success" onClick={onSubmit}>
            <CheckIcon /> Convert Lead
          </button>
        </>
      }
    >
      <div className="modal-alert success">
        <span className="modal-alert-icon">✅</span>
        <div>
          <strong>Convert to Loan Application</strong>
          <p>
            A new Loan Application will be created from this lead. The lead status will be
            updated to <strong>Converted</strong> and a loan file will be initiated.
          </p>
        </div>
      </div>
    </Modal>
  );
}

/* ── Status Path ── */
function StatusPath({ currentStatus, onStepClick }) {
  const activeIdx = STATUS_STEPS.indexOf(currentStatus);
  return (
    <div className="status-path">
      {STATUS_STEPS.map((step, idx) => {
        const isActive    = currentStatus === step;
        const isCompleted = activeIdx > idx && currentStatus !== "Disqualified";
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              className={[
                "status-path-step",
                isActive    ? "active"    : "",
                isCompleted ? "completed" : "",
                step === "Converted" && isActive ? "converted-step" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onStepClick(step)}
              title={`Move to ${step}`}
            >
              {isCompleted && <span style={{ fontSize: 10 }}>✓</span>}
              {step}
            </button>
            {idx < STATUS_STEPS.length - 1 && (
              <span className="status-path-arrow"><ArrowRightIcon /></span>
            )}
          </div>
        );
      })}
      <div className="status-path-divider" />
      <button
        className={`status-path-step disqualified-step${currentStatus === "Disqualified" ? " active" : ""}`}
        onClick={() => onStepClick("Disqualified")}
        title="Disqualify this lead"
      >
        <BanIcon />
        Disqualified
      </button>
    </div>
  );
}

/* ── Activity Dot ── */
function ActivityDot({ type }) {
  const icons = { call: "📞", task: "✅", email: "✉️", status: "🔄" };
  return <div className={`activity-dot ${type}`}>{icons[type] || "●"}</div>;
}

/* ── Activity Item ── */
function ActivityItem({ item }) {
  return (
    <div className="activity-item">
      <ActivityDot type={item.type} />
      <div className="activity-body">
        <strong>{item.title}</strong>
        {item.desc && <p className="ab-desc">{item.desc}</p>}
        {item.details && (
          <div className="activity-card">
            {item.type === "call" && (
              <>
                {item.details.callType  && <div className="ac-row"><span className="ac-label">Type</span>    <span className="ac-value">{item.details.callType}</span></div>}
                {item.details.duration  && <div className="ac-row"><span className="ac-label">Duration</span><span className="ac-value">{item.details.duration} min</span></div>}
                {item.details.outcome   && <div className="ac-row"><span className="ac-label">Outcome</span> <span className="ac-value">{item.details.outcome}</span></div>}
                {item.details.notes     && <div className="ac-row"><span className="ac-label">Notes</span>   <span className="ac-value">{item.details.notes}</span></div>}
              </>
            )}
            {item.type === "task" && (
              <>
                {item.details.priority    && <div className="ac-row"><span className="ac-label">Priority</span>   <span className="ac-value"><span className={`task-chip ${item.details.priority.toLowerCase()}`}>{item.details.priority}</span></span></div>}
                {item.details.dueDate     && <div className="ac-row"><span className="ac-label">Due Date</span>   <span className="ac-value">{item.details.dueDate}</span></div>}
                {item.details.assignedTo  && <div className="ac-row"><span className="ac-label">Assigned</span>   <span className="ac-value">{item.details.assignedTo}</span></div>}
                {item.details.description && <div className="ac-row"><span className="ac-label">Desc</span>       <span className="ac-value">{item.details.description}</span></div>}
              </>
            )}
            {item.type === "email" && (
              <>
                {item.details.to      && <div className="ac-row"><span className="ac-label">To</span>      <span className="ac-value">{item.details.to}</span></div>}
                {item.details.subject && <div className="ac-row"><span className="ac-label">Subject</span> <span className="ac-value">{item.details.subject}</span></div>}
              </>
            )}
          </div>
        )}
        <time>{item.time}</time>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
function LeadDetailPage({ lead, onBack, onLogout, onConvertLead }) {  /* ── Initial data ── */
  const initialData = buildLeadDetails(lead);

  /* ── State ── */
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab]                   = useState("overview");
  const [leadStatus, setLeadStatus]                 = useState(initialData.leadStage);
  const [leadData,   setLeadData]                   = useState(initialData);
  const [activities, setActivities]                 = useState([
    {
      id: 1, type: "status",
      title: "Lead Created",
      desc:  `Created via ${initialData.generationMode} · Source: ${initialData.leadOrigin}`,
      time:  "Today, 9:30 AM",
    },
  ]);
  const [editingField, setEditingField] = useState(null); // { key, value }
  const [showModal,    setShowModal]    = useState(null); // 'call'|'task'|'email'|'disqualify'|'convert'
  const [modalForm,    setModalForm]    = useState({});
  const [verifiedItems, setVerifiedItems] = useState({ mobile: false, email: false });

  /* ── Field edit helpers ── */
  const handleFieldEdit   = (key, val) => setEditingField({ key, value: val });
  const handleFieldChange = (val) => setEditingField((prev) => ({ ...prev, value: val }));
  const handleFieldSave   = () => {
    if (editingField) {
      setLeadData((prev) => ({ ...prev, [editingField.key]: editingField.value }));
      setEditingField(null);
    }
  };
  const handleFieldCancel = () => setEditingField(null);

  /* ── Modal form helper ── */
  const handleModalChange = (field, val) =>
    setModalForm((prev) => ({ ...prev, [field]: val }));

  /* ── Add activity helper ── */
  const addActivity = (item) =>
    setActivities((prev) => [{ id: Date.now(), ...item, time: formatTime() }, ...prev]);

  /* ── Activity submit handlers ── */
  const handleLogCall = () => {
    addActivity({
      type:  "call",
      title: `${modalForm.callType || "Outbound"} Call Logged`,
      desc:  `Outcome: ${modalForm.outcome || "N/A"} · Duration: ${modalForm.duration || "N/A"} min`,
      details: { ...modalForm },
    });
    setShowModal(null); setModalForm({});
  };

  const handleCreateTask = () => {
    addActivity({
      type:  "task",
      title: modalForm.title || "New Task",
      desc:  `Priority: ${modalForm.priority || "Medium"} · Due: ${modalForm.dueDate || "Not set"}`,
      details: { ...modalForm },
    });
    setShowModal(null); setModalForm({});
  };

  const handleSendEmail = () => {
    const to      = modalForm.to      || "";
    const subject = modalForm.subject || "";
    const body    = modalForm.body    || "";
    window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    addActivity({
      type:  "email",
      title: `Email: ${subject || "(No subject)"}`,
      desc:  `To: ${to || "N/A"}`,
      details: { ...modalForm },
    });
    setShowModal(null); setModalForm({});
  };

  const handleDisqualify = () => {
    setLeadStatus("Disqualified");
    setLeadData((prev) => ({ ...prev, leadStage: "Disqualified" }));
    addActivity({
      type:  "status",
      title: "Lead Disqualified",
      desc:  `Reason: ${modalForm.reason || "Not specified"}${modalForm.notes ? ` · ${modalForm.notes}` : ""}`,
    });
    setShowModal(null); setModalForm({});
  };

  const handleConvert = () => {
  const convertedLead = {
    ...lead,
    ...leadData,
    id: leadData.leadNumber,
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    mobile: leadData.mobile,
    email: leadData.email,
    product: leadData.product,
    status: "Converted",
    leadStage: "Converted",
    loanFileStatus: "Application In Progress",
  };

  setLeadStatus("Converted");

  setLeadData((prev) => ({
    ...prev,
    leadStage: "Converted",
    loanFileStatus: "Application In Progress",
  }));

  addActivity({
    type: "status",
    title: "Lead Converted to Loan Application",
    desc: "Lead successfully converted. New loan file initiated.",
  });

  setShowModal(null);

  if (onConvertLead) {
    onConvertLead(convertedLead);
  }
};

  const handleStatusStep = (step) => {
    if (step === leadStatus) return;
    if (step === "Disqualified") { setShowModal("disqualify"); return; }
    if (step === "Converted")    { setShowModal("convert");    return; }
    const prev = leadStatus;
    setLeadStatus(step);
    setLeadData((d) => ({ ...d, leadStage: step }));
    addActivity({ type: "status", title: `Status → ${step}`, desc: `Changed from "${prev}" to "${step}"` });
  };

  const handleVerify = (key) => {
    setVerifiedItems((prev) => ({ ...prev, [key]: true }));
    setLeadData((prev) => ({
      ...prev,
      [key === "mobile" ? "mobileVerified" : "emailVerified"]: "Yes",
    }));
    addActivity({
      type:  "status",
      title: `${key.charAt(0).toUpperCase() + key.slice(1)} Verified`,
      desc:  `${key.charAt(0).toUpperCase() + key.slice(1)} verification completed successfully.`,
    });
  };

  /* ── Field props shorthand ── */
  const fp = (key) => ({
    fieldKey: key,
    value: leadData[key] ?? "—",
    editingField,
    onEdit:   handleFieldEdit,
    onChange: handleFieldChange,
    onSave:   handleFieldSave,
    onCancel: handleFieldCancel,
  });

  /* ── Status pill class ── */
  const statusClass = leadStatus.toLowerCase().replace(" ", "-");

  /* ── Journey step logic ── */
  const journeyStepIndex = (() => {
    if (leadStatus === "Converted")    return 3;
    if (leadStatus === "Disqualified") return 1;
    if (leadStatus === "In Progress")  return 2;
    return 1;
  })();

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <div className="lead-detail-layout">

      {/* ─── SIDEBAR ───────────────────────── */}
      <aside className={`app-sidebar${isSidebarCollapsed ? " collapsed" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img
              src="/images/logo.png"
              alt="LOS"
              className="sidebar-logo-img"
              onError={(e) => { e.target.style.display = "none"; e.target.parentNode.textContent = "LOS"; }}
            />
          </div>
          <div className="sidebar-brand-text">
            <h2>LOS Portal</h2>
            <p>Loan Origination Workspace</p>
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
              onClick={item.isBack ? onBack : undefined}
              title={item.label}
              data-label={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-insight-card">
          <span>Lead Context</span>
          <strong>{leadData.leadNumber} — {leadData.firstName} {leadData.lastName}</strong>
          <p>{leadData.product} · {leadData.branchName}</p>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">SU</div>
          <div className="sidebar-footer-info">
            <p>Logged in as</p>
            <strong>Sales User</strong>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ──────────────────────────── */}
      <main className="lead-detail-main">

        {/* ════ TOPBAR ════ */}
        <header className="record-topbar">
          <div className="record-topbar-left">
            <button className="back-btn" onClick={onBack}>
              <BackIcon /> Back to Dashboard
            </button>

            <div className="record-title-row">
              <div className="record-avatar">
                {leadData.firstName?.charAt(0)}{leadData.lastName?.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="page-eyebrow">Lead Record</span>
                <div className="record-title-line">
                  <h1>{leadData.firstName} {leadData.lastName}</h1>
                  <span className={`status-pill ${statusClass}`}>{leadStatus}</span>
                </div>
                <p className="record-meta">
                  {leadData.leadNumber} · {leadData.product} · {leadData.branchName}
                </p>
                {/* Status path */}
                <StatusPath currentStatus={leadStatus} onStepClick={handleStatusStep} />
              </div>
            </div>

            {/* Highlights panel */}
            <div className="highlights-panel">
              <div className="highlight-chip">
                <span className="hc-label">Loan Amt</span>
                <strong className="hc-val">{leadData.requestedLoanAmount}</strong>
              </div>
              <div className="highlight-chip">
                <span className="hc-label">Tenure</span>
                <strong className="hc-val">{leadData.loanTenureYears} yrs</strong>
              </div>
              <div className="highlight-chip">
                <span className="hc-label">Assigned To</span>
                <strong className="hc-val">{leadData.assignedToName}</strong>
              </div>
              <div className={`highlight-chip ${leadData.mobileVerified === "Yes" ? "green" : "amber"}`}>
                <span className="hc-label">Mobile</span>
                <strong className="hc-val">
                  {leadData.mobileVerified === "Yes" ? "✓ Verified" : "⚠ Unverified"}
                </strong>
              </div>
              <div className="highlight-chip">
                <span className="hc-label">Lead Age</span>
                <strong className="hc-val">{leadData.leadAge}</strong>
              </div>
              <div className="highlight-chip">
                <span className="hc-label">Salary</span>
                <strong className="hc-val">{leadData.monthlyGrossSalary}</strong>
              </div>
              <div className="highlight-chip">
                <span className="hc-label">Product</span>
                <strong className="hc-val">{leadData.loanType}</strong>
              </div>
            </div>
          </div>

          {/* Top-right action buttons */}
          <div className="record-actions">
            <button className="record-action-logout" onClick={onLogout}>
              <LogoutIcon /> Sign Out
            </button>
            {leadStatus !== "Disqualified" && leadStatus !== "Converted" && (
              <button className="record-action-danger" onClick={() => setShowModal("disqualify")}>
                <BanIcon /> Disqualify
              </button>
            )}
            {leadStatus !== "Converted" && leadStatus !== "Disqualified" && (
              <button className="record-action-success" onClick={() => setShowModal("convert")}>
                <CheckIcon /> Convert Lead
              </button>
            )}
            {leadStatus === "Converted" && (
              <button
                className="record-action-success"
                onClick={() =>
                  onConvertLead &&
                  onConvertLead({
                    ...lead,
                    ...leadData,
                    id: leadData.leadNumber,
                    firstName: leadData.firstName,
                    lastName: leadData.lastName,
                    mobile: leadData.mobile,
                    email: leadData.email,
                    product: leadData.product,
                    status: "Converted",
                    leadStage: "Converted",
                    loanFileStatus: "Application In Progress",
                  })
                }
              >
                <CheckIcon /> Open Application
              </button>
            )}

            {leadStatus === "Disqualified" && (
              <button className="record-action-outline" onClick={() => handleStatusStep("New")}>
                ↩ Reset to New
              </button>
            )}
          </div>
        </header>

        {/* ════ TABS ════ */}
        <div className="record-tabs">
          {[
            { id: "overview",     label: "Overview",     badge: null             },
            { id: "activity",     label: "Activity",     badge: activities.length },
            { id: "documents",    label: "Documents",    badge: null             },
            { id: "verification", label: "Verification", badge: null             },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`record-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.badge != null && <span className="tab-badge">{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="record-page-grid">

            {/* Main column */}
            <div className="record-main-col">

              <Section title="Primary Lead Information" subtitle="Core details captured for this lead.">
                <EditableField label="Lead Number"               {...fp("leadNumber")} />
                <EditableField label="Product"                   {...fp("product")} />
                <EditableField label="Lead Stage"                {...fp("leadStage")} />
                <EditableField label="Lead Origin"               {...fp("leadOrigin")} />
                <EditableField label="Lead Sub Source"           {...fp("leadSubSource")} />
                <EditableField label="Lead Sub Sub Source"       {...fp("leadSubSubSource")} />
                <EditableField label="Lead Sub Disposition"      {...fp("leadSubDisposition")} />
                <EditableField label="Generation Mode"           {...fp("generationMode")} />
                <EditableField label="Consumer System Name"      {...fp("consumerSystemName")} />
                <EditableField label="Lead Age"                  {...fp("leadAge")} />
                <EditableField label="Days Since Last Activity"  {...fp("daysSinceLastActivity")} />
              </Section>

              <Section title="Customer & Contact Information" subtitle="Applicant identity and contact details.">
                <EditableField label="First Name"         {...fp("firstName")} />
                <EditableField label="Last Name"          {...fp("lastName")} />
                <EditableField label="Country Code"       {...fp("countryCode")} />
                <EditableField label="Mobile"             {...fp("mobile")} />
                <EditableField label="Alternate Mobile"   {...fp("alternateMobile")} />
                <EditableField label="Email"              {...fp("email")} />
                <EditableField label="Mobile Verified?"   {...fp("mobileVerified")} />
                <EditableField label="Email Verified?"    {...fp("emailVerified")} />
                <EditableField label="Residential Status" {...fp("residentialStatus")} />
              </Section>

              <Section title="Applicant Details" subtitle="Applicant profile and employment category.">
                <EditableField label="Applicant Type"        {...fp("applicantType")} />
                <EditableField label="Applicant Category"    {...fp("applicantCategory")} />
                <EditableField label="Constitution Type"     {...fp("constitutionType")} />
                <EditableField label="Monthly Gross Salary"  {...fp("monthlyGrossSalary")} />
              </Section>

              <Section title="Loan Details" subtitle="Loan requirement, purpose, tenure, and property.">
                <EditableField label="Loan Type"               {...fp("loanType")} />
                <EditableField label="Loan Purpose"            {...fp("loanPurpose")} />
                <EditableField label="Requested Loan Amount"   {...fp("requestedLoanAmount")} />
                <EditableField label="Loan Tenure (Years)"     {...fp("loanTenureYears")} />
                <EditableField label="Property Identified"     {...fp("propertyIdentified")} />
                <EditableField label="Project / Property Name" {...fp("projectPropertyName")} />
                <EditableField label="Type of Property"        {...fp("typeOfProperty")} />
              </Section>

              <Section title="Balance Transfer Details" subtitle="Balance transfer bank information, if applicable.">
                <EditableField label="Balance Transfer Bank"      {...fp("balanceTransferBank")} />
                <EditableField label="Balance Transfer Bank Name" {...fp("balanceTransferBankName")} />
                <EditableField label="BT Bank (Funnel)"           {...fp("btBankFunnel")} />
              </Section>

              <Section title="Ownership & Assignment" subtitle="Team, owner, branch, and verification assignment.">
                <EditableField label="Owner Name"            {...fp("ownerName")} />
                <EditableField label="LOS Owner Team"        {...fp("losOwnerTeam")} />
                <EditableField label="Assigned To"           {...fp("assignedTo")} />
                <EditableField label="Assigned To Name"      {...fp("assignedToName")} />
                <EditableField label="Branch Name"           {...fp("branchName")} />
                <EditableField label="LOS Verification User" {...fp("losVerificationUser")} />
              </Section>

              <Section title="Application & APS Information" subtitle="Application linkage and APS details.">
                <EditableField label="APS Number"       {...fp("apsNumber")} />
                <EditableField label="Loan File Status" {...fp("loanFileStatus")} />
              </Section>
            </div>

            {/* Side column */}
            <aside className="record-side-col">

              {/* Verification card */}
              <section className="side-card">
                <h3>Verification</h3>
                {[
                  { key: "mobile", label: "Mobile", value: leadData.mobile,  status: leadData.mobileVerified },
                  { key: "email",  label: "Email",  value: leadData.email,   status: leadData.emailVerified  },
                ].map((item) => (
                  <div className="verify-row" key={item.key}>
                    <div>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <p>Status: {item.status}</p>
                    </div>
                    <button
                      className={`verify-chip${verifiedItems[item.key] ? " verified" : ""}`}
                      onClick={() => !verifiedItems[item.key] && handleVerify(item.key)}
                    >
                      {verifiedItems[item.key] ? "✓ Verified" : "Verify"}
                    </button>
                  </div>
                ))}
              </section>

              {/* Lead Journey card */}
              <section className="side-card">
                <h3>Lead Journey</h3>
                <div className="journey-list">
                  {[
                    { num: 1, title: "Lead Created",  desc: "Basic lead details are captured.",              threshold: 1 },
                    { num: 2, title: "Verification",  desc: "Mobile, email, and applicant checks completed.", threshold: 2 },
                    { num: 3, title: "Application",   desc: "Convert lead and create loan application.",      threshold: 3 },
                  ].map((step) => {
                    const isActive    = journeyStepIndex === step.threshold;
                    const isCompleted = journeyStepIndex > step.threshold;
                    return (
                      <div
                        key={step.num}
                        className={`journey-step${isActive ? " active" : ""}${isCompleted ? " completed" : ""}`}
                      >
                        <div className="journey-num">
                          {isCompleted ? "✓" : step.num}
                        </div>
                        <div>
                          <strong>{step.title}</strong>
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Quick Actions card */}
              <section className="side-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="quick-btn" onClick={() => { setActiveTab("activity"); setShowModal("call"); }}>
                    📞 Log a Call
                  </button>
                  <button className="quick-btn" onClick={() => { setActiveTab("activity"); setShowModal("task"); }}>
                    ✅ Create Task
                  </button>
                  <button className="quick-btn" onClick={() => { setActiveTab("activity"); setShowModal("email"); }}>
                    ✉️ Send Email
                  </button>
                  <button
                    className="quick-btn primary"
                    onClick={() => {
                      if (leadStatus === "Converted") {
                        onConvertLead &&
                          onConvertLead({
                            ...lead,
                            ...leadData,
                            id: leadData.leadNumber,
                            firstName: leadData.firstName,
                            lastName: leadData.lastName,
                            mobile: leadData.mobile,
                            email: leadData.email,
                            product: leadData.product,
                            status: "Converted",
                            leadStage: "Converted",
                            loanFileStatus: "Application In Progress",
                          });
                        return;
                      }

                      setShowModal("convert");
                    }}
                    disabled={leadStatus === "Disqualified"}
                    style={leadStatus === "Disqualified" ? { opacity: 0.5, cursor: "default" } : {}}
                  >
                    {leadStatus === "Converted" ? "Open Application" : "Convert Lead"}
                  </button>
                </div>
              </section>

            </aside>
          </div>
        )}

        {/* ════════════════════════════════════
            TAB: ACTIVITY
        ════════════════════════════════════ */}
        {activeTab === "activity" && (
          <div className="activity-layout">
            {/* Action bar */}
            <div className="activity-action-bar">
              <button
                className="activity-action-btn call-btn"
                onClick={() => setShowModal("call")}
              >
                <span className="aab-icon"><PhoneIcon /></span>
                Log Call
              </button>
              <button
                className="activity-action-btn task-btn"
                onClick={() => setShowModal("task")}
              >
                <span className="aab-icon"><TaskIcon /></span>
                Create Task
              </button>
              <button
                className="activity-action-btn email-btn"
                onClick={() => setShowModal("email")}
              >
                <span className="aab-icon"><MailIcon /></span>
                Send Email
              </button>
              <button
                className="activity-action-btn note-btn"
                title="Notes — coming soon"
                disabled
              >
                <span className="aab-icon"><NoteIcon /></span>
                Notes
              </button>
            </div>

            {/* Timeline */}
            <section className="activity-section">
              <div className="activity-section-header">
                <h3>Activity Timeline</h3>
                <span style={{ fontSize: 12, color: "var(--ld-muted)", fontWeight: 650 }}>
                  {activities.length} {activities.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="activity-timeline">
                {activities.length === 0 ? (
                  <div className="activity-empty">
                    <span className="empty-icon">📋</span>
                    <strong>No activity yet</strong>
                    <p>Log a call, create a task, or send an email to get started.</p>
                  </div>
                ) : (
                  activities.map((item) => <ActivityItem key={item.id} item={item} />)
                )}
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════
            TAB: DOCUMENTS
        ════════════════════════════════════ */}
        {activeTab === "documents" && (
          <section className="record-section">
            <div className="record-section-header">
              <div>
                <h3>Documents</h3>
                <p>Upload and manage documents for this lead.</p>
              </div>
            </div>
            <div className="doc-placeholder">
              <span className="doc-icon"><FileIcon /></span>
              <strong>No documents uploaded yet</strong>
              <p>
                Upload identity proof, income documents, property papers, and other
                supporting files for this lead application.
              </p>
              <button className="doc-upload-btn" onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.click();
              }}>
                + Upload Document
              </button>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════
            TAB: VERIFICATION
        ════════════════════════════════════ */}
        {activeTab === "verification" && (
          <div className="verification-grid">

            {/* Mobile verification */}
            <div className="verif-card">
              <div className="verif-card-header">
                <strong><ShieldIcon /> Mobile Verification</strong>
                <span className={`verif-status-badge ${leadData.mobileVerified === "Yes" ? "verified" : "unverified"}`}>
                  {leadData.mobileVerified === "Yes" ? "✓ Verified" : "⚠ Pending"}
                </span>
              </div>
              <div className="verif-card-body">
                <p>Mobile Number</p>
                <strong>{leadData.mobile}</strong>
                <p style={{ marginBottom: 0, fontSize: 12 }}>
                  {leadData.mobileVerified === "Yes"
                    ? "Mobile number has been verified via OTP."
                    : "An OTP will be sent to this number for verification."}
                </p>
                <button
                  className={`verif-action-btn${verifiedItems.mobile ? " done" : ""}`}
                  onClick={() => !verifiedItems.mobile && handleVerify("mobile")}
                >
                  {verifiedItems.mobile ? "✓ Mobile Verified" : "Send OTP & Verify"}
                </button>
              </div>
            </div>

            {/* Email verification */}
            <div className="verif-card">
              <div className="verif-card-header">
                <strong><MailIcon /> Email Verification</strong>
                <span className={`verif-status-badge ${leadData.emailVerified === "Yes" ? "verified" : "unverified"}`}>
                  {leadData.emailVerified === "Yes" ? "✓ Verified" : "⚠ Pending"}
                </span>
              </div>
              <div className="verif-card-body">
                <p>Email Address</p>
                <strong>{leadData.email}</strong>
                <p style={{ marginBottom: 0, fontSize: 12 }}>
                  {leadData.emailVerified === "Yes"
                    ? "Email address has been verified."
                    : "A verification link will be sent to this email."}
                </p>
                <button
                  className={`verif-action-btn${verifiedItems.email ? " done" : ""}`}
                  onClick={() => !verifiedItems.email && handleVerify("email")}
                >
                  {verifiedItems.email ? "✓ Email Verified" : "Send Verification Link"}
                </button>
              </div>
            </div>

            {/* Identity KYC */}
            <div className="verif-card">
              <div className="verif-card-header">
                <strong>🪪 Identity KYC</strong>
                <span className="verif-status-badge unverified">⚠ Pending</span>
              </div>
              <div className="verif-card-body">
                <p>Applicant Type</p>
                <strong>{leadData.applicantType} — {leadData.applicantCategory}</strong>
                <p style={{ marginBottom: 0, fontSize: 12 }}>
                  Upload PAN, Aadhaar, or passport to complete KYC verification.
                </p>
                <button className="verif-action-btn" onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,.pdf";
                  input.click();
                }}>
                  Upload KYC Documents
                </button>
              </div>
            </div>

            {/* Income verification */}
            <div className="verif-card">
              <div className="verif-card-header">
                <strong>💰 Income Verification</strong>
                <span className="verif-status-badge unverified">⚠ Pending</span>
              </div>
              <div className="verif-card-body">
                <p>Declared Monthly Gross Salary</p>
                <strong>{leadData.monthlyGrossSalary}</strong>
                <p style={{ marginBottom: 0, fontSize: 12 }}>
                  Upload salary slips, Form 16, or bank statements to verify income.
                </p>
                <button className="verif-action-btn" onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,.pdf";
                  input.click();
                }}>
                  Upload Income Proof
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ════════════════════════════════════
          MODALS
      ════════════════════════════════════ */}
      {showModal === "call" && (
        <LogCallModal
          form={modalForm}
          onChange={handleModalChange}
          onSubmit={handleLogCall}
          onClose={() => { setShowModal(null); setModalForm({}); }}
        />
      )}
      {showModal === "task" && (
        <CreateTaskModal
          form={modalForm}
          onChange={handleModalChange}
          onSubmit={handleCreateTask}
          onClose={() => { setShowModal(null); setModalForm({}); }}
        />
      )}
      {showModal === "email" && (
        <SendEmailModal
          form={modalForm}
          onChange={handleModalChange}
          onSubmit={handleSendEmail}
          onClose={() => { setShowModal(null); setModalForm({}); }}
          leadEmail={leadData.email}
        />
      )}
      {showModal === "disqualify" && (
        <DisqualifyModal
          form={modalForm}
          onChange={handleModalChange}
          onSubmit={handleDisqualify}
          onClose={() => { setShowModal(null); setModalForm({}); }}
        />
      )}
      {showModal === "convert" && (
        <ConvertModal
          onSubmit={handleConvert}
          onClose={() => setShowModal(null)}
        />
      )}

    </div>
  );
}

export default LeadDetailPage;