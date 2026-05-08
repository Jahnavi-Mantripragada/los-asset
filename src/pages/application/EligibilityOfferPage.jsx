import { useMemo, useState } from "react";
import "./EligibilityOfferPage.css";

/* ── Icons ───────────────────────────────────────────────────────── */
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" /><path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" /><path d="M6 22v-4H2" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

/* ── Data ────────────────────────────────────────────────────────── */
const initialInputs = {
  product:              "Home Loan",
  loanType:             "New Loan",
  loanPurpose:          "Purchase of New Property",
  requestedLoanAmount:  "4500000",
  requestedTenureYears: "20",
  applicantCategory:    "Salaried",
  monthlyIncome:        "85000",
  existingObligations:  "18000",
  bureauScore:          "748",
  bureauStatus:         "Bureau Pulled",
  collateralValue:      "8400000",
  documentStatus:       "Partially Complete",
};

const breScenarioOptions = [
  { value: "green", label: "Green",  desc: "No policy blockers, full eligibility." },
  { value: "amber", label: "Amber",  desc: "Eligible with pending prerequisites." },
  { value: "red",   label: "Red",    desc: "Hard policy blocker at this stage." },
];

const ruleSets = {
  green: [
    { id: "BRE-G-001", category: "Identity",   ruleName: "PAN verification completed",                    result: "Green", severity: "High",   value: "Verified",                                   expected: "PAN must be verified before eligibility calculation" },
    { id: "BRE-G-002", category: "Bureau",     ruleName: "Bureau report available",                       result: "Green", severity: "High",   value: "Bureau pulled successfully",                 expected: "Bureau report should be available" },
    { id: "BRE-G-003", category: "Bureau",     ruleName: "Bureau score acceptable",                       result: "Green", severity: "High",   value: "748",                                        expected: "Acceptable as per product policy" },
    { id: "BRE-G-004", category: "Income",     ruleName: "Income details captured",                       result: "Green", severity: "High",   value: "Salary income captured",                     expected: "Income details should be available" },
    { id: "BRE-G-005", category: "Documents",  ruleName: "Minimum documents available",                   result: "Green", severity: "Medium", value: "Minimum documents available",                expected: "Minimum KYC and income documents required" },
    { id: "BRE-G-006", category: "Collateral", ruleName: "Collateral details captured",                   result: "Green", severity: "High",   value: "Property identified and valuation captured", expected: "Collateral details required for secured loan" },
    { id: "BRE-G-007", category: "Product",    ruleName: "Requested product and tenure allowed",           result: "Green", severity: "Low",    value: "Home Loan · 20 years",                       expected: "Within product policy" },
  ],
  amber: [
    { id: "BRE-A-001", category: "Identity",   ruleName: "PAN verification completed",                    result: "Green", severity: "High",   value: "Verified",                                   expected: "PAN must be verified before eligibility calculation" },
    { id: "BRE-A-002", category: "Bureau",     ruleName: "Bureau report available",                       result: "Green", severity: "High",   value: "Bureau pulled successfully",                 expected: "Bureau report should be available" },
    { id: "BRE-A-003", category: "Bureau",     ruleName: "Bureau score acceptable",                       result: "Green", severity: "High",   value: "748",                                        expected: "Acceptable as per product policy" },
    { id: "BRE-A-004", category: "Income",     ruleName: "Income details captured",                       result: "Green", severity: "High",   value: "Salary income captured",                     expected: "Income details should be available" },
    { id: "BRE-A-005", category: "Documents",  ruleName: "All mandatory documents uploaded",              result: "Amber", severity: "Medium", value: "Some mandatory documents pending",            expected: "Required before application submission" },
    { id: "BRE-A-006", category: "Collateral", ruleName: "Legal and technical reports available",         result: "Amber", severity: "High",   value: "Not initiated",                              expected: "Required before credit appraisal / sanction" },
    { id: "BRE-A-007", category: "Product",    ruleName: "Requested product and tenure allowed",           result: "Green", severity: "Low",    value: "Home Loan · 20 years",                       expected: "Within product policy" },
  ],
  red: [
    { id: "BRE-R-001", category: "Identity",   ruleName: "PAN verification completed",                    result: "Green", severity: "High",   value: "Verified",                                   expected: "PAN must be verified before eligibility calculation" },
    { id: "BRE-R-002", category: "Bureau",     ruleName: "Bureau report available",                       result: "Green", severity: "High",   value: "Bureau pulled successfully",                 expected: "Bureau report should be available" },
    { id: "BRE-R-003", category: "Bureau",     ruleName: "Bureau score acceptable",                       result: "Red",   severity: "High",   value: "598",                                        expected: "Acceptable as per product policy" },
    { id: "BRE-R-004", category: "Income",     ruleName: "Income details captured",                       result: "Amber", severity: "High",   value: "Income available but bank statement pending", expected: "Income and supporting documents should be available" },
    { id: "BRE-R-005", category: "Documents",  ruleName: "Minimum documents available",                   result: "Amber", severity: "Medium", value: "Some documents pending",                     expected: "Minimum KYC and income documents required" },
    { id: "BRE-R-006", category: "Collateral", ruleName: "Collateral details captured",                   result: "Green", severity: "High",   value: "Property identified and valuation captured", expected: "Collateral details required for secured loan" },
    { id: "BRE-R-007", category: "Product",    ruleName: "Product policy hard stop check",                result: "Red",   severity: "High",   value: "Bureau policy blocker",                      expected: "No hard policy blocker" },
  ],
};

const offerOptionsByBre = {
  green: [
    { id: "OFFER-G-001", name: "Recommended Offer", tag: "Best Fit",      preliminaryAmount: "4300000", tenureYears: "20", roi: "8.80", processingFee: "0.70", emi: "37920", marginMoney: "550000", decision: "Preliminarily Eligible", referrals: [],                                                                              nextActions: ["Confirm customer acceptance", "Generate application form", "Proceed to review and submission"] },
    { id: "OFFER-G-002", name: "Requested Amount",  tag: "Customer Ask",  preliminaryAmount: "4500000", tenureYears: "20", roi: "8.95", processingFee: "0.75", emi: "40100", marginMoney: "500000", decision: "Preliminarily Eligible", referrals: [],                                                                              nextActions: ["Confirm customer acceptance", "Generate application form", "Proceed to application package review"] },
  ],
  amber: [
    { id: "OFFER-A-001", name: "Recommended Offer", tag: "Best Fit",      preliminaryAmount: "4200000", tenureYears: "20", roi: "8.85", processingFee: "0.75", emi: "37180", marginMoney: "600000", decision: "Preliminarily Eligible", referrals: [],                                                                              nextActions: ["Complete pending documents", "Initiate legal and technical verification", "Generate application form"] },
    { id: "OFFER-A-002", name: "Requested Amount",  tag: "Needs Review",  preliminaryAmount: "4500000", tenureYears: "20", roi: "9.10", processingFee: "0.85", emi: "40725", marginMoney: "500000", decision: "Refer for Review",       referrals: ["Requested amount is higher than recommended", "Pending documentation must be completed"], nextActions: ["Upload pending bank statement", "Confirm collateral verification status", "Submit for credit review"] },
    { id: "OFFER-A-003", name: "Conservative Offer",tag: "Lowest Risk",   preliminaryAmount: "3850000", tenureYears: "18", roi: "8.75", processingFee: "0.70", emi: "35990", marginMoney: "950000", decision: "Preliminarily Eligible", referrals: [],                                                                              nextActions: ["Confirm customer acceptance", "Complete application package", "Proceed to form generation"] },
  ],
  red: [
    { id: "OFFER-R-001", name: "No Preliminary Offer", tag: "Policy Blocker", preliminaryAmount: "0", tenureYears: "-", roi: "-", processingFee: "-", emi: "0", marginMoney: "-", decision: "Not Eligible", referrals: ["Bureau policy blocker identified", "Minimum policy criteria not met"], nextActions: ["Re-pull bureau if data is stale", "Review bureau details with applicant", "Do not proceed until blocker is resolved"] },
  ],
};

const categoryOptions = ["All", "Identity", "Bureau", "Income", "Collateral", "Documents", "Product"];

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatCurrency(value) {
  if (!value || value === "0") return "₹0";
  return `₹ ${Number(value).toLocaleString("en-IN")}`;
}

function getTimestamp() {
  return new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ── Field components ───────────────────────────────────────────── */
function FieldRow({ label, value, onChange, editing, type = "text", placeholder }) {
  return (
    <div className="eo-field">
      <span className="eo-field-label">{label}</span>
      {editing ? (
        <input className="eo-input" type={type} value={value || ""} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className={`eo-field-ro${!value ? " empty" : ""}`}>{value || "—"}</div>
      )}
    </div>
  );
}

function CurrencyField({ label, value, onChange, editing }) {
  const formatted = value ? `₹ ${Number(value).toLocaleString("en-IN")}` : "—";
  return (
    <div className="eo-field">
      <span className="eo-field-label">{label}</span>
      {editing ? (
        <div className="eo-currency-wrap">
          <span>₹</span>
          <input className="eo-currency-inner" type="number" value={value || ""}
            onChange={(e) => onChange(e.target.value)} />
        </div>
      ) : (
        <div className={`eo-field-ro${!value ? " empty" : ""}`}>{formatted}</div>
      )}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────── */
function EligibilityOfferPage() {
  const [inputs, setInputs]               = useState(initialInputs);
  const [editingInputs, setEditingInputs] = useState(false);
  const [breScenario, setBreScenario]     = useState("amber");
  const [breStatus, setBreStatus]         = useState("Not Run");
  const [breRunAt, setBreRunAt]           = useState("");
  const [isRunning, setIsRunning]         = useState(false);
  const [rules, setRules]                 = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [offerOptions, setOfferOptions]   = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");

  const selectedOffer  = offerOptions.find((o) => o.id === selectedOfferId);
  const breCompleted   = breStatus === "Completed";

  const updateInput = (key, val) => setInputs((p) => ({ ...p, [key]: val }));

  const runBre = () => {
    setIsRunning(true);
    setBreStatus("Running");
    window.setTimeout(() => {
      const nextRules  = ruleSets[breScenario];
      const nextOffers = offerOptionsByBre[breScenario];
      setRules(nextRules);
      setOfferOptions(nextOffers);
      setBreStatus("Completed");
      setBreRunAt(getTimestamp());
      setSelectedOfferId(nextOffers[0]?.id || "");
      setIsRunning(false);
    }, 1100);
  };

  const clearBre = () => {
    setBreStatus("Not Run");
    setBreRunAt("");
    setRules([]);
    setOfferOptions([]);
    setSelectedOfferId("");
  };

  const filteredRules = useMemo(() => {
    if (selectedCategory === "All") return rules;
    return rules.filter((r) => r.category === selectedCategory);
  }, [rules, selectedCategory]);

  const ruleStats = useMemo(() => ({
    green: rules.filter((r) => r.result === "Green").length,
    amber: rules.filter((r) => r.result === "Amber").length,
    red:   rules.filter((r) => r.result === "Red").length,
  }), [rules]);

  const breColor = useMemo(() => {
    if (!breCompleted) return "gray";
    if (ruleStats.red > 0)   return "red";
    if (ruleStats.amber > 0) return "amber";
    return "green";
  }, [breCompleted, ruleStats]);

  return (
    <div className="eo-page">

      {/* ── Page bar ──────────────────────────────────────────────── */}
      <div className="eo-page-bar">
        <span className="eo-page-title">Eligibility &amp; Offer</span>
        <span className="eo-page-sub">Run BRE, review rule outcomes and select a preliminary offer</span>
      </div>

      {/* ── Main panel ────────────────────────────────────────────── */}
      <div className="eo-panel">

        {/* ── Input Snapshot ── */}
        <div className="eo-section">
          <div className="eo-section-head">
            <div>
              <span className="eo-section-title">Input Snapshot</span>
              <span className="eo-section-sub">Application data used for eligibility calculation</span>
            </div>
            <button className="eo-edit-btn" type="button" onClick={() => setEditingInputs((p) => !p)}>
              <PencilIcon /> {editingInputs ? "Done" : "Edit"}
            </button>
          </div>
          <div className="eo-field-grid-3">
            <FieldRow      label="Product"              value={inputs.product}              onChange={(v) => updateInput("product", v)}              editing={editingInputs} />
            <FieldRow      label="Loan Type"            value={inputs.loanType}             onChange={(v) => updateInput("loanType", v)}             editing={editingInputs} />
            <FieldRow      label="Loan Purpose"         value={inputs.loanPurpose}          onChange={(v) => updateInput("loanPurpose", v)}          editing={editingInputs} />
            <CurrencyField label="Requested Amount"     value={inputs.requestedLoanAmount}  onChange={(v) => updateInput("requestedLoanAmount", v)}  editing={editingInputs} />
            <FieldRow      label="Tenure (Years)"       value={inputs.requestedTenureYears} onChange={(v) => updateInput("requestedTenureYears", v)} editing={editingInputs} type="number" />
            <FieldRow      label="Applicant Category"   value={inputs.applicantCategory}    onChange={(v) => updateInput("applicantCategory", v)}    editing={editingInputs} />
            <CurrencyField label="Monthly Income"       value={inputs.monthlyIncome}        onChange={(v) => updateInput("monthlyIncome", v)}        editing={editingInputs} />
            <CurrencyField label="Existing Obligations" value={inputs.existingObligations}  onChange={(v) => updateInput("existingObligations", v)}  editing={editingInputs} />
            <FieldRow      label="Bureau Score"         value={inputs.bureauScore}          onChange={(v) => updateInput("bureauScore", v)}          editing={editingInputs} type="number" />
            <FieldRow      label="Bureau Status"        value={inputs.bureauStatus}         onChange={(v) => updateInput("bureauStatus", v)}         editing={editingInputs} />
            <CurrencyField label="Collateral Value"     value={inputs.collateralValue}      onChange={(v) => updateInput("collateralValue", v)}      editing={editingInputs} />
            <FieldRow      label="Document Status"      value={inputs.documentStatus}       onChange={(v) => updateInput("documentStatus", v)}       editing={editingInputs} />
          </div>
        </div>

        <div className="eo-divider" />

        {/* ── BRE Engine ── */}
        <div className="eo-section">
          <div className="eo-section-head no-btn">
            <span className="eo-section-title">BRE Engine</span>
            <span className="eo-section-sub">Select a demo scenario and run the eligibility engine</span>
          </div>

          {/* RAG scenario selector */}
          <div className="eo-rag-tabs">
            {breScenarioOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`eo-rag-tab ${opt.value}${breScenario === opt.value ? " active" : ""}`}
                onClick={() => setBreScenario(opt.value)}
                disabled={isRunning}
              >
                <span className="eo-rag-dot" />
                <span className="eo-rag-label">{opt.label}</span>
                <span className="eo-rag-desc">{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Run row */}
          <div className="eo-run-row">
            <button className="eo-run-btn" type="button" onClick={runBre} disabled={isRunning}>
              {isRunning ? <RefreshIcon /> : <PlayIcon />}
              {isRunning ? "Running BRE…" : breCompleted ? "Re-run BRE" : "Run BRE"}
            </button>
            {breRunAt && (
              <span className="eo-run-meta">Last run: {breRunAt}</span>
            )}
            {breCompleted && (
              <button className="eo-clear-btn" type="button" onClick={clearBre}>Clear</button>
            )}
          </div>

          {/* Processing banner */}
          {isRunning && (
            <div className="eo-processing-msg">
              <RefreshIcon />
              Pulling application, bureau, income, document and collateral data…
            </div>
          )}

          {/* BRE result strip */}
          {breCompleted && (
            <div className={`eo-bre-result-strip ${breColor}`}>
              <span className="eo-bre-result-dot" />
              <span className="eo-bre-result-label">{breColor.toUpperCase()} BRE</span>
              <span className="eo-bre-result-counts">
                {ruleStats.green} green · {ruleStats.amber} amber · {ruleStats.red} red
              </span>
            </div>
          )}
        </div>

        {/* ── Rule Outcomes ── */}
        {breCompleted && (
          <>
            <div className="eo-divider" />
            <div className="eo-section">
              <div className="eo-section-head no-btn">
                <span className="eo-section-title">Rule Outcomes</span>
                <span className="eo-section-sub">Policy check results from this BRE run</span>
              </div>

              {/* Category filter */}
              <div className="eo-filter-bar">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`eo-filter-pill${selectedCategory === cat ? " active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Rule rows */}
              <div className="eo-rule-list">
                {filteredRules.map((rule) => (
                  <div className={`eo-rule-row ${rule.result.toLowerCase()}`} key={rule.id}>
                    <div className="eo-rule-body">
                      <div className="eo-rule-name-row">
                        <span className="eo-rule-name">{rule.ruleName}</span>
                        <span className="eo-rule-cat">{rule.category}</span>
                        <span className="eo-rule-sev">{rule.severity}</span>
                      </div>
                      <div className="eo-rule-detail">
                        <span>Actual: <strong>{rule.value}</strong></span>
                        <span>Expected: <strong>{rule.expected}</strong></span>
                      </div>
                    </div>
                    <span className={`eo-rule-badge ${rule.result.toLowerCase()}`}>
                      {rule.result === "Green" ? <CheckIcon /> : <AlertIcon />}
                      {rule.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Offer Options ── */}
        {breCompleted && offerOptions.length > 0 && (
          <>
            <div className="eo-divider" />
            <div className="eo-section">
              <div className="eo-section-head no-btn">
                <span className="eo-section-title">Preliminary Offer Options</span>
                <span className="eo-section-sub">{offerOptions.length} option{offerOptions.length !== 1 ? "s" : ""} generated · select one to proceed</span>
              </div>

              <div className="eo-offer-list">
                {offerOptions.map((offer) => {
                  const isSelected = selectedOfferId === offer.id;
                  const hasAmount  = offer.preliminaryAmount !== "0";

                  return (
                    <button
                      key={offer.id}
                      type="button"
                      className={`eo-offer-card${isSelected ? " selected" : ""}${!hasAmount ? " blocked" : ""}`}
                      onClick={() => setSelectedOfferId(offer.id)}
                    >
                      {/* Header */}
                      <div className="eo-offer-header">
                        <div>
                          <span className="eo-offer-tag">{offer.tag}</span>
                          <span className="eo-offer-name">{offer.name}</span>
                        </div>
                        <span className={`eo-offer-decision-badge ${hasAmount ? (offer.referrals.length ? "amber" : "green") : "red"}`}>
                          {offer.decision}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className={`eo-offer-amount${!hasAmount ? " blocked" : ""}`}>
                        <span>Preliminary Amount</span>
                        <strong>{hasAmount ? formatCurrency(offer.preliminaryAmount) : "No Offer"}</strong>
                      </div>

                      {/* Metrics row */}
                      {hasAmount && (
                        <div className="eo-offer-metrics">
                          <div><span>ROI</span><strong>{offer.roi}%</strong></div>
                          <div><span>Tenure</span><strong>{offer.tenureYears} yrs</strong></div>
                          <div><span>EMI</span><strong>{formatCurrency(offer.emi)}</strong></div>
                          <div><span>Fee</span><strong>{offer.processingFee}%</strong></div>
                          <div><span>Margin</span><strong>{formatCurrency(offer.marginMoney)}</strong></div>
                        </div>
                      )}

                      {/* Observations */}
                      {offer.referrals.length > 0 && (
                        <div className="eo-offer-obs warn">
                          <AlertIcon />
                          <span>{offer.referrals.join(" · ")}</span>
                        </div>
                      )}
                      {offer.referrals.length === 0 && hasAmount && (
                        <div className="eo-offer-obs ok">
                          <CheckIcon />
                          <span>No referral observations at preliminary stage</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default EligibilityOfferPage;
