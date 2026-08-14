import { useMemo } from "react";
import "./ApplicationSummaryTab.css";

const parseLeadDetails = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Unable to parse lead details for Summary:", error);
    return {};
  }
};

const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

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
  const normalized =
    typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  const normalized = String(value || "").trim().toLowerCase();
  if (["true", "yes", "required", "y"].includes(normalized)) return true;
  if (["false", "no", "not required", "n"].includes(normalized)) return false;
  return null;
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

const formatCompactCurrency = (value) => {
  const amount = toNumber(value);
  if (amount === null) return "—";
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  }
  return formatCurrency(amount);
};

const formatWeight = (value) => {
  const weight = toNumber(value);
  if (weight === null) return "—";
  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(weight)} g`;
};

const formatRate = (value, suffix = "") => {
  const rate = toNumber(value);
  if (rate === null) return "—";
  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(rate)}${suffix}`;
};

const textValue = (value, fallback = "Pending") => {
  if (!hasValue(value)) return fallback;
  if (typeof value === "boolean") return value ? "Completed" : "Pending";
  if (typeof value === "object") {
    return String(
      value.name ||
        value.label ||
        value.status ||
        value.value ||
        fallback,
    );
  }
  return String(value);
};

const normalizePersona = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("appraiser") || normalized.includes("jeweller")) {
    return "Appraiser";
  }
  if (normalized.includes("checker")) return "Checker";
  if (normalized.includes("maker")) return "Maker";
  return "Viewer";
};

const normalizeStatus = (value) =>
  String(value || "Pending").trim() || "Pending";

const statusTone = (value) => {
  const status = normalizeStatus(value).toLowerCase();
  if (
    [
      "complete",
      "completed",
      "verified",
      "eligible",
      "approved",
      "sanctioned",
      "signed",
      "generated",
      "disbursed",
      "loan active",
      "within limit",
      "passed",
      "not required",
      "configured",
      "selected",
      "assigned",
      "captured",
    ].some((word) => status.includes(word))
  ) {
    return "success";
  }

  if (
    [
      "blocked",
      "failed",
      "rejected",
      "expired",
      "exceeded",
      "below",
      "missing",
      "overdue",
    ].some((word) => status.includes(word))
  ) {
    return "danger";
  }

  if (
    ["in progress", "awaiting", "required", "pending", "rework", "pushback"].some(
      (word) => status.includes(word),
    )
  ) {
    return "warning";
  }

  return "neutral";
};

const isCompleted = (value) => statusTone(value) === "success";
const isFailed = (value) => statusTone(value) === "danger";

const completionStatus = (value, successLabel = "Configured") => {
  const text = textValue(value, "Pending");
  return text.toLowerCase().includes("pending") ? "Pending" : successLabel;
};

const formatPerGram = (value) =>
  toNumber(value) === null ? "—" : `${formatCurrency(value)}/g`;

const sumItems = (items, getter) => {
  let hasAny = false;
  const total = items.reduce((sum, item) => {
    const value = toNumber(getter(item));
    if (value === null) return sum;
    hasAny = true;
    return sum + value;
  }, 0);
  return hasAny ? total : null;
};

const getItemValue = (item, paths) => selectValue(item, paths);

const StatusBadge = ({ value }) => {
  const status = normalizeStatus(value);
  return <span className={`summary-status is-${statusTone(status)}`}>{status}</span>;
};

const SummaryIcon = ({ type }) => {
  const paths = {
    request: <path d="M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4" />,
    exposure: <path d="M4 19h16M6 16V8m4 8V5m4 11v-6m4 6V3" />,
    eligible: <path d="m5 12 4 4L19 6M4 21h16" />,
    required: <path d="M12 3v18m5-14.5c0-1.4-2.2-2.5-5-2.5S7 5.1 7 6.5 9.2 9 12 9s5 1.1 5 2.5S14.8 14 12 14s-5 1.1-5 2.5S9.2 19 12 19s5-1.1 5-2.5" />,
    recommendation: <path d="M5 20V4h10l4 4v12zM9 12h6M9 16h4M14 4v5h5" />,
    weight: <path d="M7 9h10l3 12H4zM9 9a3 3 0 0 1 6 0" />,
    charge: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h4" />,
    customer: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
    jewellery: <path d="m3 9 4-5h10l4 5-9 12zm0 0h18M7 4l5 5 5-5M12 9v12" />,
    shield: <path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6zM9 12l2 2 4-5" />,
    branch: <path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3l9 5H3z" />,
    alert: <path d="M12 3 2 21h20zM12 9v5m0 3h.01" />,
    info: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v6m0-10h.01" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[type] || paths.info}
    </svg>
  );
};

const getPersonaFocus = (persona, applicationDetail) => {
  const normalizedPersona = normalizePersona(persona);
  const stage = String(applicationDetail?.stage || "").toLowerCase();
  const status = String(applicationDetail?.status || "").toLowerCase();
  const documentationStage =
    stage.includes("document") ||
    status.includes("documentation") ||
    status.includes("disburs") ||
    status.includes("sanctioned");

  if (normalizedPersona === "Appraiser") {
    return {
      section: "jewellery",
      eyebrow: "APPRAISER VIEW",
      title: "Jewellery appraisal is your current focus",
      description:
        "Review offered items, photographs, quality, gross weight, deductions and net eligible weight. Complete the appraisal in Application Details.",
    };
  }

  if (normalizedPersona === "Maker" && documentationStage) {
    return {
      section: "snapshot",
      eyebrow: "MAKER VIEW",
      title: "Document execution is your current focus",
      description:
        "Review sanction readiness and complete document generation and customer execution in Documentation & Disbursement.",
    };
  }

  if (normalizedPersona === "Maker") {
    return {
      section: "eligibility",
      eyebrow: "MAKER VIEW",
      title: "Eligibility and recommendation are your current focus",
      description:
        "Review the controlling eligibility limit, charges, required amount and recommendation before submitting to the Checker.",
    };
  }

  if (normalizedPersona === "Checker" && documentationStage) {
    return {
      section: "snapshot",
      eyebrow: "CHECKER VIEW",
      title: "Pre-disbursement readiness is your current focus",
      description:
        "Confirm execution, charge deduction, account readiness and unresolved exceptions before initiating the CBS transaction.",
    };
  }

  if (normalizedPersona === "Checker") {
    return {
      section: "exceptions",
      eyebrow: "CHECKER VIEW",
      title: "Sanction review is your current focus",
      description:
        "Review eligibility, compliance, recommendation and every active exception before recording the sanction decision.",
    };
  }

  return {
    section: "overview",
    eyebrow: "READ-ONLY VIEW",
    title: "Complete application overview",
    description:
      "No workflow action is assigned to this user. All available application information remains visible for review.",
  };
};

export default function ApplicationSummaryTab({
  lead,
  persona = "Viewer",
}) {
  const leadDetails = useMemo(
    () => parseLeadDetails(lead?.leadDetails ?? lead?.lead_details),
    [lead?.leadDetails, lead?.lead_details],
  );

  const view = useMemo(() => {
    const applicationDetail = leadDetails.applicationDetail || {};
    const itemsValue = selectValue(leadDetails, [
      "applicationDetail.appraisal.items",
      "applicationDetail.jewelleryAppraisal.items",
      "applicationDetail.details.jewelleryAppraisal.items",
      "applicationDetail.details.jewellery.items",
      "jewelleryDetails.items",
      "jewelleryDetails.jewelleryItems",
    ], []);
    const items = Array.isArray(itemsValue) ? itemsValue : [];

    const itemStatus = (item) =>
      getItemValue(item, [
        "appraisalStatus",
        "status",
        "assessment.status",
        "appraiserAssessment.status",
      ]);
    const completedItems = items.filter((item) => isCompleted(itemStatus(item))).length;

    const totalGrossWeight = sumItems(items, (item) =>
      getItemValue(item, [
        "grossWeight",
        "grossWeightGrams",
        "assessment.grossWeight",
        "appraiserAssessment.grossWeight",
      ]),
    );
    const totalDeductions = sumItems(items, (item) =>
      getItemValue(item, [
        "totalDeductions",
        "deductions.total",
        "assessment.totalDeductions",
        "appraiserAssessment.totalDeductions",
      ]),
    );
    const calculatedNetWeight = sumItems(items, (item) =>
      getItemValue(item, [
        "netWeight",
        "netWeightGrams",
        "assessment.netWeight",
        "appraiserAssessment.netWeight",
      ]),
    );

    const originalRequestedAmount = selectValue(leadDetails, [
      "applicationDetail.requestedAmount",
      "applicationDetail.summary.originalRequestedAmount",
      "applicationDetail.details.loanBranch.originalRequestedAmount",
      "applicationDetail.details.loanBranch.requestedAmount",
      "facilityBranchLoanDetails.requestedLoanAmount",
      "facilityBranchLoanDetails.loan.requestedAmount",
      "facilityBranchLoanDetails.requestedAmount",
    ]);
    const existingExposure = selectValue(leadDetails, [
      "applicationDetail.eligibility.existingGoldLoanExposure",
      "applicationDetail.summary.existingGoldLoanExposure",
      "applicationDetail.details.loanBranch.existingGoldLoanExposure",
      "facilityBranchLoanDetails.exposure.existingGoldLoanExposure",
      "facilityBranchLoanDetails.exposure.existingExposure",
      "facilityBranchLoanDetails.existingGoldLoanExposure",
    ]);
    const aggregateExposure = selectValue(leadDetails, [
      "applicationDetail.eligibility.aggregateGoldLoanExposure",
      "applicationDetail.summary.aggregateGoldLoanExposure",
      "applicationDetail.details.loanBranch.aggregateGoldLoanExposure",
      "facilityBranchLoanDetails.exposure.aggregateGoldLoanExposure",
      "facilityBranchLoanDetails.exposure.aggregateExposure",
    ]);
    const maximumEligibleAmount = selectValue(leadDetails, [
      "applicationDetail.eligibility.maximumEligibleAmount",
      "applicationDetail.summary.maximumEligibleAmount",
      "applicationDetail.details.eligibilityRecommendation.maximumEligibleAmount",
      "applicationDetail.makerFinalisation.maximumEligibleAmount",
      "eligibilitySupportingDetails.eligibility.maximumEligibleAmount",
      "eligibilitySupportingDetails.maximumEligibleAmount",
    ]);
    const requiredAmount = selectValue(leadDetails, [
      "applicationDetail.makerFinalisation.requiredAmount",
      "applicationDetail.eligibility.requiredAmount",
      "applicationDetail.summary.requiredLoanAmount",
      "applicationDetail.details.eligibilityRecommendation.requiredLoanAmount",
      "eligibilitySupportingDetails.requiredLoanAmount",
    ]);
    const recommendedAmount = selectValue(leadDetails, [
      "applicationDetail.makerFinalisation.recommendedAmount",
      "applicationDetail.eligibility.recommendedAmount",
      "applicationDetail.summary.recommendedAmount",
      "applicationDetail.details.eligibilityRecommendation.recommendedAmount",
      "eligibilitySupportingDetails.recommendedAmount",
    ]);
    const totalNetWeight = selectValue(leadDetails, [
      "applicationDetail.eligibility.totalNetWeight",
      "applicationDetail.appraisal.totalNetWeight",
      "applicationDetail.summary.totalNetWeight",
      "applicationDetail.details.jewelleryAppraisal.totalNetWeight",
      "eligibilitySupportingDetails.eligibility.totalNetWeight",
    ], calculatedNetWeight);
    const processingCharge = selectValue(leadDetails, [
      "applicationDetail.charges.processingCharge",
      "applicationDetail.makerFinalisation.charges.processingCharge",
      "applicationDetail.details.eligibilityRecommendation.charges.processingCharge",
      "eligibilitySupportingDetails.charges.processingCharge",
    ]);
    const appraiserCharge = selectValue(leadDetails, [
      "applicationDetail.charges.appraiserCharge",
      "applicationDetail.makerFinalisation.charges.appraiserCharge",
      "applicationDetail.details.eligibilityRecommendation.charges.appraiserCharge",
      "eligibilitySupportingDetails.charges.appraiserCharge",
    ]);
    const gst = selectValue(leadDetails, [
      "applicationDetail.charges.gst",
      "applicationDetail.makerFinalisation.charges.gst",
      "applicationDetail.details.eligibilityRecommendation.charges.gst",
      "eligibilitySupportingDetails.charges.gst",
    ]);
    const totalCharges = selectValue(leadDetails, [
      "applicationDetail.charges.totalCharges",
      "applicationDetail.makerFinalisation.charges.totalCharges",
      "applicationDetail.summary.totalCharges",
      "applicationDetail.details.eligibilityRecommendation.charges.totalCharges",
      "eligibilitySupportingDetails.charges.totalCharges",
    ]);

    const schemeLendingValue = selectValue(leadDetails, [
      "applicationDetail.eligibility.schemeLendingValue",
      "applicationDetail.details.eligibilityRecommendation.schemeLendingValue",
      "eligibilitySupportingDetails.eligibility.schemeLendingValue",
    ]);
    const availableExposureLimit = selectValue(leadDetails, [
      "applicationDetail.eligibility.availableExposureLimit",
      "applicationDetail.details.eligibilityRecommendation.availableExposureLimit",
      "eligibilitySupportingDetails.eligibility.availableExposureLimit",
    ]);
    const ltvBasedValue = selectValue(leadDetails, [
      "applicationDetail.eligibility.ltvBasedValue",
      "applicationDetail.details.eligibilityRecommendation.ltvBasedValue",
      "eligibilitySupportingDetails.eligibility.ltvBasedValue",
    ]);
    const controllingLimit = selectValue(leadDetails, [
      "applicationDetail.eligibility.controllingLimit",
      "applicationDetail.details.eligibilityRecommendation.controllingLimit",
      "eligibilitySupportingDetails.eligibility.controllingLimit",
    ], "Pending calculation");
    const ibjaRate = selectValue(leadDetails, [
      "applicationDetail.eligibility.ibjaGoldRate",
      "applicationDetail.eligibility.ibjaRate",
      "applicationDetail.details.eligibilityRecommendation.ibjaGoldRate",
      "eligibilitySupportingDetails.eligibility.ibjaGoldRate",
    ]);
    const schemeRate = selectValue(leadDetails, [
      "applicationDetail.eligibility.schemeLendingRatePerGram",
      "applicationDetail.eligibility.lendingRatePerGram",
      "applicationDetail.details.eligibilityRecommendation.schemeLendingRatePerGram",
      "eligibilitySupportingDetails.eligibility.schemeLendingRatePerGram",
    ]);
    const applicableLtv = selectValue(leadDetails, [
      "applicationDetail.eligibility.applicableLtv",
      "applicationDetail.details.eligibilityRecommendation.applicableLtv",
      "eligibilitySupportingDetails.eligibility.applicableLtv",
    ]);

    const applicationStatusText = String(applicationDetail.status || "");
    const inferredAppraisalStatus =
      /maker|checker|sanction|document|disburs|loan active/i.test(
        applicationStatusText,
      )
        ? "Completed"
        : applicationStatusText || "Awaiting Appraisal";
    const appraisalStatus = selectValue(leadDetails, [
      "applicationDetail.appraisal.status",
      "applicationDetail.jewelleryAppraisal.status",
      "applicationDetail.details.jewelleryAppraisal.status",
      "applicationDetail.checklist.jewelleryAppraisal.status",
      "applicationDetail.checklist.jewelleryAppraisal",
    ], inferredAppraisalStatus);
    const weightPolicyStatus = selectValue(leadDetails, [
      "applicationDetail.appraisal.weightPolicyStatus",
      "applicationDetail.jewelleryAppraisal.weightPolicyStatus",
      "applicationDetail.details.jewelleryAppraisal.weightPolicyStatus",
    ], "Pending appraisal");
    const photographsComplete =
      items.length > 0 &&
      items.every((item) => {
        const photos = getItemValue(item, [
          "photographs",
          "photos",
          "assessment.photographs",
          "appraiserAssessment.photographs",
        ]);
        return Array.isArray(photos) ? photos.length > 0 : Boolean(photos);
      });

    const cibilRequiredRaw = selectValue(leadDetails, [
      "applicationDetail.compliance.cibilRequired",
      "applicationDetail.details.compliance.cibilRequired",
      "eligibilitySupportingDetails.cibilRequired",
      "facilityBranchLoanDetails.exposure.cibilRequired",
    ]);
    const cibilRequired = toBoolean(cibilRequiredRaw);
    const cibilStatus = selectValue(leadDetails, [
      "applicationDetail.compliance.cibilStatus",
      "applicationDetail.compliance.cibil.status",
      "applicationDetail.details.compliance.cibil.status",
      "eligibilitySupportingDetails.cibil.status",
      "eligibilitySupportingDetails.cibilStatus",
    ], cibilRequired === false ? "Not required" : "Pending");
    const cibilScore = selectValue(leadDetails, [
      "applicationDetail.compliance.cibilScore",
      "applicationDetail.compliance.cibil.score",
      "applicationDetail.details.compliance.cibil.score",
      "eligibilitySupportingDetails.cibil.score",
      "eligibilitySupportingDetails.cibilScore",
    ]);
    const minimumCibilScore = selectValue(leadDetails, [
      "applicationDetail.compliance.minimumCibilScore",
      "applicationDetail.compliance.cibil.minimumScore",
      "applicationDetail.details.compliance.cibil.minimumScore",
      "eligibilitySupportingDetails.cibil.minimumScore",
    ]);

    const landRequiredRaw = selectValue(leadDetails, [
      "applicationDetail.compliance.landDetailsRequired",
      "applicationDetail.details.compliance.landDetailsRequired",
      "eligibilitySupportingDetails.landDetailsRequired",
      "facilityBranchLoanDetails.exposure.landDetailsRequired",
    ]);
    const landRequired = toBoolean(landRequiredRaw);
    const landStatus = selectValue(leadDetails, [
      "applicationDetail.compliance.landStatus",
      "applicationDetail.compliance.landDetails.status",
      "applicationDetail.details.compliance.landDetails.status",
      "eligibilitySupportingDetails.landDetails.status",
      "eligibilitySupportingDetails.landStatus",
    ], landRequired === false ? "Not required" : "Pending");

    const kycStatus = selectValue(leadDetails, [
      "applicationDetail.details.customerKyc.kycStatus",
      "customerIdentity.kycStatus",
      "customerIdentity.borrowerInformation.kycStatus",
      "kycStatus",
    ], lead?.kycStatus || "Pending");
    const consentStatus = selectValue(leadDetails, [
      "applicationDetail.details.customerKyc.consentStatus",
      "customerIdentity.consent.status",
      "customerIdentity.customerConsent.status",
      "customerIdentity.consentStatus",
    ], "Pending");
    const facility = selectValue(leadDetails, [
      "applicationDetail.facility",
      "applicationDetail.details.loanBranch.facility",
      "facilityBranchLoanDetails.facilityType",
      "facilityBranchLoanDetails.facility",
    ], lead?.product || "Gold Loan");
    const scheme = selectValue(leadDetails, [
      "applicationDetail.scheme",
      "applicationDetail.details.loanBranch.scheme",
      "facilityBranchLoanDetails.scheme.name",
      "facilityBranchLoanDetails.scheme",
      "facilityBranchLoanDetails.schemeName",
    ], "Pending selection");
    const branch = selectValue(leadDetails, [
      "applicationDetail.branch.name",
      "applicationDetail.details.loanBranch.branch.name",
      "facilityBranchLoanDetails.branch.branchName",
      "facilityBranchLoanDetails.branch.name",
      "facilityBranchLoanDetails.selectedBranch.branchName",
      "homeBranch.branchName",
      "homeBranch.name",
    ], lead?.homeBranch?.branchName || lead?.homeBranch?.name || "Pending");
    const assignedAppraiser = selectValue(leadDetails, [
      "applicationDetail.assignment.appraiser.name",
      "applicationDetail.assignment.appraiserName",
      "applicationDetail.appraisal.appraiser.name",
      "applicationDetail.appraisal.appraiserName",
    ], "Pending assignment");
    const assignedChecker = selectValue(leadDetails, [
      "applicationDetail.assignment.checker.name",
      "applicationDetail.assignment.checkerName",
      "applicationDetail.checkerDecision.checker.name",
      "applicationDetail.checkerDecision.checkerName",
    ], "Pending assignment");
    const nomineeStatus = selectValue(leadDetails, [
      "applicationDetail.makerFinalisation.nominee.status",
      "applicationDetail.details.eligibilityRecommendation.nominee.status",
      "eligibilitySupportingDetails.nominee.status",
      "eligibilitySupportingDetails.nomineeStatus",
    ], "Pending");
    const makerStatus = selectValue(leadDetails, [
      "applicationDetail.makerFinalisation.status",
      "applicationDetail.details.eligibilityRecommendation.status",
      "applicationDetail.checklist.makerRecommendation.status",
      "applicationDetail.checklist.makerRecommendation",
    ], "Pending");
    const checkerStatus = selectValue(leadDetails, [
      "applicationDetail.checkerDecision.status",
      "applicationDetail.details.checkerDecision.status",
      "applicationDetail.checklist.checkerSanction.status",
      "applicationDetail.checklist.checkerSanction",
    ], "Pending");
    const documentExecutionStatus = selectValue(leadDetails, [
      "applicationDetail.documentationDisbursement.execution.status",
      "applicationDetail.documentationDisbursement.documentExecutionStatus",
      "applicationDetail.checklist.documentExecution.status",
      "applicationDetail.checklist.documentExecution",
    ], "Pending sanction");
    const disbursementStatus = selectValue(leadDetails, [
      "applicationDetail.documentationDisbursement.disbursement.status",
      "applicationDetail.documentationDisbursement.disbursementStatus",
      "applicationDetail.checklist.disbursement.status",
      "applicationDetail.checklist.disbursement",
    ], "Pending sanction");

    const metrics = [
      {
        id: "originalRequest",
        label: "Original requested amount",
        value: formatCompactCurrency(originalRequestedAmount),
        detail: "Captured during facility setup",
        icon: "request",
      },
      {
        id: "existingExposure",
        label: "Existing Gold Loan exposure",
        value: formatCompactCurrency(existingExposure),
        detail: "Existing outstanding exposure",
        icon: "exposure",
      },
      {
        id: "aggregateExposure",
        label: "Aggregate exposure",
        value: formatCompactCurrency(aggregateExposure),
        detail: "Borrower-level Gold Loan exposure",
        icon: "exposure",
      },
      {
        id: "maximumEligible",
        label: "Maximum eligible amount",
        value: formatCompactCurrency(maximumEligibleAmount),
        detail: textValue(controllingLimit, "Pending calculation"),
        icon: "eligible",
        featured: true,
      },
      {
        id: "requiredAmount",
        label: "Required loan amount",
        value: formatCompactCurrency(requiredAmount),
        detail: "Confirmed after appraisal",
        icon: "required",
      },
      {
        id: "recommendedAmount",
        label: "Recommended amount",
        value: formatCompactCurrency(recommendedAmount),
        detail: "Maker recommendation",
        icon: "recommendation",
      },
      {
        id: "netWeight",
        label: "Eligible net weight",
        value: formatWeight(totalNetWeight),
        detail: "Net weight used for eligibility",
        icon: "weight",
      },
      {
        id: "totalCharges",
        label: "Total charges",
        value: formatCompactCurrency(totalCharges),
        detail:
          [
            hasValue(processingCharge)
              ? `Processing ${formatCompactCurrency(processingCharge)}`
              : "",
            hasValue(appraiserCharge)
              ? `Appraiser ${formatCompactCurrency(appraiserCharge)}`
              : "",
            hasValue(gst) ? `GST ${formatCompactCurrency(gst)}` : "",
          ]
            .filter(Boolean)
            .join(" · ") || "Backend calculated",
        icon: "charge",
      },
    ];

    const snapshot = [
      {
        id: "customerKyc",
        label: "Customer & KYC",
        value: textValue(kycStatus),
        status: textValue(kycStatus),
        secondary: `${lead?.relationshipType || "ETB/NTB pending"} · Consent ${textValue(consentStatus).toLowerCase()}`,
        icon: "customer",
      },
      {
        id: "facility",
        label: "Facility & scheme",
        value: textValue(facility),
        status: completionStatus(scheme),
        secondary: textValue(scheme, "Scheme pending"),
        icon: "request",
      },
      {
        id: "branch",
        label: "Servicing branch",
        value: textValue(branch),
        status: completionStatus(branch, "Selected"),
        secondary: "Selected loan-servicing branch",
        icon: "branch",
      },
      {
        id: "assignment",
        label: "Workflow assignment",
        value: `Appraiser: ${assignedAppraiser}`,
        status:
          String(assignedAppraiser).toLowerCase().includes("pending") ||
          String(assignedChecker).toLowerCase().includes("pending")
            ? "Pending"
            : "Assigned",
        secondary: `Checker: ${assignedChecker}`,
        icon: "customer",
      },
      {
        id: "cibil",
        label: "CIBIL / CIC",
        value: textValue(cibilStatus),
        status: textValue(cibilStatus),
        secondary: cibilRequired === false
          ? "Not required for current amount"
          : hasValue(cibilScore)
            ? `Score ${cibilScore}${hasValue(minimumCibilScore) ? ` · Minimum ${minimumCibilScore}` : ""}`
            : cibilRequired === true
              ? "Mandatory check"
              : "Requirement pending",
        icon: "shield",
      },
      {
        id: "land",
        label: "Land & crop details",
        value: textValue(landStatus),
        status: textValue(landStatus),
        secondary:
          landRequired === false
            ? "Not required for current facility"
            : landRequired === true
              ? "Applicable to Agri facility"
              : "Requirement pending",
        icon: "shield",
      },
      {
        id: "nominee",
        label: "Nominee details",
        value: textValue(nomineeStatus),
        status: textValue(nomineeStatus),
        secondary: "CBS nominee or manually captured nominee",
        icon: "customer",
      },
      {
        id: "maker",
        label: "Maker recommendation",
        value: textValue(makerStatus),
        status: textValue(makerStatus),
        secondary: hasValue(recommendedAmount)
          ? `Recommended ${formatCurrency(recommendedAmount)}`
          : "Recommendation not submitted",
        icon: "recommendation",
      },
      {
        id: "checker",
        label: "Checker sanction",
        value: textValue(checkerStatus),
        status: textValue(checkerStatus),
        secondary: "Approve, reject or push back",
        icon: "shield",
      },
      {
        id: "documents",
        label: "Document execution",
        value: textValue(documentExecutionStatus),
        status: textValue(documentExecutionStatus),
        secondary: "NeSL e-sign or manual execution",
        icon: "request",
      },
      {
        id: "disbursement",
        label: "Disbursement",
        value: textValue(disbursementStatus),
        status: textValue(disbursementStatus),
        secondary: "TL credit or OD limit activation",
        icon: "eligible",
      },
    ];

    const exceptions = [];
    const addException = (condition, exception) => {
      if (condition) exceptions.push(exception);
    };

    const applicationStatus = String(applicationDetail.status || "").toLowerCase();
    const appraisalExplicitlyComplete = isCompleted(appraisalStatus);
    const appraisalIsPending =
      !appraisalExplicitlyComplete &&
      (applicationStatus.includes("appraisal") ||
        applicationStatus.includes("awaiting") ||
        applicationStatus.includes("in progress") ||
        items.length > completedItems);

    addException(appraisalIsPending, {
      id: "appraisalIncomplete",
      severity: "warning",
      title: "Jewellery appraisal is incomplete",
      description:
        items.length > 0
          ? `${completedItems} of ${items.length} jewellery items are complete.`
          : "The assigned Appraiser must assess the offered jewellery.",
      section: "Jewellery Appraisal",
    });
    addException(items.length > 0 && !photographsComplete, {
      id: "photographsMissing",
      severity: "warning",
      title: "Appraisal photographs are incomplete",
      description: "Every offered jewellery item requires traceable photographs.",
      section: "Jewellery Appraisal",
    });
    addException(isFailed(weightPolicyStatus), {
      id: "weightLimit",
      severity: "danger",
      title: "Borrower weight limit exceeded",
      description: textValue(weightPolicyStatus),
      section: "Jewellery Appraisal",
    });
    addException(
      appraisalExplicitlyComplete && toNumber(maximumEligibleAmount) === null,
      {
        id: "eligibilityIncomplete",
        severity: "warning",
        title: "Eligibility calculation is incomplete",
        description:
          "Appraisal is complete, but the maximum eligible amount is not available.",
        section: "Eligibility & Recommendation",
      },
    );

    const requiredNumber = toNumber(requiredAmount);
    const maximumNumber = toNumber(maximumEligibleAmount);
    const recommendedNumber = toNumber(recommendedAmount);
    addException(
      requiredNumber !== null &&
        maximumNumber !== null &&
        requiredNumber > maximumNumber,
      {
        id: "requiredExceedsEligibility",
        severity: "danger",
        title: "Required amount exceeds eligibility",
        description: `${formatCurrency(requiredNumber)} requested against ${formatCurrency(maximumNumber)} maximum eligibility.`,
        section: "Eligibility & Recommendation",
      },
    );
    addException(
      recommendedNumber !== null &&
        requiredNumber !== null &&
        recommendedNumber > requiredNumber,
      {
        id: "recommendationExceedsRequest",
        severity: "danger",
        title: "Recommended amount exceeds required amount",
        description: "The Maker recommendation must be reduced before submission.",
        section: "Eligibility & Recommendation",
      },
    );
    addException(cibilRequired === true && !isCompleted(cibilStatus), {
      id: "cibilIncomplete",
      severity: isFailed(cibilStatus) ? "danger" : "warning",
      title: isFailed(cibilStatus)
        ? "CIBIL check failed"
        : "Mandatory CIBIL check is incomplete",
      description: `Current CIBIL status: ${textValue(cibilStatus)}.`,
      section: "Compliance",
    });
    addException(
      toNumber(cibilScore) !== null &&
        toNumber(minimumCibilScore) !== null &&
        toNumber(cibilScore) < toNumber(minimumCibilScore),
      {
        id: "cibilBelowThreshold",
        severity: "danger",
        title: "CIBIL score is below the qualifying score",
        description: `Score ${cibilScore} against required minimum ${minimumCibilScore}.`,
        section: "Compliance",
      },
    );
    addException(landRequired === true && !isCompleted(landStatus), {
      id: "landIncomplete",
      severity: isFailed(landStatus) ? "danger" : "warning",
      title: "Land and crop details are incomplete",
      description: `Current verification status: ${textValue(landStatus)}.`,
      section: "Compliance",
    });

    const pushbackReason = selectValue(leadDetails, [
      "applicationDetail.pushback.reason",
      "applicationDetail.checkerDecision.pushback.reason",
      "applicationDetail.details.checkerDecision.pushback.reason",
    ]);
    const pushbackSection = selectValue(leadDetails, [
      "applicationDetail.pushback.section",
      "applicationDetail.checkerDecision.pushback.section",
      "applicationDetail.details.checkerDecision.pushback.section",
    ], "Application Details");
    addException(
      hasValue(pushbackReason) ||
        applicationStatus.includes("pushback") ||
        applicationStatus.includes("rework"),
      {
        id: "checkerPushback",
        severity: "warning",
        title: "Checker pushback requires resolution",
        description: pushbackReason || "Review the Checker observations and resubmit.",
        section: pushbackSection,
      },
    );

    const executionStatus = String(documentExecutionStatus).toLowerCase();
    const chargeStatus = selectValue(leadDetails, [
      "applicationDetail.documentationDisbursement.chargeDeduction.status",
      "applicationDetail.documentationDisbursement.chargeDeductionStatus",
    ]);
    const accountCreationStatus = selectValue(leadDetails, [
      "applicationDetail.documentationDisbursement.accountCreation.status",
      "applicationDetail.documentationDisbursement.accountCreationStatus",
    ]);
    addException(
      executionStatus.includes("failed") || executionStatus.includes("expired"),
      {
        id: "executionFailed",
        severity: "danger",
        title: executionStatus.includes("expired")
          ? "E-sign request has expired"
          : "Document execution failed",
        description: `Current execution status: ${documentExecutionStatus}.`,
        section: "Documentation & Disbursement",
      },
    );
    addException(isFailed(chargeStatus), {
      id: "chargesFailed",
      severity: "danger",
      title: "Charge deduction failed",
      description: "Resolve the CASA deduction failure before disbursement.",
      section: "Documentation & Disbursement",
    });
    addException(isFailed(accountCreationStatus), {
      id: "accountCreationFailed",
      severity: "danger",
      title: "CBS loan-account creation failed",
      description: "Review the CBS response and retry the account creation.",
      section: "Documentation & Disbursement",
    });
    addException(isFailed(disbursementStatus), {
      id: "disbursementFailed",
      severity: "danger",
      title: "Disbursement failed",
      description: "Review the CBS response before retrying the transaction.",
      section: "Documentation & Disbursement",
    });

    return {
      applicationDetail,
      focus: getPersonaFocus(persona, applicationDetail),
      metrics,
      snapshot,
      exceptions,
      jewellery: {
        totalItems: items.length,
        completedItems,
        totalGrossWeight,
        totalDeductions,
        totalNetWeight,
        photographsComplete,
        appraisalStatus,
        weightPolicyStatus,
        assignedAppraiser,
      },
      eligibility: {
        ibjaRate,
        schemeRate,
        applicableLtv,
        schemeLendingValue,
        availableExposureLimit,
        ltvBasedValue,
        maximumEligibleAmount,
        controllingLimit,
      },
      charges: {
        processingCharge,
        appraiserCharge,
        gst,
        totalCharges,
      },
    };
  }, [lead, leadDetails, persona]);

  const focusClass = `focus-${view.focus.section}`;

  return (
    <section
      className={`summary-tab ${focusClass}`}
      aria-labelledby="summary-tab-title"
    >
      <header className="summary-tab__heading">
        <div>
          <p className="summary-tab__eyebrow">APPLICATION OVERVIEW</p>
          <h2 id="summary-tab-title">Summary</h2>
          <p>
            A consolidated view of the application, appraisal, eligibility,
            compliance and fulfilment readiness.
          </p>
        </div>
        <div className="summary-tab__mode">
          <span>{normalizePersona(persona)}</span>
          <small>Read-only summary</small>
        </div>
      </header>

      <section className="summary-focus" aria-label="Persona focus">
        <span className="summary-focus__icon">
          <SummaryIcon
            type={view.focus.section === "jewellery" ? "jewellery" : "info"}
          />
        </span>
        <div>
          <p>{view.focus.eyebrow}</p>
          <h3>{view.focus.title}</h3>
          <span>{view.focus.description}</span>
        </div>
      </section>

      <section
        className="summary-section summary-financial-section"
        aria-labelledby="financial-overview-title"
      >
        <div className="summary-section__heading">
          <div>
            <p>FINANCIAL POSITION</p>
            <h3 id="financial-overview-title">Financial overview</h3>
          </div>
          <span>Amounts sourced from application data</span>
        </div>

        <div className="summary-metrics-grid">
          {view.metrics.map((metric) => (
            <article
              key={metric.id}
              className={`summary-metric ${metric.featured ? "is-featured" : ""}`}
            >
              <span className="summary-metric__icon">
                <SummaryIcon type={metric.icon} />
              </span>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <span title={metric.detail}>{metric.detail}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="summary-two-column">
        <section
          className="summary-section summary-jewellery-section"
          aria-labelledby="jewellery-summary-title"
        >
          <div className="summary-section__heading compact">
            <div>
              <p>COLLATERAL</p>
              <h3 id="jewellery-summary-title">Jewellery appraisal</h3>
            </div>
            <StatusBadge value={view.jewellery.appraisalStatus} />
          </div>

          <dl className="summary-stat-grid">
            <div>
              <dt>Jewellery items</dt>
              <dd>{view.jewellery.totalItems}</dd>
            </div>
            <div>
              <dt>Items completed</dt>
              <dd>
                {view.jewellery.completedItems}/{view.jewellery.totalItems}
              </dd>
            </div>
            <div>
              <dt>Total gross weight</dt>
              <dd>{formatWeight(view.jewellery.totalGrossWeight)}</dd>
            </div>
            <div>
              <dt>Total deductions</dt>
              <dd>{formatWeight(view.jewellery.totalDeductions)}</dd>
            </div>
            <div className="featured">
              <dt>Eligible net weight</dt>
              <dd>{formatWeight(view.jewellery.totalNetWeight)}</dd>
            </div>
            <div>
              <dt>Photographs</dt>
              <dd>
                {view.jewellery.totalItems === 0
                  ? "Pending"
                  : view.jewellery.photographsComplete
                    ? "Complete"
                    : "Incomplete"}
              </dd>
            </div>
          </dl>

          <div className="summary-inline-status">
            <span>
              <small>Appraiser</small>
              <strong>{view.jewellery.assignedAppraiser}</strong>
            </span>
            <span>
              <small>Weight policy</small>
              <StatusBadge value={view.jewellery.weightPolicyStatus} />
            </span>
          </div>
        </section>

        <section
          className="summary-section summary-eligibility-section"
          aria-labelledby="eligibility-summary-title"
        >
          <div className="summary-section__heading compact">
            <div>
              <p>BACKEND CALCULATION</p>
              <h3 id="eligibility-summary-title">Eligibility calculation</h3>
            </div>
            <span className="summary-control-limit">
              {textValue(view.eligibility.controllingLimit, "Pending")}
            </span>
          </div>

          <div className="summary-rate-strip">
            <span>
              <small>IBJA gold rate</small>
              <strong>{formatPerGram(view.eligibility.ibjaRate)}</strong>
            </span>
            <span>
              <small>Scheme lending rate</small>
              <strong>{formatPerGram(view.eligibility.schemeRate)}</strong>
            </span>
            <span>
              <small>Applicable LTV</small>
              <strong>{formatRate(view.eligibility.applicableLtv, "%")}</strong>
            </span>
          </div>

          <div className="summary-limit-list">
            <div>
              <span>A</span>
              <p>
                <small>Scheme lending value</small>
                <strong>
                  {formatCurrency(view.eligibility.schemeLendingValue)}
                </strong>
              </p>
            </div>
            <div>
              <span>B</span>
              <p>
                <small>Available exposure limit</small>
                <strong>
                  {formatCurrency(view.eligibility.availableExposureLimit)}
                </strong>
              </p>
            </div>
            <div>
              <span>C</span>
              <p>
                <small>LTV-based value</small>
                <strong>{formatCurrency(view.eligibility.ltvBasedValue)}</strong>
              </p>
            </div>
          </div>

          <div className="summary-maximum-eligible">
            <span>
              <small>Minimum of A, B and C</small>
              <strong>Maximum eligible amount</strong>
            </span>
            <b>{formatCurrency(view.eligibility.maximumEligibleAmount)}</b>
          </div>
        </section>
      </div>

      <section
        className="summary-section summary-snapshot-section"
        aria-labelledby="application-snapshot-title"
      >
        <div className="summary-section__heading">
          <div>
            <p>APPLICATION READINESS</p>
            <h3 id="application-snapshot-title">Application snapshot</h3>
          </div>
          <span>Same operational view for every persona</span>
        </div>

        <div className="summary-snapshot-grid">
          {view.snapshot.map((item) => (
            <article key={item.id} className="summary-snapshot-item">
              <span className="summary-snapshot-item__icon">
                <SummaryIcon type={item.icon} />
              </span>
              <div>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
                <span>{item.secondary}</span>
              </div>
              <StatusBadge value={item.status} />
            </article>
          ))}
        </div>
      </section>

      <section
        className="summary-section summary-exceptions-section"
        aria-labelledby="exceptions-title"
      >
        <div className="summary-section__heading">
          <div>
            <p>ATTENTION REQUIRED</p>
            <h3 id="exceptions-title">Exceptions and blockers</h3>
          </div>
          <span
            className={`summary-exception-count ${
              view.exceptions.length ? "has-exceptions" : "is-clear"
            }`}
          >
            {view.exceptions.length
              ? `${view.exceptions.length} active`
              : "No active blockers"}
          </span>
        </div>

        {view.exceptions.length ? (
          <div className="summary-exception-list">
            {view.exceptions.map((exception) => (
              <article
                key={exception.id}
                className={`summary-exception is-${exception.severity}`}
              >
                <span className="summary-exception__icon">
                  <SummaryIcon type="alert" />
                </span>
                <div>
                  <h4>{exception.title}</h4>
                  <p>{exception.description}</p>
                </div>
                <span className="summary-exception__section">
                  {exception.section}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="summary-clear-state">
            <span>
              <SummaryIcon type="eligible" />
            </span>
            <div>
              <h4>No active exceptions or workflow blockers</h4>
              <p>
                All currently applicable validations and workflow checks are in
                good standing.
              </p>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
