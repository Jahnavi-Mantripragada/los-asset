import { useMemo, useState } from "react";
import "./EligibilityOfferPage.css";

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.2A3 3 0 0 0 6 18h1" />
    <path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5.2A3 3 0 0 1 18 18h-1" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M9 8H7" />
    <path d="M15 8h2" />
    <path d="M9 13H6" />
    <path d="M15 13h3" />
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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
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

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" />
    <path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" />
    <path d="M6 22v-4H2" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <path d="M5 11h14v10H5Z" />
  </svg>
);

const initialInputs = {
  product: "Home Loan",
  loanType: "New Loan",
  loanPurpose: "Purchase of New Property",
  requestedLoanAmount: "4500000",
  requestedTenureYears: "20",
  applicantCategory: "Salaried",
  monthlyIncome: "85000",
  existingObligations: "18000",
  bureauScore: "748",
  bureauStatus: "Bureau Pulled",
  collateralValue: "8400000",
  propertyStatus: "Property Identified",
  legalStatus: "Pending",
  technicalStatus: "Pending",
  documentStatus: "Partially Complete",
};

const breDecisionOptions = [
  {
    value: "green",
    label: "Green",
    title: "Green BRE",
    description: "Preliminarily eligible with no major referral observations.",
  },
  {
    value: "amber",
    label: "Amber",
    title: "Amber BRE",
    description: "Eligible to proceed, but with pending prerequisites or review observations.",
  },
  {
    value: "red",
    label: "Red",
    title: "Red BRE",
    description: "Not eligible at preliminary stage due to hard policy blocker.",
  },
];

const ruleSets = {
  green: [
    {
      id: "BRE-G-001",
      category: "Identity",
      ruleName: "PAN verification completed",
      result: "Green",
      severity: "High",
      value: "Verified",
      expected: "PAN must be verified before eligibility calculation",
    },
    {
      id: "BRE-G-002",
      category: "Bureau",
      ruleName: "Bureau report available",
      result: "Green",
      severity: "High",
      value: "Bureau pulled successfully",
      expected: "Bureau report should be available",
    },
    {
      id: "BRE-G-003",
      category: "Bureau",
      ruleName: "Bureau score acceptable for preliminary offer",
      result: "Green",
      severity: "High",
      value: "748",
      expected: "Acceptable as per product policy",
    },
    {
      id: "BRE-G-004",
      category: "Income",
      ruleName: "Income details captured",
      result: "Green",
      severity: "High",
      value: "Salary income captured",
      expected: "Income details should be available",
    },
    {
      id: "BRE-G-005",
      category: "Documents",
      ruleName: "Minimum documents available for eligibility",
      result: "Green",
      severity: "Medium",
      value: "Minimum documents available",
      expected: "Minimum KYC and income documents required",
    },
    {
      id: "BRE-G-006",
      category: "Collateral",
      ruleName: "Collateral details captured",
      result: "Green",
      severity: "High",
      value: "Property identified and valuation captured",
      expected: "Collateral details required for secured loan",
    },
    {
      id: "BRE-G-007",
      category: "Product",
      ruleName: "Requested product and tenure allowed",
      result: "Green",
      severity: "Low",
      value: "Home Loan · 20 years",
      expected: "Within product policy",
    },
  ],
  amber: [
    {
      id: "BRE-A-001",
      category: "Identity",
      ruleName: "PAN verification completed",
      result: "Green",
      severity: "High",
      value: "Verified",
      expected: "PAN must be verified before eligibility calculation",
    },
    {
      id: "BRE-A-002",
      category: "Bureau",
      ruleName: "Bureau report available",
      result: "Green",
      severity: "High",
      value: "Bureau pulled successfully",
      expected: "Bureau report should be available",
    },
    {
      id: "BRE-A-003",
      category: "Bureau",
      ruleName: "Bureau score acceptable for preliminary offer",
      result: "Green",
      severity: "High",
      value: "748",
      expected: "Acceptable as per product policy",
    },
    {
      id: "BRE-A-004",
      category: "Income",
      ruleName: "Income details captured",
      result: "Green",
      severity: "High",
      value: "Salary income captured",
      expected: "Income details should be available",
    },
    {
      id: "BRE-A-005",
      category: "Documents",
      ruleName: "All mandatory documents uploaded",
      result: "Amber",
      severity: "Medium",
      value: "Some mandatory documents pending",
      expected: "Required before application submission",
    },
    {
      id: "BRE-A-006",
      category: "Collateral",
      ruleName: "Legal and technical reports available",
      result: "Amber",
      severity: "High",
      value: "Not initiated",
      expected: "Required before credit appraisal / sanction",
    },
    {
      id: "BRE-A-007",
      category: "Product",
      ruleName: "Requested product and tenure allowed",
      result: "Green",
      severity: "Low",
      value: "Home Loan · 20 years",
      expected: "Within product policy",
    },
  ],
  red: [
    {
      id: "BRE-R-001",
      category: "Identity",
      ruleName: "PAN verification completed",
      result: "Green",
      severity: "High",
      value: "Verified",
      expected: "PAN must be verified before eligibility calculation",
    },
    {
      id: "BRE-R-002",
      category: "Bureau",
      ruleName: "Bureau report available",
      result: "Green",
      severity: "High",
      value: "Bureau pulled successfully",
      expected: "Bureau report should be available",
    },
    {
      id: "BRE-R-003",
      category: "Bureau",
      ruleName: "Bureau score acceptable for preliminary offer",
      result: "Red",
      severity: "High",
      value: "598",
      expected: "Acceptable as per product policy",
    },
    {
      id: "BRE-R-004",
      category: "Income",
      ruleName: "Income details captured",
      result: "Amber",
      severity: "High",
      value: "Income available but latest bank statement pending",
      expected: "Income and supporting documents should be available",
    },
    {
      id: "BRE-R-005",
      category: "Documents",
      ruleName: "Minimum documents available for eligibility",
      result: "Amber",
      severity: "Medium",
      value: "Some documents pending",
      expected: "Minimum KYC and income documents required",
    },
    {
      id: "BRE-R-006",
      category: "Collateral",
      ruleName: "Collateral details captured",
      result: "Green",
      severity: "High",
      value: "Property identified and valuation captured",
      expected: "Collateral details required for secured loan",
    },
    {
      id: "BRE-R-007",
      category: "Product",
      ruleName: "Product policy hard stop check",
      result: "Red",
      severity: "High",
      value: "Bureau policy blocker",
      expected: "No hard policy blocker",
    },
  ],
};

const offerOptionsByBre = {
  green: [
    {
      id: "OFFER-G-001",
      name: "Recommended Preliminary Offer",
      tag: "Best Fit",
      preliminaryAmount: "4300000",
      tenureYears: "20",
      roi: "8.80",
      processingFee: "0.70",
      emi: "37920",
      marginMoney: "550000",
      insurancePremium: "Optional",
      decision: "Preliminarily Eligible",
      remarks: [
        "Offer is subject to credit appraisal",
        "Final terms may change after credit review",
      ],
      referrals: [],
      nextActions: [
        "Confirm customer acceptance",
        "Generate application form",
        "Proceed to review and submission",
      ],
    },
    {
      id: "OFFER-G-002",
      name: "Requested Amount Option",
      tag: "Customer Ask",
      preliminaryAmount: "4500000",
      tenureYears: "20",
      roi: "8.95",
      processingFee: "0.75",
      emi: "40100",
      marginMoney: "500000",
      insurancePremium: "Optional",
      decision: "Preliminarily Eligible",
      remarks: [
        "Requested amount can be considered subject to credit appraisal",
        "Final approval depends on credit and collateral review",
      ],
      referrals: [],
      nextActions: [
        "Confirm customer acceptance",
        "Generate application form",
        "Proceed to application package review",
      ],
    },
  ],
  amber: [
    {
      id: "OFFER-A-001",
      name: "Recommended Preliminary Offer",
      tag: "Best Fit",
      preliminaryAmount: "4200000",
      tenureYears: "20",
      roi: "8.85",
      processingFee: "0.75",
      emi: "37180",
      marginMoney: "600000",
      insurancePremium: "Optional",
      decision: "Preliminarily Eligible",
      remarks: [
        "Offer is subject to credit appraisal",
        "Legal and technical verification pending",
        "Final terms may change after credit review",
      ],
      referrals: [],
      nextActions: [
        "Complete pending documents",
        "Initiate legal and technical verification",
        "Generate application form",
      ],
    },
    {
      id: "OFFER-A-002",
      name: "Requested Amount Option",
      tag: "Needs Review",
      preliminaryAmount: "4500000",
      tenureYears: "20",
      roi: "9.10",
      processingFee: "0.85",
      emi: "40725",
      marginMoney: "500000",
      insurancePremium: "Optional",
      decision: "Refer for Review",
      remarks: [
        "Requested amount can be considered after additional checks",
        "Final eligibility depends on credit appraisal",
      ],
      referrals: [
        "Requested amount is higher than recommended preliminary amount",
        "Pending documentation must be completed before submission",
      ],
      nextActions: [
        "Upload pending bank statement",
        "Confirm collateral verification status",
        "Submit for credit review after application package generation",
      ],
    },
    {
      id: "OFFER-A-003",
      name: "Conservative Offer",
      tag: "Lowest Risk",
      preliminaryAmount: "3850000",
      tenureYears: "18",
      roi: "8.75",
      processingFee: "0.70",
      emi: "35990",
      marginMoney: "950000",
      insurancePremium: "Optional",
      decision: "Preliminarily Eligible",
      remarks: [
        "Lower exposure option based on available data",
        "Subject to final credit and collateral checks",
      ],
      referrals: [],
      nextActions: [
        "Confirm customer acceptance",
        "Complete application package",
        "Proceed to application form generation",
      ],
    },
  ],
  red: [
    {
      id: "OFFER-R-001",
      name: "No Preliminary Offer",
      tag: "Policy Blocker",
      preliminaryAmount: "0",
      tenureYears: "-",
      roi: "-",
      processingFee: "-",
      emi: "0",
      marginMoney: "-",
      insurancePremium: "Not Applicable",
      decision: "Not Eligible",
      remarks: [
        "Application cannot proceed with preliminary offer due to hard BRE blocker",
        "Re-pull or correct source data if the result appears incorrect",
      ],
      referrals: [
        "Bureau policy blocker identified",
        "Minimum policy criteria not met for preliminary offer",
      ],
      nextActions: [
        "Re-pull bureau if data is stale",
        "Review bureau details with applicant",
        "Do not generate application form until blocker is resolved",
      ],
    },
  ],
};

const ruleCategoryOptions = [
  "All",
  "Identity",
  "Bureau",
  "Income",
  "Obligations",
  "Collateral",
  "Documents",
  "Product",
];

const breActionOptions = [
  "Run BRE",
  "Re-run BRE",
  "Pull Latest Data",
  "Re-pull Bureau",
  "Re-pull Income",
  "Re-pull Collateral",
];

function Field({ label, children, required }) {
  return (
    <label className="eo-field">
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
      className="eo-input"
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
      className="eo-input eo-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function CurrencyInput({ value, onChange, placeholder }) {
  return (
    <div className="eo-currency-input">
      <span>₹</span>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function formatCurrency(value) {
  if (!value || value === "0") return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getResultClass(result) {
  if (result === "Green") return "green-result";
  if (result === "Amber") return "amber-result";
  if (result === "Red") return "red-result";
  return "pending-result";
}

function getDecisionClass(decision) {
  if (decision === "Eligible") return "green";
  if (decision === "Preliminarily Eligible") return "amber";
  if (decision === "Refer for Review") return "amber";
  if (decision === "Not Eligible") return "red";
  return "gray";
}

function getTimestamp() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EligibilityOfferPage() {
  const [inputs, setInputs] = useState(initialInputs);
  const [breScenario, setBreScenario] = useState("amber");
  const [breStatus, setBreStatus] = useState("Not Run");
  const [breRunAt, setBreRunAt] = useState("");
  const [breRunType, setBreRunType] = useState("");
  const [isRunningBre, setIsRunningBre] = useState(false);
  const [rules, setRules] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [offerOptions, setOfferOptions] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [activity, setActivity] = useState([
    {
      id: 1,
      title: "Eligibility step opened",
      desc: "BRE is pending. Run BRE to calculate preliminary eligibility and generate offer options.",
      time: "Today, 10:45 AM",
      type: "info",
    },
  ]);

  const selectedOffer = offerOptions.find((offer) => offer.id === selectedOfferId);
  const breCompleted = breStatus === "Completed";

  const updateInput = (key, value) => {
    setInputs((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const addActivity = (title, desc, type = "info") => {
    setActivity((previous) => [
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

  const runBre = (actionType = "Run BRE") => {
    setIsRunningBre(true);
    setBreStatus("Running");
    setBreRunType(actionType);

    window.setTimeout(() => {
      const nextRules = ruleSets[breScenario];
      const nextOffers = offerOptionsByBre[breScenario];

      setRules(nextRules);
      setOfferOptions(nextOffers);
      setBreStatus("Completed");
      setBreRunAt(getTimestamp());
      setSelectedOfferId(nextOffers[0]?.id || "");
      setIsRunningBre(false);

      const scenarioLabel = breScenario.toUpperCase();

      addActivity(
        `${actionType} completed`,
        `BRE returned ${scenarioLabel} result with ${nextOffers.length} preliminary offer option${nextOffers.length === 1 ? "" : "s"}.`,
        breScenario === "red" ? "warning" : "success"
      );
    }, 1100);
  };

  const resetBre = () => {
    setBreStatus("Not Run");
    setBreRunAt("");
    setBreRunType("");
    setRules([]);
    setOfferOptions([]);
    setSelectedOfferId("");
    addActivity("BRE output cleared", "Eligibility decision and offer output reset.", "warning");
  };

  const filteredRules = useMemo(() => {
    if (selectedCategory === "All") return rules;
    return rules.filter((rule) => rule.category === selectedCategory);
  }, [rules, selectedCategory]);

  const ruleStats = useMemo(() => {
    return {
      green: rules.filter((rule) => rule.result === "Green").length,
      amber: rules.filter((rule) => rule.result === "Amber").length,
      red: rules.filter((rule) => rule.result === "Red").length,
      total: rules.length,
    };
  }, [rules]);

  const decision = useMemo(() => {
    if (!breCompleted) return "Pending";
    if (ruleStats.red > 0) return "Not Eligible";
    if (ruleStats.amber > 0) return "Preliminarily Eligible";
    return "Eligible";
  }, [breCompleted, ruleStats]);

  const breColor = useMemo(() => {
    if (!breCompleted) return "gray";
    if (ruleStats.red > 0) return "red";
    if (ruleStats.amber > 0) return "amber";
    return "green";
  }, [breCompleted, ruleStats]);

  const completionItems = useMemo(() => {
    return [
      {
        label: "Application data available",
        complete: Boolean(inputs.product && inputs.loanType && inputs.requestedLoanAmount),
      },
      {
        label: "Income data available",
        complete: Boolean(inputs.monthlyIncome && inputs.existingObligations),
      },
      {
        label: "Bureau data available",
        complete: Boolean(inputs.bureauScore && inputs.bureauStatus),
      },
      {
        label: "Collateral data available",
        complete: Boolean(inputs.collateralValue && inputs.propertyStatus),
      },
      {
        label: "BRE completed",
        complete: breCompleted,
      },
      {
        label: "Preliminary offer selected",
        complete: Boolean(selectedOfferId) && decision !== "Not Eligible",
      },
    ];
  }, [inputs, breCompleted, selectedOfferId, decision]);

  const completedCount = completionItems.filter((item) => item.complete).length;

  return (
    <div className="eligibility-offer-page">
      <section className="eo-hero-card">
        <div className="eo-hero-left">
          <div className="eo-icon-wrap">
            <BrainIcon />
          </div>
          <div>
            <span className="eo-eyebrow">Step 08</span>
            <h3>Eligibility & Offer</h3>
            <p>
              Run BRE, pull latest data, get Red/Amber/Green eligibility result and generate preliminary offer options.
            </p>
          </div>
        </div>

        <div className="eo-completion-box">
          <strong>{completedCount}/{completionItems.length}</strong>
          <span>Eligibility checks completed</span>
        </div>
      </section>

      <section className="eo-kpi-grid">
        <div className="eo-kpi-card">
          <span>BRE Status</span>
          <strong>{breStatus}</strong>
        </div>

        <div className={`eo-kpi-card ${getDecisionClass(decision)}`}>
          <span>Decision</span>
          <strong>{decision}</strong>
        </div>

        <div className={`eo-kpi-card rag-${breColor}`}>
          <span>BRE Result</span>
          <strong>{breCompleted ? breColor.toUpperCase() : "Pending"}</strong>
        </div>

        <div className="eo-kpi-card success">
          <span>Preliminary Amount</span>
          <strong>{selectedOffer && selectedOffer.preliminaryAmount !== "0" ? formatCurrency(selectedOffer.preliminaryAmount) : "Pending"}</strong>
        </div>
      </section>

      <section className="eo-layout">
        <main className="eo-main">
          <section className="eo-card">
            <div className="eo-section-header">
              <div>
                <span className="eo-eyebrow">Input Snapshot</span>
                <h4>Application Data Used for BRE</h4>
              </div>

              <span className={`eo-status-pill ${breCompleted ? breColor : breStatus === "Running" ? "amber" : "gray"}`}>
                {breCompleted ? `${breColor.toUpperCase()} Result` : breStatus}
              </span>
            </div>

            <div className="eo-field-grid three">
              <Field label="Product">
                <TextInput
                  value={inputs.product}
                  onChange={(value) => updateInput("product", value)}
                />
              </Field>

              <Field label="Loan Type">
                <TextInput
                  value={inputs.loanType}
                  onChange={(value) => updateInput("loanType", value)}
                />
              </Field>

              <Field label="Loan Purpose">
                <TextInput
                  value={inputs.loanPurpose}
                  onChange={(value) => updateInput("loanPurpose", value)}
                />
              </Field>

              <Field label="Requested Amount" required>
                <CurrencyInput
                  value={inputs.requestedLoanAmount}
                  onChange={(value) => updateInput("requestedLoanAmount", value)}
                />
              </Field>

              <Field label="Requested Tenure Years" required>
                <TextInput
                  type="number"
                  value={inputs.requestedTenureYears}
                  onChange={(value) => updateInput("requestedTenureYears", value)}
                />
              </Field>

              <Field label="Applicant Category">
                <TextInput
                  value={inputs.applicantCategory}
                  onChange={(value) => updateInput("applicantCategory", value)}
                />
              </Field>

              <Field label="Monthly Income" required>
                <CurrencyInput
                  value={inputs.monthlyIncome}
                  onChange={(value) => updateInput("monthlyIncome", value)}
                />
              </Field>

              <Field label="Existing Obligations">
                <CurrencyInput
                  value={inputs.existingObligations}
                  onChange={(value) => updateInput("existingObligations", value)}
                />
              </Field>

              <Field label="Bureau Score">
                <TextInput
                  type="number"
                  value={inputs.bureauScore}
                  onChange={(value) => updateInput("bureauScore", value)}
                />
              </Field>

              <Field label="Bureau Status">
                <TextInput
                  value={inputs.bureauStatus}
                  onChange={(value) => updateInput("bureauStatus", value)}
                />
              </Field>

              <Field label="Collateral Value">
                <CurrencyInput
                  value={inputs.collateralValue}
                  onChange={(value) => updateInput("collateralValue", value)}
                />
              </Field>

              <Field label="Document Status">
                <TextInput
                  value={inputs.documentStatus}
                  onChange={(value) => updateInput("documentStatus", value)}
                />
              </Field>
            </div>
          </section>

          <section className="eo-card">
            <div className="eo-section-header">
              <div>
                <span className="eo-eyebrow">Rule Execution</span>
                <h4>BRE Actions</h4>
              </div>

              {breRunAt && (
                <span className="eo-run-meta">
                  Last run: {breRunAt}
                </span>
              )}
            </div>

            <div className="eo-bre-scenario">
              <div>
                <span className="eo-eyebrow">Demo BRE Result</span>
                <h4>Choose mocked BRE outcome</h4>
                <p>This simulates how BRE may return Green, Amber or Red based on policy checks.</p>
              </div>

              <div className="eo-rag-toggle">
                {breDecisionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${option.value} ${breScenario === option.value ? "active" : ""}`}
                    onClick={() => setBreScenario(option.value)}
                    disabled={isRunningBre}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="eo-action-grid">
              {breActionOptions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className={`eo-action-btn ${action === "Run BRE" || action === "Re-run BRE" ? "primary" : ""}`}
                  onClick={() => runBre(action)}
                  disabled={isRunningBre}
                >
                  {isRunningBre && breRunType === action ? <RefreshIcon /> : action.includes("Pull") ? <FileIcon /> : <BrainIcon />}
                  {isRunningBre && breRunType === action ? "Processing..." : action}
                </button>
              ))}

              <button
                type="button"
                className="eo-action-btn danger"
                onClick={resetBre}
                disabled={isRunningBre}
              >
                Clear Output
              </button>
            </div>

            {breStatus === "Running" && (
              <div className="eo-processing-banner">
                <RefreshIcon />
                <div>
                  <strong>BRE execution in progress</strong>
                  <p>
                    Pulling latest application, bureau, income, document and collateral data before generating preliminary decision.
                  </p>
                </div>
              </div>
            )}
          </section>

          {breCompleted && (
            <>
              <section className="eo-card">
                <div className="eo-section-header">
                  <div>
                    <span className="eo-eyebrow">Policy Decision</span>
                    <h4>BRE Rule Outcomes</h4>
                  </div>

                  <div className="eo-rule-summary">
                    <span className="green-result">{ruleStats.green} Green</span>
                    <span className="amber-result">{ruleStats.amber} Amber</span>
                    <span className="red-result">{ruleStats.red} Red</span>
                  </div>
                </div>

                <div className="eo-rule-filter">
                  {ruleCategoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={selectedCategory === category ? "active" : ""}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="eo-rule-list">
                  {filteredRules.map((rule) => (
                    <article className="eo-rule-row" key={rule.id}>
                      <div className={`eo-rule-icon ${getResultClass(rule.result)}`}>
                        {rule.result === "Green" ? <CheckIcon /> : <AlertIcon />}
                      </div>

                      <div className="eo-rule-main">
                        <div className="eo-rule-title">
                          <strong>{rule.ruleName}</strong>
                          <span>{rule.category}</span>
                        </div>
                        <p>
                          Actual: <b>{rule.value}</b> · Expected: <b>{rule.expected}</b> · Severity: {rule.severity}
                        </p>
                      </div>

                      <span className={`eo-rule-result ${getResultClass(rule.result)}`}>
                        {rule.result}
                      </span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="eo-card">
                <div className="eo-section-header">
                  <div>
                    <span className="eo-eyebrow">Offer Generation</span>
                    <h4>Available Preliminary Offer Options</h4>
                  </div>

                  <span className={`eo-status-pill ${breColor}`}>
                    {offerOptions.length} Option{offerOptions.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="eo-offer-grid">
                  {offerOptions.map((offer) => {
                    const isSelected = selectedOfferId === offer.id;
                    const hasAmount = offer.preliminaryAmount !== "0";

                    return (
                      <button
                        type="button"
                        key={offer.id}
                        className={`eo-offer-card ${isSelected ? "selected" : ""} ${!hasAmount ? "blocked" : ""}`}
                        onClick={() => {
                          setSelectedOfferId(offer.id);
                          addActivity(
                            "Preliminary option selected",
                            `${offer.name} selected${hasAmount ? ` with amount ${formatCurrency(offer.preliminaryAmount)}` : ""}.`,
                            hasAmount ? "success" : "warning"
                          );
                        }}
                      >
                        <div className="eo-offer-head">
                          <div>
                            <span>{offer.tag}</span>
                            <strong>{offer.name}</strong>
                          </div>
                          <span className={`eo-offer-decision ${getDecisionClass(offer.decision)}`}>
                            {offer.decision}
                          </span>
                        </div>

                        <div className={`eo-offer-amount ${!hasAmount ? "blocked" : ""}`}>
                          <span>Preliminary Offer Amount</span>
                          <strong>{hasAmount ? formatCurrency(offer.preliminaryAmount) : "No Offer"}</strong>
                        </div>

                        <div className="eo-offer-grid-mini">
                          <div>
                            <span>ROI</span>
                            <strong>{offer.roi}</strong>
                          </div>
                          <div>
                            <span>Tenure</span>
                            <strong>{offer.tenureYears === "-" ? "-" : `${offer.tenureYears} yrs`}</strong>
                          </div>
                          <div>
                            <span>EMI</span>
                            <strong>{hasAmount ? formatCurrency(offer.emi) : "-"}</strong>
                          </div>
                          <div>
                            <span>Fee</span>
                            <strong>{offer.processingFee === "-" ? "-" : `${offer.processingFee}%`}</strong>
                          </div>
                          <div>
                            <span>Margin</span>
                            <strong>{offer.marginMoney === "-" ? "-" : formatCurrency(offer.marginMoney)}</strong>
                          </div>
                          <div>
                            <span>Insurance</span>
                            <strong>{offer.insurancePremium}</strong>
                          </div>
                        </div>

                        {offer.referrals.length > 0 ? (
                          <div className="eo-deviation-box">
                            <AlertIcon />
                            <span>{offer.referrals.join(", ")}</span>
                          </div>
                        ) : (
                          <div className="eo-clean-box">
                            <CheckIcon />
                            <span>No referral observation at preliminary eligibility stage</span>
                          </div>
                        )}

                        <div className="eo-next-action-box">
                          <strong>Next Actions</strong>
                          <ul>
                            {offer.nextActions.map((action) => (
                              <li key={action}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </main>

        <aside className="eo-side">
          <section className="eo-side-card">
            <h4>Eligibility Readiness</h4>

            <div className="eo-checklist">
              {completionItems.map((item) => (
                <div key={item.label} className={item.complete ? "done" : ""}>
                  <span>{item.complete ? <CheckIcon /> : "•"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className={`eo-side-card rag-card ${breColor}`}>
            <h4>BRE Result</h4>
            <strong>{breCompleted ? breColor.toUpperCase() : "Pending"}</strong>
            <p>
              {breColor === "green" && "Application is preliminarily eligible based on available data."}
              {breColor === "amber" && "Application can proceed with pending prerequisites or review observations."}
              {breColor === "red" && "Application has a hard policy blocker at preliminary eligibility stage."}
              {breColor === "gray" && "Run BRE to calculate preliminary eligibility."}
            </p>
          </section>

          <section className="eo-side-card soft">
            <h4>Decision Summary</h4>

            <div className="eo-summary-list">
              <div>
                <span>Decision</span>
                <strong>{decision}</strong>
              </div>
              <div>
                <span>BRE Status</span>
                <strong>{breStatus}</strong>
              </div>
              <div>
                <span>Green / Amber / Red</span>
                <strong>{ruleStats.green} / {ruleStats.amber} / {ruleStats.red}</strong>
              </div>
              <div>
                <span>Selected Option</span>
                <strong>{selectedOffer?.name || "Pending"}</strong>
              </div>
              <div>
                <span>Preliminary Amount</span>
                <strong>
                  {selectedOffer && selectedOffer.preliminaryAmount !== "0"
                    ? formatCurrency(selectedOffer.preliminaryAmount)
                    : "Pending"}
                </strong>
              </div>
            </div>
          </section>

          {selectedOffer && selectedOffer.preliminaryAmount !== "0" && (
            <section className="eo-side-card selected">
              <div className="eo-selected-icon">
                <RupeeIcon />
              </div>
              <h4>Selected Preliminary Offer</h4>
              <strong>{formatCurrency(selectedOffer.preliminaryAmount)}</strong>
              <p>
                {selectedOffer.roi}% ROI · {selectedOffer.tenureYears} years · EMI {formatCurrency(selectedOffer.emi)}
              </p>

              <button type="button" className="eo-lock-btn">
                <LockIcon />
                Accept Preliminary Offer
              </button>
            </section>
          )}

          <section className="eo-side-card soft">
            <h4>Activity</h4>

            <div className="eo-activity-list">
              {activity.map((item) => (
                <div key={item.id} className={`eo-activity-item ${item.type}`}>
                  <span>{item.type === "success" ? <CheckIcon /> : item.type === "warning" ? <AlertIcon /> : <BrainIcon />}</span>
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

export default EligibilityOfferPage;