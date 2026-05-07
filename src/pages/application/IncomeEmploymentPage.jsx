import { useMemo, useState } from "react";
import "./IncomeEmploymentPage.css";

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M3 13h18" />
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

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
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

const initialForm = {
  employmentType: "Salaried",

  employerName: "Deloitte India",
  employerType: "Private Limited",
  designation: "Senior Consultant",
  department: "Technology",
  employeeId: "EMP-10482",
  totalExperienceYears: "8",
  currentExperienceYears: "3",
  salaryMode: "Bank Transfer",
  monthlyGrossSalary: "85000",
  monthlyNetSalary: "72000",
  annualBonus: "180000",

  businessName: "Sharma Consulting Services",
  constitutionType: "Proprietorship",
  industryType: "Professional Services",
  businessVintageYears: "6",
  annualTurnover: "4800000",
  monthlyBusinessIncome: "320000",
  netMonthlyIncome: "210000",
  professionalType: "Consultant",

  gstNumber: "27ABCDE1234F1Z5",
  udyamNumber: "UDYAM-MH-19-0012345",
  cinNumber: "U72900MH2020PTC123456",
  businessPan: "ABCDE1234F",
  shopActNumber: "MH-SHOP-2026-1842",

  officePhone: "02245891234",
  officialEmail: "rahul.sharma@company.com",
  businessEmail: "finance@sharmacompany.com",
  preferredContactTime: "10 AM - 1 PM",

  officeAddressLine1: "401, Business Park",
  officeAddressLine2: "Andheri East",
  officeLandmark: "Near Metro Station",
  officeCity: "Mumbai",
  officeDistrict: "Mumbai Suburban",
  officeState: "Maharashtra",
  officePincode: "400059",
  officeCountry: "India",

  itrStatus: "Not Requested",
  gstStatus: "Not Requested",
};

const employmentTypes = [
  {
    value: "Salaried",
    title: "Salaried",
    description: "Applicant earns fixed salary from an employer.",
  },
  {
    value: "SEP",
    title: "Self Employed Professional",
    description: "Doctors, CAs, consultants, architects or professionals.",
  },
  {
    value: "SENP",
    title: "Self Employed Non Professional",
    description: "Business owners, traders, manufacturers or service providers.",
  },
];

const employerTypes = [
  "Government",
  "Public Sector",
  "Private Limited",
  "Public Limited",
  "Partnership",
  "Proprietorship",
  "MNC",
  "Other",
];

const constitutionTypes = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited",
  "Public Limited",
  "Trust",
  "Society",
  "HUF",
  "Other",
];

const industryTypes = [
  "Trading",
  "Manufacturing",
  "Services",
  "Professional Services",
  "Healthcare",
  "Education",
  "Real Estate",
  "Retail",
  "Transport",
  "IT / Software",
  "Other",
];

const professionalTypes = [
  "Doctor",
  "Chartered Accountant",
  "Consultant",
  "Architect",
  "Lawyer",
  "Engineer",
  "Interior Designer",
  "Other Professional",
];

const salaryModes = [
  "Bank Transfer",
  "Cheque",
  "Cash",
  "Mixed",
];

const preferredContactTimes = [
  "9 AM - 10 AM",
  "10 AM - 1 PM",
  "1 PM - 4 PM",
  "4 PM - 7 PM",
  "Anytime",
];

function Field({ label, children, required }) {
  return (
    <label className="ie-field">
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
      className="ie-input"
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
      className="ie-input ie-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function CurrencyInput({ value, onChange, placeholder }) {
  return (
    <div className="ie-currency-input">
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

function ActionCard({ title, description, status, icon, buttonLabel, onClick, disabled }) {
  return (
    <div className={`ie-action-card ${status === "Requested" ? "requested" : ""}`}>
      <div className="ie-action-icon">{icon}</div>
      <div className="ie-action-content">
        <div className="ie-action-title-row">
          <h4>{title}</h4>
          <span className={`ie-status-pill ${status === "Requested" ? "completed" : "pending"}`}>
            {status}
          </span>
        </div>
        <p>{description}</p>
        <button type="button" onClick={onClick} disabled={disabled}>
          {status === "Requested" ? <CheckIcon /> : <SendIcon />}
          {status === "Requested" ? "Request Sent" : buttonLabel}
        </button>
      </div>
    </div>
  );
}

function IncomeEmploymentPage() {
  const [form, setForm] = useState(initialForm);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const isSalaried = form.employmentType === "Salaried";
  const isSEP = form.employmentType === "SEP";
  const isSENP = form.employmentType === "SENP";
  const isSelfEmployed = isSEP || isSENP;

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleEmploymentTypeChange = (value) => {
    setForm((previous) => ({
      ...previous,
      employmentType: value,
      itrStatus: "Not Requested",
      gstStatus: "Not Requested",
    }));
  };

  const handleFileUpload = (event, documentType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFiles((previous) => [
      {
        id: Date.now(),
        documentType,
        fileName: file.name,
      },
      ...previous,
    ]);
  };

  const completionItems = useMemo(() => {
    const common = [
      {
        label: "Employment type selected",
        complete: Boolean(form.employmentType),
      },
      {
        label: "Office address captured",
        complete: Boolean(form.officeAddressLine1 && form.officeCity && form.officePincode),
      },
      {
        label: "Communication details captured",
        complete: Boolean(form.officePhone || form.officialEmail || form.businessEmail),
      },
    ];

    if (isSalaried) {
      return [
        ...common,
        {
          label: "Employer details captured",
          complete: Boolean(form.employerName && form.designation && form.employerType),
        },
        {
          label: "Salary details captured",
          complete: Boolean(form.monthlyGrossSalary && form.monthlyNetSalary),
        },
        {
          label: "Salary proof uploaded",
          complete: uploadedFiles.some((file) => file.documentType === "Salary Proof"),
        },
      ];
    }

    return [
      ...common,
      {
        label: "Business details captured",
        complete: Boolean(form.businessName && form.constitutionType && form.industryType),
      },
      {
        label: "Income details captured",
        complete: Boolean(form.annualTurnover && form.netMonthlyIncome),
      },
      {
        label: "Business identifiers captured",
        complete: Boolean(form.gstNumber || form.udyamNumber || form.cinNumber || form.businessPan),
      },
      {
        label: "Income request initiated",
        complete: form.itrStatus === "Requested" || form.gstStatus === "Requested",
      },
    ];
  }, [form, isSalaried, uploadedFiles]);

  const completedCount = completionItems.filter((item) => item.complete).length;

  return (
    <div className="income-employment-page">
      <section className="ie-hero-card">
        <div className="ie-hero-left">
          <div className="ie-icon-wrap">
            <BriefcaseIcon />
          </div>
          <div>
            <span className="ie-eyebrow">Step 03</span>
            <h3>Income & Employment</h3>
            <p>
              Capture employment category, income details, office address, business identifiers and income verification requests.
            </p>
          </div>
        </div>

        <div className="ie-completion-box">
          <strong>{completedCount}/{completionItems.length}</strong>
          <span>Income checks completed</span>
        </div>
      </section>

      <section className="ie-layout">
        <main className="ie-main">
          <section className="ie-card">
            <div className="ie-section-header">
              <div>
                <span className="ie-eyebrow">Employment Category</span>
                <h4>Select Employment Type</h4>
              </div>
            </div>

            <div className="ie-employment-type-grid">
              {employmentTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`ie-type-card ${form.employmentType === item.value ? "active" : ""}`}
                  onClick={() => handleEmploymentTypeChange(item.value)}
                >
                  <span className="ie-type-icon">
                    <BriefcaseIcon />
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
          </section>

          {isSalaried && (
            <>
              <section className="ie-card">
                <div className="ie-section-header">
                  <div>
                    <span className="ie-eyebrow">Employer Details</span>
                    <h4>Current Employment Information</h4>
                  </div>
                </div>

                <div className="ie-field-grid three">
                  <Field label="Employer Name" required>
                    <TextInput
                      value={form.employerName}
                      placeholder="Employer / company name"
                      onChange={(value) => updateForm("employerName", value)}
                    />
                  </Field>

                  <Field label="Employer Type" required>
                    <SelectInput
                      value={form.employerType}
                      onChange={(value) => updateForm("employerType", value)}
                    >
                      {employerTypes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Designation" required>
                    <TextInput
                      value={form.designation}
                      placeholder="Designation"
                      onChange={(value) => updateForm("designation", value)}
                    />
                  </Field>

                  <Field label="Department">
                    <TextInput
                      value={form.department}
                      placeholder="Department"
                      onChange={(value) => updateForm("department", value)}
                    />
                  </Field>

                  <Field label="Employee ID">
                    <TextInput
                      value={form.employeeId}
                      placeholder="Employee ID"
                      onChange={(value) => updateForm("employeeId", value)}
                    />
                  </Field>

                  <Field label="Salary Mode" required>
                    <SelectInput
                      value={form.salaryMode}
                      onChange={(value) => updateForm("salaryMode", value)}
                    >
                      {salaryModes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Total Experience Years" required>
                    <TextInput
                      type="number"
                      value={form.totalExperienceYears}
                      placeholder="Years"
                      onChange={(value) => updateForm("totalExperienceYears", value)}
                    />
                  </Field>

                  <Field label="Current Employer Experience Years" required>
                    <TextInput
                      type="number"
                      value={form.currentExperienceYears}
                      placeholder="Years"
                      onChange={(value) => updateForm("currentExperienceYears", value)}
                    />
                  </Field>
                </div>
              </section>

              <section className="ie-card">
                <div className="ie-section-header">
                  <div>
                    <span className="ie-eyebrow">Salary Details</span>
                    <h4>Income Declaration</h4>
                  </div>
                </div>

                <div className="ie-field-grid three">
                  <Field label="Monthly Gross Salary" required>
                    <CurrencyInput
                      value={form.monthlyGrossSalary}
                      placeholder="Gross salary"
                      onChange={(value) => updateForm("monthlyGrossSalary", value)}
                    />
                  </Field>

                  <Field label="Monthly Net Salary" required>
                    <CurrencyInput
                      value={form.monthlyNetSalary}
                      placeholder="Net salary"
                      onChange={(value) => updateForm("monthlyNetSalary", value)}
                    />
                  </Field>

                  <Field label="Annual Bonus / Variable Pay">
                    <CurrencyInput
                      value={form.annualBonus}
                      placeholder="Annual bonus"
                      onChange={(value) => updateForm("annualBonus", value)}
                    />
                  </Field>
                </div>

                <div className="ie-doc-upload-row">
                  <label className="ie-upload-btn">
                    <UploadIcon />
                    Upload Salary Slip
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileUpload(event, "Salary Proof")}
                    />
                  </label>

                  <label className="ie-upload-btn secondary">
                    <UploadIcon />
                    Upload Bank Statement
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileUpload(event, "Bank Statement")}
                    />
                  </label>

                  <label className="ie-upload-btn secondary">
                    <UploadIcon />
                    Upload Form 16
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileUpload(event, "Form 16")}
                    />
                  </label>
                </div>
              </section>
            </>
          )}

          {isSelfEmployed && (
            <>
              <section className="ie-card">
                <div className="ie-section-header">
                  <div>
                    <span className="ie-eyebrow">Business Details</span>
                    <h4>{isSEP ? "Professional Practice Information" : "Business Information"}</h4>
                  </div>
                </div>

                <div className="ie-field-grid three">
                  <Field label={isSEP ? "Practice / Firm Name" : "Business Name"} required>
                    <TextInput
                      value={form.businessName}
                      placeholder={isSEP ? "Practice / firm name" : "Business name"}
                      onChange={(value) => updateForm("businessName", value)}
                    />
                  </Field>

                  {isSEP && (
                    <Field label="Professional Type" required>
                      <SelectInput
                        value={form.professionalType}
                        onChange={(value) => updateForm("professionalType", value)}
                      >
                        {professionalTypes.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </SelectInput>
                    </Field>
                  )}

                  <Field label="Constitution Type" required>
                    <SelectInput
                      value={form.constitutionType}
                      onChange={(value) => updateForm("constitutionType", value)}
                    >
                      {constitutionTypes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Industry Type" required>
                    <SelectInput
                      value={form.industryType}
                      onChange={(value) => updateForm("industryType", value)}
                    >
                      {industryTypes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Business Vintage Years" required>
                    <TextInput
                      type="number"
                      value={form.businessVintageYears}
                      placeholder="Years"
                      onChange={(value) => updateForm("businessVintageYears", value)}
                    />
                  </Field>

                  <Field label="Annual Turnover" required>
                    <CurrencyInput
                      value={form.annualTurnover}
                      placeholder="Annual turnover"
                      onChange={(value) => updateForm("annualTurnover", value)}
                    />
                  </Field>

                  <Field label="Monthly Business Income">
                    <CurrencyInput
                      value={form.monthlyBusinessIncome}
                      placeholder="Monthly business income"
                      onChange={(value) => updateForm("monthlyBusinessIncome", value)}
                    />
                  </Field>

                  <Field label="Net Monthly Income" required>
                    <CurrencyInput
                      value={form.netMonthlyIncome}
                      placeholder="Net monthly income"
                      onChange={(value) => updateForm("netMonthlyIncome", value)}
                    />
                  </Field>
                </div>
              </section>

              <section className="ie-card">
                <div className="ie-section-header">
                  <div>
                    <span className="ie-eyebrow">Business Identifiers</span>
                    <h4>GST, Udyam, CIN and Registration Details</h4>
                  </div>
                </div>

                <div className="ie-field-grid three">
                  <Field label="GST Number">
                    <TextInput
                      value={form.gstNumber}
                      placeholder="27ABCDE1234F1Z5"
                      onChange={(value) => updateForm("gstNumber", value.toUpperCase())}
                    />
                  </Field>

                  <Field label="Udyam Number">
                    <TextInput
                      value={form.udyamNumber}
                      placeholder="UDYAM-MH-19-0012345"
                      onChange={(value) => updateForm("udyamNumber", value.toUpperCase())}
                    />
                  </Field>

                  <Field label="CIN Number">
                    <TextInput
                      value={form.cinNumber}
                      placeholder="U72900MH2020PTC123456"
                      onChange={(value) => updateForm("cinNumber", value.toUpperCase())}
                    />
                  </Field>

                  <Field label="Business PAN" required>
                    <TextInput
                      value={form.businessPan}
                      placeholder="ABCDE1234F"
                      onChange={(value) => updateForm("businessPan", value.toUpperCase())}
                    />
                  </Field>

                  <Field label="Shop Act / Trade License">
                    <TextInput
                      value={form.shopActNumber}
                      placeholder="Registration number"
                      onChange={(value) => updateForm("shopActNumber", value.toUpperCase())}
                    />
                  </Field>
                </div>

                <div className="ie-doc-upload-row">
                  <label className="ie-upload-btn">
                    <UploadIcon />
                    Upload GST Certificate
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileUpload(event, "GST Certificate")}
                    />
                  </label>

                  <label className="ie-upload-btn secondary">
                    <UploadIcon />
                    Upload Udyam Certificate
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileUpload(event, "Udyam Certificate")}
                    />
                  </label>

                  <label className="ie-upload-btn secondary">
                    <UploadIcon />
                    Upload Business Proof
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileUpload(event, "Business Proof")}
                    />
                  </label>
                </div>
              </section>

              <section className="ie-card">
                <div className="ie-section-header">
                  <div>
                    <span className="ie-eyebrow">Online Income Requests</span>
                    <h4>Request ITR and GST Information</h4>
                  </div>
                </div>

                <div className="ie-action-grid">
                  <ActionCard
                    title="Request ITR"
                    description="Send a secure link to the applicant to fetch ITR details for income assessment."
                    status={form.itrStatus}
                    icon={<FileIcon />}
                    buttonLabel="Request ITR"
                    onClick={() => updateForm("itrStatus", "Requested")}
                  />

                  <ActionCard
                    title="Request GST"
                    description="Request GST returns and filing summary for business cash flow assessment."
                    status={form.gstStatus}
                    icon={<FileIcon />}
                    buttonLabel="Request GST"
                    onClick={() => updateForm("gstStatus", "Requested")}
                    disabled={!form.gstNumber}
                  />
                </div>
              </section>
            </>
          )}

          <section className="ie-card">
            <div className="ie-section-header">
              <div>
                <span className="ie-eyebrow">Office Address</span>
                <h4>{isSalaried ? "Employer Office Address" : "Business / Practice Address"}</h4>
              </div>
            </div>

            <div className="ie-address-card">
              <div className="ie-address-title">
                <span>
                  <HomeIcon />
                </span>
                <div>
                  <h4>{isSalaried ? "Office Location" : "Business Location"}</h4>
                  <p>Capture the primary work address for verification and field visit planning.</p>
                </div>
              </div>

              <div className="ie-field-grid two">
                <Field label="Address Line 1" required>
                  <TextInput
                    value={form.officeAddressLine1}
                    placeholder="Building / office / shop"
                    onChange={(value) => updateForm("officeAddressLine1", value)}
                  />
                </Field>

                <Field label="Address Line 2">
                  <TextInput
                    value={form.officeAddressLine2}
                    placeholder="Street / area"
                    onChange={(value) => updateForm("officeAddressLine2", value)}
                  />
                </Field>

                <Field label="Landmark">
                  <TextInput
                    value={form.officeLandmark}
                    placeholder="Nearby landmark"
                    onChange={(value) => updateForm("officeLandmark", value)}
                  />
                </Field>

                <Field label="City" required>
                  <TextInput
                    value={form.officeCity}
                    placeholder="City"
                    onChange={(value) => updateForm("officeCity", value)}
                  />
                </Field>

                <Field label="District">
                  <TextInput
                    value={form.officeDistrict}
                    placeholder="District"
                    onChange={(value) => updateForm("officeDistrict", value)}
                  />
                </Field>

                <Field label="State" required>
                  <TextInput
                    value={form.officeState}
                    placeholder="State"
                    onChange={(value) => updateForm("officeState", value)}
                  />
                </Field>

                <Field label="PIN Code" required>
                  <TextInput
                    value={form.officePincode}
                    placeholder="PIN code"
                    onChange={(value) => updateForm("officePincode", value)}
                  />
                </Field>

                <Field label="Country">
                  <TextInput
                    value={form.officeCountry}
                    placeholder="Country"
                    onChange={(value) => updateForm("officeCountry", value)}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="ie-card">
            <div className="ie-section-header">
              <div>
                <span className="ie-eyebrow">Communication</span>
                <h4>Office Communication Details</h4>
              </div>
            </div>

            <div className="ie-field-grid three">
              <Field label={isSalaried ? "Office Phone" : "Business Phone"}>
                <TextInput
                  value={form.officePhone}
                  placeholder="Office phone"
                  onChange={(value) => updateForm("officePhone", value)}
                />
              </Field>

              {isSalaried && (
                <Field label="Official Email">
                  <TextInput
                    type="email"
                    value={form.officialEmail}
                    placeholder="Official email"
                    onChange={(value) => updateForm("officialEmail", value)}
                  />
                </Field>
              )}

              {isSelfEmployed && (
                <Field label="Business Email">
                  <TextInput
                    type="email"
                    value={form.businessEmail}
                    placeholder="Business email"
                    onChange={(value) => updateForm("businessEmail", value)}
                  />
                </Field>
              )}

              <Field label="Preferred Contact Time">
                <SelectInput
                  value={form.preferredContactTime}
                  onChange={(value) => updateForm("preferredContactTime", value)}
                >
                  {preferredContactTimes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </section>
        </main>

        <aside className="ie-side">
          <section className="ie-side-card">
            <h4>Income Readiness</h4>
            <div className="ie-checklist">
              {completionItems.map((item) => (
                <div
                  key={item.label}
                  className={`ie-check-row ${item.complete ? "done" : ""}`}
                >
                  <span>{item.complete ? <CheckIcon /> : "•"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="ie-side-card soft">
            <h4>Income Summary</h4>
            <div className="ie-summary-list">
              <div>
                <span>Employment Type</span>
                <strong>{form.employmentType}</strong>
              </div>

              <div>
                <span>{isSalaried ? "Employer" : "Business"}</span>
                <strong>{isSalaried ? form.employerName : form.businessName}</strong>
              </div>

              <div>
                <span>{isSalaried ? "Monthly Net Salary" : "Net Monthly Income"}</span>
                <strong>
                  ₹{Number(isSalaried ? form.monthlyNetSalary : form.netMonthlyIncome || 0).toLocaleString("en-IN")}
                </strong>
              </div>

              {isSelfEmployed && (
                <>
                  <div>
                    <span>GST</span>
                    <strong>{form.gstNumber || "Not Captured"}</strong>
                  </div>
                  <div>
                    <span>ITR Request</span>
                    <strong>{form.itrStatus}</strong>
                  </div>
                  <div>
                    <span>GST Request</span>
                    <strong>{form.gstStatus}</strong>
                  </div>
                </>
              )}

              <div>
                <span>Office City</span>
                <strong>{form.officeCity || "—"}</strong>
              </div>
            </div>
          </section>

          <section className="ie-side-card">
            <h4>Uploaded Documents</h4>

            {uploadedFiles.length === 0 ? (
              <div className="ie-empty-docs">
                <FileIcon />
                <p>No income documents uploaded yet.</p>
              </div>
            ) : (
              <div className="ie-uploaded-list">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="ie-uploaded-file">
                    <span>
                      <FileIcon />
                    </span>
                    <div>
                      <strong>{file.documentType}</strong>
                      <p>{file.fileName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
}

export default IncomeEmploymentPage;