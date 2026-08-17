import { useEffect, useMemo, useRef, useState } from "react";
import "./FacilityBranchLoanDetailsPage.css";

const LEAD_DETAILS_API_BASE =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const LoanIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </svg>
);

const JewelleryIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
    <path d="m4 8 4-5h8l4 5-8 13Z" />
    <path d="M4 8h16M8 3l4 5 4-5M8 8l4 13 4-13" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 16V4m0 0L7 9m5-5 5 5" />
    <path d="M5 14v5h14v-5" />
  </svg>
);

const BRANCHES = [
  {
    code: "YESB0000123",
    name: "Pune - Deccan Gymkhana",
    address: "Bhandarkar Road, Deccan Gymkhana, Pune, Maharashtra 411004",
    pinCode: "411004",
    dpCode: "DP-0123",
  },
  {
    code: "YESB0000226",
    name: "Pune - Camp",
    address: "Moledina Road, Camp, Pune, Maharashtra 411001",
    pinCode: "411001",
    dpCode: "DP-0226",
  },
  {
    code: "YESB0000187",
    name: "Pune - Baner",
    address: "Baner Road, Pune, Maharashtra 411045",
    pinCode: "411045",
    dpCode: "DP-0187",
  },
  {
    code: "YESB0000418",
    name: "Pune - Hadapsar",
    address: "Solapur Road, Hadapsar, Pune, Maharashtra 411028",
    pinCode: "411028",
    dpCode: "DP-0418",
  },
  {
    code: "YESB0000472",
    name: "Pune - Magarpatta",
    address: "Magarpatta Road, Hadapsar, Pune, Maharashtra 411028",
    pinCode: "411028",
    dpCode: "DP-0472",
  },
  {
    code: "YESB0000314",
    name: "Mumbai - Andheri East",
    address: "Mahakali Caves Road, Mumbai, Maharashtra 400093",
    pinCode: "400093",
    dpCode: "DP-0314",
  },
];

const FACILITY_OPTIONS = {
  Retail: {
    label: "Retail Gold Loan",
    purposes: ["Marriage", "Medical", "Personal Needs", "Others"],
    schemes: [
      {
        name: "YES Gold Loan - Regular",
        loanType: "TL",
        tenureOptions: ["6 Months", "12 Months", "18 Months"],
        repaymentTypes: ["EMI", "Monthly interest, principal at maturity"],
      },
      {
        name: "YES Gold Loan - Bullet",
        loanType: "Bullet",
        tenureOptions: ["6 Months", "9 Months", "12 Months"],
      },
    ],
  },
  Agri: {
    label: "Agri Gold Loan",
    purposes: ["Land Development", "Cultivation Requirement"],
    schemes: [
      {
        name: "YES Agri Gold - Crop",
        loanType: "Bullet",
        tenureOptions: ["6 Months", "9 Months", "12 Months"],
      },
      {
        name: "YES Agri Gold - Development",
        loanType: "TL",
        tenureOptions: ["12 Months", "18 Months", "24 Months"],
        repaymentTypes: ["EMI", "Monthly interest, principal at maturity"],
      },
    ],
  },
};

const JEWELLERY_TYPES = [
  "Gold Necklace",
  "Gold Chain",
  "Gold Bangles",
  "Gold Earrings",
  "Gold Ring",
  "Gold Coin",
  "Other Gold Ornament",
];

const LENDING_RATES_PER_GRAM = Object.freeze({
  24: 15528,
  22: 14224,
  18: 11646,
});

const getLendingRateForQuality = (qualityFinenessK) =>
  LENDING_RATES_PER_GRAM[Number(qualityFinenessK)] || "";

const formatLendingRate = (rate) =>
  rate ? `₹${Number(rate).toLocaleString("en-IN")}/g` : "Select quality";

const createJewelleryItem = (sequence = 1) => ({
  id: `JWL-${Date.now()}-${sequence}`,
  serialNumber: sequence,
  jewelleryType: "Gold Necklace",
  numberOfItems: 1,
  qualityFinenessK: 22,
  newWeightGrams: "",
  lendingRatePerGram: getLendingRateForQuality(22),
  jewelleryDefects: "",
  ownershipProof: null,
});

const normalizeJewelleryItem = (item, index) => {
  const qualityFinenessK = item?.qualityFinenessK
    ? Number(item.qualityFinenessK)
    : "";

  return {
    id: item?.id || `JWL-${Date.now()}-${index + 1}`,
    serialNumber: index + 1,
    jewelleryType: item?.jewelleryType || item?.description || "Gold Necklace",
    numberOfItems: Number(item?.numberOfItems || 1),
    qualityFinenessK,
    newWeightGrams: item?.newWeightGrams ?? "",
    lendingRatePerGram: getLendingRateForQuality(qualityFinenessK),
    jewelleryDefects: item?.jewelleryDefects || item?.remarks || "",
    ownershipProof: item?.ownershipProof || null,
  };
};

const isItemComplete = (item) =>
  Boolean(
    item.jewelleryType &&
      Number(item.numberOfItems) > 0 &&
      item.ownershipProof?.name &&
      item.ownershipProof?.dataUrl
  );

const parseLeadDetails = (leadDetails) => {
  if (!leadDetails) return {};
  if (typeof leadDetails === "object") return leadDetails;

  try {
    return JSON.parse(leadDetails);
  } catch {
    return {};
  }
};

const normalizeBranch = (branch, fallback) => ({
  code: branch?.code || fallback.code,
  name: branch?.name || fallback.name,
  address: branch?.address || fallback.address,
  pinCode: branch?.pinCode || fallback.pinCode,
  dpCode: branch?.dpCode || fallback.dpCode,
});

const getStoredStepNode = (lead, stepData, sectionKey) => {
  const leadDetails = parseLeadDetails(lead?.leadDetails ?? lead?.lead_details);
  return leadDetails?.[sectionKey] || stepData?.[sectionKey] || stepData || {};
};

const buildInitialForm = ({ lead, stepData, sectionKey, homeBranch }) => {
  const stored = getStoredStepNode(lead, stepData, sectionKey);
  const storedBranch = stored.branchSelection || {};
  const storedLoan = stored.productFacilityAndScheme || {};

  const productType = storedLoan.productType || stored.facilityType || "Retail";
  const facility = FACILITY_OPTIONS[productType] || FACILITY_OPTIONS.Retail;
  const schemeName =
    storedLoan.schemeName || stored.schemeName || facility.schemes[0].name;
  const scheme =
    facility.schemes.find((item) => item.name === schemeName) ||
    facility.schemes[0];

  const branchType = storedBranch.type || stored.branchType || "Home";
  const storedSelectedBranch =
    storedBranch.selectedBranch || stored.selectedBranch || null;

  const storedItems = Array.isArray(stored.jewelleryItems) && stored.jewelleryItems.length > 0
    ? stored.jewelleryItems.map(normalizeJewelleryItem)
    : [createJewelleryItem(1)];

  return {
    branchType,
    pinCode:
      branchType === "Other"
        ? storedBranch.pinCode || stored.pinCode || ""
        : homeBranch.pinCode,
    selectedBranchCode:
      branchType === "Home"
        ? homeBranch.code
        : storedBranch.selectedBranchCode ||
          stored.selectedBranchCode ||
          storedSelectedBranch?.code ||
          "",
    productType,
    schemeName: scheme.name,
    purpose: storedLoan.purpose || stored.purpose || facility.purposes[0],
    requestedLoanAmount: Number(
      storedLoan.requestedLoanAmount ?? stored.requestedLoanAmount ?? 0
    ),
    tenure: storedLoan.tenure || stored.tenure || scheme.tenureOptions[0] || "",
    repaymentType:
      scheme.loanType === "TL"
        ? storedLoan.repaymentType ||
          stored.repaymentType ||
          scheme.repaymentTypes?.[0] ||
          ""
        : "",
    jewelleryItems: storedItems,
  };
};

function SectionHeading({ icon, eyebrow, title, description, badge }) {
  return (
    <div className="fbl-section-heading">
      <span className="fbl-section-icon">{icon}</span>
      <div>
        <span className="fbl-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {badge}
    </div>
  );
}

function FacilityBranchLoanDetailsPage({
  lead = {},
  setLead,
  stepData = {},
  sectionKey = "facilityBranchLoanDetails",
  stepId = "facility-branch-loan",
  updateApplicationData,
  updateStepStatus,
}) {
  const leadIdentity =
    lead.id || lead.leadNumber || lead.leadnumber || "unresolved-lead";
  const fallbackHomeBranch = normalizeBranch(lead.homeBranch, BRANCHES[0]);

  const [form, setForm] = useState(() =>
    buildInitialForm({
      lead,
      stepData,
      sectionKey,
      homeBranch: fallbackHomeBranch,
    })
  );
  const [uploadErrors, setUploadErrors] = useState({});
  const hydratedLeadRef = useRef(leadIdentity);
  const latestLeadRef = useRef(lead);
  const lastPersistedNodeRef = useRef("");
  const persistQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    latestLeadRef.current = lead;
  }, [lead]);

  useEffect(() => {
    if (hydratedLeadRef.current === leadIdentity) return;

    lastPersistedNodeRef.current = "";
    setForm(
      buildInitialForm({
        lead,
        stepData,
        sectionKey,
        homeBranch: normalizeBranch(lead.homeBranch, BRANCHES[0]),
      })
    );
    hydratedLeadRef.current = leadIdentity;
  }, [lead, leadIdentity, sectionKey, stepData]);

  const homeBranch = useMemo(
    () => normalizeBranch(lead.homeBranch, BRANCHES[0]),
    [lead.homeBranch]
  );

  const availableBranches = useMemo(
    () =>
      form.pinCode.length === 6
        ? BRANCHES.filter((branch) => branch.pinCode === form.pinCode)
        : [],
    [form.pinCode]
  );

  const selectedBranch = useMemo(() => {
    if (form.branchType === "Home") return homeBranch;
    return (
      availableBranches.find(
        (branch) => branch.code === form.selectedBranchCode
      ) || null
    );
  }, [availableBranches, form.branchType, form.selectedBranchCode, homeBranch]);

  const facility = FACILITY_OPTIONS[form.productType] || FACILITY_OPTIONS.Retail;
  const selectedScheme =
    facility.schemes.find((scheme) => scheme.name === form.schemeName) ||
    facility.schemes[0];
  const isTermLoan = selectedScheme?.loanType === "TL";

  const existingOutstanding = 0;
  const requestedLoanAmount = Number(form.requestedLoanAmount || 0);
  const aggregateLoanAmount = existingOutstanding + requestedLoanAmount;
  const relationshipType = lead?.relationship?.type || lead?.customerIdentity?.type || "";
  const isNTB = relationshipType === "NTB" || leadIdentity.startsWith("LD-");
  const cibilRequired = isNTB ? true : requestedLoanAmount > 100000;
  const landDetailsRequired =
    form.productType === "Agri" && aggregateLoanAmount >= 100000;

  const branchComplete = Boolean(
    selectedBranch?.code &&
      (form.branchType === "Home" || form.pinCode.length === 6)
  );

  const jewelleryComplete =
    form.jewelleryItems.length > 0 &&
    form.jewelleryItems.every(isItemComplete);

  const stepComplete = Boolean(
    branchComplete &&
      form.productType &&
      selectedScheme?.name &&
      form.purpose &&
      requestedLoanAmount > 0 &&
      form.tenure &&
      (!isTermLoan || form.repaymentType) &&
      jewelleryComplete
  );

  const stepNode = useMemo(
    () => ({
      schemaVersion: 2,
      branchSelection: {
        type: form.branchType,
        pinCode:
          form.branchType === "Other" ? form.pinCode : homeBranch.pinCode,
        selectedBranchCode: selectedBranch?.code || "",
        selectedBranch: selectedBranch
          ? {
              code: selectedBranch.code,
              name: selectedBranch.name,
              address: selectedBranch.address,
              pinCode: selectedBranch.pinCode,
              dpCode: selectedBranch.dpCode,
            }
          : null,
      },
      productFacilityAndScheme: {
        productType: form.productType,
        productLabel: facility.label,
        schemeName: selectedScheme?.name || "",
        purpose: form.purpose,
        requestedLoanAmount,
        tenure: form.tenure,
        loanType: selectedScheme?.loanType || "",
        repaymentType: isTermLoan ? form.repaymentType : "",
      },
      jewelleryItems: form.jewelleryItems,
      existingGoldLoans: [],
      exposure: {
        existingOutstandingAmount: existingOutstanding,
        requestedLoanAmount,
        aggregateLoanAmount,
        cibilRequired,
        landDetailsRequired,
      },
      stepMeta: {
        status: stepComplete ? "Completed" : "In Progress",
        isComplete: stepComplete,
      },
    }),
    [
      aggregateLoanAmount,
      cibilRequired,
      existingOutstanding,
      facility.label,
      form,
      homeBranch.pinCode,
      landDetailsRequired,
      requestedLoanAmount,
      selectedBranch,
      selectedScheme,
      isTermLoan,
      stepComplete,
    ]
  );

  const serializedStepNode = JSON.stringify(stepNode);

  useEffect(() => {
    if (leadIdentity === "unresolved-lead") return;
    if (lastPersistedNodeRef.current === serializedStepNode) return;

    lastPersistedNodeRef.current = serializedStepNode;

    setLead?.((currentLead) => {
      const sourceLead = currentLead || latestLeadRef.current || {};
      const currentLeadDetails = parseLeadDetails(
        sourceLead.leadDetails ?? sourceLead.lead_details
      );
      const mergedLeadDetails = {
        ...currentLeadDetails,
        [sectionKey]: stepNode,
      };
      const nextLead = {
        ...sourceLead,
        leadDetails: mergedLeadDetails,
      };

      if (Object.prototype.hasOwnProperty.call(sourceLead, "lead_details")) {
        nextLead.lead_details = mergedLeadDetails;
      }

      latestLeadRef.current = nextLead;
      return nextLead;
    });

    updateApplicationData?.(sectionKey, stepNode);
    updateStepStatus?.(stepId, stepNode.stepMeta.status);

    const leadDetailsPatch = {
      [sectionKey]: stepNode,
    };

    persistQueueRef.current = persistQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        const response = await fetch(
          `${LEAD_DETAILS_API_BASE}/${encodeURIComponent(leadIdentity)}/details`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leadId: leadIdentity,
              leadDetailsPatch,
            }),
          }
        );
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message ||
              `Unable to save lead details (${response.status}).`
          );
        }

        return result;
      })
      .catch((error) => {
        console.error("Failed to persist lead details:", error);
      });
  }, [
    leadIdentity,
    sectionKey,
    serializedStepNode,
    setLead,
    stepId,
    stepNode,
    updateApplicationData,
    updateStepStatus,
  ]);

  const handleCombinedConfigChange = (event) => {
    const value = event.target.value;
    if (!value || value === "||") return;

    const [productType, schemeName, purpose] = value.split("|");
    const targetFacility = FACILITY_OPTIONS[productType] || FACILITY_OPTIONS.Retail;
    const targetScheme =
      targetFacility.schemes.find((scheme) => scheme.name === schemeName) ||
      targetFacility.schemes[0];

    setForm((current) => ({
      ...current,
      productType,
      schemeName: targetScheme.name,
      purpose,
      tenure: targetScheme.tenureOptions[0] || "",
      repaymentType:
        targetScheme.loanType === "TL"
          ? targetScheme.repaymentTypes?.[0] || ""
          : "",
    }));
  };

  /* Jewellery Items Handlers */
  const addJewelleryItem = () => {
    setForm((current) => ({
      ...current,
      jewelleryItems: [
        ...current.jewelleryItems,
        createJewelleryItem(current.jewelleryItems.length + 1),
      ],
    }));
  };

  const removeJewelleryItem = (id) => {
    if (form.jewelleryItems.length === 1) return;
    setForm((current) => ({
      ...current,
      jewelleryItems: current.jewelleryItems
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, serialNumber: index + 1 })),
    }));
  };

  const updateJewelleryItem = (id, field, value) => {
    setForm((current) => ({
      ...current,
      jewelleryItems: current.jewelleryItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateJewelleryQuality = (id, value) => {
    const qualityFinenessK = value ? Number(value) : "";
    setForm((current) => ({
      ...current,
      jewelleryItems: current.jewelleryItems.map((item) =>
        item.id === id
          ? {
              ...item,
              qualityFinenessK,
              lendingRatePerGram: getLendingRateForQuality(qualityFinenessK),
            }
          : item
      ),
    }));
  };

  const handleOwnershipProofUpload = (id, file) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors((current) => ({
        ...current,
        [id]: "Upload a PDF, JPG or PNG file.",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadErrors((current) => ({
        ...current,
        [id]: "File size must be 2 MB or less.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateJewelleryItem(id, "ownershipProof", {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result,
        uploadedAt: new Date().toISOString(),
      });
      setUploadErrors((current) => ({ ...current, [id]: "" }));
    };
    reader.onerror = () => {
      setUploadErrors((current) => ({
        ...current,
        [id]: "The file could not be read. Please try again.",
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fbl-page">
      <section className="fbl-section fbl-card">
        <SectionHeading
          icon={<LoanIcon />}
          eyebrow="01 · PRODUCT, FACILITY & SCHEME"
          title="Configure the requested Gold Loan"
          description="The selected product controls the available schemes and permitted loan purpose."
          badge={<span className="fbl-badge gold">Gold Loan</span>}
        />

        <div className="fbl-form-grid">
          <label>
            <span>Product, Scheme & Purpose *</span>
            <select
              value={
                form.productType && form.schemeName && form.purpose
                  ? `${form.productType}|${form.schemeName}|${form.purpose}`
                  : "||"
              }
              onChange={handleCombinedConfigChange}
            >
              <option value="||">Select Configuration</option>

              {Object.entries(FACILITY_OPTIONS).map(([productKey, facilityConfig]) => (
                <optgroup label={facilityConfig.label} key={productKey}>
                  {facilityConfig.schemes.flatMap((scheme) =>
                    facilityConfig.purposes.map((purpose) => (
                      <option
                        value={`${productKey}|${scheme.name}|${purpose}`}
                        key={`${productKey}-${scheme.name}-${purpose}`}
                      >
                        {facilityConfig.label} - {scheme.name} ({purpose})
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
          </label>
          <label>
            <span>Requested loan amount *</span>
            <input
              type="number"
              min="10000"
              step="1000"
              value={form.requestedLoanAmount || ""}
              placeholder="Enter requested amount"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  requestedLoanAmount: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            <span>Tenure *</span>
            {selectedScheme.tenureOptions.length === 1 ? (
              <>
                <input value={form.tenure} readOnly />
                <small>Auto-populated for the selected scheme</small>
              </>
            ) : (
              <select
                value={form.tenure}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tenure: event.target.value,
                  }))
                }
              >
                {selectedScheme.tenureOptions.map((tenure) => (
                  <option value={tenure} key={tenure}>
                    {tenure}
                  </option>
                ))}
              </select>
            )}
          </label>
          {isTermLoan && (
            <label>
              <span>Repayment type *</span>
              <select
                value={form.repaymentType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    repaymentType: event.target.value,
                  }))
                }
              >
                <option value="">Select repayment type</option>
                {selectedScheme.repaymentTypes.map((repaymentType) => (
                  <option value={repaymentType} key={repaymentType}>
                    {repaymentType}
                  </option>
                ))}
              </select>
              <small>Required only for TL loans</small>
            </label>
          )}
        </div>

        <div className="fbl-selection-note">
          <span><CheckIcon /></span>
          <div>
            <strong>{selectedScheme.name}</strong>
            <p>
              {facility.label} · {form.tenure}
              {isTermLoan && form.repaymentType ? ` · ${form.repaymentType}` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* NEW JEWELLERY OFFERED SECTION */}
      <section className="fbl-section fbl-card">
        <SectionHeading
          icon={<JewelleryIcon />}
          eyebrow="02 · JEWELLERY OFFERED"
          title="Record the jewellery items presented"
          description="Capture the jewellery type, quantity, fineness, weight, lending rate and any observed defects."
          badge={
            <button className="jds-add-button" type="button" onClick={addJewelleryItem}>
              <PlusIcon /> Add ornament
            </button>
          }
        />

        <div className="jds-items">
          {form.jewelleryItems.map((item, index) => (
            <div className={`jds-item ${isItemComplete(item) ? "complete" : ""}`} key={item.id}>
              <div className="jds-item-number">
                <span>ITEM</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className="jds-item-fields">
                <label>
                  <span>Jewellery Type *</span>
                  <select
                    value={item.jewelleryType}
                    onChange={(event) => updateJewelleryItem(item.id, "jewelleryType", event.target.value)}
                  >
                    {JEWELLERY_TYPES.map((jewelleryType) => (
                      <option value={jewelleryType} key={jewelleryType}>{jewelleryType}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>No. of Items *</span>
                  <input
                    type="number"
                    min="1"
                    value={item.numberOfItems}
                    onChange={(event) => updateJewelleryItem(item.id, "numberOfItems", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Quality/Fineness (K)</span>
                  <select
                    value={item.qualityFinenessK}
                    onChange={(event) => updateJewelleryQuality(item.id, event.target.value)}
                  >
                    <option value="">Select quality (optional)</option>
                    <option value={24}>24K (999)</option>
                    <option value={22}>22K (916)</option>
                    <option value={18}>18K (750)</option>
                  </select>
                </label>
                <label>
                  <span>New Weight (grams)</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.newWeightGrams}
                    placeholder="e.g. 42.50"
                    onChange={(event) => updateJewelleryItem(item.id, "newWeightGrams", event.target.value)}
                  />
                </label>
                <label>
                  <span>Lending Rate per Gram</span>
                  <input
                    type="text"
                    value={formatLendingRate(item.lendingRatePerGram)}
                    readOnly
                    aria-readonly="true"
                  />
                  <small>Auto-populated from quality/fineness</small>
                </label>
                <label className="jds-defects-field">
                  <span>Jewellery Defects, if any</span>
                  <input
                    value={item.jewelleryDefects}
                    placeholder="Enter defects or leave blank"
                    onChange={(event) => updateJewelleryItem(item.id, "jewelleryDefects", event.target.value)}
                  />
                </label>
                <div className="jds-proof-field">
                  <span>Proof of ownership *</span>
                  <label className={`jds-upload ${item.ownershipProof ? "uploaded" : ""}`}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={(event) =>
                        handleOwnershipProofUpload(item.id, event.target.files?.[0])
                      }
                    />
                    <UploadIcon />
                    <span>
                      {item.ownershipProof?.name || "Upload invoice or ownership proof"}
                    </span>
                    <strong>{item.ownershipProof ? "Replace" : "Choose file"}</strong>
                  </label>
                  <small>PDF, JPG or PNG · Maximum 2 MB</small>
                  {uploadErrors[item.id] && (
                    <small className="jds-upload-error" role="alert">
                      {uploadErrors[item.id]}
                    </small>
                  )}
                </div>
              </div>
              <button
                className="jds-remove-button"
                type="button"
                onClick={() => removeJewelleryItem(item.id)}
                disabled={form.jewelleryItems.length === 1}
                aria-label={`Remove jewellery item ${index + 1}`}
              >
                <TrashIcon />
              </button>
              {isItemComplete(item) && <span className="jds-item-complete"><CheckIcon /> Complete</span>}
            </div>
          ))}
        </div>
      </section>

      <div className={`fbl-readiness ${stepComplete ? "ready" : "pending"}`}>
        <span>{stepComplete ? <CheckIcon /> : "!"}</span>
        <div>
          <strong>
            {stepComplete
              ? "Facility, branch, loan and jewellery details are complete"
              : "Complete the mandatory Step 2 details"}
          </strong>
          <p>
            {stepComplete
              ? `${cibilRequired ? "CIBIL is required" : "CIBIL is not required"}; ${
                  landDetailsRequired
                    ? "Agri land details are required"
                    : "land details are not required"
                } in Step 3.`
              : `Select scheme, purpose, amount and tenure${
                  isTermLoan ? ", choose a repayment type" : ""
                }, then add each ornament and upload its ownership proof.`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FacilityBranchLoanDetailsPage;
