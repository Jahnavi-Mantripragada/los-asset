import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CustomerIdentityPage.css";

const CONSENT_WAIT_SECONDS = 6;
const PAN_CARD_PATH = "/docs/PanCard.jpg";
const ADDRESS_PROOF_PATH = "/docs/Voter Id_1550.pdf";

const MOCK_CUSTOMERS = [
  {
    firstName: "Shivanjali",
    lastName: "Gaikwad",
    fullName: "Shivanjali Gaikwad",
    customerId: "YESC00918427",
    aadhaarNumber: "312455018833",
    accountNumber: "102345678901",
    mobileNumber: "8552051111",
    mobile: "+91 85520 51111",
    email: "shivanjali.gaikwad@email.com",
    dateOfBirth: "01 Nov 1996",
    fatherName: "Sanjay Gaikwad",
    gender: "Female",
    maritalStatus: "Married",
    occupation: "Salaried",
    pan: "CIJPG1001N",
    address: "D-303, Fortune Estate, Hadapsar, Pune, Maharashtra - 411028",
    pincode: "411028",
    homeBranch: "Pune - Hadapsar",
    kycStatus: "Current",
    kycUpdatedAt: "12 Mar 2025",
    ckycNumber: "XXXXXXXX4812",
    riskCategory: "Low",
  },
  {
    firstName: "Aarav",
    lastName: "Mehta",
    fullName: "Aarav Mehta",
    customerId: "YESC00467231",
    aadhaarNumber: "487263951742",
    accountNumber: "110023456789",
    mobileNumber: "9876543210",
    mobile: "+91 98765 43210",
    email: "aarav.mehta@email.com",
    dateOfBirth: "18 Jun 1989",
    fatherName: "Rajesh Mehta",
    gender: "Male",
    maritalStatus: "Married",
    occupation: "Self-employed",
    pan: "AJPPM4821K",
    address: "B-804, Lake View Residency, Baner, Pune, Maharashtra - 411045",
    pincode: "411045",
    homeBranch: "Pune - Baner",
    kycStatus: "Current",
    kycUpdatedAt: "05 Feb 2026",
    ckycNumber: "XXXXXXXX7364",
    riskCategory: "Low",
  },
];

const AUTHENTICATION_OPTIONS = {
  CUSTOMER_ID: {
    label: "Customer ID",
    placeholder: "Enter 12-character Customer ID",
    inputMode: "text",
    maxLength: 12,
    validate: (value) => /^YESC\d{8}$/i.test(value),
    error: "Enter a valid Customer ID, for example YESC00918427.",
  },
  AADHAAR: {
    label: "Aadhaar Number",
    placeholder: "Enter 12-digit Aadhaar number",
    inputMode: "numeric",
    maxLength: 12,
    validate: (value) => /^\d{12}$/.test(value),
    error: "Enter a valid 12-digit Aadhaar number.",
  },
  MOBILE: {
    label: "Mobile Number",
    placeholder: "Enter 10-digit mobile number",
    inputMode: "numeric",
    maxLength: 10,
    validate: (value) => /^\d{10}$/.test(value),
    error: "Enter a valid 10-digit mobile number.",
  },
};

const Icon = ({ children, size = 18, className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const UserIcon = () => (
  <Icon>
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Icon>
);

const ShieldIcon = () => (
  <Icon>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-5" />
  </Icon>
);

const PhoneIcon = () => (
  <Icon>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />
  </Icon>
);

const FileIcon = () => (
  <Icon>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </Icon>
);

const UploadIcon = () => (
  <Icon size={16}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5M12 3v12" />
  </Icon>
);

const PencilIcon = () => (
  <Icon size={15}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </Icon>
);

const EyeIcon = () => (
  <Icon size={15}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const RefreshIcon = () => (
  <Icon size={15}>
    <path d="M21 12a9 9 0 0 1-15.2 6.5M3 12A9 9 0 0 1 18.2 5.5M18 3v5h-5M6 21v-5h5" />
  </Icon>
);

const AlertIcon = () => (
  <Icon size={16}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </Icon>
);

const Spinner = ({ size = 16 }) => (
  <Icon className="glci-spinner" size={size}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </Icon>
);

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");
const normaliseMobile = (value) => digitsOnly(value).slice(-10);

const findCustomerByMobile = (mobile) => {
  const normalisedMobile = normaliseMobile(mobile);
  return (
    MOCK_CUSTOMERS.find((item) => item.mobileNumber === normalisedMobile) ||
    null
  );
};

const findCustomerByAuthentication = (parameter, value) => {
  const candidate = String(value || "").trim();
  if (parameter === "CUSTOMER_ID") {
    return (
      MOCK_CUSTOMERS.find(
        (item) => item.customerId.toUpperCase() === candidate.toUpperCase(),
      ) || null
    );
  }
  if (parameter === "AADHAAR") {
    return (
      MOCK_CUSTOMERS.find(
        (item) => item.aadhaarNumber === digitsOnly(candidate),
      ) || null
    );
  }
  return findCustomerByMobile(candidate);
};

const toPersistableCustomer = (customer) =>
  customer
    ? {
        fullName: customer.fullName,
        firstName: customer.firstName,
        middleName: customer.middleName || "",
        lastName: customer.lastName,
        customerId: customer.customerId,
        mobile: customer.mobile,
        email: customer.email,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender || "",
        pan: customer.pan,
        addressLine1: customer.addressLine1 || "",
        addressLine2: customer.addressLine2 || "",
        city: customer.city || "",
        pincode: customer.pincode || "",
        homeBranch: customer.homeBranch,
        kycStatus: customer.kycStatus,
        kycUpdatedAt: customer.kycUpdatedAt,
        ckycNumber: customer.ckycNumber,
        riskCategory: customer.riskCategory,
      }
    : null;

const parseLeadDetails = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const buildLeadCustomer = (lead, leadDetails) => ({
  firstName: lead.firstName || "",
  middleName: lead.middleName || "",
  lastName: lead.lastName || "",
  fullName:
    [lead.firstName, lead.middleName, lead.lastName]
      .filter(Boolean)
      .join(" ") || "Gold Loan applicant",
  customerId: "",
  mobile: lead.mobile || "—",
  email: lead.email || "—",
  dateOfBirth: leadDetails.dateOfBirth || lead.dateOfBirth || "—",
  gender: leadDetails.gender || lead.gender || "",
  pan: leadDetails.panNumber || lead.panNumber || "—",
  addressLine1:
    leadDetails.addressLine1 ||
    leadDetails.address ||
    leadDetails.communicationAddress ||
    lead.address ||
    "",
  addressLine2: leadDetails.addressLine2 || "",
  city: leadDetails.city || lead.city || "",
  pincode:
    leadDetails.pincode ||
    lead.pincode ||
    String(
      leadDetails.address ||
        leadDetails.communicationAddress ||
        lead.address ||
        "",
    ).match(/\b\d{6}\b/)?.[0] ||
    "",
  homeBranch: leadDetails.homeBranchName || "To be assigned",
  kycStatus: leadDetails.kycStatus || lead.kycStatus || "Pending",
  kycUpdatedAt: leadDetails.kycLastUpdated || "—",
  ckycNumber: leadDetails.ckycNumber || "—",
  riskCategory: leadDetails.riskCategory || "Not assessed",
});

const createReference = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const maskMobile = (value) => {
  const digits = normaliseMobile(value);
  return digits ? `+91 XXXXX ${digits.slice(-5)}` : "—";
};

const getInitials = (name) =>
  String(name || "GL")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const toDateInputValue = (value) => {
  if (!value || value === "—") return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (value) => {
  const parsed = value ? new Date(`${value}T00:00:00`) : null;
  return parsed && !Number.isNaN(parsed.getTime())
    ? parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
};

const buildBorrowerDetails = (customer, lead) => ({
  firstName: customer.firstName || lead.firstName || "",
  middleName: customer.middleName || lead.middleName || "",
  lastName: customer.lastName || lead.lastName || "",
  dateOfBirth: toDateInputValue(customer.dateOfBirth || lead.dateOfBirth),
  gender: customer.gender || lead.gender || "",
  mobile: normaliseMobile(customer.mobile || lead.mobile),
  email: customer.email === "—" ? "" : customer.email || lead.email || "",
  pan: customer.pan === "—" ? "" : customer.pan || lead.panNumber || "",
  addressLine1:
    customer.addressLine1 === "—" ? "" : customer.addressLine1 || lead.address || "",
  addressLine2: customer.addressLine2 || "",
  city: customer.city || lead.city || "",
  pincode: customer.pincode || lead.pincode || "",
});

const buildBorrowerDocuments = (customerType) =>
  customerType === "ETB"
    ? {
        pan: {
          name: "PanCard.jpg",
          preview: PAN_CARD_PATH,
          status: "Verified",
          source: "CBS KYC",
          verifiedAt: "CBS record",
        },
        addressProof: {
          name: "Voter Id_1550.pdf",
          preview: ADDRESS_PROOF_PATH,
          status: "Verified",
          source: "CBS KYC",
        },
      }
    : {
        pan: { name: "", preview: "", status: "Pending", source: "" },
        addressProof: {
          name: "",
          preview: "",
          status: "Pending",
          source: "",
        },
      };

const buildBorrowerInformation = (customerType, customer, lead) => ({
  status: customerType === "ETB" ? "Saved" : "Draft",
  savedAt: customerType === "ETB" ? "CBS record" : "",
  details: buildBorrowerDetails(customer, lead),
  documents: buildBorrowerDocuments(customerType),
});

const validateBorrower = (details) => {
  const errors = {};
  const namePattern = /^[A-Za-z][A-Za-z .'-]*$/;
  if (!details.firstName.trim()) errors.firstName = "Name is required.";
  else if (!namePattern.test(details.firstName.trim()))
    errors.firstName = "Enter a valid name.";
  if (!details.lastName.trim()) errors.lastName = "Last name is required.";
  else if (!namePattern.test(details.lastName.trim()))
    errors.lastName = "Enter a valid last name.";
  if (!details.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const dob = new Date(`${details.dateOfBirth}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const beforeBirthday =
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
    if (beforeBirthday) age -= 1;
    if (Number.isNaN(dob.getTime()) || dob > today)
      errors.dateOfBirth = "Enter a valid date of birth.";
    else if (age < 18)
      errors.dateOfBirth = "Borrower must be at least 18 years old.";
    else if (age > 75)
      errors.dateOfBirth = "Borrower age cannot exceed 75 years.";
  }
  if (!details.gender) errors.gender = "Select gender.";
  if (!/^\d{10}$/.test(details.mobile))
    errors.mobile = "Enter a valid 10-digit mobile number.";
  if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
    errors.email = "Enter a valid email address.";
  if (details.pan && details.pan.trim() && !/^[A-Z]{5}\d{4}[A-Z]$/.test(details.pan.toUpperCase()))
    errors.pan = "Enter a valid PAN, for example ABCDE1234F.";
  if (details.addressLine1 && details.addressLine1.trim().length > 0 && details.addressLine1.trim().length < 5)
    errors.addressLine1 = "Enter the address line 1.";
  if (details.city && details.city.trim().length > 0 && details.city.trim().length < 2)
    errors.city = "Enter the city.";
  if (details.pincode && details.pincode.trim() && !/^\d{6}$/.test(details.pincode))
    errors.pincode = "Enter a valid 6-digit PIN code.";
  return errors;
};

const ensureLeadDetailsNodes = (rawLeadDetails, lead) => {
  const leadDetails = parseLeadDetails(rawLeadDetails);
  const mobileMatch = findCustomerByMobile(lead.mobile);
  const existingIdentity = leadDetails.customerIdentity || {};
  const matchedCustomer =
    existingIdentity.matchedCustomer || toPersistableCustomer(mobileMatch);
  const customerType =
    existingIdentity.customerType || (matchedCustomer ? "ETB" : "NTB");
  const borrowerDefaults = buildBorrowerInformation(
    customerType,
    matchedCustomer || buildLeadCustomer(lead, leadDetails),
    lead,
  );
  const existingBorrower = leadDetails.borrowerInformation || {};

  return {
    ...leadDetails,
    customerIdentity: {
      matchSource: "VERIFIED_MOBILE",
      customerIdentityConfirmed: false,
      authenticationParameter: "",
      authenticationReference: "",
      confirmedAt: "",
      ...existingIdentity,
      customerType,
      matchStatus: matchedCustomer ? "MATCH_FOUND" : "NO_MATCH",
      matchedCustomer,
    },
    customerConsent: {
      status: "Pending",
      requestReference: "",
      channel: "Secure SMS link with OTP",
      sentAt: "",
      capturedAt: "",
      expiresAt: "",
      resendCount: 0,
      ...leadDetails.customerConsent,
    },
    ntbOnboarding: {
      status: "Pending",
      ...leadDetails.ntbOnboarding,
      documents: {
        pan: { name: "", preview: "", status: "Pending" },
        ovd: { name: "", preview: "", status: "Pending" },
        ...leadDetails.ntbOnboarding?.documents,
      },
    },
    borrowerInformation: {
      ...borrowerDefaults,
      ...existingBorrower,
      details: {
        ...borrowerDefaults.details,
        ...existingBorrower.details,
      },
      documents: {
        ...borrowerDefaults.documents,
        ...existingBorrower.documents,
      },
    },
  };
};

const getTimestamp = (value = new Date()) =>
  value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Unable to read the selected document."));
    reader.readAsDataURL(file);
  });

function StatusBadge({ variant = "pending", children }) {
  return <span className={`glci-badge ${variant}`}>{children}</span>;
}

function SectionHeader({ number, title, description, status, statusVariant }) {
  return (
    <div className="glci-section-head">
      <span
        className={`glci-section-number ${statusVariant === "success" ? "complete" : ""}`}
      >
        {statusVariant === "success" ? <CheckIcon size={14} /> : number}
      </span>
      <div className="glci-section-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <StatusBadge variant={statusVariant}>{status}</StatusBadge>
    </div>
  );
}

function Detail({ label, value, verified = false, wide = false, required = false }) {
  return (
    <div className={`glci-detail ${wide ? "wide" : ""}`}>
      <span>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </span>
      <div>
        <strong>{value || "—"}</strong>
        {verified && (
          <StatusBadge variant="success">
            <CheckIcon size={11} /> Verified
          </StatusBadge>
        )}
      </div>
    </div>
  );
}

function BorrowerField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  options,
  inputMode,
  maxLength,
  wide = false,
}) {
  const controlProps = {
    id: `borrower-${name}`,
    name,
    value,
    onChange,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `borrower-${name}-error` : undefined,
    required,
  };

  return (
    <label className={`glci-borrower-field ${wide ? "wide" : ""}`}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {options ? (
        <select {...controlProps}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : wide ? (
        <textarea {...controlProps} rows="3" maxLength={maxLength} />
      ) : (
        <input
          {...controlProps}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
        />
      )}
      {error && (
        <small id={`borrower-${name}-error`} className="glci-field-error">
          {error}
        </small>
      )}
    </label>
  );
}

function BorrowerDocument({
  label,
  description,
  document,
  onUpload,
  disabled,
}) {
  const inputRef = useRef(null);
  const verified = document.status === "Verified";
  const isImage =
    String(document.preview || "").startsWith("data:image") ||
    /\.(jpg|jpeg|png)$/i.test(document.preview || "");
  const canView = Boolean(document.preview);

  return (
    <div className={`glci-borrower-document ${verified ? "verified" : ""}`}>
      <div className="glci-borrower-document-preview">
        {document.preview && isImage ? (
          <img src={document.preview} alt="Uploaded document preview" />
        ) : (
          <span className="glci-document-placeholder">
            <FileIcon />
          </span>
        )}

        {verified && (
          <span className="glci-document-check">
            <CheckIcon size={13} />
          </span>
        )}
      </div>

      <div className="glci-document-copy">
        <strong>
          {label}
          <em>*</em>
        </strong>
        <span>{document.name || description}</span>
        <small className={verified ? "verified" : ""}>
          {verified
            ? `${document.source || "Document"} · Verified`
            : document.status === "Uploaded"
              ? "Uploaded"
              : "PDF, JPG or PNG · Max 5 MB"}
        </small>
      </div>

      <div className="glci-document-actions">
        {canView && (
          <a
            className="glci-link-button"
            href={document.preview}
            target="_blank"
            rel="noreferrer"
          >
            <EyeIcon /> View
          </a>
        )}
        <button
          type="button"
          className="glci-link-button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <UploadIcon /> {document.name ? "Re-upload" : "Upload"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function CustomerIdentity({
  lead = {},
  sectionKey = "customerIdentity",
  updateApplicationData,
  updateStepStatus,
  updateLeadDetails,
  onLeadDetailsChange,
  setLead,
}) {
  const [leadDetailsJson, setLeadDetailsJson] = useState(() =>
    ensureLeadDetailsNodes(lead.leadDetails, lead),
  );
  const [showCustomerSearch, setShowCustomerSearch] = useState(
    () => !findCustomerByMobile(lead.mobile),
  );
  const [searchMethod, setSearchMethod] = useState("CUSTOMER_ID");
  const [searchValue, setSearchValue] = useState("");
  const [searchRunning, setSearchRunning] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResultStatus, setSearchResultStatus] = useState("IDLE");
  const [consentSeconds, setConsentSeconds] = useState(CONSENT_WAIT_SECONDS);
  const [notice, setNotice] = useState("");
  const [borrowerDraft, setBorrowerDraft] = useState(
    () =>
      ensureLeadDetailsNodes(lead.leadDetails, lead).borrowerInformation
        .details,
  );
  const [borrowerErrors, setBorrowerErrors] = useState({});
  const [isBorrowerEditing, setIsBorrowerEditing] = useState(
    () =>
      ensureLeadDetailsNodes(lead.leadDetails, lead).borrowerInformation
        .status !== "Saved",
  );
  const [isAddressIdentityEditing, setIsAddressIdentityEditing] = useState(false);
  const uploadTimers = useRef([]);

  const identityNode = leadDetailsJson.customerIdentity;
  const consentNode = leadDetailsJson.customerConsent;
  const ntbNode = leadDetailsJson.ntbOnboarding;
  const borrowerNode = leadDetailsJson.borrowerInformation;
  const customerType = identityNode.customerType;
  const customerConfirmed = identityNode.customerIdentityConfirmed;
  const consentStatus = consentNode.status;
  const consentSentAt = consentNode.sentAt;
  const consentCapturedAt = consentNode.capturedAt;
  const ntbOnboardingStatus = ntbNode.status;
  const borrowerDocuments = borrowerNode.documents;
  const customer = useMemo(
    () =>
      identityNode.matchedCustomer || buildLeadCustomer(lead, leadDetailsJson),
    [identityNode.matchedCustomer, lead, leadDetailsJson],
  );
  const authOption = AUTHENTICATION_OPTIONS[searchMethod];

  const updateNode = useCallback((nodeName, patchOrUpdater) => {
    setLeadDetailsJson((current) => {
      const currentNode = current[nodeName];
      const patch =
        typeof patchOrUpdater === "function"
          ? patchOrUpdater(currentNode)
          : patchOrUpdater;
      return {
        ...current,
        [nodeName]: { ...currentNode, ...patch },
      };
    });
  }, []);

  useEffect(() => {
    const initialisedDetails = ensureLeadDetailsNodes(lead.leadDetails, lead);
    setLeadDetailsJson(initialisedDetails);
    setShowCustomerSearch(
      initialisedDetails.customerIdentity.customerType === "NTB" &&
        !initialisedDetails.customerIdentity.customerIdentityConfirmed,
    );
    setSearchValue("");
    setSearchError("");
    setSearchResultStatus("IDLE");
  }, [lead.id, lead.leadNumber, lead.mobile]);

  useEffect(() => {
    setBorrowerDraft(borrowerNode.details);
    setBorrowerErrors({});
    setIsBorrowerEditing(borrowerNode.status !== "Saved");
  }, [borrowerNode.details, borrowerNode.status]);

  useEffect(() => {
    setLead?.((currentLead) => ({
      ...currentLead,
      leadDetails: leadDetailsJson,
    }));
    updateLeadDetails?.(leadDetailsJson);
    onLeadDetailsChange?.(leadDetailsJson);
    // Parent callbacks commonly change identity on every render. Persistence
    // is intentionally driven only by a business change to leadDetailsJson.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadDetailsJson]);

  const consentCaptured = consentStatus === "Captured";
  const borrowerInformationSaved = borrowerNode.status === "Saved";
  const borrowerDocumentsComplete =
    Boolean(borrowerDocuments.pan.preview) &&
    Boolean(borrowerDocuments.addressProof.preview);
  const ntbOnboarded = ntbOnboardingStatus === "Completed";
  const profileReady = customerConfirmed && consentCaptured;
  const stepComplete =
    customerConfirmed &&
    consentCaptured &&
    borrowerInformationSaved &&
    borrowerDocumentsComplete &&
    (customerType === "ETB" || ntbOnboarded);

  useEffect(
    () => () => {
      uploadTimers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    if (consentStatus !== "Sent") return undefined;

    const timer = window.setInterval(() => {
      setConsentSeconds((seconds) => {
        if (seconds > 1) return seconds - 1;

        updateNode("customerConsent", {
          status: "Captured",
          capturedAt: getTimestamp(),
        });
        setNotice("Customer consent received and recorded.");
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [consentStatus, updateNode]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    updateApplicationData?.(sectionKey, {
      customerType,
      relationshipSource: "Verified mobile number at lead creation",
      customerIdentityConfirmed: customerConfirmed,
      customerName: customer.fullName,
      cbsCustomerId:
        customerType === "ETB" || ntbOnboarded ? customer.customerId : "",
      consentStatus,
      consentSentAt,
      consentCapturedAt,
      consentMode: consentCaptured ? "Secure mobile link / OTP" : "",
      applicationConsent: consentCaptured,
      cbsKycConsent: consentCaptured,
      internalEligibilityConsent: consentCaptured,
      conditionalCibilConsent: consentCaptured,
      communicationConsent: consentCaptured,
      authenticationParameter: identityNode.authenticationParameter,
      authenticationReference: identityNode.authenticationReference,
      kycStatus:
        customerType === "ETB" ? customer.kycStatus : ntbOnboardingStatus,
      borrowerInformation: borrowerNode,
      documents: borrowerDocuments,
      freshKycDocumentsRequired: customerType === "NTB",
      leadDetails: leadDetailsJson,
    });

    updateStepStatus?.(
      "customer-identity",
      stepComplete ? "Completed" : "In Progress",
    );
    // Parent callbacks commonly change identity on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    consentCaptured,
    consentCapturedAt,
    consentSentAt,
    consentStatus,
    customer.fullName,
    customer.customerId,
    customer.kycStatus,
    customerConfirmed,
    customerType,
    borrowerDocuments,
    borrowerNode,
    ntbOnboarded,
    ntbOnboardingStatus,
    sectionKey,
    stepComplete,
  ]);

  const confirmCustomer = () => {
    updateNode("customerIdentity", {
      customerIdentityConfirmed: true,
      confirmedAt: getTimestamp(),
    });
    setShowCustomerSearch(false);
    setNotice(
      customerType === "ETB"
        ? "CBS customer confirmed against the lead."
        : "Lead customer confirmed. Continue with consent and onboarding.",
    );
  };

  const confirmationBeforeSearchRef = useRef(false);

  const startCustomerSearch = () => {
    confirmationBeforeSearchRef.current = customerConfirmed;
    updateNode("customerIdentity", {
      customerIdentityConfirmed: false,
      confirmedAt: "",
    });
    setShowCustomerSearch(true);
    setSearchError("");
    setSearchResultStatus("IDLE");
    setSearchValue("");
  };

  const cancelCustomerSearch = () => {
    if (confirmationBeforeSearchRef.current) {
      updateNode("customerIdentity", {
        customerIdentityConfirmed: true,
        confirmedAt: identityNode.confirmedAt || getTimestamp(),
      });
    }
    setShowCustomerSearch(false);
    setSearchError("");
    setSearchResultStatus("IDLE");
    setSearchValue("");
  };

  const searchCustomer = () => {
    const value = searchValue.trim();
    if (!authOption.validate(value)) {
      setSearchError(authOption.error);
      return;
    }

    setSearchError("");
    setSearchResultStatus("IDLE");
    setSearchRunning(true);

    const timer = window.setTimeout(() => {
      const match = findCustomerByAuthentication(searchMethod, value);
      const reference = createReference(
        searchMethod === "CUSTOMER_ID"
          ? "AUTH-CID"
          : searchMethod === "AADHAAR"
            ? "AUTH-AAD"
            : "AUTH-MOB",
      );
      setSearchRunning(false);
      setSearchValue("");

      if (!match) {
        setSearchResultStatus("NO_MATCH");
        updateNode("customerIdentity", {
          lastAuthenticationAttempt: {
            parameter: searchMethod,
            authenticationReference: reference,
            result: "NO_MATCH",
            attemptedAt: getTimestamp(),
          },
        });
        return;
      }

      setSearchResultStatus("MATCH_FOUND");
      setShowCustomerSearch(false);
      updateNode("customerIdentity", {
        customerType: "ETB",
        matchStatus: "MATCH_FOUND",
        matchSource: searchMethod,
        matchedCustomer: toPersistableCustomer(match),
        customerIdentityConfirmed: false,
        authenticationParameter: searchMethod,
        authenticationReference: reference,
        confirmedAt: "",
      });
      updateNode(
        "borrowerInformation",
        buildBorrowerInformation("ETB", toPersistableCustomer(match), lead),
      );
      updateNode("customerConsent", {
        status: "Pending",
        requestReference: "",
        sentAt: "",
        capturedAt: "",
        expiresAt: "",
        resendCount: 0,
      });
      setNotice(
        `${authOption.label} verified. CBS match updated with reference ${reference}.`,
      );
    }, 1800);

    uploadTimers.current.push(timer);
  };

  const continueAsNtb = () => {
    const attempt = identityNode.lastAuthenticationAttempt;

    updateNode("customerIdentity", {
      customerType: "NTB",
      matchStatus: "NO_MATCH",
      matchSource: attempt?.parameter || "VERIFIED_MOBILE",
      matchedCustomer: null,
      customerIdentityConfirmed: true,
      authenticationParameter: attempt?.parameter || "",
      authenticationReference: attempt?.authenticationReference || "",
      confirmedAt: getTimestamp(),
    });
    updateNode("customerConsent", {
      status: "Pending",
      requestReference: "",
      sentAt: "",
      capturedAt: "",
      expiresAt: "",
      resendCount: 0,
    });
    updateNode(
      "borrowerInformation",
      buildBorrowerInformation(
        "NTB",
        buildLeadCustomer(lead, leadDetailsJson),
        lead,
      ),
    );
    setShowCustomerSearch(false);
    setSearchValue("");
    setSearchError("");
    setSearchResultStatus("IDLE");
    setNotice("No CBS match found. Applicant confirmed as an NTB customer.");
  };

  const sendConsent = () => {
    const resendCount =
      consentStatus === "Sent" || consentStatus === "Captured"
        ? (consentNode.resendCount || 0) + 1
        : consentNode.resendCount || 0;
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    setConsentSeconds(CONSENT_WAIT_SECONDS);
    updateNode("customerConsent", {
      status: "Sent",
      requestReference: createReference("CONSENT"),
      sentAt: getTimestamp(),
      capturedAt: "",
      expiresAt: getTimestamp(expiry),
      resendCount,
    });
    setNotice(
      resendCount
        ? "Consent request resent to the registered mobile."
        : "Consent request sent to the registered mobile.",
    );
  };

  const handleDocumentUpload = async (key, file) => {
    if (file.size > 5 * 1024 * 1024) {
      setNotice("Please upload a document up to 5 MB.");
      return;
    }

    try {
      const preview = await readFile(file);
      updateNode("borrowerInformation", (current) => ({
        documents: {
          ...current.documents,
          [key]: {
            name: file.name,
            preview,
            status: "Uploaded",
            source: "Fresh upload",
            uploadedAt: getTimestamp(),
            verification: null,
          },
        },
      }));
      setNotice(
        key === "pan"
          ? "PAN uploaded successfully."
          : "Address proof uploaded successfully.",
      );
    } catch (error) {
      setNotice(error.message);
    }
  };

  const splitFullName = (fullName) => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { firstName: "", middleName: "", lastName: "" };
    if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
    if (parts.length === 2) return { firstName: parts[0], middleName: "", lastName: parts[1] };
    const lastName = parts.pop();
    const firstName = parts.shift();
    const middleName = parts.join(" ");
    return { firstName, middleName, lastName };
  };

  const handleBorrowerChange = (event) => {
    const { name, value } = event.target;
    let normalisedValue = value;
    let updates = {};

    if (name === "name") {
      const { firstName, middleName, lastName } = splitFullName(value);
      updates = { firstName, middleName, lastName };
    } else if (name === "mobile" || name === "pincode") {
      normalisedValue = digitsOnly(value).slice(0, name === "mobile" ? 10 : 6);
      updates = { [name]: normalisedValue };
    } else if (name === "pan") {
      normalisedValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
      updates = { [name]: normalisedValue };
    } else {
      updates = { [name]: value };
    }

    setBorrowerDraft((current) => ({ ...current, ...updates }));
    setBorrowerErrors((current) => ({
      ...current,
      name: "",
      firstName: "",
      middleName: "",
      lastName: "",
      [name]: "",
    }));
  };

  const saveBorrowerInformation = () => {
    const errors = validateBorrower(borrowerDraft);
    if (Object.keys(errors).length) {
      setBorrowerErrors(errors);
      setNotice("Please correct the highlighted borrower information.");
      return;
    }

    const details = {
      ...borrowerDraft,
      firstName: borrowerDraft.firstName.trim(),
      middleName: borrowerDraft.middleName.trim(),
      lastName: borrowerDraft.lastName.trim(),
      email: borrowerDraft.email.trim().toLowerCase(),
      pan: borrowerDraft.pan.trim().toUpperCase(),
      addressLine1: borrowerDraft.addressLine1.trim(),
      addressLine2: borrowerDraft.addressLine2.trim(),
      city: borrowerDraft.city.trim(),
      pincode: borrowerDraft.pincode.trim(),
    };
    const fullName = [details.firstName, details.middleName, details.lastName]
      .filter(Boolean)
      .join(" ");

    const panChanged = details.pan !== borrowerNode.details.pan;
    updateNode("borrowerInformation", (current) => ({
      status: "Saved",
      savedAt: getTimestamp(),
      details,
      documents: panChanged
        ? {
            ...current.documents,
            pan: {
              ...current.documents.pan,
              status: current.documents.pan.preview ? "Uploaded" : "Pending",
              verification: null,
              verifiedAt: "",
              verificationReference: "",
            },
          }
        : current.documents,
    }));
    updateNode("customerIdentity", {
      matchedCustomer: {
        ...customer,
        ...details,
        fullName,
        dateOfBirth: formatDateForDisplay(details.dateOfBirth),
        mobile: `+91 ${details.mobile.slice(0, 5)} ${details.mobile.slice(5)}`,
      },
    });
    setIsBorrowerEditing(false);
    setBorrowerErrors({});
    setNotice("Borrower information saved successfully.");
  };

  const validateAddressIdentity = (details) => {
    const errors = {};

    if (!details.pan.trim()) {
      errors.pan = "PAN is required.";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(details.pan.trim().toUpperCase())) {
      errors.pan = "Enter a valid PAN, for example ABCDE1234F.";
    }

    if (!details.addressLine1.trim()) {
      errors.addressLine1 = "Address line 1 is required.";
    } else if (details.addressLine1.trim().length < 5) {
      errors.addressLine1 = "Enter the address line 1.";
    }

    if (details.city && details.city.trim().length < 2) {
      errors.city = "Enter the city.";
    } else if (!details.city.trim()) {
      errors.city = "City is required.";
    }

    if (!/^\d{6}$/.test(details.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit PIN code.";
    }

    return errors;
  };

  const saveAddressIdentity = () => {
    const errors = validateAddressIdentity(borrowerDraft);
    if (Object.keys(errors).length) {
      setBorrowerErrors((current) => ({ ...current, ...errors }));
      setNotice("Please correct the highlighted Address & Identity fields.");
      return;
    }

    const details = {
      ...borrowerNode.details,
      ...borrowerDraft,
      pan: borrowerDraft.pan.trim().toUpperCase(),
      addressLine1: borrowerDraft.addressLine1.trim(),
      addressLine2: borrowerDraft.addressLine2.trim(),
      city: borrowerDraft.city.trim(),
      pincode: borrowerDraft.pincode.trim(),
    };

    const fullName = [details.firstName, details.middleName, details.lastName]
      .filter(Boolean)
      .join(" ");

    updateNode("borrowerInformation", (current) => ({
      status: "Saved",
      savedAt: current.savedAt || getTimestamp(),
      details,
    }));

    updateNode("customerIdentity", {
      matchedCustomer: {
        ...customer,
        ...details,
        fullName,
        dateOfBirth: formatDateForDisplay(details.dateOfBirth),
        mobile: `+91 ${details.mobile.slice(0, 5)} ${details.mobile.slice(5)}`,
      },
    });

    setBorrowerDraft(details);
    setBorrowerErrors({});
    setIsAddressIdentityEditing(false);
    setNotice("Address & Identity saved successfully.");
  };

  const completeNtbOnboarding = () => {
    updateNode("ntbOnboarding", { status: "Running" });
    const timer = window.setTimeout(() => {
      const generatedCustomerId = `YESC${String(Date.now()).slice(-8)}`;
      updateNode("ntbOnboarding", {
        status: "Completed",
        completedAt: getTimestamp(),
      });
      updateNode("customerIdentity", {
        matchedCustomer: {
          ...customer,
          ...borrowerNode.details,
          fullName: [
            borrowerNode.details.firstName,
            borrowerNode.details.middleName,
            borrowerNode.details.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          dateOfBirth: formatDateForDisplay(borrowerNode.details.dateOfBirth),
          customerId: generatedCustomerId,
          kycStatus: "Current",
          kycUpdatedAt: getTimestamp(),
        },
      });
      setNotice("KYC completed and CBS customer profile created.");
    }, 2600);
    uploadTimers.current.push(timer);
  };

  return (
    <div className="glci-page">
      {notice && (
        <div className="glci-toast" role="status">
          <CheckIcon /> {notice}
        </div>
      )}

      <header className={`glci-relationship ${customerType.toLowerCase()}`}>
        <div className="glci-relationship-main">
          <span className="glci-relationship-icon">
            <UserIcon />
          </span>
          <div>
            <span className="glci-eyebrow">
              IDENTIFIED DURING LEAD CREATION
            </span>
            <div className="glci-relationship-title">
              <h2>{customer.fullName}</h2>
              <StatusBadge variant={customerType === "ETB" ? "gold" : "light"}>
                {customerType}
              </StatusBadge>
              <StatusBadge variant="success">
                <CheckIcon size={11} /> Mobile verified
              </StatusBadge>
            </div>
            <p>
              {customerType === "ETB"
                ? "A CBS relationship was found using the verified lead mobile number. Confirm the matched customer before obtaining consent."
                : "No CBS relationship was found using the verified lead mobile number. Confirm the lead customer, obtain consent, then complete onboarding."}
            </p>
          </div>
        </div>
        <div className="glci-lead-meta">
          <span>Lead</span>
          <strong>{lead.id || lead.leadNumber || "GL-LEAD-10284"}</strong>
          <small>{customer.mobile}</small>
        </div>
      </header>

      <div className="glci-flow">
        <section className="glci-section">
          <SectionHeader
            number="1"
            title="Confirm customer identity"
            description={
              customerType === "ETB"
                ? "A CBS match was found using the verified mobile number. Confirm the match or update it using another authentication parameter."
                : "No CBS customer was found using the verified mobile number. Continue the applicant as a new-to-bank customer."
            }
            status={customerConfirmed ? "Confirmed" : "Action required"}
            statusVariant={customerConfirmed ? "success" : "pending"}
          />

          {customerType === "ETB" ? (
            <div className="glci-card glci-match-card">
              <div className="glci-avatar">
                {getInitials(customer.fullName)}
              </div>
              <div className="glci-match-details">
                <div className="glci-match-name">
                  <strong>{customer.fullName}</strong>
                  <span>CBS match found</span>
                </div>
                <div className="glci-match-grid">
                  <span>
                    <small>Registered mobile</small>
                    <strong>{customer.mobile}</strong>
                  </span>
                  <span>
                    <small>CBS Customer ID</small>
                    <strong>{customer.customerId}</strong>
                  </span>
                  <span>
                    <small>Home branch</small>
                    <strong>{customer.homeBranch}</strong>
                  </span>
                </div>
                {identityNode.authenticationReference && (
                  <div className="glci-reference-line">
                    Authentication reference{" "}
                    <strong>{identityNode.authenticationReference}</strong>
                  </div>
                )}
              </div>
              <div className="glci-match-actions">
                <button
                  type="button"
                  className="glci-primary-button"
                  onClick={confirmCustomer}
                  disabled={customerConfirmed}
                >
                  {customerConfirmed ? (
                    <>
                      <CheckIcon /> Match confirmed
                    </>
                  ) : (
                    "Confirm match"
                  )}
                </button>
                <button
                  type="button"
                  className="glci-secondary-button"
                  onClick={startCustomerSearch}
                >
                  Update match
                </button>
              </div>
            </div>
          ) : (
            <div className="glci-card glci-no-match-card">
              <span className="glci-no-match-icon">
                <UserIcon />
              </span>
              <div>
                <strong>No customer found in CBS</strong>
                <p>
                  No existing relationship is linked to verified mobile{" "}
                  {maskMobile(lead.mobile)}. Search using Customer ID, Aadhaar
                  or another mobile number, or continue through NTB onboarding.
                </p>
              </div>
              <button
                type="button"
                className="glci-primary-button"
                onClick={confirmCustomer}
                disabled={customerConfirmed}
              >
                {customerConfirmed ? (
                  <>
                    <CheckIcon /> NTB identity confirmed
                  </>
                ) : (
                  "Continue as NTB customer"
                )}
              </button>
            </div>
          )}

          {showCustomerSearch && !customerConfirmed && (
            <div className="glci-customer-search-wrap">
              <div className="glci-search-heading">
                <div>
                  <strong>Update customer match</strong>
                  <span>
                    Use one authentication parameter. The entered value is not
                    retained.
                  </span>
                </div>
                {customerType === "ETB" && (
                  <button
                    type="button"
                    className="glci-text-button"
                    onClick={cancelCustomerSearch}
                  >
                    Back to matched customer
                  </button>
                )}
              </div>
              <div className="glci-customer-search">
                <label>
                  <span>Authentication parameter</span>
                  <select
                    value={searchMethod}
                    onChange={(event) => {
                      setSearchMethod(event.target.value);
                      setSearchValue("");
                      setSearchError("");
                      setSearchResultStatus("IDLE");
                    }}
                  >
                    <option value="CUSTOMER_ID">Customer ID</option>
                    <option value="AADHAAR">Aadhaar Number</option>
                    <option value="MOBILE">Mobile Number</option>
                  </select>
                </label>
                <label className="glci-search-value">
                  <span>{authOption.label}</span>
                  <input
                    type={searchMethod === "AADHAAR" ? "password" : "text"}
                    inputMode={authOption.inputMode}
                    autoComplete="off"
                    maxLength={authOption.maxLength}
                    value={searchValue}
                    onChange={(event) => {
                      const nextValue =
                        searchMethod === "CUSTOMER_ID"
                          ? event.target.value.toUpperCase()
                          : digitsOnly(event.target.value);
                      setSearchValue(nextValue);
                      setSearchError("");
                      setSearchResultStatus("IDLE");
                    }}
                    placeholder={authOption.placeholder}
                    aria-invalid={Boolean(searchError)}
                    aria-describedby={
                      searchError ? "glci-auth-error" : undefined
                    }
                  />
                </label>
                <button
                  type="button"
                  className="glci-primary-button"
                  onClick={searchCustomer}
                  disabled={!searchValue.trim() || searchRunning}
                >
                  {searchRunning ? (
                    <>
                      <Spinner /> Searching CBS…
                    </>
                  ) : (
                    "Search CBS"
                  )}
                </button>
              </div>
              {searchError && (
                <div
                  id="glci-auth-error"
                  className="glci-field-error"
                  role="alert"
                >
                  {searchError}
                </div>
              )}
              {searchResultStatus === "NO_MATCH" && (
                <div className="glci-search-no-result" role="status">
                  <AlertIcon />
                  <div>
                    <strong>No customer found</strong>
                    <span>
                      Reference{" "}
                      {
                        identityNode.lastAuthenticationAttempt
                          ?.authenticationReference
                      }{" "}
                      · Check the value and try again, or continue the applicant
                      as a new-to-bank customer.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="glci-primary-button"
                    onClick={continueAsNtb}
                  >
                    Continue as NTB
                  </button>
                </div>
              )}
              {searchMethod === "AADHAAR" && (
                <small className="glci-privacy-note">
                  Aadhaar is masked while typing. Only the generated
                  authentication reference is saved in lead details.
                </small>
              )}
            </div>
          )}
        </section>

        <section
          className={`glci-section ${!customerConfirmed ? "locked" : ""}`}
        >
          <SectionHeader
            number="2"
            title="Obtain customer consent"
            description="Send one secure consent request covering application processing, CBS/KYC use, internal checks, conditional CIBIL pull and communications."
            status={
              consentCaptured
                ? "Captured"
                : consentStatus === "Sent"
                  ? "Awaiting customer"
                  : "Pending"
            }
            statusVariant={
              consentCaptured
                ? "success"
                : consentStatus === "Sent"
                  ? "running"
                  : "pending"
            }
          />

          {!customerConfirmed && (
            <div className="glci-lock-note">
              <ShieldIcon /> Confirm the customer to enable consent.
            </div>
          )}

          <div className="glci-card glci-consent-card">
            <div className="glci-consent-summary">
              <span className="glci-consent-icon">
                <PhoneIcon />
              </span>
              <div>
                <strong>
                  {consentCaptured
                    ? "Consent received"
                    : consentStatus === "Sent"
                      ? "Consent request sent"
                      : "Send secure consent request"}
                </strong>
                <p>
                  Secure SMS link with OTP to{" "}
                  <b>{maskMobile(customer.mobile)}</b>
                </p>
              </div>
            </div>

            {consentCaptured ? (
              <div className="glci-consent-result">
                <span className="glci-success-mark">
                  <CheckIcon />
                </span>
                <div>
                  <strong>All preliminary consents recorded</strong>
                  <small>
                    Captured {consentCapturedAt} · Reference{" "}
                    {consentNode.requestReference}
                  </small>
                </div>
                <button
                  type="button"
                  className="glci-secondary-button"
                  onClick={sendConsent}
                >
                  <RefreshIcon /> Resend
                </button>
              </div>
            ) : consentStatus === "Sent" ? (
              <div
                className="glci-consent-wait"
                role="status"
                aria-live="polite"
              >
                <span className="glci-pulse-ring">
                  <Spinner />
                </span>
                <div>
                  <strong>Consent request sent successfully</strong>
                  <small>
                    Reference {consentNode.requestReference} · Sent{" "}
                    {consentSentAt}
                  </small>
                  <small>
                    Link valid until {consentNode.expiresAt}. Waiting for
                    customer confirmation.
                  </small>
                </div>
                <div className="glci-consent-actions">
                  <span className="glci-countdown">{consentSeconds}s</span>
                  <button
                    type="button"
                    className="glci-secondary-button"
                    onClick={sendConsent}
                  >
                    <RefreshIcon /> Resend
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="glci-primary-button"
                onClick={sendConsent}
                disabled={!customerConfirmed}
              >
                Send consent request
              </button>
            )}

            <div className="glci-consent-scope">
              {[
                "Gold Loan application processing",
                "CBS and KYC information retrieval",
                "Internal eligibility and knock-off checks",
                "CIC/CIBIL enquiry if the applicable threshold is met",
                "SMS, email and phone communication",
              ].map((item) => (
                <span key={item}>
                  <CheckIcon size={12} /> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={`glci-section ${!profileReady ? "locked" : ""}`}>
          <SectionHeader
            number="3"
            title="Borrower information"
            description={
              customerType === "ETB"
                ? "Review the CBS borrower profile, update details where required and manage the KYC documents."
                : "Enter the borrower's details, save the profile and upload the mandatory KYC documents."
            }
            status={
              !profileReady
                ? "Locked"
                : isBorrowerEditing
                  ? customerType === "ETB"
                    ? "Editing"
                    : "Details required"
                  : borrowerDocumentsComplete
                    ? "Information saved"
                    : "Documents pending"
            }
            statusVariant={
              profileReady &&
              borrowerInformationSaved &&
              borrowerDocumentsComplete
                ? "success"
                : "pending"
            }
          />

          {!profileReady && (
            <div className="glci-lock-note">
              <ShieldIcon /> Confirm the customer and capture consent before
              borrower details are processed.
            </div>
          )}

          <div className="glci-profile-card">
            <div className="glci-profile-top">
              <span className="glci-profile-avatar">
                {getInitials(customer.fullName)}
              </span>
              <div>
                <strong>{customer.fullName}</strong>
                <small>
                  {customerType === "ETB"
                    ? "Existing YES BANK customer"
                    : ntbOnboarded
                      ? "Newly onboarded YES BANK customer"
                      : "New-to-bank borrower"}
                  {customer.customerId ? ` · ${customer.customerId}` : ""}
                </small>
              </div>
              <div className="glci-profile-actions">
                {!isBorrowerEditing ? (
                  <button
                    type="button"
                    className="glci-secondary-button"
                    onClick={() => {
                      setBorrowerDraft(borrowerNode.details);
                      setBorrowerErrors({});
                      setIsBorrowerEditing(true);
                      updateNode("borrowerInformation", { status: "Editing" });
                    }}
                  >
                    <PencilIcon /> Edit information
                  </button>
                ) : (
                  borrowerNode.savedAt && (
                    <button
                      type="button"
                      className="glci-link-button"
                      onClick={() => {
                        setBorrowerDraft(borrowerNode.details);
                        setBorrowerErrors({});
                        setIsBorrowerEditing(false);
                        updateNode("borrowerInformation", { status: "Saved" });
                      }}
                    >
                      Cancel
                    </button>
                  )
                )}
              </div>
            </div>

            {isBorrowerEditing ? (
              <div className="glci-borrower-form">
                <BorrowerField
                  label="Name"
                  name="name"
                  value={[borrowerDraft.firstName, borrowerDraft.middleName, borrowerDraft.lastName]
                    .filter(Boolean)
                    .join(" ")}
                  onChange={handleBorrowerChange}
                  error={borrowerErrors.name || borrowerErrors.firstName}
                  required
                />
                <BorrowerField
                  label="Date of birth"
                  name="dateOfBirth"
                  type="date"
                  value={borrowerDraft.dateOfBirth}
                  onChange={handleBorrowerChange}
                  error={borrowerErrors.dateOfBirth}
                  required
                />
                <BorrowerField
                  label="Gender"
                  name="gender"
                  value={borrowerDraft.gender}
                  onChange={handleBorrowerChange}
                  error={borrowerErrors.gender}
                  options={[
                    "Female",
                    "Male",
                    "Transgender",
                    "Prefer not to say",
                  ]}
                  required
                />
                <BorrowerField
                  label="Mobile number"
                  name="mobile"
                  value={borrowerDraft.mobile}
                  onChange={handleBorrowerChange}
                  error={borrowerErrors.mobile}
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
                <BorrowerField
                  label="Email"
                  name="email"
                  type="email"
                  value={borrowerDraft.email}
                  onChange={handleBorrowerChange}
                  error={borrowerErrors.email}
                />
                {borrowerInformationSaved && (
                  <>
                    <BorrowerField
                      label="PAN"
                      name="pan"
                      value={borrowerDraft.pan}
                      onChange={handleBorrowerChange}
                      error={borrowerErrors.pan}
                      maxLength={10}
                      required
                    />
                    <BorrowerField
                      label="Address line 1"
                      name="addressLine1"
                      value={borrowerDraft.addressLine1}
                      onChange={handleBorrowerChange}
                      error={borrowerErrors.addressLine1}
                      maxLength={250}
                      required
                    />
                    <BorrowerField
                      label="Address line 2"
                      name="addressLine2"
                      value={borrowerDraft.addressLine2}
                      onChange={handleBorrowerChange}
                      error={borrowerErrors.addressLine2}
                      maxLength={250}
                    />
                    <BorrowerField
                      label="City"
                      name="city"
                      value={borrowerDraft.city}
                      onChange={handleBorrowerChange}
                      error={borrowerErrors.city}
                      maxLength={50}
                      required
                    />
                    <BorrowerField
                      label="ZIP / Postcode"
                      name="pincode"
                      value={borrowerDraft.pincode}
                      onChange={handleBorrowerChange}
                      error={borrowerErrors.pincode}
                      inputMode="numeric"
                      maxLength={6}
                      required
                    />
                  </>
                )}
                <div className="glci-borrower-form-actions">
                  <span>
                    Fields marked * are mandatory. Borrower age must be between
                    18 and 75 years.
                  </span>
                  <button
                    type="button"
                    className="glci-primary-button"
                    onClick={saveBorrowerInformation}
                  >
                    Save borrower information
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="glci-detail-grid">
                  <Detail
                    label="Name"
                    value={[
                      borrowerNode.details.firstName,
                      borrowerNode.details.middleName,
                      borrowerNode.details.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <Detail
                    label="Date of birth"
                    value={formatDateForDisplay(
                      borrowerNode.details.dateOfBirth,
                    )}
                  />
                  <Detail label="Gender" value={borrowerNode.details.gender} />
                  <Detail
                    label="Mobile number"
                    value={borrowerNode.details.mobile}
                    verified={customerType === "ETB"}
                  />
                  <Detail
                    label="Email"
                    value={borrowerNode.details.email}
                    verified={customerType === "ETB"}
                  />
                  {customerType === "ETB" && (
                    <>
                      <Detail
                        label="KYC status"
                        value={`${customer.kycStatus} · ${customer.kycUpdatedAt}`}
                        verified
                      />
                      <Detail label="CKYC number" value={customer.ckycNumber} />
                      <Detail label="Home branch" value={customer.homeBranch} />
                      <Detail
                        label="Risk category"
                        value={customer.riskCategory}
                      />
                    </>
                  )}
                </div>
              </>
            )}

            <div className="glci-document-section">
              <div className="glci-document-section-head">
                <div>
                  <strong>KYC documents</strong>
                  <span>
                    View the available evidence or re-upload a fresher copy.
                  </span>
                </div>
                <StatusBadge
                  variant={borrowerDocumentsComplete ? "success" : "pending"}
                >
                  {borrowerDocumentsComplete ? (
                    <CheckIcon size={11} />
                  ) : (
                    <AlertIcon />
                  )}{" "}
                  {borrowerDocumentsComplete
                    ? "Documents complete"
                    : "Action required"}
                </StatusBadge>
              </div>
              <div className="glci-borrower-document-grid">
                <BorrowerDocument
                  label="PAN Card"
                  description="Upload PAN card"
                  document={borrowerDocuments.pan}
                  onUpload={(file) => handleDocumentUpload("pan", file)}
                  disabled={
                    isBorrowerEditing || ntbOnboardingStatus === "Running"
                  }
                />
                <BorrowerDocument
                  label="Address proof"
                  description="Upload an accepted OVD / address proof"
                  document={borrowerDocuments.addressProof}
                  onUpload={(file) =>
                    handleDocumentUpload("addressProof", file)
                  }
                  disabled={
                    isBorrowerEditing || ntbOnboardingStatus === "Running"
                  }
                />
              </div>

              {borrowerDocumentsComplete && (
                <div className="glci-address-section">
                  <div className="glci-address-section-head">
                    <div>
                      <strong>Address & Identity</strong>
                    </div>
                    <div className="glci-profile-actions">
                      {!isAddressIdentityEditing ? (
                        <button
                          type="button"
                          className="glci-secondary-button"
                          onClick={() => {
                            setBorrowerDraft(borrowerNode.details);
                            setBorrowerErrors({});
                            setIsAddressIdentityEditing(true);
                          }}
                          disabled={ntbOnboardingStatus === "Running"}
                        >
                          <PencilIcon /> Edit information
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="glci-link-button"
                          onClick={() => {
                            setBorrowerDraft(borrowerNode.details);
                            setBorrowerErrors({});
                            setIsAddressIdentityEditing(false);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <StatusBadge variant="success">
                      <CheckIcon size={11} /> Documents uploaded
                    </StatusBadge>
                  </div>

                  {isAddressIdentityEditing ? (
                    <div className="glci-borrower-form">
                      <BorrowerField
                        label="PAN"
                        name="pan"
                        value={borrowerDraft.pan}
                        onChange={handleBorrowerChange}
                        error={borrowerErrors.pan}
                        maxLength={10}
                        required
                      />
                      <BorrowerField
                        label="Address line 1"
                        name="addressLine1"
                        value={borrowerDraft.addressLine1}
                        onChange={handleBorrowerChange}
                        error={borrowerErrors.addressLine1}
                        maxLength={250}
                        required
                      />
                      <BorrowerField
                        label="Address line 2"
                        name="addressLine2"
                        value={borrowerDraft.addressLine2}
                        onChange={handleBorrowerChange}
                        error={borrowerErrors.addressLine2}
                        maxLength={250}
                      />
                      <BorrowerField
                        label="City"
                        name="city"
                        value={borrowerDraft.city}
                        onChange={handleBorrowerChange}
                        error={borrowerErrors.city}
                        maxLength={50}
                        required
                      />
                      <BorrowerField
                        label="ZIP / Postcode"
                        name="pincode"
                        value={borrowerDraft.pincode}
                        onChange={handleBorrowerChange}
                        error={borrowerErrors.pincode}
                        inputMode="numeric"
                        maxLength={6}
                        required
                      />

                      <div className="glci-borrower-form-actions">
                        <span>Fields marked * are mandatory.</span>
                        <button
                          type="button"
                          className="glci-primary-button"
                          onClick={saveAddressIdentity}
                          disabled={ntbOnboardingStatus === "Running"}
                        >
                          Save Address & Identity
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="glci-detail-grid">
                      <Detail
                        label="PAN"
                        value={borrowerNode.details.pan}
                        required
                      />
                      <Detail
                        label="Address line 1"
                        value={borrowerNode.details.addressLine1}
                        required
                      />
                      <Detail
                        label="Address line 2"
                        value={borrowerNode.details.addressLine2}
                      />
                      <Detail
                        label="City"
                        value={borrowerNode.details.city}
                        required
                      />
                      <Detail
                        label="ZIP / Postcode"
                        value={borrowerNode.details.pincode}
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {customerType === "NTB" && (
              <div className="glci-ntb-action">
                <div>
                  <strong>
                    {ntbOnboarded
                      ? "CBS customer profile created"
                      : "Create customer after borrower and document verification"}
                  </strong>
                  <p>
                    {ntbOnboarded
                      ? `Customer ID ${customer.customerId} is now linked to this application.`
                      : "The original relationship remains NTB for acquisition reporting."}
                  </p>
                </div>
                <button
                  type="button"
                  className="glci-primary-button"
                  onClick={completeNtbOnboarding}
                  disabled={
                    !borrowerInformationSaved ||
                    !borrowerDocumentsComplete ||
                    ntbOnboardingStatus === "Running" ||
                    ntbOnboarded
                  }
                >
                  {ntbOnboardingStatus === "Running" ? (
                    <>
                      <Spinner /> Creating customer…
                    </>
                  ) : ntbOnboarded ? (
                    <>
                      <CheckIcon /> Customer created
                    </>
                  ) : (
                    "Complete KYC & create customer"
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer
        className={`glci-readiness ${stepComplete ? "ready" : "pending"}`}
      >
        <span>{stepComplete ? <CheckIcon /> : <AlertIcon />}</span>
        <div>
          <strong>
            {stepComplete
              ? "Customer verification and consent complete"
              : "Complete the outstanding Step 1 requirements"}
          </strong>
          <p>
            {stepComplete
              ? "Proceed to Facility, Branch & Loan Details. CIBIL consent is already recorded; the bureau pull remains conditional on the amount threshold."
              : customerType === "ETB"
                ? "Customer confirmation and consent are mandatory before continuing."
                : "Customer confirmation, consent and NTB onboarding are mandatory before continuing."}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CustomerIdentity;
