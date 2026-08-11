import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchUserAttributes } from "aws-amplify/auth";
import "./ApplicationDetailPage.css";

const LEAD_API =
  "https://xx8ep3p2ue.execute-api.ap-south-1.amazonaws.com/prod/leads";
const LEAD_DETAILS_API =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";

const ROLE_EMAILS = {
  checker: new Set(["shivgaikwad@deloitte.com"]),
  // The first address is exactly as supplied. The dot/domain variants keep the
  // demo usable if the comma or the missing "o" was an email typo.
  appraiser: new Set([
    "mohikumawat@delitte,com",
    "mohikumawat@delitte.com",
    "mohikumawat@deloitte.com",
  ]),
  maker: new Set(["ychapa@deloitte.com"]),
};

const STAGES = [
  {
    id: "appraisal-eligibility",
    title: "Appraisal & Eligibility",
    description: "Appraisal, eligibility and maker finalisation",
  },
  {
    id: "checker-sanction",
    title: "Checker Sanction",
    description: "Independent verification and sanction decision",
  },
  {
    id: "documentation-disbursement",
    title: "Documentation & Disbursement",
    description: "Document execution and loan activation",
  },
];

const ORNAMENT_LIMITS = {
  "Gold Ornament": 1000,
  "Gold Coin": 50,
  "Silver Ornament": 10000,
  "Silver Coin": 500,
};

const BackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const JewelleryIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    aria-hidden="true"
  >
    <path d="m4 8 4-5h8l4 5-8 13Z" />
    <path d="M4 8h16M8 3l4 5 4-5M8 8l4 13 4-13" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M6 2h8l4 4v16H6z" />
    <path d="M14 2v5h5M9 13h6M9 17h6" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    className={open ? "is-open" : ""}
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const parseLeadDetails = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Unable to parse lead_details JSON:", error);
    return {};
  }
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toNumber = (value, fallback = 0) => {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : fallback;
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y", "1", "required"].includes(normalized)) return true;
    if (["false", "no", "n", "0", "not required"].includes(normalized))
      return false;
  }
  return Boolean(value);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(toNumber(value));

const formatNumber = (value, digits = 2) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(toNumber(value));

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getRole = (email) => {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (ROLE_EMAILS.checker.has(normalized)) return "checker";
  if (ROLE_EMAILS.appraiser.has(normalized)) return "appraiser";
  if (ROLE_EMAILS.maker.has(normalized)) return "maker";
  return "viewer";
};

const roleLabel = (role) =>
  ({
    checker: "Branch Checker",
    appraiser: "Jewellery Appraiser",
    maker: "Branch Maker",
    viewer: "Read-only User",
  })[role];

const normalizeItem = (item, index) => {
  const deductions = item?.deductions || {};
  const ownershipValue = firstValue(
    item?.customerDeclaredOwner,
    item?.ownership,
    "Yes",
  );
  return {
    id: item?.id || item?.itemId || `ornament-${index + 1}`,
    serialNumber: firstValue(item?.serialNumber, item?.slNo, index + 1),
    description: firstValue(
      item?.description,
      item?.ornamentDescription,
      item?.jewelleryType,
      "Jewellery item",
    ),
    category: firstValue(item?.category, item?.metalCategory, "Gold Ornament"),
    numberOfItems: toNumber(
      firstValue(item?.numberOfItems, item?.quantity, item?.itemCount, 1),
      1,
    ),
    customerDeclaredOwner: toBoolean(ownershipValue, true),
    ownershipProof: firstValue(
      item?.ownershipProof,
      item?.proofOfOwnership,
      item?.proofDocument,
      null,
    ),
    makerRemarks: firstValue(item?.makerRemarks, item?.remarks, ""),
    defectPresent:
      item?.defectPresent === true || item?.defectPresent === "Yes",
    defectDescription: item?.defectDescription || "",
    purityKarat: toNumber(firstValue(item?.purityKarat, item?.purity, 0)),
    grossWeight: toNumber(
      firstValue(item?.grossWeight, item?.grossWeightGms, 0),
    ),
    deductions: {
      stone: toNumber(firstValue(deductions.stone, item?.stoneWeight, 0)),
      alloy: toNumber(firstValue(deductions.alloy, item?.alloyWeight, 0)),
      stringFastening: toNumber(
        firstValue(deductions.stringFastening, item?.stringFasteningWeight, 0),
      ),
      other: toNumber(firstValue(deductions.other, item?.otherDeductions, 0)),
    },
    photographs: Array.isArray(item?.photographs) ? item.photographs : [],
    appraiserRemarks: item?.appraiserRemarks || "",
  };
};

const itemNetWeight = (item) => {
  const deductions = item?.deductions || {};
  return Math.max(
    0,
    toNumber(item?.grossWeight) -
      toNumber(deductions.stone) -
      toNumber(deductions.alloy) -
      toNumber(deductions.stringFastening) -
      toNumber(deductions.other),
  );
};

const extractCreationData = (details) => {
  const onboarding = details.applicationOnboarding || {};
  const data = onboarding.applicationData || {};
  const identity =
    details.customerIdentity ||
    data.customerIdentity ||
    data.customerAuthenticationConsent ||
    {};
  const facility =
    details.facilityBranchLoanDetails ||
    data.facilityBranchLoanDetails ||
    data.facilityLoanDetails ||
    {};
  const supporting =
    details.eligibilitySupportingDetails ||
    details.eligibilityAndSupportingDetails ||
    data.eligibilitySupportingDetails ||
    {};
  const jewellery =
    details.jewelleryDetailsSubmission ||
    details.jewelleryDetails ||
    data.jewelleryDetailsSubmission ||
    data.jewelleryDetails ||
    {};

  const jewelleryItems = firstValue(
    jewellery.items,
    jewellery.jewelleryItems,
    jewellery.ornaments,
    data.jewelleryItems,
    [],
  );

  const existingLoans = firstValue(
    facility.existingLoans,
    facility.exposure?.existingLoans,
    data.existingLoans,
    [],
  );

  const requestedAmount = toNumber(
    firstValue(
      facility.requestedLoanAmount,
      facility.loanDetails?.requestedLoanAmount,
      facility.exposure?.requestedAmount,
      data.requestedLoanAmount,
      0,
    ),
  );
  const existingExposure = toNumber(
    firstValue(
      facility.exposure?.existingAggregateExposure,
      facility.exposure?.existingExposure,
      facility.aggregateGoldLoanExposure,
      existingLoans.reduce(
        (total, loan) =>
          total +
          toNumber(firstValue(loan.outstandingAmount, loan.outstanding, 0)),
        0,
      ),
      0,
    ),
  );

  return {
    identity,
    facility,
    supporting,
    jewellery,
    jewelleryItems: Array.isArray(jewelleryItems) ? jewelleryItems : [],
    existingLoans: Array.isArray(existingLoans) ? existingLoans : [],
    requestedAmount,
    existingExposure,
  };
};

const buildInitialApplicationDetail = (details) => {
  const existing = details.applicationDetail || {};
  const creation = extractCreationData(details);
  const existingAppraisal = existing.appraisal || {};
  const sourceItems =
    existingAppraisal.items?.length > 0
      ? existingAppraisal.items
      : creation.jewelleryItems;
  const selectedScheme = firstValue(
    creation.facility.scheme?.name,
    creation.facility.schemeName,
    creation.facility.selectedScheme,
    creation.facility.loanDetails?.scheme,
    "Gold Loan Scheme",
  );
  const selectedFacility = firstValue(
    creation.facility.productType,
    creation.facility.facilityType,
    creation.facility.loanDetails?.facilityType,
    "Gold Loan",
  );
  const requestedAmount = firstValue(
    existing.originalRequestedAmount,
    creation.requestedAmount,
    0,
  );
  const existingExposure = firstValue(
    existing.existingExposure,
    creation.existingExposure,
    0,
  );

  return {
    version: 1,
    stage: toNumber(existing.stage, 1),
    stageId: existing.stageId || "appraisal-eligibility",
    status: existing.status || "Awaiting Appraisal",
    originalRequestedAmount: toNumber(requestedAmount),
    existingExposure: toNumber(existingExposure),
    selectedFacility,
    selectedScheme,
    selectedBranch: firstValue(
      existing.selectedBranch,
      creation.facility.selectedBranch,
      creation.facility.branch,
      creation.facility.homeBranch,
      {},
    ),
    assignedAppraiser: {
      name: firstValue(
        existing.assignedAppraiser?.name,
        creation.jewellery.appraiser?.name,
        creation.jewellery.appraiserName,
        "Mohit Kumawat",
      ),
      id: firstValue(
        existing.assignedAppraiser?.id,
        creation.jewellery.appraiser?.id,
        creation.jewellery.appraiserId,
        "APR-YES-0184",
      ),
      type: firstValue(
        existing.assignedAppraiser?.type,
        creation.jewellery.appraiser?.type,
        creation.jewellery.appraiserType,
        "Empanelled",
      ),
      gstType: firstValue(
        existing.assignedAppraiser?.gstType,
        creation.jewellery.appraiser?.gstType,
        creation.jewellery.appraiserGstType,
        "Registered",
      ),
    },
    appraisal: {
      startedAt: existingAppraisal.startedAt || null,
      completedAt: existingAppraisal.completedAt || null,
      items: sourceItems.map(normalizeItem),
      summary: existingAppraisal.summary || {},
    },
    eligibility: {
      calculatedAt: existing.eligibility?.calculatedAt || null,
      lendingRatePerGram: toNumber(
        firstValue(
          existing.eligibility?.lendingRatePerGram,
          creation.facility.lendingRatePerGram,
          creation.facility.scheme?.lendingRatePerGram,
          5510,
        ),
      ),
      ibjaRatePerGram: toNumber(
        firstValue(existing.eligibility?.ibjaRatePerGram, 7350),
      ),
      maximumPermittedLimit: toNumber(
        firstValue(existing.eligibility?.maximumPermittedLimit, 5000000),
      ),
      ...existing.eligibility,
    },
    compliance: {
      cibilRequired: toBoolean(
        firstValue(
          existing.compliance?.cibilRequired,
          creation.facility.exposure?.cibilRequired,
          creation.supporting.cibilRequired,
          creation.requestedAmount + creation.existingExposure >= 250000,
        ),
      ),
      cibilScore: firstValue(
        existing.compliance?.cibilScore,
        creation.supporting.cibil?.score,
        creation.supporting.cibilScore,
        null,
      ),
      cibilStatus: firstValue(
        existing.compliance?.cibilStatus,
        creation.supporting.cibil?.status,
        creation.supporting.cibilStatus,
        firstValue(
          creation.supporting.cibil?.score,
          creation.supporting.cibilScore,
        )
          ? "Report Generated"
          : creation.requestedAmount + creation.existingExposure >= 250000
            ? "Not Started"
            : "Not Required",
      ),
      cibilReport: firstValue(
        existing.compliance?.cibilReport,
        creation.supporting.cibil?.reportUrl,
        creation.supporting.cibilReport,
        "/docs/cibil-report.pdf",
      ),
      consentReference: firstValue(
        existing.compliance?.consentReference,
        creation.identity.consent?.reference,
        creation.identity.consentReference,
        "—",
      ),
      landDetailsRequired: toBoolean(
        firstValue(
          existing.compliance?.landDetailsRequired,
          creation.facility.exposure?.landDetailsRequired,
          creation.supporting.landDetailsRequired,
          false,
        ),
      ),
      landDetails: firstValue(
        existing.compliance?.landDetails,
        creation.supporting.landDetails,
        {},
      ),
    },
    makerFinalisation: {
      chargePolicy: {
        processingFeeRate: toNumber(
          firstValue(
            existing.makerFinalisation?.chargePolicy?.processingFeeRate,
            0.005,
          ),
        ),
        gstRate: toNumber(
          firstValue(existing.makerFinalisation?.chargePolicy?.gstRate, 0.18),
        ),
      },
      finalRequestedAmount: toNumber(
        firstValue(
          existing.makerFinalisation?.finalRequestedAmount,
          requestedAmount,
        ),
      ),
      recommendedAmount: toNumber(
        firstValue(existing.makerFinalisation?.recommendedAmount, 0),
      ),
      disbursementAccount: firstValue(
        existing.makerFinalisation?.disbursementAccount,
        creation.facility.disbursementAccount,
        creation.facility.accounts?.disbursementAccount,
        "",
      ),
      chargesAccount: firstValue(
        existing.makerFinalisation?.chargesAccount,
        creation.facility.casaAccount,
        creation.facility.accounts?.chargesAccount,
        "",
      ),
      charges: {
        processingFee: toNumber(
          firstValue(existing.makerFinalisation?.charges?.processingFee, 0),
        ),
        appraiserCharge: toNumber(
          firstValue(existing.makerFinalisation?.charges?.appraiserCharge, 750),
        ),
        gst: toNumber(firstValue(existing.makerFinalisation?.charges?.gst, 0)),
        otherCharges: toNumber(
          firstValue(existing.makerFinalisation?.charges?.otherCharges, 0),
        ),
      },
      nominee: {
        useSavingsNominee: toBoolean(
          existing.makerFinalisation?.nominee?.useSavingsNominee,
        ),
        name: existing.makerFinalisation?.nominee?.name || "",
        relationship: existing.makerFinalisation?.nominee?.relationship || "",
        dateOfBirth: existing.makerFinalisation?.nominee?.dateOfBirth || "",
        address: existing.makerFinalisation?.nominee?.address || "",
        guardianName: existing.makerFinalisation?.nominee?.guardianName || "",
        guardianRelationship:
          existing.makerFinalisation?.nominee?.guardianRelationship || "",
      },
      comments: existing.makerFinalisation?.comments || "",
      confirmations: {
        appraisalReviewed: toBoolean(
          existing.makerFinalisation?.confirmations?.appraisalReviewed,
        ),
        detailsConfirmed: toBoolean(
          existing.makerFinalisation?.confirmations?.detailsConfirmed,
        ),
      },
      submittedAt: existing.makerFinalisation?.submittedAt || null,
    },
    checkerReview: {
      decision: existing.checkerReview?.decision || null,
      section: existing.checkerReview?.section || "",
      comments: existing.checkerReview?.comments || "",
      decidedAt: existing.checkerReview?.decidedAt || null,
      decidedBy: existing.checkerReview?.decidedBy || "",
      history: Array.isArray(existing.checkerReview?.history)
        ? existing.checkerReview.history
        : [],
    },
    documentationDisbursement: {
      status: existing.documentationDisbursement?.status || "Not Started",
      ...existing.documentationDisbursement,
    },
    auditTrail: Array.isArray(existing.auditTrail) ? existing.auditTrail : [],
    createdAt: existing.createdAt || new Date().toISOString(),
    updatedAt: existing.updatedAt || new Date().toISOString(),
  };
};

const calculateEligibility = (detail) => {
  const totalGrossWeight = detail.appraisal.items.reduce(
    (total, item) => total + toNumber(item.grossWeight),
    0,
  );
  const totalNetWeight = detail.appraisal.items.reduce(
    (total, item) => total + itemNetWeight(item),
    0,
  );
  const aggregateExposure =
    toNumber(detail.existingExposure) +
    toNumber(detail.originalRequestedAmount);
  const applicableLtv =
    aggregateExposure <= 250000
      ? 0.85
      : aggregateExposure <= 500000
        ? 0.8
        : 0.75;
  const lendingValue = Math.floor(
    totalNetWeight * toNumber(detail.eligibility.lendingRatePerGram),
  );
  const ltvValue = Math.floor(
    totalNetWeight *
      toNumber(detail.eligibility.ibjaRatePerGram) *
      applicableLtv,
  );
  const exposureLimit = Math.max(
    0,
    toNumber(detail.eligibility.maximumPermittedLimit) -
      toNumber(detail.existingExposure),
  );
  const maximumEligibleAmount = Math.max(
    0,
    Math.min(lendingValue, ltvValue, exposureLimit),
  );
  const values = [
    { key: "Scheme lending value", value: lendingValue },
    { key: "LTV-based value", value: ltvValue },
    { key: "Exposure available limit", value: exposureLimit },
  ];
  const controllingLimit = values.reduce((lowest, entry) =>
    entry.value < lowest.value ? entry : lowest,
  );

  return {
    ...detail.eligibility,
    calculatedAt: new Date().toISOString(),
    totalGrossWeight,
    totalNetWeight,
    aggregateExposure,
    applicableLtv,
    lendingValue,
    ltvValue,
    exposureLimit,
    maximumEligibleAmount,
    controllingLimit: controllingLimit.key,
  };
};

const validateAppraisal = (items) => {
  if (!items.length) return "No jewellery items were captured by the maker.";
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const label = item.description || `Item ${index + 1}`;
    const totalDeductions =
      toNumber(item.deductions?.stone) +
      toNumber(item.deductions?.alloy) +
      toNumber(item.deductions?.stringFastening) +
      toNumber(item.deductions?.other);
    if (!toNumber(item.purityKarat)) return `Enter purity for ${label}.`;
    if (!toNumber(item.grossWeight)) return `Enter gross weight for ${label}.`;
    if (totalDeductions > toNumber(item.grossWeight)) {
      return `Deductions cannot exceed gross weight for ${label}.`;
    }
    const limit = ORNAMENT_LIMITS[item.category];
    if (limit && toNumber(item.grossWeight) > limit) {
      return `${label} exceeds the ${formatNumber(limit)} g limit for ${item.category}.`;
    }
    if (item.defectPresent && !item.defectDescription.trim()) {
      return `Describe the defect for ${label}.`;
    }
    if (!item.photographs?.length) return `Upload a photograph for ${label}.`;
  }
  return "";
};

const addAuditEntry = (detail, action, actor, note = "") => ({
  ...detail,
  auditTrail: [
    {
      id: makeId("audit"),
      action,
      actor,
      note,
      at: new Date().toISOString(),
    },
    ...(detail.auditTrail || []),
  ],
  updatedAt: new Date().toISOString(),
});

function Field({ label, value, children, hint, className = "" }) {
  return (
    <label className={`ad-field ${className}`}>
      <span>{label}</span>
      {children || <strong>{value || "—"}</strong>}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function StatusPill({ status }) {
  const tone =
    /approved|completed|calculated|sanctioned|passed|generated/i.test(status)
      ? "success"
      : /reject|failed/i.test(status)
        ? "danger"
        : /push|rework|review/i.test(status)
          ? "warning"
          : "progress";
  return <span className={`ad-status-pill ${tone}`}>{status}</span>;
}

function DocumentLink({ document, fallbackLabel = "View document" }) {
  if (!document) return <span className="ad-empty-value">Not uploaded</span>;
  const href =
    typeof document === "string"
      ? document
      : document.url || document.path || document.documentUrl;
  const label =
    (typeof document === "object" && (document.name || document.fileName)) ||
    fallbackLabel;
  if (!href) {
    return (
      <span className="ad-document-chip">
        <FileIcon /> {label}
      </span>
    );
  }
  return (
    <a
      className="ad-document-link"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <FileIcon /> {label}
    </a>
  );
}

function CollapsibleCard({
  eyebrow,
  title,
  description,
  actions,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useMemo(() => makeId("section"), []);
  return (
    <section className="ad-card">
      <div className="ad-card-heading">
        <button
          type="button"
          className="ad-heading-toggle"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={regionId}
        >
          <span className="ad-heading-copy">
            <span className="ad-eyebrow">{eyebrow}</span>
            <strong>{title}</strong>
            {description ? <small>{description}</small> : null}
          </span>
          <ChevronIcon open={open} />
        </button>
        {actions ? <div className="ad-card-actions">{actions}</div> : null}
      </div>
      {open ? (
        <div className="ad-card-body" id={regionId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

function ApplicationDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationNumber: routeApplicationNumber } = useParams();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const storedLeadId = routeApplicationNumber
    ? sessionStorage.getItem(`gold-loan:${routeApplicationNumber}:leadId`)
    : "";
  const leadId =
    location.state?.leadId || query.get("leadId") || storedLeadId || "";

  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [lead, setLead] = useState(location.state?.lead || null);
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [checkerForm, setCheckerForm] = useState({
    section: "",
    comments: "",
  });

  const detailsRef = useRef({});
  const leadRef = useRef(null);
  const saveTimerRef = useRef(null);
  const saveChainRef = useRef(Promise.resolve());
  const saveSequenceRef = useRef(0);

  const role = useMemo(() => getRole(loggedInUserEmail), [loggedInUserEmail]);
  const actor = loggedInUserEmail || roleLabel(role);

  const applicationNumber = firstValue(
    routeApplicationNumber,
    lead?.leadDetails?.applicationNumber,
    lead?.leadDetails?.applicationOnboarding?.applicationNumber,
    "Application",
  );

  const patchLeadDetails = useCallback(
    async (recordLeadId, nextLeadDetails, sequence) => {
      setSaving(true);
      setSaveError("");
      const response = await fetch(
        `${LEAD_DETAILS_API}/${encodeURIComponent(recordLeadId)}/details`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: recordLeadId,
            leadDetailsPatch: nextLeadDetails,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`Unable to save lead details (${response.status})`);
      }
      if (sequence === saveSequenceRef.current) {
        setLastSavedAt(new Date());
        setSaving(false);
      }
    },
    [],
  );

  const enqueueSave = useCallback(
    (nextLeadDetails, immediate = false) => {
      if (!leadId) return;
      const snapshot = clone(nextLeadDetails);
      const sequence = saveSequenceRef.current + 1;
      saveSequenceRef.current = sequence;

      const run = () => {
        saveChainRef.current = saveChainRef.current
          .catch(() => undefined)
          .then(() => patchLeadDetails(leadId, snapshot, sequence))
          .catch((error) => {
            console.error("Unable to update lead details:", error);
            setSaveError(
              error.message || "Unable to save application details.",
            );
            if (sequence === saveSequenceRef.current) setSaving(false);
          });
      };

      window.clearTimeout(saveTimerRef.current);
      if (immediate) run();
      else saveTimerRef.current = window.setTimeout(run, 700);
    },
    [leadId, patchLeadDetails],
  );

  const applyDetail = useCallback(
    (nextDetail, immediate = false) => {
      const onboarding = detailsRef.current.applicationOnboarding || {};
      const nextLeadDetails = {
        ...detailsRef.current,
        applicationNumber,
        applicationStatus: nextDetail.status,
        applicationDetail: nextDetail,
        applicationOnboarding: {
          ...onboarding,
          applicationCreated: true,
          applicationNumber,
          stage: nextDetail.status,
          updatedAt: new Date().toISOString(),
        },
      };

      detailsRef.current = nextLeadDetails;
      setApplicationDetail(nextDetail);
      setLead((current) => {
        const nextLead = { ...current, leadDetails: nextLeadDetails };
        leadRef.current = nextLead;
        return nextLead;
      });
      enqueueSave(nextLeadDetails, immediate);
    },
    [applicationNumber, enqueueSave],
  );

  const updateDetail = useCallback(
    (updater, immediate = false) => {
      setActionError("");
      setNotice("");
      const base = clone(applicationDetail);
      const next = updater(base);
      next.updatedAt = new Date().toISOString();
      applyDetail(next, immediate);
    },
    [applicationDetail, applyDetail],
  );

  useEffect(() => {
    let cancelled = false;
    fetchUserAttributes()
      .then((attributes) => {
        if (!cancelled) setLoggedInUserEmail(attributes.email || "");
      })
      .catch((error) => {
        console.error("Unable to retrieve the logged-in Cognito user:", error);
        if (!cancelled) setLoggedInUserEmail("");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchLead = async () => {
      if (!leadId) {
        setLoadError(
          "Lead ID is missing. Open the application from the lead page, or include ?leadId= in the application URL.",
        );
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError("");
      try {
        const response = await fetch(
          `${LEAD_API}/${encodeURIComponent(leadId)}`,
        );
        if (!response.ok)
          throw new Error(`Unable to fetch lead (${response.status})`);
        const payload = await response.json();
        if (!payload.success)
          throw new Error(payload.message || "Lead was not found.");
        if (cancelled) return;

        const record = payload.data || {};
        const details = parseLeadDetails(record.lead_details);
        const relationshipType = firstValue(
          details.relationshipType,
          record.relationship_type,
          record.relationshipType,
          "ETB",
        );
        const nextLead = {
          id: record.leadnumber || leadId,
          firstName: record.first_name,
          middleName: record.middle_name,
          lastName: record.last_name,
          mobile: record.mobile,
          email: record.email,
          product: "Gold Loan",
          source: record.source || "Branch",
          owner: record.owner || "Branch Maker",
          relationshipType,
          cbsCustomerId:
            details.cbsCustomerId ||
            record.cbs_customer_id ||
            record.cbscustomerid,
          customerId: details.customerId || record.customer_id,
          homeBranch: details.homeBranch || record.home_branch,
          kycStatus: details.kycStatus || record.kyc_status,
          leadDetails: details,
        };
        const nextApplicationDetail = buildInitialApplicationDetail(details);
        leadRef.current = nextLead;
        detailsRef.current = details;
        setLead(nextLead);
        setApplicationDetail(nextApplicationDetail);
        if (routeApplicationNumber) {
          sessionStorage.setItem(
            `gold-loan:${routeApplicationNumber}:leadId`,
            nextLead.id,
          );
        }

        if (!details.applicationDetail) {
          const onboarding = details.applicationOnboarding || {};
          const seededDetails = {
            ...details,
            applicationNumber:
              routeApplicationNumber || details.applicationNumber,
            applicationStatus: nextApplicationDetail.status,
            applicationDetail: nextApplicationDetail,
            applicationOnboarding: {
              ...onboarding,
              applicationCreated: true,
              applicationNumber:
                routeApplicationNumber || onboarding.applicationNumber,
              stage: nextApplicationDetail.status,
              updatedAt: new Date().toISOString(),
            },
          };
          detailsRef.current = seededDetails;
          setLead((current) => ({ ...current, leadDetails: seededDetails }));
          enqueueSave(seededDetails, true);
        }
      } catch (error) {
        console.error("Unable to load application:", error);
        if (!cancelled)
          setLoadError(error.message || "Unable to load application.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLead();
    return () => {
      cancelled = true;
      window.clearTimeout(saveTimerRef.current);
    };
  }, [enqueueSave, leadId, routeApplicationNumber]);

  const creation = useMemo(
    () => extractCreationData(lead?.leadDetails || {}),
    [lead?.leadDetails],
  );

  const customerName =
    firstValue(
      creation.identity.borrower?.fullName,
      creation.identity.customer?.name,
      creation.identity.fullName,
      [lead?.firstName, lead?.middleName, lead?.lastName]
        .filter(Boolean)
        .join(" "),
      location.state?.customerName,
    ) || "Gold Loan Customer";
  const branch = applicationDetail?.selectedBranch || {};
  const isAppraisalEditable =
    role === "appraiser" &&
    ["Awaiting Appraisal", "Appraisal In Progress"].includes(
      applicationDetail?.status,
    );
  const canAppraiserRework =
    role === "appraiser" &&
    applicationDetail?.status === "Rework Required" &&
    /appraisal|jewellery/i.test(
      applicationDetail?.checkerReview?.section || "",
    );
  const isMakerEditable =
    role === "maker" &&
    ["Pending Maker Finalisation", "Rework Required"].includes(
      applicationDetail?.status,
    );
  const isCheckerEditable =
    role === "checker" &&
    applicationDetail?.status === "Pending Checker Review";

  const stageState = (index) => {
    const currentStage = applicationDetail?.stage || 1;
    if (applicationDetail?.status === "Rejected" && index === 1)
      return "rejected";
    if (index + 1 < currentStage) return "completed";
    if (index + 1 === currentStage) return "active";
    return "upcoming";
  };

  const updateAppraisalItem = (index, path, value) => {
    updateDetail((next) => {
      const item = next.appraisal.items[index];
      if (path.startsWith("deductions.")) {
        item.deductions[path.split(".")[1]] = toNumber(value);
      } else if (
        ["grossWeight", "purityKarat", "numberOfItems"].includes(path)
      ) {
        item[path] = toNumber(value);
      } else {
        item[path] = value;
      }
      return next;
    });
  };

  const updateMakerField = (path, value) => {
    updateDetail((next) => {
      const parts = path.split(".");
      let target = next.makerFinalisation;
      parts.slice(0, -1).forEach((part) => {
        target = target[part];
      });
      const key = parts[parts.length - 1];
      target[key] = [
        "finalRequestedAmount",
        "recommendedAmount",
        "processingFee",
        "appraiserCharge",
        "gst",
        "otherCharges",
      ].includes(key)
        ? toNumber(value)
        : value;
      if (key === "recommendedAmount") {
        const policy = next.makerFinalisation.chargePolicy;
        const charges = next.makerFinalisation.charges;
        charges.processingFee = Math.round(
          toNumber(value) * toNumber(policy.processingFeeRate),
        );
        charges.gst = Math.round(
          (charges.processingFee +
            toNumber(charges.appraiserCharge) +
            toNumber(charges.otherCharges)) *
            toNumber(policy.gstRate),
        );
      }
      if (key === "otherCharges") {
        const policy = next.makerFinalisation.chargePolicy;
        const charges = next.makerFinalisation.charges;
        charges.gst = Math.round(
          (toNumber(charges.processingFee) +
            toNumber(charges.appraiserCharge) +
            toNumber(charges.otherCharges)) *
            toNumber(policy.gstRate),
        );
      }
      return next;
    });
  };

  const handleStartAppraisal = () => {
    updateDetail((next) => {
      next.status = "Appraisal In Progress";
      next.appraisal.startedAt = new Date().toISOString();
      return addAuditEntry(next, "Appraisal started", actor);
    }, true);
    setNotice("Appraisal started. The application has been saved.");
  };

  const handleSaveDraft = () => {
    updateDetail(
      (next) => addAuditEntry(next, "Appraisal draft saved", actor),
      true,
    );
    setNotice("Appraisal draft saved.");
  };

  const handleCompleteAppraisal = () => {
    const validationError = validateAppraisal(
      applicationDetail.appraisal.items,
    );
    if (validationError) {
      setActionError(validationError);
      return;
    }
    updateDetail((next) => {
      next.appraisal.completedAt = new Date().toISOString();
      next.appraisal.summary = {
        totalItems: next.appraisal.items.reduce(
          (total, item) => total + toNumber(item.numberOfItems),
          0,
        ),
        totalGrossWeight: next.appraisal.items.reduce(
          (total, item) => total + toNumber(item.grossWeight),
          0,
        ),
        totalNetWeight: next.appraisal.items.reduce(
          (total, item) => total + itemNetWeight(item),
          0,
        ),
      };
      next.eligibility = calculateEligibility(next);
      next.makerFinalisation.finalRequestedAmount = Math.min(
        toNumber(next.originalRequestedAmount),
        toNumber(next.eligibility.maximumEligibleAmount),
      );
      if (!next.makerFinalisation.recommendedAmount) {
        next.makerFinalisation.recommendedAmount =
          next.makerFinalisation.finalRequestedAmount;
      }
      const chargePolicy = next.makerFinalisation.chargePolicy;
      const charges = next.makerFinalisation.charges;
      charges.processingFee = Math.round(
        toNumber(next.makerFinalisation.recommendedAmount) *
          toNumber(chargePolicy.processingFeeRate),
      );
      charges.gst = Math.round(
        (charges.processingFee +
          toNumber(charges.appraiserCharge) +
          toNumber(charges.otherCharges)) *
          toNumber(chargePolicy.gstRate),
      );
      next.status = "Pending Maker Finalisation";
      return addAuditEntry(
        next,
        "Appraisal completed and eligibility calculated",
        actor,
      );
    }, true);
    setNotice(
      "Appraisal completed. Eligibility has been calculated for maker review.",
    );
  };

  const handlePhotos = (index, files) => {
    const photographs = Array.from(files).map((file) => ({
      id: makeId("photo"),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));
    updateDetail((next) => {
      next.appraisal.items[index].photographs = [
        ...(next.appraisal.items[index].photographs || []),
        ...photographs,
      ];
      return next;
    });
  };

  const totalCharges = applicationDetail
    ? Object.values(applicationDetail.makerFinalisation.charges).reduce(
        (total, value) => total + toNumber(value),
        0,
      )
    : 0;

  const nomineeIsMinor = (() => {
    const dob = applicationDetail?.makerFinalisation?.nominee?.dateOfBirth;
    if (!dob) return false;
    const age = (Date.now() - new Date(dob).getTime()) / 31557600000;
    return age < 18;
  })();

  const handleSubmitToChecker = () => {
    const finalisation = applicationDetail.makerFinalisation;
    const maximum = toNumber(
      applicationDetail.eligibility.maximumEligibleAmount,
    );
    const recommended = toNumber(finalisation.recommendedAmount);
    const finalRequested = toNumber(finalisation.finalRequestedAmount);
    if (!finalRequested || finalRequested > maximum) {
      setActionError(
        "Final requested amount must be within the maximum eligible amount.",
      );
      return;
    }
    if (!recommended || recommended > finalRequested || recommended > maximum) {
      setActionError(
        "Recommended amount must not exceed the final requested or eligible amount.",
      );
      return;
    }
    if (!finalisation.disbursementAccount) {
      setActionError("Select or confirm the disbursement account.");
      return;
    }
    if (!finalisation.nominee.name || !finalisation.nominee.relationship) {
      setActionError("Enter the nominee name and relationship.");
      return;
    }
    if (nomineeIsMinor && !finalisation.nominee.guardianName) {
      setActionError("Enter guardian details for the minor nominee.");
      return;
    }
    if (
      !finalisation.confirmations.appraisalReviewed ||
      !finalisation.confirmations.detailsConfirmed
    ) {
      setActionError("Complete both maker confirmations before submission.");
      return;
    }
    updateDetail((next) => {
      next.stage = 2;
      next.stageId = "checker-sanction";
      next.status = "Pending Checker Review";
      next.makerFinalisation.submittedAt = new Date().toISOString();
      return addAuditEntry(next, "Submitted to Branch Checker", actor);
    }, true);
    setNotice("Application submitted to the Branch Checker.");
  };

  const handleCheckerDecision = (decision) => {
    const comments = checkerForm.comments.trim();
    if (!comments) {
      setActionError(`Enter checker comments before selecting ${decision}.`);
      return;
    }
    if (decision === "Push Back" && !checkerForm.section) {
      setActionError("Select the section that requires rework.");
      return;
    }
    updateDetail((next) => {
      const decisionRecord = {
        id: makeId("decision"),
        decision,
        section: checkerForm.section,
        comments,
        decidedAt: new Date().toISOString(),
        decidedBy: actor,
      };
      next.checkerReview = {
        ...next.checkerReview,
        ...decisionRecord,
        history: [decisionRecord, ...(next.checkerReview.history || [])],
      };
      if (decision === "Approve") {
        next.stage = 3;
        next.stageId = "documentation-disbursement";
        next.status = "Sanctioned";
        next.documentationDisbursement.status = "Documents Pending Generation";
      } else if (decision === "Push Back") {
        next.stage = 1;
        next.stageId = "appraisal-eligibility";
        next.status = "Rework Required";
      } else {
        next.stage = 2;
        next.stageId = "checker-sanction";
        next.status = "Rejected";
      }
      return addAuditEntry(
        next,
        `Checker decision: ${decision}`,
        actor,
        comments,
      );
    }, true);
    setCheckerForm({ section: "", comments: "" });
    setNotice(
      decision === "Approve"
        ? "Application sanctioned and moved to Documentation & Disbursement."
        : decision === "Push Back"
          ? "Application returned for rework."
          : "Application rejected.",
    );
  };

  const handleBack = () => {
    if (leadId) navigate(`/leads/${leadId}`);
    else navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="application-detail-page ad-centered-state">
        <div className="ad-loader" aria-label="Loading application" />
        <strong>Loading Gold Loan application</strong>
        <span>Retrieving lead details and workflow status…</span>
      </div>
    );
  }

  if (loadError || !applicationDetail) {
    return (
      <div className="application-detail-page ad-centered-state">
        <div className="ad-error-symbol">!</div>
        <strong>Application could not be opened</strong>
        <span>{loadError || "Application data is unavailable."}</span>
        <button type="button" className="ad-btn primary" onClick={handleBack}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="application-detail-page">
      <header className="application-detail-topbar">
        <div className="application-detail-topbar-left">
          <button
            type="button"
            className="application-detail-back"
            onClick={handleBack}
            aria-label="Back to lead"
          >
            <BackIcon />
          </button>
          <img
            className="application-detail-logo"
            src="/images/yes-bank-logo-dark-bg.png"
            alt="YES BANK"
          />
          <span className="application-detail-divider" aria-hidden="true" />
          <div>
            <h1>Gold Loan Application</h1>
            <p>Application detail workspace</p>
          </div>
        </div>
        <div className="ad-topbar-meta">
          <span className="application-detail-product">
            <JewelleryIcon /> Gold Loan
          </span>
          <span className="ad-user-role">
            <UserIcon /> {roleLabel(role)}
          </span>
        </div>
      </header>

      <main className="application-detail-shell">
        <section className="application-detail-hero">
          <div>
            <span className="application-detail-eyebrow">
              GOLD LOAN APPLICATION
            </span>
            <h2>{applicationNumber}</h2>
            <p>
              {customerName} · {applicationDetail.selectedFacility} ·{" "}
              {applicationDetail.selectedScheme}
            </p>
          </div>
          <div className="application-detail-status">
            <span
              className="application-detail-status-dot"
              aria-hidden="true"
            />
            <div>
              <span>CURRENT STATUS</span>
              <strong>{applicationDetail.status}</strong>
            </div>
          </div>
        </section>

        <section
          className="application-detail-summary"
          aria-label="Application summary"
        >
          <div>
            <span>Customer</span>
            <strong>{customerName}</strong>
          </div>
          <div>
            <span>Requested amount</span>
            <strong>
              {formatCurrency(applicationDetail.originalRequestedAmount)}
            </strong>
          </div>
          <div>
            <span>Servicing branch</span>
            <strong>
              {firstValue(
                branch.name,
                branch.branchName,
                lead?.homeBranch,
                "—",
              )}
            </strong>
          </div>
          <div>
            <span>Assigned appraiser</span>
            <strong>{applicationDetail.assignedAppraiser.name}</strong>
          </div>
          <div>
            <span>Relationship</span>
            <strong>{lead?.relationshipType || "—"}</strong>
          </div>
        </section>

        <div className="ad-workspace-strip">
          <div>
            <UserIcon />
            <span>
              <strong>{roleLabel(role)} workspace</strong>
              {loggedInUserEmail || "Cognito email unavailable"}
            </span>
          </div>
          <div className="ad-save-state" aria-live="polite">
            <ClockIcon />
            {saving
              ? "Saving changes…"
              : saveError
                ? "Save failed"
                : lastSavedAt
                  ? `Saved ${lastSavedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                  : "All changes saved"}
          </div>
        </div>

        {role === "viewer" ? (
          <div className="ad-alert warning">
            This email is not mapped to the Maker, Appraiser, or Checker
            persona. The application is available in read-only mode.
          </div>
        ) : null}
        {saveError ? <div className="ad-alert danger">{saveError}</div> : null}
        {actionError ? (
          <div className="ad-alert danger" role="alert">
            {actionError}
          </div>
        ) : null}
        {notice ? (
          <div className="ad-alert success" role="status">
            {notice}
          </div>
        ) : null}

        <section className="ad-journey-card">
          <div className="ad-section-title">
            <span>APPLICATION JOURNEY</span>
            <h3>Three-stage processing flow</h3>
          </div>
          <div className="application-stage-list">
            {STAGES.map((stage, index) => {
              const state = stageState(index);
              return (
                <div className={`application-stage ${state}`} key={stage.id}>
                  <span className="application-stage-number">
                    {state === "completed" ? <CheckIcon /> : index + 1}
                  </span>
                  <div>
                    <strong>{stage.title}</strong>
                    <p>{stage.description}</p>
                  </div>
                  <span className="application-stage-status">
                    {state === "active"
                      ? applicationDetail.status
                      : state === "completed"
                        ? "Completed"
                        : state === "rejected"
                          ? "Rejected"
                          : "Not Started"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="ad-stage-heading">
          <span>STAGE 01</span>
          <div>
            <h2>Appraisal & Eligibility</h2>
            <p>
              Appraiser assessment, system eligibility calculation, and maker
              final recommendation.
            </p>
          </div>
          <StatusPill
            status={
              applicationDetail.stage > 1
                ? "Completed"
                : applicationDetail.status
            }
          />
        </div>

        <CollapsibleCard
          eyebrow="APPLICATION CONTEXT"
          title="Customer, facility & compliance summary"
          description="Read-only information captured during application creation."
          defaultOpen={false}
        >
          <div className="ad-info-grid four">
            <Field label="Customer name" value={customerName} />
            <Field
              label="CBS customer ID"
              value={lead?.cbsCustomerId || lead?.customerId}
            />
            <Field label="Mobile" value={lead?.mobile} />
            <Field
              label="KYC status"
              value={firstValue(
                lead?.kycStatus,
                creation.identity.kycStatus,
                "Verified",
              )}
            />
            <Field
              label="Facility"
              value={applicationDetail.selectedFacility}
            />
            <Field label="Scheme" value={applicationDetail.selectedScheme} />
            <Field
              label="Existing exposure"
              value={formatCurrency(applicationDetail.existingExposure)}
            />
            <Field
              label="Aggregate exposure"
              value={formatCurrency(
                toNumber(applicationDetail.existingExposure) +
                  toNumber(applicationDetail.originalRequestedAmount),
              )}
            />
          </div>
          <div className="ad-compliance-row">
            <div>
              <span>CIBIL / CIC</span>
              <strong>
                {applicationDetail.compliance.cibilRequired
                  ? applicationDetail.compliance.cibilStatus
                  : "Not Required"}
              </strong>
              {applicationDetail.compliance.cibilRequired ? (
                <small>
                  Score {applicationDetail.compliance.cibilScore || "—"} ·
                  Consent {applicationDetail.compliance.consentReference}
                </small>
              ) : (
                <small>Exposure is below the configured threshold.</small>
              )}
              {applicationDetail.compliance.cibilRequired ? (
                <DocumentLink
                  document={applicationDetail.compliance.cibilReport}
                  fallbackLabel="View CIBIL report"
                />
              ) : null}
            </div>
            <div>
              <span>LAND DETAILS</span>
              <strong>
                {applicationDetail.compliance.landDetailsRequired
                  ? "Captured"
                  : "Not Required"}
              </strong>
              <small>
                {applicationDetail.compliance.landDetailsRequired
                  ? [
                      applicationDetail.compliance.landDetails.village,
                      applicationDetail.compliance.landDetails.district,
                      applicationDetail.compliance.landDetails.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Agricultural land details available"
                  : "Not applicable for the selected facility/exposure."}
              </small>
              {applicationDetail.compliance.landDetailsRequired ? (
                <DocumentLink
                  document={
                    applicationDetail.compliance.landDetails.document ||
                    applicationDetail.compliance.landDetails.recordDocument
                  }
                  fallbackLabel="View land record"
                />
              ) : null}
            </div>
          </div>
        </CollapsibleCard>

        <CollapsibleCard
          eyebrow="PHASE A · JEWELLERY APPRAISAL"
          title="Jewellery assessment"
          description="Maker-entered ornament details are read-only. The assigned appraiser records purity, weights, deductions, and photographs."
          actions={
            <StatusPill
              status={
                applicationDetail.appraisal.completedAt
                  ? "Appraisal Completed"
                  : applicationDetail.status === "Appraisal In Progress"
                    ? "In Progress"
                    : "Awaiting Appraisal"
              }
            />
          }
        >
          <div className="ad-assignee-banner">
            <div className="ad-avatar">MK</div>
            <div>
              <span>ASSIGNED APPRAISER</span>
              <strong>{applicationDetail.assignedAppraiser.name}</strong>
              <small>
                {applicationDetail.assignedAppraiser.id} ·{" "}
                {applicationDetail.assignedAppraiser.type} · GST{" "}
                {applicationDetail.assignedAppraiser.gstType}
              </small>
            </div>
            <div className="ad-assignee-time">
              <span>Started</span>
              <strong>
                {formatDateTime(applicationDetail.appraisal.startedAt)}
              </strong>
            </div>
          </div>

          {!applicationDetail.appraisal.items.length ? (
            <div className="ad-empty-panel">
              No jewellery items were found in the application-creation data.
              The maker must add the jewellery being pledged before appraisal
              can be completed.
            </div>
          ) : (
            <div className="ad-ornament-list">
              {applicationDetail.appraisal.items.map((item, index) => {
                const editable = isAppraisalEditable || canAppraiserRework;
                return (
                  <article className="ad-ornament-card" key={item.id}>
                    <div className="ad-ornament-heading">
                      <div>
                        <span className="ad-item-number">
                          {item.serialNumber}
                        </span>
                        <div>
                          <strong>{item.description}</strong>
                          <small>
                            {item.numberOfItems} item(s) · {item.category}
                          </small>
                        </div>
                      </div>
                      <DocumentLink
                        document={item.ownershipProof}
                        fallbackLabel="Ownership proof"
                      />
                    </div>
                    <div className="ad-maker-strip">
                      <span>
                        <b>Ownership declared:</b>{" "}
                        {item.customerDeclaredOwner ? "Yes" : "No"}
                      </span>
                      <span>
                        <b>Maker remarks:</b> {item.makerRemarks || "None"}
                      </span>
                    </div>
                    <div className="ad-appraisal-grid">
                      <Field label="Defect present">
                        <select
                          disabled={!editable}
                          value={item.defectPresent ? "Yes" : "No"}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "defectPresent",
                              event.target.value === "Yes",
                            )
                          }
                        >
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </Field>
                      <Field label="Purity (karat)">
                        <select
                          disabled={!editable}
                          value={item.purityKarat || ""}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "purityKarat",
                              event.target.value,
                            )
                          }
                        >
                          <option value="">Select</option>
                          <option value="18">18K</option>
                          <option value="20">20K</option>
                          <option value="22">22K</option>
                          <option value="24">24K</option>
                        </select>
                      </Field>
                      <Field label="Gross weight (g)">
                        <input
                          disabled={!editable}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.grossWeight || ""}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "grossWeight",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Stone deduction (g)">
                        <input
                          disabled={!editable}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.deductions.stone || ""}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "deductions.stone",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Alloy deduction (g)">
                        <input
                          disabled={!editable}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.deductions.alloy || ""}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "deductions.alloy",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="String / fastening (g)">
                        <input
                          disabled={!editable}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.deductions.stringFastening || ""}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "deductions.stringFastening",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Other deduction (g)">
                        <input
                          disabled={!editable}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.deductions.other || ""}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "deductions.other",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Net weight (g)" className="calculated">
                        <strong>{formatNumber(itemNetWeight(item))}</strong>
                        <small>Calculated automatically</small>
                      </Field>
                    </div>
                    {item.defectPresent ? (
                      <Field label="Defect description">
                        <input
                          disabled={!editable}
                          value={item.defectDescription}
                          onChange={(event) =>
                            updateAppraisalItem(
                              index,
                              "defectDescription",
                              event.target.value,
                            )
                          }
                          placeholder="Describe the observed defect"
                        />
                      </Field>
                    ) : null}
                    <div className="ad-photo-row">
                      <div>
                        <span>JEWELLERY PHOTOGRAPHS</span>
                        <div className="ad-photo-chips">
                          {item.photographs?.length ? (
                            item.photographs.map((photo) => (
                              <span
                                className="ad-document-chip"
                                key={photo.id || photo.name}
                              >
                                <FileIcon /> {photo.name || "Jewellery photo"}
                              </span>
                            ))
                          ) : (
                            <small>No photographs uploaded</small>
                          )}
                        </div>
                      </div>
                      {editable ? (
                        <label className="ad-upload-btn">
                          Upload photographs
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) =>
                              handlePhotos(index, event.target.files)
                            }
                          />
                        </label>
                      ) : null}
                    </div>
                    <Field label="Appraiser remarks">
                      <textarea
                        disabled={!editable}
                        rows="2"
                        value={item.appraiserRemarks}
                        onChange={(event) =>
                          updateAppraisalItem(
                            index,
                            "appraiserRemarks",
                            event.target.value,
                          )
                        }
                        placeholder="Enter appraisal observations"
                      />
                    </Field>
                  </article>
                );
              })}
            </div>
          )}

          {role === "appraiser" &&
          applicationDetail.status === "Awaiting Appraisal" ? (
            <div className="ad-action-bar">
              <span>
                Start the assigned appraisal to enable assessment fields.
              </span>
              <button
                type="button"
                className="ad-btn primary"
                onClick={handleStartAppraisal}
              >
                Start Appraisal
              </button>
            </div>
          ) : null}
          {(isAppraisalEditable &&
            applicationDetail.status === "Appraisal In Progress") ||
          canAppraiserRework ? (
            <div className="ad-action-bar">
              <span>
                Complete all mandatory fields and upload at least one photo per
                ornament.
              </span>
              <div>
                <button
                  type="button"
                  className="ad-btn secondary"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  className="ad-btn primary"
                  onClick={handleCompleteAppraisal}
                >
                  Complete Appraisal
                </button>
              </div>
            </div>
          ) : null}
        </CollapsibleCard>

        <CollapsibleCard
          eyebrow="PHASE B · SYSTEM CALCULATION"
          title="Eligibility calculation"
          description="The lowest of the scheme lending value, LTV value, and available exposure becomes the maximum eligible amount."
          actions={
            <StatusPill
              status={
                applicationDetail.eligibility.calculatedAt
                  ? "Eligibility Calculated"
                  : "Pending Appraisal"
              }
            />
          }
        >
          {!applicationDetail.eligibility.calculatedAt ? (
            <div className="ad-empty-panel">
              Eligibility will be calculated automatically when the appraiser
              completes the jewellery assessment.
            </div>
          ) : (
            <>
              <div className="ad-metric-grid">
                <div>
                  <span>TOTAL NET WEIGHT</span>
                  <strong>
                    {formatNumber(applicationDetail.eligibility.totalNetWeight)}{" "}
                    g
                  </strong>
                  <small>
                    Gross{" "}
                    {formatNumber(
                      applicationDetail.eligibility.totalGrossWeight,
                    )}{" "}
                    g
                  </small>
                </div>
                <div>
                  <span>SCHEME LENDING VALUE</span>
                  <strong>
                    {formatCurrency(applicationDetail.eligibility.lendingValue)}
                  </strong>
                  <small>
                    {formatNumber(applicationDetail.eligibility.totalNetWeight)}{" "}
                    g ×{" "}
                    {formatCurrency(
                      applicationDetail.eligibility.lendingRatePerGram,
                    )}
                  </small>
                </div>
                <div>
                  <span>LTV-BASED VALUE</span>
                  <strong>
                    {formatCurrency(applicationDetail.eligibility.ltvValue)}
                  </strong>
                  <small>
                    {Math.round(
                      applicationDetail.eligibility.applicableLtv * 100,
                    )}
                    % LTV · IBJA{" "}
                    {formatCurrency(
                      applicationDetail.eligibility.ibjaRatePerGram,
                    )}
                    /g
                  </small>
                </div>
                <div>
                  <span>AVAILABLE EXPOSURE LIMIT</span>
                  <strong>
                    {formatCurrency(
                      applicationDetail.eligibility.exposureLimit,
                    )}
                  </strong>
                  <small>After existing exposure</small>
                </div>
              </div>
              <div className="ad-eligibility-result">
                <div>
                  <span>MAXIMUM ELIGIBLE AMOUNT</span>
                  <strong>
                    {formatCurrency(
                      applicationDetail.eligibility.maximumEligibleAmount,
                    )}
                  </strong>
                </div>
                <div>
                  <span>CONTROLLING LIMIT</span>
                  <strong>
                    {applicationDetail.eligibility.controllingLimit}
                  </strong>
                </div>
                <div>
                  <span>CALCULATED ON</span>
                  <strong>
                    {formatDateTime(applicationDetail.eligibility.calculatedAt)}
                  </strong>
                </div>
              </div>
            </>
          )}
        </CollapsibleCard>

        <CollapsibleCard
          eyebrow="PHASE C · MAKER FINALISATION"
          title="Final recommendation & submission"
          description="The Branch Maker confirms the final amount, charges, account, nominee, and readiness for checker review."
          actions={
            <StatusPill
              status={
                applicationDetail.makerFinalisation.submittedAt
                  ? "Submitted"
                  : applicationDetail.status === "Pending Maker Finalisation" ||
                      applicationDetail.status === "Rework Required"
                    ? "Action Required"
                    : "Waiting"
              }
            />
          }
        >
          {applicationDetail.status === "Rework Required" ? (
            <div className="ad-pushback-banner">
              <strong>
                Checker rework requested:{" "}
                {applicationDetail.checkerReview.section}
              </strong>
              <span>{applicationDetail.checkerReview.comments}</span>
            </div>
          ) : null}
          <div className="ad-two-column">
            <div className="ad-subsection">
              <h4>Loan recommendation</h4>
              <div className="ad-info-grid two">
                <Field
                  label="Original requested amount"
                  value={formatCurrency(
                    applicationDetail.originalRequestedAmount,
                  )}
                />
                <Field
                  label="Maximum eligible amount"
                  value={
                    applicationDetail.eligibility.calculatedAt
                      ? formatCurrency(
                          applicationDetail.eligibility.maximumEligibleAmount,
                        )
                      : "Pending appraisal"
                  }
                />
                <Field label="Final requested amount">
                  <input
                    disabled={!isMakerEditable}
                    type="number"
                    min="0"
                    value={
                      applicationDetail.makerFinalisation
                        .finalRequestedAmount || ""
                    }
                    onChange={(event) =>
                      updateMakerField(
                        "finalRequestedAmount",
                        event.target.value,
                      )
                    }
                  />
                </Field>
                <Field label="Recommended amount">
                  <input
                    disabled={!isMakerEditable}
                    type="number"
                    min="0"
                    value={
                      applicationDetail.makerFinalisation.recommendedAmount ||
                      ""
                    }
                    onChange={(event) =>
                      updateMakerField("recommendedAmount", event.target.value)
                    }
                  />
                </Field>
                <Field label="Disbursement account">
                  <input
                    disabled={!isMakerEditable}
                    value={
                      applicationDetail.makerFinalisation.disbursementAccount
                    }
                    onChange={(event) =>
                      updateMakerField(
                        "disbursementAccount",
                        event.target.value,
                      )
                    }
                    placeholder="Enter or select CASA account"
                  />
                </Field>
                <Field label="Charges account">
                  <input
                    disabled={!isMakerEditable}
                    value={applicationDetail.makerFinalisation.chargesAccount}
                    onChange={(event) =>
                      updateMakerField("chargesAccount", event.target.value)
                    }
                    placeholder="CASA account for charge deduction"
                  />
                </Field>
              </div>
              <Field label="Maker comments">
                <textarea
                  disabled={!isMakerEditable}
                  rows="3"
                  value={applicationDetail.makerFinalisation.comments}
                  onChange={(event) =>
                    updateMakerField("comments", event.target.value)
                  }
                  placeholder="Add the basis for the final recommendation"
                />
              </Field>
            </div>
            <div className="ad-subsection">
              <h4>Processing & appraisal charges</h4>
              <div className="ad-charge-list">
                <Field
                  label="Processing fee"
                  hint={`${formatNumber(applicationDetail.makerFinalisation.chargePolicy.processingFeeRate * 100)}% of recommended amount`}
                >
                  <input
                    disabled
                    type="number"
                    min="0"
                    value={
                      applicationDetail.makerFinalisation.charges
                        .processingFee || ""
                    }
                    readOnly
                  />
                </Field>
                <Field
                  label="Appraiser charge"
                  hint="Configured appraisal charge"
                >
                  <input
                    disabled
                    type="number"
                    min="0"
                    value={
                      applicationDetail.makerFinalisation.charges
                        .appraiserCharge || ""
                    }
                    readOnly
                  />
                </Field>
                <Field
                  label="GST"
                  hint={`${formatNumber(applicationDetail.makerFinalisation.chargePolicy.gstRate * 100)}% of applicable charges`}
                >
                  <input
                    disabled
                    type="number"
                    min="0"
                    value={
                      applicationDetail.makerFinalisation.charges.gst || ""
                    }
                    readOnly
                  />
                </Field>
                <Field label="Other charges">
                  <input
                    disabled={!isMakerEditable}
                    type="number"
                    min="0"
                    value={
                      applicationDetail.makerFinalisation.charges
                        .otherCharges || ""
                    }
                    onChange={(event) =>
                      updateMakerField(
                        "charges.otherCharges",
                        event.target.value,
                      )
                    }
                  />
                </Field>
              </div>
              <div className="ad-total-row">
                <span>Total charges</span>
                <strong>{formatCurrency(totalCharges)}</strong>
              </div>
            </div>
          </div>
          <div className="ad-subsection nominee">
            <div className="ad-subsection-title">
              <h4>Nominee details</h4>
              {isMakerEditable ? (
                <label className="ad-check">
                  <input
                    type="checkbox"
                    checked={
                      applicationDetail.makerFinalisation.nominee
                        .useSavingsNominee
                    }
                    onChange={(event) =>
                      updateMakerField(
                        "nominee.useSavingsNominee",
                        event.target.checked,
                      )
                    }
                  />{" "}
                  Use nominee from Savings Account
                </label>
              ) : null}
            </div>
            <div className="ad-info-grid four">
              <Field label="Nominee name">
                <input
                  disabled={!isMakerEditable}
                  value={applicationDetail.makerFinalisation.nominee.name}
                  onChange={(event) =>
                    updateMakerField("nominee.name", event.target.value)
                  }
                />
              </Field>
              <Field label="Relationship">
                <select
                  disabled={!isMakerEditable}
                  value={
                    applicationDetail.makerFinalisation.nominee.relationship
                  }
                  onChange={(event) =>
                    updateMakerField("nominee.relationship", event.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Spouse</option>
                  <option>Parent</option>
                  <option>Child</option>
                  <option>Sibling</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Date of birth">
                <input
                  disabled={!isMakerEditable}
                  type="date"
                  value={
                    applicationDetail.makerFinalisation.nominee.dateOfBirth
                  }
                  onChange={(event) =>
                    updateMakerField("nominee.dateOfBirth", event.target.value)
                  }
                />
              </Field>
              <Field
                label="Nominee status"
                value={
                  applicationDetail.makerFinalisation.nominee.dateOfBirth
                    ? nomineeIsMinor
                      ? "Minor"
                      : "Adult"
                    : "—"
                }
              />
              <Field label="Address" className="span-two">
                <input
                  disabled={!isMakerEditable}
                  value={applicationDetail.makerFinalisation.nominee.address}
                  onChange={(event) =>
                    updateMakerField("nominee.address", event.target.value)
                  }
                />
              </Field>
              {nomineeIsMinor ? (
                <>
                  <Field label="Guardian name">
                    <input
                      disabled={!isMakerEditable}
                      value={
                        applicationDetail.makerFinalisation.nominee.guardianName
                      }
                      onChange={(event) =>
                        updateMakerField(
                          "nominee.guardianName",
                          event.target.value,
                        )
                      }
                    />
                  </Field>
                  <Field label="Guardian relationship">
                    <input
                      disabled={!isMakerEditable}
                      value={
                        applicationDetail.makerFinalisation.nominee
                          .guardianRelationship
                      }
                      onChange={(event) =>
                        updateMakerField(
                          "nominee.guardianRelationship",
                          event.target.value,
                        )
                      }
                    />
                  </Field>
                </>
              ) : null}
            </div>
          </div>
          {isMakerEditable ? (
            <div className="ad-confirmation-panel">
              <label className="ad-check">
                <input
                  type="checkbox"
                  checked={
                    applicationDetail.makerFinalisation.confirmations
                      .appraisalReviewed
                  }
                  onChange={(event) =>
                    updateMakerField(
                      "confirmations.appraisalReviewed",
                      event.target.checked,
                    )
                  }
                />{" "}
                I have reviewed the jewellery appraisal and eligibility
                calculation.
              </label>
              <label className="ad-check">
                <input
                  type="checkbox"
                  checked={
                    applicationDetail.makerFinalisation.confirmations
                      .detailsConfirmed
                  }
                  onChange={(event) =>
                    updateMakerField(
                      "confirmations.detailsConfirmed",
                      event.target.checked,
                    )
                  }
                />{" "}
                I confirm the recommendation, account, charges, nominee, and
                compliance details.
              </label>
            </div>
          ) : null}
          {isMakerEditable ? (
            <div className="ad-action-bar">
              <span>
                This action locks the maker recommendation and routes the
                application to the Branch Checker.
              </span>
              <button
                type="button"
                className="ad-btn primary"
                onClick={handleSubmitToChecker}
              >
                {applicationDetail.status === "Rework Required"
                  ? "Resubmit to Checker"
                  : "Submit to Branch Checker"}
              </button>
            </div>
          ) : null}
        </CollapsibleCard>

        <div className="ad-stage-heading">
          <span>STAGE 02</span>
          <div>
            <h2>Checker Sanction</h2>
            <p>
              Independent review of customer, appraisal, eligibility,
              compliance, and maker recommendation.
            </p>
          </div>
          <StatusPill
            status={
              applicationDetail.stage > 2
                ? "Completed"
                : applicationDetail.stage === 2
                  ? applicationDetail.status
                  : "Not Started"
            }
          />
        </div>

        <CollapsibleCard
          eyebrow="CHECKER WORKSPACE"
          title="Sanction review & decision"
          description="All application information is read-only for the checker; the decision and audit trail are persisted to the lead."
          defaultOpen={applicationDetail.stage >= 2}
        >
          <div className="ad-review-grid">
            <div>
              <span>CUSTOMER & FACILITY</span>
              <strong>{customerName}</strong>
              <small>
                {applicationDetail.selectedFacility} ·{" "}
                {applicationDetail.selectedScheme}
              </small>
            </div>
            <div>
              <span>APPRAISAL</span>
              <strong>
                {formatNumber(
                  applicationDetail.eligibility.totalNetWeight || 0,
                )}{" "}
                g net weight
              </strong>
              <small>
                {applicationDetail.appraisal.items.length} jewellery line
                item(s)
              </small>
            </div>
            <div>
              <span>ELIGIBILITY</span>
              <strong>
                {applicationDetail.eligibility.calculatedAt
                  ? formatCurrency(
                      applicationDetail.eligibility.maximumEligibleAmount,
                    )
                  : "Pending"}
              </strong>
              <small>
                {applicationDetail.eligibility.controllingLimit ||
                  "Eligibility not calculated"}
              </small>
            </div>
            <div>
              <span>MAKER RECOMMENDATION</span>
              <strong>
                {formatCurrency(
                  applicationDetail.makerFinalisation.recommendedAmount,
                )}
              </strong>
              <small>
                Submitted{" "}
                {formatDateTime(
                  applicationDetail.makerFinalisation.submittedAt,
                )}
              </small>
            </div>
            <div>
              <span>COMPLIANCE</span>
              <strong>
                {applicationDetail.compliance.cibilRequired
                  ? `CIBIL ${applicationDetail.compliance.cibilScore || "available"}`
                  : "CIBIL not required"}
              </strong>
              <small>
                {applicationDetail.compliance.landDetailsRequired
                  ? "Land details captured"
                  : "Land details not required"}
              </small>
            </div>
            <div>
              <span>CHARGES</span>
              <strong>{formatCurrency(totalCharges)}</strong>
              <small>
                Account{" "}
                {applicationDetail.makerFinalisation.chargesAccount || "—"}
              </small>
            </div>
          </div>

          {applicationDetail.checkerReview.decision ? (
            <div
              className={`ad-decision-summary ${applicationDetail.checkerReview.decision.toLowerCase().replace(" ", "-")}`}
            >
              <div>
                <span>LATEST CHECKER DECISION</span>
                <strong>{applicationDetail.checkerReview.decision}</strong>
              </div>
              <div>
                <span>SECTION</span>
                <strong>
                  {applicationDetail.checkerReview.section ||
                    "Full application"}
                </strong>
              </div>
              <div>
                <span>DECIDED BY</span>
                <strong>{applicationDetail.checkerReview.decidedBy}</strong>
              </div>
              <p>{applicationDetail.checkerReview.comments}</p>
            </div>
          ) : null}

          {isCheckerEditable ? (
            <div className="ad-checker-panel">
              <div className="ad-info-grid two">
                <Field label="Section for pushback">
                  <select
                    value={checkerForm.section}
                    onChange={(event) =>
                      setCheckerForm((current) => ({
                        ...current,
                        section: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select when pushing back</option>
                    <option>Jewellery Appraisal</option>
                    <option>Eligibility Calculation</option>
                    <option>Loan Recommendation</option>
                    <option>Charges & Account</option>
                    <option>Nominee Details</option>
                    <option>Compliance Documents</option>
                  </select>
                </Field>
                <Field label="Checker comments">
                  <textarea
                    rows="3"
                    value={checkerForm.comments}
                    onChange={(event) =>
                      setCheckerForm((current) => ({
                        ...current,
                        comments: event.target.value,
                      }))
                    }
                    placeholder="Enter the reason and decision observations"
                  />
                </Field>
              </div>
              <div className="ad-decision-actions">
                <button
                  type="button"
                  className="ad-btn danger"
                  onClick={() => handleCheckerDecision("Reject")}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="ad-btn warning"
                  onClick={() => handleCheckerDecision("Push Back")}
                >
                  Push Back
                </button>
                <button
                  type="button"
                  className="ad-btn success"
                  onClick={() => handleCheckerDecision("Approve")}
                >
                  <CheckIcon /> Approve & Sanction
                </button>
              </div>
            </div>
          ) : applicationDetail.stage < 2 ? (
            <div className="ad-empty-panel">
              Checker actions will become available after the Branch Maker
              submits the final recommendation.
            </div>
          ) : null}

          {applicationDetail.checkerReview.history.length ? (
            <div className="ad-history">
              <h4>Decision history</h4>
              {applicationDetail.checkerReview.history.map((entry) => (
                <div key={entry.id}>
                  <span className="ad-history-dot" />
                  <div>
                    <strong>
                      {entry.decision} · {entry.section || "Full application"}
                    </strong>
                    <small>{entry.comments}</small>
                    <time>
                      {entry.decidedBy} · {formatDateTime(entry.decidedAt)}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CollapsibleCard>

        <div className="ad-stage-heading muted">
          <span>STAGE 03</span>
          <div>
            <h2>Documentation & Disbursement</h2>
            <p>
              Loan documentation, execution, charge deduction, CBS account
              creation, and disbursement.
            </p>
          </div>
          <StatusPill
            status={
              applicationDetail.stage === 3
                ? applicationDetail.documentationDisbursement.status
                : "Not Started"
            }
          />
        </div>
        <section className="ad-card ad-stage-three-placeholder">
          <div className="ad-placeholder-icon">
            <FileIcon />
          </div>
          <div>
            <span>NEXT WORKFLOW</span>
            <h3>
              {applicationDetail.stage === 3
                ? "Application sanctioned"
                : "Available after checker sanction"}
            </h3>
            <p>
              Stage 3 will contain document generation, NeSL or manual
              execution, final verification, and loan disbursement. Its detailed
              workflow will be added next.
            </p>
          </div>
        </section>

        <CollapsibleCard
          eyebrow="AUDIT & ACTIVITY"
          title="Application timeline"
          description="Latest application events recorded in leadDetails.applicationDetail.auditTrail."
          defaultOpen={false}
        >
          {applicationDetail.auditTrail.length ? (
            <div className="ad-history timeline">
              {applicationDetail.auditTrail.map((entry) => (
                <div key={entry.id}>
                  <span className="ad-history-dot" />
                  <div>
                    <strong>{entry.action}</strong>
                    {entry.note ? <small>{entry.note}</small> : null}
                    <time>
                      {entry.actor} · {formatDateTime(entry.at)}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ad-empty-panel">
              No application-detail actions have been recorded yet.
            </div>
          )}
        </CollapsibleCard>
      </main>
    </div>
  );
}

export default ApplicationDetailPage;