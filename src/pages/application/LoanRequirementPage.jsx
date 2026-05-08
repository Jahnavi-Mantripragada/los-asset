import { useMemo, useState } from "react";
import "./LoanRequirementPage.css";

const RupeeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13h7a5 5 0 0 0 0-10" />
    <path d="m6 13 8 8" />
  </svg>
);

const LoanIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16v16H4Z" />
    <path d="M8 9h8" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 10h18" />
    <path d="m12 3 9 7H3Z" />
    <path d="M5 10v9" />
    <path d="M9 10v9" />
    <path d="M15 10v9" />
    <path d="M19 10v9" />
    <path d="M3 19h18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
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

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const productOptions = [
  "Home Loan",
  "Loan Against Property",
  "Business Loan",
  "Working Capital",
  "Personal Loan",
];

const loanTypeOptions = [
  {
    value: "New Loan",
    title: "New Loan",
    description: "Fresh loan application for new funding requirement.",
  },
  {
    value: "Balance Transfer",
    title: "Balance Transfer",
    description: "Transfer existing loan from another bank or financial institution.",
  },
  {
    value: "Top Up",
    title: "Top Up",
    description: "Additional loan amount against existing active loan relationship.",
  },
];

const purposeByProduct = {
  "Home Loan": [
    "Purchase of New Property",
    "Resale Purchase",
    "Self Construction",
    "Home Extension",
    "Home Improvement",
    "Plot Purchase",
  ],
  "Loan Against Property": [
    "Business Expansion",
    "Working Capital",
    "Debt Consolidation",
    "Education",
    "Medical Expense",
    "Personal Requirement",
  ],
  "Business Loan": [
    "Business Expansion",
    "Working Capital",
    "Inventory Purchase",
    "Machinery Purchase",
    "Vendor Payment",
    "Debt Consolidation",
  ],
  "Working Capital": [
    "Inventory Funding",
    "Receivables Funding",
    "Vendor Payment",
    "Operational Expenses",
  ],
  "Personal Loan": [
    "Personal Requirement",
    "Education",
    "Medical Expense",
    "Travel",
    "Debt Consolidation",
  ],
};

const btBanks = [
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "State Bank of India",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
  "Punjab National Bank",
  "Bajaj Finance",
  "Tata Capital",
  "Aditya Birla Finance",
  "Other",
];

const mockExistingLoans = [
  {
    id: "LN-900112",
    product: "Home Loan",
    loanAccountNumber: "HL7845123098",
    sanctionedAmount: "5200000",
    outstandingAmount: "3880000",
    emi: "42150",
    tenureRemainingMonths: "126",
    interestRate: "8.75",
    disbursedDate: "12 Aug 2021",
    status: "Active",
    eligibleTopUpAmount: "1200000",
  },
  {
    id: "LN-900193",
    product: "Loan Against Property",
    loanAccountNumber: "LAP9012458831",
    sanctionedAmount: "3500000",
    outstandingAmount: "2140000",
    emi: "38600",
    tenureRemainingMonths: "72",
    interestRate: "10.25",
    disbursedDate: "04 Jan 2023",
    status: "Active",
    eligibleTopUpAmount: "850000",
  },
];

const initialForm = {
  product: "Home Loan",
  loanType: "New Loan",
  loanPurpose: "Purchase of New Property",
  requestedLoanAmount: "4500000",
  loanTenureYears: "20",
  repaymentType: "EMI",
  rateType: "Floating",
  preferredEmi: "39000",
  applicantPan: "ABCDE1234F",

  btBankName: "",
  btLoanAccountNumber: "",
  btOutstandingAmount: "",
  btCurrentEmi: "",
  btCurrentInterestRate: "",
  btRemainingTenureMonths: "",
  btReason: "Lower Interest Rate",

  selectedExistingLoanId: "",
  topUpAmount: "",
  topUpPurpose: "Home Improvement",
};

function Field({ label, children, required }) {
  return (
    <label className="lr-field">
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
      className="lr-input"
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
      className="lr-input lr-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function CurrencyInput({ value, onChange, placeholder }) {
  return (
    <div className="lr-currency-input">
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
  if (!value) return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function LoanRequirementPage() {
  const [form, setForm] = useState(initialForm);
  const [existingLoans, setExistingLoans] = useState([]);
  const [isFetchingLoans, setIsFetchingLoans] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");

  const isBalanceTransfer = form.loanType === "Balance Transfer";
  const isTopUp = form.loanType === "Top Up";
  const selectedLoan = existingLoans.find((loan) => loan.id === form.selectedExistingLoanId);

  const purposeOptions = purposeByProduct[form.product] || [];

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleProductChange = (product) => {
    const nextPurposes = purposeByProduct[product] || [];

    setForm((previous) => ({
      ...previous,
      product,
      loanPurpose: nextPurposes[0] || "",
    }));
  };

  const handleLoanTypeChange = (loanType) => {
    setForm((previous) => ({
      ...previous,
      loanType,
      selectedExistingLoanId: "",
      topUpAmount: "",
    }));

    if (loanType !== "Top Up") {
      setExistingLoans([]);
      setFetchMessage("");
    }
  };

  const fetchExistingLoans = () => {
    if (!form.applicantPan) {
      setFetchMessage("Enter applicant PAN before fetching existing loans.");
      return;
    }

    setIsFetchingLoans(true);
    setFetchMessage("");

    window.setTimeout(() => {
      setExistingLoans(mockExistingLoans);
      setIsFetchingLoans(false);
      setFetchMessage(`Fetched ${mockExistingLoans.length} active loans for PAN ${form.applicantPan}.`);
    }, 900);
  };

  const selectExistingLoan = (loan) => {
    setForm((previous) => ({
      ...previous,
      selectedExistingLoanId: loan.id,
      product: loan.product,
      requestedLoanAmount: loan.eligibleTopUpAmount,
      topUpAmount: loan.eligibleTopUpAmount,
      loanPurpose: previous.topUpPurpose || "Home Improvement",
    }));
  };

  const completionItems = useMemo(() => {
    return [
      {
        label: "Product selected",
        complete: Boolean(form.product),
      },
      {
        label: "Loan type selected",
        complete: Boolean(form.loanType),
      },
      {
        label: "Purpose captured",
        complete: Boolean(form.loanPurpose),
      },
      {
        label: "Requested amount captured",
        complete: Boolean(form.requestedLoanAmount),
      },
      {
        label: "Tenure captured",
        complete: Boolean(form.loanTenureYears),
      },
      {
        label: "Balance transfer details captured",
        complete: !isBalanceTransfer || Boolean(form.btBankName && form.btOutstandingAmount),
      },
      {
        label: "Existing loan selected",
        complete: !isTopUp || Boolean(form.selectedExistingLoanId),
      },
    ];
  }, [form, isBalanceTransfer, isTopUp]);

  const completedCount = completionItems.filter((item) => item.complete).length;

  return (
    <div className="loan-requirement-page">
      <section className="lr-hero-card">
        <div className="lr-hero-left">
          <div className="lr-icon-wrap">
            <LoanIcon />
          </div>
          <div>
            <span className="lr-eyebrow">Step 07</span>
            <h3>Loan Requirement</h3>
            <p>
              Capture product, loan type, purpose, amount, tenure, balance transfer details and top-up eligibility.
            </p>
          </div>
        </div>

        <div className="lr-completion-box">
          <strong>{completedCount}/{completionItems.length}</strong>
          <span>Loan checks completed</span>
        </div>
      </section>

      <section className="lr-kpi-grid">
        <div className="lr-kpi-card">
          <span>Product</span>
          <strong>{form.product}</strong>
        </div>

        <div className="lr-kpi-card">
          <span>Loan Type</span>
          <strong>{form.loanType}</strong>
        </div>

        <div className="lr-kpi-card success">
          <span>Requested Amount</span>
          <strong>{formatCurrency(form.requestedLoanAmount)}</strong>
        </div>

        <div className="lr-kpi-card">
          <span>Tenure</span>
          <strong>{form.loanTenureYears} Years</strong>
        </div>
      </section>

      <section className="lr-layout">
        <main className="lr-main">
          <section className="lr-card">
            <div className="lr-section-header">
              <div>
                <span className="lr-eyebrow">Loan Type</span>
                <h4>Select Application Type</h4>
              </div>
            </div>

            <div className="lr-type-grid">
              {loanTypeOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`lr-type-card ${form.loanType === item.value ? "active" : ""}`}
                  onClick={() => handleLoanTypeChange(item.value)}
                >
                  <span className="lr-type-icon">
                    {item.value === "Balance Transfer" ? <BankIcon /> : <LoanIcon />}
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="lr-card">
            <div className="lr-section-header">
              <div>
                <span className="lr-eyebrow">Requirement Details</span>
                <h4>Product, Purpose, Amount & Tenure</h4>
              </div>
            </div>

            <div className="lr-field-grid three">
              <Field label="Product" required>
                <SelectInput
                  value={form.product}
                  onChange={handleProductChange}
                >
                  {productOptions.map((product) => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Loan Purpose" required>
                <SelectInput
                  value={form.loanPurpose}
                  onChange={(value) => updateForm("loanPurpose", value)}
                >
                  {purposeOptions.map((purpose) => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Requested Loan Amount" required>
                <CurrencyInput
                  value={form.requestedLoanAmount}
                  placeholder="Requested amount"
                  onChange={(value) => updateForm("requestedLoanAmount", value)}
                />
              </Field>

              <Field label="Loan Tenure Years" required>
                <TextInput
                  type="number"
                  value={form.loanTenureYears}
                  placeholder="Tenure in years"
                  onChange={(value) => updateForm("loanTenureYears", value)}
                />
              </Field>

              <Field label="Repayment Type">
                <SelectInput
                  value={form.repaymentType}
                  onChange={(value) => updateForm("repaymentType", value)}
                >
                  <option value="EMI">EMI</option>
                  <option value="Bullet">Bullet</option>
                  <option value="Step Up EMI">Step Up EMI</option>
                  <option value="Flexible EMI">Flexible EMI</option>
                </SelectInput>
              </Field>

              <Field label="Rate Type">
                <SelectInput
                  value={form.rateType}
                  onChange={(value) => updateForm("rateType", value)}
                >
                  <option value="Floating">Floating</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Hybrid">Hybrid</option>
                </SelectInput>
              </Field>

              <Field label="Preferred EMI">
                <CurrencyInput
                  value={form.preferredEmi}
                  placeholder="Preferred EMI"
                  onChange={(value) => updateForm("preferredEmi", value)}
                />
              </Field>
            </div>
          </section>

          {isBalanceTransfer && (
            <section className="lr-card">
              <div className="lr-section-header">
                <div>
                  <span className="lr-eyebrow">Balance Transfer</span>
                  <h4>Existing Loan Transfer Details</h4>
                </div>
                <span className="lr-status-pill warning">BT Details Required</span>
              </div>

              <div className="lr-bt-banner">
                <BankIcon />
                <div>
                  <strong>Capture current lender and outstanding loan details</strong>
                  <p>
                    These details will be used to calculate transfer eligibility, savings and sanction recommendation.
                  </p>
                </div>
              </div>

              <div className="lr-field-grid three">
                <Field label="BT Bank / Existing Lender" required>
                  <SelectInput
                    value={form.btBankName}
                    onChange={(value) => updateForm("btBankName", value)}
                  >
                    <option value="">Select bank</option>
                    {btBanks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Existing Loan Account Number">
                  <TextInput
                    value={form.btLoanAccountNumber}
                    placeholder="Loan account number"
                    onChange={(value) => updateForm("btLoanAccountNumber", value)}
                  />
                </Field>

                <Field label="Outstanding Amount" required>
                  <CurrencyInput
                    value={form.btOutstandingAmount}
                    placeholder="Outstanding amount"
                    onChange={(value) => updateForm("btOutstandingAmount", value)}
                  />
                </Field>

                <Field label="Current EMI">
                  <CurrencyInput
                    value={form.btCurrentEmi}
                    placeholder="Current EMI"
                    onChange={(value) => updateForm("btCurrentEmi", value)}
                  />
                </Field>

                <Field label="Current Interest Rate %">
                  <TextInput
                    type="number"
                    value={form.btCurrentInterestRate}
                    placeholder="e.g. 9.25"
                    onChange={(value) => updateForm("btCurrentInterestRate", value)}
                  />
                </Field>

                <Field label="Remaining Tenure Months">
                  <TextInput
                    type="number"
                    value={form.btRemainingTenureMonths}
                    placeholder="Remaining months"
                    onChange={(value) => updateForm("btRemainingTenureMonths", value)}
                  />
                </Field>

                <Field label="BT Reason">
                  <SelectInput
                    value={form.btReason}
                    onChange={(value) => updateForm("btReason", value)}
                  >
                    <option value="Lower Interest Rate">Lower Interest Rate</option>
                    <option value="Top Up Requirement">Top Up Requirement</option>
                    <option value="Better Service">Better Service</option>
                    <option value="Longer Tenure">Longer Tenure</option>
                    <option value="Consolidation">Consolidation</option>
                  </SelectInput>
                </Field>
              </div>
            </section>
          )}

          {isTopUp && (
            <section className="lr-card">
              <div className="lr-section-header">
                <div>
                  <span className="lr-eyebrow">Top Up Loan</span>
                  <h4>Fetch Existing Loans</h4>
                </div>
                <span className="lr-status-pill warning">Existing Loan Required</span>
              </div>

              <div className="lr-fetch-panel">
                <div className="lr-fetch-left">
                  <Field label="Applicant PAN" required>
                    <TextInput
                      value={form.applicantPan}
                      placeholder="ABCDE1234F"
                      onChange={(value) => updateForm("applicantPan", value.toUpperCase())}
                    />
                  </Field>
                </div>

                <button
                  type="button"
                  className="lr-fetch-btn"
                  onClick={fetchExistingLoans}
                  disabled={isFetchingLoans}
                >
                  {isFetchingLoans ? <RefreshIcon /> : <SearchIcon />}
                  {isFetchingLoans ? "Fetching..." : "Fetch Existing Loans"}
                </button>
              </div>

              {fetchMessage && (
                <div className={`lr-fetch-message ${existingLoans.length ? "success" : "warning"}`}>
                  {existingLoans.length ? <CheckIcon /> : <AlertIcon />}
                  {fetchMessage}
                </div>
              )}

              {existingLoans.length > 0 && (
                <div className="lr-existing-loan-list">
                  {existingLoans.map((loan) => {
                    const isSelected = form.selectedExistingLoanId === loan.id;

                    return (
                      <button
                        key={loan.id}
                        type="button"
                        className={`lr-existing-loan-card ${isSelected ? "selected" : ""}`}
                        onClick={() => selectExistingLoan(loan)}
                      >
                        <div className="lr-loan-card-top">
                          <div>
                            <span>{loan.product}</span>
                            <strong>{loan.loanAccountNumber}</strong>
                          </div>
                          <span className={`lr-mini-status ${isSelected ? "selected" : ""}`}>
                            {isSelected ? "Selected" : loan.status}
                          </span>
                        </div>

                        <div className="lr-loan-card-grid">
                          <div>
                            <span>Sanctioned</span>
                            <strong>{formatCurrency(loan.sanctionedAmount)}</strong>
                          </div>
                          <div>
                            <span>Outstanding</span>
                            <strong>{formatCurrency(loan.outstandingAmount)}</strong>
                          </div>
                          <div>
                            <span>EMI</span>
                            <strong>{formatCurrency(loan.emi)}</strong>
                          </div>
                          <div>
                            <span>Top Up Eligible</span>
                            <strong>{formatCurrency(loan.eligibleTopUpAmount)}</strong>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedLoan && (
                <div className="lr-topup-summary">
                  <div>
                    <span>Selected Existing Loan</span>
                    <strong>{selectedLoan.loanAccountNumber}</strong>
                  </div>
                  <div>
                    <span>Eligible Top Up</span>
                    <strong>{formatCurrency(selectedLoan.eligibleTopUpAmount)}</strong>
                  </div>
                  <div>
                    <span>Requested Top Up</span>
                    <strong>{formatCurrency(form.topUpAmount)}</strong>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        <aside className="lr-side">
          <section className="lr-side-card">
            <h4>Loan Readiness</h4>

            <div className="lr-checklist">
              {completionItems.map((item) => (
                <div key={item.label} className={item.complete ? "done" : ""}>
                  <span>{item.complete ? <CheckIcon /> : "•"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="lr-side-card soft">
            <h4>Requirement Summary</h4>

            <div className="lr-summary-list">
              <div>
                <span>Product</span>
                <strong>{form.product}</strong>
              </div>
              <div>
                <span>Type</span>
                <strong>{form.loanType}</strong>
              </div>
              <div>
                <span>Purpose</span>
                <strong>{form.loanPurpose}</strong>
              </div>
              <div>
                <span>Amount</span>
                <strong>{formatCurrency(form.requestedLoanAmount)}</strong>
              </div>
              <div>
                <span>Tenure</span>
                <strong>{form.loanTenureYears} Years</strong>
              </div>
            </div>
          </section>

          {isBalanceTransfer && (
            <section className="lr-side-card soft">
              <h4>BT Summary</h4>

              <div className="lr-summary-list">
                <div>
                  <span>Existing Bank</span>
                  <strong>{form.btBankName || "Pending"}</strong>
                </div>
                <div>
                  <span>Outstanding</span>
                  <strong>{formatCurrency(form.btOutstandingAmount)}</strong>
                </div>
                <div>
                  <span>Current ROI</span>
                  <strong>{form.btCurrentInterestRate ? `${form.btCurrentInterestRate}%` : "Pending"}</strong>
                </div>
              </div>
            </section>
          )}

          {isTopUp && (
            <section className="lr-side-card soft">
              <h4>Top Up Summary</h4>

              <div className="lr-summary-list">
                <div>
                  <span>PAN</span>
                  <strong>{form.applicantPan || "Pending"}</strong>
                </div>
                <div>
                  <span>Fetched Loans</span>
                  <strong>{existingLoans.length}</strong>
                </div>
                <div>
                  <span>Selected Loan</span>
                  <strong>{selectedLoan?.loanAccountNumber || "Pending"}</strong>
                </div>
                <div>
                  <span>Top Up Amount</span>
                  <strong>{formatCurrency(form.topUpAmount)}</strong>
                </div>
              </div>
            </section>
          )}
        </aside>
      </section>
    </div>
  );
}

export default LoanRequirementPage;