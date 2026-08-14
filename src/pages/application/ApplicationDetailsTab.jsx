import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./ApplicationDetailsTab.css";

const DEFAULT_LEAD_API_BASE =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";

const SECTIONS = [
  { id: "customerKyc", number: "01", label: "Customer & KYC", icon: "customer" },
  { id: "loanBranch", number: "02", label: "Loan & Branch", icon: "bank" },
  { id: "compliance", number: "03", label: "Compliance", icon: "shield" },
  { id: "jewelleryAppraisal", number: "04", label: "Jewellery Appraisal", icon: "jewellery" },
  { id: "eligibilityRecommendation", number: "05", label: "Eligibility & Recommendation", icon: "calculator" },
  { id: "checkerDecision", number: "06", label: "Checker Decision", icon: "decision" },
];

const PURITY_OPTIONS = ["24K / 999", "22K / 916", "20K / 833", "18K / 750", "14K / 585"];
const PUSHBACK_SECTIONS = [
  "Customer & KYC",
  "Loan & Branch",
  "Compliance",
  "Jewellery Appraisal",
  "Eligibility & Recommendation",
];
const WEIGHT_LIMITS = {
  goldOrnament: { label: "Gold ornaments", limit: 1000 },
  goldCoin: { label: "Gold coins", limit: 50 },
  silverOrnament: { label: "Silver ornaments", limit: 10000 },
  silverCoin: { label: "Silver coins", limit: 500 },
};

const parseLeadDetails = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Unable to parse lead details:", error);
    return {};
  }
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const hasValue = (value) => value !== undefined && value !== null && value !== "";
const getByPath = (source, path) =>
  String(path)
    .split(".")
    .reduce(
      (current, key) =>
        current && Object.prototype.hasOwnProperty.call(current, key)
          ? current[key]
          : undefined,
      source,
    );
const selectValue = (source, paths, fallback = undefined) => {
  for (const path of paths) {
    const value = getByPath(source, path);
    if (hasValue(value)) return value;
  }
  return fallback;
};
const toNumber = (value) => {
  if (!hasValue(value)) return null;
  const normalized = typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};
const textValue = (value, fallback = "—") => {
  if (!hasValue(value)) return fallback;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    return String(value.name || value.label || value.status || value.value || fallback);
  }
  return String(value);
};
const formatCurrency = (value) => {
  const amount = toNumber(value);
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
const formatWeight = (value) => {
  const weight = toNumber(value);
  return weight === null
    ? "—"
    : `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(weight)} g`;
};
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return textValue(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return textValue(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
const statusTone = (value) => {
  const status = String(value || "pending").toLowerCase();
  if (/complete|verified|approved|eligible|sanctioned|signed|generated|disbursed|active|passed|not required/.test(status)) return "success";
  if (/fail|reject|block|expired|exceed|below|missing/.test(status)) return "danger";
  if (/progress|awaiting|required|pending|rework|pushback|clarification/.test(status)) return "warning";
  return "neutral";
};
const normalizePersona = (value) => {
  const persona = String(value || "").toLowerCase();
  if (persona.includes("appraiser") || persona.includes("jeweller")) return "Appraiser";
  if (persona.includes("checker")) return "Checker";
  if (persona.includes("maker")) return "Maker";
  return "Viewer";
};
const normalizeSection = (value) => {
  const section = String(value || "").toLowerCase().replace(/[^a-z]/g, "");
  if (section.includes("customer") || section.includes("kyc")) return "customerKyc";
  if (section.includes("loan") || section.includes("branch")) return "loanBranch";
  if (section.includes("compliance") || section.includes("cibil") || section.includes("land")) return "compliance";
  if (section.includes("jewellery") || section.includes("appraisal")) return "jewelleryAppraisal";
  if (section.includes("eligibility") || section.includes("recommendation")) return "eligibilityRecommendation";
  if (section.includes("checker") || section.includes("decision")) return "checkerDecision";
  return "";
};
const getCategoryKey = (item) => {
  const value = String(item.category || item.metalCategory || item.ornamentCategory || "gold ornament").toLowerCase();
  if (value.includes("silver") && value.includes("coin")) return "silverCoin";
  if (value.includes("silver")) return "silverOrnament";
  if (value.includes("coin")) return "goldCoin";
  return "goldOrnament";
};
const deductionTotalFor = (item) =>
  [
    item.appraisal?.stoneDeduction,
    item.appraisal?.alloyDeduction,
    item.appraisal?.fasteningDeduction,
    item.appraisal?.otherDeduction,
  ].reduce((sum, value) => sum + (toNumber(value) || 0), 0);
const netWeightFor = (item) => {
  const gross = toNumber(item.appraisal?.grossWeight) || 0;
  const deductions = deductionTotalFor(item);
  return Math.max(0, Number((gross - deductions).toFixed(2)));
};
const emptyAppraisal = () => ({
  defectPresent: "No",
  defectDescription: "",
  purity: "",
  grossWeight: "",
  stoneDeduction: "",
  alloyDeduction: "",
  fasteningDeduction: "",
  otherDeduction: "",
  photographs: [],
  remarks: "",
  status: "Pending",
});
const normalizeItems = (items) =>
  (Array.isArray(items) ? items : []).map((item, index) => ({
    ...item,
    id: item.id || item.itemId || `JWL-${String(index + 1).padStart(3, "0")}`,
    serialNumber: item.serialNumber || item.serialNo || index + 1,
    description: item.description || item.ornamentDescription || item.ornamentType || "Jewellery item",
    itemCount: item.itemCount || item.numberOfItems || item.quantity || 1,
    category: item.category || item.metalCategory || item.ornamentCategory || "Gold Ornament",
    ownershipDeclaration: item.ownershipDeclaration || item.ownershipStatus || "Declared by customer",
    ownershipProof: item.ownershipProof || item.proof || null,
    makerRemarks: item.makerRemarks || item.remarks || "",
    appraisal: {
      ...emptyAppraisal(),
      ...(item.appraisal || item.assessment || item.appraiserAssessment || {}),
      photographs:
        item.appraisal?.photographs ||
        item.assessment?.photographs ||
        item.appraiserAssessment?.photographs ||
        item.photographs ||
        [],
    },
  }));

const Icon = ({ type }) => {
  const paths = {
    customer: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
    bank: <path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3l9 5H3z" />,
    shield: <path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6zM9 12l2 2 4-5" />,
    jewellery: <path d="m3 9 4-5h10l4 5-9 12zm0 0h18M7 4l5 5 5-5M12 9v12" />,
    calculator: <path d="M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />,
    decision: <path d="M5 20V4h10l4 4v12zM9 12h6M9 16h4M14 4v5h5" />,
    check: <path d="m5 12 4 4L19 6" />,
    edit: <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10zM14 7l3 3" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    upload: <path d="M12 16V4m-4 4 4-4 4 4M4 15v5h16v-5" />,
    alert: <path d="M12 3 2 21h20zM12 9v5m0 3h.01" />,
    lock: <path d="M6 10h12v10H6zM8 10V7a4 4 0 0 1 8 0v3" />,
    info: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v6m0-10h.01" />,
    trash: <path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[type] || paths.info}</svg>;
};

const Status = ({ value }) => (
  <span className={`details-status is-${statusTone(value)}`}>{textValue(value, "Pending")}</span>
);

const SectionHeading = ({ eyebrow, title, description, status, editable }) => (
  <header className="details-section-heading">
    <div>
      <p>{eyebrow}</p>
      <h3>{title}</h3>
      {description && <span>{description}</span>}
    </div>
    <div className="details-section-heading__meta">
      {status && <Status value={status} />}
      <span className={`details-access ${editable ? "can-edit" : "read-only"}`}>
        <Icon type={editable ? "edit" : "lock"} />
        {editable ? "Editable" : "Read only"}
      </span>
    </div>
  </header>
);

const ReadOnlyGrid = ({ fields, columns = 3 }) => (
  <dl className={`details-read-grid columns-${columns}`}>
    {fields.map((field) => (
      <div key={field.label} className={field.wide ? "wide" : ""}>
        <dt>{field.label}</dt>
        <dd>{field.status ? <Status value={field.value} /> : textValue(field.value)}</dd>
        {field.helper && <small>{field.helper}</small>}
      </div>
    ))}
  </dl>
);

const Field = ({ label, required, error, helper, children, wide = false }) => (
  <label className={`details-field ${wide ? "wide" : ""} ${error ? "has-error" : ""}`}>
    <span>{label}{required && <b aria-hidden="true">*</b>}</span>
    {children}
    {error ? <small className="field-error">{error}</small> : helper ? <small>{helper}</small> : null}
  </label>
);

const buildView = (leadDetails, lead) => {
  const application = leadDetails.applicationDetail || {};
  const details = application.details || {};
  const identity = leadDetails.customerIdentity || leadDetails.customerAuthenticationConsent || {};
  const facility = leadDetails.facilityBranchLoanDetails || {};
  const support = leadDetails.eligibilitySupportingDetails || {};
  const customer = {
    name: [lead?.firstName, lead?.middleName, lead?.lastName].filter(Boolean).join(" ") || selectValue(leadDetails, ["customerIdentity.borrowerInformation.fullName", "customerIdentity.customer.name"], "—"),
    relationship: lead?.relationshipType || selectValue(leadDetails, ["relationshipType", "customerIdentity.relationshipType"], "—"),
    cbsCustomerId: lead?.cbsCustomerId || selectValue(leadDetails, ["cbsCustomerId", "customerIdentity.cbsCustomerId", "customerIdentity.customer.customerId"], "—"),
    dob: selectValue(leadDetails, ["customerIdentity.borrowerInformation.dateOfBirth", "customerIdentity.customer.dateOfBirth", "customerIdentity.dob"], "—"),
    pan: selectValue(leadDetails, ["customerIdentity.borrowerInformation.pan", "customerIdentity.pan.number", "customerIdentity.panNumber"], "—"),
    mobile: lead?.mobile || selectValue(leadDetails, ["customerIdentity.mobile"], "—"),
    email: lead?.email || selectValue(leadDetails, ["customerIdentity.email"], "—"),
    kycStatus: lead?.kycStatus || selectValue(leadDetails, ["customerIdentity.kycStatus", "customerIdentity.borrowerInformation.kycStatus"], "Pending"),
    permanentAddress: selectValue(leadDetails, ["customerIdentity.borrowerInformation.permanentAddress", "customerIdentity.address.permanent", "customerIdentity.permanentAddress"], "—"),
    communicationAddress: selectValue(leadDetails, ["customerIdentity.borrowerInformation.communicationAddress", "customerIdentity.address.communication", "customerIdentity.communicationAddress"], "—"),
    consentStatus: selectValue(leadDetails, ["customerIdentity.consent.status", "customerIdentity.customerConsent.status", "customerIdentity.consentStatus"], "Pending"),
    consentReference: selectValue(leadDetails, ["customerIdentity.consent.reference", "customerIdentity.customerConsent.reference", "customerIdentity.consentReference"], "—"),
    consentAt: selectValue(leadDetails, ["customerIdentity.consent.capturedAt", "customerIdentity.customerConsent.capturedAt", "customerIdentity.consentTimestamp"], null),
  };
  const selectedBranch = facility.branch || facility.selectedBranch || application.branch || {};
  const existingLoansValue = selectValue(leadDetails, ["facilityBranchLoanDetails.existingGoldLoans", "facilityBranchLoanDetails.exposure.existingLoans", "applicationDetail.details.loanBranch.existingGoldLoans"], []);
  const accountsValue = selectValue(leadDetails, ["facilityBranchLoanDetails.activeCasaAccounts", "facilityBranchLoanDetails.accounts", "customerIdentity.activeCasaAccounts"], []);
  const loan = {
    facilityType: selectValue(leadDetails, ["facilityBranchLoanDetails.facilityType", "facilityBranchLoanDetails.facility", "applicationDetail.facility"], lead?.product || "Gold Loan"),
    scheme: selectValue(leadDetails, ["facilityBranchLoanDetails.scheme.name", "facilityBranchLoanDetails.scheme", "facilityBranchLoanDetails.schemeName", "applicationDetail.scheme"], "—"),
    purpose: selectValue(leadDetails, ["facilityBranchLoanDetails.loanPurpose", "facilityBranchLoanDetails.purpose"], "—"),
    tenure: selectValue(leadDetails, ["facilityBranchLoanDetails.tenure", "facilityBranchLoanDetails.loan.tenure"], "—"),
    repaymentType: selectValue(leadDetails, ["facilityBranchLoanDetails.repaymentType", "facilityBranchLoanDetails.loan.repaymentType"], "—"),
    requestedAmount: selectValue(leadDetails, ["facilityBranchLoanDetails.requestedLoanAmount", "facilityBranchLoanDetails.requestedAmount", "applicationDetail.requestedAmount"], null),
    existingExposure: selectValue(leadDetails, ["facilityBranchLoanDetails.exposure.existingGoldLoanExposure", "facilityBranchLoanDetails.exposure.existingExposure"], 0),
    aggregateExposure: selectValue(leadDetails, ["facilityBranchLoanDetails.exposure.aggregateGoldLoanExposure", "facilityBranchLoanDetails.exposure.aggregateExposure"], 0),
    chargesAccount: selectValue(leadDetails, ["facilityBranchLoanDetails.chargesAccount", "facilityBranchLoanDetails.accounts.chargesAccount"], "—"),
    disbursementAccount: selectValue(leadDetails, ["facilityBranchLoanDetails.disbursementAccount", "applicationDetail.makerFinalisation.disbursementAccount"], "—"),
    existingLoans: Array.isArray(existingLoansValue) ? existingLoansValue : [],
    accounts: Array.isArray(accountsValue) ? accountsValue : [],
    savingsNominee: selectValue(leadDetails, [
      "facilityBranchLoanDetails.savingsNominee",
      "customerIdentity.savingsNominee",
      "customerIdentity.customer.savingsNominee",
    ], {}),
    branch: {
      name: selectedBranch.branchName || selectedBranch.name || "—",
      code: selectedBranch.branchCode || selectedBranch.code || "—",
      address: selectedBranch.address || selectedBranch.completeAddress || "—",
      pinCode: selectedBranch.pinCode || selectedBranch.pincode || "—",
      dpCode: selectedBranch.dpCode || "—",
    },
  };
  const complianceSource = application.compliance || details.compliance || support || {};
  const compliance = {
    cibilRequired: selectValue(leadDetails, ["applicationDetail.compliance.cibilRequired", "applicationDetail.details.compliance.cibilRequired", "eligibilitySupportingDetails.cibilRequired", "facilityBranchLoanDetails.exposure.cibilRequired"], false),
    cibilStatus: selectValue(leadDetails, ["applicationDetail.compliance.cibil.status", "applicationDetail.compliance.cibilStatus", "eligibilitySupportingDetails.cibil.status", "eligibilitySupportingDetails.cibilStatus"], "Pending"),
    cibilScore: selectValue(leadDetails, ["applicationDetail.compliance.cibil.score", "applicationDetail.compliance.cibilScore", "eligibilitySupportingDetails.cibil.score", "eligibilitySupportingDetails.cibilScore"], null),
    minimumScore: selectValue(leadDetails, ["applicationDetail.compliance.cibil.minimumScore", "applicationDetail.compliance.minimumCibilScore", "eligibilitySupportingDetails.cibil.minimumScore"], null),
    cibilReference: selectValue(leadDetails, ["applicationDetail.compliance.cibil.reference", "eligibilitySupportingDetails.cibil.reference"], "—"),
    cibilAt: selectValue(leadDetails, ["applicationDetail.compliance.cibil.completedAt", "eligibilitySupportingDetails.cibil.completedAt"], null),
    cibilReport: selectValue(leadDetails, ["applicationDetail.compliance.cibil.reportUrl", "eligibilitySupportingDetails.cibil.reportUrl"], "/docs/cibil-report.pdf"),
    landRequired: selectValue(leadDetails, ["applicationDetail.compliance.landDetailsRequired", "applicationDetail.details.compliance.landDetailsRequired", "eligibilitySupportingDetails.landDetailsRequired", "facilityBranchLoanDetails.exposure.landDetailsRequired"], false),
    landStatus: selectValue(leadDetails, ["applicationDetail.compliance.landDetails.status", "applicationDetail.compliance.landStatus", "eligibilitySupportingDetails.landDetails.status", "eligibilitySupportingDetails.landStatus"], "Pending"),
    state: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.state", "applicationDetail.compliance.landDetails.state"], "—"),
    district: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.district", "applicationDetail.compliance.landDetails.district"], "—"),
    village: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.village", "applicationDetail.compliance.landDetails.village"], "—"),
    surveyNumber: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.surveyNumber", "applicationDetail.compliance.landDetails.surveyNumber"], "—"),
    season: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.season", "applicationDetail.compliance.landDetails.season"], "—"),
    crop: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.crop", "applicationDetail.compliance.landDetails.crop"], "—"),
    landArea: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.landArea", "applicationDetail.compliance.landDetails.landArea"], "—"),
    costPerUnit: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.costPerUnit", "applicationDetail.compliance.landDetails.costPerUnit"], "—"),
    ownershipStatus: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.ownershipStatus", "applicationDetail.compliance.landDetails.ownershipStatus"], "—"),
    document: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.document", "applicationDetail.compliance.landDetails.document"], null),
    verifiedBy: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.verifiedBy", "applicationDetail.compliance.landDetails.verifiedBy"], "—"),
    verifiedAt: selectValue(leadDetails, ["eligibilitySupportingDetails.landDetails.verifiedAt", "applicationDetail.compliance.landDetails.verifiedAt"], null),
    raw: complianceSource,
  };
  const itemsValue = selectValue(leadDetails, ["applicationDetail.details.jewelleryAppraisal.items", "applicationDetail.appraisal.items", "applicationDetail.jewelleryAppraisal.items", "jewelleryDetails.items", "jewelleryDetails.jewelleryItems"], []);
  const appraisal = {
    status: selectValue(leadDetails, ["applicationDetail.details.jewelleryAppraisal.status", "applicationDetail.appraisal.status", "applicationDetail.jewelleryAppraisal.status"], application.status || "Awaiting Appraisal"),
    items: normalizeItems(itemsValue),
    appraiser: selectValue(leadDetails, ["applicationDetail.assignment.appraiser.name", "applicationDetail.appraisal.appraiser.name", "jewelleryDetails.appraiser.name"], "Assigned Appraiser"),
    clarificationComment: selectValue(leadDetails, ["applicationDetail.details.jewelleryAppraisal.clarificationComment", "applicationDetail.appraisal.clarificationComment"], ""),
  };
  const eligibilitySource = application.eligibility || details.eligibilityRecommendation || support.eligibility || {};
  const makerSource = application.makerFinalisation || details.eligibilityRecommendation || {};
  const charges = application.charges || makerSource.charges || support.charges || {};
  const nominee = makerSource.nominee || support.nominee || {};
  const eligibility = {
    ibjaGoldRate: eligibilitySource.ibjaGoldRate || eligibilitySource.ibjaRate || null,
    schemePercentage: eligibilitySource.schemePercentage || null,
    lendingRatePerGram: eligibilitySource.schemeLendingRatePerGram || eligibilitySource.lendingRatePerGram || null,
    totalNetWeight: eligibilitySource.totalNetWeight || null,
    schemeLendingValue: eligibilitySource.schemeLendingValue || null,
    availableExposureLimit: eligibilitySource.availableExposureLimit || null,
    ltvBasedValue: eligibilitySource.ltvBasedValue || null,
    applicableLtv: eligibilitySource.applicableLtv || null,
    maximumEligibleAmount: eligibilitySource.maximumEligibleAmount || null,
    controllingLimit: eligibilitySource.controllingLimit || "Pending calculation",
    requiredAmount: makerSource.requiredAmount || eligibilitySource.requiredAmount || "",
    recommendedAmount: makerSource.recommendedAmount || eligibilitySource.recommendedAmount || "",
    disbursementAccount: makerSource.disbursementAccount || loan.disbursementAccount || "",
    makerComments: makerSource.makerComments || makerSource.comments || "",
    status: makerSource.status || "Pending",
    charges: {
      processingCharge: charges.processingCharge || null,
      appraiserCharge: charges.appraiserCharge || null,
      gst: charges.gst || null,
      otherCharges: charges.otherCharges || null,
      totalCharges: charges.totalCharges || null,
      chargesAccount: charges.chargesAccount || loan.chargesAccount || "—",
    },
    nominee: {
      useSavingsNominee: Boolean(nominee.useSavingsNominee),
      name: nominee.name || "",
      relationship: nominee.relationship || "",
      dateOfBirth: nominee.dateOfBirth || "",
      address: nominee.address || "",
      guardianName: nominee.guardianName || "",
      guardianRelationship: nominee.guardianRelationship || "",
      guardianContact: nominee.guardianContact || "",
    },
  };
  const checker = application.checkerDecision || details.checkerDecision || {};
  return { application, details, identity, facility, customer, loan, compliance, appraisal, eligibility, checker };
};

export default function ApplicationDetailsTab({
  leadId,
  lead,
  setLead,
  loggedInUserEmail = "",
  loggedInUserName = "",
  persona = "Viewer",
  initialSection = "customerKyc",
  requestedSection = "",
  leadApiBase = DEFAULT_LEAD_API_BASE,
  updateLeadDetails,
}) {
  const leadDetails = useMemo(
    () => parseLeadDetails(lead?.leadDetails ?? lead?.lead_details),
    [lead?.leadDetails, lead?.lead_details],
  );
  const view = useMemo(() => buildView(leadDetails, lead), [leadDetails, lead]);
  const normalizedPersona = normalizePersona(persona);
  const [activeSection, setActiveSection] = useState(
    normalizeSection(requestedSection || initialSection) || "customerKyc",
  );
  const [expandedItemId, setExpandedItemId] = useState("");
  const [appraisalItems, setAppraisalItems] = useState(view.appraisal.items);
  const [clarificationComment, setClarificationComment] = useState(view.appraisal.clarificationComment);
  const [makerDraft, setMakerDraft] = useState({
    requiredAmount: view.eligibility.requiredAmount,
    recommendedAmount: view.eligibility.recommendedAmount,
    disbursementAccount: view.eligibility.disbursementAccount,
    makerComments: view.eligibility.makerComments,
    nominee: view.eligibility.nominee,
  });
  const [checkerDraft, setCheckerDraft] = useState({
    comments: view.checker.comments || "",
    pushbackSection: view.checker.pushbackSection || "Eligibility & Recommendation",
    pushbackReason: view.checker.pushbackReason || "",
    rejectionReason: view.checker.rejectionReason || "",
  });
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const initializedSectionRef = useRef(false);

  useEffect(() => {
    setAppraisalItems(view.appraisal.items);
    setClarificationComment(view.appraisal.clarificationComment);
    if (!expandedItemId && view.appraisal.items.length) setExpandedItemId(view.appraisal.items[0].id);
  }, [view.appraisal.items, view.appraisal.clarificationComment]);

  useEffect(() => {
    setMakerDraft({
      requiredAmount: view.eligibility.requiredAmount,
      recommendedAmount: view.eligibility.recommendedAmount,
      disbursementAccount: view.eligibility.disbursementAccount,
      makerComments: view.eligibility.makerComments,
      nominee: view.eligibility.nominee,
    });
  }, [view.eligibility]);

  useEffect(() => {
    const requested = normalizeSection(requestedSection);
    if (requested) {
      setActiveSection(requested);
      initializedSectionRef.current = true;
      return;
    }
    if (initializedSectionRef.current) return;
    const status = String(view.application.status || "").toLowerCase();
    if (normalizedPersona === "Appraiser" && /appraisal|rework|clarification/.test(status)) {
      setActiveSection("jewelleryAppraisal");
    } else if (normalizedPersona === "Maker" && /maker|rework|pushback|appraisal completed/.test(status)) {
      setActiveSection(normalizeSection(view.application.pushback?.section) || "eligibilityRecommendation");
    } else if (normalizedPersona === "Checker" && /checker|sanction/.test(status)) {
      setActiveSection("checkerDecision");
    }
    initializedSectionRef.current = true;
  }, [normalizedPersona, requestedSection, view.application]);

  const assignmentPersona = normalizePersona(
    view.application.assignment?.persona || view.application.assignedPersona || "",
  );
  const assignmentMatches = (role) => assignmentPersona === "Viewer" || assignmentPersona === role;
  const statusText = String(view.application.status || "").toLowerCase();
  const appraiserCanEdit =
    normalizedPersona === "Appraiser" &&
    assignmentMatches("Appraiser") &&
    !/completed|pending maker|pending checker|sanctioned|rejected|disbursed/.test(statusText);
  const makerCanEdit =
    normalizedPersona === "Maker" &&
    assignmentMatches("Maker") &&
    !/pending checker|sanctioned|rejected|disbursed/.test(statusText);
  const checkerCanEdit =
    normalizedPersona === "Checker" &&
    assignmentMatches("Checker") &&
    /checker|sanction/.test(statusText) &&
    !/sanctioned|rejected/.test(statusText);

  const actor = useMemo(
    () => ({
      name: loggedInUserName || loggedInUserEmail.split("@")[0] || normalizedPersona,
      email: loggedInUserEmail,
      role: normalizedPersona,
    }),
    [loggedInUserEmail, loggedInUserName, normalizedPersona],
  );

  const appendEvent = useCallback(
    (applicationDetail, event) => {
      const now = new Date().toISOString();
      const currentActivity = applicationDetail.activity || {};
      const nextEvent = {
        id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: event.type || "data_update",
        title: event.title || "Application details updated",
        description: event.description || "",
        stage: event.stage || applicationDetail.stage || "Appraisal & Eligibility",
        section: event.section || "Application Details",
        fromStatus: event.fromStatus || applicationDetail.status || "",
        toStatus: event.toStatus || applicationDetail.status || "",
        actor,
        comments: event.comments || "",
        createdAt: now,
        metadata: event.metadata || {},
      };
      return {
        ...applicationDetail,
        activity: {
          ...currentActivity,
          events: [nextEvent, ...(Array.isArray(currentActivity.events) ? currentActivity.events : [])],
          lastUpdatedAt: now,
        },
        updatedAt: now,
      };
    },
    [actor],
  );

  const commitUpdate = useCallback(
    async (applicationUpdater, activityEvent, immediate = true) => {
      setSaveState("saving");
      setSaveError("");
      try {
        const buildNext = (currentLeadDetails) => {
          const currentApplication = currentLeadDetails.applicationDetail || {};
          const updatedApplication = applicationUpdater(clone(currentApplication), currentLeadDetails);
          return {
            ...currentLeadDetails,
            applicationDetail: appendEvent(updatedApplication, activityEvent),
          };
        };

        if (typeof updateLeadDetails === "function") {
          updateLeadDetails(buildNext, immediate);
        } else {
          const leadIdentity = leadId || lead?.id || lead?.leadnumber;
          if (!leadIdentity) throw new Error("Lead ID is unavailable.");
          const nextLeadDetails = buildNext(clone(leadDetails));
          setLead?.((previousLead) => ({ ...(previousLead || {}), leadDetails: nextLeadDetails }));
          const response = await fetch(
            `${leadApiBase}/${encodeURIComponent(leadIdentity)}/details`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId: leadIdentity, leadDetailsPatch: nextLeadDetails }),
            },
          );
          if (!response.ok) throw new Error(`Unable to save Application Details (${response.status}).`);
        }
        setSaveState("saved");
        return true;
      } catch (error) {
        console.error("Unable to save Application Details:", error);
        setSaveState("error");
        setSaveError(error.message || "Unable to save Application Details.");
        return false;
      }
    },
    [appendEvent, lead, leadApiBase, leadDetails, leadId, setLead, updateLeadDetails],
  );

  const updateAppraisalItem = (itemId, field, value) => {
    setAppraisalItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, appraisal: { ...item.appraisal, [field]: value } }
          : item,
      ),
    );
    setValidationErrors((current) => ({ ...current, [`${itemId}.${field}`]: "" }));
  };

  const handlePhotographs = (itemId, files) => {
    [...files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setAppraisalItems((current) =>
          current.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  appraisal: {
                    ...item.appraisal,
                    photographs: [
                      ...(Array.isArray(item.appraisal.photographs) ? item.appraisal.photographs : []),
                      { id: `PHOTO-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, name: file.name, type: file.type, dataUrl: reader.result, uploadedAt: new Date().toISOString() },
                    ],
                  },
                }
              : item,
          ),
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (itemId, photoId) => {
    setAppraisalItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, appraisal: { ...item.appraisal, photographs: item.appraisal.photographs.filter((photo) => photo.id !== photoId) } }
          : item,
      ),
    );
  };

  const weightSummary = useMemo(() => {
    const totals = Object.keys(WEIGHT_LIMITS).reduce((result, key) => ({ ...result, [key]: 0 }), {});
    appraisalItems.forEach((item) => {
      totals[getCategoryKey(item)] += netWeightFor(item);
    });
    return Object.entries(WEIGHT_LIMITS).map(([key, config]) => ({
      key,
      ...config,
      total: Number(totals[key].toFixed(2)),
      exceeded: totals[key] > config.limit,
    }));
  }, [appraisalItems]);

  const validateAppraisal = () => {
    const errors = {};
    appraisalItems.forEach((item) => {
      if (!item.appraisal.purity) errors[`${item.id}.purity`] = "Select quality/purity.";
      if (!(toNumber(item.appraisal.grossWeight) > 0)) errors[`${item.id}.grossWeight`] = "Enter a valid gross weight.";
      if (
        toNumber(item.appraisal.grossWeight) > 0 &&
        deductionTotalFor(item) >= toNumber(item.appraisal.grossWeight)
      ) {
        errors[`${item.id}.grossWeight`] =
          "Total deductions must be lower than the gross weight.";
      }
      if (item.appraisal.defectPresent === "Yes" && !item.appraisal.defectDescription.trim()) errors[`${item.id}.defectDescription`] = "Describe the defect.";
      if (!item.appraisal.photographs?.length) errors[`${item.id}.photographs`] = "Upload at least one photograph.";
    });
    if (!appraisalItems.length) errors.items = "No jewellery items are available for appraisal.";
    if (weightSummary.some((item) => item.exceeded)) errors.weightLimit = "Borrower-level weight policy is exceeded.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const persistAppraisal = async (action) => {
    if (!appraiserCanEdit) return;
    if (action === "complete" && !validateAppraisal()) return;
    if (action === "clarification" && !clarificationComment.trim()) {
      setValidationErrors((current) => ({ ...current, clarification: "Enter the clarification required." }));
      return;
    }
    const now = new Date().toISOString();
    const completedItems = appraisalItems.map((item) => ({
      ...item,
      appraisal: {
        ...item.appraisal,
        netWeight: netWeightFor(item),
        status: action === "complete" ? "Completed" : item.appraisal.status === "Pending" ? "In Progress" : item.appraisal.status,
        appraisedBy: actor,
        appraisedAt: action === "complete" ? now : item.appraisal.appraisedAt,
      },
    }));
    const totalNetWeight = completedItems
      .filter((item) => ["goldOrnament", "goldCoin"].includes(getCategoryKey(item)))
      .reduce((sum, item) => sum + netWeightFor(item), 0);
    const statusMap = {
      start: "Appraisal In Progress",
      save: "Appraisal In Progress",
      clarification: "Clarification Required",
      complete: "Completed",
    };
    const applicationStatusMap = {
      start: "Appraisal In Progress",
      save: "Appraisal In Progress",
      clarification: "Rework Required",
      complete: "Pending Maker Finalisation",
    };
    const descriptionMap = {
      start: "Jewellery appraisal was started.",
      save: `${completedItems.length} jewellery item drafts were saved.`,
      clarification: clarificationComment.trim(),
      complete: `${completedItems.length} items completed with ${formatWeight(totalNetWeight)} eligible gold net weight.`,
    };
    const success = await commitUpdate(
      (application) => {
        const details = application.details || {};
        const appraisalNode = {
          ...(details.jewelleryAppraisal || application.appraisal || {}),
          status: statusMap[action],
          items: completedItems,
          totalNetWeight: Number(totalNetWeight.toFixed(2)),
          weightSummary,
          weightPolicyStatus: weightSummary.some((item) => item.exceeded) ? "Exceeded" : "Within limit",
          clarificationComment: action === "clarification" ? clarificationComment.trim() : "",
          appraiser: actor,
          startedAt: action === "start" ? now : details.jewelleryAppraisal?.startedAt || application.appraisal?.startedAt,
          completedAt: action === "complete" ? now : null,
          lastSavedAt: now,
        };
        const nextAssignment =
          action === "complete" || action === "clarification"
            ? { ...(application.assignment || {}), persona: "Maker", currentOwner: "Branch Maker", assignedAt: now }
            : { ...(application.assignment || {}), persona: "Appraiser", currentOwner: actor.name, assignedAt: application.assignment?.assignedAt || now };
        return {
          ...application,
          status: applicationStatusMap[action],
          stage: "APPRAISAL_ELIGIBILITY",
          assignment: nextAssignment,
          assignedPersona: nextAssignment.persona,
          currentOwner: nextAssignment.currentOwner,
          details: { ...details, jewelleryAppraisal: appraisalNode },
          appraisal: appraisalNode,
          checklist: {
            ...(application.checklist || {}),
            jewelleryAppraisal: action === "complete" ? "Completed" : action === "clarification" ? "Blocked" : "In progress",
          },
          pushback:
            action === "clarification"
              ? { section: "Jewellery Appraisal", reason: clarificationComment.trim(), assignedTo: "Maker", createdAt: now, createdBy: actor }
              : application.pushback,
        };
      },
      {
        type: `appraisal_${action}`,
        title: action === "complete" ? "Jewellery appraisal completed" : action === "clarification" ? "Appraisal clarification requested" : action === "start" ? "Jewellery appraisal started" : "Jewellery appraisal saved",
        description: descriptionMap[action],
        section: "Jewellery Appraisal",
        toStatus: applicationStatusMap[action],
        metadata: { itemCount: completedItems.length, totalNetWeight },
      },
      action !== "save",
    );
    if (success && action === "complete") setValidationErrors({});
  };

  const nomineeAge = useMemo(() => {
    if (!makerDraft.nominee.dateOfBirth) return null;
    const dob = new Date(makerDraft.nominee.dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) age -= 1;
    return age;
  }, [makerDraft.nominee.dateOfBirth]);

  const validateMaker = (submit) => {
    const errors = {};
    const required = toNumber(makerDraft.requiredAmount);
    const recommended = toNumber(makerDraft.recommendedAmount);
    const maximum = toNumber(view.eligibility.maximumEligibleAmount);
    if (!(required > 0)) errors.requiredAmount = "Enter the required loan amount.";
    if (maximum !== null && required > maximum) errors.requiredAmount = "Required amount cannot exceed maximum eligibility.";
    if (!(recommended > 0)) errors.recommendedAmount = "Enter the recommended amount.";
    if (recommended > required) errors.recommendedAmount = "Recommended amount cannot exceed the required amount.";
    if (maximum !== null && recommended > maximum) errors.recommendedAmount = "Recommended amount cannot exceed maximum eligibility.";
    const isOverdraft = String(view.loan.repaymentType || view.loan.facilityType).toLowerCase().includes("overdraft");
    if (!isOverdraft && !makerDraft.disbursementAccount) errors.disbursementAccount = "Select an active CASA account.";
    if (submit && !makerDraft.nominee.name.trim()) errors.nomineeName = "Enter nominee name.";
    if (submit && !makerDraft.nominee.relationship) errors.nomineeRelationship = "Select relationship.";
    if (submit && !makerDraft.nominee.dateOfBirth) errors.nomineeDob = "Enter nominee date of birth.";
    if (nomineeAge !== null && (nomineeAge < 0 || nomineeAge > 120)) {
      errors.nomineeDob = "Enter a valid nominee date of birth.";
    }
    if (nomineeAge !== null && nomineeAge < 18 && !makerDraft.nominee.guardianName.trim()) errors.guardianName = "Guardian details are required for a minor nominee.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const persistMaker = async (submit) => {
    if (!makerCanEdit || !validateMaker(submit)) return;
    const now = new Date().toISOString();
    const isMinor = nomineeAge !== null && nomineeAge < 18;
    const status = submit ? "Submitted to Checker" : "Draft";
    await commitUpdate(
      (application) => {
        const details = application.details || {};
        const makerNode = {
          ...(details.eligibilityRecommendation || application.makerFinalisation || {}),
          ...makerDraft,
          requiredAmount: toNumber(makerDraft.requiredAmount),
          recommendedAmount: toNumber(makerDraft.recommendedAmount),
          nominee: { ...makerDraft.nominee, isMinor },
          status,
          submittedAt: submit ? now : null,
          submittedBy: submit ? actor : null,
          lastSavedAt: now,
        };
        const assignment = submit
          ? { ...(application.assignment || {}), persona: "Checker", currentOwner: "Branch Checker", assignedAt: now }
          : application.assignment;
        return {
          ...application,
          status: submit ? "Pending Checker Review" : application.status,
          stage: submit ? "CHECKER_SANCTION" : application.stage,
          assignment,
          assignedPersona: submit ? "Checker" : application.assignedPersona,
          currentOwner: submit ? "Branch Checker" : application.currentOwner,
          details: { ...details, eligibilityRecommendation: makerNode },
          makerFinalisation: makerNode,
          checklist: { ...(application.checklist || {}), makerRecommendation: submit ? "Completed" : "In progress" },
          pushback: submit ? null : application.pushback,
        };
      },
      {
        type: submit ? "maker_submission" : "maker_draft",
        title: submit ? "Maker recommendation submitted" : "Maker recommendation saved",
        description: submit
          ? `${formatCurrency(makerDraft.recommendedAmount)} recommended to the Branch Checker.`
          : "Eligibility and recommendation changes were saved as draft.",
        section: "Eligibility & Recommendation",
        toStatus: submit ? "Pending Checker Review" : view.application.status,
      },
      submit,
    );
  };

  const persistCheckerDecision = async (decision) => {
    if (!checkerCanEdit) return;
    const errors = {};
    if (!checkerDraft.comments.trim()) errors.checkerComments = "Enter decision comments.";
    if (decision === "pushback" && !checkerDraft.pushbackReason.trim()) errors.pushbackReason = "Enter the required correction or clarification.";
    if (decision === "reject" && !checkerDraft.rejectionReason.trim()) errors.rejectionReason = "Select or enter a rejection reason.";
    setValidationErrors(errors);
    if (Object.keys(errors).length) return;
    const now = new Date().toISOString();
    const isAppraisalPushback = normalizeSection(checkerDraft.pushbackSection) === "jewelleryAppraisal";
    const decisionConfig = {
      approve: { status: "Sanctioned", stage: "DOCUMENTATION_DISBURSEMENT", persona: "Maker", owner: "Branch Maker" },
      pushback: { status: "Rework Required", stage: "APPRAISAL_ELIGIBILITY", persona: isAppraisalPushback ? "Appraiser" : "Maker", owner: isAppraisalPushback ? "Assigned Appraiser" : "Branch Maker" },
      reject: { status: "Rejected", stage: "EXIT", persona: "", owner: "Closed" },
    }[decision];
    await commitUpdate(
      (application) => {
        const details = application.details || {};
        const checkerNode = {
          ...(details.checkerDecision || application.checkerDecision || {}),
          decision: decision === "approve" ? "Approved" : decision === "pushback" ? "Push Back" : "Rejected",
          status: decisionConfig.status,
          comments: checkerDraft.comments.trim(),
          pushbackSection: decision === "pushback" ? checkerDraft.pushbackSection : "",
          pushbackReason: decision === "pushback" ? checkerDraft.pushbackReason.trim() : "",
          rejectionReason: decision === "reject" ? checkerDraft.rejectionReason.trim() : "",
          decidedAt: now,
          decidedBy: actor,
          cbsLoanAccountReference:
            decision === "approve"
              ? application.checkerDecision?.cbsLoanAccountReference || `GL-${Date.now()}`
              : null,
        };
        return {
          ...application,
          status: decisionConfig.status,
          stage: decisionConfig.stage,
          assignment: { ...(application.assignment || {}), persona: decisionConfig.persona, currentOwner: decisionConfig.owner, assignedAt: now },
          assignedPersona: decisionConfig.persona,
          currentOwner: decisionConfig.owner,
          details: { ...details, checkerDecision: checkerNode },
          checkerDecision: checkerNode,
          checklist: { ...(application.checklist || {}), checkerSanction: decision === "approve" ? "Completed" : decision === "reject" ? "Rejected" : "Blocked" },
          pushback:
            decision === "pushback"
              ? { section: checkerDraft.pushbackSection, reason: checkerDraft.pushbackReason.trim(), assignedTo: decisionConfig.persona, createdAt: now, createdBy: actor }
              : null,
          documentationDisbursement:
            decision === "approve"
              ? { ...(application.documentationDisbursement || {}), status: "Pending Document Generation", sanction: { amount: application.makerFinalisation?.recommendedAmount, sanctionedAt: now, checker: actor, cbsLoanAccountReference: checkerNode.cbsLoanAccountReference } }
              : application.documentationDisbursement,
        };
      },
      {
        type: `checker_${decision}`,
        title: decision === "approve" ? "Application approved and sanctioned" : decision === "pushback" ? "Application pushed back" : "Application rejected",
        description: decision === "pushback" ? checkerDraft.pushbackReason.trim() : decision === "reject" ? checkerDraft.rejectionReason.trim() : checkerDraft.comments.trim(),
        section: "Checker Decision",
        toStatus: decisionConfig.status,
      },
      true,
    );
  };

  const sectionStatus = (id) => {
    if (id === "customerKyc") return view.customer.kycStatus;
    if (id === "loanBranch") return hasValue(view.loan.requestedAmount) ? "Completed" : "Pending";
    if (id === "compliance") {
      const requiredStatuses = [];
      if (String(view.compliance.cibilRequired).toLowerCase() === "true") requiredStatuses.push(view.compliance.cibilStatus);
      if (String(view.compliance.landRequired).toLowerCase() === "true") requiredStatuses.push(view.compliance.landStatus);
      return requiredStatuses.some((item) => statusTone(item) !== "success") ? "Pending" : "Completed";
    }
    if (id === "jewelleryAppraisal") return view.appraisal.status;
    if (id === "eligibilityRecommendation") return view.eligibility.status;
    return view.checker.status || view.checker.decision || "Pending";
  };

  const renderCustomer = () => (
    <section className="details-section">
      <SectionHeading eyebrow="IDENTITY & CONSENT" title="Customer & KYC" description="Verified customer information captured during application creation." status={view.customer.kycStatus} editable={false} />
      <div className="details-info-banner"><Icon type="info" /><span>This section is sourced from Customer Authentication & Consent and remains read-only after application creation.</span></div>
      <ReadOnlyGrid columns={3} fields={[
        { label: "Customer name", value: view.customer.name },
        { label: "Relationship", value: view.customer.relationship },
        { label: "CBS Customer ID", value: view.customer.cbsCustomerId },
        { label: "Date of birth", value: formatDate(view.customer.dob) },
        { label: "PAN", value: view.customer.pan },
        { label: "KYC status", value: view.customer.kycStatus, status: true },
        { label: "Registered mobile", value: view.customer.mobile },
        { label: "Registered email", value: view.customer.email },
        { label: "Consent status", value: view.customer.consentStatus, status: true },
        { label: "Permanent address", value: view.customer.permanentAddress, wide: true },
        { label: "Communication address", value: view.customer.communicationAddress, wide: true },
        { label: "Consent reference", value: view.customer.consentReference, helper: view.customer.consentAt ? `Captured ${formatDateTime(view.customer.consentAt)}` : "" },
      ]} />
    </section>
  );

  const renderLoanBranch = () => (
    <section className="details-section">
      <SectionHeading eyebrow="FACILITY SETUP" title="Loan & Branch" description="Facility, scheme, exposure, servicing branch and account configuration." status={hasValue(view.loan.requestedAmount) ? "Completed" : "Pending"} editable={false} />
      <ReadOnlyGrid columns={3} fields={[
        { label: "Facility", value: view.loan.facilityType },
        { label: "Scheme", value: view.loan.scheme },
        { label: "Loan purpose", value: view.loan.purpose },
        { label: "Original requested amount", value: formatCurrency(view.loan.requestedAmount) },
        { label: "Tenure", value: view.loan.tenure },
        { label: "Repayment type", value: view.loan.repaymentType },
        { label: "Existing Gold Loan exposure", value: formatCurrency(view.loan.existingExposure) },
        { label: "Aggregate exposure", value: formatCurrency(view.loan.aggregateExposure) },
        { label: "Charges CASA account", value: view.loan.chargesAccount },
        { label: "Disbursement account", value: view.loan.disbursementAccount },
      ]} />
      <div className="details-subsection-heading"><h4>Servicing branch</h4></div>
      <ReadOnlyGrid columns={3} fields={[
        { label: "Branch name", value: view.loan.branch.name },
        { label: "Branch code", value: view.loan.branch.code },
        { label: "DP code", value: view.loan.branch.dpCode },
        { label: "PIN code", value: view.loan.branch.pinCode },
        { label: "Complete address", value: view.loan.branch.address, wide: true },
      ]} />
      <div className="details-subsection-heading"><h4>Existing Gold Loans</h4><span>{view.loan.existingLoans.length} account(s)</span></div>
      {view.loan.existingLoans.length ? (
        <div className="details-table-wrap"><table className="details-table"><thead><tr><th>Account</th><th>Scheme</th><th>Sanctioned amount</th><th>Outstanding</th><th>Status</th></tr></thead><tbody>{view.loan.existingLoans.map((item, index) => <tr key={item.accountNumber || index}><td data-label="Account">{textValue(item.maskedAccountNumber || item.accountNumber)}</td><td data-label="Scheme">{textValue(item.scheme)}</td><td data-label="Sanctioned amount">{formatCurrency(item.sanctionedAmount)}</td><td data-label="Outstanding">{formatCurrency(item.outstandingAmount || item.outstanding)}</td><td data-label="Status"><Status value={item.status || "Active"} /></td></tr>)}</tbody></table></div>
      ) : <div className="details-empty-inline">No existing Gold Loan accounts were returned by CBS.</div>}
    </section>
  );

  const renderCompliance = () => {
    const cibilRequired = String(view.compliance.cibilRequired).toLowerCase() === "true";
    const landRequired = String(view.compliance.landRequired).toLowerCase() === "true";
    return (
      <section className="details-section">
        <SectionHeading eyebrow="CONDITIONAL CHECKS" title="Compliance" description="CIBIL/CIC and agricultural land evidence captured during application creation." status={sectionStatus("compliance")} editable={false} />
        <div className="compliance-grid">
          <article className="compliance-card"><header><span><Icon type="shield" /></span><div><p>CREDIT ASSESSMENT</p><h4>CIBIL / CIC</h4></div><Status value={cibilRequired ? view.compliance.cibilStatus : "Not required"} /></header><ReadOnlyGrid columns={2} fields={[
            { label: "Requirement", value: cibilRequired ? "Required" : "Not required", status: true },
            { label: "Report status", value: cibilRequired ? view.compliance.cibilStatus : "Not required", status: true },
            { label: "Credit score", value: view.compliance.cibilScore },
            { label: "Minimum score", value: view.compliance.minimumScore },
            { label: "Bureau reference", value: view.compliance.cibilReference },
            { label: "Completed at", value: formatDateTime(view.compliance.cibilAt) },
          ]} />{cibilRequired && view.compliance.cibilReport && <a className="details-document-link" href={view.compliance.cibilReport} target="_blank" rel="noreferrer">View CIBIL report <Icon type="chevron" /></a>}</article>
          <article className="compliance-card"><header><span><Icon type="bank" /></span><div><p>AGRICULTURAL FACILITY</p><h4>Land & crop details</h4></div><Status value={landRequired ? view.compliance.landStatus : "Not required"} /></header>{landRequired ? <ReadOnlyGrid columns={2} fields={[
            { label: "State", value: view.compliance.state },
            { label: "District", value: view.compliance.district },
            { label: "Village", value: view.compliance.village },
            { label: "Survey number", value: view.compliance.surveyNumber },
            { label: "Season", value: view.compliance.season },
            { label: "Crop", value: view.compliance.crop },
            { label: "Land area", value: view.compliance.landArea },
            { label: "Cost per unit", value: formatCurrency(view.compliance.costPerUnit) },
            { label: "Ownership", value: view.compliance.ownershipStatus },
            { label: "Verified by", value: view.compliance.verifiedBy, helper: view.compliance.verifiedAt ? formatDateTime(view.compliance.verifiedAt) : "" },
          ]} /> : <div className="compliance-not-required"><Icon type="check" /><div><strong>Land details are not required</strong><p>The selected facility and exposure do not trigger the agricultural land-document rule.</p></div></div>}</article>
        </div>
      </section>
    );
  };

  const renderAppraisal = () => (
    <section className="details-section appraisal-section">
      <SectionHeading eyebrow="APPRAISER WORKSPACE" title="Jewellery Appraisal" description="Assess physical quality, deductions, eligible net weight and photographic traceability." status={view.appraisal.status} editable={appraiserCanEdit} />
      {!appraiserCanEdit && <div className="details-info-banner"><Icon type="lock" /><span>{normalizedPersona === "Appraiser" ? "The appraisal is not currently assigned or is already completed." : "Only the assigned Appraiser can edit jewellery assessment fields."}</span></div>}
      <div className="weight-policy-grid">{weightSummary.map((item) => <article key={item.key} className={item.exceeded ? "is-exceeded" : ""}><div><p>{item.label}</p><strong>{formatWeight(item.total)}</strong></div><span>{formatWeight(item.limit)} limit</span><div className="weight-progress"><i style={{ width: `${Math.min(100, (item.total / item.limit) * 100)}%` }} /></div></article>)}</div>
      {validationErrors.weightLimit && <div className="details-validation-banner"><Icon type="alert" />{validationErrors.weightLimit}</div>}
      {validationErrors.items && <div className="details-validation-banner"><Icon type="alert" />{validationErrors.items}</div>}
      <div className="appraisal-item-list">
        {appraisalItems.map((item) => {
          const expanded = expandedItemId === item.id;
          const netWeight = netWeightFor(item);
          return <article key={item.id} className={`appraisal-item ${expanded ? "is-expanded" : ""}`}>
            <button type="button" className="appraisal-item__header" onClick={() => setExpandedItemId(expanded ? "" : item.id)} aria-expanded={expanded}>
              <span className="item-number">{String(item.serialNumber).padStart(2, "0")}</span><span className="item-title"><strong>{item.description}</strong><small>{item.category} · {item.itemCount} item(s)</small></span><span className="item-weight"><small>Net weight</small><strong>{formatWeight(netWeight)}</strong></span><Status value={item.appraisal.status} /><span className="item-chevron"><Icon type="chevron" /></span>
            </button>
            {expanded && <div className="appraisal-item__body">
              <div className="maker-information"><div className="details-subsection-heading"><h4>Maker-entered information</h4><span>Read only</span></div><ReadOnlyGrid columns={3} fields={[
                { label: "Ornament description", value: item.description },
                { label: "Number of items", value: item.itemCount },
                { label: "Category", value: item.category },
                { label: "Ownership declaration", value: item.ownershipDeclaration },
                { label: "Ownership proof", value: item.ownershipProof?.name || item.ownershipProof || "Not uploaded" },
                { label: "Maker remarks", value: item.makerRemarks || "—", wide: true },
              ]} /></div>
              <div className="appraiser-form"><div className="details-subsection-heading"><h4>Appraiser assessment</h4><span>{appraiserCanEdit ? "Enter assessment" : "Read only"}</span></div><div className="details-form-grid columns-3">
                <Field label="Defect present" required><select disabled={!appraiserCanEdit} value={item.appraisal.defectPresent} onChange={(event) => updateAppraisalItem(item.id, "defectPresent", event.target.value)}><option>No</option><option>Yes</option></select></Field>
                <Field label="Defect description" required={item.appraisal.defectPresent === "Yes"} error={validationErrors[`${item.id}.defectDescription`]} wide><input disabled={!appraiserCanEdit || item.appraisal.defectPresent !== "Yes"} value={item.appraisal.defectDescription} onChange={(event) => updateAppraisalItem(item.id, "defectDescription", event.target.value)} placeholder="Describe observed defect" /></Field>
                <Field label="Quality / purity" required error={validationErrors[`${item.id}.purity`]}><select disabled={!appraiserCanEdit} value={item.appraisal.purity} onChange={(event) => updateAppraisalItem(item.id, "purity", event.target.value)}><option value="">Select purity</option>{PURITY_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></Field>
                <Field label="Gross weight (g)" required error={validationErrors[`${item.id}.grossWeight`]}><input disabled={!appraiserCanEdit} type="number" inputMode="decimal" min="0" step="0.01" value={item.appraisal.grossWeight} onChange={(event) => updateAppraisalItem(item.id, "grossWeight", event.target.value)} /></Field>
                <Field label="Stone deduction (g)"><input disabled={!appraiserCanEdit} type="number" inputMode="decimal" min="0" step="0.01" value={item.appraisal.stoneDeduction} onChange={(event) => updateAppraisalItem(item.id, "stoneDeduction", event.target.value)} /></Field>
                <Field label="Alloy deduction (g)"><input disabled={!appraiserCanEdit} type="number" inputMode="decimal" min="0" step="0.01" value={item.appraisal.alloyDeduction} onChange={(event) => updateAppraisalItem(item.id, "alloyDeduction", event.target.value)} /></Field>
                <Field label="String / fastening (g)"><input disabled={!appraiserCanEdit} type="number" inputMode="decimal" min="0" step="0.01" value={item.appraisal.fasteningDeduction} onChange={(event) => updateAppraisalItem(item.id, "fasteningDeduction", event.target.value)} /></Field>
                <Field label="Other deductions (g)"><input disabled={!appraiserCanEdit} type="number" inputMode="decimal" min="0" step="0.01" value={item.appraisal.otherDeduction} onChange={(event) => updateAppraisalItem(item.id, "otherDeduction", event.target.value)} /></Field>
                <div className="calculated-weight"><span>Calculated net weight</span><strong>{formatWeight(netWeight)}</strong><small>Gross weight minus all deductions</small></div>
                <Field label="Appraiser remarks" wide><textarea disabled={!appraiserCanEdit} rows="3" value={item.appraisal.remarks} onChange={(event) => updateAppraisalItem(item.id, "remarks", event.target.value)} placeholder="Enter appraisal remarks" /></Field>
                <div className={`photo-upload-field wide ${validationErrors[`${item.id}.photographs`] ? "has-error" : ""}`}><span>Jewellery photographs <b>*</b></span>{appraiserCanEdit && <label className="photo-upload-button"><Icon type="upload" />Take photo or upload<input type="file" accept="image/*" capture="environment" multiple onChange={(event) => handlePhotographs(item.id, event.target.files)} /></label>}<div className="photo-preview-list">{item.appraisal.photographs?.map((photo) => <figure key={photo.id || photo.name}><img src={photo.dataUrl || photo.url} alt={photo.name || "Jewellery"} /><figcaption>{photo.name || "Jewellery photo"}</figcaption>{appraiserCanEdit && <button type="button" onClick={() => removePhoto(item.id, photo.id)} aria-label={`Remove ${photo.name}`}><Icon type="trash" /></button>}</figure>)}</div>{validationErrors[`${item.id}.photographs`] && <small className="field-error">{validationErrors[`${item.id}.photographs`]}</small>}</div>
              </div></div>
            </div>}
          </article>;
        })}
        {!appraisalItems.length && <div className="details-empty-state"><Icon type="jewellery" /><h4>No jewellery items available</h4><p>The Branch Maker must submit offered jewellery before appraisal can begin.</p></div>}
      </div>
      {appraiserCanEdit && <div className="appraisal-actions"><Field label="Clarification / return comments" error={validationErrors.clarification} wide><textarea rows="2" value={clarificationComment} onChange={(event) => setClarificationComment(event.target.value)} placeholder="Required only when returning to Maker" /></Field><div className="details-action-row"><button type="button" className="secondary" onClick={() => persistAppraisal("start")}>Start Appraisal</button><button type="button" className="secondary" onClick={() => persistAppraisal("save")}>Save Draft</button><button type="button" className="warning" onClick={() => persistAppraisal("clarification")}>Return for Clarification</button><button type="button" className="primary" onClick={() => persistAppraisal("complete")}>Complete Appraisal</button></div></div>}
    </section>
  );

  const renderEligibility = () => {
    const isOverdraft = String(view.loan.repaymentType || view.loan.facilityType).toLowerCase().includes("overdraft");
    const activeAccounts = view.loan.accounts.filter((account) => !account.status || String(account.status).toLowerCase() === "active");
    const minor = nomineeAge !== null && nomineeAge < 18;
    return <section className="details-section eligibility-section">
      <SectionHeading eyebrow="ELIGIBILITY & MAKER ACTION" title="Eligibility & Maker Recommendation" description="Review backend eligibility, charges and nominee information before Checker submission." status={view.eligibility.status} editable={makerCanEdit} />
      {!makerCanEdit && <div className="details-info-banner"><Icon type="lock" /><span>Eligibility calculations are read-only. Maker inputs are enabled only when the application is assigned to the Branch Maker.</span></div>}
      <div className="eligibility-calculation"><div className="eligibility-rate-row"><span><small>IBJA gold rate</small><strong>{formatCurrency(view.eligibility.ibjaGoldRate)}/g</strong></span><span><small>Scheme percentage</small><strong>{textValue(view.eligibility.schemePercentage)}%</strong></span><span><small>Lending rate per gram</small><strong>{formatCurrency(view.eligibility.lendingRatePerGram)}/g</strong></span><span><small>Eligible net weight</small><strong>{formatWeight(view.eligibility.totalNetWeight)}</strong></span></div><div className="eligibility-limit-grid">{[
        ["A", "Scheme lending value", view.eligibility.schemeLendingValue],
        ["B", "Available exposure limit", view.eligibility.availableExposureLimit],
        ["C", `LTV-based value (${textValue(view.eligibility.applicableLtv)}%)`, view.eligibility.ltvBasedValue],
      ].map(([key, label, value]) => <article key={key}><span>{key}</span><div><p>{label}</p><strong>{formatCurrency(value)}</strong></div></article>)}</div><div className="maximum-eligible"><div><small>Controlling limit: {textValue(view.eligibility.controllingLimit)}</small><strong>Maximum eligible amount</strong></div><b>{formatCurrency(view.eligibility.maximumEligibleAmount)}</b></div></div>
      <div className="maker-panels">
        <section className="maker-panel"><div className="details-subsection-heading"><h4>Loan recommendation</h4><span>{makerCanEdit ? "Maker input" : "Read only"}</span></div><div className="details-form-grid columns-2">
          <Field label="Required loan amount" required error={validationErrors.requiredAmount}><div className="currency-input"><span>₹</span><input disabled={!makerCanEdit} type="number" inputMode="numeric" min="0" value={makerDraft.requiredAmount} onChange={(event) => setMakerDraft((current) => ({ ...current, requiredAmount: event.target.value }))} /></div></Field>
          <Field label="Recommended amount" required error={validationErrors.recommendedAmount}><div className="currency-input"><span>₹</span><input disabled={!makerCanEdit} type="number" inputMode="numeric" min="0" value={makerDraft.recommendedAmount} onChange={(event) => setMakerDraft((current) => ({ ...current, recommendedAmount: event.target.value }))} /></div></Field>
          <Field label="Disbursement account" required={!isOverdraft} error={validationErrors.disbursementAccount} wide><select disabled={!makerCanEdit || isOverdraft} value={makerDraft.disbursementAccount} onChange={(event) => setMakerDraft((current) => ({ ...current, disbursementAccount: event.target.value }))}><option value="">{isOverdraft ? "Not applicable for Overdraft" : "Select active CASA account"}</option>{activeAccounts.map((account, index) => <option key={account.accountNumber || index} value={account.accountNumber || account.value}>{account.maskedAccountNumber || account.accountNumber || account.label}</option>)}</select>{isOverdraft && <small>OD limit will be created in CBS; no disbursement account is required.</small>}</Field>
          <Field label="Maker comments" wide><textarea disabled={!makerCanEdit} rows="3" value={makerDraft.makerComments} onChange={(event) => setMakerDraft((current) => ({ ...current, makerComments: event.target.value }))} placeholder="Enter recommendation comments" /></Field>
        </div></section>
        <section className="maker-panel"><div className="details-subsection-heading"><h4>Processing & appraiser charges</h4><span>Backend calculated</span></div><ReadOnlyGrid columns={2} fields={[
          { label: "Processing charge", value: formatCurrency(view.eligibility.charges.processingCharge) },
          { label: "Appraiser charge", value: formatCurrency(view.eligibility.charges.appraiserCharge) },
          { label: "GST", value: formatCurrency(view.eligibility.charges.gst) },
          { label: "Other charges", value: formatCurrency(view.eligibility.charges.otherCharges) },
          { label: "Total charges", value: formatCurrency(view.eligibility.charges.totalCharges) },
          { label: "Deduction account", value: view.eligibility.charges.chargesAccount },
        ]} /></section>
        <section className="maker-panel nominee-panel"><div className="details-subsection-heading"><h4>Nominee details</h4><span>{makerCanEdit ? "Maker input" : "Read only"}</span></div>{makerCanEdit && <label className="details-checkbox"><input type="checkbox" checked={makerDraft.nominee.useSavingsNominee} onChange={(event) => {
          const checked = event.target.checked;
          const fetchedNominee = view.loan.savingsNominee || {};
          setMakerDraft((current) => ({
            ...current,
            nominee: {
              ...current.nominee,
              useSavingsNominee: checked,
              ...(checked
                ? {
                    name: fetchedNominee.name || current.nominee.name,
                    relationship: fetchedNominee.relationship || current.nominee.relationship,
                    dateOfBirth: fetchedNominee.dateOfBirth || current.nominee.dateOfBirth,
                    address: fetchedNominee.address || current.nominee.address,
                    guardianName: fetchedNominee.guardianName || current.nominee.guardianName,
                    guardianRelationship: fetchedNominee.guardianRelationship || current.nominee.guardianRelationship,
                    guardianContact: fetchedNominee.guardianContact || current.nominee.guardianContact,
                  }
                : {}),
            },
          }));
        }} /><span>Use nominee from Savings Account / fetch from CBS</span></label>}<div className="details-form-grid columns-2">
          <Field label="Nominee name" required error={validationErrors.nomineeName}><input disabled={!makerCanEdit} value={makerDraft.nominee.name} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, name: event.target.value } }))} /></Field>
          <Field label="Relationship" required error={validationErrors.nomineeRelationship}><select disabled={!makerCanEdit} value={makerDraft.nominee.relationship} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, relationship: event.target.value } }))}><option value="">Select relationship</option>{["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"].map((option) => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Date of birth" required error={validationErrors.nomineeDob}><input disabled={!makerCanEdit} type="date" value={makerDraft.nominee.dateOfBirth} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, dateOfBirth: event.target.value } }))} /></Field>
          <Field label="Nominee address"><input disabled={!makerCanEdit} value={makerDraft.nominee.address} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, address: event.target.value } }))} /></Field>
          {minor && <><div className="minor-notice wide"><Icon type="info" />Nominee is a minor. Guardian details are mandatory.</div><Field label="Guardian name" required error={validationErrors.guardianName}><input disabled={!makerCanEdit} value={makerDraft.nominee.guardianName} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, guardianName: event.target.value } }))} /></Field><Field label="Guardian relationship"><input disabled={!makerCanEdit} value={makerDraft.nominee.guardianRelationship} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, guardianRelationship: event.target.value } }))} /></Field><Field label="Guardian contact" wide><input disabled={!makerCanEdit} value={makerDraft.nominee.guardianContact} onChange={(event) => setMakerDraft((current) => ({ ...current, nominee: { ...current.nominee, guardianContact: event.target.value } }))} /></Field></>}
        </div></section>
      </div>
      {makerCanEdit && <div className="details-action-row sticky-actions"><button type="button" className="secondary" onClick={() => persistMaker(false)}>Save Draft</button><button type="button" className="primary" onClick={() => persistMaker(true)}>Submit to Branch Checker</button></div>}
    </section>;
  };

  const renderChecker = () => (
    <section className="details-section checker-section">
      <SectionHeading eyebrow="INDEPENDENT REVIEW" title="Checker Decision" description="Review all preceding sections and record the sanction decision." status={view.checker.status || view.checker.decision || "Pending"} editable={checkerCanEdit} />
      <div className="checker-review-grid">{[
        ["Customer & KYC", view.customer.kycStatus], ["Consent", view.customer.consentStatus], ["Loan & Branch", hasValue(view.loan.requestedAmount) ? "Completed" : "Pending"], ["CIBIL / CIC", String(view.compliance.cibilRequired).toLowerCase() === "true" ? view.compliance.cibilStatus : "Not required"], ["Land details", String(view.compliance.landRequired).toLowerCase() === "true" ? view.compliance.landStatus : "Not required"], ["Jewellery appraisal", view.appraisal.status], ["Maker recommendation", view.eligibility.status],
      ].map(([label, status]) => <article key={label}><span>{label}</span><Status value={status} /></article>)}</div>
      <div className="checker-financial-summary"><span><small>Original request</small><strong>{formatCurrency(view.loan.requestedAmount)}</strong></span><span><small>Maximum eligible</small><strong>{formatCurrency(view.eligibility.maximumEligibleAmount)}</strong></span><span><small>Required amount</small><strong>{formatCurrency(view.eligibility.requiredAmount)}</strong></span><span className="featured"><small>Maker recommendation</small><strong>{formatCurrency(view.eligibility.recommendedAmount)}</strong></span></div>
      {view.checker.decision && <div className="existing-decision"><Icon type="decision" /><div><strong>{view.checker.decision}</strong><p>{view.checker.comments || "No Checker comments recorded."}</p><span>{view.checker.decidedBy?.name || "Branch Checker"} · {formatDateTime(view.checker.decidedAt)}</span></div></div>}
      <div className="checker-decision-form"><div className="details-form-grid columns-2"><Field label="Decision comments" required error={validationErrors.checkerComments} wide><textarea disabled={!checkerCanEdit} rows="4" value={checkerDraft.comments} onChange={(event) => setCheckerDraft((current) => ({ ...current, comments: event.target.value }))} placeholder="Record review observations and decision rationale" /></Field><Field label="Pushback section"><select disabled={!checkerCanEdit} value={checkerDraft.pushbackSection} onChange={(event) => setCheckerDraft((current) => ({ ...current, pushbackSection: event.target.value }))}>{PUSHBACK_SECTIONS.map((section) => <option key={section}>{section}</option>)}</select></Field><Field label="Pushback reason" error={validationErrors.pushbackReason}><input disabled={!checkerCanEdit} value={checkerDraft.pushbackReason} onChange={(event) => setCheckerDraft((current) => ({ ...current, pushbackReason: event.target.value }))} placeholder="Required correction or clarification" /></Field><Field label="Rejection reason" error={validationErrors.rejectionReason} wide><input disabled={!checkerCanEdit} value={checkerDraft.rejectionReason} onChange={(event) => setCheckerDraft((current) => ({ ...current, rejectionReason: event.target.value }))} placeholder="Customer declined, policy ineligible, fraud concern, other" /></Field></div>
        {checkerCanEdit ? <div className="checker-actions"><button type="button" className="danger" onClick={() => persistCheckerDecision("reject")}>Reject</button><button type="button" className="warning" onClick={() => persistCheckerDecision("pushback")}>Push Back</button><button type="button" className="primary" onClick={() => persistCheckerDecision("approve")}>Approve & Sanction</button></div> : <div className="details-info-banner"><Icon type="lock" /><span>Checker controls are enabled only when the application is assigned for sanction review.</span></div>}
      </div>
    </section>
  );

  const sectionContent = {
    customerKyc: renderCustomer,
    loanBranch: renderLoanBranch,
    compliance: renderCompliance,
    jewelleryAppraisal: renderAppraisal,
    eligibilityRecommendation: renderEligibility,
    checkerDecision: renderChecker,
  };

  return (
    <section className="details-tab" aria-labelledby="details-tab-title">
      <header className="details-tab__heading"><div><p>COMPLETE APPLICATION RECORD</p><h2 id="details-tab-title">Application Details</h2><span>Review the complete application and perform the action assigned to your persona.</span></div><div className="details-tab__persona"><strong>{normalizedPersona}</strong><small>{normalizedPersona === "Viewer" ? "Read-only access" : `${normalizedPersona} workspace`}</small></div></header>
      <div className="details-mobile-section-picker"><label htmlFor="application-detail-section">Application section</label><select id="application-detail-section" value={activeSection} onChange={(event) => setActiveSection(event.target.value)}>{SECTIONS.map((section) => <option key={section.id} value={section.id}>{section.number}. {section.label}</option>)}</select></div>
      <div className="details-workspace">
        <nav className="details-section-nav" aria-label="Application detail sections"><ol>{SECTIONS.map((section) => <li key={section.id}><button type="button" className={activeSection === section.id ? "is-active" : ""} onClick={() => setActiveSection(section.id)} aria-current={activeSection === section.id ? "page" : undefined}><span className="section-nav-icon"><Icon type={section.icon} /></span><span className="section-nav-copy"><small>SECTION {section.number}</small><strong>{section.label}</strong></span><Status value={sectionStatus(section.id)} /><span className="section-nav-chevron"><Icon type="chevron" /></span></button></li>)}</ol><div className="details-nav-note"><Icon type="info" /><p>Only the section assigned to your persona becomes editable.</p></div></nav>
        <div className="details-section-content">{sectionContent[activeSection]?.()}</div>
      </div>
      <div className={`details-save-state is-${saveState}`} role="status" aria-live="polite">{saveState === "saving" && "Saving application details…"}{saveState === "saved" && <><Icon type="check" />Changes queued and application state updated.</>}{saveState === "error" && <><Icon type="alert" />{saveError}</>}{saveState === "idle" && "All displayed information is loaded from the current lead details JSON."}</div>
    </section>
  );
}
